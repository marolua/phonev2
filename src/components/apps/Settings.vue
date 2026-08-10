<script setup>
import { ref } from 'vue';
import { Search, ChevronRight, Volume2, Settings, ALargeSmall, Wallpaper, Phone } from '@lucide/vue';
import { iconBackgroundColors } from "../../stores/phoneSettings";
import SettingsCategory from './SettingsCategory.vue';

const selectedCategory = ref(null);
const showCategory = ref(false);

const openCategory = (id, name) => {
    selectedCategory.value = { id, name };
    // show immediately so enter transition plays
    showCategory.value = true;
};

const closeCategory = () => {
    // hide immediately so leave transition starts — component will be removed after transition
    showCategory.value = false;
};

const onAfterLeave = () => {
    // clear data after leave to avoid stale object during transition
    selectedCategory.value = null;
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
            <div class="button" @click="openCategory('sound', 'Son & Vibration')">
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
                <div class="button" @click="openCategory('general', 'Général')">
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
                <div class="button" @click="openCategory('display', 'Taille & Luminosité')">
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
                <div class="button" @click="openCategory('wallpaper', 'Fond d\'écran')">
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

            <div class="button" @click="openCategory('phone', 'Téléphone')">
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

            <transition name="settings-slide" @after-leave="onAfterLeave">
                <SettingsCategory v-if="showCategory" :category="selectedCategory" @close="closeCategory" />
            </transition>
        </div>
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

    /* Transition for settings category: fast slide from right */
    .settings-slide-enter-active,
    .settings-slide-leave-active {
        transition: transform 0.18s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.12s ease;
    }

    .settings-slide-enter-from {
        transform: translate3d(100%, 0, 0);
        opacity: 0.01;
    }

    .settings-slide-enter-to {
        transform: translate3d(0, 0, 0);
        opacity: 1;
    }

    .settings-slide-leave-from {
        transform: translate3d(0, 0, 0);
        opacity: 1;
    }

    .settings-slide-leave-to {
        transform: translate3d(100%, 0, 0);
        opacity: 0.01;
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
}
</style>