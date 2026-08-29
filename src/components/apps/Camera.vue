<script setup>
import { computed, onBeforeUnmount, ref } from 'vue';
import {
    Aperture,
    Circle,
    ChevronUp,
    Image,
    RotateCcw,
    Settings2,
    SunMedium,
    Video,
    Zap,
    ZapOff,
} from '@lucide/vue';

const modes = ['VIDÉO', 'PHOTO'];
const activeMode = ref('PHOTO');
const zoom = ref(1);
const flashEnabled = ref(false);
const livePhotoEnabled = ref(true);
const showGrid = ref(false);
const isFrontCamera = ref(false);
const isCapturing = ref(false);
const isRecording = ref(false);
const recordingSeconds = ref(0);
const lastCapture = ref(null);
let recordingInterval = null;

const isVideoMode = computed(() => activeMode.value === 'VIDÉO');
const shutterLabel = computed(() => {
    if (!isVideoMode.value) return 'Prendre une photo';
    return isRecording.value ? 'Arrêter l’enregistrement' : 'Démarrer l’enregistrement';
});
const recordingTime = computed(() => {
    const minutes = Math.floor(recordingSeconds.value / 60).toString().padStart(2, '0');
    const seconds = (recordingSeconds.value % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
});

const stopRecording = () => {
    isRecording.value = false;
    recordingSeconds.value = 0;

    if (recordingInterval) {
        window.clearInterval(recordingInterval);
        recordingInterval = null;
    }
};

const selectMode = (mode) => {
    if (mode !== 'VIDÉO') stopRecording();
    activeMode.value = mode;
};

const capture = () => {
    if (isVideoMode.value) {
        if (isRecording.value) {
            stopRecording();
            return;
        }

        isRecording.value = true;
        recordingSeconds.value = 0;
        recordingInterval = window.setInterval(() => {
            recordingSeconds.value += 1;
        }, 1000);
        return;
    }

    isCapturing.value = true;
    lastCapture.value = Date.now();

    window.setTimeout(() => {
        isCapturing.value = false;
    }, 180);
};

onBeforeUnmount(stopRecording);
</script>

<template>
    <div class="camera-app" :class="{ 'camera-app--recording': isRecording }">
        <div class="camera-viewfinder" :class="{ 'camera-viewfinder--grid': showGrid }">
            <div class="viewfinder-scene" :style="{ '--camera-zoom': zoom }"></div>
            <div class="viewfinder-vignette"></div>
            <div v-if="isCapturing" class="capture-flash" aria-hidden="true"></div>

            <div v-if="isRecording" class="recording-indicator" aria-live="polite">
                <span class="recording-indicator__dot"></span>
                <span>REC</span>
                <span>{{ recordingTime }}</span>
            </div>

            <div class="camera-top-controls">
                <button class="camera-control" type="button" :class="{ 'camera-control--active': flashEnabled }"
                    :aria-label="flashEnabled ? 'Désactiver le flash' : 'Activer le flash'"
                    @click="flashEnabled = !flashEnabled">
                    <Zap v-if="!flashEnabled" :size="18" :stroke-width="2.2" />
                    <ZapOff v-else :size="18" :stroke-width="2.2" />
                </button>

                <button class="live-photo-button" type="button"
                    :class="{ 'live-photo-button--active': livePhotoEnabled }"
                    aria-label="Activer ou désactiver Live Photo" @click="livePhotoEnabled = !livePhotoEnabled">
                    <span class="live-photo-button__ring live-photo-button__ring--outer"></span>
                    <span class="live-photo-button__ring live-photo-button__ring--inner"></span>
                    <span class="live-photo-button__dot"></span>
                </button>

                <button class="camera-control" type="button" aria-label="Afficher les réglages">
                    <Settings2 :size="18" :stroke-width="2.1" />
                </button>
            </div>

            <div class="focus-reticle" aria-hidden="true">
                <span></span>
            </div>

            <div class="exposure-control" aria-label="Exposition">
                <SunMedium :size="16" :stroke-width="2" />
                <div class="exposure-control__line"><span></span></div>
            </div>

            <div class="zoom-controls" aria-label="Zoom">
                <button v-for="value in [0.5, 1, 1.5, 2, 3]" :key="value" class="zoom-button"
                    :class="{ 'zoom-button--selected': zoom === value }" type="button" @click="zoom = value">
                    {{ value === 0.5 ? '.5' : value === 1 ? '1x' : `${value}x` }}
                </button>
            </div>

            <div class="camera-bottom-panel">
                <div class="camera-modes" role="tablist" aria-label="Modes de prise de vue">
                    <button v-for="mode in modes" :key="mode" class="camera-mode"
                        :class="{ 'camera-mode--selected': activeMode === mode }" type="button" role="tab"
                        :aria-selected="activeMode === mode" @click="selectMode(mode)">
                        {{ mode }}
                    </button>
                </div>

                <div class="camera-actions">
                    <button class="camera-gallery" type="button" aria-label="Ouvrir la photothèque">
                        <div v-if="lastCapture" class="camera-gallery__capture"></div>
                        <Image v-else :size="21" :stroke-width="1.8" />
                    </button>

                    <button class="shutter-button"
                        :class="{
                            'shutter-button--video': isVideoMode,
                            'shutter-button--recording': isRecording,
                            'shutter-button--pressed': isCapturing
                        }"
                        type="button" :aria-label="shutterLabel" @click="capture">
                        <span class="shutter-button__inner">
                            <Video v-if="isVideoMode && !isRecording" :size="22" :stroke-width="2.3" />
                            <span v-else-if="isRecording" class="recording-square"></span>
                            <Circle v-else :size="27" :stroke-width="1.8" />
                        </span>
                    </button>

                    <button class="camera-flip" type="button" aria-label="Changer de caméra"
                        @click="isFrontCamera = !isFrontCamera">
                        <RotateCcw :size="23" :stroke-width="1.9" :class="{ 'camera-flip--turned': isFrontCamera }" />
                    </button>
                </div>

                <div class="camera-hints">
                    <button class="camera-hint" type="button" @click="showGrid = !showGrid">
                        <Aperture :size="14" :stroke-width="1.9" />
                        <span>{{ showGrid ? 'Grille activée' : 'Touchez pour faire la mise au point' }}</span>
                    </button>
                    <button class="camera-chevron" type="button" aria-label="Plus de contrôles">
                        <ChevronUp :size="18" :stroke-width="2" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.camera-app {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    color: #fff;
    background: #090909;
    font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif;
    user-select: none;
}

