<script setup>
defineProps({
    items: {
        type: Array,
        required: true,
    },
    activeId: {
        type: String,
        default: '',
    },
    ariaLabel: {
        type: String,
        default: 'Navigation',
    },
    variant: {
        type: String,
        default: 'standard',
    },
})

const emit = defineEmits(['select'])

const getBadge = (item) => {
    const badge = typeof item.badge === 'function' ? item.badge() : item.badge
    return badge || ''
}

const selectItem = (item) => emit('select', item.id, item)
</script>

<template>
        <nav class="bottom-navigation" :class="`bottom-navigation--${variant}`" :aria-label="ariaLabel">
            <button v-for="item in items" :key="item.id" type="button" class="bottom-navigation__item"
                :class="{ 'is-active': activeId === item.id, 'is-featured': item.featured }" :aria-label="item.label"
                @click="selectItem(item)">
            <span class="bottom-navigation__icon" aria-hidden="true">
                <component :is="item.icon" :size="item.iconSize || '2.8cqh'" :stroke-width="item.strokeWidth || 2.35"
                    :fill="typeof item.fill === 'function' ? item.fill(activeId) : item.fill" />
            </span>
            <span>{{ item.label }}</span>
            <b v-if="getBadge(item)" class="bottom-navigation__badge">{{ getBadge(item) }}</b>
        </button>
    </nav>
</template>

<style scoped lang="scss">
.bottom-navigation {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    height: 68%;
    border-radius: 6cqh;
    border: 1px solid rgba(255, 255, 255, .13);
    background: rgba(30, 30, 32, .72);
    box-shadow: 0 10px 26px rgba(0, 0, 0, .24), inset 0 1px 0 rgba(255, 255, 255, .12);
    backdrop-filter: blur(18px) saturate(1.15);
}

.bottom-navigation__item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 1 30%;
    flex-direction: column;
    gap: .45cqh;
    width: 30%;
    height: 90%;
    min-width: 0;
    border: 0;
    border-radius: 2.1cqh;
    color: rgba(255, 255, 255, .58);
    background: transparent;
    font-family: "SF Pro Display";
    font-size: 1.45cqh;
    font-weight: 600;
    transition: color .2s ease, background .2s ease, transform .2s ease, box-shadow .2s ease;
    cursor: pointer;
}

.bottom-navigation__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 5.1cqh;
    height: 4.1cqh;
    border-radius: 1.45cqh;
    color: inherit;
    transition: background .2s ease, color .2s ease, transform .2s ease;
}

.bottom-navigation__item.is-active {
    color: #4d8dff;
}

.bottom-navigation__item.is-active .bottom-navigation__icon {
    color: #fff;
    background: #4d8dff;
    box-shadow: 0 .55cqh 1.3cqh rgba(77, 141, 255, .34);
}

.bottom-navigation__item.is-featured {
    color: #fff;
}

.bottom-navigation__item.is-featured .bottom-navigation__icon {
    width: 5.4cqh;
    height: 5.4cqh;
    color: #fff;
    border-radius: 50%;
    background: linear-gradient(145deg, #5b9aff, #3378e8);
    box-shadow: 0 .6cqh 1.5cqh rgba(77, 141, 255, .35);
}

.bottom-navigation__item:hover {
    color: #4d8dff;
    background: rgba(77, 141, 255, .08);
    transform: translateY(-1px);
}

.bottom-navigation__item:hover .bottom-navigation__icon {
    background: rgba(77, 141, 255, .14);
}

.bottom-navigation__item.is-active:hover .bottom-navigation__icon {
    background: #5b9aff;
}

.bottom-navigation__badge {
    position: absolute;
    top: .8cqh;
    right: 25%;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 2cqh;
    height: 2cqh;
    box-sizing: border-box;
    padding: 0 .3cqw;
    border-radius: 999px;
    color: #fff;
    background: #ff453a;
    font-size: 1cqh;
}

.bottom-navigation--services .bottom-navigation__item {
    flex-basis: 42%;
    width: 42%;
    transition: color .2s ease;
}

.bottom-navigation--kwiker {
    width: 90%;
    margin: 0 auto;
    transform: translateY(-1.3cqh);
}
</style>
