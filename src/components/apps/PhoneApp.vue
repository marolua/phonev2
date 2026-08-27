<script setup>
import { computed, ref } from 'vue';
import { ArrowLeft, Camera, ClockFading, Delete, Grid3X3, ImagePlus, Keyboard, Mail, MessageCircle, MicOff, MoreHorizontal, Phone, PhoneOff, Search, User, UserPlus, Video, Volume2, X } from '@lucide/vue';
import Prompt from '../../utils/Prompt.vue';
import { blockedContacts, contacts } from '../../stores/contacts';
import { formatPhoneNumber, isPhoneSuffixValid, phoneDigits } from '../../utils/phoneNumber';

const props = defineProps({
    contactsOnly: {
        type: Boolean,
        default: false,
    },
});

const activeCategory = ref(props.contactsOnly ? 'contacts' : 'calls');

const categories = [
    { id: 'calls', label: 'Appels', icon: ClockFading },
    { id: 'contacts', label: 'Contacts', icon: User },
    { id: 'keyboard', label: 'Clavier', icon: Keyboard },
];

const keypad = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];
const phoneNumber = ref('');
const showCreateContact = ref(false);
const emptyContact = () => ({ firstName: '', lastName: '', phone: '', photo: '' });
const newContact = ref(emptyContact());
const contactSearch = ref('');
const selectedContact = ref(null);
const isClosingContact = ref(false);
const editingContact = ref(false);
const editableContact = ref(emptyContact());
const showDeletePhotoPrompt = ref(false);
const showDeleteContactPrompt = ref(false);
const activeCall = ref(null);
const isSpeakerOn = ref(false);
const isMuted = ref(false);
const contactAnimationDuration = 450;

const getInitial = (contact) => contact?.firstName?.trim()?.charAt(0).toUpperCase() || '?';

const sanitizePhoneInput = (event, target) => {
    target.phone = phoneDigits(event.target.value);
};

const handlePhotoChange = (event, target) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;
    if (!file.type.startsWith('image/')) {
        window.alert('Choisis un fichier image.');
        return;
    }
    if (file.size > 5 * 1024 * 1024) {
        window.alert('La photo doit faire moins de 5 Mo.');
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        target.photo = reader.result;
    };
    reader.readAsDataURL(file);
};

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
    isClosingContact.value = false;
    selectedContact.value = contact;
    editingContact.value = false;
};

const closeContact = () => {
    if (!selectedContact.value || isClosingContact.value) return;

    showDeleteContactPrompt.value = false;
    editingContact.value = false;
    isClosingContact.value = true;

    setTimeout(() => {
        selectedContact.value = null;
        isClosingContact.value = false;
    }, contactAnimationDuration);
};

const startEditingContact = () => {
    if (!selectedContact.value) return;

    editableContact.value = { ...selectedContact.value, phone: phoneDigits(selectedContact.value.phone) };
    editingContact.value = true;
};

const cancelEditingContact = () => {
    showDeletePhotoPrompt.value = false;
    editingContact.value = false;
};

const askDeletePhoto = () => {
    showDeletePhotoPrompt.value = true;
};

const cancelDeletePhoto = () => {
    showDeletePhotoPrompt.value = false;
};

const confirmDeletePhoto = () => {
    editableContact.value.photo = '';
    showDeletePhotoPrompt.value = false;
};

const saveContact = () => {
    const phone = phoneDigits(editableContact.value.phone);
    if (!selectedContact.value || !editableContact.value.firstName.trim() || !isPhoneSuffixValid(phone)) {
        return;
    }

    Object.assign(selectedContact.value, {
        firstName: editableContact.value.firstName.trim(),
        lastName: editableContact.value.lastName.trim(),
        phone: formatPhoneNumber(phone),
        photo: editableContact.value.photo,
    });
    editingContact.value = false;
};

const deleteContact = () => {
    if (!selectedContact.value) return;
    showDeleteContactPrompt.value = true;
};

const cancelDeleteContact = () => {
    showDeleteContactPrompt.value = false;
};

const confirmDeleteContact = () => {
    if (!selectedContact.value) return;

    contacts.value = contacts.value.filter((contact) => contact.id !== selectedContact.value.id);
    showDeleteContactPrompt.value = false;
    closeContact();
};

