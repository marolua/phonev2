<script setup>
defineProps({
    title: {
        type: String,
        default: '',
    },
    subtitle: {
        type: String,
        default: '',
    },
    compactWidth: {
        type: String,
        default: '32cqw',
    },
    compactHeight: {
        type: String,
        default: '4.8cqh',
    },
    expandedWidth: {
        type: String,
        default: '90cqw',
    },
    expandedHeight: {
        type: String,
        default: '20cqh',
    },
    expanded: {
        type: Boolean,
        default: false,
    },
    hoverable: {
        type: Boolean,
        default: true,
    },
})
</script>

<template>
    <div
        :class="[
            'dynamic-island',
            {
                'dynamic-island--expanded': expanded,
                'dynamic-island--hoverable': hoverable,
            },
        ]"
        tabindex="0"
        :style="{
            '--dynamic-island-compact-width': compactWidth,
            '--dynamic-island-compact-height': compactHeight,
            '--dynamic-island-expanded-width': expandedWidth,
            '--dynamic-island-expanded-height': expandedHeight,
        }"
    >
        <div class="dynamic-island__compact">
            <slot name="compact">
                <div class="dynamic-island__camera"></div>
            </slot>
        </div>

        <div class="dynamic-island__expanded">
            <slot name="expanded">
                <div class="dynamic-island__panel">
                    <div class="dynamic-island__main">
                        <div v-if="$slots.leading" class="dynamic-island__leading">
                            <slot name="leading"></slot>
                        </div>

                        <div class="dynamic-island__body">
                            <div v-if="$slots.title || title" class="dynamic-island__title">
                                <slot name="title">{{ title }}</slot>
                            </div>

                            <div v-if="$slots.subtitle || subtitle" class="dynamic-island__subtitle">
                                <slot name="subtitle">{{ subtitle }}</slot>
                            </div>

                            <div v-if="$slots.default" class="dynamic-island__custom">
                                <slot></slot>
                            </div>
                        </div>

                        <div v-if="$slots.media" class="dynamic-island__media">
                            <slot name="media"></slot>
                        </div>

                        <div v-if="$slots.trailing" class="dynamic-island__trailing">
                            <slot name="trailing"></slot>
                        </div>
                    </div>

                    <div v-if="$slots.actions" class="dynamic-island__actions">
                        <slot name="actions"></slot>
                    </div>
                </div>
            </slot>
        </div>
    </div>
</template>

<style lang="scss">
.dynamic-island {
    position: absolute;
    z-index: 5;
    top: 1.95cqh;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: center;
    align-items: center;
    width: var(--dynamic-island-compact-width);
    height: var(--dynamic-island-compact-height);
    overflow: hidden;
    border-radius: 50cqw;
    color: white;
    background-color: rgb(0, 0, 0);
    box-shadow: 0 0 0 rgba(0, 0, 0, 0);
    cursor: pointer;
    transition:
        top 0.3s ease-in-out,
        width 0.3s ease-in-out,
        height 0.3s ease-in-out,
        border-radius 0.3s ease-in-out,
        box-shadow 0.3s ease-in-out;

    &.dynamic-island--expanded,
    &.dynamic-island--hoverable:hover,
    &.dynamic-island--hoverable:focus-within {
        top: 1.65cqh;
        width: var(--dynamic-island-expanded-width);
        height: var(--dynamic-island-expanded-height);
        border-radius: 10cqw;
        box-shadow: 0 0.8cqh 2.5cqh rgba(0, 0, 0, 0.45);

        .dynamic-island__compact {
            opacity: 0;
            transform: scale(0.92);
        }

        .dynamic-island__expanded {
            opacity: 1;
            transform: translateY(0);
            pointer-events: auto;
        }
    }
}

.dynamic-island__compact,
.dynamic-island__expanded {
    position: absolute;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    transition:
        opacity 0.2s ease-in-out,
        transform 0.3s ease-in-out;
}

.dynamic-island__compact {
    opacity: 1;
}

.dynamic-island__expanded {
    opacity: 0;
    transform: translateY(-1cqh);
    pointer-events: none;
}

.dynamic-island__camera {
    position: absolute;
    top: 50%;
    left: 75%;
    transform: translate(-50%, -50%);
    width: 4cqw;
    height: 4cqw;
    border-radius: 50%;
    background:
        radial-gradient(#6667ac, #0000 50%) 33.3% 10% / 75% 50% no-repeat,
        #080928 radial-gradient(#454680, #0000 50%) 60% 85% / 50% 50% no-repeat;
}

.dynamic-island__panel {
    display: flex;
    flex-direction: column;
    gap: 2cqh;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 3cqh 4cqw;
}

.dynamic-island__main {
    display: flex;
    align-items: center;
    gap: 3cqw;
    min-width: 0;
    flex: 1;
}

.dynamic-island__leading,
.dynamic-island__trailing,
.dynamic-island__media {
    display: flex;
    flex-shrink: 0;
    justify-content: center;
    align-items: center;
}

.dynamic-island__body {
    display: flex;
    flex: 1;
    min-width: 0;
    flex-direction: column;
    justify-content: center;
    font-family: "SF Pro Display";
    text-align: left;
}

.dynamic-island__title {
    overflow: hidden;
    font-size: 2.3cqh;
    font-weight: 700;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.dynamic-island__subtitle {
    overflow: hidden;
    margin-top: 0.4cqh;
    color: rgba(255, 255, 255, 0.62);
    font-size: 1.7cqh;
    line-height: 1.15;
    text-overflow: ellipsis;
}

.dynamic-island__custom {
    margin-top: 0.8cqh;
}

.dynamic-island__media {
    width: 23cqw;
    height: 11cqh;
    overflow: hidden;
    border-radius: 5cqw;
    background: rgba(255, 255, 255, 0.12);
}

.dynamic-island__actions {
    display: flex;
    gap: 3cqw;
}

.dynamic-island-icon {
    display: flex;
    flex-shrink: 0;
    justify-content: center;
    align-items: center;
    width: 10cqw;
    height: 10cqw;
    border-radius: 50%;
    color: white;
    font-size: 4.2cqw;
    background: rgba(255, 255, 255, 0.14);
}

.dynamic-island-icon--gray {
    color: black;
    background: rgba(255, 255, 255, 0.72);
}

.dynamic-island-icon--green {
    background: #35c46a;
}

.dynamic-island-icon--red {
    background: #ff6b5e;
}

.dynamic-island-icon--glow {
    box-shadow: 0 0 3cqw rgba(255, 255, 255, 0.35);
}

.dynamic-island-action {
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    min-height: 6cqh;
    border: 0;
    border-radius: 8cqw;
    color: white;
    font-family: "SF Pro Display";
    font-size: 1.8cqh;
    background: rgba(255, 255, 255, 0.18);
    cursor: pointer;
}

.dynamic-island-action--blue {
    color: #4f9bff;
    background: rgba(27, 100, 180, 0.45);
}

.dynamic-island-action--red {
    background: #ff6b5e;
}

.dynamic-island-action--green {
    background: #35c46a;
}
</style>
