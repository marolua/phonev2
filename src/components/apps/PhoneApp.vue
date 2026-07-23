<script setup>
import { Clock, Search } from '@lucide/vue';
</script>

<template>
    <div class="phone-app">
        <span class="title">Recent</span>
        <div class="container">
            <div class="input-group">
                <Search class="search-icon" color="rgb(255, 255, 255, 0.8)" :size="20" />
                <input type="text" placeholder="Rechercher">
            </div>

            <div class="container-recent-call">
                <div class="recent-call">

                </div>
                <div class="recent-call">

                </div>
                <div class="recent-call">

                </div>
                <div class="recent-call">

                </div>
                <div class="recent-call">

                </div>
                <div class="recent-call">

                </div>
                <div class="recent-call">

                </div>
                <div class="recent-call">

                </div>

                <div class="recent-call">

                </div>
                <div class="recent-call">

                </div>
                <div class="recent-call">

                </div>
                <div class="recent-call">

                </div>
                <div class="recent-call">

                </div>
                <div class="recent-call">

                </div>

                <div class="recent-call">

                </div>
                <div class="recent-call">

                </div>
                <div class="recent-call">

                </div>
                <div class="recent-call">

                </div>
            </div>
        </div>
        <div class="bottom-app-phone">

        </div>
    </div>
</template>

<style lang="scss">
.phone-app {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    max-height: 100%;
    box-sizing: border-box;
    padding: 15cqw 3cqh 0cqw;
    background-color: rgb(10, 10, 10);

    .title {
        font-size: 8cqw;
        font-weight: 600;
        flex-shrink: 0;
    }

    .container {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 82%;
        margin-top: 1.5cqh;
        background-color: blue;

        .input-group {
            position: relative;
            display: flex;
            width: 100%;
            flex-shrink: 0;

            input[type=text] {
                width: 100%;
                height: 5cqh;
                border: none;
                padding-left: 10cqw;
                color: white;
                border-radius: 2.5cqw;
                font-size: 1.8cqh;
                font-family: "SF Pro";
                background-color: rgba(50, 50, 50, 0.5);
                outline: none;

                &::placeholder {
                    color: rgba(255, 255, 255, 0.6);
                }
            }

            .search-icon {
                position: absolute;
                left: 2cqw;
                top: 1.18cqh;
                pointer-events: none;
            }
        }

        .container-recent-call {
            display: flex;
            flex-direction: column;
            justify-content: center;
            width: 100%;;
            height: 92.5%;
            max-height: 92.5%;
            overflow-y: auto;
            background-color: green;

            .recent-call {
                display: flex;
                width: 100%;
                height: 8cqh;
                background-color: aqua;
            }
        }

    }

    .bottom-app-phone {
        display: flex;
        width: 100%;
        height: 18%;
        background-color: red;
    }
}
</style>