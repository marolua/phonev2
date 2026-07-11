<template>
    <div class="dynamic-island" tabindex="0">
        <div class="dynamic-island__compact">
            <slot name="compact">
                <div class="dynamic-island__camera"></div>
            </slot>
        </div>

        <div class="dynamic-island__expanded">
            <slot name="expanded"></slot>
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
    width: 32cqw;
    height: 4.8cqh;
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

    &:hover,
    &:focus-within {
        top: 1.1cqh;
        width: 90cqw;
        height: 20cqh;
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
</style>
