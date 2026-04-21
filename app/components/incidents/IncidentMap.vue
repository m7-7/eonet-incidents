<script setup lang="ts">
import type { Incident } from '../../../types/incidents'

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

const multiPointLines = computed(() => {
    const features: Array<{
        incidentId: string
        title: string
        category: string
        latLngs: [number, number][]
        isSelected: boolean
    }> = []

    for (const incident of props.incidents) {
        const pointGeometries = incident.geometry
            .filter(
                (geometry) =>
                    geometry.type === 'Point' && isPointCoordinates(geometry.coordinates),
            )
            .sort((a, b) => {
                const aTime = a.date ? new Date(a.date).getTime() : 0
                const bTime = b.date ? new Date(b.date).getTime() : 0
                return aTime - bTime
            })

        if (pointGeometries.length > 1) {
            features.push({
                incidentId: incident.id,
                title: incident.title,
                category: incident.categories[0] || 'Unknown',
                latLngs: pointGeometries.map((geometry) =>
                    toLatLngPoint(geometry.coordinates as [number, number]),
                ),
                isSelected: props.selectedIncidentId === incident.id,
            })
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

</script>



<template>
    <ClientOnly>
        <div class="h-[560px] w-full overflow-hidden rounded-lg border">
            <LMap :zoom="mapZoom" :center="mapCenter" :use-global-leaflet="false" style="height: 100%; width: 100%">
                <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base"
                    name="OpenStreetMap" />

                <LPolyline v-for="line in lineFeatures" :key="`${line.incidentId}-${line.date}-line`"
                    :lat-lngs="line.latLngs" :color="line.isSelected ? '#16a34a' : '#2563eb'"
                    :weight="line.isSelected ? 6 : 3" @click="handleSelect(line.incidentId)" />

                <LPolyline v-for="line in multiPointLines" :key="`${line.incidentId}-multi-point-line`"
                    :lat-lngs="line.latLngs" :color="line.isSelected ? '#16a34a' : '#2563eb'"
                    :weight="line.isSelected ? 5 : 2.5" :opacity="0.7" @click="handleSelect(line.incidentId)" />

                <LCircleMarker v-for="point in pointFeatures"
                    :key="`${point.incidentId}-${point.date}-${point.latLng.join(',')}`" :lat-lng="point.latLng"
                    :radius="point.isSelected ? 10 : 6" :color="point.isSelected ? '#16a34a' : '#2563eb'"
                    :fillColor="point.isSelected ? '#16a34a' : '#3b82f6'" :fillOpacity="0.6"
                    :weight="point.isSelected ? 3 : 1.5" @click="handleSelect(point.incidentId)" />
            </LMap>
        </div>
    </ClientOnly>
</template>