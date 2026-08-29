<script setup>
import { computed, ref } from 'vue';
import {
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    Heart,
    Image,
    Play,
    Search,
    Trash2,
    Video,
} from '@lucide/vue';
import { photos, removePhoto } from '../../stores/photos';

const activeFilter = ref('Toutes');
const activeCategory = ref('library');
const searchQuery = ref('');
const selectedPhoto = ref(null);
const selectedIndex = ref(0);
const touchStartX = ref(null);

const filters = ['Toutes', 'Photos', 'Vidéos'];
const categories = [
    { id: 'library', label: 'Galerie', icon: Image },
    { id: 'albums', label: 'Albums', icon: Heart },
    { id: 'search', label: 'Etudier', icon: Search },
];

const visiblePhotos = computed(() => {
    let result = photos.value;

    if (activeCategory.value === 'search' && searchQuery.value.trim()) {
        const query = searchQuery.value.trim().toLowerCase();
        result = result.filter((photo) => {
            const type = photo.type === 'video' ? 'vidéo' : 'photo';
            const date = formatPhotoDate(photo).toLowerCase();
            return `${type} ${date}`.includes(query);
        });
    }

    if (activeCategory.value === 'library') {
        if (activeFilter.value === 'Photos') result = result.filter(({ type }) => type === 'photo');
        if (activeFilter.value === 'Vidéos') result = result.filter(({ type }) => type === 'video');
    }

    return result;
});

const albumDefinitions = computed(() => [
    {
        id: 'all',
        title: 'Toutes les photos',
        count: photos.value.length,
        gradient: photos.value[0]?.gradient,
        icon: Image,
    },
    {
        id: 'photos',
        title: 'Photos',
        count: photos.value.filter(({ type }) => type === 'photo').length,
        gradient: photos.value.find(({ type }) => type === 'photo')?.gradient,
        icon: Image,
    },
    {
        id: 'videos',
        title: 'Vidéos',
        count: photos.value.filter(({ type }) => type === 'video').length,
        gradient: photos.value.find(({ type }) => type === 'video')?.gradient,
        icon: Video,
    },
]);

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

const selectCategory = (categoryId) => {
    activeCategory.value = categoryId;
    if (categoryId === 'library') activeFilter.value = 'Toutes';
};

const openAlbum = (album) => {
    activeCategory.value = 'library';
    activeFilter.value = album.id === 'videos' ? 'Vidéos' : album.id === 'photos' ? 'Photos' : 'Toutes';
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
            <span class="title">Photos</span>
        </header>

        <div v-if="activeCategory === 'library'" class="photos-filter" role="tablist" aria-label="Filtrer la photothèque">
            <button v-for="filter in filters" :key="filter" class="photos-filter__button"
                :class="{ 'photos-filter__button--active': activeFilter === filter }" type="button" role="tab"
                :aria-selected="activeFilter === filter" @click="activeFilter = filter">
                {{ filter }}
            </button>
        </div>

        <main class="photos-scroll">
            <template v-if="activeCategory === 'albums'">
                <div class="photos-section-heading albums-heading">
                    <h2>Albums</h2>
                    <span>{{ albumDefinitions.length }} albums</span>
                </div>

                <div class="albums-grid">
                    <button v-for="album in albumDefinitions" :key="album.id" class="album-card" type="button"
                        @click="openAlbum(album)">
                        <span class="album-card__cover" :style="album.gradient ? { background: album.gradient } : {}">
                            <component :is="album.icon" size="5cqw" :stroke-width="1.6" />
                        </span>
                        <span class="album-card__title">{{ album.title }}</span>
                        <span class="album-card__count">{{ album.count }} élément{{ album.count > 1 ? 's' : '' }}</span>
                    </button>
                </div>
            </template>

            <template v-else>
                <div v-if="activeCategory === 'search'" class="photos-search">
                    <Search :size="18" :stroke-width="2" />
                    <input v-model="searchQuery" type="search" placeholder="Rechercher dans Photos" />
                </div>

                <div class="photos-section-heading">
                    <h2>{{ activeCategory === 'search' ? 'Résultats' : activeFilter === 'Vidéos' ? 'Vidéos' : activeFilter === 'Photos' ? 'Photos' : 'Récents' }}</h2>
                    <span>{{ visiblePhotos.length }} élément{{ visiblePhotos.length > 1 ? 's' : '' }}</span>
                </div>

                <div v-if="visiblePhotos.length" class="photos-grid">
                    <button v-for="photo in visiblePhotos" :key="photo.id" class="photo-card" type="button"
                        :aria-label="`${photo.type === 'video' ? 'Vidéo' : 'Photo'} du ${formatPhotoDate(photo)}`"
                        @click="openPhoto(photo)">
                        <span class="photo-card__image" :style="photoStyle(photo)"></span>
                        <span v-if="photo.type === 'video'" class="photo-card__video-badge">
                            <Play :size="10" :stroke-width="3" fill="currentColor" />
                        </span>
                    </button>
                </div>

                <div v-else class="photos-empty">
                    <div class="photos-empty__icon">
                        <Image :size="28" :stroke-width="1.6" />
                    </div>
                    <strong>{{ activeCategory === 'search' && searchQuery ? 'Aucun résultat' : 'Aucune photo' }}</strong>
                    <span>Les photos et vidéos prises avec la caméra apparaîtront ici.</span>
                </div>
            </template>
        </main>

        <div class="bottom-app-photos">
            <div class="categories" aria-label="Navigation Photos">
                <button v-for="category in categories" :key="category.id" class="categorie"
                    :class="{ 'categorie-selected': activeCategory === category.id }" type="button"
                    :aria-label="category.label" @click="selectCategory(category.id)">
                    <component :is="category.icon" size="3cqh" />
                    <span>{{ category.label }}</span>
                </button>
            </div>
        </div>

        <Transition name="photo-viewer">
            <div v-if="selectedPhoto" class="photo-viewer" @click.self="closePhoto" @touchstart="onTouchStart"
                @touchend="onTouchEnd">
                <div class="photo-viewer__topbar">
                    <button class="photo-viewer__button photo-viewer__button--back" type="button" aria-label="Retour"
                        @click="closePhoto">
                        <ArrowLeft :size="18" :stroke-width="2.2" />
                    </button>
                    <div class="photo-viewer__counter">{{ selectedIndex + 1 }} / {{ visiblePhotos.length }}</div>
                </div>

                <div class="photo-viewer__stage">
                    <button class="photo-viewer__arrow photo-viewer__arrow--left" type="button"
                        aria-label="Photo précédente" @click.stop="navigatePhoto(-1)">
                        <ChevronLeft :size="24" :stroke-width="2.1" />
                    </button>
                    <div class="photo-viewer__photo" :style="photoStyle(selectedPhoto)">
                        <span v-if="selectedPhoto.type === 'video'" class="photo-viewer__video-label">
                            <Play :size="13" :stroke-width="2.5" fill="currentColor" /> Vidéo
                        </span>
                    </div>
                    <button class="photo-viewer__arrow photo-viewer__arrow--right" type="button"
                        aria-label="Photo suivante" @click.stop="navigatePhoto(1)">
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
    box-sizing: border-box;
    padding: 15cqw 3cqh 0;
    color: #fff;
    background: rgb(10, 10, 10);
    font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif;
    user-select: none;
}

