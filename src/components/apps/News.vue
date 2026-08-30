<script setup>
import { computed, ref } from 'vue';
import {
    ArrowLeft,
    Bell,
    Bookmark,
    Camera,
    ChevronRight,
    ImagePlus,
    Newspaper,
    Plus,
    Search,
    Send,
    Share2,
    X,
} from '@lucide/vue';
import { useNewsFeed } from '../../composables/useNewsFeed';

const props = defineProps({
    initialNews: { type: Array, default: () => [] },
    playerContext: { type: Object, default: null },
});

const {
    articles,
    isLoading,
    lastError,
    isFiveM,
    playerContext: bridgePlayerContext,
    publishArticle,
} = useNewsFeed(props.initialNews);
const activeCategory = ref('Pour toi');
const searchQuery = ref('');
const selectedArticle = ref(null);
const savedArticles = ref([]);
const isComposerVisible = ref(false);
const isPublishing = ref(false);
const publishNotice = ref('');
const imageInput = ref(null);
const draft = ref({ title: '', excerpt: '', content: '', category: 'Actualités', image: '' });

const categories = ['Pour toi', 'Actualités', 'Vie locale', 'Sécurité', 'Sport'];
categories.push('Enregistrés');
const draftCategories = categories.slice(1, 5);

const currentPlayer = computed(() => props.playerContext || bridgePlayerContext.value || (isFiveM.value ? {} : {
    job: 'journalist',
    name: 'Maya Brooks',
}));

const isJournalist = computed(() => {
    const job = String(currentPlayer.value?.job || currentPlayer.value?.jobName || '').toLowerCase();
    return Boolean(currentPlayer.value?.isJournalist)
        || ['journalist', 'journaliste', 'reporter', 'news'].includes(job);
});

const featuredArticle = computed(() => articles.value.find(({ featured }) => featured) || articles.value[0] || null);

const visibleArticles = computed(() => {
    const query = searchQuery.value.trim().toLowerCase();
    const hideFeatured = activeCategory.value === 'Pour toi' && !query;
    return articles.value.filter((article) => {
        const categoryMatches = activeCategory.value === 'Pour toi'
            || (activeCategory.value === 'Enregistrés'
                ? savedArticles.value.includes(article.id)
                : article.category === activeCategory.value);
        const searchMatches = !query || (article.title + ' ' + article.excerpt + ' ' + article.author).toLowerCase().includes(query);
        return categoryMatches && searchMatches && (!hideFeatured || article.id !== featuredArticle.value?.id);
    });
});

const articleImageStyle = (article) => {
    if (!article?.image) return {};
    return article.image.includes('gradient')
        ? { background: article.image }
        : { backgroundImage: 'url(' + article.image + ')' };
};

const formatDate = (timestamp) => new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
}).format(timestamp).replace('.', '');

const formatRelativeDate = (timestamp) => {
    const minutes = Math.max(0, Math.round((Date.now() - timestamp) / 60000));
    if (minutes < 1) return 'À l’instant';
    if (minutes < 60) return 'Il y a ' + minutes + ' min';
    if (minutes < 1440) return 'Il y a ' + Math.round(minutes / 60) + ' h';
    return formatDate(timestamp);
};

const openArticle = (article) => { selectedArticle.value = article; };
const closeArticle = () => { selectedArticle.value = null; };

const toggleSaved = (article) => {
    savedArticles.value = savedArticles.value.includes(article.id)
        ? savedArticles.value.filter((id) => id !== article.id)
        : [...savedArticles.value, article.id];
};

const openComposer = () => {
    publishNotice.value = '';
    lastError.value = '';
    draft.value = { title: '', excerpt: '', content: '', category: 'Actualités', image: '' };
    isComposerVisible.value = true;
};

const closeComposer = () => {
    if (!isPublishing.value) isComposerVisible.value = false;
};

const readImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => { draft.value.image = String(reader.result || ''); };
    reader.readAsDataURL(file);
};

