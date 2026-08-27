<script setup>
import { ArrowLeft, Volume2, ALargeSmall, Sun, ChevronRight, RotateCcw, Languages, Check, X, Copy, Pencil, PhoneOff, Plus, Unlock } from '@lucide/vue';
import { blockedContacts } from '../../stores/contacts';
import { brightness, callVolume, displayScale, phoneNumber, resetPhoneSettings, selectedLanguage, selectedWallpaper, systemVolume } from '../../stores/phoneSettings';
import { formatPhoneNumber, isPhoneSuffixValid, phoneDigits } from '../../utils/phoneNumber';
import { computed, ref } from 'vue';
const props = defineProps({
  category: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(['close']);
const showLanguagePicker = ref(false);
const showResetConfirmation = ref(false);
const showBlockedContacts = ref(false);
const showBlockedEditor = ref(false);
const copiedPhoneNumber = ref(false);
const editingBlockedContactId = ref(null);
const blockedContactDraft = ref({ name: '', phone: '' });

const languages = ['Français', 'English', 'Español', 'Deutsch'];

const selectLanguage = (language) => {
  selectedLanguage.value = language;
  showLanguagePicker.value = false;
};

const resetSettings = () => {
  resetPhoneSettings();
  showResetConfirmation.value = false;
};

const copyPhoneNumber = async () => {
  try {
    await navigator.clipboard.writeText(phoneNumber.value);
  } catch {
    const input = document.createElement('textarea');
    input.value = phoneNumber.value;
    input.setAttribute('readonly', '');
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
  }

  copiedPhoneNumber.value = true;
  window.setTimeout(() => {
    copiedPhoneNumber.value = false;
  }, 1600);
};

const emptyBlockedContact = () => ({ name: '', phone: '' });

const openBlockedEditor = (contact = null) => {
  editingBlockedContactId.value = contact?.id ?? null;
  blockedContactDraft.value = contact ? { name: contact.name, phone: phoneDigits(contact.phone) } : emptyBlockedContact();
  showBlockedEditor.value = true;
};

const closeBlockedEditor = () => {
  showBlockedEditor.value = false;
  editingBlockedContactId.value = null;
  blockedContactDraft.value = emptyBlockedContact();
};

const saveBlockedContact = () => {
  const name = blockedContactDraft.value.name.trim();
  const phone = phoneDigits(blockedContactDraft.value.phone);
  if (!name || !isPhoneSuffixValid(phone)) return;

  if (editingBlockedContactId.value !== null) {
    const contact = blockedContacts.value.find(({ id }) => id === editingBlockedContactId.value);
    if (contact) Object.assign(contact, { name, phone: formatPhoneNumber(phone) });
  } else {
    blockedContacts.value.push({ id: Date.now(), name, phone: formatPhoneNumber(phone) });
  }

  closeBlockedEditor();
};

const unblockContact = (id) => {
  blockedContacts.value = blockedContacts.value.filter((contact) => contact.id !== id);
};

const close = () => emit('close');
const wallpaperModules = import.meta.glob('../../assets/wallpapers/*.{png,jpg,jpeg}', { eager: true });
const wallpapers = Object.keys(wallpaperModules).map((k) => {
  const m = wallpaperModules[k];
  return (m && (m.default || m)) || '';
});

const currentSelected = computed(() => selectedWallpaper.value || (wallpapers.length ? wallpapers[0] : ''));

const selectWallpaper = (url) => {
  if (!url) return;
  selectedWallpaper.value = url;
};
</script>

<template>
  <div class="settings-category-page">
    <div class="detail-header">
      <button type="button" class="detail-back" @click="close" aria-label="Retour">
        <ArrowLeft size="3cqh" />
      </button>
      <span class="detail-title">{{ category.name }}</span>
    </div>

    <div class="detail-content">
      <template v-if="category.id === 'sound'">
        <div class="setting-row">
          <div class="label">Volume des appels</div>
          <div class="slider-wrap">
            <div class="slider-pill">
              <Volume2 class="speaker-icon" size="2cqh" />
              <input class="ios-range" type="range" min="0" max="100" v-model="callVolume"
                :style="{ background: `linear-gradient(90deg, #4d8dff ${callVolume}%, rgba(255,255,255,0.12) ${callVolume}%)` }" />
              <Volume2 class="speaker-icon right" size="2cqh" />
            </div>
          </div>
        </div>

        <div class="setting-row">
          <div class="label">Volume du système</div>
          <div class="slider-wrap">
            <div class="slider-pill">
              <Volume2 class="speaker-icon" size="2cqh" />
              <input class="ios-range" type="range" min="0" max="100" v-model="systemVolume"
                :style="{ background: `linear-gradient(90deg, #4d8dff ${systemVolume}%, rgba(255,255,255,0.12) ${systemVolume}%)` }" />
              <Volume2 class="speaker-icon right" size="2cqh" />
            </div>
          </div>
        </div>
      </template>

      <template v-else-if="category.id === 'general'">
        <div class="general-page">
          <div class="general-section">
            <div class="section-title">Informations</div>
            <div class="general-group">
              <div class="general-row">
                <span>Nom du téléphone</span>
                <span class="row-value">iPhone</span>
              </div>
              <div class="general-row">
                <span>Version</span>
                <span class="row-value">0.5.0</span>
              </div>
              <div class="general-row">
                <span>Développé par</span>
                <span class="row-value">Mrl</span>
              </div>
            </div>
          </div>

          <div class="general-section">
            <div class="section-title">Préférences</div>
            <div class="general-group">
              <button type="button" class="general-row general-row-button" @click="showLanguagePicker = true">
                <span class="row-leading">
                  <Languages class="general-row-icon" size="2.2cqh" />
                  <span>Langue</span>
                </span>
                <span class="row-trailing">
                  <span class="row-value">{{ selectedLanguage }}</span>
                  <ChevronRight class="row-chevron" size="2.2cqh" />
                </span>
              </button>
            </div>
          </div>

          <div class="general-section reset-section">
            <div class="general-group">
              <button type="button" class="reset-button" @click="showResetConfirmation = true">
                <RotateCcw size="2.2cqh" />
                <span>Réinitialiser le téléphone</span>
              </button>
            </div>
            <p class="reset-hint">Les réglages du téléphone seront remis à leur état par défaut.</p>
          </div>
        </div>

        <Transition name="general-modal">
          <div v-if="showLanguagePicker" class="general-modal-backdrop" @click.self="showLanguagePicker = false">
            <div class="general-modal language-modal">
              <div class="modal-header">
                <div>
                  <span class="modal-eyebrow">RÉGLAGES</span>
                  <h2>Choisir une langue</h2>
                </div>
                <button type="button" class="modal-close" aria-label="Fermer" @click="showLanguagePicker = false">
                  <X size="2.2cqh" />
                </button>
              </div>
              <div class="language-list">
                <button v-for="language in languages" :key="language" type="button" class="language-option"
                  :class="{ selected: selectedLanguage === language }" @click="selectLanguage(language)">
                  <span>{{ language }}</span>
                  <Check v-if="selectedLanguage === language" size="2.2cqh" />
                </button>
              </div>
            </div>
          </div>
        </Transition>

        <Transition name="general-modal">
          <div v-if="showResetConfirmation" class="general-modal-backdrop" @click.self="showResetConfirmation = false">
            <div class="general-modal reset-modal">
              <div class="modal-symbol danger-symbol">
                <RotateCcw size="3cqh" />
              </div>
              <h2>Réinitialiser le téléphone ?</h2>
              <p>La taille, la luminosité, le volume, la langue et le fond d’écran seront remis par défaut.</p>
              <button type="button" class="modal-action danger-action" @click="resetSettings">Réinitialiser</button>
              <button type="button" class="modal-action cancel-action" @click="showResetConfirmation = false">Annuler</button>
            </div>
          </div>
        </Transition>
      </template>

      <template v-else-if="category.id === 'display'">
        <div class="setting-row">
          <div class="label">Taille du téléphone</div>
          <div class="slider-wrap">
            <div class="slider-pill">
              <ALargeSmall class="display-icon" size="2cqh" />
              <input class="ios-range" type="range" min="75" max="125" v-model.number="displayScale"
                :style="{ background: `linear-gradient(90deg, #4d8dff ${((displayScale - 75) / 50) * 100}%, rgba(255,255,255,0.12) ${((displayScale - 75) / 50) * 100}%)` }" />
              <ALargeSmall class="display-icon right" size="2.8cqh" />
            </div>
          </div>
        </div>

        <div class="setting-row">
          <div class="label">Luminosité</div>
          <div class="slider-wrap">
            <div class="slider-pill">
              <Sun class="display-icon" size="2cqh" />
              <input class="ios-range" type="range" min="0" max="100" v-model.number="brightness"
                :style="{ background: `linear-gradient(90deg, #4d8dff ${brightness}%, rgba(255,255,255,0.12) ${brightness}%)` }" />
              <Sun class="display-icon right" size="2.8cqh" />
            </div>
          </div>
        </div>
      </template>

      <template v-else-if="category.id === 'phone'">
        <div class="phone-settings-page">
          <div class="general-section">
            <div class="section-title">Mon numéro</div>
            <div class="general-group">
              <div class="phone-number-row">
                <span class="phone-number-value">{{ phoneNumber }}</span>
                <button type="button" class="copy-number-button" :class="{ copied: copiedPhoneNumber }"
                  :aria-label="copiedPhoneNumber ? 'Numéro copié' : 'Copier le numéro'" @click="copyPhoneNumber">
                  <Check v-if="copiedPhoneNumber" size="2.1cqh" />
                  <Copy v-else size="2.1cqh" />
                  <span>{{ copiedPhoneNumber ? 'Copié' : 'Copier' }}</span>
                </button>
              </div>
            </div>
          </div>

          <div class="general-section">
            <div class="section-title">Sécurité</div>
            <div class="general-group">
              <button type="button" class="general-row general-row-button" @click="showBlockedContacts = true">
                <span class="row-leading">
                  <PhoneOff class="general-row-icon blocked-icon" size="2.2cqh" />
                  <span>Contacts bloqués</span>
                </span>
                <span class="row-trailing">
                  <span class="row-value">{{ blockedContacts.length }}</span>
                  <ChevronRight class="row-chevron" size="2.2cqh" />
                </span>
              </button>
            </div>
          </div>
        </div>

        <Transition name="general-modal">
          <div v-if="showBlockedContacts" class="blocked-contacts-page">
            <div class="blocked-header">
              <button type="button" class="detail-back" aria-label="Retour" @click="showBlockedContacts = false">
                <ArrowLeft size="3cqh" />
              </button>
              <span class="detail-title">Contacts bloqués</span>
              <button type="button" class="add-blocked-button" aria-label="Ajouter un contact bloqué"
                @click="openBlockedEditor()">
                <Plus size="2.6cqh" />
              </button>
            </div>

            <div class="blocked-content">
              <div v-if="blockedContacts.length === 0" class="blocked-empty">
                <PhoneOff size="5cqh" />
                <span>Aucun contact bloqué</span>
                <small>Les contacts que tu ajoutes apparaîtront ici.</small>
              </div>

              <div v-else class="general-group blocked-list">
                <div v-for="contact in blockedContacts" :key="contact.id" class="blocked-contact-row">
                  <div class="blocked-avatar">{{ contact.name.charAt(0).toUpperCase() }}</div>
                  <div class="blocked-contact-info">
                    <span>{{ contact.name }}</span>
                    <small>{{ contact.phone }}</small>
                  </div>
                  <div class="blocked-contact-actions">
                    <button type="button" aria-label="Modifier le contact" @click="openBlockedEditor(contact)">
                      <Pencil size="1.9cqh" />
                    </button>
                    <button type="button" aria-label="Débloquer le contact" @click="unblockContact(contact.id)">
                      <Unlock size="1.9cqh" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>

        <Transition name="general-modal">
          <div v-if="showBlockedEditor" class="general-modal-backdrop blocked-editor-backdrop" @click.self="closeBlockedEditor">
            <div class="general-modal blocked-editor-modal">
              <div class="sheet-grabber" aria-hidden="true"></div>
              <div class="modal-header">
                <div>
                  <span class="modal-eyebrow">CONTACTS BLOQUÉS</span>
                  <h2>{{ editingBlockedContactId === null ? 'Ajouter un contact' : 'Modifier le contact' }}</h2>
                </div>
                <button type="button" class="modal-close" aria-label="Fermer" @click="closeBlockedEditor">
                  <X size="2.2cqh" />
                </button>
              </div>

              <label class="blocked-field">
                <span>Nom</span>
                <input v-model="blockedContactDraft.name" type="text" placeholder="Nom du contact" />
              </label>
              <label class="blocked-field">
                <span>Numéro</span>
                <div class="blocked-phone-entry">
                  <span class="blocked-phone-prefix">555-</span>
                  <input v-model="blockedContactDraft.phone" type="tel" inputmode="numeric" maxlength="4"
                    placeholder="1234" />
                </div>
              </label>

              <button type="button" class="modal-action save-blocked-action" @click="saveBlockedContact">
                Enregistrer
              </button>
              <button type="button" class="modal-action cancel-action" @click="closeBlockedEditor">Annuler</button>
            </div>
          </div>
        </Transition>
      </template>

      <template v-else-if="category.id === 'wallpaper'">
        <div class="wallpaper-page">
          <div class="wallpaper-grid">
            <button v-for="(img, idx) in wallpapers" :key="idx"
              :class="['wallpaper-item', { selected: img === currentSelected }]" type="button"
              @click="selectWallpaper(img)">
              <img :src="img" :alt="`Fond d\'écran ${idx + 1}`" />
            </button>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="placeholder">Paramètres pour {{ category.name }} — contenu à venir.</div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.settings-category-page {
  position: absolute;
  inset: 0;
  z-index: 6;
  box-sizing: border-box;
  background: rgb(10, 10, 10);
  padding: 8cqh 5cqw 5cqh;
  display: flex;
  flex-direction: column;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 2cqw;
}

.detail-back {
  width: 5cqh;
  height: 5cqh;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(55, 55, 58, 0.95);
  box-shadow: 0 0.6cqh 1.2cqh rgba(0, 0, 0, 0.45);

  &:hover {
    cursor: pointer;
  }
}

.detail-title {
  font-size: 2.5cqh;
  font-weight: 700;
  color: white;
  margin-left: 2.5cqw;
}

.detail-content {
  margin-top: 3.5cqh;
  display: flex;
  flex-direction: column;
  gap: 0cqh;
  flex: 1 1 auto;
  overflow-y: auto;
}

.setting-row {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 1.5cqh 2cqw;
  border-radius: 1.2cqh;
}


.label {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.9cqh;
  margin-bottom: 1cqh;
}

.slider-wrap {
  display: flex;
  align-items: center;
  gap: 1cqw;
  width: 100%;
}

.slider-wrap .value {
  color: rgba(255, 255, 255, 0.7);
  min-width: 3cqh;
  text-align: right
}

.value-row {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.9cqh;
}

.speaker-icon {
  color: rgba(255, 255, 255, 0.55);
  flex-shrink: 0
}

.speaker-icon.right {
  opacity: 0.6
}

.display-icon {
  color: rgba(255, 255, 255, 0.55);
  flex-shrink: 0;
}

.display-icon.right {
  opacity: 0.6;
}

.slider-pill {
  display: flex;
  align-items: center;
  gap: 1cqw;
  width: 100%;
  padding: 3cqw 2.5cqw;
  border-radius: 2.2cqh;
  background: rgba(255, 255, 255, 0.03);
}

.slider-pill .speaker-icon {
  color: rgba(255, 255, 255, 0.65)
}

.slider-pill .ios-range {
  margin: 0 1.2cqw;
  flex: 1
}

.value-row {
  display: none
}

.placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.general-page {
  width: 100%;
  padding-bottom: 5cqh;
}

.general-section {
  margin-bottom: 3cqh;
}

.section-title {
  margin: 0 0 1cqh 2cqw;
  color: rgba(255, 255, 255, 0.52);
  font-size: 1.7cqh;
  font-weight: 600;
  letter-spacing: 0.08cqh;
  text-transform: uppercase;
}

.general-group {
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 1.4cqh;
  background: rgba(30, 30, 30, 0.9);
}

.general-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  min-height: 5.9cqh;
  width: 100%;
  padding: 0 2cqw;
  color: rgba(255, 255, 255, 0.92);
  font-size: 1.75cqh;
  text-align: left;
}

.general-row + .general-row {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.general-row-button {
  border: 0;
  background: transparent;
  font: inherit;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.general-row-button:hover {
  background: rgba(255, 255, 255, 0.06);
}

.row-value {
  max-width: 55%;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.52);
  font-size: 1.65cqh;
  text-align: right;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.row-leading,
.row-trailing {
  display: flex;
  align-items: center;
}

.row-leading {
  gap: 1.5cqw;
}

.row-trailing {
  gap: 1cqw;
}

.general-row-icon {
  color: #4d8dff;
}

.blocked-icon {
  color: #ff453a;
}

.row-chevron {
  color: rgba(255, 255, 255, 0.38);
}

.reset-section {
  margin-top: 1cqh;
}

.reset-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5cqw;
  box-sizing: border-box;
  min-height: 5.4cqh;
  width: 100%;
  border: 0;
  padding: 1.5cqh 2cqw;
  color: #ff453a;
  font: inherit;
  font-size: 1.6cqh;
  cursor: pointer;
  background: transparent;
  transition: background-color 0.15s ease;
}

.reset-button:hover {
  background: rgba(255, 69, 58, 0.08);
}

.reset-hint {
  margin: 0.8cqh 2cqw 0;
  color: rgba(255, 255, 255, 0.42);
  font-size: 1.35cqh;
  line-height: 1.35;
  text-align: center;
}

.phone-number-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  min-height: 6.2cqh;
  padding: 0 2cqw;
}

.phone-number-value {
  color: white;
  font-size: 2.1cqh;
  font-weight: 600;
  letter-spacing: 0.08cqw;
}

.copy-number-button,
.add-blocked-button {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  color: #4d8dff;
  background: transparent;
  cursor: pointer;
}

.copy-number-button {
  gap: 1cqw;
  padding: 1cqh 1cqw;
  border-radius: 1cqh;
  font: inherit;
  font-size: 1.55cqh;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.copy-number-button:hover {
  background: rgba(77, 141, 255, 0.12);
}

.copy-number-button.copied {
  color: #30d158;
}

.blocked-contacts-page {
  position: absolute;
  z-index: 8;
  inset: 0;
  box-sizing: border-box;
  padding: 8cqh 5cqw 5cqh;
  background: rgb(10, 10, 10);
}

.blocked-header {
  display: flex;
  align-items: center;
}

.add-blocked-button {
  width: 4.5cqh;
  height: 4.5cqh;
  margin-left: auto;
  border-radius: 50%;
  background: rgba(77, 141, 255, 0.14);
}

.add-blocked-button:hover {
  background: rgba(77, 141, 255, 0.25);
}

.blocked-content {
  margin-top: 3.5cqh;
  overflow-y: auto;
  max-height: calc(100% - 8cqh);
}

.blocked-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1cqh;
  padding: 12cqh 4cqw;
  color: rgba(255, 255, 255, 0.35);
  text-align: center;
}

.blocked-empty span {
  color: rgba(255, 255, 255, 0.75);
  font-size: 1.9cqh;
}

.blocked-empty small {
  max-width: 75%;
  font-size: 1.45cqh;
  line-height: 1.35;
}

.blocked-list {
  width: 100%;
}

.blocked-contact-row {
  display: flex;
  align-items: center;
  min-height: 7.2cqh;
  padding: 0 2cqw;
}

.blocked-contact-row + .blocked-contact-row {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.blocked-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 4.3cqh;
  height: 4.3cqh;
  border-radius: 50%;
  color: white;
  font-size: 1.8cqh;
  font-weight: 600;
  background: linear-gradient(145deg, rgb(90, 90, 90), rgb(50, 50, 50));
}

.blocked-contact-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
  margin-left: 2cqw;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.7cqh;
}

