<script setup>
import { computed, ref } from 'vue';
import {
    ArrowLeft,
    Bell,
    Check,
    ChevronRight,
    Globe,
    HardDrive,
    Image,
    Info,
    Mic,
    Plane,
    Palette,
    Search,
    ShieldCheck,
    Smartphone,
    SlidersHorizontal,
    SunMedium,
    User,
    Video,
    Volume2,
} from '@lucide/vue';
import { brightness, displayScale, selectedWallpaper } from '../../stores/phoneSettings';

const profile = {
    firstName: 'John',
    lastName: 'McKenzie',
    phoneId: '521756',
};

const activeSection = ref('home');
const search = ref('');
const airplaneMode = ref(false);
const streamerMode = ref(false);

const wallpaperModules = import.meta.glob('../../assets/wallpapers/*.png', {
    eager: true,
    import: 'default',
    query: '?url',
});

const wallpapers = Object.entries(wallpaperModules)
    .sort(([first], [second]) => {
        const firstNumber = Number(first.match(/background(\d*)\.png$/)?.[1] || 1);
        const secondNumber = Number(second.match(/background(\d*)\.png$/)?.[1] || 1);
        return firstNumber - secondNumber;
    })
    .map(([path, url]) => ({
        id: path.match(/background(\d*)\.png$/)?.[1] || '1',
        url,
    }));

