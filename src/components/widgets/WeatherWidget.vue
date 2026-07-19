<script setup>
defineProps({
    application: {
        type: Object,
        required: true
    }
})
</script>

<template>
    <div class="weather-widget">
        <div class="weather-widget__header">
            <span>Paris</span>
            <img :src="application.icon" alt="Météo">
        </div>

        <div class="weather-widget__temperature">
            24°
        </div>

        <div class="weather-widget__description">
            Ensoleillé
        </div>
    </div>
</template>

<style scoped>
.weather-widget {
    width: 100%;
    height: 100%;
    padding: 1cqw;
    box-sizing: border-box;
    color: white;
}

.weather-widget__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.weather-widget__header img {
    width: 5cqw;
    height: 5cqw;
}

.weather-widget__temperature {
    font-size: 5cqh;
    font-weight: 600;
}

.weather-widget__description {
    opacity: 0.7;
}
</style>