.blocked-contact-info small {
  margin-top: 0.35cqh;
  color: rgba(255, 255, 255, 0.48);
  font-size: 1.4cqh;
}

.blocked-contact-actions {
  display: flex;
  gap: 0.7cqw;
  margin-left: auto;
}

.blocked-contact-actions button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.8cqh;
  height: 3.8cqh;
  border: 0;
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.65);
  background: rgba(255, 255, 255, 0.08);
  cursor: pointer;
}

.blocked-contact-actions button:hover {
  color: white;
  background: rgba(255, 255, 255, 0.16);
}

.blocked-editor-modal {
  width: 100%;
  border-right: 0;
  border-bottom: 0;
  border-left: 0;
  border-radius: 2.8cqh 2.8cqh 0 0;
  padding: 1.2cqh 4cqw 3cqh;
  background: rgba(28, 28, 30, 0.99);
}

.blocked-editor-backdrop {
  align-items: flex-end;
  padding: 0;
}

.sheet-grabber {
  width: 9cqw;
  height: 0.55cqh;
  margin: 0 auto 2cqh;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.28);
}

.blocked-field {
  display: block;
  margin-top: 1.3cqh;
  color: rgba(255, 255, 255, 0.58);
  font-size: 1.45cqh;
}

.blocked-field input {
  display: block;
  box-sizing: border-box;
  width: 100%;
  height: 5.2cqh;
  margin-top: 0.7cqh;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1.1cqh;
  padding: 0 1.5cqw;
  outline: none;
  color: white;
  font: inherit;
  font-size: 1.65cqh;
  background: rgba(255, 255, 255, 0.07);
}

