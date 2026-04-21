import mockData from "../data/eonet-mock.json";
import type {
  EonetEvent,
  EonetEventsResponse,
  Incident,
} from "../../shared/types/incidents";

type EonetApiMessage = {
  message?: string;
  retry_after?: number;
};

function isEonetEventsResponse(value: unknown): value is EonetEventsResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "events" in value &&
    Array.isArray((value as { events?: unknown }).events)
  );
}

function isEonetApiMessage(value: unknown): value is EonetApiMessage {
  return typeof value === "object" && value !== null && "message" in value;
}

function getMostRecentDate(geometry: EonetEvent["geometry"]): string | null {
  if (!geometry?.length) return null;

  const validDates = geometry
    .map((item) => item.date)
    .filter((date): date is string => Boolean(date))
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  return validDates[0] ?? null;
}

function normalizeEvent(event: EonetEvent, index: number): Incident {
  return {
    id: event.id || `event-${index}`,
    title: event.title?.trim() || "Untitled incident",
    categories:
      event.categories
        ?.map((category) => category.title || "Unknown")
        .filter(Boolean) ?? [],
    sources: event.sources ?? [],
    geometry: event.geometry ?? [],
    mostRecentDate: getMostRecentDate(event.geometry),
  };
}

function normalizeEvents(response?: EonetEventsResponse | null): Incident[] {
  if (!response || !Array.isArray(response.events)) return [];
  return response.events.map((event, index) => normalizeEvent(event, index));
}

export function useEonetEvents() {
  const isUsingMock = ref(false);
  const liveAvailable = ref(false);

  const liveResponse = ref<EonetEventsResponse | null>(null);
  const liveApiMessage = ref<EonetApiMessage | null>(null);
  const liveErrorMessage = ref("");

  const isLoading = ref(false);
  const hasLoadedLive = ref(false);

  const liveIncidents = computed<Incident[]>(() => {
    return normalizeEvents(liveResponse.value);
  });

  const incidents = computed<Incident[]>(() => {
    if (isUsingMock.value) {
      return normalizeEvents(mockData as EonetEventsResponse);
    }

    return liveIncidents.value;
  });

  const isError = computed(() => {
    return (
      !isUsingMock.value &&
      !isLoading.value &&
      hasLoadedLive.value &&
      (!!liveApiMessage.value?.message || !!liveErrorMessage.value)
    );
  });

  const isEmpty = computed(() => {
    return (
      !isUsingMock.value &&
      !isLoading.value &&
      hasLoadedLive.value &&
      !isError.value &&
      incidents.value.length === 0
    );
  });

  const errorMessage = computed(() => {
    if (liveApiMessage.value?.message) {
      return liveApiMessage.value.message;
    }

    if (liveErrorMessage.value) {
      return liveErrorMessage.value;
    }

    return "Could not load incidents.";
  });

  async function fetchLiveData() {
    isLoading.value = true;
    liveErrorMessage.value = "";
    liveApiMessage.value = null;
    liveAvailable.value = false;
    liveResponse.value = null;

    try {
      const response = await fetch(
        "https://eonet.gsfc.nasa.gov/api/v3/events?limit=100&status=all",
      );

      const json = await response.json();

      console.log("RAW RESPONSE:", json);
      console.log("RESPONSE OK:", response.ok);
      console.log("HAS EVENTS ARRAY:", Array.isArray(json?.events));
      console.log(
        "EVENTS LENGTH:",
        Array.isArray(json?.events) ? json.events.length : "no events",
      );

      hasLoadedLive.value = true;

      if (!response.ok) {
        if (isEonetApiMessage(json)) {
          liveApiMessage.value = json;
        } else {
          liveErrorMessage.value = "Could not load incidents.";
        }
        return;
      }

      if (!isEonetEventsResponse(json)) {
        liveErrorMessage.value =
          "Live API returned an unexpected response shape.";
        return;
      }

      liveResponse.value = json;
      liveAvailable.value = (json.events ?? []).length > 0;
    } catch (err) {
      hasLoadedLive.value = true;
      liveResponse.value = null;

      const message =
        err instanceof Error ? err.message : "Could not load incidents.";

      if (message.toLowerCase().includes("503")) {
        liveErrorMessage.value =
          "NASA EONET is temporarily unavailable due to high demand. Please try again.";
      } else {
        liveErrorMessage.value = message;
      }
    } finally {
      isLoading.value = false;
    }
  }

  async function retryLiveData() {
    isUsingMock.value = false;
    await fetchLiveData();
  }

  function useMockData() {
    isUsingMock.value = true;
  }

  async function checkLiveAvailability() {
    await fetchLiveData();
  }

  async function switchToLiveData() {
    isUsingMock.value = false;
    await fetchLiveData();
  }

  watchEffect(() => {
    console.log("LIVE RESPONSE REF:", liveResponse.value);
    console.log("LIVE INCIDENTS:", liveIncidents.value.length);
    console.log("INCIDENTS:", incidents.value.length);
    console.log("IS ERROR:", isError.value);
    console.log("IS EMPTY:", isEmpty.value);
    console.log("IS USING MOCK:", isUsingMock.value);
  });

  onMounted(async () => {
    await fetchLiveData();
  });

  return {
    incidents,
    isLoading,
    isError,
    isEmpty,
    errorMessage,
    isUsingMock,
    liveAvailable,
    retryLiveData,
    useMockData,
    checkLiveAvailability,
    switchToLiveData,
  };
}
