<script setup>
import { computed, onMounted, ref } from 'vue'
import DynamicIsland from './DynamicIsland.vue';
import AirDrop from '../assets/airdrop.png';
import PhoneGreen from '../assets/phone-green.png';
import PhoneWhite from '../assets/phone-white.png';
import Inconnu from '../assets/inconnu.png';
import WeatherWidget from './widgets/WeatherWidget.vue'
import { applications } from '../config/applications';
import { X, Volume2, Video, Mic, Clock3, AudioLines, Signal } from '@lucide/vue';

const islandExamples = [
    {
        id: 'large',
        type: 'large',
        width: '88cqw',
        height: '25cqh',
    },
    {
        id: 'medium',
        type: 'medium',
        width: '88cqw',
        height: '17cqh',
    },
    {
        id: 'small',
        type: 'small',
        width: '87cqw',
        height: '8.5cqh',
    },
    {
        id: 'pill-call',
        type: 'pill',
        variant: 'call',
        label: 'pill call',
        time: '0:03',
        width: '60cqw',
        height: '6cqh',
    },
    {
        id: 'pill-timer',
        type: 'pill',
        variant: 'timer',
        label: 'pill timer',
        time: '05:00',
        width: '60cqw',
        height: '6cqh',
    },
]

const activeIslandIndex = ref(0)
const isIslandExpanded = ref(false)

const activeIsland = computed(() => islandExamples[activeIslandIndex.value])
const isPillActive = computed(() => isIslandExpanded.value && activeIsland.value.type === 'pill')
const activeApplication = ref(null)
const screenElement = ref(null)
const applicationTransitionOrigin = ref({ x: 50, y: 50 })

const applicationTransitionStyle = computed(() => ({
    '--application-origin-x': `${applicationTransitionOrigin.value.x}%`,
    '--application-origin-y': `${applicationTransitionOrigin.value.y}%`,
}))

const showIsland = (index) => {
    activeIslandIndex.value = index
    isIslandExpanded.value = true
}

const hideIsland = () => {
    isIslandExpanded.value = false
}

const openApplication = (application, event) => {
    if (!application.component) {
        console.warn(`Aucun composant n'est configuré pour l'application : ${application.id}`)
        return
    }

    const screenRect = screenElement.value?.getBoundingClientRect()
    const applicationRect = event?.currentTarget?.getBoundingClientRect()

    if (screenRect && applicationRect) {
        applicationTransitionOrigin.value = {
            x: ((applicationRect.left + applicationRect.width / 2 - screenRect.left) / screenRect.width) * 100,
            y: ((applicationRect.top + applicationRect.height / 2 - screenRect.top) / screenRect.height) * 100,
        }
    }

    activeApplication.value = application
}

const closeApplication = () => {
    activeApplication.value = null
}

</script>