.blocked-field input:focus {
  border-color: rgba(77, 141, 255, 0.8);
}

.blocked-phone-entry {
  display: flex;
  align-items: center;
  height: 5.2cqh;
  margin-top: 0.7cqh;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1.1cqh;
  background: rgba(255, 255, 255, 0.07);
}

.blocked-phone-prefix {
  flex-shrink: 0;
  padding-left: 1.5cqw;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.65cqh;
}

.blocked-phone-entry input {
  height: 100%;
  margin-top: 0;
  border: 0;
  background: transparent;
}

.blocked-field input::placeholder {
  color: rgba(255, 255, 255, 0.32);
}

.save-blocked-action {
  margin-top: 2cqh;
  color: white;
  background: #4d8dff;
}

.blocked-editor-modal .cancel-action {
  color: #4d8dff;
  background: rgba(255, 255, 255, 0.06);
}

.general-modal-backdrop {
  position: absolute;
  z-index: 10;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4cqw;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.58);
  backdrop-filter: blur(0.7cqw);
}

.general-modal {
  width: 100%;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 2.2cqh;
  background: rgba(38, 38, 40, 0.98);
  box-shadow: 0 1.5cqh 4cqh rgba(0, 0, 0, 0.5);
}

.language-modal {
  width: 88%;
  padding: 2.2cqh 2.2cqw;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 2cqh;
}

