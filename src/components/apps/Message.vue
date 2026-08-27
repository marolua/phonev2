<script setup>
import { computed, nextTick, ref } from 'vue';
import { ArrowLeft, Check, ImagePlus, MapPin, Phone, Plus, Search, Send } from '@lucide/vue';
import { contacts } from '../../stores/contacts';
import { unreadMessageCount } from '../../stores/messages';
import { formatPhoneNumber, isPhoneSuffixValid, phoneDigits } from '../../utils/phoneNumber';

const searchQuery = ref('');
const selectedConversation = ref(null);
const messageDraft = ref('');
const messageThread = ref(null);
const showComposerOptions = ref(false);
const showNewConversation = ref(false);
const showContactSuggestions = ref(false);
const newConversation = ref({ name: '', phone: '' });
const emit = defineEmits(['call-contact']);

const conversations = ref([
    {
        id: 1,
        name: 'John McKenzie',
        phone: '555-2048',
        initials: 'JM',
        color: 'linear-gradient(145deg, #52628e, #282c42)',
        unread: 2,
        messages: [
            { id: 1, author: 'them', text: 'Salut, tu es disponible ce soir ?', time: '20:41' },
            { id: 2, author: 'me', text: 'Oui, je te tiens au courant.', time: '20:44' },
            { id: 3, author: 'them', text: 'Parfait, à plus tard !', time: '20:46' },
        ],
    },
    {
        id: 2,
        name: 'Jane Doe',
        phone: '555-7314',
        initials: 'JD',
        color: 'linear-gradient(145deg, #b66b58, #56333a)',
        unread: 0,
        messages: [
            { id: 1, author: 'me', text: 'Merci pour ton message.', time: 'Hier' },
            { id: 2, author: 'them', text: 'Avec plaisir !', time: 'Hier' },
        ],
    },
    {
        id: 3,
        name: 'Pete Peterson',
        phone: '555-4821',
        initials: 'PP',
        color: 'linear-gradient(145deg, #5d9a78, #25493b)',
        unread: 0,
        messages: [
            { id: 1, author: 'them', text: 'Je t’ai partagé le numéro.', time: 'Lun.' },
        ],
    },
]);

const filteredConversations = computed(() => {
    const query = searchQuery.value.trim().toLowerCase();
    if (!query) return conversations.value;

    return conversations.value.filter((conversation) => {
        const lastMessage = conversation.messages.at(-1)?.text || '';
        return `${conversation.name} ${conversation.phone} ${lastMessage}`.toLowerCase().includes(query);
    });
});

const lastMessage = (conversation) => conversation.messages.at(-1) || { text: '', time: '' };

const contactSuggestions = computed(() => {
    if (!showContactSuggestions.value) return [];

    const query = newConversation.value.name.trim().toLowerCase();
    if (!query) return contacts.value.slice(0, 5);

    return contacts.value.filter((contact) => {
        const name = `${contact.firstName} ${contact.lastName}`;
        return `${name} ${contact.phone}`.toLowerCase().includes(query);
    }).slice(0, 5);
});

const contactName = (contact) => `${contact.firstName} ${contact.lastName}`.trim();

const openNewConversation = () => {
    newConversation.value = { name: '', phone: '' };
    showContactSuggestions.value = false;
    showNewConversation.value = true;
};

const closeNewConversation = () => {
    showNewConversation.value = false;
    showContactSuggestions.value = false;
    newConversation.value = { name: '', phone: '' };
};

const selectContact = (contact) => {
    newConversation.value = {
        name: contactName(contact),
        phone: phoneDigits(contact.phone),
    };
    showContactSuggestions.value = false;
};

const sanitizeNewConversationPhone = (event) => {
    newConversation.value.phone = phoneDigits(event.target.value);
};

const conversationInitials = (name) => name.split(/\s+/).filter(Boolean).map((part) => part[0]).join('').slice(0, 2).toUpperCase();