const publish = async () => {
    const title = draft.value.title.trim();
    const excerpt = draft.value.excerpt.trim();
    const content = draft.value.content.trim();

    if (!title || !excerpt || !content) {
        publishNotice.value = 'Ajoute un titre, un résumé et le contenu de l’article.';
        return;
    }

    isPublishing.value = true;
    publishNotice.value = '';
    const published = await publishArticle({
        ...draft.value,
        title,
        excerpt,
        content,
        author: currentPlayer.value?.name || 'Rédaction News',
        publishedAt: Date.now(),
        featured: false,
    });
    isPublishing.value = false;

    if (!published) {
        publishNotice.value = lastError.value || 'La publication a échoué.';
        return;
    }

    isComposerVisible.value = false;
    activeCategory.value = 'Pour toi';
};
</script>

<template>
    <div class="news-app">
        <template v-if="!selectedArticle && !isComposerVisible">
            <header class="news-header">
                <div class="news-brand">
                    <span class="news-brand__mark">
                        <Newspaper :size="16" />
                    </span>
                    <div>
                        <h1>News</h1>
                    </div>
                </div>
                <div class="news-header-actions">
                    <button type="button" aria-label="Rechercher" @click="searchQuery = searchQuery ? '' : ' '">
                        <Search :size="19" />
                    </button>
                    <button type="button" aria-label="Notifications">
                        <Bell :size="19" />
                    </button>
                </div>
            </header>

            <div v-if="searchQuery" class="news-search">
                <Search :size="16" />
                <input v-model="searchQuery" type="search" placeholder="Rechercher un article" autofocus />
                <button type="button" aria-label="Effacer la recherche" @click="searchQuery = ''">
                    <X :size="15" />
                </button>
            </div>

            <div class="news-categories" role="tablist" aria-label="Catégories News">
                <button v-for="category in categories" :key="category" type="button" role="tab"
                    :aria-selected="activeCategory === category"
                    :class="{ 'news-category--active': activeCategory === category }"
                    @click="activeCategory = category">{{ category }}</button>
            </div>

            <main class="news-scroll">
                <div v-if="isLoading" class="news-loading">Actualisation des dernières nouvelles…</div>
                <template v-else>
                    <section v-if="featuredArticle && activeCategory === 'Pour toi' && !searchQuery.trim()"
                        class="news-featured-section">
                        <div class="news-section-heading"><span>À la une</span><small>{{
                            formatRelativeDate(featuredArticle.publishedAt) }}</small></div>
                        <button type="button" class="news-featured-card" @click="openArticle(featuredArticle)">
                            <span class="news-featured-image" :style="articleImageStyle(featuredArticle)"></span>
                            <span class="news-featured-overlay"></span>
                            <span class="news-featured-content">
                                <span class="news-pill">{{ featuredArticle.category }}</span>
                                <strong>{{ featuredArticle.title }}</strong>
                                <span>{{ featuredArticle.excerpt }}</span>
                                <small><span>{{ featuredArticle.author }}</span><span>·</span><span>{{
                                    featuredArticle.readTime }} min de lecture</span></small>
                            </span>
                        </button>
                    </section>

                    <section class="news-list-section">
                        <div class="news-section-heading">
                            <span>{{ activeCategory === 'Pour toi' ? 'Dernières nouvelles' : activeCategory }}</span>
                            <small>{{ visibleArticles.length }} article{{ visibleArticles.length > 1 ? 's' : ''
                            }}</small>
                        </div>
                        <button v-for="article in visibleArticles" :key="article.id" type="button"
                            class="news-article-row" @click="openArticle(article)">
                            <span class="news-article-image" :style="articleImageStyle(article)"></span>
                            <span class="news-article-info">
                                <span class="news-article-meta"><span>{{ article.category
                                }}</span><span>·</span><span>{{ formatRelativeDate(article.publishedAt)
                                        }}</span></span>
                                <strong>{{ article.title }}</strong>
                                <span class="news-article-excerpt">{{ article.excerpt }}</span>
                                <small>{{ article.author }} · {{ article.readTime }} min</small>
                            </span>
                            <ChevronRight class="news-article-chevron" :size="16" />
                        </button>
                        <div v-if="!visibleArticles.length && (!featuredArticle || activeCategory !== 'Pour toi' || searchQuery.trim())"
                            class="news-empty">
                            <Newspaper :size="28" />
                            <strong>Aucun article trouvé</strong>
                            <span>Essaie une autre recherche ou une autre catégorie.</span>
                        </div>
                    </section>
                </template>
            </main>

            <div v-if="isJournalist" class="news-journalist-bar">
                <span>
                    <Camera :size="16" /><span>Espace presse</span>
                </span>
                <button type="button" @click="openComposer">
                    <Plus :size="16" /> Nouvel article
                </button>
            </div>
        </template>

        <Transition name="news-page">
            <section v-if="selectedArticle" class="news-article-page">
                <header class="news-page-header">
                    <button type="button" aria-label="Retour" @click="closeArticle">
                        <ArrowLeft :size="19" />
                    </button>
                    <span>{{ selectedArticle.category }}</span>
                    <button type="button" aria-label="Enregistrer l’article" @click="toggleSaved(selectedArticle)">
                        <Bookmark :size="18"
                            :fill="savedArticles.includes(selectedArticle.id) ? 'currentColor' : 'none'" />
                    </button>
                </header>
                <div class="news-article-page-scroll">
                    <div class="news-detail-image" :style="articleImageStyle(selectedArticle)"></div>
                    <div class="news-detail-content">
                        <span class="news-pill">{{ selectedArticle.category }}</span>
                        <h2>{{ selectedArticle.title }}</h2>
                        <p class="news-detail-excerpt">{{ selectedArticle.excerpt }}</p>
                        <div class="news-detail-byline">
                            <span class="news-author-avatar">{{ selectedArticle.author.slice(0, 1) }}</span>
                            <span><strong>{{ selectedArticle.author }}</strong><small>{{
                                formatDate(selectedArticle.publishedAt)
                                    }} · {{ selectedArticle.readTime }} min de lecture</small></span>
                        </div>
                        <p class="news-detail-body">{{ selectedArticle.content }}</p>
                        <div class="news-detail-actions">
                            <button type="button" @click="toggleSaved(selectedArticle)">
                                <Bookmark :size="16" /> {{ savedArticles.includes(selectedArticle.id) ? 'Enregistré' :
                                    'Enregistrer' }}
                            </button>
                            <button type="button">
                                <Share2 :size="16" /> Partager
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </Transition>

        <Transition name="news-sheet">
            <div v-if="isComposerVisible" class="news-composer-backdrop" @click.self="closeComposer">
                <form class="news-composer" @submit.prevent="publish">
                    <div class="news-sheet-grabber"></div>
                    <header class="news-composer-header">
                        <button type="button" @click="closeComposer">Annuler</button>
                        <strong>Nouvel article</strong>
                        <button type="submit" :disabled="isPublishing">{{ isPublishing ? '…' : 'Publier' }}</button>
                    </header>
                    <div class="news-composer-scroll">
                        <button type="button" class="news-cover-picker"
                            :style="draft.image ? articleImageStyle({ image: draft.image }) : {}"
                            @click="imageInput?.click()">
                            <template v-if="!draft.image">
                                <ImagePlus :size="24" /><span>Ajouter une photo</span><small>JPG, PNG · depuis la
                                    galerie</small>
                            </template>
                            <span v-else class="news-cover-picker__change">
                                <Camera :size="16" /> Changer la photo
                            </span>
                        </button>
                        <input ref="imageInput" class="news-hidden-input" type="file" accept="image/*"
                            @change="readImage" />
                        <label class="news-field"><span>Titre</span><input v-model="draft.title" type="text"
                                maxlength="100" placeholder="Le titre de ton article" /></label>
                        <label class="news-field"><span>Catégorie</span><select v-model="draft.category">
                                <option v-for="category in draftCategories" :key="category" :value="category">{{
                                    category }}
                                </option>
                            </select></label>
                        <label class="news-field"><span>Résumé</span><textarea v-model="draft.excerpt" maxlength="180"
                                rows="2" placeholder="Une phrase pour donner envie de lire"></textarea></label>
                        <label class="news-field"><span>Article</span><textarea v-model="draft.content" rows="7"
                                placeholder="Raconte ce qui se passe à Los Santos…"></textarea></label>
                        <p v-if="publishNotice || lastError" class="news-form-notice">{{ publishNotice || lastError }}
                        </p>
                        <p class="news-form-footnote">
                            <Send :size="13" /> {{ isFiveM ? 'Publication sécurisée vers la rédaction' : 'Mode aperçu la publication est conservée dans l’app' }}
                        </p>
                    </div>
                </form>
            </div>
        </Transition>
    </div>