.modal-eyebrow {
  color: rgba(255, 255, 255, 0.42);
  font-size: 1.2cqh;
  font-weight: 600;
  letter-spacing: 0.1cqh;
}

.general-modal h2 {
  margin: 0.5cqh 0 0;
  color: white;
  font-size: 2.3cqh;
  font-weight: 700;
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.7cqh;
  height: 3.7cqh;
  border: 0;
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.75);
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
}

.language-list {
  width: 94%;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 1.4cqh;
  background: rgba(255, 255, 255, 0.06);
}

.language-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  min-height: 6.4cqh;
  width: 100%;
  border: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0 3.2cqw;
  color: rgba(255, 255, 255, 0.9);
  font: inherit;
  font-size: 1.7cqh;
  text-align: left;
  background: transparent;
  cursor: pointer;
}

.language-option:last-child {
  border-bottom: 0;
}

.language-option:hover,
.language-option.selected {
  color: #4d8dff;
  background: rgba(77, 141, 255, 0.1);
}

.reset-modal {
  padding: 3cqh 3cqw 2cqh;
  text-align: center;
}

.modal-symbol {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 7cqh;
  height: 7cqh;
  margin: 0 auto 1.5cqh;
  border-radius: 2cqh;
}

.danger-symbol {
  color: #ff453a;
  background: rgba(255, 69, 58, 0.14);
}