const initials = computed(() => `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase());

const sections = [
    {
        id: 'notifications',
        title: 'Notifications',
        description: 'Choose which apps can send notifications',
        icon: Bell,
        color: '#ff5964',
    },
    {
        id: 'sound',
        title: 'Sound & Haptics',
        description: 'Change sounds and vibrations',
        icon: Volume2,
        color: '#ff2d7a',
    },
    {
        id: 'microphone',
        title: 'Microphone',
        description: 'Choose which microphone to use for recordings',
        icon: Mic,
        color: '#55d98b',
    },
    {
        id: 'general',
        title: 'General',
        description: 'General settings for your phone',
        icon: SlidersHorizontal,
        color: '#5e5ce6',
    },
    {
        id: 'display',
        title: 'Display & Brightness',
        description: 'Adjust display & brightness',
        icon: SunMedium,
        color: '#ffcc00',
    },
    {
        id: 'wallpaper',
        title: 'Wallpaper',
        description: 'Change wallpaper and other background settings',
        icon: Image,
        color: '#5bdaf4',
    },
    {
        id: 'face-id',
        title: 'Face ID & Passcode',
        description: 'Manage security for your phone',
        icon: ShieldCheck,
        color: '#30d158',
    },
];

const visibleSections = computed(() => {
    const query = search.value.trim().toLowerCase();
    if (!query) return sections;

    return sections.filter((section) => `${section.title} ${section.description}`.toLowerCase().includes(query));
});

const openSection = (section) => {
    activeSection.value = section;
    search.value = '';
};

const closeSection = () => {
    activeSection.value = 'home';
};

const goBack = (section) => {
    activeSection.value = section;
};
</script>

<template>
    <div class="settings-app">
        <template v-if="activeSection === 'home'">
            <span class="title">Réglages</span>

            <div class="input-group">
                <Search class="search-icon" color="rgb(255, 255, 255, 0.8)" size="2.6cqh" />
                <input v-model="search" type="text" placeholder="Rechercher">
            </div>

            <button class="profile-card" type="button" @click="openSection('general')">
                <div class="profile-avatar" aria-hidden="true">{{ initials }}</div>
                <div class="information">
                    <span class="name">{{ profile.firstName }} {{ profile.lastName }}</span>
                    <span class="idphone">{{ profile.phoneId }}</span>
                </div>
                <ChevronRight class="profile-chevron" size="2.6cqh" />
            </button>

            <div class="settings-list" role="list">
                <div class="settings-group settings-group-toggles">
                    <div class="settings-row toggle-row" role="listitem">
                        <span class="row-icon row-icon-yellow">
                            <Plane size="2.5cqh" />
                        </span>
                        <span class="row-content">
                            <strong>Mode avion</strong>
                            <small>Désactive les appels et les données cellulaires</small>
                        </span>
                        <button class="ios-toggle" :class="{ active: airplaneMode }" type="button"
                            :aria-pressed="airplaneMode" aria-label="Mode avion" @click="airplaneMode = !airplaneMode">
                            <span></span>
                        </button>
                    </div>
                    <div class="settings-row toggle-row" role="listitem">
                        <span class="row-icon row-icon-purple"><Video size="2.5cqh" /></span>
                        <span class="row-content">
                            <strong>Mode streamer</strong>
                            <small>Masque les informations sensibles</small>
                        </span>
                        <button class="ios-toggle" :class="{ active: streamerMode }" type="button"
                            :aria-pressed="streamerMode" aria-label="Mode streamer"
                            @click="streamerMode = !streamerMode">
                            <span></span>
                        </button>
                    </div>
                </div>

                <div class="settings-group">
                    <button v-for="section in visibleSections.slice(0, 3)" :key="section.id" class="settings-row"
                        type="button" role="listitem" @click="openSection(section.id)">
                        <span class="row-icon" :style="{ backgroundColor: section.color }">
                            <component :is="section.icon" size="2.5cqh" />
                        </span>
                        <span class="row-content">
                            <strong>{{ section.title }}</strong>
                            <small>{{ section.description }}</small>
                        </span>
                        <ChevronRight class="row-chevron" size="2.5cqh" />
                    </button>
                </div>

                <div class="settings-group">
                    <button v-for="section in visibleSections.slice(3)" :key="section.id" class="settings-row"
                        type="button" role="listitem" @click="openSection(section.id)">
                        <span class="row-icon" :style="{ backgroundColor: section.color }">
                            <component :is="section.icon" size="2.5cqh" />
                        </span>
                        <span class="row-content">
                            <strong>{{ section.title }}</strong>
                            <small>{{ section.description }}</small>
                        </span>
                        <ChevronRight class="row-chevron" size="2.5cqh" />
                    </button>
                </div>

                <div v-if="visibleSections.length === 0" class="no-results">
                    <Search size="5cqh" />
                    <span>Aucun réglage trouvé</span>
                </div>
            </div>
        </template>

        <template v-else-if="activeSection === 'general'">
            <div class="settings-header">
                <button type="button" class="back-button" aria-label="Retour" @click="closeSection">
                    <ArrowLeft size="2.5cqh" />
                    <span>Réglages</span>
                </button>
                <span>Général</span>
            </div>

            <div class="subpage-scroll">
                <div class="subpage-profile">
                    <div class="profile-avatar profile-avatar-large">{{ initials }}</div>
                    <strong>{{ profile.firstName }} {{ profile.lastName }}</strong>
                    <small>ID téléphone : {{ profile.phoneId }}</small>
                </div>

                <div class="ios-group">
                    <div class="info-row">
                        <span>
                            <User size="2.3cqh" /> Prénom
                        </span>
                        <strong>{{ profile.firstName }}</strong>
                    </div>
                    <div class="info-row">
                        <span>
                            <User size="2.3cqh" /> Nom
                        </span>
                        <strong>{{ profile.lastName }}</strong>
                    </div>
                    <div class="info-row">
                        <span>
                            <Smartphone size="2.3cqh" /> Numéro du téléphone
                        </span>
                        <strong>{{ profile.phoneId }}</strong>
                    </div>
                </div>

                <div class="ios-group">
                    <button class="ios-row" type="button">
                        <span class="row-icon row-icon-blue">
                            <Info size="2.3cqh" />
                        </span>
                        <span>Informations</span>
                        <ChevronRight size="2.3cqh" />
                    </button>
                    <button class="ios-row" type="button">
                        <span class="row-icon row-icon-green">
                            <Globe size="2.3cqh" />
                        </span>
                        <span>Langue et région</span>
                        <strong class="row-value">Français</strong>
                    </button>
                    <button class="ios-row" type="button">
                        <span class="row-icon row-icon-purple">
                            <HardDrive size="2.3cqh" />
                        </span>
                        <span>Stockage du téléphone</span>
                        <ChevronRight size="2.3cqh" />
                    </button>
                    <button class="ios-row" type="button">
                        <span class="row-icon row-icon-red">
                            <ShieldCheck size="2.3cqh" />
                        </span>
                        <span>Confidentialité et sécurité</span>
                        <ChevronRight size="2.3cqh" />
                    </button>
                </div>

                <small class="settings-note">Les informations affichées ici pourront être personnalisées plus
                    tard.</small>
            </div>
        </template>

        <template v-else-if="activeSection === 'wallpaper'">
            <div class="settings-header">
                <button type="button" class="back-button" aria-label="Retour" @click="closeSection">
                    <ArrowLeft size="2.5cqh" />
                    <span>Réglages</span>
                </button>
                <span>Fond d’écran</span>
            </div>

            <div class="subpage-scroll wallpaper-page">
                <p class="section-intro">Choisis un fond d’écran pour ton téléphone.</p>
                <div class="wallpaper-grid">
                    <button v-for="wallpaper in wallpapers" :key="wallpaper.url" class="wallpaper-option" type="button"
                        :class="{ selected: selectedWallpaper === wallpaper.url }"
                        :aria-label="`Fond d’écran ${wallpaper.id}`" @click="selectedWallpaper = wallpaper.url">
                        <img :src="wallpaper.url" :alt="`Fond d’écran ${wallpaper.id}`">
                        <span v-if="selectedWallpaper === wallpaper.url" class="wallpaper-check">
                            <Check size="2cqh" />
                        </span>
                    </button>
                </div>
            </div>
        </template>

        <template v-else>
            <div class="settings-header">
                <button type="button" class="back-button" aria-label="Retour" @click="closeSection">
                    <ArrowLeft size="2.5cqh" />
                    <span>Réglages</span>
                </button>
                <span>Luminosité et affichage</span>
            </div>

            <div class="subpage-scroll display-page">
                <div class="display-preview">
                    <span class="preview-small">Aa</span>
                    <span class="preview-medium">Aa</span>
                    <span class="preview-large">Aa</span>
                </div>

                <div class="ios-group slider-group">
                    <div class="slider-label">
                        <SunMedium size="2.4cqh" />
                        <span>Luminosité</span>
                        <strong>{{ brightness }}%</strong>
                    </div>
                    <input v-model.number="brightness" class="settings-slider" type="range" min="35" max="100" step="1"
                        aria-label="Luminosité">
                </div>

                <div class="ios-group slider-group">
                    <div class="slider-label">
                        <span class="small-a">A</span>
                        <span>Taille de l’affichage</span>
                        <strong>{{ displayScale }}%</strong>
                    </div>
                    <input v-model.number="displayScale" class="settings-slider display-slider" type="range" min="85"
                        max="115" step="1" aria-label="Taille de l’affichage">
                </div>

                <p class="section-intro display-help">Ces réglages sont appliqués directement à l’affichage du
                    téléphone.</p>
            </div>
        </template>
    </div>
</template>

<style lang="scss">
::-webkit-scrollbar {
    width: 0;
}

.settings-app {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    max-height: 100%;
    box-sizing: border-box;
    user-select: none;
    padding: 15cqw 3cqh 4cqh;
    overflow: hidden;
    color: white;
    background-color: rgb(10, 10, 10);
    font-family: "SF Pro";

    >* {
        position: relative;
        z-index: 1;
    }

    .title {
        flex-shrink: 0;
        margin-left: 0.5cqw;
        font-size: 8cqw;
        font-weight: 600;
        letter-spacing: -0.12cqw;
    }

    .input-group {
        position: relative;
        display: flex;
        width: 100%;
        flex-shrink: 0;
        margin-top: 1cqh;

        input[type=text] {
            width: 100%;
            height: 5cqh;
            box-sizing: border-box;
            padding-left: 10cqw;
            border: none;
            outline: none;
            border-radius: 2.5cqw;
            color: white;
            background-color: rgba(50, 50, 50, 0.5);
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
            font-family: inherit;
            font-size: 1.8cqh;
            transition: background-color 0.2s ease, box-shadow 0.2s ease;

            &:focus {
                background-color: rgba(62, 62, 65, 0.7);
                box-shadow: 0 0 0 0.2cqh rgba(10, 132, 255, 0.45);
            }

            &::placeholder {
                color: rgba(255, 255, 255, 0.6);
            }
        }

        .search-icon {
            position: absolute;
            top: 1.18cqh;
            left: 2cqw;
            pointer-events: none;
        }
    }

    .profile-card {
        display: flex;
        align-items: center;
        width: 100%;
        min-height: 10cqh;
        box-sizing: border-box;
        gap: 3cqw;
        margin-top: 1.5cqh;
        padding: 1cqh 2cqw 1cqh 1.5cqh;
        border: 0;
        border-radius: 2cqh;
        color: white;
        background: rgb(28, 28, 28);
        font-family: inherit;
        text-align: left;
        cursor: pointer;
        transition: transform 0.18s ease, background 0.18s ease;

        &:active {
            background: rgb(45, 45, 45);
            transform: scale(0.985);
        }

        .information {
            display: flex;
            justify-content: center;
            flex-direction: column;
            flex: 1;
            min-width: 0;

            .name {
                overflow: hidden;
                font-size: 2.2cqh;
                font-weight: 500;
                line-height: 1.5;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .idphone {
                color: rgba(255, 255, 255, 0.6);
                font-size: 1.7cqh;
            }
        }

        .profile-chevron,
        .row-chevron {
            flex-shrink: 0;
            color: rgba(255, 255, 255, 0.45);
        }
    }

    .profile-avatar {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 6.5cqh;
        height: 6.5cqh;
        flex-shrink: 0;
        border-radius: 50%;
        color: white;
        background: linear-gradient(145deg, #5e5ce6, #36347d);
        font-size: 2.2cqh;
        font-weight: 600;
        letter-spacing: 0.05cqw;
    }

    .settings-list {
        display: flex;
        flex-direction: column;
        gap: 2.5cqh;
        min-height: 0;
        margin-top: 2.8cqh;
        overflow-y: auto;
    }

    .settings-group {
        overflow: hidden;
        border: 0;
        border-radius: 1.9cqh;
        background: rgb(42, 42, 42);

        .settings-row {
            min-height: 8.6cqh;
            border-radius: 0;
            background: transparent;
            box-shadow: none;

            &:not(:last-child) {
                border-bottom: 1px solid rgba(255, 255, 255, 0.14);
            }
        }
    }

    .settings-group-toggles {
        .settings-row {
            min-height: 8.2cqh;
        }
    }

    .ios-toggle {
        position: relative;
        display: flex;
        align-items: center;
        width: 10.5cqh;
        height: 5.8cqh;
        flex-shrink: 0;
        padding: 0.35cqh;
        border: 0;
        border-radius: 999px;
        background: #f5f5f5;
        cursor: pointer;
        transition: background 0.2s ease;

        span {
            display: block;
            width: 5.1cqh;
            height: 5.1cqh;
            border-radius: 50%;
            background: #bdbdbd;
            box-shadow: 0 0.25cqh 0.7cqh rgba(0, 0, 0, 0.25);
            transition: transform 0.2s ease, background 0.2s ease;
        }

        &.active {
            background: #34c759;

            span {
                background: white;
                transform: translateX(4.55cqh);
            }
        }
    }

    .settings-row {
        display: flex;
        align-items: center;
        width: 100%;
        min-height: 9cqh;
        box-sizing: border-box;
        gap: 2.5cqw;
        padding: 1.2cqh 2cqw;
        border: 0;
        border-radius: 1.8cqh;
        color: white;
        background: rgba(30, 30, 30, 0.9);
        box-shadow: 0 0.6cqh 1.8cqh rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.04);
        font-family: inherit;
        text-align: left;
        cursor: pointer;
        transition: transform 0.18s ease, background 0.18s ease;

        &:active {
            background: rgba(54, 54, 54, 0.95);
            transform: scale(0.985);
        }

        .row-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 5.5cqh;
            height: 5.5cqh;
            flex-shrink: 0;
            border-radius: 1.4cqh;
            color: white;
        }

        .row-icon-yellow {
            background: #ffe033;
            color: white;
        }

        .row-icon-purple {
            background: #8173f5;
            color: white;
        }

        .row-content {
            display: flex;
            justify-content: center;
            flex-direction: column;
            flex: 1;
            min-width: 0;
            gap: 0.35cqh;

            strong {
                font-size: 1.9cqh;
                font-weight: 500;
            }

            small {
                overflow: hidden;
                color: rgba(255, 255, 255, 0.48);
                font-size: 1.45cqh;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }

    .no-results,
    .subpage-profile {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 1cqh;
        color: rgba(255, 255, 255, 0.55);
    }

    .no-results {
        padding: 8cqh 0;

        span {
            font-size: 1.8cqh;
        }
    }

    .settings-header {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 5.5cqh;
        flex-shrink: 0;
        font-size: 2.2cqh;
        font-weight: 600;

        .back-button {
            position: absolute;
            left: 0;
            display: flex;
            align-items: center;
            gap: 0.5cqw;
            justify-content: flex-start;
            width: auto;
            height: 5cqh;
            padding: 0 1cqw 0 0;
            border: 0;
            border-radius: 1.5cqh;
            color: #0a84ff;
            background: transparent;
            font-family: inherit;
            font-size: 1.75cqh;
            cursor: pointer;

            &:active {
                opacity: 0.6;
            }
        }
    }

    .subpage-scroll {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-height: 0;
        gap: 2cqh;
        margin-top: 2cqh;
        overflow-y: auto;
        padding-bottom: 2cqh;
    }

    .subpage-profile {
        padding: 1cqh 0;

        .profile-avatar-large {
            width: 14cqh;
            height: 14cqh;
            font-size: 5cqh;
        }

        strong {
            color: white;
            font-size: 2.5cqh;
        }

        small {
            font-size: 1.6cqh;
        }
    }

    .ios-group {
        overflow: hidden;
        border-radius: 1.8cqh;
        background: rgba(30, 30, 30, 0.92);
        box-shadow: 0 0.6cqh 1.8cqh rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.04);
    }

    .info-row,
    .ios-row {
        display: flex;
        align-items: center;
        min-height: 6.5cqh;
        box-sizing: border-box;
        gap: 2cqw;
        padding: 0 2cqw;
        color: white;
        font-family: inherit;
        font-size: 1.75cqh;

        &:not(:last-child) {
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        >span:first-child {
            display: flex;
            align-items: center;
            flex: 1;
            gap: 1.5cqw;
        }

        strong,
        .row-value {
            color: rgba(255, 255, 255, 0.48);
            font-size: 1.65cqh;
            font-weight: 400;
        }
    }

    .ios-row {
        width: 100%;
        border-top: 0;
        border-right: 0;
        border-left: 0;
        background: transparent;
        text-align: left;
        cursor: pointer;

        >svg {
            color: rgba(255, 255, 255, 0.42);
        }

        .row-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 4cqh;
            height: 4cqh;
            border-radius: 1cqh;
            color: white;
        }

        .row-icon-blue {
            background: #0a84ff;
        }

        .row-icon-green {
            background: #30d158;
        }

        .row-icon-purple {
            background: #af52de;
        }

        .row-icon-red {
            background: #ff453a;
        }
    }

    .settings-note,
    .section-intro {
        padding: 0 1cqw;
        color: rgba(255, 255, 255, 0.48);
        font-size: 1.55cqh;
        line-height: 1.35;
    }

    .section-intro {
        margin: 0;
    }

    .wallpaper-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 1.5cqw;
    }

    .wallpaper-option {
        position: relative;
        aspect-ratio: 9 / 18;
        overflow: hidden;
        padding: 0;
        border: 2px solid transparent;
        border-radius: 1.4cqh;
        background: #222;
        cursor: pointer;
        transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;

        &.selected {
            border-color: #0a84ff;
            box-shadow: 0 0 0 0.35cqh rgba(10, 132, 255, 0.25);
        }

        &:active {
            transform: scale(0.96);
        }

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .wallpaper-check {
            position: absolute;
            right: 0.7cqw;
            bottom: 0.7cqw;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 3.5cqh;
            height: 3.5cqh;
            border-radius: 50%;
            color: white;
            background: #0a84ff;
        }
    }

    .display-preview {
        display: flex;
        align-items: center;
        justify-content: space-around;
        height: 14cqh;
        border-radius: 2cqh;
        background: linear-gradient(135deg, #273b80, #7e2d66);

        span {
            color: white;
            font-weight: 600;
        }

        .preview-small {
            font-size: 2cqh;
        }

        .preview-medium {
            font-size: 3cqh;
        }

        .preview-large {
            font-size: 4cqh;
        }
    }

    .slider-group {
        padding: 1.5cqh 2cqw;
    }

    .slider-label {
        display: flex;
        align-items: center;
        gap: 1.5cqw;
        color: white;
        font-size: 1.8cqh;

        svg {
            color: #ffcc00;
        }

        strong {
            margin-left: auto;
            color: rgba(255, 255, 255, 0.48);
            font-size: 1.6cqh;
            font-weight: 400;
        }

        .small-a {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 2.4cqh;
            height: 2.4cqh;
            border: 1px solid rgba(255, 255, 255, 0.45);
            border-radius: 50%;
            font-size: 1.25cqh;
        }
    }

    .settings-slider {
        width: 100%;
        margin: 2cqh 0 0;
        accent-color: #ffcc00;
        cursor: pointer;
    }

    .display-slider {
        accent-color: #0a84ff;
    }

    .display-help {
        margin-top: -0.5cqh;
    }
}
</style>
