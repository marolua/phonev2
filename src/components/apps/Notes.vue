<script setup>
import { computed, ref } from 'vue';
import { ArrowLeft, ChevronRight, FileText, Folder, Pin, Plus, Search, Trash2 } from '@lucide/vue';

const notes = ref([
    {
        id: 1,
        title: 'Bienvenue dans Notes',
        body: 'Tes idées, listes et informations importantes seront regroupées ici.',
        updatedAt: Date.now() - 1000 * 60 * 18,
        pinned: true,
    },
    {
        id: 2,
        title: 'Liste de courses',
        body: 'Pain\nLait\nCafé\nFruits',
        updatedAt: Date.now() - 1000 * 60 * 60 * 3,
        pinned: false,
    },
    {
        id: 3,
        title: 'Idées',
        body: 'Préparer les prochaines activités et penser à appeler John.',
        updatedAt: Date.now() - 1000 * 60 * 60 * 24,
        pinned: false,
    },
]);

const searchQuery = ref('');
const selectedNoteId = ref(null);
const draft = ref({ title: '', body: '' });
const isEditorVisible = ref(false);

const selectedNote = computed(() => notes.value.find(({ id }) => id === selectedNoteId.value) || null);

const sortedNotes = computed(() => [...notes.value].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.updatedAt - a.updatedAt;
}));

const visibleNotes = computed(() => {
    const query = searchQuery.value.trim().toLowerCase();
    if (!query) return sortedNotes.value;

    return sortedNotes.value.filter((note) => `${note.title} ${note.body}`.toLowerCase().includes(query));
});

const notePreview = (note) => note.body.replace(/\s+/g, ' ').trim() || 'Aucun texte';

const noteDate = (note) => new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
}).format(note.updatedAt).replace('.', '');

const openNote = (note = null) => {
    selectedNoteId.value = note?.id ?? null;
    draft.value = note ? { title: note.title, body: note.body } : { title: '', body: '' };
    isEditorVisible.value = true;
};

const saveDraft = () => {
    const title = draft.value.title.trim();
    const body = draft.value.body.trim();
    if (!title && !body) return;

    if (selectedNoteId.value === null) {
        notes.value.unshift({
            id: Date.now(),
            title: title || 'Sans titre',
            body,
            updatedAt: Date.now(),
            pinned: false,
        });
    } else if (selectedNote.value) {
        Object.assign(selectedNote.value, {
            title: title || 'Sans titre',
            body,
            updatedAt: Date.now(),
        });
    }
};

const closeEditorWithoutSave = () => {
    isEditorVisible.value = false;
    selectedNoteId.value = null;
    draft.value = { title: '', body: '' };
};

const closeEditor = () => {
    saveDraft();
    closeEditorWithoutSave();
};

const deleteSelectedNote = () => {
    if (selectedNoteId.value === null) return;

    notes.value = notes.value.filter(({ id }) => id !== selectedNoteId.value);
    closeEditorWithoutSave();
};
</script>

