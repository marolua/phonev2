<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import {
    ArrowLeft,
    Bell,
    Bookmark,
    Check,
    CheckCircle2,
    Copy,
    Globe2,
    Heart,
    Home,
    ImagePlus,
    ListFilter,
    MessageCircle,
    MoreHorizontal,
    PenLine,
    Repeat2,
    Search,
    Send,
    Settings,
    Share2,
    Trash2,
    UserRound,
    Users,
    X,
} from '@lucide/vue';

const storageKey = 'kwiker-posts';
const profileStorageKey = 'kwiker-profile';
const settingsStorageKey = 'kwiker-settings';
const defaultProfile = {
    name: 'Maya Brooks', handle: '@mayabrooks', initials: 'MB',
    color: 'linear-gradient(145deg, #7c5cff, #c149ff)',
    bio: 'Toujours quelque part entre Los Santos et un bon café ☕', following: 184, followers: 1240,
};

const starterPosts = [
    { id: 1, author: 'LSPD Los Santos', handle: '@LSPD_LS', initials: 'LP', color: 'linear-gradient(145deg, #2c6bed, #17336e)', text: 'Les rues sont calmes ce soir. Merci à tous les habitants qui nous aident à garder Los Santos sûre. 💙', time: Date.now() - 1000 * 60 * 18, likes: 42, comments: 8, reposts: 12, liked: false, reposted: false, bookmarked: false, commentsList: [] },
    { id: 2, author: 'Weazel News', handle: '@weazelnews', initials: 'WN', color: 'linear-gradient(145deg, #ff3b6b, #7f2046)', text: 'FLASH INFO — La circulation est perturbée sur Vespucci Boulevard. Évitez le secteur jusqu’à nouvel ordre. 📰', time: Date.now() - 1000 * 60 * 53, likes: 76, comments: 14, reposts: 31, liked: true, reposted: false, bookmarked: false, commentsList: [] },
    { id: 3, author: 'Benny’s Original Motor Works', handle: '@bennys', initials: 'BO', color: 'linear-gradient(145deg, #ff9d3d, #8d3c1e)', text: 'Nouvelle semaine, nouveau projet. Passez à l’atelier si vous voulez donner un peu de caractère à votre caisse. 🔧', time: Date.now() - 1000 * 60 * 60 * 3, likes: 128, comments: 22, reposts: 18, liked: false, reposted: true, bookmarked: true, commentsList: [] },
];

const posts = ref([]);
const currentUser = ref({ ...defaultProfile });
const activeTab = ref('Pour toi');
const searchQuery = ref('');
const isComposerVisible = ref(false);
const isSearchVisible = ref(false);
const isProfileVisible = ref(false);
const isSettingsVisible = ref(false);
const isNotificationsVisible = ref(false);
const isCommunitiesVisible = ref(false);
const activeSection = ref('home');
const profileTab = ref('Kwiks');
const isAccountEditorVisible = ref(false);
const selectedPost = ref(null);
const selectedPostMenu = ref(null);
const isCommentSheetVisible = ref(false);
const commentDraft = ref('');
const draft = ref({ text: '', image: '', pollEnabled: false, pollOptions: ['', ''] });
const publishNotice = ref('');
const actionNotice = ref('');
const imageInput = ref(null);
const accountDraft = ref({ name: '', handle: '', bio: '' });
const accountNotice = ref('');
const accountSettings = ref({ notifications: true, privateAccount: false });
const joinedCommunities = ref(['los-santos', 'car-meets']);

const communities = [
    { id: 'los-santos', name: 'Los Santos', description: 'Les infos et discussions de la ville.', members: '12,4k', color: 'linear-gradient(145deg, #1d9bf0, #17336e)' },
    { id: 'car-meets', name: 'Car Meets', description: 'Passionnés de belles mécaniques.', members: '3,8k', color: 'linear-gradient(145deg, #ff9d3d, #8d3c1e)' },
    { id: 'vespucci', name: 'Vespucci Beach', description: 'Le meilleur de la côte ouest.', members: '8,1k', color: 'linear-gradient(145deg, #00ba7c, #075e54)' },
];

onMounted(() => {
    try {
        const savedPosts = JSON.parse(localStorage.getItem(storageKey) || 'null');
        posts.value = Array.isArray(savedPosts) && savedPosts.length ? savedPosts : starterPosts;
        const savedProfile = JSON.parse(localStorage.getItem(profileStorageKey) || 'null');
        if (savedProfile && typeof savedProfile === 'object') currentUser.value = { ...defaultProfile, ...savedProfile };
        const savedSettings = JSON.parse(localStorage.getItem(settingsStorageKey) || 'null');
        if (savedSettings && typeof savedSettings === 'object') accountSettings.value = { ...accountSettings.value, ...savedSettings };
    } catch { posts.value = starterPosts; }
});

watch(posts, (value) => {
    try { localStorage.setItem(storageKey, JSON.stringify(value)); } catch { /* Session only. */ }
}, { deep: true });

watch(currentUser, (value) => {
    try { localStorage.setItem(profileStorageKey, JSON.stringify(value)); } catch { /* Session only. */ }
}, { deep: true });

watch(accountSettings, (value) => {
    try { localStorage.setItem(settingsStorageKey, JSON.stringify(value)); } catch { /* Session only. */ }
}, { deep: true });

const visiblePosts = computed(() => {
    const query = searchQuery.value.trim().toLowerCase();
    return posts.value.filter((post) => {
        const matchesSearch = !query || `${post.author} ${post.handle} ${post.text}`.toLowerCase().includes(query);
        const matchesTab = activeTab.value === 'Pour toi' || post.author === currentUser.value.name || post.reposted;
        const matchesSection = activeSection.value !== 'bookmarks' || post.bookmarked;
        return matchesSearch && matchesTab && matchesSection;
    });
});

const ownPosts = computed(() => posts.value.filter((post) => post.author === currentUser.value.name));
const profileReplies = computed(() => posts.value.filter((post) => (post.commentsList || []).some((comment) => comment.author === currentUser.value.name)));
const profileMedia = computed(() => ownPosts.value.filter((post) => post.image));
const notificationItems = computed(() => posts.value.slice(0, 3).map((post, index) => ({
    id: `${post.id}-${index}`,
    initials: post.initials,
    color: post.color,
    title: index === 0 ? `${post.author} a publié un nouveau Kwik` : `${post.author} fait parler de lui sur Kwiker`,
    time: relativeTime(post.time),
})));

const formatCount = (count) => count > 999 ? `${(count / 1000).toFixed(1).replace('.0', '')}k` : count;
const relativeTime = (timestamp) => {
    const minutes = Math.max(0, Math.round((Date.now() - timestamp) / 60000));
    if (minutes < 1) return 'maintenant';
    if (minutes < 60) return `${minutes} min`;
    if (minutes < 1440) return `${Math.round(minutes / 60)} h`;
    return `${Math.round(minutes / 1440)} j`;
};

