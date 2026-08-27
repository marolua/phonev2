<script setup>
import { computed, nextTick, ref } from 'vue';
import { ArrowLeft, Check, ImagePlus, MapPin, Phone, Plus, Search, Send } from '@lucide/vue';

const searchQuery = ref('');
const selectedConversation = ref(null);
const messageDraft = ref('');
const messageThread = ref(null);
const showComposerOptions = ref(false);

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

const openConversation = async (conversation) => {
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
                <button type="button" class="compose-button" aria-label="Nouveau message">
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

        <div v-else class="conversation-page">
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
                    <button type="button" aria-label="Appeler">
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
    border-radius: 2.5cqh;
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
    transition: background-color 0.15s ease;
}

.conversation-row:hover {
    background: rgba(255, 255, 255, 0.05);
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
    width: 6.5cqh;
    height: 6.5cqh;
    font-size: 2.4cqh;
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
    font-size: 2cqh;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.conversation-time {
    flex-shrink: 0;
    color: rgba(255, 255, 255, 0.45);
    font-size: 1.45cqh;
}

.conversation-preview {
    margin-top: 0.6cqh;
    color: rgba(255, 255, 255, 0.5);
    font-size: 1.65cqh;
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
    width: 4.5cqh;
    height: 4.5cqh;
    border-radius: 50%;
    color: #4d8dff;
    background: rgba(77, 141, 255, 0.12);
}

.message-thread {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
    gap: 1.2cqh;
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
    justify-content: flex-start;
}

.message-bubble-row-me {
    flex-direction: row-reverse;
    justify-content: flex-start;
}

.message-bubble {
    max-width: 72%;
    padding: 1.2cqh 2cqw 0.9cqh;
    border-radius: 2cqh 2cqh 2cqh 0.6cqh;
    color: rgba(255, 255, 255, 0.94);
    font-size: 1.7cqh;
    background: rgba(55, 55, 58, 0.95);
}

.message-bubble-me {
    border-radius: 2cqh 2cqh 0.6cqh 2cqh;
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

.message-bubble-row-me .message-meta {
    align-items: flex-end;
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
