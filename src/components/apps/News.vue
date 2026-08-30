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

const { articles, isLoading, lastError, isFiveM, publishArticle } = useNewsFeed(props.initialNews);
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
const draftCategories = categories.slice(1);

const currentPlayer = computed(() => props.playerContext || (isFiveM.value ? {} : {
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
    return articles.value.filter((article) => {
        const categoryMatches = activeCategory.value === 'Pour toi' || article.category === activeCategory.value;
        const searchMatches = !query || (article.title + ' ' + article.excerpt + ' ' + article.author).toLowerCase().includes(query);
        return categoryMatches && searchMatches && article.id !== featuredArticle.value?.id;
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
                    <span class="news-brand__mark"><Newspaper :size="16" /></span>
                    <div>
                        <span class="news-eyebrow">Los Santos</span>
                        <h1>News</h1>
                    </div>
                </div>
                <div class="news-header-actions">
                    <button type="button" aria-label="Rechercher" @click="searchQuery = searchQuery ? '' : ' '"><Search :size="19" /></button>
                    <button type="button" aria-label="Notifications"><Bell :size="19" /></button>
                </div>
            </header>

            <div v-if="searchQuery" class="news-search">
                <Search :size="16" />
                <input v-model="searchQuery" type="search" placeholder="Rechercher un article" autofocus />
                <button type="button" aria-label="Effacer la recherche" @click="searchQuery = ''"><X :size="15" /></button>
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
                    <section v-if="featuredArticle && activeCategory === 'Pour toi' && !searchQuery.trim()" class="news-featured-section">
                        <div class="news-section-heading"><span>À la une</span><small>{{ formatRelativeDate(featuredArticle.publishedAt) }}</small></div>
                        <button type="button" class="news-featured-card" @click="openArticle(featuredArticle)">
                            <span class="news-featured-image" :style="articleImageStyle(featuredArticle)"></span>
                            <span class="news-featured-overlay"></span>
                            <span class="news-featured-content">
                                <span class="news-pill">{{ featuredArticle.category }}</span>
                                <strong>{{ featuredArticle.title }}</strong>
                                <span>{{ featuredArticle.excerpt }}</span>
                                <small><span>{{ featuredArticle.author }}</span><span>·</span><span>{{ featuredArticle.readTime }} min de lecture</span></small>
                            </span>
                        </button>
                    </section>

                    <section class="news-list-section">
                        <div class="news-section-heading">
                            <span>{{ activeCategory === 'Pour toi' ? 'Dernières nouvelles' : activeCategory }}</span>
                            <small>{{ visibleArticles.length }} article{{ visibleArticles.length > 1 ? 's' : '' }}</small>
                        </div>
                        <button v-for="article in visibleArticles" :key="article.id" type="button" class="news-article-row" @click="openArticle(article)">
                            <span class="news-article-image" :style="articleImageStyle(article)"></span>
                            <span class="news-article-info">
                                <span class="news-article-meta"><span>{{ article.category }}</span><span>·</span><span>{{ formatRelativeDate(article.publishedAt) }}</span></span>
                                <strong>{{ article.title }}</strong>
                                <span class="news-article-excerpt">{{ article.excerpt }}</span>
                                <small>{{ article.author }} · {{ article.readTime }} min</small>
                            </span>
                            <ChevronRight class="news-article-chevron" :size="16" />
                        </button>
                        <div v-if="!visibleArticles.length && (!featuredArticle || activeCategory !== 'Pour toi' || searchQuery.trim())" class="news-empty">
                            <Newspaper :size="28" />
                            <strong>Aucun article trouvé</strong>
                            <span>Essaie une autre recherche ou une autre catégorie.</span>
                        </div>
                    </section>
                </template>
            </main>

            <div v-if="isJournalist" class="news-journalist-bar">
                <span><Camera :size="16" /><span>Espace presse</span></span>
                <button type="button" @click="openComposer"><Plus :size="16" /> Nouvel article</button>
            </div>
        </template>

        <Transition name="news-page">
            <section v-if="selectedArticle" class="news-article-page">
                <header class="news-page-header">
                    <button type="button" aria-label="Retour" @click="closeArticle"><ArrowLeft :size="19" /></button>
                    <span>{{ selectedArticle.category }}</span>
                    <button type="button" aria-label="Enregistrer l’article" @click="toggleSaved(selectedArticle)">
                        <Bookmark :size="18" :fill="savedArticles.includes(selectedArticle.id) ? 'currentColor' : 'none'" />
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
                            <span><strong>{{ selectedArticle.author }}</strong><small>{{ formatDate(selectedArticle.publishedAt) }} · {{ selectedArticle.readTime }} min de lecture</small></span>
                        </div>
                        <p class="news-detail-body">{{ selectedArticle.content }}</p>
                        <div class="news-detail-actions">
                            <button type="button" @click="toggleSaved(selectedArticle)"><Bookmark :size="16" /> {{ savedArticles.includes(selectedArticle.id) ? 'Enregistré' : 'Enregistrer' }}</button>
                            <button type="button"><Share2 :size="16" /> Partager</button>
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
                        <button type="button" class="news-cover-picker" :style="draft.image ? articleImageStyle({ image: draft.image }) : {}" @click="imageInput?.click()">
                            <template v-if="!draft.image"><ImagePlus :size="24" /><span>Ajouter une photo</span><small>JPG, PNG · depuis la galerie</small></template>
                            <span v-else class="news-cover-picker__change"><Camera :size="16" /> Changer la photo</span>
                        </button>
                        <input ref="imageInput" class="news-hidden-input" type="file" accept="image/*" @change="readImage" />
                        <label class="news-field"><span>Titre</span><input v-model="draft.title" type="text" maxlength="100" placeholder="Le titre de ton article" /></label>
                        <label class="news-field"><span>Catégorie</span><select v-model="draft.category"><option v-for="category in draftCategories" :key="category" :value="category">{{ category }}</option></select></label>
                        <label class="news-field"><span>Résumé</span><textarea v-model="draft.excerpt" maxlength="180" rows="2" placeholder="Une phrase pour donner envie de lire"></textarea></label>
                        <label class="news-field"><span>Article</span><textarea v-model="draft.content" rows="7" placeholder="Raconte ce qui se passe à Los Santos…"></textarea></label>
                        <p v-if="publishNotice || lastError" class="news-form-notice">{{ publishNotice || lastError }}</p>
                        <p class="news-form-footnote"><Send :size="13" /> {{ isFiveM ? 'Publication sécurisée vers la rédaction' : 'Mode aperçu · la publication est conservée dans l’app' }}</p>
                    </div>
                </form>
            </div>
        </Transition>
    </div>
</template>