.camera-viewfinder {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    isolation: isolate;
}

.camera-viewfinder--grid::before,
.camera-viewfinder--grid::after {
    position: absolute;
    z-index: 1;
    inset: 0;
    content: "";
    pointer-events: none;
}

.camera-viewfinder--grid::before {
    background: linear-gradient(90deg, transparent 32.9%, rgba(255, 255, 255, 0.24) 33%, transparent 33.1%, transparent 66.2%, rgba(255, 255, 255, 0.24) 66.3%, transparent 66.4%),
        linear-gradient(0deg, transparent 32.9%, rgba(255, 255, 255, 0.24) 33%, transparent 33.1%, transparent 66.2%, rgba(255, 255, 255, 0.24) 66.3%, transparent 66.4%);
}

.camera-viewfinder--grid::after {
    background: rgba(255, 255, 255, 0.03);
}

.viewfinder-scene,
.viewfinder-vignette,
.capture-flash {
    position: absolute;
    inset: 0;
}

.viewfinder-scene {
    z-index: -3;
    transform: scale(var(--camera-zoom));
    background:
        radial-gradient(ellipse at 51% 32%, rgba(246, 190, 126, 0.82) 0 7%, transparent 28%),
        radial-gradient(ellipse at 78% 52%, rgba(46, 121, 142, 0.72) 0 8%, transparent 31%),
        radial-gradient(ellipse at 18% 58%, rgba(26, 72, 78, 0.9) 0 12%, transparent 35%),
        linear-gradient(143deg, #263b42 0%, #6d7e7d 28%, #c3a27c 51%, #3b656a 77%, #111c22 100%);
    filter: saturate(0.85) contrast(1.05);
    transition: transform 0.32s ease;
}

.viewfinder-scene::before,
.viewfinder-scene::after {
    position: absolute;
    content: "";
    border-radius: 50%;
    filter: blur(1.8cqw);
}

.viewfinder-scene::before {
    top: 13%;
    left: -15%;
    width: 78%;
    height: 47%;
    background: rgba(223, 178, 117, 0.34);
    transform: rotate(-22deg);
}

.viewfinder-scene::after {
    right: -17%;
    bottom: 16%;
    width: 75%;
    height: 45%;
    background: rgba(13, 62, 70, 0.55);
    transform: rotate(22deg);
}

.viewfinder-vignette {
    z-index: -2;
    pointer-events: none;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.35), transparent 22%, transparent 54%, rgba(0, 0, 0, 0.7) 100%),
        radial-gradient(ellipse at center, transparent 42%, rgba(0, 0, 0, 0.25) 100%);
}

