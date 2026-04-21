<script setup lang="ts">
defineProps<{
    isOpen: boolean
    items: {
        incidentId: string
        title: string
        count: number
    }[]
}>()

const emit = defineEmits<{
    close: []
    reset: []
}>()

function onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
        emit('close')
    }
}

onMounted(() => {
    const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
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
        <div v-if="isOpen" class="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4"
            @click="onBackdropClick">
            <div class="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl" role="dialog"
                aria-modal="true" aria-labelledby="analytics-modal-title">
                <div class="flex items-start justify-between gap-4 border-b p-6">
                    <div>
                        <h2 id="analytics-modal-title" class="text-xl font-bold">
                            Most clicked incidents
                        </h2>
                        <p class="mt-1 text-sm text-slate-600">
                            Top 5 incidents based on clicks from the map and list views.
                        </p>
                    </div>

                    <button type="button" class="rounded-md border border-slate-300 px-3 py-2 text-sm"
                        @click="$emit('close')">
                        Close
                    </button>
                </div>

                <div class="p-5 sm:p-6">
                    <div class="mb-4 flex justify-end">
                        <button type="button" class="rounded-md border border-slate-300 px-4 py-2 text-sm"
                            @click="$emit('reset')">
                            Reset analytics
                        </button>
                    </div>

                    <div v-if="items.length" class="space-y-3">
                        <div v-for="item in items" :key="item.incidentId"
                            class="flex items-start justify-between gap-4 rounded-md border border-slate-200 p-3">
                            <!-- Left content -->
                            <div class="min-w-0">
                                <p class="font-medium text-slate-900 leading-snug">
                                    {{ item.title }}
                                </p>

                                <p class="mt-1 text-xs text-slate-500">
                                    ID: {{ item.incidentId }}
                                </p>
                            </div>

                            <!-- Right content -->
                            <div class="shrink-0 text-right">
                                <p class="text-sm font-semibold text-slate-800">
                                    {{ item.count }}
                                </p>
                                <p class="text-xs text-slate-500">
                                    clicks
                                </p>
                            </div>
                        </div>
                    </div>

                    <p v-else class="text-sm text-slate-600">
                        No analytics yet. Click incidents from the list or map to start tracking.
                    </p>
                </div>
            </div>
        </div>
    </Teleport>
</template>