.photos-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    flex-shrink: 0;
    padding-bottom: 1.5cqh;

    .title {
        font-size: 8cqw;
        font-weight: 700;
    }

}

.photos-filter__button,
.photo-card,
.photo-viewer__button,
.photo-viewer__arrow,
.photo-viewer__delete {
    padding: 0;
    border: 0;
    font-family: inherit;
    cursor: pointer;
}

.photos-filter {
    display: flex;
    gap: 1cqw;
    box-sizing: border-box;
    padding: 0 0 1.8cqh;
    overflow-x: auto;

    &::-webkit-scrollbar {
        display: none;
    }
}

.photos-filter__button {
    flex: 0 0 auto;
    padding: 0.85cqh 3.5cqw;
    border-radius: 999px;
    color: rgba(255, 255, 255, 0.62);
    font-size: 1.6cqh;
    font-weight: 600;
    background: rgba(60, 60, 60, 0.68);

    &--active {
        color: #fff;
        background: #4d8dff;
    }
}

.photos-scroll {
    flex: 1;
    min-height: 0;
    padding: 0 0 1.5cqh;
    overflow-y: auto;

    &::-webkit-scrollbar {
        width: 0;
    }
}

.photos-section-heading {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    padding: 1.5cqh 0 1.1cqh;

    h2 {
        margin: 0;
        font-size: 2.8cqh;
        font-weight: 700;
        letter-spacing: -0.02em;
    }

    span {
        color: rgba(255, 255, 255, 0.5);
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
    background: rgba(60, 60, 60, 0.6);

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
    color: rgba(255, 255, 255, 0.5);
    text-align: center;

    &__icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 15cqw;
        height: 15cqw;
        margin-bottom: 2cqh;
        border-radius: 50%;
        background: rgba(60, 60, 60, 0.68);
    }

    strong {
        color: rgba(255, 255, 255, 0.86);
        font-size: 2.2cqh;
    }

    span {
        max-width: 75%;
        margin-top: 0.8cqh;
        font-size: 1.5cqh;
        line-height: 1.35;
    }
}

.bottom-app-photos {
    display: flex;
    justify-content: center;
    width: 100%;
    min-height: 18%;
    flex-shrink: 0;
    border-radius: 6cqh;

    .categories {
        display: flex;
        justify-content: space-around;
        align-items: center;
        width: 100%;
        height: 68%;
        border-radius: 6cqh;
        background-color: rgba(51, 51, 51, 0.3);
        box-shadow:
            0 10px 26px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.85),
            inset 0 -6px 10px -6px rgba(0, 0, 0, 0.15);

        .categorie {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            gap: 0.75cqh;
            width: 30%;
            height: 90%;
            border-radius: 5.7cqh;
            border: 0;
            color: rgba(255, 255, 255, 0.8);
            font-family: "SF Pro Display";
            font-size: 1.6cqh;
            font-weight: 500;
            background: transparent;
            transition: all ease-in-out 0.2s;

            &.categorie-selected {
                color: #4d8dff;
            }

            &:hover {
                cursor: pointer;
            }
        }
    }
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

.photo-viewer__topbar {
    position: relative;
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

.photo-viewer__button--back {
    width: 5cqh;
    height: 5cqh;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(55, 55, 58, 0.95);
    box-shadow: 0 0.6cqh 1.2cqh rgba(0, 0, 0, 0.45);
}

.photo-viewer__counter {
    position: absolute;
    left: 50%;
    color: rgba(255, 255, 255, 0.7);
    font-size: 1.45cqh;
    font-weight: 500;
    transform: translateX(-50%);
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

.photo-viewer__arrow--left {
    left: 3cqw;
}

.photo-viewer__arrow--right {
    right: 3cqw;
}

.photo-viewer__details {
    display: flex;
    flex-direction: column;
    gap: 0.6cqh;

    strong {
        font-size: 2cqh;
    }

    span {
        color: rgba(255, 255, 255, 0.62);
        font-size: 1.45cqh;
    }
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