.capture-flash {
    z-index: 10;
    background: rgba(255, 255, 255, 0.92);
    animation: camera-capture-flash 0.18s ease-out both;
    pointer-events: none;
}

.recording-indicator {
    position: absolute;
    z-index: 3;
    top: 17.5cqh;
    left: 50%;
    display: flex;
    align-items: center;
    gap: 1.2cqw;
    padding: 0.9cqh 2.4cqw;
    border-radius: 999px;
    color: #fff;
    font-size: 1.45cqh;
    font-weight: 600;
    letter-spacing: 0.04em;
    background: rgba(20, 20, 20, 0.58);
    backdrop-filter: blur(0.8cqw);
    transform: translateX(-50%);
}

.recording-indicator__dot {
    width: 1.7cqw;
    height: 1.7cqw;
    border-radius: 50%;
    background: #ff3b30;
    animation: recording-dot-pulse 1s ease-in-out infinite;
}

.camera-top-controls {
    position: absolute;
    z-index: 2;
    top: 8.5cqh;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    width: 100%;
    padding: 0 6cqw;
}

.camera-control,
.live-photo-button,
.camera-gallery,
.camera-flip,
.camera-chevron {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 0;
    color: rgba(255, 255, 255, 0.94);
    background: transparent;
    cursor: pointer;
}

.camera-control {
    width: 9cqw;
    height: 9cqw;
    border-radius: 50%;
    background: rgba(20, 20, 20, 0.38);
    backdrop-filter: blur(0.8cqw);
    transition: color 0.18s ease, background 0.18s ease, transform 0.18s ease;

    &:active {
        transform: scale(0.88);
    }

    &--active {
        color: #ffd60a;
        background: rgba(255, 214, 10, 0.2);
    }
}

.live-photo-button {
    position: relative;
    width: 8cqw;
    height: 8cqw;
    border-radius: 50%;
    opacity: 0.5;
    transition: opacity 0.2s ease, transform 0.18s ease;

    &--active {
        opacity: 1;
    }

    &:active {
        transform: scale(0.88);
    }
}

.live-photo-button__ring,
.live-photo-button__dot {
    position: absolute;
    display: block;
    border-radius: 50%;
}

.live-photo-button__ring--outer {
    inset: 0;
    border: 1.1cqw solid currentColor;
}

.live-photo-button__ring--inner {
    inset: 1.9cqw;
    border: 0.7cqw solid currentColor;
}

.live-photo-button__dot {
    inset: 3.25cqw;
    background: currentColor;
}

.focus-reticle {
    position: absolute;
    z-index: 1;
    top: 42%;
    left: 50%;
    width: 11cqw;
    height: 11cqw;
    border: 0.28cqw solid rgba(255, 214, 10, 0.8);
    transform: translate(-50%, -50%);
    opacity: 0.78;
    pointer-events: none;

    &::before,
    &::after,
    span::before,
    span::after {
        position: absolute;
        display: block;
        content: "";
        background: rgba(255, 214, 10, 0.95);
    }

    &::before,
    &::after {
        top: -0.28cqw;
        width: 2cqw;
        height: 0.28cqw;
    }

    &::before {
        left: -0.28cqw;
    }

    &::after {
        right: -0.28cqw;
    }

    span::before,
    span::after {
        bottom: -0.28cqw;
        width: 2cqw;
        height: 0.28cqw;
    }

    span::before {
        left: -0.28cqw;
    }

    span::after {
        right: -0.28cqw;
    }
}

.exposure-control {
    position: absolute;
    z-index: 2;
    top: 42%;
    left: 50%;
    display: flex;
    align-items: center;
    gap: 1.2cqw;
    color: rgba(255, 214, 10, 0.95);
    transform: translate(7cqw, -50%);
    opacity: 0.9;

    &__line {
        position: relative;
        width: 9cqw;
        height: 0.35cqw;
        background: rgba(255, 255, 255, 0.45);

        span {
            position: absolute;
            top: 50%;
            left: 45%;
            width: 1.6cqw;
            height: 1.6cqw;
            border-radius: 50%;
            background: #ffd60a;
            transform: translate(-50%, -50%);
        }
    }
}

.zoom-controls {
    position: absolute;
    z-index: 2;
    bottom: 34.5cqh;
    left: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.8cqw;
    transform: translateX(-50%);
}