const createConversation = async () => {
    const name = newConversation.value.name.trim();
    const phone = phoneDigits(newConversation.value.phone);
    if (!name || !isPhoneSuffixValid(phone)) return;

    const normalizedPhone = formatPhoneNumber(phone);
    let conversation = conversations.value.find((item) => item.phone === normalizedPhone);

    if (!conversation) {
        conversation = {
            id: Date.now(),
            name,
            phone: normalizedPhone,
            initials: conversationInitials(name),
            color: 'linear-gradient(145deg, #7a6ab0, #342b5c)',
            unread: 0,
            messages: [],
        };
        conversations.value.unshift(conversation);
    }

    closeNewConversation();
    await openConversation(conversation);
};

const openConversation = async (conversation) => {
    unreadMessageCount.value = Math.max(0, unreadMessageCount.value - conversation.unread);
    conversation.unread = 0;
    selectedConversation.value = conversation;
    await nextTick();
    scrollToLatestMessage();
};

const closeConversation = () => {
    selectedConversation.value = null;
    messageDraft.value = '';
    showComposerOptions.value = false;
};

const callSelectedContact = () => {
    if (!selectedConversation.value) return;
    emit('call-contact', {
        number: formatPhoneNumber(selectedConversation.value.phone),
        contact: {
            firstName: selectedConversation.value.name,
            lastName: '',
            phone: selectedConversation.value.phone,
        },
    });
};

const scrollToLatestMessage = () => {
    if (!messageThread.value) return;
    messageThread.value.scrollTop = messageThread.value.scrollHeight;
};

const sendMessage = async () => {
    const text = messageDraft.value.trim();
    if (!text || !selectedConversation.value) return;

    selectedConversation.value.messages.push({
        id: Date.now(),
        author: 'me',
        text,
        time: 'À l’instant',
    });
    messageDraft.value = '';
    await nextTick();
    scrollToLatestMessage();
};
</script>

