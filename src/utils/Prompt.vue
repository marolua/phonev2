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
                <span class="accepte">Accepter</span>
                <span class="bar"></span>
                <span class="refuse">Refuser</span>
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
        border-radius: 3.5cqw;
        width: 70%;
        height: 22%;
        background-color: rgb(51, 51, 51);

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
                font-size: 2.25cqh;
                font-weight: 500;
            }

            .description {
                font-size: 1.7cqh;
            }
        }
    }
}
</style>
