<script setup>
import { computed, ref } from 'vue';
import { ArrowLeft, ClockFading, Delete, Grid3X3, Keyboard, Mail, MessageCircle, MicOff, MoreHorizontal, Phone, PhoneOff, Search, User, UserPlus, Video, Volume2, X } from '@lucide/vue';

const activeCategory = ref('calls');

const categories = [
    { id: 'calls', label: 'Appels', icon: ClockFading },
    { id: 'contacts', label: 'Contacts', icon: User },
    { id: 'keyboard', label: 'Clavier', icon: Keyboard },
];

const keypad = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];
const phoneNumber = ref('');
const showCreateContact = ref(false);
const newContact = ref({ firstName: '', lastName: '', phone: '' });
const contacts = ref([]);
const contactSearch = ref('');
const selectedContact = ref(null);
const activeCall = ref(null);

const filteredContacts = computed(() => {
    const search = contactSearch.value.trim().toLowerCase();
    if (!search) return contacts.value;

    return contacts.value.filter((contact) => {
        const searchableText = `${contact.firstName} ${contact.lastName} ${contact.phone}`.toLowerCase();
        return searchableText.includes(search);
    });
});

const appendKey = (key) => {
    phoneNumber.value += key;
};

const removeLastDigit = () => {
    phoneNumber.value = phoneNumber.value.slice(0, -1);
};

const openContact = (contact) => {
    selectedContact.value = contact;
};

const closeContact = () => {
    selectedContact.value = null;
};

const startCall = (number, contact = null) => {
    if (!number?.trim()) return;
    activeCall.value = { number: number.trim(), contact };
};

const endCall = () => {
    activeCall.value = null;
};

const closeCreateContact = () => {
    showCreateContact.value = false;
    newContact.value = { firstName: '', lastName: '', phone: '' };
};

const addContact = () => {
    if (!newContact.value.firstName.trim() || !newContact.value.phone.trim()) return;

    contacts.value.push({
        id: Date.now(),
        firstName: newContact.value.firstName.trim(),
        lastName: newContact.value.lastName.trim(),
        phone: newContact.value.phone.trim(),
    });
    closeCreateContact();
};
</script>

