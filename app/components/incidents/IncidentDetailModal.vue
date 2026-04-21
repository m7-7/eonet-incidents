<script setup lang="ts">
import type { Incident } from '../../../types/incidents'

const props = defineProps<{
    incident: Incident | null
}>()

const emit = defineEmits<{
    close: []
}>()

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

function onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
        emit('close')
    }
}

onMounted(() => {
    const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && props.incident) {
            emit('close')
        }
    }

    window.addEventListener('keydown', handleEscape)

    onUnmounted(() => {
        window.removeEventListener('keydown', handleEscape)
    })
})
</script>

<template>
    <Teleport to="body">
        <div v-if="incident" class="fixed inset-0 z-[5000] flex items-center justify-center bg-black/50 p-4"
            @click="onBackdropClick">
            <div class="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl" role="dialog"
                aria-modal="true" aria-labelledby="incident-modal-title">
                <div class="flex items-start justify-between gap-4 border-b p-6">
                    <div>
                        <h2 id="incident-modal-title" class="text-xl font-bold">
                            {{ incident.title }}
                        </h2>
                        <p class="mt-2 text-sm text-slate-600">
                            Categories:
                            {{ incident.categories.length ? incident.categories.join(', ') : 'Unknown' }}
                        </p>
                    </div>

                    <button type="button" class="rounded-md border border-slate-300 px-3 py-2 text-sm"
                        @click="$emit('close')">
                        Close
                    </button>
                </div>

                <div class="p-6">
                    <div>
                        <h3 class="text-sm font-semibold uppercase tracking-wide text-slate-500">
                            Geometry history
                        </h3>

                        <ul class="mt-3 space-y-3">
                            <li v-for="(item, index) in incident.geometry" :key="`${incident.id}-${index}`"
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

                        <ul v-if="incident.sources.length" class="mt-3 space-y-2">
                            <li v-for="(source, index) in incident.sources" :key="`${incident.id}-source-${index}`">
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
                </div>
            </div>
        </div>
    </Teleport>
</template>