const startCall = (number, contact = null) => {
    if (!number?.trim()) return;
    isSpeakerOn.value = false;
    isMuted.value = false;
    activeCall.value = { number: number.trim(), contact };
};

const endCall = () => {
    activeCall.value = null;
    isSpeakerOn.value = false;
    isMuted.value = false;
};

const isContactBlocked = (contact) => {
    if (!contact) return false;
    return blockedContacts.value.some(({ phone }) => phone === formatPhoneNumber(contact.phone));
};

const toggleBlockedContact = () => {
    if (!selectedContact.value) return;

    const normalizedPhone = formatPhoneNumber(selectedContact.value.phone);
    const existingIndex = blockedContacts.value.findIndex(({ phone }) => phone === normalizedPhone);

    if (existingIndex >= 0) {
        blockedContacts.value.splice(existingIndex, 1);
        return;
    }

    blockedContacts.value.push({
        id: Date.now(),
        name: `${selectedContact.value.firstName} ${selectedContact.value.lastName}`.trim(),
        phone: normalizedPhone,
    });
};

const closeCreateContact = () => {
    showCreateContact.value = false;
    newContact.value = emptyContact();
};

const addContact = () => {
    const phone = phoneDigits(newContact.value.phone);
    if (!newContact.value.firstName.trim() || !isPhoneSuffixValid(phone)) return;

    contacts.value.push({
        id: Date.now(),
        firstName: newContact.value.firstName.trim(),
        lastName: newContact.value.lastName.trim(),
        phone: formatPhoneNumber(phone),
        photo: newContact.value.photo,
    });
    closeCreateContact();
};
</script>

