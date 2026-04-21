import mockData from "../data/eonet-mock.json";
import type {
  EonetEvent,
  EonetEventsResponse,
  Incident,
} from "../../shared/types/incidents";

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

function normalizeEvents(
  response: EonetEventsResponse | null | undefined,
): Incident[] {
  const events = response?.events ?? [];
  return events.map(normalizeEvent);
}

export function useEonetEvents() {
  const isUsingMock = ref(false);
  const liveAvailable = ref(false);

  const { data, status, error, refresh, execute } =
    useFetch<EonetEventsResponse>(
      "https://eonet.gsfc.nasa.gov/api/v3/events?limit=100&status=all",
      {
        key: "eonet-events",
        server: false,
        immediate: true,
        default: () => undefined,
      },
    );

  const liveIncidents = computed<Incident[]>(() => {
    return normalizeEvents(data.value);
  });

  const incidents = computed<Incident[]>(() => {
    if (isUsingMock.value) {
      return normalizeEvents(mockData as EonetEventsResponse);
    }

    return liveIncidents.value;
  });

  const isLoading = computed(
    () => !isUsingMock.value && status.value === "pending",
  );
  const isError = computed(() => {
    return (
      !isUsingMock.value && (status.value === "error" || hasApiMessage.value)
    );
  });
  const isEmpty = computed(() => {
    return (
      !isUsingMock.value &&
      status.value === "success" &&
      incidents.value.length === 0
    );
  });
  const errorMessage = computed(() => {
    const raw = data.value as { message?: string } | undefined;

    if (raw?.message) {
      return raw.message;
    }

    if (!error.value) return "Could not load incidents.";

    const message = error.value.message || "Could not load incidents.";

    if (message.toLowerCase().includes("503")) {
      return "NASA EONET is temporarily unavailable due to high demand. Please try again.";
    }

    return message;
  });

  async function retryLiveData() {
    isUsingMock.value = false;
    liveAvailable.value = false;
    await refresh();
  }

  const hasApiMessage = computed(() => {
    const raw = data.value as { message?: string } | undefined;
    return Boolean(raw?.message);
  });

  function useMockData() {
    isUsingMock.value = true;
  }

  async function checkLiveAvailability() {
    try {
      await execute();

      if (status.value === "success" && liveIncidents.value.length > 0) {
        liveAvailable.value = true;
      }
    } catch {
      liveAvailable.value = false;
    }
  }

  async function switchToLiveData() {
    isUsingMock.value = false;
    liveAvailable.value = false;
    await refresh();
  }

  watchEffect(() => {
    if (
      !isUsingMock.value &&
      status.value === "success" &&
      liveIncidents.value.length > 0
    ) {
      liveAvailable.value = true;
    }
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
