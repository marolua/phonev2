import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useFiveMBridge } from './useFiveMBridge';

const demoImages = [
    'linear-gradient(145deg, #172f46 0%, #326c78 48%, #d49a68 100%)',
    'linear-gradient(135deg, #432a3c 0%, #a85d62 50%, #e4b47c 100%)',
    'linear-gradient(150deg, #1b2735 0%, #47736c 55%, #c5a76e 100%)',
    'linear-gradient(145deg, #66503f 0%, #bc8261 45%, #243d53 100%)',
];

const demoArticles = [
    {
        id: 'demo-1',
        title: 'Los Santos se réveille sous un ciel électrique',
        excerpt: 'Les équipes météo annoncent un changement de temps spectaculaire sur toute la ville.',
        content: 'Les premières lueurs du jour ont laissé place à un ciel chargé au-dessus de Los Santos. Les services de la ville invitent les habitants à rester attentifs aux prochaines alertes et à adapter leurs déplacements.',
        category: 'Actualités',
        author: 'Maya Brooks',
        publishedAt: Date.now() - 1000 * 60 * 26,
        readTime: 3,
        image: demoImages[0],
        featured: true,
    },
    {
        id: 'demo-2',
        title: 'Un nouveau marché ouvre ses portes à Vespucci',
        excerpt: 'Créateurs locaux, produits frais et musique live seront au rendez-vous ce week-end.',
        content: 'Le front de mer accueillera dès samedi un marché réunissant artisans, restaurateurs et producteurs de la région.',
        category: 'Vie locale',
        author: 'Noah Carter',
        publishedAt: Date.now() - 1000 * 60 * 80,
        readTime: 2,
        image: demoImages[1],
    },
    {
        id: 'demo-3',
        title: 'Les services d’urgence renforcent leur présence',
        excerpt: 'Un dispositif spécial est déployé dans les quartiers les plus fréquentés.',
        content: 'La mairie et les services d’urgence coordonnent leurs équipes pour accompagner les rassemblements prévus cette semaine.',
        category: 'Sécurité',
        author: 'Maya Brooks',
        publishedAt: Date.now() - 1000 * 60 * 145,
        readTime: 4,
        image: demoImages[2],
    },
    {
        id: 'demo-4',
        title: 'Le sport local prépare une grande soirée',
        excerpt: 'Les clubs de la ville se retrouvent pour une rencontre placée sous le signe du fair-play.',
        content: 'Les associations sportives de Los Santos préparent une soirée ouverte à tous les habitants.',
        category: 'Sport',
        author: 'Alex Reed',
        publishedAt: Date.now() - 1000 * 60 * 230,
        readTime: 2,
        image: demoImages[3],
    },
];

const normalizeArticle = (article, index = 0) => ({
    id: article?.id ?? `article-${Date.now()}-${index}`,
    title: article?.title?.trim() || 'Article sans titre',
    excerpt: article?.excerpt?.trim() || article?.content?.trim()?.slice(0, 120) || '',
    content: article?.content?.trim() || article?.excerpt?.trim() || '',
    category: article?.category || 'Actualités',
    author: article?.author || article?.authorName || 'Rédaction News',
    publishedAt: Number(article?.publishedAt ?? article?.createdAt ?? Date.now()),
    readTime: Number(article?.readTime) || 3,
    image: article?.image || article?.imageUrl || demoImages[index % demoImages.length],
    featured: Boolean(article?.featured),
});

export const useNewsFeed = (initialArticles = []) => {
    const { invoke, isFiveM } = useFiveMBridge();
    const articles = ref((initialArticles.length ? initialArticles : demoArticles).map(normalizeArticle));
    const isLoading = ref(false);
    const lastError = ref('');

    const loadArticles = async () => {
        if (!isFiveM.value) return articles.value;

        isLoading.value = true;
        lastError.value = '';
        const response = await invoke('getNewsArticles');
        const remoteArticles = Array.isArray(response) ? response : response?.articles;

        if (Array.isArray(remoteArticles)) {
            articles.value = remoteArticles.map(normalizeArticle);
        } else if (response !== null) {
            lastError.value = 'Les articles n’ont pas pu être chargés.';
        }

        isLoading.value = false;
        return articles.value;
    };

    const publishArticle = async (article) => {
        lastError.value = '';
        const normalized = normalizeArticle({ ...article, id: `local-${Date.now()}` });

        if (isFiveM.value) {
            const response = await invoke('publishNewsArticle', normalized);
            if (!response || response.success === false) {
                lastError.value = response?.message || 'La publication a échoué.';
                return null;
            }

            const published = normalizeArticle(response.article || response, 0);
            articles.value.unshift(published);
            return published;
        }

        articles.value.unshift(normalized);
        return normalized;
    };

    const onNewsUpdate = (event) => {
        const payload = event.detail || event.data;
        const remoteArticles = Array.isArray(payload) ? payload : payload?.articles;
        if (Array.isArray(remoteArticles)) articles.value = remoteArticles.map(normalizeArticle);
    };

    onMounted(() => {
        loadArticles();
        window.addEventListener('news:articles-updated', onNewsUpdate);
        window.addEventListener('message', onNewsUpdate);
    });

    onBeforeUnmount(() => {
        window.removeEventListener('news:articles-updated', onNewsUpdate);
        window.removeEventListener('message', onNewsUpdate);
    });

    return { articles, isLoading, lastError, isFiveM, loadArticles, publishArticle };
};
