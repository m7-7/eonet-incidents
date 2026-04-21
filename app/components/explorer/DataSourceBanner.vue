<script setup lang="ts">
defineProps<{
    isUsingMock: boolean
    liveAvailable: boolean
}>()

const emit = defineEmits<{
    checkLive: []
    switchLive: []
}>()
</script>

<template>
    <section v-if="isUsingMock" class="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-4 shadow-sm">
        <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
                <p class="text-sm font-semibold text-amber-900">
                    Viewing demo data
                </p>
                <p class="mt-1 text-sm text-amber-800">
                    Live NASA data was unavailable, so the app is currently showing demo incidents.
                </p>
            </div>

            <div class="flex flex-wrap gap-3">
                <button type="button" class="rounded-md border border-amber-400 px-4 py-2 text-sm text-amber-900"
                    @click="$emit('checkLive')">
                    Check live data
                </button>

                <button v-if="liveAvailable" type="button"
                    class="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                    @click="$emit('switchLive')">
                    Switch to live data
                </button>
            </div>
        </div>
    </section>
</template>