const openComposer = () => { draft.value = { text: '', image: '', pollEnabled: false, pollOptions: ['', ''] }; publishNotice.value = ''; isComposerVisible.value = true; };
const closeComposer = () => { isComposerVisible.value = false; };
const readImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { draft.value.image = String(reader.result || ''); };
    reader.readAsDataURL(file);
};
const publishPost = () => {
    const text = draft.value.text.trim();
    const pollOptions = draft.value.pollOptions.map((option) => option.trim()).filter(Boolean);
    if (!text && !draft.value.image && !draft.value.pollEnabled) { publishNotice.value = 'Écris quelque chose ou ajoute une image.'; return; }
    if (draft.value.pollEnabled && pollOptions.length < 2) { publishNotice.value = 'Ajoute au moins deux choix à ton sondage.'; return; }
    posts.value.unshift({ id: Date.now(), author: currentUser.value.name, handle: currentUser.value.handle, initials: currentUser.value.initials, color: currentUser.value.color, text, image: draft.value.image, poll: draft.value.pollEnabled ? { options: pollOptions, votes: [] } : null, time: Date.now(), likes: 0, comments: 0, reposts: 0, liked: false, reposted: false, bookmarked: false, commentsList: [] });
    closeComposer();
};
const toggleLike = (post) => { post.liked = !post.liked; post.likes += post.liked ? 1 : -1; };
const toggleRepost = (post) => { post.reposted = !post.reposted; post.reposts += post.reposted ? 1 : -1; };
const toggleBookmark = (post) => { post.bookmarked = !post.bookmarked; };
const votePoll = (post, optionIndex) => {
    if (!post.poll || post.poll.votes.includes(currentUser.value.handle)) return;
    post.poll.votes.push(currentUser.value.handle);
    post.poll.selected = optionIndex;
};
const openComments = (post) => { selectedPost.value = post; commentDraft.value = ''; isCommentSheetVisible.value = true; };
const closeComments = () => { isCommentSheetVisible.value = false; selectedPost.value = null; };
const addComment = () => {
    const text = commentDraft.value.trim();
    if (!text || !selectedPost.value) return;
    selectedPost.value.commentsList = selectedPost.value.commentsList || [];
    selectedPost.value.commentsList.push({ id: Date.now(), author: currentUser.value.name, handle: currentUser.value.handle, initials: currentUser.value.initials, color: currentUser.value.color, text });
    selectedPost.value.comments += 1;
    commentDraft.value = '';
};
const openSearch = () => { isSearchVisible.value = !isSearchVisible.value; if (!isSearchVisible.value) searchQuery.value = ''; };
const openSettings = () => { isSettingsVisible.value = true; };
const closeSettings = () => { isSettingsVisible.value = false; isAccountEditorVisible.value = false; };
const openNotifications = () => { isNotificationsVisible.value = true; };
const closeNotifications = () => { isNotificationsVisible.value = false; };
const openCommunities = () => { isCommunitiesVisible.value = true; };
const closeCommunities = () => { isCommunitiesVisible.value = false; };
const setHome = () => { activeSection.value = 'home'; isCommunitiesVisible.value = false; isProfileVisible.value = false; };
const setBookmarks = () => { activeSection.value = 'bookmarks'; isCommunitiesVisible.value = false; isProfileVisible.value = false; };
const toggleCommunity = (community) => {
    joinedCommunities.value = joinedCommunities.value.includes(community.id)
        ? joinedCommunities.value.filter((id) => id !== community.id)
        : [...joinedCommunities.value, community.id];
};
const openPostMenu = (post) => { selectedPostMenu.value = post; };
const closePostMenu = () => { selectedPostMenu.value = null; };
const deletePost = () => {
    if (!selectedPostMenu.value || selectedPostMenu.value.author !== currentUser.value.name) return;
    posts.value = posts.value.filter((post) => post.id !== selectedPostMenu.value.id);
    closePostMenu();
    actionNotice.value = 'Kwik supprimé';
    window.setTimeout(() => { actionNotice.value = ''; }, 2200);
};
const sharePost = async (post) => {
    const shareText = `${post.author} ${post.handle}\n${post.text}`.trim();
    try {
        if (navigator.share) await navigator.share({ title: 'Kwiker', text: shareText });
        else if (navigator.clipboard) await navigator.clipboard.writeText(shareText);
        actionNotice.value = navigator.share ? 'Kwik partagé' : 'Texte copié dans le presse-papiers';
    } catch { actionNotice.value = 'Partage annulé'; }
    window.setTimeout(() => { actionNotice.value = ''; }, 2200);
};
const copyPostLink = async () => {
    if (!selectedPostMenu.value) return;
    try { await navigator.clipboard?.writeText(`kwiker://post/${selectedPostMenu.value.id}`); } catch { /* Clipboard unavailable in preview. */ }
    closePostMenu();
    actionNotice.value = 'Lien du Kwik copié';
    window.setTimeout(() => { actionNotice.value = ''; }, 2200);
};
const openAccountEditor = () => {
    accountDraft.value = { name: currentUser.value.name, handle: currentUser.value.handle, bio: currentUser.value.bio };
    accountNotice.value = '';
    isAccountEditorVisible.value = true;
};
const closeAccountEditor = () => { isAccountEditorVisible.value = false; accountNotice.value = ''; };
const saveAccount = () => {
    const name = accountDraft.value.name.trim();
    const handle = accountDraft.value.handle.trim().replace(/\s+/g, '').replace(/^@*/, '@');
    const bio = accountDraft.value.bio.trim();
    if (name.length < 2 || handle.length < 2) { accountNotice.value = 'Ajoute un nom et un pseudo valides.'; return; }

    const previousName = currentUser.value.name;
    const nextProfile = { ...currentUser.value, name, handle, bio, initials: name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase() };
    currentUser.value = nextProfile;
    posts.value.forEach((post) => {
        if (post.author === previousName) Object.assign(post, { author: name, handle, initials: nextProfile.initials, color: nextProfile.color });
        (post.commentsList || []).forEach((comment) => {
            if (comment.author === previousName) Object.assign(comment, { author: name, handle, initials: nextProfile.initials, color: nextProfile.color });
        });
    });
    closeAccountEditor();
};
</script>

