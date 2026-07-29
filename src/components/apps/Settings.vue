<script setup>
import { ref } from 'vue';
import { Search, ChevronRight, ChevronLeft, Volume2, Settings, ALargeSmall, Wallpaper, Phone } from '@lucide/vue';
import { iconBackgroundColors } from "../../stores/phoneSettings";

const showSoundSettings = ref(false);
const ringVolume = ref(65);
const callVolume = ref(70);
const vibrationEnabled = ref(true);

const openSoundSettings = () => {
    showSoundSettings.value = true;
};

const closeSoundSettings = () => {
    showSoundSettings.value = false;
};
</script>

<template>
    <div class="settings-app">
        <span class="title">Réglages</span>
        <div class="input-group">
            <Search class="search-icon" color="rgb(255, 255, 255, 0.8)" size="2.6cqh" />
            <input type="text" placeholder="Rechercher">
        </div>

        <div class="profil">
            <div class="pic">JM</div>
            <div class="information">
                <span class="name">John McKenzie</span>
                <span class="idphone">521756</span>
            </div>
        </div>

        <div class="container-cat">
            <div class="button" @click="openSoundSettings">
                <span class="icon" :style="{ backgroundColor: iconBackgroundColors.volume }">
                    <Volume2 size="2.5cqh" />
                </span>
                <div class="information">
                    <span class="name">Son & Vibration</span>
                    <span class="description">Changer le volume du son</span>
                </div>
                <div class="actions">
                    <ChevronRight size="2.5cqh" class="part-icon" />
                </div>
            </div>

            <div class="more-button">
                <div class="button">
                    <span class="icon" :style="{ backgroundColor: iconBackgroundColors.general }">
                        <Settings size="2.5cqh" />
                    </span>
                    <div class="information">
                        <span class="name">Général</span>
                        <span class="description">Parametres généraux de votre téléphone</span>
                    </div>
                    <div class="actions">
                        <ChevronRight size="2.5cqh" class="part-icon" />
                    </div>
                </div>
                <div class="button">
                    <span class="icon" :style="{ backgroundColor: iconBackgroundColors.size }">
                        <ALargeSmall size="2.5cqh" />
                    </span>
                    <div class="information">
                        <span class="name">Taille & Luminosité</span>
                        <span class="description">Ajuster la taille & luminosité</span>
                    </div>
                    <div class="actions">
                        <ChevronRight size="2.5cqh" class="part-icon" />
                    </div>
                </div>
                <div class="button">
                    <span class="icon" :style="{ backgroundColor: iconBackgroundColors.wallpaper }">
                        <Wallpaper size="2.5cqh" />
                    </span>
                    <div class="information">
                        <span class="name">Fond d'écran</span>
                        <span class="description">Changer le fond d'écran de votre téléphone</span>
                    </div>
                    <div class="actions">
                        <ChevronRight size="2.5cqh" class="part-icon" />
                    </div>
                </div>
            </div>

            <div class="button">
                <span class="icon" :style="{ backgroundColor: iconBackgroundColors.phone }">
                    <Phone size="2.5cqh" />
                </span>
                <div class="information">
                    <span class="name">Téléphone</span>
                    <span class="description">Contact bloqué & numéro</span>
                </div>
                <div class="actions">
                    <ChevronRight size="2.5cqh" class="part-icon" />
                </div>
            </div>
        </div>

        <Transition name="slide-left">
            <section v-if="showSoundSettings" class="settings-detail">
                <div class="detail-header">
                    <button type="button" class="detail-back" @click="closeSoundSettings">
                        <ChevronLeft size="2.5cqh" />
                    </button>
                    <div class="detail-title-group">
                        <span class="detail-title">Son et vibration</span>
                        <span class="detail-subtitle">Volume des appels & alertes</span>
                    </div>
                </div>

                <div class="detail-card">
                    <div class="detail-row">
                        <div class="detail-row__label">
                            <span class="name">Sonnerie et alertes</span>
                            <span class="description">{{ ringVolume }}%</span>
                        </div>
                        <input type="range" min="0" max="100" v-model="ringVolume" />
                    </div>

                    <div class="detail-row">
                        <div class="detail-row__label">
                            <span class="name">Volume des appels</span>
                            <span class="description">{{ callVolume }}%</span>
                        </div>
                        <input type="range" min="0" max="100" v-model="callVolume" />
                    </div>

                    <div class="toggle-row">
                        <span class="name">Vibration</span>
                        <label class="switch">
                            <input type="checkbox" v-model="vibrationEnabled" />
                            <span class="switch-thumb"></span>
                        </label>
                    </div>
                </div>
            </section>
        </Transition>
    </div>
