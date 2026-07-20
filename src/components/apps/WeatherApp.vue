<script setup>
defineProps({
    application: {
        type: Object,
        required: true,
    },
})
</script>

<template>
    <div class="weather-app">
        <div class="weather-app__header">
            <span>Weather</span>
        </div>

        <div class="weather-app__location">{{ application.city }}</div>

        <div class="weather-app__main">
            <span class="weather-app__sun">☀</span>
            <span class="weather-app__temperature">{{ application.temperature }}°</span>
            <span class="weather-app__condition">{{ application.condition }}</span>
        </div>
    </div>
</template>

<style scoped>
.weather-app {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 8cqh 6cqw;
    color: white;
    background: linear-gradient(160deg, #287fc3, #0a416f);
}

.weather-app__header {
    font-size: 2.4cqh;
    font-weight: 600;
}

.weather-app__location {
    margin-top: 7cqh;
    font-size: 3cqh;
}

.weather-app__main {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 8cqh;
}

.weather-app__sun {
    color: #ffe11a;
    font-size: 10cqw;
}

.weather-app__temperature {
    margin-top: 2cqh;
    font-size: 10cqh;
    font-weight: 300;
}

.weather-app__condition {
    margin-top: 2cqh;
    font-size: 2cqh;
    opacity: 0.8;
}
</style>