<template>
    <div class="kwiker-app">
        <template v-if="!isProfileVisible && !isNotificationsVisible && !isCommunitiesVisible">
            <header class="kwiker-header">
                <button type="button" class="kwiker-profile-button" aria-label="Ouvrir mon profil"
                    @click="isProfileVisible = true"><span class="kwiker-avatar kwiker-avatar--small"
                        :style="{ background: currentUser.color }">{{ currentUser.initials }}</span></button>
                <div class="kwiker-logo" aria-label="Kwiker"><span>k</span></div>
                <div class="kwiker-header-actions"><button type="button" aria-label="Rechercher" @click="openSearch">
                        <Search :size="18" />
                    </button><button type="button" aria-label="Notifications" @click="openNotifications">
                        <Bell :size="18" />
                    </button></div>
            </header>

            <div v-if="isSearchVisible" class="kwiker-search">
                <Search :size="16" /><input v-model="searchQuery" type="search" placeholder="Rechercher sur Kwiker"
                    autofocus /><button type="button" aria-label="Fermer la recherche" @click="openSearch">
                    <X :size="15" />
                </button>
            </div>
            <main class="kwiker-feed">
                <section class="kwiker-composer-card"><span class="kwiker-avatar"
                        :style="{ background: currentUser.color }">{{ currentUser.initials }}</span><button
                        type="button" class="kwiker-composer-trigger" @click="openComposer">Quoi de neuf à Los Santos
                        ?</button><button type="button" class="kwiker-compose-mini" aria-label="Nouveau Kwik"
                        @click="openComposer">
                        <PenLine :size="17" />
                    </button></section>
                <div class="kwiker-feed-heading"><span>{{ activeSection === 'bookmarks' ? 'Tes signets' : (activeTab === 'Pour toi' ? 'Les dernières nouvelles' : 'Les comptes que tu suis') }}</span><button type="button" aria-label="Options du fil" @click="openSettings">
                        <Settings :size="15" />
                    </button></div>
                <section v-if="visiblePosts.length" class="kwiker-posts">
                    <article v-for="post in visiblePosts" :key="post.id" class="kwiker-post">
                        <span class="kwiker-avatar" :style="{ background: post.color }">{{ post.initials }}</span>
                        <div class="kwiker-post-body">
                            <header class="kwiker-post-header">
                                <div class="kwiker-post-author"><strong>{{ post.author }}</strong>
                                    <Check v-if="post.author === 'LSPD Los Santos' || post.author === 'Weazel News'"
                                        class="kwiker-verified" :size="12" /><span>{{ post.handle
                                        }}</span><span>·</span><time>{{ relativeTime(post.time) }}</time>
                                </div><button type="button" aria-label="Plus d'options" @click="openPostMenu(post)">
                                    <MoreHorizontal :size="17" />
                                </button>
                            </header>
                            <p v-if="post.text" class="kwiker-post-text">{{ post.text }}</p><img v-if="post.image"
                                class="kwiker-post-image" :src="post.image" alt="Image publiée" />
                            <div v-if="post.poll" class="kwiker-poll">
                                <button v-for="(option, optionIndex) in post.poll.options" :key="option" type="button"
                                    class="kwiker-poll-option" :class="{ 'kwiker-poll-option--selected': post.poll.selected === optionIndex }"
                                    :disabled="post.poll.votes.includes(currentUser.handle)" @click="votePoll(post, optionIndex)">
                                    <span>{{ option }}</span><Check v-if="post.poll.selected === optionIndex" :size="14" />
                                </button>
                                <small>{{ post.poll.votes.length ? 'Vote enregistré' : 'Sondage' }}</small>
                            </div>
                            <div class="kwiker-post-actions"><button type="button"
                                    :class="{ 'kwiker-action--commented': post.commentsList?.length }"
                                    aria-label="Commenter" @click="openComments(post)">
                                    <MessageCircle :size="17" /><span>{{ formatCount(post.comments) }}</span>
                                </button><button type="button" :class="{ 'kwiker-action--reposted': post.reposted }"
                                    aria-label="Reposter" @click="toggleRepost(post)">
                                    <Repeat2 :size="17" /><span>{{ formatCount(post.reposts) }}</span>
                                </button><button type="button" :class="{ 'kwiker-action--liked': post.liked }"
                                    aria-label="Aimer" @click="toggleLike(post)">
                                    <Heart :size="17" :fill="post.liked ? 'currentColor' : 'none'" /><span>{{
                                        formatCount(post.likes) }}</span>
                                </button><button type="button" :class="{ 'kwiker-action--saved': post.bookmarked }"
                                    aria-label="Enregistrer" @click="toggleBookmark(post)">
                                    <Bookmark :size="17" :fill="post.bookmarked ? 'currentColor' : 'none'" />
                                </button><button type="button" aria-label="Partager" @click="sharePost(post)">
                                    <Share2 :size="16" />
                                </button></div>
                        </div>
                    </article>
                </section>
                <div v-else class="kwiker-empty">
                    <Search :size="25" /><strong>Aucun Kwik trouvé</strong><span>Essaie une autre recherche ou consulte
                        l’onglet Pour toi.</span>
                </div>
            </main>
            <nav class="kwiker-bottom-nav" aria-label="Navigation Kwiker">
                <div class="kwiker-bottom-categories" role="tablist" aria-label="Catégories du fil">
                    <button type="button" role="tab" :aria-selected="activeTab === 'Pour toi'"
                        :class="{ 'kwiker-tab--active': activeTab === 'Pour toi' }"
                        @click="activeTab = 'Pour toi'">Pour toi</button>
                    <button type="button" role="tab" :aria-selected="activeTab === 'Abonnements'"
                        :class="{ 'kwiker-tab--active': activeTab === 'Abonnements' }"
                        @click="activeTab = 'Abonnements'">Abonnements</button>
                </div>
                <button type="button" class="kwiker-nav-item" :class="{ 'kwiker-nav-item--active': activeSection === 'home' }" aria-label="Accueil" @click="setHome">
                    <Home :size="20" :fill="'currentColor'" />
                </button><button type="button" class="kwiker-nav-item" aria-label="Communautés" @click="openCommunities">
                    <Users :size="20" />
                </button><button type="button" class="kwiker-nav-post" aria-label="Publier" @click="openComposer">
                    <PenLine :size="19" />
                </button><button type="button" class="kwiker-nav-item" :class="{ 'kwiker-nav-item--active': activeSection === 'bookmarks' }" aria-label="Signets" @click="setBookmarks">
                    <Bookmark :size="20" />
                </button><button type="button" class="kwiker-nav-item" aria-label="Profil"
                    @click="isProfileVisible = true; activeSection = 'home'">
                    <UserRound :size="20" />
                </button></nav>
        </template>

        <Transition name="kwiker-page">
            <section v-if="isProfileVisible" class="kwiker-profile-page">
                <header class="kwiker-page-header"><button type="button" aria-label="Retour"
                        @click="isProfileVisible = false">
                        <ArrowLeft :size="19" />
                    </button><strong>Profil</strong><button type="button" aria-label="Réglages du profil" @click="openSettings">
                        <Settings :size="18" />
                    </button></header>
                <div class="kwiker-profile-scroll">
                    <div class="kwiker-profile-cover"></div>
                    <div class="kwiker-profile-intro"><span class="kwiker-avatar kwiker-avatar--profile"
                            :style="{ background: currentUser.color }">{{ currentUser.initials }}</span><button
                            type="button" class="kwiker-edit-button" @click="openAccountEditor">Modifier</button>
                        <h2>{{ currentUser.name }}</h2><span class="kwiker-profile-handle">{{ currentUser.handle
                            }}</span>
                        <p>{{ currentUser.bio }}</p>
                        <div class="kwiker-profile-meta"><span>
                                <Globe2 :size="13" /> Los Santos
                            </span><span>Depuis avril 2024</span></div>
                        <div class="kwiker-profile-stats"><span><strong>{{ currentUser.following }}</strong>
                                abonnements</span><span><strong>{{ currentUser.followers }}</strong> abonnés</span>
                        </div>
                    </div>
                    <div class="kwiker-profile-tabs"><button v-for="tab in ['Kwiks', 'Réponses', 'Médias']" :key="tab" type="button"
                            :class="{ 'kwiker-tab--active': profileTab === tab }" @click="profileTab = tab">{{ tab }}</button></div>
                    <div v-if="profileTab === 'Kwiks'">
                    <article v-for="post in ownPosts"
                        :key="`profile-${post.id}`" class="kwiker-post kwiker-post--profile"><span class="kwiker-avatar"
                            :style="{ background: currentUser.color }">{{ currentUser.initials }}</span>
                        <div class="kwiker-post-body">
                            <header class="kwiker-post-author"><strong>{{ currentUser.name }}</strong><span>{{
                                    currentUser.handle }}</span><span>·</span><time>{{ relativeTime(post.time) }}</time>
                            </header>
                            <p v-if="post.text" class="kwiker-post-text">{{ post.text }}</p>
                            <img v-if="post.image" class="kwiker-post-image" :src="post.image" alt="Image publiée" />
                        </div>
                    </article>
                    <div v-if="!ownPosts.length" class="kwiker-empty kwiker-empty--profile"><PenLine :size="23" /><strong>Pas encore de Kwik</strong><span>Publie ton premier message pour le voir ici.</span></div>
                    </div>
                    <div v-else-if="profileTab === 'Réponses'">
                        <article v-for="post in profileReplies" :key="`reply-${post.id}`" class="kwiker-post kwiker-post--profile">
                            <span class="kwiker-avatar" :style="{ background: currentUser.color }">{{ currentUser.initials }}</span>
                            <div class="kwiker-post-body"><header class="kwiker-post-author"><strong>{{ currentUser.name }}</strong><span>{{ currentUser.handle }}</span><span>·</span><time>{{ relativeTime(post.time) }}</time></header>
                                <p class="kwiker-reply-context">En réponse à {{ post.author }}</p><p class="kwiker-post-text">{{ post.commentsList.find((comment) => comment.author === currentUser.name)?.text }}</p>
                            </div>
                        </article>
                        <div v-if="!profileReplies.length" class="kwiker-empty kwiker-empty--profile"><MessageCircle :size="23" /><strong>Aucune réponse</strong><span>Les réponses que tu écriras apparaîtront ici.</span></div>
                    </div>
                    <div v-else>
                        <article v-for="post in profileMedia" :key="`media-${post.id}`" class="kwiker-post kwiker-post--profile">
                            <span class="kwiker-avatar" :style="{ background: currentUser.color }">{{ currentUser.initials }}</span>
                            <div class="kwiker-post-body"><header class="kwiker-post-author"><strong>{{ currentUser.name }}</strong><span>{{ currentUser.handle }}</span><span>·</span><time>{{ relativeTime(post.time) }}</time></header><p v-if="post.text" class="kwiker-post-text">{{ post.text }}</p><img class="kwiker-post-image" :src="post.image" alt="Image publiée" /></div>
                        </article>
                        <div v-if="!profileMedia.length" class="kwiker-empty kwiker-empty--profile"><ImagePlus :size="23" /><strong>Aucun média</strong><span>Les images de tes Kwiks apparaîtront ici.</span></div>
                    </div>
                </div>
            </section>
        </Transition>

        <Transition name="kwiker-page">
            <section v-if="isNotificationsVisible" class="kwiker-settings-page">
                <header class="kwiker-page-header"><button type="button" aria-label="Retour" @click="closeNotifications"><ArrowLeft :size="19" /></button><strong>Notifications</strong><span class="kwiker-sheet-spacer"></span></header>
                <div class="kwiker-settings-scroll">
                    <p class="kwiker-settings-eyebrow">Activité récente</p>
                    <section class="kwiker-settings-card kwiker-notification-card">
                        <div v-for="notification in notificationItems" :key="notification.id" class="kwiker-notification-row">
                            <span class="kwiker-avatar kwiker-avatar--small" :style="{ background: notification.color }">{{ notification.initials }}</span>
                            <span><strong>{{ notification.title }}</strong><small>{{ notification.time }}</small></span>
                            <Bell :size="16" />
                        </div>
                    </section>
                </div>
            </section>
        </Transition>

        <Transition name="kwiker-page">
            <section v-if="isCommunitiesVisible" class="kwiker-settings-page kwiker-communities-page">
                <header class="kwiker-page-header"><button type="button" aria-label="Retour" @click="closeCommunities"><ArrowLeft :size="19" /></button><strong>Communautés</strong><span class="kwiker-sheet-spacer"></span></header>
                <div class="kwiker-settings-scroll">
                    <p class="kwiker-settings-eyebrow">Trouve ton cercle</p>
                    <section class="kwiker-community-list">
                        <article v-for="community in communities" :key="community.id" class="kwiker-community-card">
                            <span class="kwiker-community-mark" :style="{ background: community.color }"><Users :size="18" /></span>
                            <div><strong>{{ community.name }}</strong><p>{{ community.description }}</p><small>{{ community.members }} membres</small></div>
                            <button type="button" :class="{ 'kwiker-community-join--active': joinedCommunities.includes(community.id) }" @click="toggleCommunity(community)">{{ joinedCommunities.includes(community.id) ? 'Rejoint' : 'Rejoindre' }}</button>
                        </article>
                    </section>
                </div>
            </section>
        </Transition>

        <Transition name="kwiker-page">
            <section v-if="isSettingsVisible" class="kwiker-settings-page">
                <header class="kwiker-page-header">
                    <button type="button" class="kwiker-back-button" aria-label="Retour" @click="closeSettings">
                        <ArrowLeft :size="19" />
                    </button>
                    <strong>Paramètres</strong>
                    <span class="kwiker-sheet-spacer"></span>
                </header>
                <div class="kwiker-settings-scroll">
                    <p class="kwiker-settings-eyebrow">Ton compte Kwiker</p>
                    <section class="kwiker-settings-card">
                        <button type="button" class="kwiker-settings-row" @click="openAccountEditor">
                            <span class="kwiker-settings-icon kwiker-settings-icon--blue"><UserRound :size="18" /></span>
                            <span><strong>Modifier le profil</strong><small>Nom, pseudo et bio</small></span>
                            <span class="kwiker-settings-chevron">›</span>
                        </button>
                    </section>

                    <p class="kwiker-settings-eyebrow">Préférences</p>
                    <section class="kwiker-settings-card">
                        <label class="kwiker-settings-row"><span class="kwiker-settings-icon kwiker-settings-icon--purple"><Bell :size="18" /></span><span><strong>Notifications</strong><small>Recevoir les alertes Kwiker</small></span><input v-model="accountSettings.notifications" class="kwiker-toggle-input" type="checkbox" /><span class="kwiker-toggle" aria-hidden="true"></span></label>
                        <label class="kwiker-settings-row"><span class="kwiker-settings-icon kwiker-settings-icon--orange"><Globe2 :size="18" /></span><span><strong>Compte privé</strong><small>Valider les nouveaux abonnés</small></span><input v-model="accountSettings.privateAccount" class="kwiker-toggle-input" type="checkbox" /><span class="kwiker-toggle" aria-hidden="true"></span></label>
                    </section>

                    <p class="kwiker-settings-eyebrow">À propos</p>
                    <section class="kwiker-settings-card">
                        <div class="kwiker-settings-row kwiker-settings-row--static"><span class="kwiker-settings-icon kwiker-settings-icon--green"><Check :size="18" /></span><span><strong>Kwiker</strong><small>Version 1.0 · Los Santos</small></span></div>
                    </section>
                </div>
            </section>
        </Transition>

        <Transition name="kwiker-sheet">
            <div v-if="isAccountEditorVisible" class="kwiker-sheet-backdrop" @click.self="closeAccountEditor">
                <form class="kwiker-account-sheet" @submit.prevent="saveAccount">
                    <div class="kwiker-sheet-grabber"></div>
                    <header class="kwiker-sheet-header"><button type="button" class="kwiker-back-button" aria-label="Retour" @click="closeAccountEditor"><ArrowLeft :size="19" /></button><strong>Modifier le profil</strong><button type="submit" class="kwiker-publish-button">Enregistrer</button></header>
                    <div class="kwiker-account-fields">
                        <div class="kwiker-account-preview"><span class="kwiker-avatar kwiker-avatar--profile" :style="{ background: currentUser.color }">{{ currentUser.initials }}</span><span><strong>{{ accountDraft.name || currentUser.name }}</strong><small>{{ accountDraft.handle || currentUser.handle }}</small></span></div>
                        <label class="kwiker-field"><span>Nom</span><input v-model="accountDraft.name" type="text" maxlength="32" autocomplete="name" placeholder="Ton nom" /></label>
                        <label class="kwiker-field"><span>Pseudo</span><input v-model="accountDraft.handle" type="text" maxlength="20" autocomplete="username" placeholder="@tonpseudo" /></label>
                        <label class="kwiker-field"><span>Bio</span><textarea v-model="accountDraft.bio" maxlength="120" rows="3" placeholder="Présente-toi en quelques mots"></textarea></label>
                        <p v-if="accountNotice" class="kwiker-form-notice">{{ accountNotice }}</p>
                    </div>
                </form>
            </div>
        </Transition>

        <Transition name="kwiker-sheet">
            <div v-if="isComposerVisible" class="kwiker-sheet-backdrop" @click.self="closeComposer">
                <form class="kwiker-composer-sheet" @submit.prevent="publishPost">
                    <div class="kwiker-sheet-grabber"></div>
                    <header class="kwiker-sheet-header"><button type="button" class="kwiker-back-button"
                            aria-label="Retour" @click="closeComposer"><ArrowLeft :size="19" /></button><strong>Nouveau Kwik</strong><button type="submit"
                            class="kwiker-publish-button">Publier</button></header>
                    <div class="kwiker-sheet-content"><span class="kwiker-avatar"
                            :style="{ background: currentUser.color }">{{
                            currentUser.initials }}</span>
                        <div class="kwiker-draft-area"><textarea v-model="draft.text" maxlength="280" autofocus
                                placeholder="Quoi de neuf ?"></textarea><img v-if="draft.image"
                                class="kwiker-draft-image" :src="draft.image" alt="Aperçu" />
                            <div class="kwiker-draft-footer"><button type="button" aria-label="Ajouter une image"
                                    @click="imageInput?.click()">
                                    <ImagePlus :size="19" />
                                </button><button type="button" aria-label="Ajouter un sondage">
                                    <ListFilter :size="18" />
                                </button><span>{{ draft.text.length }}/280</span></div>
                        </div>
                    </div><input ref="imageInput" class="kwiker-hidden-input" type="file" accept="image/*"
                        @change="readImage" />
                    <p v-if="publishNotice" class="kwiker-form-notice">{{ publishNotice }}</p>
                </form>
            </div>
        </Transition>

        <Transition name="kwiker-sheet">
            <div v-if="isCommentSheetVisible" class="kwiker-sheet-backdrop" @click.self="closeComments">
                <section class="kwiker-comments-sheet">
                    <div class="kwiker-sheet-grabber"></div>
                    <header class="kwiker-sheet-header"><button type="button" class="kwiker-back-button" aria-label="Retour"
                        @click="closeComments">
                            <ArrowLeft :size="19" />
                        </button><strong>Réponses</strong><span class="kwiker-sheet-spacer"></span></header>
                    <div v-if="selectedPost" class="kwiker-comments-scroll">
                        <article class="kwiker-post kwiker-post--original"><span class="kwiker-avatar"
                                :style="{ background: selectedPost.color }">{{ selectedPost.initials }}</span>
                            <div class="kwiker-post-body">
                                <div class="kwiker-post-author"><strong>{{ selectedPost.author }}</strong><span>{{
                                        selectedPost.handle }}</span></div>
                                <p class="kwiker-post-text">{{ selectedPost.text }}</p>
                            </div>
                        </article>
                        <div v-if="selectedPost.commentsList?.length" class="kwiker-comments-list">
                            <article v-for="comment in selectedPost.commentsList" :key="comment.id"
                                class="kwiker-comment"><span class="kwiker-avatar kwiker-avatar--small"
                                    :style="{ background: comment.color }">{{
                                    comment.initials }}</span>
                                <div>
                                    <div class="kwiker-post-author"><strong>{{ comment.author }}</strong><span>{{
                                            comment.handle
                                            }}</span></div>
                                    <p>{{ comment.text }}</p>
                                </div>
                            </article>
                        </div>
                        <div v-else class="kwiker-no-comments">
                            <MessageCircle :size="23" /><span>Sois le premier à répondre.</span>
                        </div>
                    </div>
                    <form class="kwiker-comment-form" @submit.prevent="addComment"><span
                            class="kwiker-avatar kwiker-avatar--small" :style="{ background: currentUser.color }">{{
                            currentUser.initials }}</span><input v-model="commentDraft" type="text"
                            placeholder="Répondre à ce Kwik" /><button type="submit" aria-label="Envoyer"
                            :disabled="!commentDraft.trim()">
                            <Send :size="17" />
                        </button></form>
                </section>
            </div>
        </Transition>
    </div>
