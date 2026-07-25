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
                <span class="button-prompt">Accepter</span>
                <span class="bar"></span>
                <span class="button-prompt">Refuser</span>
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
        width: 70%;
        box-sizing: border-box;
        padding: 2cqw 2cqw 3cqw 2cqw;
        height: 20%;
        background-color: rgba(15, 15, 15, 0.9);

        .top-prompt-without {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            gap: 0.5cqh;
            height: 65%;
            width: 100%;
            // background-color: green;

            .title-prompt {
                font-size: 2.1cqh;
                font-weight: 500;
            }

            .description {
                font-size: 1.6cqh;
            }
        }

        .bottom-prompt-without {
            position: relative;
            display: flex;
            justify-content: space-around;
            align-items: center;
            // gap: 9cqw;
            width: 100%;
            height: 35%;
            // background-color: red;

            .button-prompt {
                font-size: 2.2cqh;
                font-family: "SF Pro";
                font-weight: 500;
                color: rgb(0, 64, 255);

                &:hover {
                    cursor: pointer;
                }
            }

            .bar {
                width: 0.6cqw;
                border-radius: 2cqw;
                height: 3cqh;
                background-color: grey;
            }
        }
    }
}
</style>
