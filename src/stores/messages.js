import { ref } from 'vue';

// Nombre de messages non lus affiché sur l'icône Messages.
export const unreadMessageCount = ref(2);

export const markMessagesAsRead = () => {
    unreadMessageCount.value = 0;
};