</template>

<style scoped lang="scss">
.kwiker-app {
    --kwiker-blue: #1d9bf0;
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
    padding: 9cqh 0 4cqh;
    color: #fff;
    background: #0a0a0a;
}

.kwiker-header,
.kwiker-header-actions,
.kwiker-post-header,
.kwiker-post-author,
.kwiker-post-actions,
.kwiker-bottom-nav,
.kwiker-draft-footer,
.kwiker-profile-meta,
.kwiker-profile-stats,
.kwiker-page-header,
.kwiker-sheet-header,
.kwiker-comment-form {
    display: flex;
    align-items: center;
}

.kwiker-header {
    justify-content: space-between;
    flex-shrink: 0;
    padding: 0 3.5cqw;
}

.kwiker-profile-button,
.kwiker-header-actions button,
.kwiker-page-header button {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0;
    padding: 0;
    color: rgba(255, 255, 255, .82);
    background: transparent;
    cursor: pointer;
}

.kwiker-profile-button {
    width: 5cqh;
    height: 5cqh;
}

.kwiker-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 5cqh;
    height: 5cqh;
    color: white;
    font-family: Arial, sans-serif;
    font-size: 4.2cqh;
    font-weight: 800;
    letter-spacing: -.18cqw;
}

.kwiker-logo span {
    transform: rotate(-8deg);
}

