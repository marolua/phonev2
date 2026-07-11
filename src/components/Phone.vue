<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import DynamicIsland from './DynamicIsland.vue'
import HighDropIsland from './HighDropIsland.vue'

const highDrop = {
    iconText: 'HD',
    title: 'Partage de fichier',
    subtitle: 'Théo veux vous partagez des fichiers, texte',
    imageSrc: '',
    declineText: 'Refuser',
    acceptText: 'Accepter',
}

const islandExamples = [
    {
        type: 'highdrop',
        width: '92cqw',
        height: '22.5cqh',
    },
    {
        type: 'call',
        width: '88cqw',
        height: '15cqh',
    },
    {
        type: 'flashlight',
        width: '76cqw',
        height: '7.4cqh',
    },
    {
        type: 'silent',
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
                        <Transition name="island-card-swap" mode="out-in">
                            <section
                                v-if="activeIsland.type === 'highdrop'"
                                key="highdrop"
                                class="island-card"
                            >
                                <HighDropIsland
                                    :icon-text="highDrop.iconText"
                                    :title="highDrop.title"
                                    :subtitle="highDrop.subtitle"
                                    :image-src="highDrop.imageSrc"
                                    :decline-text="highDrop.declineText"
                                    :accept-text="highDrop.acceptText"
                                />
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
                                    <button>Cam</button>
                                    <button>Mic</button>
                                    <button>Vol</button>
                                    <button class="island-card__round-button--red">X</button>
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

.island-card__main-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 8cqw;
    height: 8cqw;
    margin-top: 1.7cqh;
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
    padding-top: 2.15cqh;
    text-align: left;
}

.island-card__copy--compact {
    padding-top: 0;
}

.island-card__title {
    overflow: hidden;
    font-size: 2cqh;
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
    font-size: 1.35cqh;
    font-weight: 600;
    line-height: 1.05;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

.island-card--call,
.island-card--mini,
.island-card--silent {
    display: flex;
    align-items: center;
}

.island-card--call {
    gap: 2.1cqw;
    padding: 1.45cqh 2.8cqw;
    border-radius: 6.5cqw;
}

.island-card--call .island-card__main-icon {
    margin-top: 0;
}

.island-card__round-actions {
    display: flex;
    flex: 1;
    justify-content: flex-end;
    gap: 1.5cqw;
}

.island-card__round-actions button {
    width: 7.1cqw;
    height: 7.1cqw;
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
    gap: 2cqw;
    padding: 0.8cqh 2.5cqw;
    border-radius: 6cqw;
}

.island-card--mini .island-card__main-icon {
    width: 6.2cqw;
    height: 6.2cqw;
}

.island-card__state {
    margin-left: auto;
    font-size: 1.7cqh;
}

.island-card--silent {
    justify-content: center;
    gap: 2cqw;
    color: #ff5a4c;
    border-radius: 4.5cqw;
}
</style>