<template>
    <div class="notes-app">
        <template v-if="!isEditorVisible">
            <header class="notes-header">
                <div>
                    <h1>Notes</h1>
                </div>
                <button type="button" class="notes-folder-button" aria-label="Dossiers">
                    <Folder size="2.6cqh" />
                </button>
            </header>

            <div class="notes-search">
                <Search size="2.3cqh" />
                <input v-model="searchQuery" type="search" placeholder="Rechercher" />
            </div>

            <div class="notes-summary">
                <span>{{ visibleNotes.length }} note{{ visibleNotes.length > 1 ? 's' : '' }}</span>
                <button type="button" aria-label="Trier les notes">
                    <span>Modifiées récemment</span>
                    <ChevronRight size="1.9cqh" />
                </button>
            </div>

            <main class="notes-list">
                <button v-for="note in visibleNotes" :key="note.id" type="button" class="note-row"
                    @click="openNote(note)">
                    <span class="note-icon" :class="{ pinned: note.pinned }">
                        <Pin v-if="note.pinned" size="2.1cqh" />
                        <FileText v-else size="2.1cqh" />
                    </span>
                    <span class="note-content">
                        <span class="note-heading">
                            <strong>{{ note.title }}</strong>
                            <small>{{ noteDate(note) }}</small>
                        </span>
                        <span class="note-preview">{{ notePreview(note) }}</span>
                    </span>
                    <ChevronRight class="note-chevron" size="2cqh" />
                </button>

                <div v-if="visibleNotes.length === 0" class="notes-empty">
                    <FileText size="5.5cqh" />
                    <strong>Aucune note</strong>
                    <span>Essaie une autre recherche ou crée une nouvelle note.</span>
                </div>
            </main>

            <button type="button" class="new-note-button" aria-label="Nouvelle note" @click="openNote()">
                <Plus size="3.1cqh" />
            </button>
        </template>

        <Transition name="notes-editor">
            <section v-if="isEditorVisible" class="note-editor">
                <header class="note-editor-header">
                    <button type="button" aria-label="Retour" @click="closeEditor">
                        <ArrowLeft size="2.8cqh" />
                    </button>
                    <span>{{ selectedNote ? 'Note' : 'Nouvelle note' }}</span>
                    <button v-if="selectedNote" type="button" class="note-delete-button" aria-label="Supprimer la note"
                        @click="deleteSelectedNote">
                        <Trash2 size="2.4cqh" />
                    </button>
                    <span v-else class="note-editor-spacer" aria-hidden="true"></span>
                </header>

                <div class="note-editor-meta">
                    <span>Modifiée à l’instant</span>
                </div>
                <input v-model="draft.title" class="note-title-input" type="text" placeholder="Titre" />
                <textarea v-model="draft.body" class="note-body-input" placeholder="Commencer à écrire…"></textarea>
                <div class="note-editor-toolbar">
                    <FileText size="2.1cqh" />
                    <span>{{ draft.body.length }} caractères</span>
                </div>
            </section>
        </Transition>
    </div>
</template>

<style scoped lang="scss">
.notes-app {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    max-height: 100%;
    box-sizing: border-box;
    overflow: hidden;
    padding: 15cqw 3cqh 5cqh;
    color: white;
    background: #0a0a0a;
}

.notes-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
}

.notes-eyebrow {
    display: block;
    margin-bottom: 0.2cqh;
    color: rgba(255, 255, 255, 0.45);
    font-size: 1.35cqh;
}

.notes-header h1 {
    margin: 0;
    font-size: 5.2cqh;
    font-weight: 700;
}

.notes-folder-button,
.new-note-button,
.note-editor-header button {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0;
    color: #ffcc00;
    background: transparent;
    cursor: pointer;
}

.notes-folder-button {
    width: 5cqh;
    height: 5cqh;
    border-radius: 50%;
    background: rgba(255, 204, 0, 0.12);
}

.notes-search {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    gap: 1.5cqw;
    height: 5.2cqh;
    margin-top: 2cqh;
    box-sizing: border-box;
    border-radius: 1.4cqh;
    padding: 0 2cqw;
    color: rgba(255, 255, 255, 0.5);
    background: rgba(118, 118, 128, 0.22);
}

.notes-search input {
    min-width: 0;
    flex: 1;
    height: 100%;
    border: 0;
    outline: 0;
    color: white;
    background: transparent;
    font: inherit;
    font-size: 1.75cqh;
}

.notes-search input::placeholder {
    color: rgba(255, 255, 255, 0.5);
}

.notes-summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    margin: 3cqh 1cqw 1cqh;
    color: rgba(255, 255, 255, 0.48);
    font-size: 1.5cqh;
}

.notes-summary button {
    display: flex;
    align-items: center;
    gap: 0.5cqw;
    border: 0;
    padding: 0;
    color: rgba(255, 255, 255, 0.48);
    background: transparent;
    font: inherit;
    font-size: 1.35cqh;
}

.notes-list {
    display: flex;
    flex-direction: column;
    flex: 0 1 auto;
    min-height: 0;
    max-height: 56cqh;
    overflow-y: auto;
    border-radius: 1.5cqh;
    background: rgba(30, 30, 30, 0.92);
}

