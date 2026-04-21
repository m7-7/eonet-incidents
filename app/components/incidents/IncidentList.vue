<script setup lang="ts">
import type { Incident } from '../../../types/incidents'

defineProps<{
    incidents: Incident[]
}>()

const emit = defineEmits<{
    select: [incidentId: string]
}>()

function formatDate(date: string | null) {
    if (!date) return 'Unknown date'

    return new Intl.DateTimeFormat('en-GB', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(date))
}
</script>

<template>
    <section class="rounded-lg border bg-white shadow-sm">
        <ul class="divide-y">
            <li v-for="incident in incidents" :key="incident.id">
                <button type="button" class="w-full p-4 text-left transition hover:bg-slate-50"
                    @click="$emit('select', incident.id)">
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
</template>