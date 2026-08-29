<script setup>
import { computed, ref } from 'vue';
import {
    ChevronLeft,
    ChevronRight,
    Heart,
    Image,
    MoreHorizontal,
    Play,
    Search,
    Trash2,
    X,
} from '@lucide/vue';
import { photos, removePhoto } from '../../stores/photos';

const activeFilter = ref('Toutes');
const selectedPhoto = ref(null);
const selectedIndex = ref(0);
const touchStartX = ref(null);

const filters = ['Toutes', 'Vidéos'];

const visiblePhotos = computed(() => {
    if (activeFilter.value === 'Vidéos') return photos.value.filter(({ type }) => type === 'video');
    return photos.value;
});

const photoStyle = (photo) => ({ background: photo.gradient });

const formatPhotoDate = (photo) => new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
}).format(photo.createdAt);

const openPhoto = (photo) => {
    selectedIndex.value = visiblePhotos.value.findIndex(({ id }) => id === photo.id);
    selectedPhoto.value = photo;
};

const closePhoto = () => {
    selectedPhoto.value = null;
};

const navigatePhoto = (direction) => {
    if (!visiblePhotos.value.length) return;

    const nextIndex = selectedIndex.value + direction;
    selectedIndex.value = (nextIndex + visiblePhotos.value.length) % visiblePhotos.value.length;
    selectedPhoto.value = visiblePhotos.value[selectedIndex.value];
};

const deleteSelectedPhoto = () => {
    if (!selectedPhoto.value) return;

    const deletedId = selectedPhoto.value.id;
    removePhoto(deletedId);

    if (!visiblePhotos.value.length) {
        closePhoto();
        return;
    }

    selectedIndex.value = Math.min(selectedIndex.value, visiblePhotos.value.length - 1);
    selectedPhoto.value = visiblePhotos.value[selectedIndex.value];
};

const onTouchStart = (event) => {
    touchStartX.value = event.changedTouches[0]?.clientX ?? null;
};

const onTouchEnd = (event) => {
    if (touchStartX.value === null) return;

    const distance = event.changedTouches[0].clientX - touchStartX.value;
    touchStartX.value = null;

    if (Math.abs(distance) < 36) return;
    navigatePhoto(distance < 0 ? 1 : -1);
};
</script>