</template>

<style scoped lang="scss">
.news-app {
    --news-accent: #ff3b6b;
    --news-accent-soft: rgba(255, 59, 107, .15);
    --news-accent-surface: rgba(48, 27, 36, .94);
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
    padding: 9cqh 3cqh 4cqh;
    color: white;
    background: #0a0a0a;
}

.news-header,
.news-brand,
.news-header-actions,
.news-section-heading,
.news-article-meta,
.news-detail-byline,
.news-detail-actions,
.news-journalist-bar,
.news-composer-header,
.news-form-footnote {
    display: flex;
    align-items: center;
}

.news-header,
.news-section-heading,
.news-composer-header {
    justify-content: space-between;
}

.news-brand {
    gap: 1.8cqw;
}

.news-brand__mark {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 5cqh;
    height: 5cqh;
    border-radius: 1.5cqh;
    color: var(--news-accent);
    background: var(--news-accent-soft);
}

.news-eyebrow {
    display: block;
    margin-bottom: .1cqh;
    color: rgba(255, 255, 255, .42);
    font-size: 1.4cqh;
}

.news-header h1 {
    margin: 0;
    font-size: 5.4cqh;
    font-weight: 700;
    letter-spacing: -.08cqw;
}

.news-header-actions {
    gap: 1cqw;
}