<template>
    <div class="phone-app">
        <div v-if="activeCall" class="call-screen">
            <div class="call-screen-header">
                <span>Appel en cours...</span>
                <strong>{{ activeCall.contact ? `${activeCall.contact.firstName} ${activeCall.contact.lastName}` :
                    activeCall.number }}</strong>
            </div>

            <div class="call-screen-content">
                <div class="call-avatar">
                    {{ activeCall.contact ? activeCall.contact.firstName.charAt(0).toUpperCase() : '?' }}
                </div>
                <strong v-if="activeCall.contact" class="call-contact-name">
                    {{ activeCall.contact.firstName }} {{ activeCall.contact.lastName }}
                </strong>
                <span class="call-number">{{ activeCall.number }}</span>
            </div>

            <div class="call-actions">
                <button type="button">
                    <Volume2 size="2.5cqh" /><span>Haut-parleur</span>
                </button>
                <button type="button"><Video size="2.5cqh" /><span>FaceTime</span></button>
                <button type="button">
                    <MicOff size="2.5cqh" /><span>Muet</span>
                </button>
                <button type="button">
                    <MoreHorizontal size="2.5cqh" /><span>Plus</span>
                </button>
                <button type="button" class="end-call-button" @click="endCall">
                    <PhoneOff size="2.5cqh" /><span>Fin</span>
                </button>
                <button type="button">
                    <Grid3X3 size="2.5cqh" /><span>Clavier</span>
                </button>
            </div>
        </div>

        <div v-else-if="selectedContact" class="contact-detail-page">
            <div class="detail-header">
                <button type="button" class="detail-back" aria-label="Retour" @click="closeContact">
                    <ArrowLeft size="2.5cqh" />
                </button>
                <button type="button" class="detail-edit">Modifier</button>
            </div>

            <div class="detail-identity">
                <div class="detail-avatar">
                    {{ selectedContact.firstName.charAt(0).toUpperCase() }}
                </div>
                <h2>{{ selectedContact.firstName }} {{ selectedContact.lastName }}</h2>
            </div>

            <div class="detail-actions">
                <button type="button">
                    <MessageCircle size="2.5cqh" /><span>Message</span>
                </button>
                <button type="button" @click="startCall(selectedContact.phone, selectedContact)">
                    <Phone size="2.5cqh" /><span>Appeler</span>
                </button>
                <button type="button">
                    <Mail size="2.5cqh" /><span>Mail</span>
                </button>
            </div>

            <div class="detail-number-card">
                <div>
                    <small>mobile</small>
                    <strong>{{ selectedContact.phone }}</strong>
                </div>
                <button type="button" aria-label="Appeler" @click="startCall(selectedContact.phone, selectedContact)">
                    <Phone size="2.2cqh" />
                </button>
            </div>
        </div>

        <template v-else>
            <span class="title">{{ activeCategory === 'calls' ? 'Récents' : activeCategory === 'contacts' ? 'Contacts' :
                'Clavier' }}</span>

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
                <div class="input-group contacts-search">
                    <Search class="search-icon" color="rgb(255, 255, 255, 0.8)" size="2.6cqh" />
                    <input v-model="contactSearch" type="text" placeholder="Rechercher dans les contacts">
                </div>

                <div class="contacts-header">
                    <span>Mes contacts</span>
                    <button class="add-contact" type="button" aria-label="Ajouter un contact"
                        @click="showCreateContact = true">
                        <UserPlus size="2.4cqh" />
                    </button>
                </div>

                <div v-if="contacts.length === 0" class="empty-state">
                    <User size="6cqh" />
                    <span>Aucun contact</span>
                    <small>Vos contacts apparaîtront ici.</small>
                </div>

                <div v-else-if="filteredContacts.length > 0" class="contacts-list">
                    <button v-for="contact in filteredContacts" :key="contact.id" type="button" class="contact-item"
                        @click="openContact(contact)">
                        <div class="contact-avatar">
                            {{ contact.firstName.charAt(0).toUpperCase() }}
                        </div>
                        <div class="contact-information">
                            <span>{{ contact.firstName }} {{ contact.lastName }}</span>
                            <small>{{ contact.phone }}</small>
                        </div>
                    </button>
                </div>

                <div v-else class="empty-state">
                    <Search size="6cqh" />
                    <span>Aucun résultat</span>
                    <small>Essayez un autre nom ou numéro.</small>
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
                    <button class="call-button" type="button" aria-label="Appeler" :disabled="!phoneNumber"
                        @click="startCall(phoneNumber)">
                        <Phone size="2.8cqh" />
                    </button>
                    <button class="delete-button" type="button" aria-label="Effacer" @click="removeLastDigit">
                        <Delete size="2.4cqh" />
                    </button>
                </div>
            </div>

            <div class="bottom-app-phone">
                <div class="categories">
                    <button v-for="category in categories" :key="category.id" type="button" class="categorie"
                        :class="{ 'categorie-selected': activeCategory === category.id }"
                        @click="activeCategory = category.id">
                        <component :is="category.icon" size="3cqh" />
                        <span>{{ category.label }}</span>
                    </button>
                </div>
            </div>

            <Transition name="contact-sheet">
                <div v-if="showCreateContact" class="contact-modal-backdrop" @click.self="closeCreateContact">
                    <form class="contact-modal" @submit.prevent="addContact">
                        <div class="modal-header">
                            <button type="button" class="modal-action cancel-action"
                                @click="closeCreateContact">Annuler</button>
                            <span>Nouveau contact</span>
                            <button type="submit" class="modal-action save-action"
                                :disabled="!newContact.firstName.trim() || !newContact.phone.trim()">
                                Ajouter
                            </button>
                        </div>

                        <div class="contact-form">
                            <div class="new-contact-avatar">
                                <User size="5cqh" />
                            </div>
                            <label>
                                <span>Prénom</span>
                                <input v-model="newContact.firstName" type="text" placeholder="Prénom"
                                    autocomplete="given-name" />
                            </label>
                            <label>
                                <span>Nom</span>
                                <input v-model="newContact.lastName" type="text" placeholder="Nom"
                                    autocomplete="family-name" />
                            </label>
                            <label>
                                <span>Téléphone</span>
                                <input v-model="newContact.phone" type="tel" placeholder="Numéro de téléphone"
                                    autocomplete="tel" />
                            </label>
                        </div>

                        <button type="button" class="close-modal" aria-label="Fermer" @click="closeCreateContact">
                            <X size="2.2cqh" />
                        </button>
                    </form>
                </div>
            </Transition>
        </template>
    </div>
</template>

<style lang="scss">
::-webkit-scrollbar {
    width: 0px;
}