.zoom-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 6cqw;
    height: 6cqw;
    padding: 0;
    border: 0;
    border-radius: 50%;
    color: #ffd60a;
    font: 500 1.35cqh "SF Pro Display", sans-serif;
    background: rgba(30, 30, 30, 0.52);
    cursor: pointer;
    transition: background 0.18s ease, color 0.18s ease, transform 0.18s ease;

    &--selected {
        color: #1c1c1e;
        background: #ffd60a;
        transform: scale(1.08);
    }

    &:active {
        transform: scale(0.92);
    }
}

.camera-bottom-panel {
    position: absolute;
    z-index: 2;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    padding: 0 5cqw 6.5cqh;
    background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.58) 15%, rgba(0, 0, 0, 0.87) 60%);
}

.camera-modes {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4.6cqw;
    width: 100%;
    margin-bottom: 2.8cqh;
    white-space: nowrap;
}

.camera-mode {
    position: relative;
    padding: 0;
    border: 0;
    color: rgba(255, 255, 255, 0.72);
    font: 600 1.55cqh "SF Pro Display", sans-serif;
    letter-spacing: 0.02em;
    background: transparent;
    cursor: pointer;
    transition: color 0.18s ease, transform 0.18s ease;

    &::after {
        position: absolute;
        right: 50%;
        bottom: -1.6cqh;
        width: 0.7cqw;
        height: 0.7cqw;
        border-radius: 50%;
        background: #ffd60a;
        content: "";
        opacity: 0;
        transform: translateX(50%);
    }

    &--selected {
        color: #ffd60a;
        transform: scale(1.06);

        &::after {
            opacity: 1;
        }
    }
}

.camera-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
}

.camera-gallery,
.camera-flip {
    width: 12cqw;
    height: 12cqw;
    border-radius: 50%;
    color: rgba(255, 255, 255, 0.92);
    background: rgba(255, 255, 255, 0.1);
    transition: transform 0.18s ease, background 0.18s ease;

    &:active {
        transform: scale(0.87);
        background: rgba(255, 255, 255, 0.2);
    }
}

.camera-gallery {
    overflow: hidden;
    border: 0.45cqw solid rgba(255, 255, 255, 0.9);
}

.camera-gallery__capture {
    width: 100%;
    height: 100%;
    background: linear-gradient(145deg, #d7b17f 0%, #5b8584 55%, #1d3237 100%);
}

.camera-flip {
    border: 0;

    svg {
        transition: transform 0.28s ease;
    }
}

.camera-flip--turned {
    transform: rotate(180deg);
}

.shutter-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 17cqw;
    height: 17cqw;
    padding: 0.65cqw;
    border: 0.45cqw solid rgba(255, 255, 255, 0.95);
    border-radius: 50%;
    background: transparent;
    cursor: pointer;
    transition: transform 0.16s ease;

    &__inner {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        color: #fff;
        background: #fff;
        transition: transform 0.16s ease, background 0.16s ease;
    }

    &--video {
        border-color: #fff;

        .shutter-button__inner {
            color: #fff;
            background: #ff3b30;
        }
    }

    &--recording {
        border-color: #ff3b30;

        .shutter-button__inner {
            color: #fff;
        }
    }

    &--pressed {
        transform: scale(0.9);

        .shutter-button__inner {
            transform: scale(0.84);
        }
    }
}

.recording-square {
    width: 4.7cqw;
    height: 4.7cqw;
    border-radius: 0.8cqw;
    background: currentColor;
}

.camera-hints {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-top: 2.1cqh;
    color: rgba(255, 255, 255, 0.66);
}

.camera-hint {
    display: inline-flex;
    align-items: center;
    gap: 1.3cqw;
    max-width: 80%;
    padding: 0;
    border: 0;
    overflow: hidden;
    color: inherit;
    font: 400 1.35cqh "SF Pro Display", sans-serif;
    text-overflow: ellipsis;
    white-space: nowrap;
    background: transparent;
    cursor: pointer;
}

.camera-chevron {
    width: 7cqw;
    height: 5cqh;
    border-radius: 1.5cqw;
    background: rgba(255, 255, 255, 0.1);
}

@keyframes camera-capture-flash {
    from {
        opacity: 0.88;
    }

    to {
        opacity: 0;
    }
}

@keyframes recording-dot-pulse {
    0%,
    100% {
        opacity: 1;
        transform: scale(1);
    }

    50% {
        opacity: 0.35;
        transform: scale(0.72);
    }
}
</style>