.news-header-actions button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 4.8cqh;
    height: 4.8cqh;
    border: 0;
    border-radius: 50%;
    color: rgba(255, 255, 255, .76);
    background: rgba(118, 118, 128, .17);
    cursor: pointer;
}

.news-search {
    display: flex;
    align-items: center;
    gap: 1.2cqw;
    height: 4.8cqh;
    margin-top: 1.5cqh;
    padding: 0 1.8cqw;
    border-radius: 1.4cqh;
    color: rgba(255, 255, 255, .52);
    background: rgba(118, 118, 128, .2);
}

.news-search input {
    min-width: 0;
    flex: 1;
    border: 0;
    outline: 0;
    color: white;
    background: transparent;
    font: inherit;
    font-size: 1.75cqh;
}

.news-search button {
    display: flex;
    border: 0;
    padding: 0;
    color: rgba(255, 255, 255, .55);
    background: transparent;
}

.news-categories {
    display: flex;
    gap: 2.8cqw;
    flex-shrink: 0;
    margin: 2.5cqh 0 1.5cqh;
    overflow-x: auto;
    scrollbar-width: none;
}

.news-categories::-webkit-scrollbar {
    display: none;
}

.news-categories button {
    flex-shrink: 0;
    border: 0;
    padding: 0 0 .9cqh;
    color: rgba(255, 255, 255, .45);
    background: transparent;
    font: inherit;
    font-size: 1.65cqh;
    cursor: pointer;
}

