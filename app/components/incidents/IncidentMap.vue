<script setup lang="ts">
import type { Incident } from '../../../shared/types/incidents'

const props = defineProps<{
    incidents: Incident[]
    selectedIncidentId: string | null
}>()

const emit = defineEmits<{
    select: [incidentId: string]
}>()

function isPointCoordinates(value: unknown): value is [number, number] {
    return (
        Array.isArray(value) &&
        value.length === 2 &&
        typeof value[0] === 'number' &&
        typeof value[1] === 'number'
    )
}

function isLineCoordinates(value: unknown): value is [number, number][] {
    return (
        Array.isArray(value) &&
        value.length > 0 &&
        Array.isArray(value[0]) &&
        value.every(
            (item) =>
                Array.isArray(item) &&
                item.length === 2 &&
                typeof item[0] === 'number' &&
                typeof item[1] === 'number',
        )
    )
}

function toLatLngPoint(coords: [number, number]): [number, number] {
    const [lng, lat] = coords
    return [lat, lng]
}

function toLatLngLine(coords: [number, number][]): [number, number][] {
    return coords.map(([lng, lat]) => [lat, lng])
}

const mapCenter: [number, number] = [20, 0]
const mapZoom = 2

const pointFeatures = computed(() => {
    const features: Array<{
        incidentId: string
        title: string
        category: string
        date: string | null
        latLng: [number, number]
        isSelected: boolean
    }> = []

    for (const incident of props.incidents) {
        for (const geometry of incident.geometry) {
            if (geometry.type === 'Point' && isPointCoordinates(geometry.coordinates)) {
                features.push({
                    incidentId: incident.id,
                    title: incident.title,
                    category: incident.categories[0] || 'Unknown',
                    date: geometry.date || null,
                    latLng: toLatLngPoint(geometry.coordinates),
                    isSelected: props.selectedIncidentId === incident.id,
                })
            }
        }
    }

    return features
})

const lineFeatures = computed(() => {
    const features: Array<{
        incidentId: string
        title: string
        category: string
        date: string | null
        latLngs: [number, number][]
        isSelected: boolean
    }> = []

    for (const incident of props.incidents) {
        for (const geometry of incident.geometry) {
            if (geometry.type === 'LineString' && isLineCoordinates(geometry.coordinates)) {
                features.push({
                    incidentId: incident.id,
                    title: incident.title,
                    category: incident.categories[0] || 'Unknown',
                    date: geometry.date || null,
                    latLngs: toLatLngLine(geometry.coordinates),
                    isSelected: props.selectedIncidentId === incident.id,
                })
            }
        }
    }

    return features
})

function formatDate(date: string | null) {
    if (!date) return 'Unknown date'

    return new Intl.DateTimeFormat('en-GB', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(date))
}

function handleSelect(incidentId: string) {
    emit('select', incidentId)
}

watchEffect(() => {
    console.log('MAP INCIDENTS:', props.incidents.length)
    console.log('POINT FEATURES:', pointFeatures.value.length)
    console.log('LINE FEATURES:', lineFeatures.value.length)
})

</script>



<template>
    <ClientOnly>
        <div class="h-[560px] w-full overflow-hidden rounded-lg border">
            <LMap :zoom="mapZoom" :center="mapCenter" :use-global-leaflet="false" style="height: 100%; width: 100%">
                <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base"
                    name="OpenStreetMap" />

                <LPolyline v-for="line in lineFeatures" :key="`${line.incidentId}-${line.date}-line`"
                    :lat-lngs="line.latLngs" :weight="line.isSelected ? 6 : 4" @click="handleSelect(line.incidentId)">
                    <LPopup>
                        <div class="text-sm">
                            <p class="font-semibold">{{ line.title }}</p>
                            <p>Category: {{ line.category }}</p>
                            <p>Date: {{ formatDate(line.date) }}</p>
                        </div>
                    </LPopup>
                </LPolyline>

                <LCircleMarker v-for="point in pointFeatures"
                    :key="`${point.incidentId}-${point.date}-${point.latLng.join(',')}`" :lat-lng="point.latLng"
                    :radius="point.isSelected ? 9 : 6" @click="handleSelect(point.incidentId)">
                    <LPopup>
                        <div class="text-sm">
                            <p class="font-semibold">{{ point.title }}</p>
                            <p>Category: {{ point.category }}</p>
                            <p>Date: {{ formatDate(point.date) }}</p>
                        </div>
                    </LPopup>
                </LCircleMarker>
            </LMap>
        </div>
    </ClientOnly>
</template>