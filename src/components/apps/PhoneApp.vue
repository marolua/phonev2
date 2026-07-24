<script setup>
import { ref } from 'vue';
import { ClockFading, Search, User, Keyboard, UserPlus, Phone, Delete } from '@lucide/vue';

const activeCategory = ref('calls');

const categories = [
    { id: 'calls', label: 'Appels', icon: ClockFading },
    { id: 'contacts', label: 'Contacts', icon: User },
    { id: 'keyboard', label: 'Clavier', icon: Keyboard },
];

const keypad = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];
const phoneNumber = ref('');

const appendKey = (key) => {
    phoneNumber.value += key;
};

const removeLastDigit = () => {
    phoneNumber.value = phoneNumber.value.slice(0, -1);
};
</script>

<template>
    <div class="phone-app">
        <span class="title">{{ activeCategory === 'calls' ? 'Récents' : activeCategory === 'contacts' ? 'Contacts' : 'Clavier' }}</span>

        <div v-if="activeCategory === 'calls'" class="container">
            <div class="input-group">
                <Search class="search-icon" color="rgb(255, 255, 255, 0.8)" size="2.6cqh" />
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

        <div v-else-if="activeCategory === 'contacts'" class="container contacts-container">
            <div class="contacts-header">
                <span>Mes contacts</span>
                <button class="add-contact" type="button" aria-label="Ajouter un contact">
                    <UserPlus size="2.4cqh" />
                </button>
            </div>

            <div class="empty-state">
                <User size="6cqh" />
                <span>Aucun contact</span>
                <small>Vos contacts apparaîtront ici.</small>
            </div>
        </div>

        <div v-else class="container keyboard-container">
            <div class="phone-number">{{ phoneNumber || ' ' }}</div>
            <div class="keypad">
                <button v-for="key in keypad" :key="key" type="button" class="keypad-key" @click="appendKey(key)">
                    {{ key }}
                </button>
            </div>
            <div class="keyboard-actions">
                <button class="call-button" type="button" aria-label="Appeler">
                    <Phone size="2.8cqh" />
                </button>
                <button class="delete-button" type="button" aria-label="Effacer" @click="removeLastDigit">
                    <Delete size="2.4cqh" />
                </button>
            </div>
        </div>

        <div class="bottom-app-phone">
            <div class="categories">
                <button
                    v-for="category in categories"
                    :key="category.id"
                    type="button"
                    class="categorie"
                    :class="{ 'categorie-selected': activeCategory === category.id }"
                    @click="activeCategory = category.id"
                >
                    <component :is="category.icon" size="3cqh" />
                    <span>{{ category.label }}</span>
                </button>
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
                transition: all ease-in-out 0.2s;
                height: 8cqh;
                flex-shrink: 0;

                &:hover {
                    cursor: pointer;
                    transform: scale(1.02);
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
                        font-size: 1.85cqh;
                    }
                }
            }

            .time {
                font-size: 1.7cqh;
                color: rgba(255, 255, 255, 0.5);
            }
        }

        &.contacts-container {
            gap: 2cqh;

            .contacts-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1cqh 2cqw;
                color: rgba(255, 255, 255, 0.8);
                font-size: 2cqh;
            }

            .add-contact {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 5cqh;
                height: 5cqh;
                border: 0;
                border-radius: 50%;
                color: #4d8dff;
                background: rgba(77, 141, 255, 0.15);
                cursor: pointer;
            }

            .empty-state {
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                flex: 1;
                gap: 1cqh;
                color: rgba(255, 255, 255, 0.45);

                span {
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 2.1cqh;
                }

                small {
                    font-size: 1.7cqh;
                }
            }
        }

        &.keyboard-container {
            align-items: center;
            justify-content: center;
            gap: 3cqh;

            .phone-number {
                width: 100%;
                min-height: 5cqh;
                color: white;
                text-align: center;
                font-size: 3cqh;
            }

            .keypad {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 1.5cqh 4cqw;
                width: 75%;
            }

            .keypad-key {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                aspect-ratio: 1;
                border: 0;
                border-radius: 50%;
                color: white;
                background: rgba(60, 60, 60, 0.65);
                font-size: 3cqh;
                cursor: pointer;
                transition: transform ease-in-out 0.15s, background ease-in-out 0.15s;

                &:hover {
                    background: rgba(90, 90, 90, 0.8);
                    transform: scale(1.05);
                }
            }

            .keyboard-actions {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 5cqw;
            }

            .call-button,
            .delete-button {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 7cqh;
                height: 7cqh;
                border: 0;
                border-radius: 50%;
                color: white;
                cursor: pointer;
            }

            .call-button {
                background: #25b85a;
            }

            .delete-button {
                color: rgba(255, 255, 255, 0.75);
                background: rgba(60, 60, 60, 0.65);
            }
        }

    }

    .bottom-app-phone {
        display: flex;
        justify-content: center;
        width: 100%;
        min-height: 18%;
        flex-shrink: 0;
        border-radius: 6cqh;
        // background-color: red;

        .categories {
            display: flex;
            justify-content: space-around;
            align-items: center;
            width: 100%;
            height: 68%;
            border-radius: 6cqh;
            background-color: rgba(51, 51, 51, 0.3);
            // box-shadow:
            //     0 10px 26px rgba(0, 0, 0, 0.2),
            //     inset 0 1px 0 rgba(255, 255, 255, 0.85),
            //     inset 0 -6px 10px -6px rgba(0, 0, 0, 0.15);

            .categorie {
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                gap: 0.75cqh;
                width: 30%;
                height: 90%;
                border-radius: 5.7cqh;
                transition: all ease-in-out 0.2s;
                font-size: 1.6cqh;
                font-weight: 500;
                color: rgba(255, 255, 255, 0.8);
                border: 0;
                background: transparent;

                &.categorie-selected {
                    color: #4d8dff;
                }

                &:hover {
                    cursor: pointer;
                }

            }
        }
    }
}
</style>
