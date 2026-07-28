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

        <div class="profil">
            <!-- <img :src="Inconnu" alt=""> -->
            <div class="pic">JM</div>
            <div class="information">
                <span class="name">John McKenzie</span>
                <span class="idphone">521756</span>
            </div>
        </div>
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
        align-items: center;
        margin-top: 1.5cqh;
        box-sizing: border-box;
        padding: 0 0 0 1.5cqh;
        width: 100%;
        gap: 3cqw;
        height: 9cqh;
        border-radius: 2cqh;
        background-color: rgb(28, 28, 28);

        .pic {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 6.5cqh;
            font-size: 2.75cqh;
            height: 6.5cqh;
            border-radius: 50%;
            background: linear-gradient(145deg, rgb(90, 90, 90), rgb(50, 50, 50));
        }

        .information {
            display: flex;
            flex-direction: column;
            justify-content: center;
            width: 75%;
            height: 100%;

            .name {
                font-size: 2.2cqh;
                font-weight: 500;
                line-height: 1.5;
                color: white;
            }

            .idphone {
                font-size: 1.7cqh;
                color: rgba(255, 255, 255, 0.6);
            }
        }
    }
}

</style>