<template>
    <div class="message-app">
        <div v-if="!selectedConversation" class="messages-home">
            <div class="messages-title-row">
                <span class="title">Messages</span>
                <button type="button" class="compose-button" aria-label="Nouveau message" @click="openNewConversation">
                    <Plus size="2.8cqh" />
                </button>
            </div>

            <div class="message-search">
                <Search class="search-icon" size="2.4cqh" />
                <input v-model="searchQuery" type="search" placeholder="Rechercher" />
            </div>

            <div class="conversation-list">
                <button v-for="conversation in filteredConversations" :key="conversation.id" type="button"
                    class="conversation-row" @click="openConversation(conversation)">
                    <div class="conversation-avatar" :style="{ background: conversation.color }">
                        {{ conversation.initials }}
                    </div>
                    <div class="conversation-main">
                        <div class="conversation-heading">
                            <span class="conversation-name">{{ conversation.name }}</span>
                            <span class="conversation-time">{{ lastMessage(conversation).time }}</span>
                        </div>
                        <div class="conversation-preview">
                            <span>{{ lastMessage(conversation).text }}</span>
                            <span v-if="conversation.unread" class="unread-badge">{{ conversation.unread }}</span>
                        </div>
                    </div>
                    <span class="conversation-chevron">›</span>
                </button>

                <div v-if="filteredConversations.length === 0" class="messages-empty">
                    <Search size="5cqh" />
                    <span>Aucune conversation</span>
                    <small>Essaie une autre recherche.</small>
                </div>
            </div>
        </div>

        <Transition name="message-sheet">
            <div v-if="showNewConversation" class="message-modal-backdrop" @click.self="closeNewConversation">
                <form class="new-message-modal" @submit.prevent="createConversation">
                    <div class="new-message-grabber" aria-hidden="true"></div>
                    <div class="new-message-header">
                        <button type="button" class="new-message-cancel" @click="closeNewConversation">Annuler</button>
                        <strong>Nouveau message</strong>
                        <button type="submit" class="new-message-save"
                            :disabled="!newConversation.name.trim() || !isPhoneSuffixValid(newConversation.phone)">
                            Suivant
                        </button>
                    </div>

                    <div class="new-message-form">
                        <label class="new-message-field autocomplete-field">
                            <span>Contact</span>
                            <input v-model="newConversation.name" type="text" placeholder="Nom du contact"
                                autocomplete="off" @focus="showContactSuggestions = true" />
                            <div v-if="contactSuggestions.length" class="contact-suggestions">
                                <button v-for="contact in contactSuggestions" :key="contact.id" type="button"
                                    @click="selectContact(contact)">
                                    <span class="suggestion-avatar">{{ contactName(contact).charAt(0).toUpperCase() }}</span>
                                    <span class="suggestion-info">
                                        <strong>{{ contactName(contact) }}</strong>
                                        <small>{{ formatPhoneNumber(contact.phone) }}</small>
                                    </span>
                                </button>
                            </div>
                        </label>

                        <label class="new-message-field">
                            <span>Numéro</span>
                            <div class="message-phone-input">
                                <span>555-</span>
                                <input v-model="newConversation.phone" type="tel" inputmode="numeric" maxlength="4"
                                    placeholder="1234" @input="sanitizeNewConversationPhone" />
                            </div>
                        </label>
                    </div>
                </form>
            </div>
        </Transition>

        <div v-if="selectedConversation" class="conversation-page">
            <div class="conversation-header">
                <button type="button" class="conversation-back" aria-label="Retour" @click="closeConversation">
                    <ArrowLeft size="2.8cqh" />
                </button>
                <div class="conversation-contact-title">
                    <div class="small-avatar" :style="{ background: selectedConversation.color }">
                        {{ selectedConversation.initials }}
                    </div>
                    <strong>{{ selectedConversation.name }}</strong>
                </div>
                <div class="conversation-header-actions">
                    <button type="button" aria-label="Appeler" @click="callSelectedContact">
                        <Phone size="2.4cqh" />
                    </button>
                </div>
            </div>

            <div ref="messageThread" class="message-thread">
                <div v-for="message in selectedConversation.messages" :key="message.id"
                    :class="['message-bubble-row', message.author === 'me' ? 'message-bubble-row-me' : '']">
                    <div :class="['message-bubble', message.author === 'me' ? 'message-bubble-me' : '']">
                        <span>{{ message.text }}</span>
                    </div>
                    <div class="message-meta">
                        <span>{{ message.time }}</span>
                        <span v-if="message.author === 'me'" class="message-seen">
                            <Check size="1.35cqh" /> Vu
                        </span>
                    </div>
                </div>
            </div>

            <div v-if="showComposerOptions" class="composer-options">
                <button type="button" @click="showComposerOptions = false">
                    <ImagePlus size="2.2cqh" />
                    <span>Envoyer une photo</span>
                </button>
                <button type="button" @click="showComposerOptions = false">
                    <MapPin size="2.2cqh" />
                    <span>Partager ma position GPS</span>
                </button>
            </div>

            <form class="message-composer" @submit.prevent="sendMessage">
                <button type="button" class="composer-add" aria-label="Ajouter une pièce jointe"
                    @click="showComposerOptions = !showComposerOptions">
                    <Plus size="2.4cqh" />
                </button>
                <input v-model="messageDraft" type="text" placeholder="Message" aria-label="Message" />
                <button type="submit" class="composer-send" aria-label="Envoyer" :disabled="!messageDraft.trim()">
                    <Send size="2.1cqh" />
                </button>
            </form>
        </div>
    </div>
</template>

<style scoped lang="scss">
.message-app {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    max-height: 100%;
    box-sizing: border-box;
    user-select: none;
    padding: 15cqw 3cqh 0;
    color: white;
    background-color: rgb(10, 10, 10);
}

.messages-home {
    display: flex;
    flex-direction: column;
    min-height: 0;
    height: 100%;
}

.messages-title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.title {
    font-size: 8cqw;
    font-weight: 600;
}

.compose-button,
.conversation-back,
.conversation-header-actions button,
.composer-add,
.composer-send {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0;
    cursor: pointer;
}

.compose-button {
    width: 5cqh;
    height: 5cqh;
    border-radius: 50%;
    color: #4d8dff;
    background: rgba(77, 141, 255, 0.14);
}

.message-search {
    position: relative;
    display: flex;
    align-items: center;
    margin-top: 1cqh;
    width: 100%;
    flex-shrink: 0;
}

