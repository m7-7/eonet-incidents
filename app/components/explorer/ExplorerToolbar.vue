<script setup lang="ts">
const props = defineProps<{
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

const isMobilePanelOpen = ref(false)

function handleViewChange(event: Event) {
    const target = event.target as HTMLSelectElement
    emit('updateView', target.value as 'list' | 'map')
}

function handleCategoryChange(event: Event) {
    const target = event.target as HTMLSelectElement
    emit('updateCategory', target.value)
}

function handleSortChange(event: Event) {
    const target = event.target as HTMLSelectElement
    emit('updateSort', target.value as 'recent' | 'oldest')
}

function closeMobilePanel() {
    isMobilePanelOpen.value = false
}
</script>

<template>
    <section class="mb-6 rounded-lg border bg-white p-4 shadow-sm">
        <!-- Mobile -->
        <div class="md:hidden">
            <div class="flex items-center justify-between gap-3">
                <button type="button"
                    class="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800"
                    @click="isMobilePanelOpen = !isMobilePanelOpen">
                    {{ isMobilePanelOpen ? 'Close filters' : 'Filters & sort' }}
                </button>

                <p class="text-sm text-slate-600">
                    {{ total }} incidents
                </p>
            </div>

            <div v-if="isMobilePanelOpen" class="mt-4 space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div>
                    <label class="mb-1 block text-sm font-medium text-slate-700">
                        View
                    </label>
                    <select :value="currentView"
                        class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                        @change="handleViewChange">
                        <option value="list">List</option>
                        <option value="map">Map</option>
                    </select>
                </div>

                <div>
                    <label class="mb-1 block text-sm font-medium text-slate-700">
                        Category
                    </label>
                    <select :value="selectedCategory"
                        class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                        @change="handleCategoryChange">
                        <option v-for="category in categoryOptions" :key="category" :value="category">
                            {{ category }}
                        </option>
                    </select>
                </div>

                <div>
                    <label class="mb-1 block text-sm font-medium text-slate-700">
                        Sort
                    </label>
                    <select :value="sortOrder"
                        class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                        @change="handleSortChange">
                        <option value="recent">Most recent</option>
                        <option value="oldest">Oldest</option>
                    </select>
                </div>

                <button type="button" class="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                    @click="closeMobilePanel">
                    Apply
                </button>
            </div>
        </div>

        <!-- Desktop / Tablet -->
        <div class="hidden md:block">
            <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div class="flex flex-col gap-4 md:flex-row">
                    <div>
                        <label class="mb-1 block text-sm font-medium text-slate-700">
                            View
                        </label>
                        <select :value="currentView"
                            class="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                            @change="handleViewChange">
                            <option value="list">List</option>
                            <option value="map">Map</option>
                        </select>
                    </div>

                    <div>
                        <label class="mb-1 block text-sm font-medium text-slate-700">
                            Category
                        </label>
                        <select :value="selectedCategory"
                            class="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                            @change="handleCategoryChange">
                            <option v-for="category in categoryOptions" :key="category" :value="category">
                                {{ category }}
                            </option>
                        </select>
                    </div>

                    <div>
                        <label class="mb-1 block text-sm font-medium text-slate-700">
                            Sort
                        </label>
                        <select :value="sortOrder" class="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                            @change="handleSortChange">
                            <option value="recent">Most recent</option>
                            <option value="oldest">Oldest</option>
                        </select>
                    </div>
                </div>

                <p class="text-sm text-slate-600">
                    Showing {{ total }} incidents
                </p>
            </div>
        </div>
    </section>
</template>