<script setup>
import { ArrowLeft, Volume2 } from '@lucide/vue';
import { callVolume, systemVolume, selectedWallpaper } from '../../stores/phoneSettings';
import { computed } from 'vue';
const props = defineProps({
  category: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(['close']);

const close = () => emit('close');
// Load wallpapers from assets folder (eager so Vite includes them)
const wallpaperModules = import.meta.glob('../../assets/wallpapers/*.{png,jpg,jpeg}', { eager: true });
const wallpapers = Object.keys(wallpaperModules).map((k) => {
  const m = wallpaperModules[k];
  return (m && (m.default || m)) || '';
});

const currentSelected = computed(() => selectedWallpaper.value || (wallpapers.length ? wallpapers[0] : ''));

const selectWallpaper = (url) => {
  if (!url) return;
  selectedWallpaper.value = url;
};
</script>

<template>
  <div class="settings-category-page">
    <div class="detail-header">
      <button type="button" class="detail-back" @click="close" aria-label="Retour">
        <ArrowLeft size="3cqh" />
      </button>
      <span class="detail-title">{{ category.name }}</span>
    </div>

    <div class="detail-content">
      <template v-if="category.id === 'sound'">
        <div class="setting-row">
          <div class="label">Volume des appels</div>
          <div class="slider-wrap">
            <div class="slider-pill">
              <Volume2 class="speaker-icon" size="2cqh" />
              <input class="ios-range" type="range" min="0" max="100" v-model="callVolume"
                :style="{ background: `linear-gradient(90deg, #4d8dff ${callVolume}%, rgba(255,255,255,0.12) ${callVolume}%)` }" />
              <Volume2 class="speaker-icon right" size="2cqh" />
            </div>
          </div>
        </div>

        <div class="setting-row">
          <div class="label">Volume du système</div>
          <div class="slider-wrap">
            <div class="slider-pill">
              <Volume2 class="speaker-icon" size="2cqh" />
              <input class="ios-range" type="range" min="0" max="100" v-model="systemVolume"
                :style="{ background: `linear-gradient(90deg, #4d8dff ${systemVolume}%, rgba(255,255,255,0.12) ${systemVolume}%)` }" />
              <Volume2 class="speaker-icon right" size="2cqh" />
            </div>
          </div>
        </div>
      </template>

      <template v-else-if="category.id === 'wallpaper'">
        <div class="wallpaper-page">
          <div class="wallpaper-grid">
            <button
              v-for="(img, idx) in wallpapers"
              :key="idx"
              :class="['wallpaper-item', { selected: img === currentSelected }]"
              type="button"
              @click="selectWallpaper(img)">
              <img :src="img" :alt="`Fond d\'écran ${idx + 1}`" />
            </button>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="placeholder">Paramètres pour {{ category.name }} — contenu à venir.</div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.settings-category-page {
  position: absolute;
  inset: 0;
  z-index: 6;
  box-sizing: border-box;
  background: rgb(10, 10, 10);
  padding: 8cqh 5cqw 5cqh;
  display: flex;
  flex-direction: column;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 2cqw;
}

.detail-back {
  width: 5cqh;
  height: 5cqh;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(55, 55, 58, 0.95);
  box-shadow: 0 0.6cqh 1.2cqh rgba(0, 0, 0, 0.45);

  &:hover {
    cursor: pointer;
  }
}

.detail-title {
  font-size: 2.5cqh;
  font-weight: 700;
  color: white;
  margin-left: 2.5cqw;
}

.detail-content {
  margin-top: 3.5cqh;
  display: flex;
  flex-direction: column;
  gap: 0cqh;
  flex: 1 1 auto;
  overflow-y: auto;
}

.setting-row {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 1.5cqh 2cqw;
  border-radius: 1.2cqh;
}


.label {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.9cqh;
  margin-bottom: 1cqh;
}

.slider-wrap {
  display: flex;
  align-items: center;
  gap: 1cqw;
  width: 100%;
}

.slider-wrap .value {
  color: rgba(255, 255, 255, 0.7);
  min-width: 3cqh;
  text-align: right
}

.value-row {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.9cqh;
}

.speaker-icon {
  color: rgba(255, 255, 255, 0.55);
  flex-shrink: 0
}

.speaker-icon.right {
  opacity: 0.6
}

.slider-pill {
  display: flex;
  align-items: center;
  gap: 1cqw;
  width: 100%;
  padding: 3cqw 2.5cqw;
  border-radius: 2.2cqh;
  background: rgba(255, 255, 255, 0.03);
}

.slider-pill .speaker-icon {
  color: rgba(255, 255, 255, 0.65)
}

.slider-pill .ios-range {
  margin: 0 1.2cqw;
  flex: 1
}

.value-row {
  display: none
}

.placeholder {
  color: rgba(255, 255, 255, 0.7);
}

/* iOS-like range styles */
.ios-range {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 1.1cqh;
  background: transparent;
  cursor: pointer;
  border-radius: 2cqh;
}

.ios-range:focus {
  outline: none;
}

.ios-range::-webkit-slider-runnable-track {
  height: 0cqh;
  background: transparent;
  border-radius: 99px;
}

.ios-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 2.5cqh;
  height: 2.5cqh;
  margin-top: -1.25cqh;
  background: #ffffff;
  border-radius: 50%;
  box-shadow: 0 0.6cqh 1.6cqh rgba(0, 0, 0, 0.55);
  border: 0.25cqh solid rgba(0, 0, 0, 0.08);
}

.ios-range::-moz-range-track {
  height: 0.9cqh;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 99px;
}

.ios-range::-moz-range-thumb {
  width: 3.2cqh;
  height: 3.2cqh;
  background: #ffffff;
  border-radius: 50%;
  box-shadow: 0 0.4cqh 1.2cqh rgba(0, 0, 0, 0.45);
  border: 0.25cqh solid rgba(0, 0, 0, 0.08);
}

/* filled track will come from inline background style set on the input element */

.wallpaper-page {
  width: 100%;
  box-sizing: border-box;
}

.wallpaper-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.6cqw;
  padding: 1cqw 0 6cqh 0;
}

.wallpaper-item {
  border: none;
  padding: 0;
  background: transparent;
  border-radius: 1.2cqh;
  overflow: hidden;
  box-shadow: 0 0.6cqh 1.2cqh rgba(0,0,0,0.45);
  height: 28cqh;
  display: block;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}

.wallpaper-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.wallpaper-item.selected {
  transform: scale(1.03);
  box-shadow: 0 1.2cqh 2.4cqh rgba(0,0,0,0.6);
  outline: 0.5cqh solid rgba(77,141,255,0.95);
}

</style>
