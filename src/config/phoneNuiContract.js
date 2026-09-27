/*
 * Contrat NUI partage entre le front Vue et le futur client Lua.
 * Les noms sont volontairement stables : ils deviennent les noms des
 * RegisterNUICallback cote Lua et des actions SendNUIMessage cote Lua.
 */
export const phoneNuiCallbacks = Object.freeze({
  ready: 'phoneReady',
  setVisible: 'phoneSetVisible',
  appOpened: 'phoneAppOpened',
  appClosed: 'phoneAppClosed',
  startCall: 'phoneStartCall',
  answerCall: 'phoneAnswerCall',
  rejectCall: 'phoneRejectCall',
  endCall: 'phoneEndCall',
  messageOpened: 'phoneMessageOpened',
  airdropResponse: 'phoneAirdropResponse',
  getContacts: 'getContacts',
  createContact: 'createContact',
  updateContact: 'updateContact',
  deleteContact: 'deleteContact',
  blockContact: 'blockContact',
  getConversations: 'getConversations',
  createConversation: 'createConversation',
  sendMessage: 'sendMessage',
  getPhotos: 'getPhotos',
  savePhoto: 'savePhoto',
  deletePhoto: 'deletePhoto',
  getNotes: 'getNotes',
  saveNote: 'saveNote',
  deleteNote: 'deleteNote',
  getPhoneSettings: 'getPhoneSettings',
  savePhoneSettings: 'savePhoneSettings',
  getBankData: 'getBankData',
  bankAction: 'bankAction',
  getKwikerPosts: 'getKwikerPosts',
  publishKwik: 'publishKwik',
  getKwikerProfile: 'getKwikerProfile',
  saveKwikerProfile: 'saveKwikerProfile',
});

export const phoneNuiActions = Object.freeze({
  show: 'phone:show',
  hide: 'phone:hide',
  toggle: 'phone:toggle',
  incomingCall: 'phone:incoming-call',
  message: 'phone:message',
  airdrop: 'phone:airdrop',
  contactsUpdated: 'phone:contacts-updated',
  conversationsUpdated: 'phone:conversations-updated',
  photosUpdated: 'phone:photos-updated',
  notesUpdated: 'phone:notes-updated',
  settingsUpdated: 'phone:settings-updated',
  callState: 'phone:call-state',
});
