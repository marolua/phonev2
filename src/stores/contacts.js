import { ref } from "vue";

// Shared by the Contacts app and the Contacts tab inside the Phone app.
export const contacts = ref([]);

// Contacts manually added to the phone's blocked list.
export const blockedContacts = ref([]);
