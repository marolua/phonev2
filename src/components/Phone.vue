<script setup>
</script>

<template>
    <div class="full-phone-coque">
        <div class="button">
            <div class="button-left">
                <div class="button-left-volume"></div>
                <div class="button-left-volume"></div>
            </div>
            <div class="button-right">
                <div class="button-right-power"></div>
            </div>
        </div>
        <div class="screen">
            <div class="top">
                <div class="hour">22:50</div>
                <div class="dynamic">
                    <div class="camera"></div>
                </div>
                <div class="utils"></div>
            </div>

            <div class="bottom">
                <div class="bar"></div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.full-phone-coque {
    container-type: size; // ← active les cq units pour les enfants
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 50%;
    left: 60%;
    transform: translate(-50%, -50%);
    width: 16.11vw;
    aspect-ratio: 9 / 18.15; // ← remplace height: 57.78vh, maintient le ratio quoi qu'il arrive
    border-radius: 2.7vw;
    border: 0.25vw solid rgb(94, 95, 97);
    background-color: rgb(0, 0, 0);
}

.button .button-left {
    position: absolute;
    flex-direction: column;
    display: flex;
    gap: 3cqh;
    top: 22%;
    left: -2.6cqw;
    width: 2.5cqw;
    height: 20.8cqh;
}

.button .button-right {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    top: 22%;
    right: -3.85cqw;
    width: 2.5cqw;
    height: 20.8cqh;
}

.button-right-power {
    position: relative;
    width: 1.1cqw;
    height: 9.5cqh;
    border-radius: 0 1.25cqw 1.25cqw 0;
    background: linear-gradient(to right, rgb(165, 164, 164), rgb(76, 75, 75));

    &:hover {
        cursor: pointer;
    }
}

.button-left-volume {
    position: relative;
    top: 30%;
    transform: translateY(-50%);
    width: 1.1cqw;
    height: 6.5cqh;
    border-radius: 1.25cqw 0 0 1.25cqw;
    background: linear-gradient(to left, rgb(165, 164, 164), rgb(76, 75, 75));

    &:hover {
        cursor: pointer;
    }
}

.screen {
    position: relative;
    display: flex;
    justify-content: center;
    width: 95.9cqw;
    height: 98.1cqh;
    border-radius: 13.4cqw;
    background: linear-gradient(to bottom, rgb(5, 97, 150), rgb(111, 15, 15));

    .top {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10.9cqw;
        width: 100%;
        height: 8.65cqh;
        color: white;
        font-size: 2.1cqh;
        background-color: rgba(74, 59, 59, 0.494);

        .hour {
            position: relative;
            display: flex;
            width: 14cqw;
            font-weight: 500;
            font-family: "SF Pro Display";
        }

        .dynamic {
            position: relative;
            width: 27.9cqw;
            height: 4.33cqh;
            border-radius: 50cqw;
            transition: all 0.3s ease-in-out;
            background-color: rgb(0, 0, 0);

            ::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 75%;
                transform: translate(-50%, -50%);
                width: 4cqw;
                height: 4cqw;
                border-radius: 50%;
                background: radial-gradient(#6667ac, #0000 50%) 33.3% 10% / 75% 50% no-repeat,
                    #080928 radial-gradient(#454680, #0000 50%) 60% 85% / 50% 50% no-repeat;
            }

            &:hover {
                cursor: pointer;
                width: 90%;
                height: 135%;
                box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.5);

            }
        }

        .utils {
            position: relative;
            display: flex;
            width: 13.7cqw;
            height: 4.33cqh;
            background-color: rgb(255, 255, 255);
        }
    }

    .bottom {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        bottom: 1.5cqh;
        width: 45%;
        height: 3cqh;
        border-radius: 7cqw;
        background-color: #f2f2f266;

        &:hover {
            cursor: pointer;

            .bar {
                transform: scaleX(1.05);
            }
        }

        .bar {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 35cqw;
            height: 2cqw;
            border-radius: 2cqw;
            transition: all 0.3s ease-in-out;
            background-color: #ffffff;
        }
    }
}
</style>