.news-categories button.news-category--active {
    color: var(--news-accent);
    font-weight: 600;
    border-bottom: .25cqh solid var(--news-accent);
}

.news-scroll {
    min-height: 0;
    flex: 1;
    overflow-y: auto;
    padding-bottom: 16cqh;
    scrollbar-width: none;
}

.news-scroll::-webkit-scrollbar,
.news-article-page-scroll::-webkit-scrollbar,
.news-composer-scroll::-webkit-scrollbar {
    display: none;
}

.news-section-heading {
    margin: 1.2cqh .5cqw 1cqh;
    color: rgba(255, 255, 255, .9);
    font-size: 2.05cqh;
    font-weight: 600;
}

.news-section-heading small {
    color: rgba(255, 255, 255, .38);
    font-size: 1.4cqh;
    font-weight: 400;
}

.news-featured-card {
    position: relative;
    display: block;
    width: 100%;
    height: 31cqh;
    overflow: hidden;
    border: 0;
    border-radius: 2.4cqh;
    padding: 0;
    color: white;
    text-align: left;
    background: #263d48;
    box-shadow: 0 1cqh 2.5cqh rgba(0, 0, 0, .25);
    cursor: pointer;
}

.news-featured-image,
.news-featured-overlay,
.news-detail-image {
    position: absolute;
    inset: 0;
    background-position: center;
    background-size: cover;
}

.news-featured-overlay {
    background: linear-gradient(180deg, rgba(0, 0, 0, .02) 20%, rgba(0, 0, 0, .82) 100%);
}

.news-featured-content {
    position: absolute;
    right: 3cqw;
    bottom: 2.2cqh;
    left: 3cqw;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: .8cqh;
}

.news-pill {
    display: inline-flex;
    width: fit-content;
    border-radius: 999px;
    padding: .55cqh 1.5cqw;
    color: #ff9bb3;
    background: var(--news-accent-soft);
    font-size: 1.35cqh;
    font-weight: 600;
}

.news-featured-content strong {
    max-width: 95%;
    font-size: 3cqh;
    line-height: 1.05;
}