.message-search .search-icon {
    position: absolute;
    left: 2cqw;
    top: 1.18cqh;
    width: 2.6cqh;
    height: 2.6cqh;
    color: rgba(255, 255, 255, 0.55);
    pointer-events: none;
}

.message-search input {
    width: 100%;
    height: 5cqh;
    box-sizing: border-box;
    border: 0;
    border-radius: 2.5cqw;
    padding: 0 2cqw 0 10cqw;
    outline: none;
    color: white;
    background: rgba(50, 50, 50, 0.5);
    font: inherit;
    font-size: 1.8cqh;
}

.message-search input::placeholder {
    color: rgba(255, 255, 255, 0.55);
}

.conversation-list {
    min-height: 0;
    flex: 1;
    margin-top: 2cqh;
    overflow-y: auto;
}

.conversation-row {
    display: flex;
    align-items: center;
    width: 100%;
    min-height: 9cqh;
    box-sizing: border-box;
    padding: 1.2cqh 0;
    border: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.09);
    color: white;
    text-align: left;
    background: transparent;
    cursor: pointer;
    transition: transform 0.2s ease;
}

.conversation-row:hover {
    background: transparent;
    transform: scale(1.01);
}

.conversation-avatar,
.small-avatar,
.large-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border-radius: 50%;
    color: white;
    font-weight: 600;
}

.conversation-avatar {
    width: 6cqh;
    height: 6cqh;
    font-size: 2.15cqh;
}

.conversation-main {
    min-width: 0;
    flex: 1;
    margin-left: 2.5cqw;
}

.conversation-heading,
.conversation-preview {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2cqw;
}

.conversation-name {
    overflow: hidden;
    color: rgba(255, 255, 255, 0.94);
    font-size: 2.05cqh;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.conversation-time {
    flex-shrink: 0;
    color: rgba(255, 255, 255, 0.45);
    font-size: 1.55cqh;
}

.conversation-preview {
    margin-top: 0.6cqh;
    color: rgba(255, 255, 255, 0.5);
    font-size: 1.7cqh;
}

.conversation-preview>span:first-child {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.unread-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 2.8cqh;
    height: 2.8cqh;
    border-radius: 50%;
    color: white;
    font-size: 1.35cqh;
    font-weight: 600;
    background: #4d8dff;
}

.conversation-chevron {
    margin-left: 1.5cqw;
    color: rgba(255, 255, 255, 0.3);
    font-size: 3cqh;
}

.messages-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 1cqh;
    height: 70%;
    color: rgba(255, 255, 255, 0.35);
    text-align: center;
}

.messages-empty span {
    color: rgba(255, 255, 255, 0.75);
    font-size: 1.9cqh;
}

.messages-empty small {
    font-size: 1.45cqh;
}

.conversation-page {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 8cqh 3cqh 6cqh;
    background: rgb(10, 10, 10);
}

.conversation-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
}

.conversation-back {
    width: 5cqh;
    height: 5cqh;
    border-radius: 50%;
    color: white;
    background: rgba(55, 55, 58, 0.95);
}

.conversation-contact-title {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 0.5cqh;
    margin: 0 2cqw;
}

.small-avatar {
    width: 5cqh;
    height: 5cqh;
    font-size: 1.7cqh;
}

