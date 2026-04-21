import type { Ref } from "vue";
import type { Incident } from "../../shared/types/incidents";

export type IncidentSortOrder = "recent" | "oldest";
export type IncidentViewMode = "map" | "list";

export function useIncidentExplorer(allIncidents: Ref<Incident[]>) {
  const currentView = ref<IncidentViewMode>("list");
  const selectedCategory = ref<string>("all");
  const sortOrder = ref<IncidentSortOrder>("recent");
  const selectedIncidentId = ref<string | null>(null);

  const categoryOptions = computed(() => {
    const categories = new Set<string>();

    for (const incident of allIncidents.value) {
      for (const category of incident.categories) {
        if (category?.trim()) {
          categories.add(category);
        }
      }
    }

    return [
      "all",
      ...Array.from(categories).sort((a, b) => a.localeCompare(b)),
    ];
  });

  const filteredIncidents = computed(() => {
    if (selectedCategory.value === "all") {
      return allIncidents.value;
    }

    return allIncidents.value.filter((incident) =>
      incident.categories.includes(selectedCategory.value),
    );
  });

  const sortedIncidents = computed(() => {
    return [...filteredIncidents.value].sort((a, b) => {
      const aTime = a.mostRecentDate ? new Date(a.mostRecentDate).getTime() : 0;
      const bTime = b.mostRecentDate ? new Date(b.mostRecentDate).getTime() : 0;

      return sortOrder.value === "oldest" ? aTime - bTime : bTime - aTime;
    });
  });

  const selectedIncident = computed(() => {
    if (!selectedIncidentId.value) return null;
    return (
      allIncidents.value.find(
        (incident) => incident.id === selectedIncidentId.value,
      ) ?? null
    );
  });

  function selectIncident(id: string) {
    selectedIncidentId.value = id;
  }

  function clearSelectedIncident() {
    selectedIncidentId.value = null;
  }

  return {
    currentView,
    selectedCategory,
    sortOrder,
    selectedIncidentId,
    selectedIncident,
    categoryOptions,
    filteredIncidents,
    sortedIncidents,
    selectIncident,
    clearSelectedIncident,
  };
}
