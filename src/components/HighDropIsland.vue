<script setup>
defineProps({
    iconText: {
        type: String,
        default: 'HD',
    },
    title: {
        type: String,
        default: 'HighDrop',
    },
    subtitle: {
        type: String,
        default: 'highrider would like to share 1 video',
    },
    imageSrc: {
        type: String,
        default: '',
    },
    imageAlt: {
        type: String,
        default: 'HighDrop preview',
    },
    declineText: {
        type: String,
        default: 'Decline',
    },
    acceptText: {
        type: String,
        default: 'Accept',
    },
})

defineEmits(['accept', 'decline'])
</script>

<template>
    <section class="highdrop-island-card">
        <div class="highdrop-island-card__left">
            <div class="highdrop-island-card__icon">
                <slot name="icon">{{ iconText }}</slot>
            </div>

            <div class="highdrop-island-card__copy">
                <div class="highdrop-island-card__title">{{ title }}</div>
                <div class="highdrop-island-card__subtitle">{{ subtitle }}</div>
            </div>
        </div>

        <div class="highdrop-island-card__preview">
            <slot name="image">
                <img
                    v-if="imageSrc"
                    class="highdrop-island-card__image"
                    :src="imageSrc"
                    :alt="imageAlt"
                >

                <div v-else class="highdrop-island-card__placeholder">
                    <span class="highdrop-island-card__spark highdrop-island-card__spark--left"></span>
                    <span class="highdrop-island-card__banana"></span>
                    <span class="highdrop-island-card__cloud"></span>
                    <span class="highdrop-island-card__spark highdrop-island-card__spark--right"></span>
                </div>
            </slot>
        </div>

        <div class="highdrop-island-card__actions">
            <button class="highdrop-island-card__button" @click="$emit('decline')">
                {{ declineText }}
            </button>

            <button
                class="highdrop-island-card__button highdrop-island-card__button--accept"
                @click="$emit('accept')"
            >
                {{ acceptText }}
            </button>
        </div>
    </section>
</template>

<style lang="scss">
.highdrop-island-card {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 26.5cqw;
    grid-template-rows: 1fr 4.4cqh;
    column-gap: 4cqw;
    row-gap: 1.6cqh;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 2.4cqh 4.2cqw 1.7cqh;
    border-radius: 7.5cqw;
    color: white;
    font-family: "SF Pro Display";
    background-color: rgb(0, 0, 0);
}

.highdrop-island-card__left {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    min-width: 0;
}

.highdrop-island-card__icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 8.8cqw;
    height: 8.8cqw;
    margin-left: 0.5cqw;
    border-radius: 50%;
    color: white;
    font-size: 1.6cqh;
    font-weight: 800;
    background: rgba(255, 255, 255, 0.18);
}

.highdrop-island-card__copy {
    min-width: 0;
    margin-top: 1.2cqh;
    text-align: left;
}

.highdrop-island-card__title {
    overflow: hidden;
    font-size: 2.05cqh;
    font-weight: 800;
    line-height: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.highdrop-island-card__subtitle {
    display: -webkit-box;
    overflow: hidden;
    margin-top: 0.6cqh;
    color: rgba(255, 255, 255, 0.56);
    font-size: 1.5cqh;
    font-weight: 500;
    line-height: 1.08;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

.highdrop-island-card__preview {
    display: flex;
    grid-column: 2;
    grid-row: 1 / span 2;
    justify-content: center;
    align-items: center;
    align-self: start;
    width: 100%;
    height: 13.2cqh;
    overflow: hidden;
    border-radius: 4.6cqw;
    background: #272d36;
}

.highdrop-island-card__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.highdrop-island-card__placeholder {
    position: relative;
    width: 100%;
    height: 100%;
    background: linear-gradient(145deg, #252c38, #343c4d);
}

.highdrop-island-card__banana {
    position: absolute;
    top: 27%;
    left: 47%;
    width: 4.6cqw;
    height: 2cqh;
    border-bottom: 0.75cqh solid #ffd64d;
    border-radius: 0 0 50% 50%;
    transform: translateX(-50%) rotate(-28deg);
}

.highdrop-island-card__cloud {
    position: absolute;
    top: 55%;
    left: 50%;
    width: 7.2cqw;
    height: 2.3cqh;
    border-radius: 4cqw;
    background: #9ab2ff;
    transform: translateX(-50%);

    &::before,
    &::after {
        content: '';
        position: absolute;
        bottom: 0.55cqh;
        border-radius: 50%;
        background: #9ab2ff;
    }

    &::before {
        left: 1cqw;
        width: 3.5cqw;
        height: 3.5cqw;
    }

    &::after {
        right: 1cqw;
        width: 4cqw;
        height: 4cqw;
    }
}

.highdrop-island-card__spark {
    position: absolute;
    width: 0.8cqw;
    height: 0.8cqw;
    border-radius: 50%;
    background: white;
    box-shadow:
        2.2cqw 1.2cqh 0 -0.15cqw white,
        -1.2cqw 2.6cqh 0 -0.2cqw white;
}

.highdrop-island-card__spark--left {
    top: 35%;
    left: 19%;
}

.highdrop-island-card__spark--right {
    right: 16%;
    bottom: 32%;
}

.highdrop-island-card__actions {
    display: flex;
    grid-column: 1;
    grid-row: 2;
    gap: 3cqw;
    align-self: start;
}

.highdrop-island-card__button {
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    min-height: 4.4cqh;
    border: 0;
    border-radius: 7cqw;
    color: white;
    font-family: "SF Pro Display";
    font-size: 1.55cqh;
    font-weight: 700;
    background: rgba(255, 255, 255, 0.34);
    cursor: pointer;
}

.highdrop-island-card__button--accept {
    background: #19599a;
}
</style>