.kwiker-header-actions {
    gap: 1.8cqw;
}

.kwiker-header-actions button {
    width: 4.6cqh;
    height: 4.6cqh;
    border-radius: 50%;
    background: rgba(118, 118, 128, .17);
}

.kwiker-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    width: 7cqh;
    height: 7cqh;
    border-radius: 50%;
    color: #fff;
    font-size: 1.65cqh;
    font-weight: 700;
    letter-spacing: -.04cqw;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .16);
}

.kwiker-avatar--small {
    width: 4.7cqh;
    height: 4.7cqh;
    font-size: 1.25cqh;
}

.kwiker-search {
    display: flex;
    align-items: center;
    gap: 1.5cqw;
    height: 5cqh;
    margin: 1.5cqh 3.5cqw 0;
    padding: 0 2cqw;
    border-radius: 1.5cqh;
    color: rgba(255, 255, 255, .5);
    background: rgba(118, 118, 128, .2);
}

.kwiker-search input {
    min-width: 0;
    flex: 1;
    border: 0;
    outline: 0;
    color: white;
    background: transparent;
    font: inherit;
    font-size: 1.65cqh;
}

.kwiker-search button {
    display: flex;
    border: 0;
    padding: 0;
    color: rgba(255, 255, 255, .55);
    background: transparent;
}

