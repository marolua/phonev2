<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import DynamicIsland from './DynamicIsland.vue'

const islandExamples = [
    {
        type: 'highdrop',
        width: '94cqw',
        height: '23cqh',
    },
    {
        type: 'call',
        width: '94cqw',
        height: '17cqh',
    },
    {
        type: 'flashlight',
        width: '84cqw',
        height: '9cqh',
    },
    {
        type: 'silent',
        width: '70cqw',
        height: '7cqh',
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
                        <Transition name="island-card-swap" mode="out-in">
                            <section
                                v-if="activeIsland.type === 'highdrop'"
                                key="highdrop"
                                class="island-card island-card--highdrop"
                            >
                                <div class="island-card__main-icon">HD</div>

                                <div class="island-card__copy">
                                    <div class="island-card__title">HighDrop</div>
                                    <div class="island-card__subtitle">
                                        highrider would like to share 1 video
                                    </div>
                                </div>

                                <div class="island-card__media">
                                    <span>★</span>
                                    <span>●</span>
                                </div>

                                <div class="island-card__actions">
                                    <button class="island-card__button">Decline</button>
                                    <button class="island-card__button island-card__button--blue">Accept</button>
                                </div>
                            </section>

                            <section
                                v-else-if="activeIsland.type === 'call'"
                                key="call"
                                class="island-card island-card--call"
                            >
                                <div class="island-card__main-icon island-card__main-icon--gray">A</div>
                                <div class="island-card__copy island-card__copy--compact">
                                    <div class="island-card__title">Aria Wright</div>
                                    <div class="island-card__subtitle">00:01</div>
                                </div>
                                <div class="island-card__round-actions">
                                    <button>▢</button>
                                    <button>Mic</button>
                                    <button>Vol</button>
                                    <button class="island-card__round-button--red">×</button>
                                </div>
                            </section>

                            <section
                                v-else-if="activeIsland.type === 'flashlight'"
                                key="flashlight"
                                class="island-card island-card--mini"
                            >
                                <div class="island-card__main-icon island-card__main-icon--glow">F</div>
                                <div class="island-card__title">Flashlight</div>
                                <div class="island-card__state">On</div>
                            </section>

                            <section
                                v-else
                                key="silent"
                                class="island-card island-card--silent"
                            >
                                <span>Silent</span>
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

.island-card-swap-enter-active,
.island-card-swap-leave-active {
    transition:
        opacity 0.18s ease-in-out,
        transform 0.18s ease-in-out;
}

.island-card-swap-enter-from,
.island-card-swap-leave-to {
    opacity: 0;
    transform: translateY(-0.8cqh) scale(0.98);
}

.island-card {
    width: 100%;
    height: 100%;
    flex-shrink: 0;
    box-sizing: border-box;
    color: white;
    font-family: "SF Pro Display";
    background-color: rgb(0, 0, 0);
}

.island-card--highdrop {
    display: grid;
    grid-template-columns: 10cqw minmax(0, 1fr) 25cqw;
    grid-template-rows: 1fr 5cqh;
    column-gap: 3cqw;
    row-gap: 1cqh;
    padding: 2.2cqh 3.5cqw 1.4cqh;
    border-radius: 8cqw;
}

.island-card__main-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 8.8cqw;
    height: 8.8cqw;
    margin-top: 2cqh;
    border-radius: 50%;
    font-size: 1.7cqh;
    font-weight: 700;
    background: rgba(255, 255, 255, 0.2);
}

.island-card__main-icon--gray {
    color: black;
    background: rgba(255, 255, 255, 0.72);
}

.island-card__main-icon--glow {
    margin-top: 0;
    background: rgba(255, 255, 255, 0.18);
    box-shadow: 0 0 2.6cqw rgba(255, 255, 255, 0.35);
}

.island-card__copy {
    min-width: 0;
    padding-top: 2.45cqh;
    text-align: left;
}

.island-card__copy--compact {
    padding-top: 0;
}

.island-card__title {
    overflow: hidden;
    font-size: 2.15cqh;
    font-weight: 800;
    line-height: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.island-card__subtitle {
    display: -webkit-box;
    overflow: hidden;
    margin-top: 0.7cqh;
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.45cqh;
    font-weight: 600;
    line-height: 1.05;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

.island-card__media {
    display: flex;
    grid-column: 3;
    grid-row: 1 / span 2;
    justify-content: center;
    align-items: center;
    align-self: start;
    gap: 1cqw;
    width: 100%;
    height: 14.2cqh;
    border-radius: 5cqw;
    font-size: 3.5cqw;
    background: linear-gradient(145deg, #59657e, #3f4860);
}

.island-card__actions {
    display: flex;
    grid-column: 1 / 3;
    grid-row: 2;
    gap: 3.5cqw;
    align-self: start;
}

.island-card__button {
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    min-height: 4.8cqh;
    border: 0;
    border-radius: 7cqw;
    color: white;
    font-family: "SF Pro Display";
    font-size: 1.55cqh;
    font-weight: 700;
    background: rgba(255, 255, 255, 0.34);
    cursor: pointer;
}

.island-card__button--blue {
    background: #19599a;
}

.island-card--call,
.island-card--mini,
.island-card--silent {
    display: flex;
    align-items: center;
}

.island-card--call {
    gap: 2.5cqw;
    padding: 1.8cqh 3cqw;
    border-radius: 7cqw;
}

.island-card--call .island-card__main-icon {
    margin-top: 0;
}

.island-card__round-actions {
    display: flex;
    flex: 1;
    justify-content: flex-end;
    gap: 2cqw;
}

.island-card__round-actions button {
    width: 8cqw;
    height: 8cqw;
    border: 0;
    border-radius: 50%;
    color: white;
    font-size: 1.2cqh;
    background: rgba(255, 255, 255, 0.14);
    cursor: pointer;
}

.island-card__round-actions .island-card__round-button--red {
    background: #ff6b5e;
}

.island-card--mini {
    gap: 2.5cqw;
    padding: 1.1cqh 3cqw;
    border-radius: 7cqw;
}

.island-card--mini .island-card__main-icon {
    width: 7.2cqw;
    height: 7.2cqw;
}

.island-card__state {
    margin-left: auto;
    font-size: 1.7cqh;
}

.island-card--silent {
    justify-content: center;
    gap: 3cqw;
    color: #ff5a4c;
    border-radius: 5cqw;
}
</style>
