<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import DynamicIsland from './DynamicIsland.vue'

const islandExamples = [
    {
        type: 'large',
        width: '92cqw',
        height: '22.5cqh',
    },
    {
        type: 'medium',
        width: '88cqw',
        height: '15cqh',
    },
    {
        type: 'small',
        width: '76cqw',
        height: '7.4cqh',
    },
    {
        type: 'pill',
        width: '58cqw',
        height: '5.8cqh',
    },
]

const activeIslandIndex = ref(0)
const isIslandExpanded = ref(false)
let closeTimer = null
let nextTimer = null

const activeIsland = computed(() => islandExamples[activeIslandIndex.value])

const clearIslandTimers = () => {
    clearTimeout(closeTimer)
    clearTimeout(nextTimer)
    closeTimer = null
    nextTimer = null
}

const runIslandCycle = () => {
    clearIslandTimers()
    isIslandExpanded.value = true

    closeTimer = setTimeout(() => {
        isIslandExpanded.value = false

        nextTimer = setTimeout(() => {
            activeIslandIndex.value = (activeIslandIndex.value + 1) % islandExamples.length
            runIslandCycle()
        }, 650)
    }, 2300)
}

const startIslandDemo = () => {
    if (isIslandExpanded.value) return
    runIslandCycle()
}

const stopIslandDemo = () => {
    clearIslandTimers()
    isIslandExpanded.value = false
    activeIslandIndex.value = 0
}

onBeforeUnmount(clearIslandTimers)
</script>

<template>
    <div class="full-phone-coque">
        <div class="button">
            <div class="button-left">
                <div class="button-left-volume"></div>
                <div class="button-left-volume"></div>
            </div>
            <div class="button-right">
                <div class="button-right-power"></div>
            </div>
        </div>

        <div class="screen">
            <div class="top">
                <div class="hour">22:50</div>

                <DynamicIsland
                    :expanded="isIslandExpanded"
                    :expanded-width="activeIsland.width"
                    :expanded-height="activeIsland.height"
                    :hoverable="false"
                    @mouseenter="startIslandDemo"
                    @mouseleave="stopIslandDemo"
                >
                    <template #expanded>
                        <Transition name="island-layout-swap" mode="out-in">
                            <section
                                v-if="activeIsland.type === 'large'"
                                key="large"
                                class="island-layout island-layout--large"
                            >
                                <div class="island-zone island-zone--icon"></div>
                                <div class="island-zone island-zone--content"></div>
                                <div class="island-zone island-zone--media"></div>
                                <div class="island-zone island-zone--actions"></div>
                            </section>

                            <section
                                v-else-if="activeIsland.type === 'medium'"
                                key="medium"
                                class="island-layout island-layout--medium"
                            >
                                <div class="island-zone island-zone--leading"></div>
                                <div class="island-zone island-zone--content"></div>
                                <div class="island-zone island-zone--actions"></div>
                            </section>

                            <section
                                v-else-if="activeIsland.type === 'small'"
                                key="small"
                                class="island-layout island-layout--small"
                            >
                                <div class="island-zone island-zone--leading"></div>
                                <div class="island-zone island-zone--content"></div>
                                <div class="island-zone island-zone--trailing"></div>
                            </section>

                            <section
                                v-else
                                key="pill"
                                class="island-layout island-layout--pill"
                            >
                                <div class="island-zone island-zone--leading"></div>
                                <div class="island-zone island-zone--content"></div>
                            </section>
                        </Transition>
                    </template>
                </DynamicIsland>

                <div class="utils"></div>
            </div>

            <div class="bottom">
                <div class="bar"></div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.full-phone-coque {
    container-type: size;
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 50%;
    left: 60%;
    transform: translate(-50%, -50%);
    width: 16.11vw;
    aspect-ratio: 9 / 18.15;
    border-radius: 2.7vw;
    border: 0.25vw solid rgb(94, 95, 97);
    background-color: rgb(0, 0, 0);
}

.button .button-left {
    position: absolute;
    flex-direction: column;
    display: flex;
    gap: 3cqh;
    top: 22%;
    left: -2.6cqw;
    width: 2.5cqw;
    height: 20.8cqh;
}

.button .button-right {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    top: 22%;
    right: -3.85cqw;
    width: 2.5cqw;
    height: 20.8cqh;
}

.button-right-power {
    position: relative;
    width: 1.1cqw;
    height: 9.5cqh;
    border-radius: 0 1.25cqw 1.25cqw 0;
    background: linear-gradient(to right, rgb(165, 164, 164), rgb(76, 75, 75));

    &:hover {
        cursor: pointer;
    }
}