.reset-modal p {
  margin: 1.4cqh 0 2.5cqh;
  color: rgba(255, 255, 255, 0.58);
  font-size: 1.55cqh;
  line-height: 1.4;
}

.modal-action {
  display: block;
  min-height: 5.8cqh;
  width: 100%;
  border: 0;
  border-radius: 1.2cqh;
  font: inherit;
  font-size: 1.7cqh;
  font-weight: 600;
  cursor: pointer;
}

.danger-action {
  color: white;
  background: #ff453a;
}

.cancel-action {
  margin-top: 1cqh;
  color: rgba(255, 255, 255, 0.85);
  background: rgba(255, 255, 255, 0.08);
}

.modal-action:hover {
  filter: brightness(1.1);
}

.general-modal-enter-active,
.general-modal-leave-active {
  transition: opacity 0.18s ease;
}

.general-modal-enter-active .general-modal,
.general-modal-leave-active .general-modal {
  transition: transform 0.18s ease, opacity 0.18s ease;
}

.general-modal-enter-from,
.general-modal-leave-to {
  opacity: 0;
}

.general-modal-enter-from .general-modal,
.general-modal-leave-to .general-modal {
  opacity: 0;
  transform: scale(0.96) translateY(1cqh);
}

/* iOS-like range styles */
.ios-range {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 1.1cqh;
  background: transparent;
  cursor: pointer;
  border-radius: 2cqh;
}

