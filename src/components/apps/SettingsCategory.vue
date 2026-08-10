<script setup>
import { ArrowLeft } from '@lucide/vue';
import { callVolume, systemVolume } from '../../stores/phoneSettings';
const props = defineProps({
  category: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(['close']);

const close = () => emit('close');
</script>

<template>
  <div class="settings-category-page">
    <div class="detail-header">
        <button type="button" class="detail-back" @click="close" aria-label="Retour"><ArrowLeft size="3cqh" /></button>
        <span class="detail-title">{{ category.name }}</span>
      </div>

      <div class="detail-content">
        <template v-if="category.id === 'sound'">
          <div class="setting-row">
            <div class="label">Volume des appels</div>
            <div class="slider-wrap">
              <input class="ios-range" type="range" min="0" max="100" v-model="callVolume" />
              <div class="value">{{ callVolume }}%</div>
            </div>
          </div>

          <div class="setting-row">
            <div class="label">Volume du système</div>
            <div class="slider-wrap">
              <input class="ios-range" type="range" min="0" max="100" v-model="systemVolume" />
              <div class="value">{{ systemVolume }}%</div>
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
  background: #050505;
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
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(55,55,58,0.85);
}

.detail-title {
  font-size: 2.2cqh;
  font-weight: 600;
  color: white;
}

.detail-content {
  margin-top: 3cqh;
  display: flex;
  flex-direction: column;
  gap: 2cqh;
}

.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.2cqh 2cqw;
  background: rgba(20,20,20,0.9);
  border-radius: 1.2cqh;
}

.label { color: rgba(255,255,255,0.9); font-size: 1.9cqh; }
.slider-wrap { display:flex; align-items:center; gap:1cqw; width:60%; }
.slider-wrap input[type=range] { width:100%; accent-color: #4d8dff; }
.value { color: rgba(255,255,255,0.7); min-width:3.5cqh; text-align:right }
.placeholder { color: rgba(255,255,255,0.7); }

</style>