.kwiker-tabs,
.kwiker-profile-tabs {
    display: flex;
    flex-shrink: 0;
    border-bottom: 1px solid rgba(255, 255, 255, .1);
}

.kwiker-tabs button,
.kwiker-profile-tabs button {
    position: relative;
    flex: 1;
    border: 0;
    padding: 1.9cqh 0 1.5cqh;
    color: rgba(255, 255, 255, .48);
    background: transparent;
    font: inherit;
    font-size: 1.65cqh;
    cursor: pointer;
}

.kwiker-tabs button.kwiker-tab--active,
.kwiker-profile-tabs button.kwiker-tab--active {
    color: #fff;
    font-weight: 600;
}

.kwiker-tabs button.kwiker-tab--active::after,
.kwiker-profile-tabs button.kwiker-tab--active::after {
    position: absolute;
    bottom: -1px;
    left: 50%;
    width: 10cqw;
    height: .35cqh;
    border-radius: 99px;
    content: '';
    background: var(--kwiker-blue);
    transform: translateX(-50%);
}

.kwiker-feed {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    scrollbar-width: none;
}

.kwiker-feed::-webkit-scrollbar,
.kwiker-profile-scroll::-webkit-scrollbar,
.kwiker-comments-scroll::-webkit-scrollbar {
    display: none;
}

.kwiker-composer-card {
    display: flex;
    align-items: center;
    gap: 2.5cqw;
    padding: 2cqh 3.5cqw;
    border-bottom: 1px solid rgba(255, 255, 255, .1);
}

.kwiker-composer-trigger {
    flex: 1;
    border: 0;
    padding: 0;
    color: rgba(255, 255, 255, .43);
    background: transparent;
    font: inherit;
    font-size: 1.95cqh;
    text-align: left;
    cursor: pointer;
}

.kwiker-compose-mini {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 4.5cqh;
    height: 4.5cqh;
    border: 0;
    border-radius: 50%;
    color: #fff;
    background: var(--kwiker-blue);
    cursor: pointer;
}

.kwiker-feed-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 2.2cqh 3.5cqw 1cqh;
    color: rgba(255, 255, 255, .44);
    font-size: 1.5cqh;
    font-weight: 600;
    letter-spacing: .08cqw;
    text-transform: uppercase;
}

.kwiker-feed-heading button {
    display: flex;
    border: 0;
    color: rgba(255, 255, 255, .43);
    background: transparent;
}

.kwiker-post {
    display: flex;
    gap: 2.5cqw;
    padding: 2cqh 3.5cqw;
    border-bottom: 1px solid rgba(255, 255, 255, .1);
}

.kwiker-post-body {
    min-width: 0;
    flex: 1;
}

.kwiker-post-header {
    justify-content: space-between;
    gap: 1cqw;
}

.kwiker-post-header>button {
    display: flex;
    border: 0;
    padding: 0;
    color: rgba(255, 255, 255, .35);
    background: transparent;
}

.kwiker-post-author {
    min-width: 0;
    gap: 1cqw;
    overflow: hidden;
    white-space: nowrap;
}

.kwiker-post-author strong {
    overflow: hidden;
    font-size: 1.85cqh;
    font-weight: 650;
    text-overflow: ellipsis;
}

.kwiker-post-author span,
.kwiker-post-author time {
    color: rgba(255, 255, 255, .42);
    font-size: 1.6cqh;
}

.kwiker-verified {
    flex-shrink: 0;
    padding: .25cqw;
    border-radius: 50%;
    color: #fff;
    background: var(--kwiker-blue);
}

.kwiker-post-text {
    margin: .8cqh 0 1.6cqh;
    color: rgba(255, 255, 255, .88);
    font-size: 1.9cqh;
    line-height: 1.35;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}

.kwiker-post-image,
.kwiker-draft-image {
    display: block;
    width: 100%;
    max-height: 24cqh;
    border-radius: 1.6cqh;
    object-fit: cover;
}

.kwiker-post-actions {
    justify-content: space-between;
    margin-top: .8cqh;
    color: rgba(255, 255, 255, .4);
}

.kwiker-post-actions button {
    display: flex;
    align-items: center;
    gap: 1cqw;
    border: 0;
    padding: .2cqh 0;
    color: inherit;
    background: transparent;
    font: inherit;
    font-size: 1.5cqh;
    cursor: pointer;
}

.kwiker-post-actions .kwiker-action--liked {
    color: #f91880;
}

.kwiker-post-actions .kwiker-action--reposted {
    color: #00ba7c;
}

.kwiker-post-actions .kwiker-action--saved,
.kwiker-post-actions .kwiker-action--commented {
    color: var(--kwiker-blue);
}

.kwiker-empty {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 1cqh;
    padding: 9cqh 8cqw;
    color: rgba(255, 255, 255, .35);
    text-align: center;
}

.kwiker-empty strong {
    color: rgba(255, 255, 255, .8);
    font-size: 2cqh;
}

.kwiker-empty span {
    font-size: 1.5cqh;
    line-height: 1.4;
}

.kwiker-bottom-nav {
    display: flex;
    align-items: stretch;
    flex-wrap: wrap;
    justify-content: space-around;
    position: relative;
    flex-shrink: 0;
    height: 12.5cqh;
    box-sizing: border-box;
    padding: 0 2cqw 1cqh;
    border-top: 1px solid rgba(255, 255, 255, .1);
    background: rgba(10, 10, 10, .96);
}

