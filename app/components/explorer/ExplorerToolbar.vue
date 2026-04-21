<script setup lang="ts">
defineProps<{
    currentView: 'list' | 'map'
    selectedCategory: string
    sortOrder: 'recent' | 'oldest'
    categoryOptions: string[]
    total: number
}>()

const emit = defineEmits<{
    updateView: [value: 'list' | 'map']
    updateCategory: [value: string]
    updateSort: [value: 'recent' | 'oldest']
}>()
</script>

<template>
    <section class="mb-6 rounded-lg border bg-white p-4 shadow-sm">
        <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div class="flex flex-col gap-4 md:flex-row">
                <!-- View -->
                <div>
                    <label class="mb-1 block text-sm font-medium text-slate-700">
                        View
                    </label>
                    <select :value="currentView"
                        @change="emit('updateView', ($event.target as HTMLSelectElement).value as 'list' | 'map')"
                        class="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm">
                        <option value="list">List</option>
                        <option value="map">Map</option>
                    </select>
                </div>

                <!-- Category -->
                <div>
                    <label class="mb-1 block text-sm font-medium text-slate-700">
                        Category
                    </label>
                    <select :value="selectedCategory"
                        @change="emit('updateCategory', ($event.target as HTMLSelectElement).value)"
                        class="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm">
                        <option v-for="category in categoryOptions" :key="category" :value="category">
                            {{ category }}
                        </option>
                    </select>
                </div>

                <!-- Sort -->
                <div>
                    <label class="mb-1 block text-sm font-medium text-slate-700">
                        Sort
                    </label>
                    <select :value="sortOrder"
                        @change="emit('updateSort', ($event.target as HTMLSelectElement).value as 'recent' | 'oldest')"
                        class="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm">
                        <option value="recent">Most recent</option>
                        <option value="oldest">Oldest</option>
                    </select>
                </div>
            </div>

            <p class="text-sm text-slate-600">
                Showing {{ total }} incidents
            </p>
        </div>
    </section>
</template>