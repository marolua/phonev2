<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import DynamicIsland from './DynamicIsland.vue'

const islandExamples = [
    {
        type: 'large',
        width: '91cqw',
        height: '22cqh',
    },
    {
        type: 'medium',
        width: '91cqw',
        height: '17cqh',
    },
    {
        type: 'small',
        width: '87cqw',
        height: '8.5cqh',
    },
    {
        type: 'pill',
        width: '60cqw',
        height: '6cqh',
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
                            <!-- Dynamic Island large : fond grand format. Ajoute tes divs dedans. -->
                            <section
                                v-if="activeIsland.type === 'large'"
                                key="large"
                                class="island-layout island-layout--large"
                            ></section>

                            <!-- Dynamic Island medium : fond moyen format. Ajoute tes divs dedans. -->
                            <section
                                v-else-if="activeIsland.type === 'medium'"
                                key="medium"
                                class="island-layout island-layout--medium"
                            ></section>

                            <!-- Dynamic Island small : fond petit format. Ajoute tes divs dedans. -->
                            <section
                                v-else-if="activeIsland.type === 'small'"
                                key="small"
                                class="island-layout island-layout--small"
                            ></section>

                            <!-- Dynamic Island pill : fond très compact. Ajoute tes divs dedans. -->
                            <section
                                v-else
                                key="pill"
                                class="island-layout island-layout--pill"
                            ></section>
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
    background-color: rgb(0, 0, 0);
}

.island-layout--large {
    border-radius: 7.5cqw;
}

.island-layout--medium {
    border-radius: 7cqw;
}

.island-layout--small {
    border-radius: 6cqw;
}

.island-layout--pill {
    border-radius: 5cqw;
}
</style>