<template>
    <div class="dev-island-controls">
        <button class="dev-island-controls__button" type="button" @click="hideIsland">
            Masquer
        </button>

        <button v-for="(island, index) in islandExamples" :key="island.id" class="dev-island-controls__button"
            :class="{ 'dev-island-controls__button--active': activeIslandIndex === index }" type="button"
            @click="showIsland(index)">
            {{ island.label ?? island.type }}
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

        <div ref="screenElement" class="screen">
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
                                    <div class="medium-image">
                                        <img :src="Inconnu" alt="Inconnu" />
                                    </div>
                                    <div class="medium-text">
                                        <span>John McKenzie</span>
                                        <span>00:33</span>
                                    </div>
                                </div>
                                <div class="medium-bottom">
                                    <div class="medium-button">
                                        <Video size="3cqh" color="white" />
                                    </div>
                                    <div class="medium-button">
                                        <Mic size="3cqh" color="white" />
                                    </div>
                                    <div class="medium-button">
                                        <Volume2 size="3cqh" color="white" />
                                    </div>
                                    <div class="medium-button" id="last">
                                        <X size="3cqh" color="white" />
                                    </div>
                                </div>
                            </section>

                            <!-- Dynamic Island small : fond petit format. Ajoute tes divs dedans. -->
                            <section v-else-if="activeIsland.type === 'small'" key="small"
                                class="island-layout island-layout--small">
                                <div class="left-part">

                                </div>
                                <div class="right-part">
                                    <div class="x-call">
                                        <img :src="PhoneWhite" alt="">
                                    </div>
                                    <div class="x-call">
                                        <img :src="PhoneWhite" alt="">
                                    </div>
                                </div>
                            </section>

                            <!-- Dynamic Island pill : fond très compact. Ajoute tes divs dedans. -->
                            <section v-else :key="`pill-${activeIsland.variant}`"
                                :class="['island-layout', 'island-layout--pill', `island-layout--pill-${activeIsland.variant}`]">
                                <template v-if="activeIsland.variant === 'call'">
                                    <div class="pill-left">
                                        <img :src="PhoneGreen" alt="Appel en cours" />
                                        <span>{{ activeIsland.time }}</span>
                                    </div>

                                    <div class="pill-right">
                                        <AudioLines size="3.5cqh" color="rgb(255, 255, 255)" />
                                    </div>
                                </template>

                                <div v-else-if="activeIsland.variant === 'timer'" class="pill-timer">
                                    <Clock3 size="3cqh" color="rgb(255, 190, 72)" />
                                    <span class="pill-timer__time">{{ activeIsland.time }}</span>
                                </div>
                            </section>
                        </Transition>
                    </template>
                </DynamicIsland>

                <div v-show="!isPillActive" class="utils">
                    <svg class="!block shrink-0 text-current w-6 max-h-none max-w-none" viewBox="0 0 18 12" fill="none"
                        preserveAspectRatio="xMidYMid meet" aria-label="cellular-signal">
                        <rect x="0.5" y="8.6" width="2.8" height="2.9" rx="0.8" fill="currentColor" opacity="1"></rect>
                        <rect x="4.8" y="6.5" width="2.8" height="5" rx="0.8" fill="currentColor" opacity="1"></rect>
                        <rect x="9.1" y="4.2" width="2.8" height="7.3" rx="0.8" fill="currentColor" opacity="1"></rect>
                        <rect x="13.4" y="1.4" width="2.8" height="10.1" rx="0.8" fill="currentColor" opacity="1">
                        </rect>
                    </svg>
                    <svg width="86" height="20" viewBox="0 0 112 60" xmlns="http://www.w3.org/2000/svg" role="img">
                        <rect x="6" y="6" width="84" height="48" rx="10" fill="none" stroke="#C7C7CC"
                            stroke-width="5" />
                        <rect x="94" y="20" width="8" height="20" rx="3" fill="#C7C7CC" />
                        <rect x="14" y="14" width="68" height="32" rx="6" fill="#FFFFFF" />
                        <text x="48" y="29" font-size="29" font-weight="700"
                            font-family="-apple-system, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif"
                            fill="#1D1D1F" text-anchor="middle" dominant-baseline="central">100</text>
                    </svg>
                </div>
            </div>

            <div class="center">
                <div class="home-screen">
                    <div class="app" :class="{ 'app--widget': application.size === 'widget' }"
                        v-for="application in applications" :key="application.id">
                        <div class="application" role="button" tabindex="0"
                            @click="openApplication(application, $event)">
                            <WeatherWidget v-if="application.id === 'weather'" :application="application" />

                            <template v-else>
                                <img :src="application.icon" :alt="application.name" />
                                <span>{{ application.name }}</span>
                            </template>
                        </div>
                    </div>
                </div>
            </div>

            <Transition name="application-open">
                <div v-if="activeApplication" class="application-overlay" :style="applicationTransitionStyle">
                    <component :is="activeApplication.component" :application="activeApplication" />
                </div>
            </Transition>

            <div class="bottom" @click="closeApplication">
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
    background: url('../assets/wallpapers/background42.png');
    background-size: cover;
    background-repeat: no-repeat;

    .top {
        position: absolute;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        padding: 0 8cqw;
        width: 100%;
        height: 8.65cqh;
        user-select: none;
        color: white;
        font-size: 2.1cqh;
        z-index: 20;
        border-radius: 13.4cqw 13.4cqw 0 0;

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
            justify-content: center;
            align-items: center;
            gap: 1cqw;
            width: 16cqw;
            height: 4.33cqh;
        }
    }

    .center {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: end;
        width: 100%;
        border-radius: 13.4cqw;
        height: 98.1cqh;
        // background: rgba(5, 98, 237, 0.5);

        .home-screen {
            position: relative;
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            grid-auto-rows: min-content;
            gap: 2.5cqh 2cqw;
            align-items: start;
            justify-items: center;
            box-sizing: border-box;
            padding: 3cqh 5cqw 4cqh;
            width: 100%;
            height: calc(100% - 8.65cqh);
            border-radius: 0 0 13.4cqw 13.4cqw;

            .app {
                position: relative;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                width: 21.5cqw;
                height: 21.5cqw;
                border-radius: 2cqw;
                // background-color: rgb(141, 105, 105);

                .application {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    gap: 0.6cqh;
                    width: 100%;
                    height: 100%;
                    border-radius: 2cqw;
                    // background-color: rgb(80, 16, 198);

                    &:hover {
                        cursor: pointer;
                    }

                    >img {
                        position: relative;
                        width: auto;
                        height: 15.5cqw;
                        border-radius: 3.4cqw;
                        object-fit: contain;
                    }

                    >span {
                        position: relative;
                        display: block;
                        width: 100%;
                        text-align: center;
                        font-size: 1.45cqh;
                        font-weight: 400;
                        letter-spacing: 0.1cqw;
                        color: #fff;
                        text-shadow: 0 0 .3125rem #00000059;
                    }
                }
            }

            .app--widget {
                grid-column: 1 / span 2;
                grid-row: 1 / span 2;

                width: 100%;
                height: 100%;
            }

        }
    }

    .bottom {
        position: absolute;
        z-index: 20;
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

    .application-overlay {
        position: absolute;
        z-index: 15;
        inset: 0;
        overflow: hidden;
        border-radius: 13.4cqw;
        background: rgb(12, 12, 14);
        transform-origin: var(--application-origin-x, 50%) var(--application-origin-y, 50%);
    }

    .application-overlay__close {
        position: absolute;
        z-index: 2;
        top: 1.5cqh;
        right: 4cqw;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 6cqw;
        height: 6cqw;
        padding: 0;
        border: 0;
        border-radius: 50%;
        color: white;
        background: rgba(0, 0, 0, 0.35);
        cursor: pointer;
    }

    .application-open-enter-active,
    .application-open-leave-active {
        transition: opacity 0.28s ease, transform 0.28s ease;
    }

    .application-open-enter-from,
    .application-open-leave-to {
        opacity: 0;
        transform: scale(0.08);
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
    justify-content: space-between;
    flex-direction: column;
    align-items: stretch;
    padding: 3cqh 4cqw 2.5cqh;
    user-select: none;
    border-radius: 7.5cqw;

    .large-top {
        position: relative;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex: 1;
        min-height: 0;
        width: 100%;

        .island-left-part {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
            gap: 0.45cqh;
            box-sizing: border-box;
            width: 100%;
            height: auto;

            img {
                position: relative;
                width: 10cqw;
                height: 10cqw;
                border-radius: 50%;
                margin-bottom: 0.35cqh;
                object-fit: contain;
            }

            h2 {
                margin: 0;
                margin-bottom: 0.15cqh;
                font-size: 2.5cqh;
                font-weight: 600;
                line-height: 1;
            }

            .texte {
                display: block;
                width: 100%;
                max-width: 90%;
                max-height: 5.5cqh;
                overflow: hidden;
                font-size: 1.8cqh;
                font-weight: 400;
                line-height: 1.15;
                color: rgb(255, 255, 255, 0.6);
            }
        }
    }

    .large-bottom {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 0 0 auto;
        gap: 2.5cqw;
        width: 100%;

        .button-first {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 38cqw;
            height: 5cqh;
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
            height: 5cqh;
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
    user-select: none;
    align-items: center;
    border-radius: 7cqw;

    .medium-top {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: start;
        width: 100%;
        height: 52%;

        .medium-image {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-left: 1.5cqw;
            margin-top: 0.25cqh;
            width: 20%;
            height: 100%;

            img {
                position: relative;
                width: 11.75cqw;
                height: 11.75cqw;
                border-radius: 50%;
                object-fit: contain;
            }
        }

        .medium-text {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            gap: 0.5cqh;
            width: 80%;
            height: 60%;
            margin: 4.6cqw 0 0 0;
            font-size: 1.65cqh;
            font-weight: 500;

            span:first-child {
                font-size: 2cqh;
                font-weight: 600;
                line-height: 1;
            }

            span:last-child {
                font-size: 1.8cqh;
                font-weight: 450;
                line-height: 1.15;
                color: rgb(255, 255, 255, 0.6);
            }
        }
    }

    .medium-bottom {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: start;
        gap: 10cqw;
        width: 100%;
        height: 48%;
        // background-color: rgba(14, 180, 14);

        .medium-button {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 12.5cqw;
            height: 12.5cqw;
            border-radius: 50%;
            background-color: rgb(51, 51, 51);

            img {
                position: relative;
                width: 100%;
                height: 5.5cqw;
                border-radius: 50%;
                object-fit: contain;
                filter: invert(1);
            }


        }

        #last {
            background: linear-gradient(145deg, rgb(163, 54, 54), rgb(190, 115, 115));
        }
    }
}

.island-layout--small {
    display: flex;
    border-radius: 6cqw;

    .left-part {
        display: flex;
        width: 63%;
        height: 100%;
        background-color: green;
    }

    .right-part {
        display: flex;
        justify-content: space-around;
        align-items: center;
        width: 37%;
        height: 100%;
        // background-color: red;

        .x-call {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 6cqh;
            height: 6cqh;
            border-radius: 50%;
            background-color: red;

            img {
                width: auto;
                height: 3.5cqh;
            }
        }
    }
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

    .pill-timer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        padding: 0 4cqw;
        width: 100%;
        height: 100%;
        color: rgb(255, 190, 72);
        font-size: 1.65cqh;
        font-weight: 600;
    }

    .pill-timer__icon {
        position: relative;
        width: 4.5cqw;
        height: 4.5cqw;
        border: 0.55cqw solid currentColor;
        border-radius: 50%;
        box-sizing: border-box;

        &::before,
        &::after {
            position: absolute;
            left: 50%;
            bottom: 50%;
            display: block;
            border-radius: 999px;
            content: '';
            background-color: currentColor;
            transform-origin: bottom center;
        }

        &::before {
            width: 0.45cqw;
            height: 1.5cqw;
            transform: translateX(-50%);
        }

        &::after {
            width: 1.35cqw;
            height: 0.45cqw;
            transform: translateY(50%);
        }
    }

    .pill-timer__time {
        min-width: 11cqw;
        text-align: right;
    }
}
</style>