.phone-app {
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

    .call-screen,
    .contact-detail-page {
        position: absolute;
        inset: 0;
        z-index: 5;
        box-sizing: border-box;
        background: #050505;
    }

    .call-screen {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        padding: 8cqh 5cqw 5cqh;
        background: linear-gradient(180deg, #080808 0%, #130d0d 100%);

        .call-screen-header {
            display: flex;
            align-items: center;
            flex-direction: column;
            gap: 1cqh;
            color: rgba(255, 255, 255, 0.6);
            font-size: 1.8cqh;

            strong {
                color: white;
                font-size: 2.6cqh;
            }
        }

        .call-screen-content {
            display: flex;
            align-items: center;
            flex-direction: column;
            gap: 1.2cqh;
            margin-top: -12cqh;

            .call-avatar {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 18cqh;
                height: 18cqh;
                margin-bottom: 1cqh;
                border-radius: 50%;
                color: white;
                background: #37373a;
                font-size: 8cqh;
                font-weight: 600;
            }

            .call-contact-name {
                font-size: 3cqh;
            }

            .call-number {
                color: rgba(255, 255, 255, 0.65);
                font-size: 2cqh;
            }
        }

        .call-actions {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 3cqh 4cqw;
            width: 100%;

            button {
                display: flex;
                align-items: center;
                flex-direction: column;
                gap: 1cqh;
                border: 0;
                color: rgba(255, 255, 255, 0.85);
                background: transparent;
                font-family: inherit;
                font-size: 1.45cqh;
                cursor: pointer;

                svg {
                    width: 7cqh;
                    height: 7cqh;
                    padding: 2.1cqh;
                    box-sizing: border-box;
                    border-radius: 50%;
                    color: white;
                    background: rgba(75, 69, 69, 0.7);
                }
            }

            .end-call-button {
                svg {
                    background: #ff3b30;
                }
            }
        }
    }

    .contact-detail-page {
        display: flex;
        align-items: center;
        flex-direction: column;
        padding: 8cqh 5cqw 5cqh;

        .detail-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;

            button {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 5cqh;
                border: 1px solid rgba(255, 255, 255, 0.15);
                border-radius: 3cqh;
                color: white;
                background: rgba(55, 55, 58, 0.85);
                font-family: inherit;
                cursor: pointer;
            }

            .detail-back {
                width: 5cqh;
                border-radius: 50%;
            }

            .detail-edit {
                padding: 0 3cqw;
                color: #1686ff;
                font-size: 1.7cqh;
            }
        }

        .detail-identity {
            display: flex;
            align-items: center;
            flex-direction: column;
            gap: 2cqh;
            margin-top: 3cqh;

            .detail-avatar {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 16cqh;
                height: 16cqh;
                border-radius: 50%;
                color: white;
                background: #37373a;
                font-size: 7cqh;
                font-weight: 600;
            }

            h2 {
                margin: 0;
                font-size: 3.2cqh;
            }
        }

        .detail-actions {
            display: flex;
            gap: 5cqw;
            margin-top: 3cqh;

            button {
                display: flex;
                align-items: center;
                flex-direction: column;
                gap: 0.8cqh;
                border: 0;
                color: #1686ff;
                background: transparent;
                font-family: inherit;
                font-size: 1.4cqh;
                cursor: pointer;

                svg {
                    width: 7cqh;
                    height: 7cqh;
                    padding: 2cqh;
                    box-sizing: border-box;
                    border: 1px solid rgba(255, 255, 255, 0.18);
                    border-radius: 50%;
                    background: rgba(44, 44, 46, 0.85);
                }
            }
        }

        .detail-number-card {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            margin-top: 4cqh;
            padding: 1.7cqh 3cqw;
            box-sizing: border-box;
            border-radius: 2.5cqh;
            background: rgba(35, 35, 35, 0.9);

            div {
                display: flex;
                flex-direction: column;
                gap: 0.7cqh;

                small {
                    color: rgba(255, 255, 255, 0.45);
                    font-size: 1.5cqh;
                }

                strong {
                    font-size: 2.2cqh;
                }
            }

            button {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 5.5cqh;
                height: 5.5cqh;
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                color: #1686ff;
                background: rgba(55, 55, 58, 0.9);
                cursor: pointer;
            }
        }
    }

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

            .contacts-list {
                display: flex;
                flex-direction: column;
                gap: 1cqh;
                overflow-y: auto;
                padding: 1cqh 2cqw;

                .contact-item {
                    display: flex;
                    align-items: center;
                    gap: 2cqw;
                    min-height: 7cqh;
                    padding: 1.5cqh 1cqw;
                    border: 0;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                    text-align: left;
                    transition: all ease-in-out 0.2s;
                    font-family: inherit;
                    background: transparent;
                    cursor: pointer;

                    &:hover {
                        transform: scale(1.02);
                    }
                }

                .contact-avatar {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 5cqh;
                    height: 5cqh;
                    flex-shrink: 0;
                    border-radius: 50%;
                    color: white;
                    background: #4d8dff;
                    font-size: 2.2cqh;
                }

                .contact-information {
                    display: flex;
                    flex-direction: column;
                    gap: 0.4cqh;

                    span {
                        color: rgba(255, 255, 255, 0.9);
                        font-size: 2cqh;
                    }

                    small {
                        color: rgba(255, 255, 255, 0.5);
                        font-size: 1.7cqh;
                    }
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

                &:disabled {
                    opacity: 0.35;
                    cursor: default;
                }
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
            box-shadow:
                0 10px 26px rgba(0, 0, 0, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.85),
                inset 0 -6px 10px -6px rgba(0, 0, 0, 0.15);

            .categorie {
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                gap: 0.75cqh;
                width: 30%;
                height: 90%;
                border-radius: 5.7cqh;
                font-family: "SF Pro";
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

    .contact-modal-backdrop {
        position: absolute;
        inset: 0;
        z-index: 10;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        box-sizing: border-box;
        background: rgba(0, 0, 0, 0.62);
        backdrop-filter: blur(0.7cqh);
    }

    .contact-modal {
        position: relative;
        width: 100%;
        height: 75%;
        box-sizing: border-box;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.14);
        border-radius: 3cqh 3cqh 0 0;
        color: white;
        background: rgba(38, 38, 40, 0.96);
        box-shadow: 0 2cqh 8cqh rgba(0, 0, 0, 0.45);

        &::before {
            content: '';
            position: absolute;
            top: 1cqh;
            left: 50%;
            width: 10cqw;
            height: 0.5cqh;
            border-radius: 1cqh;
            background: rgba(255, 255, 255, 0.35);
            transform: translateX(-50%);
        }

        .modal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            min-height: 7cqh;
            padding: 0 3cqw;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            font-size: 2cqh;
            font-weight: 600;
        }

        .modal-action {
            padding: 0;
            border: 0;
            color: #4d8dff;
            background: transparent;
            font-family: inherit;
            font-size: 1.7cqh;
            cursor: pointer;

            &:disabled {
                color: rgba(77, 141, 255, 0.35);
                cursor: default;
            }
        }

        .cancel-action {
            color: rgba(255, 255, 255, 0.7);
        }

        .contact-form {
            display: flex;
            flex-direction: column;
            gap: 1.5cqh;
            height: calc(100% - 7cqh);
            box-sizing: border-box;
            overflow-y: auto;
            padding: 3cqh 4cqw 4cqh;

            .new-contact-avatar {
                display: flex;
                align-items: center;
                justify-content: center;
                align-self: center;
                width: 10cqh;
                height: 10cqh;
                margin-bottom: 1cqh;
                border-radius: 50%;
                color: rgba(255, 255, 255, 0.8);
                background: rgba(255, 255, 255, 0.12);
            }

            label {
                display: flex;
                flex-direction: column;
                gap: 0.6cqh;

                span {
                    padding-left: 1cqw;
                    color: rgba(255, 255, 255, 0.55);
                    font-size: 1.5cqh;
                }

                input {
                    width: 100%;
                    box-sizing: border-box;
                    padding: 1.5cqh 2cqw;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 1.4cqh;
                    outline: none;
                    color: white;
                    background: rgba(255, 255, 255, 0.1);
                    font-family: inherit;
                    font-size: 1.8cqh;

                    &::placeholder {
                        color: rgba(255, 255, 255, 0.35);
                    }
                }
            }
        }

        .close-modal {
            position: absolute;
            top: 1.5cqh;
            right: 2cqw;
            display: none;
        }
    }

    .contact-sheet-enter-active,
    .contact-sheet-leave-active {
        transition: opacity 0.3s ease;

        .contact-modal {
            transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }
    }

    .contact-sheet-enter-from,
    .contact-sheet-leave-to {
        opacity: 0;

        .contact-modal {
            transform: translateY(100%);
        }
    }
}
</style>
