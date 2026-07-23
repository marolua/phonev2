<script setup>
import { Clock, Search } from '@lucide/vue';
</script>

<template>
    <div class="phone-app">
        <h1>Recent</h1>
        <div class="container">

            <div class="input-group">
                <Search class="search-icon" />
                <input type="text" placeholder="Rechercher">
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
    overflow: hidden;
    padding: 15cqw 3cqh 0cqw;
    background-color: rgb(10, 10, 10);

    .container {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 75%;
        margin-top: -2cqh;
        background-color: blue;

        .input-group {
            position: relative;
            display: flex;
            width: 100%;

            input[type=text] {
                width: 100%;
                height: 5cqh;
                border: none;
                padding-left: 45px;
                color: white;
                border-radius: 2.5cqw;
                font-size: 16px;
                background-color: rgb(50, 50, 50);
                outline: none;

                &::placeholder {
                    color: white;
                }
            }

            .search-icon {
                position: absolute;
                left: 2cqw;
                top: 1.18cqh;
                pointer-events: none;
            }
        }

    }

    .bottom-app-phone {
        display: flex;
        width: 100%;
        height: 20%;
        background-color: red;
    }
}
</style>