.note-row {
    display: flex;
    align-items: center;
    gap: 2cqw;
    min-height: 8.8cqh;
    width: 100%;
    box-sizing: border-box;
    border: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    padding: 1cqh 2cqw;
    color: white;
    text-align: left;
    background: transparent;
    font: inherit;
    cursor: pointer;
}

.note-row:last-of-type {
    border-bottom: 0;
}

.note-row:hover {
    background: rgba(255, 255, 255, 0.06);
}

.note-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 5cqh;
    height: 5cqh;
    border-radius: 1.3cqh;
    color: rgba(255, 255, 255, 0.7);
    background: rgba(255, 255, 255, 0.1);
}

.note-icon.pinned {
    color: #ffcc00;
    background: rgba(255, 204, 0, 0.14);
}

.note-content {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
    gap: 0.5cqh;
}

.note-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1cqw;
}

.note-heading strong {
    overflow: hidden;
    font-size: 1.8cqh;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.note-heading small {
    flex-shrink: 0;
    color: rgba(255, 255, 255, 0.42);
    font-size: 1.3cqh;
}

.note-preview {
    overflow: hidden;
    color: rgba(255, 255, 255, 0.5);
    font-size: 1.55cqh;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.note-chevron {
    flex-shrink: 0;
    color: rgba(255, 255, 255, 0.28);
}

.notes-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    flex: 1;
    min-height: 18cqh;
    gap: 1cqh;
    padding: 5cqh 8cqw;
    color: rgba(255, 255, 255, 0.35);
    text-align: center;
}

.notes-empty strong {
    color: rgba(255, 255, 255, 0.8);
    font-size: 2cqh;
}

.notes-empty span {
    font-size: 1.45cqh;
    line-height: 1.4;
}

.new-note-button {
    position: absolute;
    right: 3cqw;
    bottom: 6cqh;
    width: 6cqh;
    height: 6cqh;
    border-radius: 50%;
    color: #0a0a0a;
    background: #ffcc00;
    box-shadow: 0 1cqh 3cqh rgba(0, 0, 0, 0.4);
}

.note-editor {
    position: absolute;
    z-index: 3;
    inset: 0;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 8cqh 3cqh 5cqh;
    background: #0a0a0a;
}

.note-editor-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    min-height: 5cqh;
    color: rgba(255, 255, 255, 0.85);
    font-size: 2.25cqh;
    font-weight: 600;
}

.note-editor-header button {
    width: 5cqh;
    height: 5cqh;
    border-radius: 50%;
}

.note-editor-header button:first-child {
    width: 5cqh;
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: white;
    background: rgba(55, 55, 58, 0.85);
    box-shadow: 0 0.6cqh 1.2cqh rgba(0, 0, 0, 0.45);
}

.note-delete-button {
    border: 1px solid rgba(255, 69, 58, 0.25) !important;
    background: rgba(255, 69, 58, 0.12) !important;
    color: #ff453a !important;
}

.note-editor-spacer {
    width: 5cqh;
}

.note-editor-meta {
    margin: 3cqh 0 1cqh;
    color: rgba(255, 255, 255, 0.4);
    font-size: 1.35cqh;
}

.note-title-input,
.note-body-input {
    width: 100%;
    box-sizing: border-box;
    border: 0;
    outline: 0;
    color: white;
    background: transparent;
    font-family: inherit;
}

.note-title-input {
    flex-shrink: 0;
    font-size: 3.1cqh;
    font-weight: 700;
}

.note-title-input::placeholder,
.note-body-input::placeholder {
    color: rgba(255, 255, 255, 0.32);
}

.note-body-input {
    flex: 1;
    min-height: 0;
    resize: none;
    margin-top: 2cqh;
    color: rgba(255, 255, 255, 0.88);
    font-size: 1.9cqh;
    line-height: 1.45;
}

.note-editor-toolbar {
    display: flex;
    align-items: center;
    gap: 1cqw;
    flex-shrink: 0;
    padding-top: 1.5cqh;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.42);
    font-size: 1.35cqh;
}

.notes-editor-enter-active,
.notes-editor-leave-active {
    transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.2s ease;
}

.notes-editor-enter-from,
.notes-editor-leave-to {
    opacity: 0;
    transform: translateX(100%);
}
</style>