.conversation-contact-title strong {
    max-width: 32cqw;
    overflow: hidden;
    font-size: 1.75cqh;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.conversation-header-actions {
    display: flex;
    gap: 1cqw;
}

.conversation-header-actions button {
    width: 5.2cqh;
    height: 5.2cqh;
    border-radius: 50%;
    color: #4d8dff;
    background: rgba(77, 141, 255, 0.12);
}

.message-thread {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
    gap: 2.1cqh;
    overflow-y: auto;
    padding: 2cqh 0;
}

.contact-profile {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 0.7cqh;
    padding: 1cqh 0 2cqh;
    color: rgba(255, 255, 255, 0.5);
    font-size: 1.45cqh;
}

.contact-profile strong {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.8cqh;
}

.large-avatar {
    width: 10cqh;
    height: 10cqh;
    font-size: 3.5cqh;
}

.message-bubble-row {
    display: flex;
    align-items: flex-end;
    gap: 0.8cqw;
    width: 100%;
    box-sizing: border-box;
    justify-content: flex-start;
}

.message-bubble-row-me {
    display: flex;
    justify-content: flex-end;
}

.message-bubble-row-me .message-meta {
    order: 1;
    flex: 0 0 auto;
    align-items: flex-end;
}

.message-bubble-row-me .message-bubble {
    order: 2;
    flex: 0 1 auto;
}

.message-bubble {
    max-width: 72%;
    padding: 1.2cqh 2cqw 0.9cqh;
    border-radius: 3cqh 3cqh 3cqh 0.5cqh;
    color: rgba(255, 255, 255, 0.94);
    text-align: left;
    font-size: 1.7cqh;
    background: rgba(55, 55, 58, 0.95);
}

.message-bubble-me {
    border-radius: 2.5cqh 2.5cqh 0.5cqh 2.5cqh;
    background: #1677ff;
}

.message-bubble span {
    line-height: 1.35;
}

.message-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex-shrink: 0;
    gap: 0.25cqh;
    margin-bottom: 0.35cqh;
    color: rgba(255, 255, 255, 0.48);
    font-size: 1.2cqh;
}

.message-seen {
    display: flex;
    align-items: center;
    gap: 0.25cqw;
    color: rgba(77, 141, 255, 0.9);
    white-space: nowrap;
}

.message-composer {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    gap: 1.2cqw;
    padding-top: 1cqh;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.message-modal-backdrop {
    position: absolute;
    z-index: 10;
    inset: 0;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    box-sizing: border-box;
    background: rgba(0, 0, 0, 0.62);
    backdrop-filter: blur(0.7cqh);
}

.new-message-modal {
    position: relative;
    width: 100%;
    height: 52%;
    box-sizing: border-box;
    overflow: visible;
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 3cqh 3cqh 0 0;
    color: white;
    background: rgba(38, 38, 40, 0.98);
    box-shadow: 0 2cqh 8cqh rgba(0, 0, 0, 0.45);
}

.new-message-grabber {
    position: absolute;
    top: 1cqh;
    left: 50%;
    width: 10cqw;
    height: 0.5cqh;
    border-radius: 1cqh;
    background: rgba(255, 255, 255, 0.35);
    transform: translateX(-50%);
}

.new-message-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 7cqh;
    padding: 0 3cqw;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    font-size: 2cqh;
}

.new-message-cancel,
.new-message-save {
    border: 0;
    padding: 0;
    color: #4d8dff;
    font: inherit;
    font-size: 1.65cqh;
    cursor: pointer;
    background: transparent;
}

.new-message-cancel {
    color: rgba(255, 255, 255, 0.7);
}

.new-message-save:disabled {
    color: rgba(77, 141, 255, 0.35);
    cursor: default;
}

.new-message-form {
    display: flex;
    flex-direction: column;
    gap: 1.6cqh;
    padding: 3cqh 4cqw;
}

.new-message-field {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.6cqh;
    color: rgba(255, 255, 255, 0.55);
    font-size: 1.5cqh;
}

.new-message-field input {
    width: 100%;
    height: 5.6cqh;
    box-sizing: border-box;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 1.4cqh;
    padding: 0 2cqw;
    outline: none;
    color: white;
    background: rgba(255, 255, 255, 0.1);
    font: inherit;
    font-size: 1.8cqh;
}

.new-message-field input:focus,
.message-phone-input:focus-within {
    border-color: rgba(77, 141, 255, 0.8);
}

.new-message-field input::placeholder {
    color: rgba(255, 255, 255, 0.35);
}

.message-phone-input {
    display: flex;
    align-items: center;
    height: 5.6cqh;
    box-sizing: border-box;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 1.4cqh;
    padding: 0 2cqw;
    background: rgba(255, 255, 255, 0.1);
}

.message-phone-input > span {
    flex-shrink: 0;
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.8cqh;
}

