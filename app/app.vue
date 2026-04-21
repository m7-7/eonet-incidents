<script setup lang="ts">
import { useEonetEvents } from '~/composables/useEonetEvents'
import { useIncidentExplorer } from '~/composables/useIncidentExplorer'
import IncidentMap from '~/components/incidents/IncidentMap.vue'
import DataSourceBanner from '~/components/explorer/DataSourceBanner.vue'

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

function formatDate(date: string | null) {
  if (!date) return 'Unknown date'

  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))
}

function formatCoordinates(coordinates: number[] | number[][] | undefined) {
  if (!coordinates) return 'Unknown coordinates'

  if (
    Array.isArray(coordinates) &&
    coordinates.length === 2 &&
    typeof coordinates[0] === 'number' &&
    typeof coordinates[1] === 'number'
  ) {
    const [lng, lat] = coordinates
    return `${lat}, ${lng}`
  }

  if (Array.isArray(coordinates)) {
    return `${coordinates.length} coordinate sets`
  }

  return 'Unknown coordinates'
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

      <DataSourceBanner :is-using-mock="isUsingMock" :live-available="liveAvailable" @check-live="checkLiveAvailability"
        @switch-live="switchToLiveData" />

      <section class="mb-6 rounded-lg border bg-white p-4 shadow-sm">
        <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div class="flex flex-col gap-4 md:flex-row">
            <div>
              <label for="view" class="mb-1 block text-sm font-medium text-slate-700">
                View
              </label>
              <select id="view" v-model="currentView"
                class="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm">
                <option value="list">List</option>
                <option value="map">Map</option>
              </select>
            </div>

            <div>
              <label for="category" class="mb-1 block text-sm font-medium text-slate-700">
                Category
              </label>
              <select id="category" v-model="selectedCategory"
                class="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm">
                <option v-for="category in categoryOptions" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>

            <div>
              <label for="sort" class="mb-1 block text-sm font-medium text-slate-700">
                Sort
              </label>
              <select id="sort" v-model="sortOrder"
                class="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm">
                <option value="recent">Most recent</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </div>

          <p class="text-sm text-slate-600">
            Showing {{ sortedIncidents.length }} incidents
          </p>
        </div>
      </section>

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
            @click="retryLiveData">
            Retry
          </button>

          <button type="button" class="rounded-md border border-slate-300 px-4 py-2 text-sm" @click="useMockData">
            Use demo data
          </button>
        </div>
      </section>

      <section v-else-if="isEmpty" class="rounded-lg border bg-white p-6 shadow-sm">
        <p class="text-sm text-slate-600">No incidents found.</p>
      </section>

      <section v-else-if="currentView === 'list'" class="rounded-lg border bg-white shadow-sm">
        <ul class="divide-y">
          <li v-for="incident in sortedIncidents" :key="incident.id">
            <button type="button" class="w-full p-4 text-left transition hover:bg-slate-50"
              @click="selectIncident(incident.id)">
              <h2 class="text-base font-semibold">
                {{ incident.title }}
              </h2>

              <p class="mt-1 text-sm text-slate-600">
                Categories:
                {{ incident.categories.length ? incident.categories.join(', ') : 'Unknown' }}
              </p>

              <p class="mt-1 text-sm text-slate-600">
                Most recent:
                {{ formatDate(incident.mostRecentDate) }}
              </p>

              <p class="mt-1 text-sm text-slate-500">
                Geometry points: {{ incident.geometry.length }}
              </p>
            </button>
          </li>
        </ul>
      </section>

      <section v-else class="rounded-lg border bg-white p-4 shadow-sm">
        <IncidentMap :incidents="sortedIncidents" :selected-incident-id="selectedIncidentId" @select="selectIncident" />
      </section>

      <section v-if="selectedIncident" class="mt-6 rounded-lg border bg-white p-6 shadow-sm">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h2 class="text-xl font-bold">{{ selectedIncident.title }}</h2>
            <p class="mt-2 text-sm text-slate-600">
              Categories:
              {{ selectedIncident.categories.length ? selectedIncident.categories.join(', ') : 'Unknown' }}
            </p>
          </div>

          <button type="button" class="rounded-md border border-slate-300 px-3 py-2 text-sm"
            @click="clearSelectedIncident">
            Close
          </button>
        </div>

        <div class="mt-6">
          <h3 class="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Geometry history
          </h3>

          <ul class="mt-3 space-y-3">
            <li v-for="(item, index) in selectedIncident.geometry" :key="`${selectedIncident.id}-${index}`"
              class="rounded-md border border-slate-200 p-3">
              <p class="text-sm text-slate-700">
                <span class="font-medium">Type:</span>
                {{ item.type || 'Unknown' }}
              </p>

              <p class="mt-1 text-sm text-slate-700">
                <span class="font-medium">Date:</span>
                {{ formatDate(item.date || null) }}
              </p>

              <p class="mt-1 text-sm text-slate-700">
                <span class="font-medium">Coordinates:</span>
                {{ formatCoordinates(item.coordinates) }}
              </p>
            </li>
          </ul>
        </div>

        <div class="mt-6">
          <h3 class="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Sources
          </h3>

          <ul v-if="selectedIncident.sources.length" class="mt-3 space-y-2">
            <li v-for="(source, index) in selectedIncident.sources" :key="`${selectedIncident.id}-source-${index}`">
              <a v-if="source.url" :href="source.url" target="_blank" rel="noreferrer"
                class="text-sm font-medium text-blue-600 underline">
                {{ source.id || source.url }}
              </a>

              <span v-else class="text-sm text-slate-600">
                {{ source.id || 'Unknown source' }}
              </span>
            </li>
          </ul>

          <p v-else class="mt-3 text-sm text-slate-600">
            No source links available.
          </p>
        </div>
      </section>
    </div>
  </main>
</template>