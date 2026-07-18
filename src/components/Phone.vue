<script setup>
import { computed, ref } from 'vue'
import DynamicIsland from './DynamicIsland.vue';
import AirDrop from '../assets/airdrop.png';
import PhoneGreen from '../assets/phone-green.png';
import Inconnu from '../assets/inconnu.png';
import {
    X,
    Volume2,
    Video,
    Mic,
    Clock3,
    AudioLines,
    Phone as PhoneIcon,
    MessageCircle,
    Settings,
    Contact,
    Camera,
    Music,
    FileText,
    Calculator,
    Mail,
    Home,
    Megaphone,
    Image,
    Map,
    WalletCards,
    Gamepad2,
    CloudSun,
} from '@lucide/vue';

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
const isIslandExpanded = ref(true)

const activeIsland = computed(() => islandExamples[activeIslandIndex.value])
const isPillActive = computed(() => isIslandExpanded.value && activeIsland.value.type === 'pill')

const apps = [
    { name: 'Phone', icon: PhoneIcon, color: 'green' },
    { name: 'Messages', icon: MessageCircle, color: 'green' },
    { name: 'Settings', icon: Settings, color: 'dark' },
    { name: 'Contacts', icon: Contact, color: 'cream' },
    { name: 'Photos', icon: Image, color: 'photos' },
    { name: 'Camera', icon: Camera, color: 'dark' },
    { name: 'Music', icon: Music, color: 'pink' },
    { name: 'Notes', icon: FileText, color: 'yellow' },
    { name: 'Calculator', icon: Calculator, color: 'silver' },
    { name: 'Mail', icon: Mail, color: 'blue' },
    { name: 'CommBank', icon: WalletCards, color: 'yellow' },
    { name: 'Twitter', icon: MessageCircle, color: 'blue' },
    { name: 'Home', icon: Home, color: 'cream' },
    { name: 'Services', icon: Megaphone, color: 'red' },
    { name: 'Maps', icon: Map, color: 'green' },
    { name: 'Games', icon: Gamepad2, color: 'purple' },
]

const dockApps = [apps[0], apps[1], apps[5], apps[6]]

const showIsland = (index) => {
    activeIslandIndex.value = index
    isIslandExpanded.value = true
}
</script>

