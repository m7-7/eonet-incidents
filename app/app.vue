<script setup lang="ts">
import { useEonetEvents } from '~/composables/useEonetEvents'
import { useIncidentExplorer } from '~/composables/useIncidentExplorer'
import IncidentMap from '~/components/incidents/IncidentMap.vue'
import IncidentList from '~/components/incidents/IncidentList.vue'
import DataSourceBanner from '~/components/explorer/DataSourceBanner.vue'
import ExplorerToolbar from '~/components/explorer/ExplorerToolbar.vue'
import IncidentDetailModal from '~/components/incidents/IncidentDetailModal.vue'
import { useIncidentAnalytics } from '~/composables/useIncidentAnalytics'
import AnalyticsPanel from '~/components/analytics/AnalyticsPanel.vue'

const {
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
} = useEonetEvents()

const {
  currentView,
  selectedCategory,
  sortOrder,
  selectedIncidentId,
  selectedIncident,
  categoryOptions,
  sortedIncidents,
  selectIncident,
  clearSelectedIncident,
} = useIncidentExplorer(incidents)

const {
  topClickedIncidents,
  trackIncidentClick,
  resetAnalytics,
} = useIncidentAnalytics(incidents)


function handleIncidentSelect(incidentId: string) {
  trackIncidentClick(incidentId)
  selectIncident(incidentId)
}

watch(isUsingMock, () => {
  resetAnalytics()
})

watch(isError, (value) => {
  if (value) {
    resetAnalytics()
  }
})

async function handleRetryLiveData() {
  resetAnalytics()
  await retryLiveData()
}

function handleUseMockData() {
  resetAnalytics()
  useMockData()
}

async function handleCheckLiveAvailability() {
  await checkLiveAvailability()
}

async function handleSwitchToLiveData() {
  resetAnalytics()
  await switchToLiveData()
}
</script>

<template>
  <main class="min-h-screen bg-slate-50 text-slate-900">
    <div class="mx-auto max-w-5xl p-6">
      <header class="mb-6">
        <h1 class="text-2xl font-bold">NASA EONET Incidents</h1>
        <p class="mt-2 text-sm text-slate-600">
          Explore incidents in map and list views with filtering, sorting, and a demo-data fallback.
        </p>
      </header>

      <DataSourceBanner :is-using-mock="isUsingMock" :live-available="liveAvailable"
        @check-live="handleCheckLiveAvailability" @switch-live="handleSwitchToLiveData" />

      <ExplorerToolbar :current-view="currentView" :selected-category="selectedCategory" :sort-order="sortOrder"
        :category-options="categoryOptions" :total="sortedIncidents.length" @update-view="currentView = $event"
        @update-category="selectedCategory = $event" @update-sort="sortOrder = $event" />

      <section v-if="isLoading" class="rounded-lg border bg-white p-6 shadow-sm">
        <p class="text-sm text-slate-600">Loading incidents...</p>
      </section>

      <section v-else-if="isError" class="rounded-lg border bg-white p-6 shadow-sm">
        <h2 class="text-lg font-semibold text-red-600">Unable to load live incidents</h2>

        <p class="mt-2 text-sm text-slate-600">
          {{ errorMessage }}
        </p>

        <div class="mt-4 flex flex-wrap gap-3">
          <button type="button" class="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
            @click="handleRetryLiveData">
            Retry
          </button>

          <button type="button" class="rounded-md border border-slate-300 px-4 py-2 text-sm" @click="handleUseMockData">
            Use demo data
          </button>
        </div>
      </section>

      <section v-else-if="isEmpty" class="rounded-lg border bg-white p-6 shadow-sm">
        <p class="text-sm text-slate-600">No incidents found.</p>
      </section>

      <IncidentList v-else-if="currentView === 'list'" :incidents="sortedIncidents" @select="handleIncidentSelect" />

      <section v-else class="rounded-lg border bg-white p-4 shadow-sm">
        <IncidentMap :incidents="sortedIncidents" :selected-incident-id="selectedIncidentId"
          @select="handleIncidentSelect" />
      </section>

      <AnalyticsPanel v-if="incidents.length" :items="topClickedIncidents" @reset="resetAnalytics" />

      <IncidentDetailModal :incident="selectedIncident" @close="clearSelectedIncident" />
    </div>
  </main>
</template>