.button-left-volume {
    position: relative;
    top: 30%;
    transform: translateY(-50%);
    width: 1.1cqw;
    height: 6.5cqh;
    border-radius: 1.25cqw 0 0 1.25cqw;
    background: linear-gradient(to left, rgb(165, 164, 164), rgb(76, 75, 75));

    &:hover {
        cursor: pointer;
    }
}

.screen {
    position: relative;
    display: flex;
    justify-content: center;
    width: 95.9cqw;
    height: 98.1cqh;
    border-radius: 13.4cqw;
    background: linear-gradient(to bottom, rgb(5, 97, 150), rgb(111, 15, 15));

    .top {
        position: absolute;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        padding: 0 8cqw;
        width: 100%;
        height: 8.65cqh;
        color: white;
        font-size: 2.1cqh;
        background-color: rgba(74, 59, 59, 0.494);

        .hour {
            position: relative;
            display: flex;
            width: 14cqw;
            font-weight: 500;
            font-family: "SF Pro Display";
        }

        .utils {
            position: relative;
            display: flex;
            width: 13.7cqw;
            height: 4.33cqh;
            background-color: rgb(255, 255, 255);
        }
    }

    .bottom {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        bottom: 1.5cqh;
        width: 45%;
        height: 3cqh;
        border-radius: 7cqw;

        &:hover {
            cursor: pointer;

            .bar {
                transform: scaleX(1.05);
            }
        }

        .bar {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 35cqw;
            height: 2cqw;
            border-radius: 2cqw;
            transition: all 0.3s ease-in-out;
            background-color: #ffffff;
        }
    }
}

.island-layout-swap-enter-active,
.island-layout-swap-leave-active {
    transition:
        opacity 0.18s ease-in-out,
        transform 0.18s ease-in-out;
}

.island-layout-swap-enter-from,
.island-layout-swap-leave-to {
    opacity: 0;
    transform: translateY(-0.8cqh) scale(0.98);
}

.island-layout {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    color: white;
    font-family: "SF Pro Display";
    background-color: rgb(0, 0, 0);
}

.island-layout--large {
    display: grid;
    grid-template-columns: 10cqw minmax(0, 1fr) 24cqw;
    grid-template-rows: 1fr 4.5cqh;
    gap: 1.4cqh 3cqw;
    padding: 2.4cqh 4cqw 1.7cqh;
    border-radius: 7.5cqw;
}

.island-layout--medium {
    display: grid;
    grid-template-columns: 10cqw minmax(0, 1fr);
    grid-template-rows: 1fr 6cqh;
    gap: 1.2cqh 3cqw;
    padding: 2cqh 4cqw;
    border-radius: 7cqw;
}

.island-layout--small {
    display: grid;
    grid-template-columns: 8cqw minmax(0, 1fr) 12cqw;
    gap: 2cqw;
    align-items: center;
    padding: 0.9cqh 3cqw;
    border-radius: 6cqw;
}

.island-layout--pill {
    display: grid;
    grid-template-columns: 8cqw minmax(0, 1fr);
    gap: 2cqw;
    align-items: center;
    padding: 0.7cqh 2.5cqw;
    border-radius: 5cqw;
}

.island-zone {
    min-width: 0;
    min-height: 0;
    border: 0.15cqw dashed rgba(255, 255, 255, 0.22);
    border-radius: 2cqw;
}

.island-zone--icon,
.island-zone--leading {
    border-radius: 50%;
}

.island-layout--large .island-zone--icon {
    grid-column: 1;
    grid-row: 1;
    width: 8.5cqw;
    height: 8.5cqw;
}

.island-layout--large .island-zone--content {
    grid-column: 2;
    grid-row: 1;
}

.island-layout--large .island-zone--media {
    grid-column: 3;
    grid-row: 1 / span 2;
}

.island-layout--large .island-zone--actions {
    grid-column: 1 / span 2;
    grid-row: 2;
}

.island-layout--medium .island-zone--leading {
    grid-column: 1;
    grid-row: 1 / span 2;
    width: 8.5cqw;
    height: 8.5cqw;
    align-self: start;
}

.island-layout--medium .island-zone--content {
    grid-column: 2;
    grid-row: 1;
}

.island-layout--medium .island-zone--actions {
    grid-column: 2;
    grid-row: 2;
}

.island-layout--small .island-zone--leading,
.island-layout--pill .island-zone--leading {
    width: 6cqw;
    height: 6cqw;
}
</style>