<template>
    <div class="phone-app">
        <Prompt :visible="showDeletePhotoPrompt" variant="without-text" title="Supprimer la photo ?"
            description="Voulez-vous vraiment supprimer cette photo ?" cancel-text="Annuler" confirm-text="Supprimer"
            @confirm="confirmDeletePhoto" @cancel="cancelDeletePhoto" />
        <Prompt :visible="showDeleteContactPrompt" variant="without-text" title="Supprimer le contact ?"
            description="Voulez-vous vraiment supprimer ce contact ?" cancel-text="Annuler" confirm-text="Supprimer"
            @confirm="confirmDeleteContact" @cancel="cancelDeleteContact" />

        <div v-if="activeCall" class="call-screen">
            <div class="call-screen-header">
                <span>Appel en cours...</span>
                <strong>{{ activeCall.number }}</strong>
            </div>

            <div class="call-actions">
                <button type="button" :class="{ 'call-action-active': isSpeakerOn }"
                    @click="isSpeakerOn = !isSpeakerOn">
                    <div class="call-action-icon">
                        <Volume2 size="2.8cqh" />
                    </div><span>Haut-parleur</span>
                </button>
                <button type="button">
                    <div class="call-action-icon"><Video size="2.8cqh" /></div><span>FaceTime</span>
                </button>
                <button type="button" :class="{ 'call-action-active': isMuted }" @click="isMuted = !isMuted">
                    <div class="call-action-icon">
                        <MicOff size="2.8cqh" />
                    </div><span>Muet</span>
                </button>
                <button type="button">
                    <div class="call-action-icon">
                        <MoreHorizontal size="2.8cqh" />
                    </div><span>Plus</span>
                </button>
                <button type="button" class="end-call-button" @click="endCall">
                    <div class="call-action-icon">
                        <PhoneOff size="2.8cqh" />
                    </div><span>Fin</span>
                </button>
                <button type="button">
                    <div class="call-action-icon">
                        <Keyboard size="2.8cqh" />
                    </div><span>Clavier</span>
                </button>
            </div>
        </div>

        <div v-else-if="selectedContact || isClosingContact" class="contact-detail-page"
            :class="{ 'contact-detail-closing': isClosingContact }">
            <div class="detail-header">
                <button v-if="!editingContact" type="button" class="detail-back" aria-label="Retour"
                    @click="closeContact">
                    <ArrowLeft size="2.5cqh" />
                </button>
                <button v-else type="button" class="detail-cancel" @click="cancelEditingContact">
                    <X size="2.5cqh" />
                </button>
                <span v-if="editingContact" class="detail-edit-title">Modifier</span>
                <div class="detail-edit-actions">
                    <button type="button" class="detail-edit"
                        :disabled="editingContact && (!editableContact.firstName.trim() || !editableContact.phone.trim())"
                        @click="editingContact ? saveContact() : startEditingContact()">
                        {{ editingContact ? 'OK' : 'Modifier' }}
                    </button>
                </div>
            </div>

            <div class="detail-identity">
                <div class="detail-avatar-wrap">
                    <div class="detail-avatar">
                        <img v-if="(editingContact ? editableContact.photo : selectedContact.photo)"
                            :src="editingContact ? editableContact.photo : selectedContact.photo" alt="" />
                        <span v-else>{{ getInitial(editingContact ? editableContact : selectedContact) }}</span>
                    </div>
                    <label v-if="editingContact" class="avatar-picker" title="Changer la photo">
                        <Camera size="2.2cqh" />
                        <input type="file" accept="image/*" @change="handlePhotoChange($event, editableContact)" />
                    </label>
                </div>
                <template v-if="editingContact">
                    <div class="detail-name-fields">
                        <input v-model="editableContact.firstName" type="text" placeholder="Prénom"
                            autocomplete="given-name" />
                        <input v-model="editableContact.lastName" type="text" placeholder="Nom"
                            autocomplete="family-name" />
                    </div>
                </template>
                <h2 v-else>{{ selectedContact.firstName }} {{ selectedContact.lastName }}</h2>
                <button v-if="editingContact && editableContact.photo" type="button" class="remove-photo"
                    @click="askDeletePhoto">Supprimer la photo</button>
            </div>

            <div v-if="!editingContact" class="detail-actions">
                <button type="button">
                    <MessageCircle class="detail-action-icon" size="3cqh" /><span>Message</span>
                </button>
                <button type="button" @click="startCall(selectedContact.phone, selectedContact)">
                    <Phone class="detail-action-icon" size="3cqh" /><span>Appeler</span>
                </button>
                <button type="button">
                    <Mail class="detail-action-icon" size="3cqh" /><span>Mail</span>
                </button>
            </div>

            <div class="detail-number-card" :class="{ 'detail-number-card-editing': editingContact }">
                <div>
                    <small>mobile</small>
                    <strong v-if="!editingContact">{{ selectedContact.phone }}</strong>
                    <input v-else v-model="editableContact.phone" type="tel" placeholder="Numéro de téléphone"
                        autocomplete="tel" />
                </div>
                <button v-if="!editingContact" type="button" aria-label="Appeler"
                    @click="startCall(selectedContact.phone, selectedContact)">
                    <Phone size="2.2cqh" />
                </button>
            </div>

            <button v-if="editingContact" type="button" class="delete-contact" @click="deleteContact">
                Supprimer le contact
            </button>
        </div>

        <template v-else>
            <span class="title">{{ activeCategory === 'calls' ? 'Récents' : activeCategory === 'contacts' ? 'Contacts' :
                'Clavier' }}</span>

            <div v-if="activeCategory === 'calls' && !props.contactsOnly" class="container">
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
                            <img v-if="contact.photo" :src="contact.photo" alt="" />
                            <span v-else>{{ getInitial(contact) }}</span>
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

            <div v-else-if="!props.contactsOnly" class="container keyboard-container">
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

            <div v-if="!props.contactsOnly" class="bottom-app-phone">
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
                            <label class="new-contact-avatar" title="Ajouter une photo">
                                <img v-if="newContact.photo" :src="newContact.photo" alt="Aperçu de la photo" />
                                <template v-else>
                                    <ImagePlus size="5cqh" />
                                    <small>Ajouter une photo</small>
                                </template>
                                <input type="file" accept="image/*" @change="handlePhotoChange($event, newContact)" />
                            </label>
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
        padding: 14cqh 5cqw 9cqh;
        overflow: hidden;
        background:
            radial-gradient(circle at 82% 57%, rgba(70, 35, 31, 0.34), transparent 36%),
            linear-gradient(160deg, #050505 0%, #0b0809 52%, #160d0d 100%);

        &::before {
            position: absolute;
            inset: 0;
            pointer-events: none;
            content: '';
            background: linear-gradient(120deg, rgba(255, 255, 255, 0.025), transparent 30%, transparent 70%, rgba(255, 90, 90, 0.045));
        }

        .call-screen-header {
            position: relative;
            display: flex;
            align-items: center;
            flex-direction: column;
            gap: 0.6cqh;
            color: rgba(255, 255, 255, 0.65);
            font-size: 1.65cqh;

            strong {
                color: white;
                font-size: 2.65cqh;
                font-weight: 600;
            }
        }

        .call-actions {
            position: relative;
            display: grid;
            justify-content: center;
            align-items: center;
            grid-template-columns: repeat(3, 0.32fr);
            gap: 2.2cqh 0.0cqw;
            width: 100%;

            button {
                display: flex;
                align-items: center;
                flex-direction: column;
                gap: 0.9cqh;
                border: 0;
                padding: 0;
                color: rgba(255, 255, 255, 0.85);
                background: transparent;
                font-family: inherit;
                font-size: 1.6cqh;
                cursor: pointer;
                transition: transform 0.2s ease, color 0.2s ease;

                &:active {
                    transform: scale(0.94);
                }

                .call-action-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 7.2cqh;
                    height: 7.2cqh;
                    box-sizing: border-box;
                    border-radius: 50%;
                    color: white;
                    background: rgba(255, 255, 255, 0.14);
                    backdrop-filter: blur(1cqh);

                    svg {
                        width: 2.8cqh;
                        height: 2.8cqh;
                    }
                }

                &.call-action-active {
                    color: #81b6ff;

                    .call-action-icon {
                        color: #0b0b0d;
                        background: #f4f7ff;
                    }
                }
            }

            .end-call-button {
                color: #ffb5ae;

                .call-action-icon {
                    background: linear-gradient(145deg, #ff6257, #db2e3b);
                    box-shadow: 0 0.8cqh 2.5cqh rgba(255, 59, 48, 0.28);
                }
            }
        }
    }

    .contact-detail-page {
        display: flex;
        align-items: center;
        flex-direction: column;
        padding: 8cqh 5cqw 5cqh;
        background-color: rgb(10, 10, 10);

        .detail-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
            min-height: 5cqh;
            width: 100%;

            .detail-edit-actions {
                display: flex;
                align-items: center;
                gap: 1.5cqw;
            }

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

                &:disabled {
                    opacity: 0.4;
                    cursor: default;
                }
            }

            .detail-cancel {
                width: 5cqh;
                padding: 0;
                color: #1686ff;
                font-size: 1.7cqh;
            }

            .detail-edit-title {
                position: absolute;
                left: 50%;
                color: rgba(255, 255, 255, 0.9);
                font-size: 1.8cqh;
                font-weight: 600;
                transform: translateX(-50%);
            }
        }

        .detail-identity {
            display: flex;
            align-items: center;
            flex-direction: column;
            width: 100%;
            gap: 2cqh;
            margin-top: 3cqh;

            .detail-avatar-wrap {
                position: relative;
            }

            .detail-avatar {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 16cqh;
                height: 16cqh;
                overflow: hidden;
                border-radius: 50%;
                color: white;
                background: linear-gradient(145deg, #52628e, #282c42);
                font-size: 7cqh;
                font-weight: 600;

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }

            .avatar-picker {
                position: absolute;
                right: -0.5cqw;
                bottom: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 5cqh;
                height: 5cqh;
                border: 0.35cqh solid #171719;
                border-radius: 50%;
                color: white;
                background: #4d8dff;
                cursor: pointer;

                input {
                    display: none;
                }
            }

            h2 {
                margin: 0;
                font-size: 3.2cqh;
            }

            .remove-photo {
                padding: 0;
                border: 0;
                color: #ff6b67;
                background: transparent;
                font-family: inherit;
                font-size: 1.8cqh;
                cursor: pointer;
            }

            .detail-name-fields {
                display: flex;
                flex-direction: column;
                width: 100%;
                gap: 0;
                overflow: hidden;
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 1.5cqh;
                background: rgba(118, 118, 128, 0.2);

                input {
                    width: 100%;
                    min-height: 6cqh;
                    box-sizing: border-box;
                    padding: 0 2cqw;
                    border: 0;
                    outline: none;
                    color: white;
                    background: transparent;
                    font-family: inherit;
                    font-size: 1.8cqh;

                    &:not(:last-child) {
                        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    }

                    &::placeholder {
                        color: rgba(255, 255, 255, 0.55);
                    }
                }
            }
        }

        .detail-actions {
            display: flex;
            gap: 5cqw;
            margin-top: 3cqh;

            button {
                position: relative;
                display: flex;
                align-items: center;
                flex-direction: column;
                width: 8cqh;
                min-height: 8.8cqh;
                box-sizing: border-box;
                padding: 7.5cqh 0 0;
                border: 0;
                color: #1686ff;
                background: transparent;
                font-family: inherit;
                font-size: 1.5cqh;
                cursor: pointer;

                &::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 50%;
                    width: 6.8cqh;
                    height: 6.8cqh;
                    box-sizing: border-box;
                    border: 1px solid rgba(255, 255, 255, 0.18);
                    border-radius: 50%;
                    background: rgba(44, 44, 46, 0.85);
                    transform: translateX(-50%);
                }

                svg {
                    position: absolute;
                    top: 3.4cqh;
                    left: 50%;
                    z-index: 1;
                    background: transparent;
                    transform: translate(-50%, -50%);
                }

                span {
                    position: relative;
                    z-index: 1;
                    white-space: nowrap;
                }
            }
        }

        .detail-number-card {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            margin-top: 4cqh;
            padding: 1cqh 3cqw;
            box-sizing: border-box;
            border-radius: 2.5cqh;
            background: rgba(20, 20, 20, 0.9);

            &.detail-number-card-editing {
                div {
                    width: 100%;
                }
            }

            div {
                display: flex;
                flex-direction: column;
                gap: 0.5cqh;

                small {
                    color: rgba(255, 255, 255, 0.45);
                    font-size: 1.5cqh;
                }

                strong {
                    font-size: 2cqh;
                }

                input {
                    width: 100%;
                    padding: 0;
                    border: 0;
                    outline: none;
                    color: white;
                    background: transparent;
                    font-family: inherit;
                    font-size: 2cqh;

                    &:focus {
                        border: 0;
                    }
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
                background: rgba(45, 45, 45, 0.9);
                cursor: pointer;
            }
        }

        .delete-contact {
            width: 100%;
            margin-top: 2cqh;
            padding: 1.5cqh 2cqw;
            border: 0;
            border-radius: 1.5cqh;
            color: #ff453a;
            background: rgba(118, 118, 128, 0.2);
            font-family: inherit;
            font-size: 1.8cqh;
            cursor: pointer;

            &:active {
                background: rgba(255, 69, 58, 0.18);
            }
        }
    }

    @keyframes contact-detail-slide-in {
        from {
            transform: translate3d(100%, 0, 0);
        }

        to {
            transform: translate3d(0, 0, 0);
        }
    }

    @keyframes contact-detail-slide-out {
        from {
            transform: translate3d(0, 0, 0);
        }

        to {
            transform: translate3d(100%, 0, 0);
        }
    }

    .contact-detail-page {
        animation: contact-detail-slide-in 0.3s cubic-bezier(0.22, 1, 0.36, 1) both;
        will-change: transform;
    }

    .contact-detail-page.contact-detail-closing {
        animation: contact-detail-slide-out 0.3s cubic-bezier(0.22, 1, 0.36, 1) both;
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
                padding: 0 1cqw 1cqh;

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
                    overflow: hidden;
                    flex-shrink: 0;
                    border-radius: 50%;
                    color: white;
                    background: linear-gradient(145deg, #52628e, #282c42);
                    font-size: 2.2cqh;

                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
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
                flex-direction: column;
                align-self: center;
                width: 10cqh;
                height: 10cqh;
                overflow: hidden;
                margin-bottom: 1cqh;
                border-radius: 50%;
                color: rgba(255, 255, 255, 0.8);
                background: linear-gradient(145deg, #52628e, #282c42);
                cursor: pointer;

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                small {
                    margin-top: -2.5cqh;
                    padding: 0.4cqh 1cqw;
                    border-radius: 1cqh;
                    color: white;
                    background: rgba(0, 0, 0, 0.58);
                    font-size: 1.2cqh;
                }

                input {
                    display: none;
                }
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
