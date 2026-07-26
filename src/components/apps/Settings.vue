<script setup>
import { Search } from '@lucide/vue';
import Inconnu from "../../assets/inconnu.png"
</script>

<template>
    <div class="settings-app">
        <span class="title">Réglages</span>
        <div class="input-group">
            <Search class="search-icon" color="rgb(255, 255, 255, 0.8)" size="2.6cqh" />
            <input type="text" placeholder="Rechercher">
        </div>

        <div class="profil"></div>
    </div>
</template>

<style lang="scss">
.settings-app {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    max-height: 100%;
    box-sizing: border-box;
    user-select: none;
    padding: 15cqw 3cqh 0cqw;
    background-color: rgb(10, 10, 10);

    .title {
        font-size: 8cqw;
        font-weight: 600;
        flex-shrink: 0;
    }

    .input-group {
        position: relative;
        display: flex;
        margin-top: 1cqh;
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

    .profil {
        display: flex;
        margin-top: 1.5cqh;
        width: 100%;
        height: 10cqh;
        border-radius: 2cqh;
        background-color: rgb(51, 51, 51);
    }
}
</style>