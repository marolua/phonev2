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
                <div class="recent-call" v-for="i in 20">
                    <div class="information">
                        <span class="name">Jane Doe</span>
                        <span>Mobile</span>
                    </div>
                    <div class="time">
                        <span>3 minute ago</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="bottom-app-phone">
            <div class="categories">
                <div class="categorie">

                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
::-webkit-scrollbar {
    width: 0px;
}

.phone-app {
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

    .container {
        display: flex;
        flex-direction: column;
        width: 100%;
        min-height: 0;
        height: 100%;
        margin-top: 1.5cqh;

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
            justify-content: flex-start;
            width: 100%;
            flex: 1;
            min-height: 0;
            gap: 1cqh;
            max-height: 92.5%;
            overflow-y: auto;
            box-sizing: border-box;
            padding: 3cqw;

            .recent-call {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                user-select: none;
                height: 8cqh;
                flex-shrink: 0;

                &:hover {
                    cursor: pointer;
                }


                .information {
                    display: flex;
                    justify-content: center;
                    flex-direction: column;
                    height: 100%;

                    .name {
                        color: rgba(255, 3, 3, 0.65);
                        font-size: 2.1cqh;
                        font-weight: 500;
                    }

                    span {
                        color: rgba(255, 255, 255, 0.5);
                        font-weight: lighter;
                    }
                }
            }

            .time {
                font-size: 1.7cqh;
                color: rgba(255, 255, 255, 0.5);
            }
        }

    }

    .bottom-app-phone {
        display: flex;
        width: 100%;
        min-height: 18%;
        flex-shrink: 0;
        border-radius: 6cqh;
        background-color: red;

        .categories {
            display: flex;
            width: 100%;
            height: 75%;
            border-radius: 6cqh;
            background-color: rgb(96, 96, 97);
        }
    }
}
</style>