<template>
    <div class="dev-island-controls">
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
                                        <Video size="25" color="white" />
                                    </div>
                                    <div class="medium-button">
                                        <Mic size="23" color="white" />
                                    </div>
                                    <div class="medium-button">
                                        <Volume2 size="23" color="white" />
                                    </div>
                                    <div class="medium-button" id="last">
                                        <X size="24" color="white" />
                                    </div>
                                </div>
                            </section>

                            <!-- Dynamic Island small : fond petit format. Ajoute tes divs dedans. -->
                            <section v-else-if="activeIsland.type === 'small'" key="small"
                                class="island-layout island-layout--small"></section>

                            <!-- Dynamic Island pill : fond très compact. Ajoute tes divs dedans. -->
                            <section v-else :key="`pill-${activeIsland.variant}`"
                                :class="['island-layout', 'island-layout--pill', `island-layout--pill-${activeIsland.variant}`]">
                                <template v-if="activeIsland.variant === 'call'">
                                    <div class="pill-left">
                                        <img :src="PhoneGreen" alt="Appel en cours" />
                                        <span>{{ activeIsland.time }}</span>
                                    </div>

                                    <div class="pill-right">
                                        <AudioLines size="24" color="rgb(255, 255, 255)" />
                                    </div>
                                </template>

                                <div v-else-if="activeIsland.variant === 'timer'" class="pill-timer">
                                    <Clock3 size="22" color="rgb(255, 190, 72)" />
                                    <span class="pill-timer__time">{{ activeIsland.time }}</span>
                                </div>
                            </section>
                        </Transition>
                    </template>
                </DynamicIsland>

                <div v-show="!isPillActive" class="utils"></div>
            </div>

            <div class="center">
                <div class="home-screen">
                    <div class="app-grid">
                        <article class="weather-widget">
                            <div class="weather-widget__top">
                                <span>Melbourne</span>
                                <Map size="11" stroke-width="3" />
                            </div>
                            <strong>27°</strong>
                            <div class="weather-widget__sun">
                                <CloudSun size="17" stroke-width="1.8" />
                                <span>Sunny &amp; Clear skies</span>
                            </div>
                            <small>Weather</small>
                        </article>

                        <button v-for="app in apps" :key="app.name" class="app-icon" type="button">
                            <span :class="['app-icon__tile', `app-icon__tile--${app.color}`]">
                                <component :is="app.icon" :size="22" :stroke-width="1.9" />
                            </span>
                            <span class="app-icon__label">{{ app.name }}</span>
                        </button>
                    </div>

                    <nav class="app-dock" aria-label="Applications favorites">
                        <button v-for="app in dockApps" :key="`dock-${app.name}`" class="app-dock__item" type="button">
                            <span :class="['app-icon__tile', `app-icon__tile--${app.color}`]">
                                <component :is="app.icon" :size="21" :stroke-width="1.9" />
                            </span>
                        </button>
                    </nav>
                </div>
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
    overflow: hidden;
    background:
        linear-gradient(145deg, rgba(48, 126, 181, 0.74), rgba(64, 72, 103, 0.55) 44%, rgba(126, 75, 67, 0.75)),
        radial-gradient(circle at 22% 84%, rgba(226, 183, 112, 0.78), transparent 30%),
        linear-gradient(160deg, #9cc9d5, #314e72 58%, #5f3b3d);

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
            width: 13.7cqw;
            height: 4.33cqh;
            background-color: rgb(255, 255, 255);
        }
    }

    .center {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: stretch;
        overflow: hidden;
        top: 8.65cqh;
        width: 100%;
        border-radius: 0 0 13.4cqw 13.4cqw;
        height: 89.5cqh;
        background: rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(0.4cqw);
    }

    .home-screen {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        padding: 3.4cqh 5.5cqw 12cqh;
    }

    .app-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        grid-auto-rows: min-content;
        gap: 2.35cqh 2.3cqw;
        align-items: start;
    }

    .app-icon,
    .app-dock__item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.45cqh;
        min-width: 0;
        padding: 0;
        border: 0;
        color: white;
        font-family: inherit;
        background: transparent;
        cursor: pointer;

        &:hover .app-icon__tile {
            transform: scale(1.08);
            filter: brightness(1.12);
        }

        &:active .app-icon__tile {
            transform: scale(0.94);
        }
    }

    .app-icon__tile {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 13.5cqw;
        aspect-ratio: 1;
        border-radius: 3.2cqw;
        color: white;
        box-shadow: inset 0 0 0 0.15cqw rgba(255, 255, 255, 0.22), 0 0.5cqh 1cqw rgba(0, 0, 0, 0.22);
        transition: transform 0.16s ease, filter 0.16s ease;
    }

    .app-icon__label {
        overflow: hidden;
        width: 100%;
        font-size: 1.35cqh;
        font-weight: 500;
        line-height: 1.1;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-shadow: 0 0.15cqh 0.35cqh rgba(0, 0, 0, 0.65);
    }

    .app-icon__tile--green { background: linear-gradient(145deg, #45e674, #12a94b); }
    .app-icon__tile--dark { background: linear-gradient(145deg, #686868, #161616); }
    .app-icon__tile--cream { color: #6c6c6c; background: linear-gradient(145deg, #fffef0, #cfcfc6); }
    .app-icon__tile--photos { background: conic-gradient(from 35deg, #ffca38, #ee4c7f, #7865e8, #33b8d4, #ffca38); }
    .app-icon__tile--pink { background: linear-gradient(145deg, #ff4a88, #d40053); }
    .app-icon__tile--yellow { color: #545454; background: linear-gradient(145deg, #ffe86a, #e6ad00); }
    .app-icon__tile--silver { color: #303030; background: linear-gradient(145deg, #fafafa, #9a9a9a); }
    .app-icon__tile--blue { background: linear-gradient(145deg, #5bc9f5, #0878c9); }
    .app-icon__tile--red { background: linear-gradient(145deg, #dc4c65, #851329); }
    .app-icon__tile--purple { background: linear-gradient(145deg, #a77cff, #4d26a4); }

    .weather-widget {
        grid-column: span 2;
        grid-row: span 2;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        box-sizing: border-box;
        min-height: 29cqh;
        padding: 1.7cqh 2.4cqw 1.45cqh;
        border-radius: 3.3cqw;
        color: white;
        background: linear-gradient(160deg, rgba(24, 119, 190, 0.95), rgba(46, 101, 172, 0.8));
        box-shadow: 0 0.5cqh 1cqw rgba(0, 0, 0, 0.18), inset 0 0 0 0.15cqw rgba(255, 255, 255, 0.2);
        text-shadow: 0 0.15cqh 0.35cqh rgba(0, 0, 0, 0.2);
    }

    .weather-widget__top,
    .weather-widget__sun {
        display: flex;
        align-items: center;
    }

    .weather-widget__top {
        justify-content: space-between;
        font-size: 1.45cqh;
        font-weight: 600;
    }

    .weather-widget strong {
        margin-top: -0.3cqh;
        font-size: 6.1cqh;
        font-weight: 400;
        line-height: 0.95;
    }

    .weather-widget__sun {
        gap: 0.7cqw;
        font-size: 1.3cqh;
    }

    .weather-widget small {
        font-size: 1.15cqh;
        opacity: 0.72;
    }

    .app-dock {
        position: absolute;
        right: 5.5cqw;
        bottom: 3.2cqh;
        left: 5.5cqw;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        align-items: center;
        justify-items: center;
        box-sizing: border-box;
        height: 9.2cqh;
        padding: 1cqh 2cqw;
        border: 0.15cqw solid rgba(255, 255, 255, 0.22);
        border-radius: 3.8cqw;
        background: rgba(235, 235, 235, 0.28);
        backdrop-filter: blur(1.8cqw);
    }

    .app-dock__item {
        .app-icon__tile {
            width: 13.5cqw;
        }

        &:hover .app-icon__tile {
            transform: scale(1.08);
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
        background-color: rgba(255, 255, 255, 0.3);

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