.news-featured-content>span:not(.news-pill) {
    max-width: 92%;
    overflow: hidden;
    color: rgba(255, 255, 255, .72);
    font-size: 1.55cqh;
    line-height: 1.25;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.news-featured-content small {
    display: flex;
    gap: 1cqw;
    color: rgba(255, 255, 255, .58);
    font-size: 1.3cqh;
}

.news-list-section {
    margin-top: 2.5cqh;
}

.news-article-row {
    display: flex;
    align-items: center;
    gap: 2cqw;
    width: 100%;
    min-height: 14cqh;
    box-sizing: border-box;
    border: 0;
    border-bottom: 1px solid rgba(255, 255, 255, .08);
    padding: 1.1cqh 0;
    color: white;
    text-align: left;
    background: transparent;
    font: inherit;
    cursor: pointer;
}

.news-article-image {
    flex-shrink: 0;
    width: 20cqw;
    height: 12.5cqh;
    border-radius: 1.5cqh;
    background-position: center;
    background-size: cover;
}

.news-article-info {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
    gap: .6cqh;
}

.news-article-meta {
    gap: .8cqw;
    color: var(--news-accent);
    font-size: 1.3cqh;
}

.news-article-info strong {
    overflow: hidden;
    font-size: 1.9cqh;
    font-weight: 600;
    line-height: 1.13;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.news-article-excerpt {
    overflow: hidden;
    color: rgba(255, 255, 255, .48);
    font-size: 1.48cqh;
    line-height: 1.25;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.news-article-info small {
    color: rgba(255, 255, 255, .35);
    font-size: 1.25cqh;
}

.news-article-chevron {
    flex-shrink: 0;
    color: rgba(255, 255, 255, .28);
}

.news-empty,
.news-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 1cqh;
    min-height: 22cqh;
    color: rgba(255, 255, 255, .38);
    text-align: center;
}

.news-empty strong {
    color: rgba(255, 255, 255, .82);
    font-size: 2.1cqh;
}

.news-empty span,
.news-loading {
    font-size: 1.5cqh;
}

.news-journalist-bar {
    position: absolute;
    right: 3cqh;
    bottom: 8cqh;
    left: 3cqh;
    justify-content: space-between;
    min-height: 5.5cqh;
    box-sizing: border-box;
    border: 1px solid rgba(255, 59, 107, .28);
    border-radius: 1.8cqh;
    padding: 0 1.5cqw;
    color: rgba(255, 255, 255, .64);
    background: var(--news-accent-surface);
    backdrop-filter: blur(1cqh);
    font-size: 1.4cqh;
}

.news-journalist-bar>span,
.news-journalist-bar button {
    display: flex;
    align-items: center;
    gap: .8cqw;
}

.news-journalist-bar button {
    border: 0;
    color: #ff9bb3;
    background: transparent;
    font: inherit;
    font-weight: 600;
    cursor: pointer;
}

.news-article-page {
    position: absolute;
    z-index: 4;
    inset: 0;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding-top: 8cqh;
    background: #0a0a0a;
}

.news-page-header {
    position: absolute;
    z-index: 2;
    top: 8cqh;
    right: 3cqh;
    left: 3cqh;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 5cqh;
}

.news-page-header span {
    color: rgba(255, 255, 255, .72);
    font-size: 1.65cqh;
    font-weight: 600;
}

.news-page-header button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 4.8cqh;
    height: 4.8cqh;
    border: 0;
    border-radius: 50%;
    color: white;
    background: rgba(20, 20, 20, .58);
    cursor: pointer;
}

.news-article-page-scroll {
    min-height: 0;
    overflow-y: auto;
    scrollbar-width: none;
}

.news-detail-image {
    position: relative;
    height: 32cqh;
    background-position: center;
    background-size: cover;
}

.news-detail-content {
    padding: 3cqh 3cqh 6cqh;
}

.news-detail-content h2 {
    margin: 1.6cqh 0;
    font-size: 4.1cqh;
    line-height: 1.1;
}

.news-detail-excerpt {
    margin: 0 0 2.5cqh;
    color: rgba(255, 255, 255, .62);
    font-size: 1.9cqh;
    line-height: 1.4;
}

.news-detail-byline {
    gap: 1.5cqw;
    padding: 1.5cqh 0;
    border-top: 1px solid rgba(255, 255, 255, .09);
    border-bottom: 1px solid rgba(255, 255, 255, .09);
}

.news-author-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 4.5cqh;
    height: 4.5cqh;
    border-radius: 50%;
    color: #141414;
    background: var(--news-accent);
    font-size: 1.8cqh;
    font-weight: 700;
}

.news-detail-byline>span:last-child {
    display: flex;
    flex-direction: column;
    gap: .35cqh;
}

.news-detail-byline strong {
    font-size: 1.7cqh;
}

.news-detail-byline small {
    color: rgba(255, 255, 255, .42);
    font-size: 1.35cqh;
}

.news-detail-body {
    margin: 2.5cqh 0;
    color: rgba(255, 255, 255, .84);
    font-size: 2cqh;
    line-height: 1.55;
    white-space: pre-line;
}

.news-detail-actions {
    gap: 1.2cqw;
}

.news-detail-actions button {
    display: flex;
    align-items: center;
    gap: .8cqw;
    flex: 1;
    justify-content: center;
    height: 4.8cqh;
    border: 1px solid rgba(255, 255, 255, .12);
    border-radius: 1.4cqh;
    color: rgba(255, 255, 255, .78);
    background: rgba(255, 255, 255, .06);
    font: inherit;
    font-size: 1.45cqh;
    cursor: pointer;
}

.news-composer-backdrop {
    position: absolute;
    z-index: 6;
    inset: 0;
    display: flex;
    align-items: flex-end;
    background: rgba(0, 0, 0, .5);
}

