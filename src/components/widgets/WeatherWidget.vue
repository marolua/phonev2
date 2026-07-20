<script setup>

import { MousePointer2 } from '@lucide/vue';
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
            <div class="weather-widget__city">{{ application.city }}
                <MousePointer2 :size="20" :stroke-width="2" />
            </div>

            <div class="weather-widget__temperature">
                {{ application.temperature }}°C
            </div>

            <div class="weather-widget__condition">
                <span class="weather-widget__sun">☀</span>
                <span>{{ application.condition }}</span>
            </div>
        </div>

        <div class="weather-widget__label">Weather</div>
    </div>
</template>

<style lang="scss">
.weather-widget {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    user-select: none;
    height: 100%;
    gap: 0.6cqh;
    overflow: hidden;
    color: #fff;
}

.weather {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-sizing: border-box;
    padding: 2.8cqw 4cqw 1.5cqw;
    width: 100%;
    height: 20.8cqh;
    border-radius: 6cqw;
    background: linear-gradient(145deg, #2579bd 0%, #0b4477 100%);

}

.weather-widget__city {
    display: flex;
    align-items: center;
    font-size: 2.1cqh;
    margin-top: 0.5cqh;
    gap: 0.5cqw;
    font-weight: 400;
    line-height: 1.1;
}

.weather-widget__temperature {
    margin-top: 1.5cqh;
    font-size: 5.7cqh;
    font-weight: 500;
    line-height: 0.95;
    letter-spacing: -0.15cqw;
}

.weather-widget__condition {
    display: flex;
    flex-direction: column;
    gap: 1cqw;
    margin-top: auto;
    font-size: 1.65cqh;
    margin-bottom: 1.25cqh;
    font-weight: 500;
    line-height: 1.1;
}

.weather-widget__sun {
    color: #ffe11a;
    font-size: 3.8cqw;
    line-height: 1;
}

.weather-widget__label {
    /* margin-top: 1.2cqh; */
    color: rgba(255, 255, 255, 0.72);
    width: 100%;
    text-align: center;
    font-size: 1.5cqh;
    font-weight: 400;
    letter-spacing: 0.1cqw;
    color: #fff;
    text-shadow: 0 0 .3125rem #00000059;

}
</style>