.message-phone-input input {
    flex: 1;
    min-width: 0;
    height: 100%;
    border: 0;
    padding: 0 0 0 0.7cqw;
    background: transparent;
}

.contact-suggestions {
    position: absolute;
    z-index: 2;
    top: calc(100% + 0.6cqh);
    right: 0;
    left: 0;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 1.4cqh;
    background: rgba(50, 50, 53, 0.98);
    box-shadow: 0 1cqh 3cqh rgba(0, 0, 0, 0.35);
}

.contact-suggestions button {
    display: flex;
    align-items: center;
    gap: 1.5cqw;
    width: 100%;
    min-height: 6cqh;
    border: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    padding: 0 2cqw;
    color: white;
    text-align: left;
    background: transparent;
    cursor: pointer;
}

.contact-suggestions button:last-child {
    border-bottom: 0;
}

.contact-suggestions button:hover {
    background: rgba(77, 141, 255, 0.16);
}

.suggestion-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 3.8cqh;
    height: 3.8cqh;
    border-radius: 50%;
    color: white;
    font-size: 1.5cqh;
    font-weight: 600;
    background: linear-gradient(145deg, #52628e, #282c42);
}

.suggestion-info {
    display: flex;
    flex-direction: column;
    gap: 0.25cqh;
}

.suggestion-info strong {
    font-size: 1.55cqh;
    font-weight: 500;
}

.suggestion-info small {
    color: rgba(255, 255, 255, 0.5);
    font-size: 1.3cqh;
}

.message-sheet-enter-active,
.message-sheet-leave-active {
    transition: opacity 0.25s ease;
}

.message-sheet-enter-active .new-message-modal,
.message-sheet-leave-active .new-message-modal {
    transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.message-sheet-enter-from,
.message-sheet-leave-to {
    opacity: 0;
}

.message-sheet-enter-from .new-message-modal,
.message-sheet-leave-to .new-message-modal {
    transform: translateY(100%);
}

.composer-options {
    position: absolute;
    z-index: 2;
    bottom: 12cqh;
    left: 3cqh;
    display: flex;
    flex-direction: column;
    gap: 0;
    width: 62cqw;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 2.2cqh;
    background: rgba(48, 48, 51, 0.97);
    backdrop-filter: blur(1.5cqw);
    box-shadow: 0 1.2cqh 3.5cqh rgba(0, 0, 0, 0.5);
}

.composer-options button {
    display: flex;
    align-items: center;
    gap: 1.5cqw;
    min-height: 6.2cqh;
    border: 0;
    padding: 0 2cqw;
    color: rgba(255, 255, 255, 0.9);
    font: inherit;
    font-size: 1.55cqh;
    text-align: left;
    background: transparent;
    cursor: pointer;
}

.composer-options button:hover {
    color: white;
    background: rgba(77, 141, 255, 0.2);
}

.composer-options button + button {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.composer-options svg {
    flex-shrink: 0;
    width: 3.6cqh;
    height: 3.6cqh;
    padding: 0.65cqh;
    border-radius: 50%;
    color: #4d8dff;
    background: rgba(77, 141, 255, 0.14);
}

.composer-add,
.composer-send {
    flex-shrink: 0;
    width: 4.5cqh;
    height: 4.5cqh;
    border-radius: 50%;
}

.composer-add {
    color: rgba(255, 255, 255, 0.75);
    background: rgba(55, 55, 58, 0.95);
}

.composer-send {
    color: white;
    background: #4d8dff;
}

.composer-send:disabled {
    opacity: 0.35;
    cursor: default;
}

.message-composer input {
    min-width: 0;
    flex: 1;
    height: 4.5cqh;
    box-sizing: border-box;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 2.3cqh;
    padding: 0 2cqw;
    outline: none;
    color: white;
    background: rgba(45, 45, 48, 0.9);
    font: inherit;
    font-size: 1.65cqh;
}

.message-composer input::placeholder {
    color: rgba(255, 255, 255, 0.45);
}

.message-composer input:focus {
    border-color: rgba(77, 141, 255, 0.8);
}
</style>
