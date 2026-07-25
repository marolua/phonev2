<script setup>

</script>

<template>
    <!-- <div class="container-prompt-with-texte">

    </div> -->
    <div class="container-prompt-without-texte">
        <div class="prompt-without">
            <div class="top-prompt-without">
                <span class="title-prompt">
                    Delete Conversation
                </span>
                <span class="description">Are you sure you want to delete this conversation?</span>
            </div>
            <div class="bottom-prompt-without">
                <span class="button-prompt">Cancel</span>
                <span class="bar"></span>
                <span class="button-prompt">Delete</span>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.container-prompt-without-texte {
    position: absolute;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    border-radius: 13.4cqw;
    background-color: rgba(0, 0, 0, 0.38);
    backdrop-filter: blur(0.5cqh);
    -webkit-backdrop-filter: blur(0.5cqh);
    z-index: 50;

    .prompt-without {
        display: flex;
        flex-direction: column;
        border-radius: 3.5cqw;
        width: 67.5%;
        box-sizing: border-box;
        height: 18%;
        overflow: hidden;
        background-color: rgba(40, 40, 40, 0.90);

        .top-prompt-without {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            box-sizing: border-box;
            padding: 1.5cqh 4cqw 0;
            text-align: center;
            gap: 0.75cqh;
            height: 64%;
            width: 100%;
            // background-color: green;

            .title-prompt {
                font-size: 2.1cqh;
                font-weight: 600;
                line-height: 1.1;
            }

            .description {
                font-size: 1.55cqh;
                line-height: 1.25;
            }
        }

        .bottom-prompt-without {
            position: relative;
            display: flex;
            justify-content: center;
            gap: 10cqw;
            align-items: center;
            width: 100%;
            height: 35%;

            .button-prompt {
                font-size: 2cqh;
                font-family: "SF Pro Display";
                font-weight: 500;
                color: rgb(0, 157, 255);

                &:hover {
                    cursor: pointer;
                }
            }

            .bar {
                width: 0.35cqw;
                border-radius: 2cqw;
                height: 3cqh;
                background-color: rgba(128, 128, 128, 0.65);
            }
        }
    }
}
</style>