.kwiker-bottom-categories {
    display: flex;
    flex: 0 0 100%;
    height: 5.2cqh;
    border-bottom: 1px solid rgba(255, 255, 255, .1);
}

.kwiker-bottom-categories button {
    position: relative;
    flex: 1;
    border: 0;
    color: rgba(255, 255, 255, .48);
    background: transparent;
    font: inherit;
    font-size: 1.7cqh;
    cursor: pointer;
}

.kwiker-bottom-categories button.kwiker-tab--active {
    color: #fff;
    font-weight: 600;
}

.kwiker-bottom-categories button.kwiker-tab--active::after {
    position: absolute;
    right: 25%;
    bottom: -1px;
    left: 25%;
    height: .35cqh;
    border-radius: 99px;
    content: '';
    background: var(--kwiker-blue);
}

.kwiker-bottom-nav > .kwiker-nav-item,
.kwiker-bottom-nav > .kwiker-nav-post {
    align-self: center;
}

.kwiker-nav-item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 9cqw;
    border: 0;
    color: rgba(255, 255, 255, .45);
    background: transparent;
    cursor: pointer;
}

.kwiker-nav-item--active {
    color: #fff;
}

.kwiker-nav-post {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 5.4cqh;
    height: 5.4cqh;
    margin-top: -3.7cqh;
    border: 4px solid #0a0a0a;
    border-radius: 50%;
    color: #fff;
    background: var(--kwiker-blue);
    box-shadow: 0 .5cqh 1.5cqh rgba(29, 155, 240, .35);
    cursor: pointer;
}

.kwiker-profile-page {
    position: absolute;
    z-index: 4;
    inset: 0;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding-top: 8cqh;
    background: #0a0a0a;
}

.kwiker-page-header {
    justify-content: space-between;
    flex-shrink: 0;
    min-height: 6cqh;
    padding: 0 3.5cqw;
    border-bottom: 1px solid rgba(255, 255, 255, .1);
}

.kwiker-page-header button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 5cqh;
    height: 5cqh;
    border-radius: 50%;
    color: white;
    background: rgba(20, 20, 20, .58);
}

.kwiker-page-header strong {
    font-size: 2.1cqh;
}

.kwiker-profile-scroll {
    min-height: 0;
    overflow-y: auto;
    scrollbar-width: none;
}

.kwiker-profile-cover {
    height: 15cqh;
    background: linear-gradient(120deg, #142a4a, #293567 48%, #842e78);
}

.kwiker-profile-intro {
    position: relative;
    padding: 0 3.5cqw 2.5cqh;
}

.kwiker-avatar--profile {
    width: 15cqh;
    height: 15cqh;
    margin-top: -7.5cqh;
    border: .6cqh solid #0a0a0a;
    font-size: 3.5cqh;
}

.kwiker-edit-button {
    position: absolute;
    top: 1.8cqh;
    right: 3.5cqw;
    border: 1px solid rgba(255, 255, 255, .3);
    border-radius: 999px;
    padding: .9cqh 2.5cqw;
    color: #fff;
    background: transparent;
    font: inherit;
    font-size: 1.45cqh;
    font-weight: 600;
}

.kwiker-profile-intro h2 {
    margin: 1.2cqh 0 0;
    font-size: 3.1cqh;
}

.kwiker-profile-handle {
    display: block;
    margin-top: .4cqh;
    color: rgba(255, 255, 255, .45);
    font-size: 1.65cqh;
}

.kwiker-profile-intro p {
    margin: 1.6cqh 0;
    color: rgba(255, 255, 255, .85);
    font-size: 1.8cqh;
}

.kwiker-profile-meta {
    gap: 2.5cqw;
    color: rgba(255, 255, 255, .43);
    font-size: 1.5cqh;
}

.kwiker-profile-meta span {
    display: flex;
    align-items: center;
    gap: .7cqw;
}

.kwiker-profile-stats {
    gap: 3cqw;
    margin-top: 1.8cqh;
    color: rgba(255, 255, 255, .45);
    font-size: 1.6cqh;
}

.kwiker-profile-stats strong {
    color: #fff;
}

.kwiker-post--profile {
    padding-top: 2cqh;
}

.kwiker-settings-page {
    position: absolute;
    z-index: 6;
    inset: 0;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding-top: 8cqh;
    background: #0a0a0a;
}

.kwiker-settings-scroll {
    min-height: 0;
    overflow-y: auto;
    padding: 2.5cqh 3.5cqw 8cqh;
    scrollbar-width: none;
}

.kwiker-settings-eyebrow {
    margin: 1.5cqh 1cqw 1cqh;
    color: rgba(255, 255, 255, .45);
    font-size: 1.5cqh;
    font-weight: 600;
}

.kwiker-settings-card {
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, .08);
    border-radius: 1.8cqh;
    background: rgba(30, 30, 32, .94);
}