</template>

<style lang="scss">
.settings-app {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    max-height: 100%;
    box-sizing: border-box;
    user-select: none;
    padding: 15cqw 3cqh 0cqw;
    background-color: rgb(10, 10, 10);

    .title {
        font-size: 8cqw;
        font-weight: 600;
        flex-shrink: 0;
    }

    .input-group {
        position: relative;
        display: flex;
        margin-top: 1cqh;
        width: 100%;
        flex-shrink: 0;

        input[type=text] {
            width: 100%;
            height: 5cqh;
            border: none;
            padding-left: 10cqw;
            color: white;
            border-radius: 2.5cqw;
            font-size: 1.8cqh;
            font-family: "SF Pro";
            background-color: rgba(50, 50, 50, 0.5);
            outline: none;

            &::placeholder {
                color: rgba(255, 255, 255, 0.6);
            }
        }

        .search-icon {
            position: absolute;
            left: 2cqw;
            top: 1.18cqh;
            pointer-events: none;
        }
    }

    .profil {
        display: flex;
        align-items: center;
        margin-top: 1.5cqh;
        box-sizing: border-box;
        padding: 0 0 0 1.5cqh;
        width: 100%;
        gap: 3cqw;
        height: 9cqh;
        border-radius: 1.2cqh;
        background-color: rgb(28, 28, 28);

        .pic {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 6.5cqh;
            font-size: 2.75cqh;
            height: 6.5cqh;
            border-radius: 50%;
            background: linear-gradient(145deg, rgb(90, 90, 90), rgb(50, 50, 50));
        }

        .information {
            display: flex;
            flex-direction: column;
            justify-content: center;
            width: 75%;
            height: 100%;

            .name {
                font-size: 2.2cqh;
                font-weight: 500;
                line-height: 1.5;
                color: white;
            }

            .idphone {
                font-size: 1.7cqh;
                color: rgba(255, 255, 255, 0.6);
            }
        }
    }

    .container-cat {
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        padding: 3.5cqh 0 0 0;
        width: 100%;
        height: 75%;

        .button {
            display: flex;
            align-items: center;
            box-sizing: border-box;
            padding: 0 0 0 1.75cqh;
            width: 100%;
            height: 8cqh;
            transition: all ease-in-out 0.15s;
            border-radius: 4cqw;
            background-color: rgb(30, 30, 30);

            .icon {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 4.5cqh;
                height: 4.5cqh;
                border-radius: 3cqw;
                color: white;
                flex-shrink: 0;
                background-color: blue;
            }

            .actions {
                display: flex;
                align-items: center;
                gap: 1.2cqw;
                margin-left: auto;
                margin-right: 1.5cqh;
            }

            .color-picker {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 3.2cqh;
                height: 3.2cqh;
                border-radius: 50%;
                padding: 0.25cqh;
                background-color: rgba(255, 255, 255, 0.08);
                border: 1px solid rgba(255, 255, 255, 0.15);
                overflow: hidden;

                input {
                    width: 100%;
                    height: 100%;
                    padding: 0;
                    border: none;
                    background: transparent;
                    cursor: pointer;
                }
            }

            .information {
                display: flex;
                flex-direction: column;
                justify-content: center;
                margin-left: 3.5cqw;
                width: 70%;
                height: 100%;

                .name {
                    font-size: 2cqh;
                    color: white;
                }

                .description {
                    font-size: 1.5cqh;
                    color: rgba(255, 255, 255, 0.5);
                }
            }

            .part-icon {
                margin-left: 4cqw;
                color: rgba(255, 255, 255, 0.65);
            }

            &:hover {
                cursor: pointer;
                background-color: rgb(35, 35, 35);
            }
        }

        .more-button {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            width: 100%;
            height: 45%;

            .button:first-child {
                border-bottom-left-radius: 0px;
                border-bottom-right-radius: 0px;
                border-bottom: 1px rgb(90, 90, 90) solid;
            }

            .button:nth-child(2) {
                border-radius: 0;
            }

            .button:last-child {
                border-top-left-radius: 0px;
                border-top-right-radius: 0px;
                border-top: 1px rgb(90, 90, 90) solid;
            }
        }
    }

    .settings-detail {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        padding: 15cqw 3cqh 0cqw;
        background: rgb(10, 10, 10);
        color: white;
        z-index: 5;
        border-radius: 0;
        box-sizing: border-box;
    }

    .settings-detail .detail-header {
        display: flex;
        align-items: center;
        gap: 3cqw;
        margin-bottom: 2.5cqh;
    }

    .detail-back {
        border: none;
        background: #E5E5EA;
        color: rgb(28, 28, 30);
        width: 5.2cqh;
        height: 5.2cqh;
        border-radius: 50%;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }

    .detail-title-group {
        display: flex;
        flex-direction: column;
        gap: 0.4cqh;
    }

    .detail-title {
        font-size: 2.4cqh;
        font-weight: 600;
        color: rgb(28, 28, 30);
    }

    .detail-subtitle {
        font-size: 1.5cqh;
        color: rgba(60, 60, 67, 0.65);
    }

        .detail-card {
            display: flex;
            flex-direction: column;
            gap: 2cqh;
            padding: 2.5cqh 1.5cqw;
            border-radius: 3.5cqw;
            background-color: rgb(24, 24, 24);
            width: 100%;
            flex: 1;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.18);
            box-sizing: border-box;
        }

        .detail-row {
            display: flex;
            flex-direction: column;
            gap: 1.2cqh;
            padding-bottom: 2.2cqh;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .detail-row:last-child {
            border-bottom: none;
        }

        .detail-row__label,
        .toggle-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 2cqw;
        }

        .detail-row__label .name,
        .toggle-row .name {
            font-size: 1.95cqh;
            color: white;
        }

        .detail-row__label .description {
            font-size: 1.5cqh;
            color: rgba(255, 255, 255, 0.6);
        }

        input[type=range] {
            width: 100%;
            appearance: none;
            background: transparent;
            margin: 0;
            height: 2cqh;
        }

        input[type=range]::-webkit-slider-runnable-track {
            width: 100%;
            height: 1.2cqh;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.12);
        }

        input[type=range]::-webkit-slider-thumb {
            appearance: none;
            width: 3.1cqh;
            height: 3.1cqh;
            border-radius: 50%;
            background: white;
            border: 1px solid rgba(255, 255, 255, 0.2);
            margin-top: -0.95cqh;
            cursor: pointer;
        }

        input[type=range]::-moz-range-track {
            width: 100%;
            height: 1.2cqh;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.12);
        }

        input[type=range]::-moz-range-thumb {
            width: 3.1cqh;
            height: 3.1cqh;
            border-radius: 50%;
            background: white;
            border: 1px solid rgba(255, 255, 255, 0.2);
            cursor: pointer;
        }

        .switch {
            position: relative;
            width: 9.5cqw;
            height: 4.5cqh;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.12);
            display: inline-flex;
            align-items: center;
            padding: 0.35cqh;
        }

        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
            position: absolute;
        }

        .switch-thumb {
            position: relative;
            width: 3.5cqh;
            height: 3.5cqh;
            border-radius: 50%;
            background: white;
            transition: transform 0.2s ease;
        }

        .switch input:checked + .switch-thumb {
            transform: translateX(4.5cqw);
        }

        .slide-left-enter-active,
        .slide-left-leave-active {
            transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.28s ease;
        }

        .slide-left-enter-from {
            transform: translateX(100%);
            opacity: 0;
        }

        .slide-left-enter-to {
            transform: translateX(0);
            opacity: 1;
        }

        .slide-left-leave-from {
            transform: translateX(0);
            opacity: 1;
        }

        .slide-left-leave-to {
            transform: translateX(-100%);
            opacity: 0;
        }
    }
</style>