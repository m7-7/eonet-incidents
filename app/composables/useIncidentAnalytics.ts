import type { ComputedRef } from "vue";
import type { Incident } from "../../types/incidents";

type ClickCounts = Record<string, number>;

const STORAGE_KEY = "eonet-incident-click-counts";

export function useIncidentAnalytics(incidents: ComputedRef<Incident[]>) {
  const clickCounts = ref<ClickCounts>({});

  function loadClickCounts() {
    if (!import.meta.client) return;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      clickCounts.value = raw ? JSON.parse(raw) : {};
    } catch {
      clickCounts.value = {};
    }
  }

  function saveClickCounts() {
    if (!import.meta.client) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clickCounts.value));
  }

  function trackIncidentClick(incidentId: string) {
    clickCounts.value[incidentId] = (clickCounts.value[incidentId] || 0) + 1;
    saveClickCounts();
  }

  function resetAnalytics() {
    clickCounts.value = {};
    saveClickCounts();
  }

  const topClickedIncidents = computed(() => {
    return Object.entries(clickCounts.value)
      .map(([incidentId, count]) => {
        const incident = incidents.value.find((item) => item.id === incidentId);

        return {
          incidentId,
          count,
          title: incident?.title || "Unknown incident",
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  });

  onMounted(() => {
    loadClickCounts();
  });

  return {
    clickCounts,
    topClickedIncidents,
    trackIncidentClick,
    resetAnalytics,
  };
}