.ios-range:focus {
  outline: none;
}

.ios-range::-webkit-slider-runnable-track {
  height: 0cqh;
  background: transparent;
  border-radius: 99px;
}

.ios-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 2.5cqh;
  height: 2.5cqh;
  margin-top: -1.25cqh;
  background: #ffffff;
  border-radius: 50%;
  box-shadow: 0 0.6cqh 1.6cqh rgba(0, 0, 0, 0.55);
  border: 0.25cqh solid rgba(0, 0, 0, 0.08);
}

.ios-range::-moz-range-track {
  height: 0.9cqh;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 99px;
}

.ios-range::-moz-range-thumb {
  width: 3.2cqh;
  height: 3.2cqh;
  background: #ffffff;
  border-radius: 50%;
  box-shadow: 0 0.4cqh 1.2cqh rgba(0, 0, 0, 0.45);
  border: 0.25cqh solid rgba(0, 0, 0, 0.08);
}

/* filled track will come from inline background style set on the input element */

.wallpaper-page {
  width: 100%;
  box-sizing: border-box;
}

.wallpaper-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.6cqw;
  padding: 1cqw 0 6cqh 0;
}

.wallpaper-item {
  border: none;
  padding: 0;
  background: transparent;
  border-radius: 1.2cqh;
  overflow: hidden;
  box-shadow: 0 0.6cqh 1.2cqh rgba(0, 0, 0, 0.45);
  height: 28cqh;
  display: block;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}

.wallpaper-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.wallpaper-item.selected {
  outline: 1px solid rgba(77, 141, 255, 0.85);
}
</style>
