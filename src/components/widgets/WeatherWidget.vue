<script setup>
defineProps({
    application: {
        type: Object,
        required: true,
    },
})
</script>

<template>
    <div class="weather-widget">
        <div class="weather">
            <div class="weather-widget__city">{{ application.city }}</div>

            <div class="weather-widget__temperature">
                {{ application.temperature }}°
            </div>

            <div class="weather-widget__condition">
                <span class="weather-widget__sun">☀</span>
                <span>{{ application.condition }}</span>
            </div>
        </div>

        <div class="weather-widget__label">Weather</div>
    </div>
</template>

<style scoped>
.weather-widget {
    position: relative;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    min-height: 100%;
    gap: 0.6cqh;
    overflow: hidden;
    color: #fff;
    text-align: left;
}

.weather {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-sizing: border-box;
    padding: 2.5cqw 2.8cqw 1cqw;
    width: 100%;
    height: 20.75cqh;
    border-radius: 2.5cqw;
        background: linear-gradient(145deg, #2579bd 0%, #0b4477 100%);

}

.weather-widget__city {
    font-size: 2.4cqh;
    font-weight: 500;
    line-height: 1.1;
}

.weather-widget__temperature {
    margin-top: 0.4cqh;
    font-size: 7.2cqh;
    font-weight: 300;
    line-height: 0.95;
    letter-spacing: -0.15cqw;
}

.weather-widget__condition {
    display: flex;
    align-items: center;
    gap: 1cqw;
    margin-top: auto;
    font-size: 1.65cqh;
    font-weight: 500;
    line-height: 1.1;
}

.weather-widget__sun {
    color: #ffe11a;
    font-size: 3.4cqw;
    line-height: 1;
}

.weather-widget__label {
    /* margin-top: 1.2cqh; */
    color: rgba(255, 255, 255, 0.72);
    width: 100%;
    text-align: center;
    font-size: 1.45cqh;
    font-weight: 400;
    letter-spacing: 0.1cqw;
    color: #fff;
    text-shadow: 0 0 .3125rem #00000059;

}
</style>
