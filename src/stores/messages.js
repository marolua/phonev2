import { ref } from "vue";

export const unreadMessageCount = ref(2);

export const markMessagesAsRead = () => {
  unreadMessageCount.value = 0;
};