<template>
    <div class="photos-app">
        <header class="photos-header">
            <div>
                <span class="photos-header__eyebrow">Photothèque</span>
                <h1>Photos</h1>
            </div>
            <button class="photos-more" type="button" aria-label="Plus d’options">
                <MoreHorizontal :size="22" :stroke-width="2.1" />
            </button>
        </header>

        <div class="photos-filter" role="tablist" aria-label="Filtrer la photothèque">
            <button
                v-for="filter in filters"
                :key="filter"
                class="photos-filter__button"
                :class="{ 'photos-filter__button--active': activeFilter === filter }"
                type="button"
                role="tab"
                :aria-selected="activeFilter === filter"
                @click="activeFilter = filter"
            >
                {{ filter }}
            </button>
        </div>

        <main class="photos-scroll">
            <div class="photos-section-heading">
                <h2>{{ activeFilter === 'Vidéos' ? 'Vidéos' : 'Récents' }}</h2>
                <span>{{ visiblePhotos.length }} élément{{ visiblePhotos.length > 1 ? 's' : '' }}</span>
            </div>

            <div v-if="visiblePhotos.length" class="photos-grid">
                <button
                    v-for="photo in visiblePhotos"
                    :key="photo.id"
                    class="photo-card"
                    type="button"
                    :aria-label="`${photo.type === 'video' ? 'Vidéo' : 'Photo'} du ${formatPhotoDate(photo)}`"
                    @click="openPhoto(photo)"
                >
                    <span class="photo-card__image" :style="photoStyle(photo)"></span>
                    <span v-if="photo.type === 'video'" class="photo-card__video-badge">
                        <Play :size="10" :stroke-width="3" fill="currentColor" />
                    </span>
                </button>
            </div>

            <div v-else class="photos-empty">
                <div class="photos-empty__icon"><Image :size="28" :stroke-width="1.6" /></div>
                <strong>Aucune photo</strong>
                <span>Les photos et vidéos prises avec la caméra apparaîtront ici.</span>
            </div>
        </main>

        <nav class="photos-bottom-nav" aria-label="Navigation Photos">
            <button class="photos-bottom-nav__item photos-bottom-nav__item--active" type="button">
                <Image :size="19" :stroke-width="2" />
                <span>Photothèque</span>
            </button>
            <button class="photos-bottom-nav__item" type="button">
                <Heart :size="19" :stroke-width="2" />
                <span>Pour vous</span>
            </button>
            <button class="photos-bottom-nav__item" type="button">
                <Search :size="19" :stroke-width="2" />
                <span>Rechercher</span>
            </button>
        </nav>

        <Transition name="photo-viewer">
            <div
                v-if="selectedPhoto"
                class="photo-viewer"
                @click.self="closePhoto"
                @touchstart="onTouchStart"
                @touchend="onTouchEnd"
            >
                <div class="photo-viewer__topbar">
                    <button class="photo-viewer__button" type="button" aria-label="Fermer" @click="closePhoto">
                        <X :size="21" :stroke-width="2.2" />
                    </button>
                    <div class="photo-viewer__counter">{{ selectedIndex + 1 }} / {{ visiblePhotos.length }}</div>
                    <button class="photo-viewer__button" type="button" aria-label="Plus d’options">
                        <MoreHorizontal :size="21" :stroke-width="2.2" />
                    </button>
                </div>

                <div class="photo-viewer__stage">
                    <button class="photo-viewer__arrow photo-viewer__arrow--left" type="button" aria-label="Photo précédente" @click.stop="navigatePhoto(-1)">
                        <ChevronLeft :size="24" :stroke-width="2.1" />
                    </button>
                    <div class="photo-viewer__photo" :style="photoStyle(selectedPhoto)">
                        <span v-if="selectedPhoto.type === 'video'" class="photo-viewer__video-label">
                            <Play :size="13" :stroke-width="2.5" fill="currentColor" /> Vidéo
                        </span>
                    </div>
                    <button class="photo-viewer__arrow photo-viewer__arrow--right" type="button" aria-label="Photo suivante" @click.stop="navigatePhoto(1)">
                        <ChevronRight :size="24" :stroke-width="2.1" />
                    </button>
                </div>

                <div class="photo-viewer__bottombar">
                    <div class="photo-viewer__details">
                        <strong>{{ selectedPhoto.type === 'video' ? 'Vidéo' : 'Photo' }}</strong>
                        <span>{{ formatPhotoDate(selectedPhoto) }}</span>
                    </div>
                    <button class="photo-viewer__delete" type="button" @click="deleteSelectedPhoto">
                        <Trash2 :size="18" :stroke-width="2" />
                        <span>Supprimer</span>
                    </button>
                </div>
            </div>
        </Transition>
    </div>
</template>

<style lang="scss">
.photos-app {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow: hidden;
    color: #111113;
    background: #f2f2f7;
    font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif;
    user-select: none;
}

.photos-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 11cqh 5cqw 1.6cqh;

    &__eyebrow {
        color: #8e8e93;
        font-size: 1.45cqh;
        font-weight: 600;
        letter-spacing: 0.03em;
        text-transform: uppercase;
    }

    h1 {
        margin: 0.2cqh 0 0;
        font-size: 5.8cqh;
        font-weight: 700;
        letter-spacing: -0.04em;
    }
}

.photos-more,
.photos-filter__button,
.photos-bottom-nav__item,
.photo-card,
.photo-viewer__button,
.photo-viewer__arrow,
.photo-viewer__delete {
    padding: 0;
    border: 0;
    font-family: inherit;
    cursor: pointer;
}

.photos-more {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 9cqw;
    height: 9cqw;
    margin-bottom: 0.6cqh;
    border-radius: 50%;
    color: #3478f6;
    background: rgba(52, 120, 246, 0.1);
}

.photos-filter {
    display: flex;
    gap: 1cqw;
    box-sizing: border-box;
    padding: 0 5cqw 1.8cqh;
    overflow-x: auto;

    &::-webkit-scrollbar { display: none; }
}

.photos-filter__button {
    flex: 0 0 auto;
    padding: 0.85cqh 3.5cqw;
    border-radius: 999px;
    color: #606066;
    font-size: 1.6cqh;
    font-weight: 600;
    background: #e5e5ea;

    &--active {
        color: #fff;
        background: #3478f6;
    }
}

.photos-scroll {
    flex: 1;
    min-height: 0;
    padding: 0 3.5cqw 15cqh;
    overflow-y: auto;

    &::-webkit-scrollbar { width: 0; }
}