.news-composer {
    width: 100%;
    max-height: 90%;
    box-sizing: border-box;
    border-radius: 3cqh 3cqh 0 0;
    padding-bottom: 3cqh;
    color: white;
    background: #242426;
    box-shadow: 0 -1cqh 4cqh rgba(0, 0, 0, .35);
}

.news-sheet-grabber {
    width: 9cqw;
    height: .55cqh;
    margin: 1cqh auto;
    border-radius: 999px;
    background: rgba(255, 255, 255, .24);
}

.news-composer-header {
    min-height: 6cqh;
    padding: 0 3cqw;
    border-bottom: 1px solid rgba(255, 255, 255, .09);
}

.news-composer-header button {
    width: 14cqw;
    border: 0;
    padding: 0;
    color: var(--news-accent);
    background: transparent;
    font: inherit;
    font-size: 1.55cqh;
    cursor: pointer;
}

.news-composer-header button:last-child {
    text-align: right;
    font-weight: 600;
}

.news-composer-header strong {
    font-size: 2cqh;
}

.news-composer-scroll {
    max-height: 73cqh;
    overflow-y: auto;
    padding: 2cqh 3cqh 0;
    scrollbar-width: none;
}

.news-cover-picker {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: .7cqh;
    width: 100%;
    height: 16cqh;
    overflow: hidden;
    border: 1px dashed rgba(255, 59, 107, .58);
    border-radius: 1.8cqh;
    color: #ff9bb3;
    background: var(--news-accent-soft);
    background-position: center;
    background-size: cover;
    cursor: pointer;
}

.news-cover-picker::after {
    position: absolute;
    inset: 0;
    content: '';
    background: rgba(0, 0, 0, .15);
}

.news-cover-picker>* {
    position: relative;
    z-index: 1;
}

.news-cover-picker span {
    font-size: 1.7cqh;
    font-weight: 600;
}

.news-cover-picker small {
    color: rgba(255, 255, 255, .48);
    font-size: 1.3cqh;
}

.news-cover-picker__change {
    display: flex;
    align-items: center;
    gap: .8cqw;
    padding: .8cqh 1.5cqw;
    border-radius: 999px;
    background: rgba(0, 0, 0, .5);
}

.news-hidden-input {
    display: none;
}

.news-field {
    display: flex;
    flex-direction: column;
    gap: .8cqh;
    margin-top: 2cqh;
    color: rgba(255, 255, 255, .52);
    font-size: 1.4cqh;
}

.news-field input,
.news-field textarea,
.news-field select {
    box-sizing: border-box;
    width: 100%;
    border: 0;
    border-radius: 1.2cqh;
    outline: 0;
    padding: 1.3cqh 1.5cqw;
    color: white;
    background: rgba(118, 118, 128, .18);
    font: inherit;
    font-size: 1.75cqh;
    resize: vertical;
}

.news-field select {
    appearance: none;
}

.news-field textarea {
    line-height: 1.35;
}

.news-field input:focus,
.news-field textarea:focus,
.news-field select:focus {
    box-shadow: 0 0 0 .2cqh rgba(255, 59, 107, .3);
}

.news-form-notice {
    margin: 1.5cqh 0 0;
    color: #ff8b83;
    font-size: 1.45cqh;
}

.news-form-footnote {
    gap: .8cqw;
    margin: 2cqh 0 0;
    color: rgba(255, 255, 255, .38);
    font-size: 1.3cqh;
}

.news-page-enter-active,
.news-page-leave-active,
.news-sheet-enter-active,
.news-sheet-leave-active {
    transition: opacity .25s ease, transform .28s cubic-bezier(.22, 1, .36, 1);
}

.news-page-enter-from,
.news-page-leave-to {
    opacity: 0;
    transform: translateX(100%);
}

.news-sheet-enter-from,
.news-sheet-leave-to {
    opacity: 0;
    transform: translateY(100%);
}
</style>
