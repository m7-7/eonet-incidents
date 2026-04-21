<script setup lang="ts">
defineProps<{
    items: {
        incidentId: string
        title: string
        count: number
    }[]
}>()

const emit = defineEmits<{
    reset: []
}>()
</script>

<template>
    <section class="mt-6 rounded-lg border bg-white p-6 shadow-sm">
        <div class="flex items-start justify-between gap-4">
            <div>
                <h2 class="text-lg font-semibold">Most clicked incidents</h2>
                <p class="mt-1 text-sm text-slate-600">
                    Top 5 incidents based on clicks from the map and list views.
                </p>
            </div>

            <button type="button" class="rounded-md border border-slate-300 px-4 py-2 text-sm" @click="$emit('reset')">
                Reset analytics
            </button>
        </div>

        <div v-if="items.length" class="mt-4 space-y-3">
            <div v-for="item in items" :key="item.incidentId"
                class="flex items-center justify-between rounded-md border border-slate-200 p-3">
                <div>
                    <p class="font-medium text-slate-900">{{ item.title }}</p>
                    <p class="text-sm text-slate-500">ID: {{ item.incidentId }}</p>
                </div>

                <p class="text-sm font-semibold text-slate-700">
                    {{ item.count }} clicks
                </p>
            </div>
        </div>

        <p v-else class="mt-4 text-sm text-slate-600">
            No analytics yet. Click incidents from the list or map to start tracking.
        </p>
    </section>
</template>