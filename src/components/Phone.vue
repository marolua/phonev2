<script setup>
import { computed, ref } from 'vue'
import DynamicIsland from './DynamicIsland.vue'
import AirDrop from '../assets/airdrop.png'
import PhoneGreen from '../assets/phone-green.png'
import Onde from '../assets/onde-sonore.png'
import Inconnu from '../assets/inconnu.png'
import Micro from '../assets/microphone.png'
import Volume from '../assets/volume-eleve.png'
import Camera from '../assets/camera-video.png'

const islandExamples = [
    {
        type: 'large',
        width: '91cqw',
        height: '25cqh',
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
const isIslandExpanded = ref(true)

const activeIsland = computed(() => islandExamples[activeIslandIndex.value])
const isPillActive = computed(() => isIslandExpanded.value && activeIsland.value.type === 'pill')

const showIsland = (index) => {
    activeIslandIndex.value = index
    isIslandExpanded.value = true
}
</script>

<template>
    <div class="dev-island-controls">
        <button v-for="(island, index) in islandExamples" :key="island.type" class="dev-island-controls__button"
            :class="{ 'dev-island-controls__button--active': activeIslandIndex === index }" type="button"
            @click="showIsland(index)">
            {{ island.type }}
        </button>
    </div>

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
                <div v-show="!isPillActive" class="hour">22:50</div>

                <DynamicIsland :expanded="isIslandExpanded" :expanded-width="activeIsland.width"
                    :expanded-height="activeIsland.height" :hoverable="false">
                    <template #expanded>
                        <Transition name="island-layout-swap" mode="out-in">
                            <!-- Dynamic Island large : fond grand format. Ajoute tes divs dedans. -->
                            <section v-if="activeIsland.type === 'large'" key="large"
                                class="island-layout island-layout--large">
                                <div class="large-top">
                                    <div class="island-left-part">
                                        <img :src="AirDrop" alt="AirDrop" />
                                        <h2>AirDrop</h2>
                                        <span class="texte">Pete Peterson, vous a partager son numéro de
                                            téléphone</span>
                                    </div>
                                </div>
                                <div class="large-bottom">
                                    <div class="button-first">Refuser</div>
                                    <div class="button-second">Accepter</div>
                                </div>
                            </section>

                            <!-- Dynamic Island medium : fond moyen format. Ajoute tes divs dedans. -->
                            <section v-else-if="activeIsland.type === 'medium'" key="medium"
                                class="island-layout island-layout--medium">
                                <div class="medium-top">

                                </div>
                                <div class="medium-bottom">
                                    <div class="">

                                    </div>
                                    <div class="">

                                    </div>
                                    <div class="">

                                    </div>
                                    <div class="">

                                    </div>
                                </div>
                            </section>

                            <!-- Dynamic Island small : fond petit format. Ajoute tes divs dedans. -->
                            <section v-else-if="activeIsland.type === 'small'" key="small"
                                class="island-layout island-layout--small"></section>

                            <!-- Dynamic Island pill : fond très compact. Ajoute tes divs dedans. -->
                            <section v-else key="pill" class="island-layout island-layout--pill">
                                <div class="pill-left">
                                    <img :src="PhoneGreen" alt="PhoneGreen" />
                                    <span>0:03</span>
                                </div>

                                <div class="pill-right">
                                    <img :src="Onde" alt="Onde" />
                                </div>
                            </section>
                        </Transition>
                    </template>
                </DynamicIsland>

                <div v-show="!isPillActive" class="utils"></div>
            </div>

            <div class="bottom">
                <div class="bar"></div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.dev-island-controls {
    position: fixed;
    z-index: 20;
    top: 2vh;
    left: 2vw;
    display: flex;
    gap: 0.5vw;
    padding: 0.6vw;
    border-radius: 1vw;
    background: rgba(0, 0, 0, 0.55);
    backdrop-filter: blur(0.4vw);
}

.dev-island-controls__button {
    border: 0;
    border-radius: 999px;
    padding: 0.45vw 0.8vw;
    color: rgba(255, 255, 255, 0.72);
    font-family: "SF Pro Display";
    font-size: 0.75vw;
    text-transform: capitalize;
    background: rgba(255, 255, 255, 0.12);
    cursor: pointer;
    transition:
        color 0.2s ease-in-out,
        background 0.2s ease-in-out;

    &:hover,
    &--active {
        color: white;
        background: rgba(255, 255, 255, 0.28);
    }
}

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
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    user-select: none;
    border-radius: 7.5cqw;

    .large-top {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 60%;

        .island-left-part {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            gap: 0.45cqh;
            box-sizing: border-box;
            padding-top: 1cqh;
            padding-left: 4cqw;
            width: 100%;
            height: 100%;
            // background-color: rgba(180, 14, 14);

            img {
                position: relative;
                width: 10cqw;
                height: 10cqw;
                border-radius: 50%;
                margin-bottom: 1.5cqh;
                object-fit: contain;
            }

            h2 {
                margin: 0;
                margin-bottom: 0.5cqh;
                font-size: 2.5cqh;
                font-weight: 600;
                line-height: 1;
            }

            .texte {
                display: block;
                width: 100%;
                max-width: 90%;
                max-height: 6cqh;
                overflow: hidden;
                font-size: 1.8cqh;
                font-weight: 400;
                line-height: 1.15;
                color: rgb(255, 255, 255, 0.6);
                background-color: rgba(0, 0, 0, 0.2);
            }
        }
    }

    .large-bottom {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 5cqw;
        width: 100%;
        height: 35%;

        .button-first {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 38cqw;
            height: 6cqh;
            border-radius: 3cqh;
            background-color: rgb(51, 51, 51);
            font-weight: 450;
            font-size: 1.85cqh;
        }

        .button-second {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 38cqw;
            height: 6cqh;
            border-radius: 3cqh;
            background-color: rgba(18, 53, 100);
            font-weight: 450;
            font-size: 1.85cqh;
            color: rgb(43, 112, 200);
        }
    }
}

.island-layout--medium {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    border-radius: 7cqw;

    .medium-top {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 55%;
        background-color: rgba(180, 14, 14);
    }

    .medium-bottom {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 45%;
        background-color: rgba(14, 180, 14);
    }
}

.island-layout--small {
    border-radius: 6cqw;
}

.island-layout--pill {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 5cqw;

    .pill-left {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1cqw;
        width: 32%;
        height: 100%;
        font-size: 1.65cqh;
        font-weight: 500;
        color: rgba(16, 215, 39, 0.828);

        img {
            position: relative;
            width: 5.5cqw;
            border-radius: 50%;
            transform: rotate(10deg);
            object-fit: contain;
        }
    }

    .pill-right {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 25%;
        height: 100%;

        img {
            position: relative;
            width: 9cqw;
            border-radius: 50%;
            object-fit: contain;
        }
    }
}
</style>