.kwiker-settings-row {
    display: flex;
    align-items: center;
    gap: 2.5cqw;
    width: 100%;
    min-height: 8.5cqh;
    box-sizing: border-box;
    border: 0;
    border-bottom: 1px solid rgba(255, 255, 255, .08);
    padding: 1.2cqh 2.5cqw;
    color: white;
    background: transparent;
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.kwiker-settings-row:last-child { border-bottom: 0; }
.kwiker-settings-row > span:nth-child(2) { display: flex; flex: 1; flex-direction: column; gap: .45cqh; min-width: 0; }
.kwiker-settings-row strong { font-size: 1.75cqh; font-weight: 600; }
.kwiker-settings-row small { color: rgba(255, 255, 255, .48); font-size: 1.45cqh; }
.kwiker-settings-row--static { cursor: default; }
.kwiker-settings-icon { display: flex; align-items: center; justify-content: center; flex: 0 0 auto; width: 4.8cqh; height: 4.8cqh; border-radius: 1.3cqh; color: white; }
.kwiker-settings-icon--blue { background: rgba(29, 155, 240, .22); color: #54b7f7; }.kwiker-settings-icon--purple { background: rgba(124, 92, 255, .22); color: #aa98ff; }.kwiker-settings-icon--orange { background: rgba(255, 157, 61, .2); color: #ffb66f; }.kwiker-settings-icon--green { background: rgba(0, 186, 124, .2); color: #4bd5a7; }
.kwiker-settings-chevron { flex: 0 0 auto; color: rgba(255, 255, 255, .35); font-size: 3.2cqh; font-weight: 300; line-height: 1; }
.kwiker-toggle-input { position: absolute; width: 1px; height: 1px; opacity: 0; }
.kwiker-toggle { position: relative; flex: 0 0 auto; width: 8.2cqw; height: 4.2cqh; border-radius: 99px; background: rgba(118, 118, 128, .38); transition: background .2s ease; }
.kwiker-toggle::after { position: absolute; top: .35cqh; left: .45cqw; width: 3.5cqh; height: 3.5cqh; border-radius: 50%; content: ''; background: white; box-shadow: 0 .2cqh .6cqh rgba(0, 0, 0, .25); transition: transform .2s ease; }
.kwiker-toggle-input:checked + .kwiker-toggle { background: #34c759; }.kwiker-toggle-input:checked + .kwiker-toggle::after { transform: translateX(3.7cqw); }

.kwiker-account-sheet {
    width: 100%;
    max-height: 78cqh;
    box-sizing: border-box;
    overflow-y: auto;
    border-radius: 2.8cqh 2.8cqh 0 0;
    padding: 1cqh 3.5cqw 7cqh;
    background: #1c1c1e;
    box-shadow: 0 -1cqh 4cqh rgba(0, 0, 0, .35);
}

.kwiker-account-fields { padding-top: 2cqh; }
.kwiker-account-preview { display: flex; align-items: center; gap: 2.5cqw; padding: 1cqh 0 2.2cqh; }.kwiker-account-preview > span:last-child { display: flex; flex-direction: column; gap: .4cqh; }.kwiker-account-preview strong { font-size: 2cqh; }.kwiker-account-preview small { color: rgba(255, 255, 255, .46); font-size: 1.5cqh; }
.kwiker-field { display: flex; flex-direction: column; gap: .8cqh; margin-top: 1.8cqh; color: rgba(255, 255, 255, .55); font-size: 1.6cqh; }.kwiker-field input, .kwiker-field textarea { width: 100%; box-sizing: border-box; border: 1px solid rgba(255, 255, 255, .12); border-radius: 1.3cqh; padding: 1.4cqh 1.8cqw; outline: 0; color: white; background: rgba(118, 118, 128, .16); font: inherit; font-size: 1.9cqh; }.kwiker-field input:focus, .kwiker-field textarea:focus { border-color: rgba(29, 155, 240, .8); background: rgba(29, 155, 240, .08); }.kwiker-field textarea { min-height: 9cqh; resize: vertical; line-height: 1.35; }

.kwiker-sheet-backdrop {
    position: absolute;
    z-index: 10;
    inset: 0;
    display: flex;
    align-items: flex-end;
    background: rgba(0, 0, 0, .58);
}

.kwiker-composer-sheet,
.kwiker-comments-sheet {
    width: 100%;
    box-sizing: border-box;
    border-radius: 2.8cqh 2.8cqh 0 0;
    background: #1c1c1e;
    box-shadow: 0 -1cqh 4cqh rgba(0, 0, 0, .35);
}

.kwiker-composer-sheet {
    min-height: 35cqh;
    max-height: 78cqh;
    overflow-y: auto;
    padding: 1cqh 3.5cqw 7cqh;
}

.kwiker-comments-sheet {
    max-height: 76cqh;
    padding-top: 1cqh;
    padding-bottom: 4cqh;
}

.kwiker-sheet-grabber {
    width: 9cqw;
    height: .55cqh;
    margin: 0 auto 1.5cqh;
    border-radius: 99px;
    background: rgba(255, 255, 255, .25);
}

.kwiker-sheet-header {
    justify-content: space-between;
    min-height: 5cqh;
}

.kwiker-sheet-header button {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 5cqh;
    min-height: 4.8cqh;
    border: 0;
    padding: 0;
    color: rgba(255, 255, 255, .65);
    background: transparent;
    font: inherit;
    font-size: 1.6cqh;
    cursor: pointer;
}

.kwiker-sheet-header .kwiker-back-button {
    border-radius: 50%;
    color: white;
    background: rgba(20, 20, 20, .58);
}

.kwiker-sheet-header strong {
    font-size: 1.8cqh;
}

.kwiker-publish-button {
    color: var(--kwiker-blue) !important;
    font-weight: 700;
}

.kwiker-sheet-content {
    display: flex;
    gap: 2.5cqw;
    padding-top: 2cqh;
}

.kwiker-draft-area {
    flex: 1;
    min-width: 0;
}

.kwiker-draft-area textarea {
    display: block;
    width: 100%;
    min-height: 13cqh;
    box-sizing: border-box;
    resize: vertical;
    border: 0;
    outline: 0;
    color: white;
    background: transparent;
    font: inherit;
    font-size: 2cqh;
    line-height: 1.4;
}

.kwiker-draft-area textarea::placeholder {
    color: rgba(255, 255, 255, .38);
}

.kwiker-draft-footer {
    gap: 2.5cqw;
    margin-top: 1cqh;
    padding-top: 1.5cqh;
    border-top: 1px solid rgba(255, 255, 255, .1);
    color: var(--kwiker-blue);
}

.kwiker-draft-footer button {
    display: flex;
    border: 0;
    padding: 0;
    color: inherit;
    background: transparent;
}

.kwiker-draft-footer span {
    margin-left: auto;
    color: rgba(255, 255, 255, .42);
    font-size: 1.35cqh;
}

.kwiker-hidden-input {
    display: none;
}

.kwiker-form-notice {
    margin: 1.5cqh 0 0 9.5cqw;
    color: #ff453a;
    font-size: 1.45cqh;
}

.kwiker-sheet-spacer {
    width: 5cqh;
}

.kwiker-comments-scroll {
    max-height: 57cqh;
    overflow-y: auto;
    scrollbar-width: none;
}

.kwiker-post--original {
    background: rgba(255, 255, 255, .025);
}

.kwiker-comments-list {
    border-top: 1px solid rgba(255, 255, 255, .1);
}

.kwiker-comment {
    display: flex;
    gap: 2.5cqw;
    padding: 2cqh 3.5cqw;
    border-bottom: 1px solid rgba(255, 255, 255, .08);
}

.kwiker-comment>div {
    min-width: 0;
}

.kwiker-comment p {
    margin: .7cqh 0 0;
    color: rgba(255, 255, 255, .82);
    font-size: 1.75cqh;
    line-height: 1.35;
}

.kwiker-no-comments {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 1cqh;
    min-height: 18cqh;
    color: rgba(255, 255, 255, .4);
    font-size: 1.5cqh;
}

.kwiker-comment-form {
    gap: 2cqw;
    padding: 1.5cqh 3.5cqw 2.5cqh;
    border-top: 1px solid rgba(255, 255, 255, .12);
}

.kwiker-comment-form input {
    min-width: 0;
    flex: 1;
    height: 4.5cqh;
    box-sizing: border-box;
    border: 0;
    border-radius: 999px;
    padding: 0 2cqw;
    outline: 0;
    color: white;
    background: rgba(118, 118, 128, .2);
    font: inherit;
    font-size: 1.5cqh;
}

.kwiker-comment-form button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 4.5cqh;
    height: 4.5cqh;
    border: 0;
    border-radius: 50%;
    color: #fff;
    background: var(--kwiker-blue);
}

.kwiker-comment-form button:disabled {
    opacity: .4;
}

.kwiker-page-enter-active,
.kwiker-page-leave-active,
.kwiker-sheet-enter-active,
.kwiker-sheet-leave-active {
    transition: opacity .25s ease, transform .3s cubic-bezier(.22, 1, .36, 1);
}

.kwiker-page-enter-from,
.kwiker-page-leave-to {
    opacity: 0;
    transform: translateX(100%);
}

.kwiker-sheet-enter-from,
.kwiker-sheet-leave-to {
    opacity: 0;
    transform: translateY(100%);
}
</style>