.photos-section-heading {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    padding: 1.5cqh 1.5cqw 1.1cqh;

    h2 {
        margin: 0;
        font-size: 2.8cqh;
        font-weight: 700;
        letter-spacing: -0.02em;
    }

    span {
        color: #8e8e93;
        font-size: 1.35cqh;
    }
}

.photos-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.7cqw;
}

.photo-card {
    position: relative;
    aspect-ratio: 1;
    overflow: hidden;
    border-radius: 1cqw;
    background: #d1d1d6;

    &:active .photo-card__image {
        transform: scale(0.96);
    }
}

.photo-card__image {
    position: absolute;
    inset: 0;
    display: block;
    transition: transform 0.18s ease;
}

.photo-card__video-badge {
    position: absolute;
    right: 1.5cqw;
    bottom: 1.5cqw;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 4.8cqw;
    height: 4.8cqw;
    border-radius: 50%;
    color: #fff;
    background: rgba(0, 0, 0, 0.48);
}

.photos-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    min-height: 42cqh;
    padding: 5cqw;
    color: #8e8e93;
    text-align: center;

    &__icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 15cqw;
        height: 15cqw;
        margin-bottom: 2cqh;
        border-radius: 50%;
        background: #e5e5ea;
    }

    strong {
        color: #3a3a3c;
        font-size: 2.2cqh;
    }

    span {
        max-width: 75%;
        margin-top: 0.8cqh;
        font-size: 1.5cqh;
        line-height: 1.35;
    }
}

.photos-bottom-nav {
    position: absolute;
    z-index: 4;
    right: 0;
    bottom: 2.8cqh;
    left: 0;
    display: flex;
    justify-content: space-around;
    padding: 1.2cqh 7cqw 0;
    border-top: 1px solid rgba(60, 60, 67, 0.14);
    background: rgba(242, 242, 247, 0.88);
    backdrop-filter: blur(1.2cqw);
}

.photos-bottom-nav__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.6cqh;
    min-width: 20cqw;
    color: #8e8e93;
    font-size: 1.25cqh;
    background: transparent;

    &--active { color: #3478f6; }
}

.photo-viewer {
    position: absolute;
    z-index: 10;
    inset: 0;
    display: flex;
    flex-direction: column;
    color: #fff;
    background: #09090b;
}

.photo-viewer__topbar,
.photo-viewer__bottombar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    width: 100%;
    padding: 9cqh 5cqw 1.5cqh;
}

.photo-viewer__bottombar {
    align-items: flex-end;
    padding: 1.8cqh 5cqw 8cqh;
}

.photo-viewer__button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 9cqw;
    height: 9cqw;
    border-radius: 50%;
    color: #fff;
    background: rgba(255, 255, 255, 0.13);
}

.photo-viewer__counter {
    color: rgba(255, 255, 255, 0.7);
    font-size: 1.45cqh;
    font-weight: 500;
}

.photo-viewer__stage {
    position: relative;
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    min-height: 0;
}

.photo-viewer__photo {
    position: relative;
    width: 84%;
    aspect-ratio: 0.78;
    max-height: 100%;
    border-radius: 1.5cqw;
    box-shadow: 0 1.5cqh 4cqh rgba(0, 0, 0, 0.45);
}

.photo-viewer__video-label {
    position: absolute;
    right: 2.5cqw;
    bottom: 2.5cqw;
    display: inline-flex;
    align-items: center;
    gap: 1cqw;
    padding: 0.8cqh 1.8cqw;
    border-radius: 999px;
    color: #fff;
    font-size: 1.4cqh;
    font-weight: 600;
    background: rgba(0, 0, 0, 0.5);
}

.photo-viewer__arrow {
    position: absolute;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 9cqw;
    height: 9cqw;
    border-radius: 50%;
    color: #fff;
    background: rgba(255, 255, 255, 0.13);
}

.photo-viewer__arrow--left { left: 3cqw; }
.photo-viewer__arrow--right { right: 3cqw; }

.photo-viewer__details {
    display: flex;
    flex-direction: column;
    gap: 0.6cqh;

    strong { font-size: 2cqh; }
    span { color: rgba(255, 255, 255, 0.62); font-size: 1.45cqh; }
}

.photo-viewer__delete {
    display: flex;
    align-items: center;
    gap: 1.2cqw;
    color: #ff453a;
    font-size: 1.5cqh;
    font-weight: 600;
    background: transparent;
}

.photo-viewer-enter-active,
.photo-viewer-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.photo-viewer-enter-from,
.photo-viewer-leave-to {
    opacity: 0;
    transform: scale(0.96);
}
</style>
