<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { ArrowLeft, Bell, Check, CheckCircle2, Copy, Globe2, Heart, Home, ImagePlus, MessageCircle, MoreHorizontal, PenLine, Repeat2, Search, Send, Settings, Share2, Trash2, UserRound, X } from '@lucide/vue';

const storageKey = 'kwiker-posts';
const profileStorageKey = 'kwiker-profile';
const settingsStorageKey = 'kwiker-settings';
const followingStorageKey = 'kwiker-following';
const defaultProfile = { name: 'Maya Brooks', handle: '@mayabrooks', initials: 'MB', color: 'linear-gradient(145deg, #7c5cff, #c149ff)', bio: 'Toujours quelque part entre Los Santos et un bon café ☕', following: 184, followers: 1240, accountType: 'Personne', verified: false };
const starterPosts = [
    { id: 1, author: 'LSPD Los Santos', handle: '@LSPD_LS', initials: 'LP', color: 'linear-gradient(145deg, #2c6bed, #17336e)', accountType: 'Entreprise', verified: true, bio: 'Compte officiel de la police de Los Santos.', followers: 18400, following: 32, text: 'Les rues sont calmes ce soir. Merci à tous les habitants qui nous aident à garder Los Santos sûre. 💙', time: Date.now() - 1000 * 60 * 18, likes: 42, comments: 8, reposts: 12, liked: false, reposted: false, bookmarked: false, commentsList: [] },
    { id: 2, author: 'Weazel News', handle: '@weazelnews', initials: 'WN', color: 'linear-gradient(145deg, #ff3b6b, #7f2046)', accountType: 'Entreprise', verified: true, bio: 'Toute l’actualité de Los Santos.', followers: 26700, following: 84, text: 'FLASH INFO — La circulation est perturbée sur Vespucci Boulevard. Évitez le secteur jusqu’à nouvel ordre. 📰', time: Date.now() - 1000 * 60 * 53, likes: 76, comments: 14, reposts: 31, liked: true, reposted: false, bookmarked: false, commentsList: [] },
    { id: 3, author: 'Benny’s Original Motor Works', handle: '@bennys', initials: 'BO', color: 'linear-gradient(145deg, #ff9d3d, #8d3c1e)', accountType: 'Entreprise', verified: false, bio: 'Atelier automobile et préparations sur mesure.', followers: 6300, following: 146, text: 'Nouvelle semaine, nouveau projet. Passez à l’atelier si vous voulez donner un peu de caractère à votre caisse. 🔧', time: Date.now() - 1000 * 60 * 60 * 3, likes: 128, comments: 22, reposts: 18, liked: false, reposted: true, bookmarked: true, commentsList: [] },
];

const posts = ref([]);
const currentUser = ref({ ...defaultProfile });
const activeTab = ref('Pour toi');
const activeSection = ref('home');
const profileTab = ref('Kwiks');
const searchQuery = ref('');
const isComposerVisible = ref(false);
const isSearchVisible = ref(false);
const isProfileVisible = ref(false);
const viewedProfile = ref(null);
const isSettingsVisible = ref(false);
const isNotificationsVisible = ref(false);
const isAccountEditorVisible = ref(false);
const selectedPost = ref(null);
const selectedPostMenu = ref(null);
const isCommentSheetVisible = ref(false);
const commentDraft = ref('');
const actionNotice = ref('');
const draft = ref({ text: '', image: '' });
const publishNotice = ref('');
const imageInput = ref(null);
const accountDraft = ref({ name: '', handle: '', bio: '' });
const accountNotice = ref('');
const accountSettings = ref({ notifications: true, privateAccount: false });
const followingHandles = ref(['@LSPD_LS']);

const formatCount = (count = 0) => count > 999 ? `${(count / 1000).toFixed(1).replace('.0', '')}k` : count;
const relativeTime = (timestamp) => { const minutes = Math.max(0, Math.round((Date.now() - timestamp) / 60000)); if (minutes < 1) return 'maintenant'; if (minutes < 60) return `${minutes} min`; if (minutes < 1440) return `${Math.round(minutes / 60)} h`; return `${Math.round(minutes / 1440)} j`; };
const isOfficialHandle = (handle) => ['@LSPD_LS', '@weazelnews'].includes(handle);
const normalizePost = (post) => ({ ...post, accountType: post.accountType || (isOfficialHandle(post.handle) ? 'Entreprise' : 'Personne'), verified: Boolean(post.verified || isOfficialHandle(post.handle)), commentsList: Array.isArray(post.commentsList) ? post.commentsList : [], poll: post.poll ? { ...post.poll, options: Array.isArray(post.poll.options) ? post.poll.options : [], votes: Array.isArray(post.poll.votes) ? post.poll.votes : [] } : null });

onMounted(() => {
    try {
        const savedPosts = JSON.parse(localStorage.getItem(storageKey) || 'null');
        posts.value = Array.isArray(savedPosts) && savedPosts.length ? savedPosts.map(normalizePost) : starterPosts;
        const savedProfile = JSON.parse(localStorage.getItem(profileStorageKey) || 'null');
        if (savedProfile && typeof savedProfile === 'object') currentUser.value = { ...defaultProfile, ...savedProfile };
        const savedSettings = JSON.parse(localStorage.getItem(settingsStorageKey) || 'null');
        if (savedSettings && typeof savedSettings === 'object') accountSettings.value = { ...accountSettings.value, ...savedSettings };
        const savedFollowing = JSON.parse(localStorage.getItem(followingStorageKey) || 'null');
        if (Array.isArray(savedFollowing)) followingHandles.value = savedFollowing;
    } catch { posts.value = starterPosts; }
});
watch(posts, (value) => { try { localStorage.setItem(storageKey, JSON.stringify(value)); } catch { /* Session only. */ } }, { deep: true });
watch(currentUser, (value) => { try { localStorage.setItem(profileStorageKey, JSON.stringify(value)); } catch { /* Session only. */ } }, { deep: true });
watch(accountSettings, (value) => { try { localStorage.setItem(settingsStorageKey, JSON.stringify(value)); } catch { /* Session only. */ } }, { deep: true });
watch(followingHandles, (value) => { try { localStorage.setItem(followingStorageKey, JSON.stringify(value)); } catch { /* Session only. */ } }, { deep: true });

const profileIdentity = computed(() => viewedProfile.value || currentUser.value);
const isOwnProfile = computed(() => !viewedProfile.value || viewedProfile.value.handle === currentUser.value.handle);
const isFollowingViewed = computed(() => Boolean(viewedProfile.value && followingHandles.value.includes(viewedProfile.value.handle)));
const profilePosts = computed(() => posts.value.filter((post) => post.handle === profileIdentity.value.handle || post.author === profileIdentity.value.name));
const visiblePosts = computed(() => { const query = searchQuery.value.trim().toLowerCase(); return posts.value.filter((post) => { const matchesSearch = !query || `${post.author} ${post.handle} ${post.text}`.toLowerCase().includes(query); const matchesTab = activeTab.value === 'Pour toi' || followingHandles.value.includes(post.handle) || post.author === currentUser.value.name || post.reposted; return matchesSearch && matchesTab; }); });
const ownPosts = computed(() => posts.value.filter((post) => post.author === currentUser.value.name));
const profileReplies = computed(() => posts.value.filter((post) => (post.commentsList || []).some((comment) => comment.author === currentUser.value.name)));
const profileMedia = computed(() => ownPosts.value.filter((post) => post.image));
const notificationItems = computed(() => posts.value.slice(0, 3).map((post, index) => ({ id: `${post.id}-${index}`, initials: post.initials, color: post.color, title: index === 0 ? `${post.author} a publié un nouveau Kwik` : `${post.author} fait parler de lui sur Kwiker`, time: relativeTime(post.time) })));

const openComposer = () => { draft.value = { text: '', image: '' }; publishNotice.value = ''; isComposerVisible.value = true; };
const closeComposer = () => { isComposerVisible.value = false; };
const readImage = (event) => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { draft.value.image = String(reader.result || ''); }; reader.readAsDataURL(file); };
const publishPost = () => { const text = draft.value.text.trim(); if (!text && !draft.value.image) { publishNotice.value = 'Écris quelque chose ou ajoute une image.'; return; } posts.value.unshift({ id: Date.now(), author: currentUser.value.name, handle: currentUser.value.handle, initials: currentUser.value.initials, color: currentUser.value.color, accountType: currentUser.value.accountType, verified: currentUser.value.verified, text, image: draft.value.image, time: Date.now(), likes: 0, comments: 0, reposts: 0, liked: false, reposted: false, bookmarked: false, commentsList: [] }); closeComposer(); };
const toggleLike = (post) => { post.liked = !post.liked; post.likes += post.liked ? 1 : -1; };
const toggleRepost = (post) => { post.reposted = !post.reposted; post.reposts += post.reposted ? 1 : -1; };
const votePoll = (post, optionIndex) => { if (!post.poll || post.poll.votes.includes(currentUser.value.handle)) return; post.poll.votes.push(currentUser.value.handle); post.poll.selected = optionIndex; };
const openComments = (post) => { selectedPost.value = post; commentDraft.value = ''; isCommentSheetVisible.value = true; };
const closeComments = () => { isCommentSheetVisible.value = false; selectedPost.value = null; };
const addComment = () => { const text = commentDraft.value.trim(); if (!text || !selectedPost.value) return; selectedPost.value.commentsList = selectedPost.value.commentsList || []; selectedPost.value.commentsList.push({ id: Date.now(), author: currentUser.value.name, handle: currentUser.value.handle, initials: currentUser.value.initials, color: currentUser.value.color, text, time: Date.now() }); selectedPost.value.comments += 1; commentDraft.value = ''; };
const openSearch = () => { isSearchVisible.value = !isSearchVisible.value; if (!isSearchVisible.value) searchQuery.value = ''; };
const openSettings = () => { isSettingsVisible.value = true; };
const closeSettings = () => { isSettingsVisible.value = false; isAccountEditorVisible.value = false; };
const openNotifications = () => { isNotificationsVisible.value = true; };
const closeNotifications = () => { isNotificationsVisible.value = false; };
const setHome = () => { activeSection.value = 'home'; isProfileVisible.value = false; };
const openPostProfile = (post) => { const accountType = post.accountType || (isOfficialHandle(post.handle) ? 'Entreprise' : 'Personne'); viewedProfile.value = { name: post.author, handle: post.handle, initials: post.initials, color: post.color, accountType, verified: Boolean(post.verified || isOfficialHandle(post.handle)), bio: post.bio || (accountType === 'Entreprise' ? 'Compte professionnel sur Kwiker.' : 'Membre de la communauté de Los Santos.'), followers: post.followers || 0, following: post.following || 0 }; profileTab.value = 'Kwiks'; isProfileVisible.value = true; };
const openOwnProfile = () => { viewedProfile.value = null; profileTab.value = 'Kwiks'; isProfileVisible.value = true; };
const closeProfile = () => { viewedProfile.value = null; isProfileVisible.value = false; };
const toggleFollowViewed = () => { if (!viewedProfile.value) return; followingHandles.value = isFollowingViewed.value ? followingHandles.value.filter((handle) => handle !== viewedProfile.value.handle) : [...followingHandles.value, viewedProfile.value.handle]; };
const openPostMenu = (post) => { selectedPostMenu.value = post; };
const closePostMenu = () => { selectedPostMenu.value = null; };
const deletePost = () => { if (!selectedPostMenu.value || selectedPostMenu.value.author !== currentUser.value.name) return; posts.value = posts.value.filter((post) => post.id !== selectedPostMenu.value.id); closePostMenu(); actionNotice.value = 'Kwik supprimé'; window.setTimeout(() => { actionNotice.value = ''; }, 2200); };
const sharePost = async (post) => { const shareText = `${post.author} ${post.handle}\n${post.text}`.trim(); try { if (navigator.share) await navigator.share({ title: 'Kwiker', text: shareText }); else if (navigator.clipboard) await navigator.clipboard.writeText(shareText); actionNotice.value = navigator.share ? 'Kwik partagé' : 'Texte copié dans le presse-papiers'; } catch { actionNotice.value = 'Partage annulé'; } window.setTimeout(() => { actionNotice.value = ''; }, 2200); };
const copyPostLink = async () => { if (!selectedPostMenu.value) return; try { await navigator.clipboard?.writeText(`kwiker://post/${selectedPostMenu.value.id}`); } catch { /* Clipboard unavailable in preview. */ } closePostMenu(); actionNotice.value = 'Lien du Kwik copié'; window.setTimeout(() => { actionNotice.value = ''; }, 2200); };
const openAccountEditor = () => { accountDraft.value = { name: currentUser.value.name, handle: currentUser.value.handle, bio: currentUser.value.bio }; accountNotice.value = ''; isAccountEditorVisible.value = true; };
const closeAccountEditor = () => { isAccountEditorVisible.value = false; accountNotice.value = ''; };
const saveAccount = () => { const name = accountDraft.value.name.trim(); const handle = accountDraft.value.handle.trim().replace(/\s+/g, '').replace(/^@*/, '@'); const bio = accountDraft.value.bio.trim(); if (name.length < 2 || handle.length < 2) { accountNotice.value = 'Ajoute un nom et un pseudo valides.'; return; } const previousName = currentUser.value.name; const nextProfile = { ...currentUser.value, name, handle, bio, initials: name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase() }; currentUser.value = nextProfile; posts.value.forEach((post) => { if (post.author === previousName) Object.assign(post, { author: name, handle, initials: nextProfile.initials, color: nextProfile.color }); (post.commentsList || []).forEach((comment) => { if (comment.author === previousName) Object.assign(comment, { author: name, handle, initials: nextProfile.initials, color: nextProfile.color }); }); }); closeAccountEditor(); };
</script>

<template>
    <div class="kwiker-app">
        <template v-if="!isProfileVisible && !isNotificationsVisible && !isSettingsVisible">
            <header class="kwiker-header"><button type="button" class="kwiker-icon-button"
                    aria-label="Ouvrir mon profil" @click="openOwnProfile"><span
                        class="kwiker-avatar kwiker-avatar--tiny" :style="{ background: currentUser.color }">{{
                        currentUser.initials }}</span></button>
                <div class="kwiker-brand"><span class="kwiker-brand-mark">k</span><strong>Kwiker</strong></div>
                <div class="kwiker-header-actions"><button type="button" class="kwiker-icon-button"
                        aria-label="Rechercher" @click="openSearch">
                        <Search :size="18" />
                    </button><button type="button" class="kwiker-icon-button" aria-label="Notifications"
                        @click="openNotifications">
                        <Bell :size="18" />
                    </button></div>
            </header>
            <div v-if="isSearchVisible" class="kwiker-search">
                <Search :size="16" /><input v-model="searchQuery" type="search" placeholder="Rechercher sur Kwiker"
                    autofocus /><button type="button" aria-label="Fermer" @click="openSearch">
                    <X :size="15" />
                </button>
            </div>
            <main class="kwiker-feed">
                <nav class="kwiker-feed-tabs" role="tablist" aria-label="Fil Kwiker"><button type="button" role="tab"
                        :aria-selected="activeTab === 'Pour toi'" :class="{ 'is-active': activeTab === 'Pour toi' }"
                        @click="activeTab = 'Pour toi'; activeSection = 'home'">Pour toi</button><button type="button"
                        role="tab" :aria-selected="activeTab === 'Abonnements'"
                        :class="{ 'is-active': activeTab === 'Abonnements' }"
                        @click="activeTab = 'Abonnements'; activeSection = 'home'">Abonnements</button></nav>
                <section v-if="visiblePosts.length" class="kwiker-posts">
                    <article v-for="post in visiblePosts" :key="post.id" class="kwiker-post"><button type="button"
                            class="kwiker-avatar-button" :aria-label="`Voir le profil de ${post.author}`"
                            @click="openPostProfile(post)"><span class="kwiker-avatar"
                                :style="{ background: post.color }">{{ post.initials }}</span></button>
                        <div class="kwiker-post-body">
                            <header class="kwiker-post-header"><button type="button"
                                    class="kwiker-post-author kwiker-post-author-button"
                                    :aria-label="`Voir le profil de ${post.author}`"
                                    @click="openPostProfile(post)"><strong>{{ post.author }}</strong>
                                    <Check v-if="post.verified" class="kwiker-verified" :size="11" /><span>{{
                                        post.handle }}</span><span>·</span><time>{{ relativeTime(post.time) }}</time>
                                </button><button type="button" aria-label="Options du Kwik" @click="openPostMenu(post)">
                                    <MoreHorizontal :size="17" />
                                </button></header>
                            <p v-if="post.text" class="kwiker-post-text">{{ post.text }}</p><img v-if="post.image"
                                class="kwiker-post-image" :src="post.image" alt="Image publiée" />
                            <div v-if="post.poll" class="kwiker-poll"><button
                                    v-for="(option, optionIndex) in post.poll.options" :key="option" type="button"
                                    class="kwiker-poll-option"
                                    :class="{ 'is-selected': post.poll.selected === optionIndex }"
                                    :disabled="post.poll.votes.includes(currentUser.handle)"
                                    @click="votePoll(post, optionIndex)"><span>{{ option }}</span>
                                    <Check v-if="post.poll.selected === optionIndex" :size="14" />
                                </button><small>{{ post.poll.votes.length ? 'Vote enregistré' : 'Sondage' }}</small>
                            </div>
                            <div class="kwiker-post-actions"><button type="button"
                                    :class="{ 'is-active': post.commentsList?.length }" aria-label="Commenter"
                                    @click="openComments(post)">
                                    <MessageCircle :size="17" /><span>{{ formatCount(post.comments) }}</span>
                                </button><button type="button" :class="{ 'is-reposted': post.reposted }"
                                    aria-label="Reposter" @click="toggleRepost(post)">
                                    <Repeat2 :size="17" /><span>{{ formatCount(post.reposts) }}</span>
                                </button><button type="button" :class="{ 'is-liked': post.liked }" aria-label="Aimer"
                                    @click="toggleLike(post)">
                                    <Heart :size="17" :fill="post.liked ? 'currentColor' : 'none'" /><span>{{
                                        formatCount(post.likes) }}</span>
                                </button><button type="button" aria-label="Partager" @click="sharePost(post)">
                                    <Share2 :size="16" />
                                </button></div>
                        </div>
                    </article>
                </section>
                <div v-else class="kwiker-empty">
                    <Search :size="28" /><strong>Aucun Kwik trouvé</strong><span>Essaie une autre recherche ou consulte le fil Pour toi.</span>
                </div>
            </main>
            <div class="kwiker-bottom-nav">
                <nav class="categories" aria-label="Navigation Kwiker">
                    <button type="button" class="categorie" :class="{ 'categorie-selected': activeSection === 'home' }"
                        aria-label="Accueil" @click="setHome">
                        <Home size="3cqh" :fill="activeSection === 'home' ? 'currentColor' : 'none'" />
                        <span>Accueil</span>
                    </button>
                    <button type="button" class="categorie categorie-compose" aria-label="Créer un Kwik"
                        @click="openComposer">
                        <span class="categorie-compose-icon"><PenLine size="2.7cqh" /></span>
                        <span>Publier</span>
                    </button>
                    <button type="button" class="categorie" aria-label="Profil" @click="openOwnProfile">
                        <UserRound size="3cqh" /><span>Profil</span>
                    </button>
                </nav>
            </div>
        </template>

        <Transition name="kwiker-page">
            <section v-if="isProfileVisible" class="kwiker-page">
                <header class="kwiker-page-header"><button type="button" aria-label="Retour" @click="closeProfile">
                        <ArrowLeft :size="19" />
                    </button><strong>Profil</strong><button v-if="isOwnProfile" type="button" aria-label="Réglages"
                        @click="openSettings">
                        <Settings :size="18" />
                    </button><span v-else class="kwiker-header-spacer"></span></header>
                <div class="kwiker-page-scroll">
                    <div class="kwiker-profile-cover"></div>
                    <div class="kwiker-profile-intro"><span class="kwiker-avatar kwiker-avatar--profile"
                            :style="{ background: profileIdentity.color }">{{ profileIdentity.initials }}</span>
                        <div class="kwiker-profile-actions"><template v-if="isOwnProfile"><button type="button"
                                    class="kwiker-edit-button"
                                    @click="openAccountEditor">Modifier</button></template><button v-else type="button"
                                class="kwiker-follow-button" :class="{ 'is-following': isFollowingViewed }"
                                @click="toggleFollowViewed">{{ isFollowingViewed ? 'Suivi' : 'Suivre' }}</button></div>
                        <h2>{{ profileIdentity.name }}</h2><span class="kwiker-profile-handle">{{ profileIdentity.handle
                            }}</span>
                        <div class="kwiker-profile-labels"><span class="kwiker-profile-type">{{
                                profileIdentity.accountType
                                }}</span><span v-if="profileIdentity.verified" class="kwiker-profile-certified">
                                <CheckCircle2 :size="13" /> Certifié
                            </span></div>
                        <p>{{ profileIdentity.bio }}</p>
                        <div class="kwiker-profile-meta"><span>
                                <Globe2 :size="13" /> Los Santos
                            </span><span>Depuis avril 2024</span></div>
                        <div class="kwiker-profile-stats"><span><strong>{{ profileIdentity.following }}</strong>
                                abonnements</span><span><strong>{{ profileIdentity.followers }}</strong> abonnés</span>
                        </div>
                    </div>
                    <div v-if="isOwnProfile" class="kwiker-profile-tabs"><button
                            v-for="tab in ['Kwiks', 'Réponses', 'Médias']" :key="tab" type="button"
                            :class="{ 'is-active': profileTab === tab }" @click="profileTab = tab">{{
                            tab }}</button></div>
                    <div v-if="!isOwnProfile || profileTab === 'Kwiks'">
                        <article v-for="post in profilePosts" :key="`profile-${post.id}`"
                            class="kwiker-post kwiker-post--profile"><span class="kwiker-avatar"
                                :style="{ background: post.color }">{{ post.initials }}</span>
                            <div class="kwiker-post-body">
                                <header class="kwiker-post-header">
                                    <div class="kwiker-post-author"><strong>{{ post.author }}</strong>
                                        <Check v-if="post.verified" class="kwiker-verified" :size="11" /><span>{{
                                            post.handle
                                            }}</span><span>·</span><time>{{ relativeTime(post.time) }}</time>
                                    </div>
                                </header>
                                <p v-if="post.text" class="kwiker-post-text">{{ post.text }}</p><img v-if="post.image"
                                    class="kwiker-post-image" :src="post.image" alt="Image publiée" />
                            </div>
                        </article>
                        <div v-if="!profilePosts.length" class="kwiker-empty kwiker-empty--profile">
                            <UserRound :size="24" /><strong>Aucun Kwik</strong><span>Ce profil n’a encore rien
                                publié.</span>
                        </div>
                    </div>
                    <div v-else-if="profileTab === 'Réponses'">
                        <article v-for="post in profileReplies" :key="`reply-${post.id}`"
                            class="kwiker-post kwiker-post--profile"><span class="kwiker-avatar"
                                :style="{ background: currentUser.color }">{{ currentUser.initials }}</span>
                            <div class="kwiker-post-body">
                                <header class="kwiker-post-header">
                                    <div class="kwiker-post-author"><strong>{{ currentUser.name }}</strong><span>{{
                                            currentUser.handle }}</span><span>·</span><time>{{ relativeTime(post.time)
                                            }}</time>
                                    </div>
                                </header>
                                <p class="kwiker-reply-context">En réponse à {{ post.author }}</p>
                                <p class="kwiker-post-text">{{post.commentsList.find((comment) => comment.author ===
                                    currentUser.name)?.text }}</p>
                            </div>
                        </article>
                        <div v-if="!profileReplies.length" class="kwiker-empty kwiker-empty--profile">
                            <MessageCircle :size="24" /><strong>Aucune réponse</strong><span>Les réponses que tu écriras
                                apparaîtront ici.</span>
                        </div>
                    </div>
                    <div v-else>
                        <article v-for="post in profileMedia" :key="`media-${post.id}`"
                            class="kwiker-post kwiker-post--profile"><span class="kwiker-avatar"
                                :style="{ background: currentUser.color }">{{ currentUser.initials }}</span>
                            <div class="kwiker-post-body">
                                <header class="kwiker-post-header">
                                    <div class="kwiker-post-author"><strong>{{ currentUser.name }}</strong><span>{{
                                            currentUser.handle }}</span><span>·</span><time>{{ relativeTime(post.time)
                                            }}</time>
                                    </div>
                                </header>
                                <p v-if="post.text" class="kwiker-post-text">{{ post.text }}</p><img
                                    class="kwiker-post-image" :src="post.image" alt="Image publiée" />
                            </div>
                        </article>
                        <div v-if="!profileMedia.length" class="kwiker-empty kwiker-empty--profile">
                            <ImagePlus :size="24" /><strong>Aucun média</strong><span>Les images de tes Kwiks
                                apparaîtront
                                ici.</span>
                        </div>
                    </div>
                </div>
            </section>
        </Transition>
        <Transition name="kwiker-page">
            <section v-if="isNotificationsVisible" class="kwiker-page">
                <header class="kwiker-page-header"><button type="button" aria-label="Retour"
                        @click="closeNotifications">
                        <ArrowLeft :size="19" />
                    </button><strong>Notifications</strong><span class="kwiker-header-spacer"></span></header>
                <div class="kwiker-page-scroll kwiker-simple-scroll">
                    <p class="kwiker-eyebrow">Activité récente</p>
                    <section class="kwiker-list-card">
                        <div v-for="notification in notificationItems" :key="notification.id"
                            class="kwiker-notification-row">
                            <span class="kwiker-avatar kwiker-avatar--tiny"
                                :style="{ background: notification.color }">{{
                                notification.initials }}</span><span><strong>{{ notification.title }}</strong><small>{{
                                    notification.time }}</small></span>
                            <Bell :size="16" />
                        </div>
                    </section>
                </div>
            </section>
        </Transition>
        <Transition name="kwiker-page">
            <section v-if="isSettingsVisible" class="kwiker-page">
                <header class="kwiker-page-header"><button type="button" aria-label="Retour" @click="closeSettings">
                        <ArrowLeft :size="19" />
                    </button><strong>Réglages</strong><span class="kwiker-header-spacer"></span></header>
                <div class="kwiker-page-scroll kwiker-simple-scroll">
                    <p class="kwiker-eyebrow">Ton compte Kwiker</p>
                    <section class="kwiker-list-card"><button type="button" class="kwiker-settings-row"
                            @click="openAccountEditor"><span class="kwiker-settings-icon kwiker-settings-icon--blue">
                                <UserRound :size="17" />
                            </span><span><strong>Modifier le profil</strong><small>Nom, pseudo et
                                    bio</small></span><span class="kwiker-chevron">›</span></button></section>
                    <p class="kwiker-eyebrow">Préférences</p>
                    <section class="kwiker-list-card"><button type="button" class="kwiker-settings-row"
                            :aria-pressed="accountSettings.notifications"
                            @click="accountSettings.notifications = !accountSettings.notifications"><span
                                class="kwiker-settings-icon kwiker-settings-icon--purple">
                                <Bell :size="17" />
                            </span><span><strong>Notifications</strong><small>Recevoir les alertes
                                    Kwiker</small></span><span class="kwiker-setting-state"
                                :class="{ 'is-enabled': accountSettings.notifications }">{{
                                    accountSettings.notifications ? 'Activées' : 'Désactivées' }}</span></button><button
                            type="button" class="kwiker-settings-row" :aria-pressed="accountSettings.privateAccount"
                            @click="accountSettings.privateAccount = !accountSettings.privateAccount"><span
                                class="kwiker-settings-icon kwiker-settings-icon--orange">
                                <Globe2 :size="17" />
                            </span><span><strong>Compte privé</strong><small>Valider les nouveaux
                                    abonnés</small></span><span class="kwiker-setting-state"
                                :class="{ 'is-enabled': accountSettings.privateAccount }">{{
                                    accountSettings.privateAccount ? 'Activé' : 'Désactivé' }}</span></button></section>
                    <p class="kwiker-eyebrow">À propos</p>
                    <section class="kwiker-list-card">
                        <div class="kwiker-settings-row"><span class="kwiker-settings-icon kwiker-settings-icon--green">
                                <Check :size="17" />
                            </span><span><strong>Kwiker</strong><small>Version 1.0 · Los Santos</small></span></div>
                    </section>
                </div>
            </section>
        </Transition>
        <Transition name="kwiker-sheet">
            <div v-if="isComposerVisible" class="kwiker-sheet-backdrop" @click.self="closeComposer">
                <form class="kwiker-sheet kwiker-composer-sheet" @submit.prevent="publishPost">
                    <div class="kwiker-sheet-grabber"></div>
                    <header class="kwiker-sheet-header"><button type="button" class="kwiker-sheet-cancel"
                            @click="closeComposer">Annuler</button><strong>Nouveau Kwik</strong><button type="submit"
                            class="kwiker-sheet-submit">Publier</button></header>
                    <div class="kwiker-sheet-content kwiker-composer-content"><span class="kwiker-avatar"
                            :style="{ background: currentUser.color }">{{ currentUser.initials }}</span>
                        <div class="kwiker-draft-area"><textarea v-model="draft.text" maxlength="280" autofocus
                                placeholder="Quoi de neuf ?"></textarea><img v-if="draft.image"
                                class="kwiker-draft-image" :src="draft.image" alt="Aperçu" />
                            <div class="kwiker-draft-footer"><button type="button" aria-label="Ajouter une image"
                                    @click="imageInput?.click()">
                                    <ImagePlus :size="19" />
                                </button><span>{{ draft.text.length }}/280</span></div>
                        </div>
                    </div><input ref="imageInput" class="kwiker-hidden-input" type="file" accept="image/*"
                        @change="readImage" />
                    <p v-if="publishNotice" class="kwiker-form-notice">{{ publishNotice }}</p>
                </form>
            </div>
        </Transition>
        <Transition name="kwiker-sheet">
            <div v-if="isAccountEditorVisible" class="kwiker-sheet-backdrop" @click.self="closeAccountEditor">
                <form class="kwiker-sheet kwiker-account-sheet" @submit.prevent="saveAccount">
                    <div class="kwiker-sheet-grabber"></div>
                    <header class="kwiker-sheet-header"><button type="button" class="kwiker-sheet-cancel"
                            @click="closeAccountEditor">Annuler</button><strong>Modifier le profil</strong><button
                            type="submit" class="kwiker-sheet-submit">Enregistrer</button></header>
                    <div class="kwiker-sheet-content">
                        <div class="kwiker-account-preview"><span class="kwiker-avatar kwiker-avatar--profile"
                                :style="{ background: currentUser.color }">{{ currentUser.initials
                                }}</span><span><strong>{{
                                    accountDraft.name || currentUser.name }}</strong><small>{{ accountDraft.handle ||
                                    currentUser.handle }}</small></span></div><label
                            class="kwiker-field"><span>Nom</span><input v-model="accountDraft.name" type="text"
                                maxlength="32" placeholder="Ton nom" /></label><label
                            class="kwiker-field"><span>Pseudo</span><input v-model="accountDraft.handle" type="text"
                                maxlength="20" placeholder="@tonpseudo" /></label><label
                            class="kwiker-field"><span>Bio</span><textarea v-model="accountDraft.bio" maxlength="120"
                                rows="3" placeholder="Présente-toi en quelques mots"></textarea></label>
                        <p v-if="accountNotice" class="kwiker-form-notice">{{ accountNotice }}</p>
                    </div>
                </form>
            </div>
        </Transition>
        <Transition name="kwiker-sheet">
            <div v-if="selectedPostMenu" class="kwiker-sheet-backdrop" @click.self="closePostMenu">
                <section class="kwiker-sheet kwiker-menu-sheet">
                    <div class="kwiker-sheet-grabber"></div>
                    <header class="kwiker-sheet-header"><strong>Options du Kwik</strong><button type="button"
                            aria-label="Fermer" @click="closePostMenu">
                            <X :size="18" />
                        </button></header><button type="button" class="kwiker-menu-action" @click="copyPostLink">
                        <Copy :size="18" /><span>Copier le lien</span>
                    </button><button v-if="selectedPostMenu.author === currentUser.name" type="button"
                        class="kwiker-menu-action is-danger" @click="deletePost">
                        <Trash2 :size="18" /><span>Supprimer ce Kwik</span>
                    </button><button v-else type="button" class="kwiker-menu-action" @click="closePostMenu">
                        <CheckCircle2 :size="18" /><span>Fermer</span>
                    </button>
                </section>
            </div>
        </Transition>
        <Transition name="kwiker-sheet">
            <div v-if="isCommentSheetVisible" class="kwiker-sheet-backdrop" @click.self="closeComments">
                <section class="kwiker-sheet kwiker-comments-sheet">
                    <div class="kwiker-sheet-grabber"></div>
                    <header class="kwiker-sheet-header"><button type="button" class="kwiker-sheet-back"
                            aria-label="Retour" @click="closeComments">
                            <ArrowLeft :size="18" />
                        </button><strong>Réponses</strong><span class="kwiker-comments-count">{{ selectedPost?.comments
                            || 0
                            }}</span></header>
                    <div v-if="selectedPost" class="kwiker-comments-scroll">
                        <article class="kwiker-comment-original"><span
                                class="kwiker-avatar kwiker-avatar--comment-original"
                                :style="{ background: selectedPost.color }">{{ selectedPost.initials }}</span>
                            <div class="kwiker-comment-content">
                                <div class="kwiker-comment-author"><strong>{{ selectedPost.author }}</strong>
                                    <Check v-if="selectedPost.verified" class="kwiker-verified" :size="11" /><span>{{
                                        selectedPost.handle }}</span>
                                </div>
                                <p>{{ selectedPost.text || 'Image publiée sur Kwiker.' }}</p>
                            </div>
                        </article>
                        <div v-if="selectedPost.commentsList?.length" class="kwiker-comments-list">
                            <article v-for="comment in selectedPost.commentsList" :key="comment.id"
                                class="kwiker-comment"><span class="kwiker-avatar kwiker-avatar--tiny"
                                    :style="{ background: comment.color }">{{
                                    comment.initials }}</span>
                                <div class="kwiker-comment-content">
                                    <div class="kwiker-comment-author"><strong>{{ comment.author }}</strong><span>{{
                                            comment.handle }}</span><time v-if="comment.time">{{
                                            relativeTime(comment.time)
                                            }}</time></div>
                                    <p>{{ comment.text }}</p>
                                </div>
                            </article>
                        </div>
                        <div v-else class="kwiker-no-comments">
                            <MessageCircle :size="24" /><strong>Aucune réponse pour le moment</strong><span>Sois le
                                premier à
                                répondre à ce Kwik.</span>
                        </div>
                    </div>
                    <form class="kwiker-comment-form" @submit.prevent="addComment"><span
                            class="kwiker-avatar kwiker-avatar--tiny" :style="{ background: currentUser.color }">{{
                            currentUser.initials }}</span>
                        <div class="kwiker-comment-input-wrap"><textarea v-model="commentDraft" rows="1" maxlength="280"
                                placeholder="Répondre à ce Kwik"
                                @keydown.enter.exact.prevent="addComment"></textarea><span>{{
                                commentDraft.length }}/280</span></div><button type="submit" aria-label="Envoyer"
                            :disabled="!commentDraft.trim()">
                            <Send :size="17" />
                        </button>
                    </form>
                </section>
            </div>
        </Transition>
        <Transition name="kwiker-toast">
            <div v-if="actionNotice" class="kwiker-toast" role="status">{{ actionNotice }}</div>
        </Transition>
    </div>
</template>

<style scoped lang="scss">
.kwiker-app {
    --kwiker-blue: #1d9bf0;
    --kwiker-bg: #000;
    --kwiker-panel: #16181c;
    --kwiker-line: rgba(255, 255, 255, .1);
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
    padding: 8.65cqh 0 4cqh;
    border-radius: inherit;
    color: #fff;
    background: var(--kwiker-bg);
    font-family: inherit;
}

.kwiker-header,
.kwiker-header-actions,
.kwiker-brand,
.kwiker-post-header,
.kwiker-post-author,
.kwiker-post-actions,
.kwiker-page-header,
.kwiker-sheet-header,
.kwiker-profile-meta,
.kwiker-profile-stats,
.kwiker-comment-form {
    display: flex;
    align-items: center;
}

.kwiker-header {
    justify-content: space-between;
    flex-shrink: 0;
    height: 8cqh;
    padding: 0 4cqw;
    border-bottom: 1px solid var(--kwiker-line);
}

.kwiker-brand {
    gap: 1.5cqw;
}

.kwiker-brand strong {
    font-size: 2.1cqh;
    letter-spacing: -.03cqw;
}

.kwiker-brand-mark {
    display: grid;
    width: 4.1cqh;
    height: 4.1cqh;
    place-items: center;
    border-radius: 1.2cqh;
    color: #fff;
    background: var(--kwiker-blue);
    font-family: Arial, sans-serif;
    font-size: 3.1cqh;
    font-weight: 800;
    transform: rotate(-8deg);
}

.kwiker-header-actions {
    gap: 1cqw;
}

.kwiker-icon-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 4.8cqh;
    height: 4.8cqh;
    border: 0;
    border-radius: 50%;
    color: rgba(255, 255, 255, .78);
    background: transparent;
    cursor: pointer;
}

.kwiker-icon-button:hover {
    color: #fff;
    background: rgba(255, 255, 255, .1);
}

.kwiker-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    width: 6.5cqh;
    height: 6.5cqh;
    border-radius: 50%;
    color: #fff;
    font-size: 1.55cqh;
    font-weight: 700;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .18);
}

.kwiker-avatar--tiny {
    width: 4.4cqh;
    height: 4.4cqh;
    font-size: 1.15cqh;
}

.kwiker-avatar--profile {
    width: 14cqh;
    height: 14cqh;
    border: .6cqh solid #000;
    font-size: 3.4cqh;
}

.kwiker-search {
    display: flex;
    align-items: center;
    gap: 1.5cqw;
    flex-shrink: 0;
    height: 5.2cqh;
    margin: 1.2cqh 4cqw 0;
    padding: 0 1.8cqw;
    border-radius: 1.5cqh;
    color: rgba(255, 255, 255, .5);
    background: var(--kwiker-panel);
}

.kwiker-search input {
    min-width: 0;
    flex: 1;
    border: 0;
    outline: 0;
    color: #fff;
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
    cursor: pointer;
}

.kwiker-feed {
    min-height: 0;
    flex: 1;
    overflow-y: auto;
    padding-bottom: 11cqh;
    scrollbar-width: none;
}

.kwiker-feed::-webkit-scrollbar,
.kwiker-page-scroll::-webkit-scrollbar,
.kwiker-comments-scroll::-webkit-scrollbar {
    display: none;
}

.kwiker-feed-tabs {
    position: sticky;
    z-index: 2;
    top: 0;
    display: flex;
    gap: 3cqw;
    height: 6.8cqh;
    box-sizing: border-box;
    padding: 0 4cqw;
    overflow-x: auto;
    border-bottom: 1px solid var(--kwiker-line);
    background: rgba(0, 0, 0, .94);
    backdrop-filter: blur(14px);
    scrollbar-width: none;
}

.kwiker-feed-tabs::-webkit-scrollbar {
    display: none;
}

.kwiker-feed-tabs button,
.kwiker-profile-tabs button {
    position: relative;
    flex: 0 0 auto;
    border: 0;
    color: rgba(255, 255, 255, .48);
    background: transparent;
    font: inherit;
    font-size: 1.65cqh;
    cursor: pointer;
}

.kwiker-feed-tabs button {
    padding: 0 0 1cqh;
}

.kwiker-profile-tabs button {
    flex: 1;
}

.kwiker-feed-tabs button.is-active,
.kwiker-profile-tabs button.is-active {
    color: #fff;
    font-weight: 700;
}

.kwiker-feed-tabs button.is-active::after,
.kwiker-profile-tabs button.is-active::after {
    position: absolute;
    right: 0;
    bottom: -1px;
    left: 0;
    height: .35cqh;
    border-radius: 99px;
    content: '';
    background: var(--kwiker-blue);
}

.kwiker-profile-tabs button.is-active::after {
    right: 24%;
    left: 24%;
}

.kwiker-post {
    display: flex;
    gap: 2.5cqw;
    padding: 2cqh 4cqw;
    border-bottom: 1px solid var(--kwiker-line);
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
    flex: 0 0 auto;
    border: 0;
    padding: .5cqw;
    color: rgba(255, 255, 255, .35);
    background: transparent;
    cursor: pointer;
}

.kwiker-post-author {
    min-width: 0;
    gap: .8cqw;
    overflow: hidden;
    white-space: nowrap;
}

.kwiker-post-author strong {
    overflow: hidden;
    font-size: 1.72cqh;
    font-weight: 700;
    text-overflow: ellipsis;
}

.kwiker-post-author span,
.kwiker-post-author time {
    color: rgba(255, 255, 255, .4);
    font-size: 1.42cqh;
}

.kwiker-verified {
    flex-shrink: 0;
    padding: .2cqw;
    border-radius: 50%;
    color: #fff;
    background: var(--kwiker-blue);
}

.kwiker-post-text {
    margin: .8cqh 0 1.45cqh;
    color: rgba(255, 255, 255, .88);
    font-size: 1.78cqh;
    line-height: 1.38;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}

.kwiker-post-image {
    display: block;
    width: 100%;
    max-height: 25cqh;
    border-radius: 1.6cqh;
    object-fit: cover;
}

.kwiker-post-actions {
    justify-content: space-between;
    margin-top: 1.2cqh;
    color: rgba(255, 255, 255, .4);
}

.kwiker-post-actions button {
    display: flex;
    align-items: center;
    gap: .8cqw;
    min-width: 5cqw;
    border: 0;
    padding: .5cqh 0;
    color: inherit;
    background: transparent;
    font: inherit;
    font-size: 1.35cqh;
    cursor: pointer;
}

.kwiker-post-actions button:hover {
    color: #fff;
}

.kwiker-post-actions button.is-liked {
    color: #f91880;
}

.kwiker-post-actions button.is-reposted {
    color: #00ba7c;
}

.kwiker-post-actions button.is-active,
.kwiker-post-actions button.is-saved {
    color: var(--kwiker-blue);
}

.kwiker-poll {
    display: flex;
    flex-direction: column;
    gap: .8cqh;
    margin: 1.2cqh 0 1.5cqh;
}

.kwiker-poll-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 4.7cqh;
    border: 1px solid rgba(29, 155, 240, .6);
    border-radius: 1.2cqh;
    padding: 0 2cqw;
    color: rgba(255, 255, 255, .86);
    background: rgba(29, 155, 240, .08);
    font: inherit;
    font-size: 1.5cqh;
    text-align: left;
    cursor: pointer;
}

.kwiker-poll-option.is-selected,
.kwiker-poll-option:not(:disabled):hover {
    color: #fff;
    background: rgba(29, 155, 240, .25);
}

.kwiker-poll-option:disabled {
    cursor: default;
}

.kwiker-poll>small {
    color: rgba(255, 255, 255, .38);
    font-size: 1.25cqh;
}

.kwiker-empty {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 1cqh;
    padding: 10cqh 10cqw;
    color: rgba(255, 255, 255, .35);
    text-align: center;
}

.kwiker-empty strong {
    color: rgba(255, 255, 255, .82);
    font-size: 2cqh;
}

.kwiker-empty span {
    font-size: 1.45cqh;
    line-height: 1.45;
}

.kwiker-empty--profile {
    padding-top: 7cqh;
}

.kwiker-bottom-nav {
    position: absolute;
    z-index: 3;
    right: 3cqw;
    bottom: 1.5cqh;
    left: 3cqw;
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 11.5cqh;
    box-sizing: border-box;
    padding: 1cqh 1.2cqw;
    border: 1px solid rgba(255, 255, 255, .12);
    border-radius: 6cqh;
    background: rgba(51, 51, 51, .42);
    box-shadow: 0 1cqh 2.6cqh rgba(0, 0, 0, .24), inset 0 1px 0 rgba(255, 255, 255, .16);
    backdrop-filter: blur(14px);
}

.kwiker-nav-item {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: .65cqh;
    width: 20%;
    height: 90%;
    border-radius: 5.7cqh;
    border: 0;
    color: rgba(255, 255, 255, .42);
    background: transparent;
    font: inherit;
    transition: color .2s ease, background .2s ease, transform .2s ease;
    cursor: pointer;
}

.kwiker-nav-item span {
    font-size: 1.6cqh;
    font-weight: 500;
}

.kwiker-nav-item.is-active,
.kwiker-nav-item:hover {
    color: #4d8dff;
    background: rgba(77, 141, 255, .1);
}

.kwiker-nav-item:hover {
    transform: translateY(-1px);
}

.kwiker-page {
    position: absolute;
    z-index: 6;
    inset: 0;
    display: flex;
    flex-direction: column;
    padding-top: 8cqh;
    overflow: hidden;
    border-radius: inherit;
    background: var(--kwiker-bg);
}

.kwiker-page-header {
    justify-content: space-between;
    flex-shrink: 0;
    min-height: 6.5cqh;
    padding: 0 4cqw;
    border-bottom: 1px solid var(--kwiker-line);
}

.kwiker-page-header button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 4.8cqh;
    height: 4.8cqh;
    border: 0;
    border-radius: 50%;
    color: #fff;
    background: transparent;
    cursor: pointer;
}

.kwiker-page-header button:first-child {
    border: 1px solid rgba(255, 255, 255, .15);
    background: rgba(55, 55, 58, .85);
    box-shadow: 0 .5cqh 1.2cqh rgba(0, 0, 0, .35);
}

.kwiker-page-header button:hover {
    background: rgba(255, 255, 255, .1);
}

.kwiker-page-header button:first-child:hover {
    background: rgba(75, 75, 78, .9);
}

.kwiker-page-header strong {
    font-size: 2.15cqh;
}

.kwiker-header-spacer {
    width: 4.8cqh;
}

.kwiker-page-scroll {
    min-height: 0;
    overflow-y: auto;
    scrollbar-width: none;
}

.kwiker-simple-scroll {
    padding: 2.5cqh 4cqw 10cqh;
}

.kwiker-eyebrow {
    margin: 1cqh 1cqw 1.1cqh;
    color: rgba(255, 255, 255, .42);
    font-size: 1.42cqh;
    font-weight: 600;
}

.kwiker-profile-cover {
    height: 16cqh;
    background: linear-gradient(120deg, #142a4a, #293567 48%, #842e78);
}

.kwiker-profile-intro {
    position: relative;
    padding: 0 4cqw 2.5cqh;
}

.kwiker-profile-intro .kwiker-avatar--profile {
    margin-top: -7cqh;
}

.kwiker-edit-button {
    position: absolute;
    top: 1.6cqh;
    right: 4cqw;
    border: 1px solid rgba(255, 255, 255, .28);
    border-radius: 999px;
    padding: .8cqh 2.5cqw;
    color: #fff;
    background: transparent;
    font: inherit;
    font-size: 1.4cqh;
    font-weight: 600;
    cursor: pointer;
}

.kwiker-profile-intro h2 {
    margin: 1cqh 0 0;
    font-size: 3cqh;
}

.kwiker-profile-handle {
    display: block;
    margin-top: .35cqh;
    color: rgba(255, 255, 255, .42);
    font-size: 1.5cqh;
}

.kwiker-profile-labels {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 1cqw;
    margin-top: .8cqh;
}

.kwiker-profile-type {
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
    padding: .45cqh 1.3cqw;
    color: #54b7f7;
    background: rgba(29, 155, 240, .14);
    font-size: 1.2cqh;
    font-weight: 600;
}

.kwiker-profile-certified {
    display: inline-flex;
    align-items: center;
    gap: .7cqw;
    border: 1px solid rgba(29, 155, 240, .4);
    border-radius: 999px;
    padding: .4cqh 1.3cqw;
    color: #fff;
    background: rgba(29, 155, 240, .22);
    font-size: 1.2cqh;
    font-weight: 700;
}

.kwiker-profile-intro p {
    margin: 1.5cqh 0;
    color: rgba(255, 255, 255, .84);
    font-size: 1.7cqh;
    line-height: 1.35;
}

.kwiker-profile-meta {
    gap: 2.5cqw;
    color: rgba(255, 255, 255, .4);
    font-size: 1.35cqh;
}

.kwiker-profile-meta span {
    display: flex;
    align-items: center;
    gap: .7cqw;
}

.kwiker-profile-stats {
    gap: 3cqw;
    margin-top: 1.6cqh;
    color: rgba(255, 255, 255, .42);
    font-size: 1.45cqh;
}

.kwiker-profile-stats strong {
    color: #fff;
}

.kwiker-profile-tabs {
    display: flex;
    height: 6.5cqh;
    border-top: 1px solid var(--kwiker-line);
    border-bottom: 1px solid var(--kwiker-line);
}

.kwiker-post--profile {
    padding-top: 2cqh;
}

.kwiker-reply-context {
    margin: .8cqh 0 0;
    color: rgba(255, 255, 255, .4);
    font-size: 1.35cqh;
}

.kwiker-list-card {
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, .08);
    border-radius: 1.8cqh;
    background: rgba(38, 38, 40, .96);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, .035), 0 .7cqh 1.8cqh rgba(0, 0, 0, .16);
}

.kwiker-notification-row {
    display: flex;
    align-items: center;
    gap: 2.5cqw;
    min-height: 9cqh;
    padding: 1.2cqh 2.5cqw;
    border-bottom: 1px solid var(--kwiker-line);
}

.kwiker-notification-row:last-child {
    border-bottom: 0;
}

.kwiker-notification-row>span:nth-child(2),
.kwiker-settings-row>span:nth-child(2) {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: .4cqh;
    min-width: 0;
}

.kwiker-notification-row strong {
    font-size: 1.55cqh;
    line-height: 1.25;
}

.kwiker-notification-row small {
    color: rgba(255, 255, 255, .4);
    font-size: 1.3cqh;
}

.kwiker-notification-row>svg {
    color: var(--kwiker-blue);
}

.kwiker-community-list {
    display: flex;
    flex-direction: column;
    gap: 1.5cqh;
}

.kwiker-community-card {
    display: flex;
    align-items: center;
    gap: 2.5cqw;
    padding: 2cqh 2.5cqw;
    border: 1px solid rgba(255, 255, 255, .08);
    border-radius: 1.8cqh;
    background: var(--kwiker-panel);
}

.kwiker-community-mark {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    width: 6.2cqh;
    height: 6.2cqh;
    border-radius: 1.7cqh;
    color: #fff;
}

.kwiker-community-card>div {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: .4cqh;
    min-width: 0;
}

.kwiker-community-card strong {
    font-size: 1.75cqh;
}

.kwiker-community-card p {
    overflow: hidden;
    margin: 0;
    color: rgba(255, 255, 255, .52);
    font-size: 1.3cqh;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.kwiker-community-card small {
    color: rgba(255, 255, 255, .35);
    font-size: 1.2cqh;
}

.kwiker-community-card>button {
    flex: 0 0 auto;
    min-width: 14cqw;
    border: 1px solid rgba(29, 155, 240, .75);
    border-radius: 999px;
    padding: .75cqh 1.6cqw;
    color: var(--kwiker-blue);
    background: transparent;
    font: inherit;
    font-size: 1.28cqh;
    font-weight: 600;
    cursor: pointer;
}

.kwiker-community-card>button.is-joined {
    border-color: rgba(255, 255, 255, .18);
    color: rgba(255, 255, 255, .6);
    background: rgba(255, 255, 255, .08);
}

.kwiker-settings-row {
    display: flex;
    align-items: center;
    gap: 2.5cqw;
    width: 100%;
    min-height: 8.5cqh;
    box-sizing: border-box;
    border: 0;
    border-bottom: 1px solid var(--kwiker-line);
    padding: 1.2cqh 2.5cqw;
    color: #fff;
    background: transparent;
    font: inherit;
    text-align: left;
    transition: background .2s ease, color .2s ease;
    cursor: pointer;
}

.kwiker-settings-row:last-child {
    border-bottom: 0;
}

.kwiker-settings-row:hover {
    background: rgba(255, 255, 255, .07);
}

.kwiker-settings-row:active {
    background: rgba(77, 141, 255, .12);
}

.kwiker-settings-row strong {
    font-size: 1.62cqh;
}

.kwiker-settings-row small {
    color: rgba(255, 255, 255, .43);
    font-size: 1.3cqh;
}

.kwiker-settings-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    width: 4.7cqh;
    height: 4.7cqh;
    border-radius: 1.3cqh;
}

.kwiker-settings-icon--blue {
    color: #54b7f7;
    background: rgba(29, 155, 240, .2);
}

.kwiker-settings-icon--purple {
    color: #aa98ff;
    background: rgba(124, 92, 255, .2);
}

.kwiker-settings-icon--orange {
    color: #ffb66f;
    background: rgba(255, 157, 61, .18);
}

.kwiker-settings-icon--green {
    color: #4bd5a7;
    background: rgba(0, 186, 124, .18);
}

.kwiker-chevron {
    color: rgba(255, 255, 255, .32);
    font-size: 3cqh;
}

.kwiker-setting-state {
    flex: 0 0 auto;
    min-width: 17cqw;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, .1);
    padding: .65cqh 1.5cqw;
    color: rgba(255, 255, 255, .5);
    background: rgba(255, 255, 255, .08);
    font-size: 1.2cqh;
    font-weight: 600;
    text-align: center;
}

.kwiker-setting-state.is-enabled {
    color: #63d6aa;
    background: rgba(0, 186, 124, .14);
}

.kwiker-menu-sheet {
    padding-bottom: 3cqh;
}

.kwiker-menu-sheet .kwiker-sheet-header {
    padding-bottom: 1cqh;
    border-bottom: 1px solid var(--kwiker-line);
}

.kwiker-menu-action {
    display: flex;
    align-items: center;
    gap: 2.5cqw;
    width: 100%;
    min-height: 7cqh;
    border: 0;
    border-bottom: 1px solid var(--kwiker-line);
    color: rgba(255, 255, 255, .85);
    background: transparent;
    font: inherit;
    font-size: 1.65cqh;
    text-align: left;
    cursor: pointer;
}

.kwiker-menu-action:last-child {
    border-bottom: 0;
}

.kwiker-menu-action:hover {
    background: rgba(255, 255, 255, .05);
}

.kwiker-menu-action.is-danger {
    color: #ff453a;
}

.kwiker-sheet-backdrop {
    position: absolute;
    z-index: 12;
    inset: 0;
    display: flex;
    align-items: flex-end;
    border-radius: inherit;
    background: rgba(0, 0, 0, .62);
    overflow: hidden;
}

.kwiker-sheet {
    width: 100%;
    max-height: 82cqh;
    box-sizing: border-box;
    overflow-y: auto;
    border-radius: 2.8cqh 2.8cqh 0 0;
    padding: 1cqh 4cqw 4cqh;
    color: #fff;
    background: #1c1c1e;
    box-shadow: 0 -1cqh 4cqh rgba(0, 0, 0, .35);
}

.kwiker-sheet-grabber {
    width: 9cqw;
    height: .5cqh;
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
    min-width: 4.8cqh;
    min-height: 4.8cqh;
    border: 0;
    border-radius: 50%;
    color: rgba(255, 255, 255, .72);
    background: transparent;
    font: inherit;
    cursor: pointer;
}

.kwiker-sheet-header button:hover {
    background: rgba(255, 255, 255, .08);
}

.kwiker-sheet-header strong {
    font-size: 1.8cqh;
}

.kwiker-sheet-cancel {
    min-width: 16cqw !important;
    color: rgba(255, 255, 255, .78) !important;
}

.kwiker-sheet-back {
    border: 1px solid rgba(255, 255, 255, .15) !important;
    background: rgba(55, 55, 58, .85) !important;
    box-shadow: 0 .5cqh 1.2cqh rgba(0, 0, 0, .35);
}

.kwiker-sheet-submit {
    min-width: 16cqw !important;
    color: var(--kwiker-blue) !important;
    font-weight: 700;
}

.kwiker-sheet-cancel,
.kwiker-sheet-submit {
    min-height: 4.6cqh;
    box-sizing: border-box;
    border: 1px solid rgba(255, 255, 255, .14) !important;
    border-radius: 1.5cqh !important;
    padding: 0 2.2cqw;
    background: rgba(255, 255, 255, .07) !important;
    font: inherit;
    font-size: 1.45cqh !important;
    transition: color .2s ease, background .2s ease, border-color .2s ease, transform .2s ease, filter .2s ease;
}

.kwiker-sheet-submit {
    border-color: rgba(29, 155, 240, .42) !important;
    background: rgba(29, 155, 240, .16) !important;
}

.kwiker-sheet-cancel:hover,
.kwiker-sheet-submit:hover {
    color: #fff !important;
    border-color: rgba(255, 255, 255, .28) !important;
    background: rgba(255, 255, 255, .14) !important;
    filter: brightness(1.08);
    transform: translateY(-1px);
}

.kwiker-sheet-submit:hover {
    border-color: rgba(29, 155, 240, .72) !important;
    background: rgba(29, 155, 240, .3) !important;
}

.kwiker-sheet-content {
    padding-top: 1.8cqh;
}

.kwiker-form-notice {
    margin: 1.5cqh 0 0 9cqw;
    color: #ff453a;
    font-size: 1.4cqh;
}

.kwiker-account-preview {
    display: flex;
    align-items: center;
    gap: 2.5cqw;
    padding: 1cqh 0 1.5cqh;
}

.kwiker-account-preview>span:last-child {
    display: flex;
    flex-direction: column;
    gap: .4cqh;
}

.kwiker-account-preview strong {
    font-size: 1.9cqh;
}

.kwiker-account-preview small {
    color: rgba(255, 255, 255, .42);
    font-size: 1.4cqh;
}

.kwiker-field {
    display: flex;
    flex-direction: column;
    gap: .7cqh;
    margin-top: 1.7cqh;
    color: rgba(255, 255, 255, .52);
    font-size: 1.45cqh;
}

.kwiker-field input,
.kwiker-field textarea {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid rgba(255, 255, 255, .12);
    border-radius: 1.3cqh;
    padding: 1.3cqh 1.7cqw;
    outline: 0;
    color: #fff;
    background: rgba(118, 118, 128, .16);
    font: inherit;
    font-size: 1.75cqh;
}

.kwiker-field textarea {
    min-height: 9cqh;
    resize: vertical;
    line-height: 1.35;
}

.kwiker-field input:focus,
.kwiker-field textarea:focus,
.kwiker-comment-form input:focus {
    border-color: var(--kwiker-blue);
}

.kwiker-toast {
    position: absolute;
    z-index: 30;
    right: 50%;
    bottom: 11cqh;
    max-width: 82%;
    border-radius: 999px;
    padding: 1.1cqh 2.5cqw;
    color: #fff;
    background: rgba(40, 40, 42, .96);
    box-shadow: 0 .7cqh 2cqh rgba(0, 0, 0, .35);
    font-size: 1.4cqh;
    text-align: center;
    transform: translateX(50%);
}

.kwiker-app button:focus-visible,
.kwiker-app input:focus-visible,
.kwiker-app textarea:focus-visible {
    outline: 2px solid rgba(29, 155, 240, .9);
    outline-offset: 2px;
}

.kwiker-avatar-button {
    display: flex;
    flex: 0 0 auto;
    border: 0;
    border-radius: 50%;
    padding: 0;
    background: transparent;
    cursor: pointer;
}

.kwiker-avatar-button:hover {
    filter: brightness(1.15);
}

.kwiker-post-author-button {
    flex: 1 !important;
    min-width: 0;
    justify-content: flex-start;
    overflow: hidden;
    padding: .5cqw 0 !important;
    color: inherit !important;
    font: inherit;
    text-align: left;
}

.kwiker-post-author-button:hover {
    color: #fff !important;
}

.kwiker-feed-tabs button,
.kwiker-profile-tabs button {
    font-size: 1.85cqh;
}

.kwiker-nav-item span {
    font-size: 1.3cqh;
}

.kwiker-profile-intro h2 {
    font-size: 3.3cqh;
}

.kwiker-profile-handle {
    font-size: 1.7cqh;
}

.kwiker-profile-intro p {
    font-size: 1.85cqh;
}

.kwiker-profile-meta {
    font-size: 1.5cqh;
}

.kwiker-profile-stats {
    font-size: 1.55cqh;
}

.kwiker-profile-type,
.kwiker-profile-certified {
    font-size: 1.3cqh;
}

.kwiker-profile-intro .kwiker-avatar--profile {
    width: 10cqh;
    height: 10cqh;
    margin-top: -5cqh;
    font-size: 2.5cqh;
}

.kwiker-account-preview .kwiker-avatar--profile {
    width: 7cqh;
    height: 7cqh;
    border-width: .35cqh;
    font-size: 1.8cqh;
}

.kwiker-account-sheet {
    min-height: 48cqh;
}

.kwiker-simple-scroll .kwiker-list-card {
    border-color: rgba(255, 255, 255, .08);
    border-radius: 1.8cqh;
    background: rgba(38, 38, 40, .96);
}

.kwiker-settings-row {
    min-height: 7.2cqh;
    padding: 0 2cqw;
}

.kwiker-settings-row+.kwiker-settings-row {
    border-top: 1px solid rgba(255, 255, 255, .08);
}

.kwiker-settings-icon {
    width: 4.4cqh;
    height: 4.4cqh;
    border-radius: 1cqh;
}

.kwiker-settings-row strong {
    font-size: 1.75cqh;
}

.kwiker-settings-row small {
    font-size: 1.4cqh;
}

.kwiker-setting-state {
    min-width: auto;
    padding: .55cqh 1.4cqw;
    color: rgba(255, 255, 255, .5);
    background: rgba(255, 255, 255, .07);
    font-size: 1.45cqh;
}

.kwiker-setting-state.is-enabled {
    color: #30d158;
    background: rgba(48, 209, 88, .12);
}

.kwiker-comments-sheet {
    height: 74cqh;
}

.kwiker-comment-form {
    align-items: flex-start;
    margin-bottom: 1.4cqh;
    padding-top: 1.8cqh;
}

.kwiker-comment-input-wrap {
    min-height: 6.3cqh;
    box-sizing: border-box;
    border-color: rgba(255, 255, 255, .16);
}

.kwiker-comment-input-wrap:focus-within {
    border-color: rgba(255, 255, 255, .32);
    background: rgba(118, 118, 128, .2);
    box-shadow: none;
}

.kwiker-comment-input-wrap textarea:focus-visible {
    outline: 0;
}

.kwiker-comment-input-wrap textarea {
    min-height: 3.9cqh;
    padding-top: .25cqh;
}

.kwiker-nav-compose {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    align-self: center;
    width: 5.8cqh;
    height: 5.8cqh;
    margin: 0 1.2cqw;
    border: 1px solid rgba(255, 255, 255, .2);
    border-radius: 50%;
    color: #fff;
    background: var(--kwiker-blue);
    box-shadow: 0 .5cqh 1.5cqh rgba(29, 155, 240, .35);
    transition: filter .2s ease, transform .2s ease, box-shadow .2s ease;
    cursor: pointer;
}

.kwiker-nav-compose:hover {
    filter: brightness(1.12);
    transform: translateY(-1px) scale(1.03);
    box-shadow: 0 .7cqh 1.8cqh rgba(29, 155, 240, .45);
}

/* Version iOS simplifiée : contenu en cartes et barre identique aux apps natives. */
.kwiker-app {
    padding-bottom: 0;
    background: #0a0a0a;
}

.kwiker-feed {
    padding-bottom: 1cqh;
}

.kwiker-feed-tabs {
    gap: 1cqw;
    height: 7.4cqh;
    padding: .8cqh 4cqw;
    border-bottom-color: rgba(255, 255, 255, .08);
    background: rgba(10, 10, 10, .94);
}

.kwiker-feed-tabs button {
    min-width: 25cqw;
    border-radius: 1.4cqh;
    padding: 0 2.2cqw;
    font-size: 1.65cqh;
    transition: color .2s ease, background .2s ease;
}

.kwiker-feed-tabs button.is-active,
.kwiker-feed-tabs button:hover {
    color: #fff;
    background: rgba(255, 255, 255, .09);
}

.kwiker-feed-tabs button.is-active::after {
    right: 20%;
    bottom: .25cqh;
    left: 20%;
    height: .3cqh;
}

.kwiker-post {
    margin: 1.2cqh 3cqw;
    padding: 1.8cqh 2.8cqw;
    border: 1px solid rgba(255, 255, 255, .08);
    border-radius: 1.8cqh;
    background: #1c1c1e;
    box-shadow: 0 .7cqh 1.8cqh rgba(0, 0, 0, .16), inset 0 1px 0 rgba(255, 255, 255, .025);
}

.kwiker-post-text {
    color: rgba(255, 255, 255, .92);
}

.kwiker-post-actions button {
    min-height: 3.8cqh;
    border-radius: 1.2cqh;
    padding: .5cqh 1cqw;
    transition: color .2s ease, background .2s ease;
}

.kwiker-post-actions button:hover {
    background: rgba(255, 255, 255, .08);
}

.kwiker-bottom-nav {
    position: relative;
    right: auto;
    bottom: auto;
    left: auto;
    display: flex;
    justify-content: center;
    width: 100%;
    min-height: 18%;
    height: auto;
    flex-shrink: 0;
    padding: 0;
    border: 0;
    border-radius: 6cqh;
    background: transparent;
    box-shadow: none;
    backdrop-filter: none;
}

.kwiker-bottom-nav .categories {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 90%;
    height: 68%;
    border-radius: 6cqh;
    background: rgba(51, 51, 51, .3);
    box-shadow: 0 10px 26px rgba(0, 0, 0, .2), inset 0 1px 0 rgba(255, 255, 255, .85), inset 0 -6px 10px -6px rgba(0, 0, 0, .15);
}

.kwiker-bottom-nav .categorie {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 0 1 30%;
    flex-direction: column;
    gap: .75cqh;
    width: auto;
    height: 90%;
    min-width: 0;
    border: 0;
    border-radius: 5.7cqh;
    color: rgba(255, 255, 255, .8);
    background: transparent;
    font-family: "SF Pro Display";
    font-size: 1.6cqh;
    font-weight: 500;
    transition: color .2s ease, background .2s ease, transform .2s ease;
    cursor: pointer;
}

.kwiker-bottom-nav .categorie span {
    font-size: inherit;
}

.kwiker-bottom-nav .categorie.categorie-selected,
.kwiker-bottom-nav .categorie.categorie-compose {
    color: #4d8dff;
}

.kwiker-bottom-nav .categorie:hover {
    background: rgba(77, 141, 255, .08);
    cursor: pointer;
    transform: translateY(-1px);
}

.kwiker-bottom-nav .categorie-compose-icon {
    display: contents;
}

.kwiker-bottom-nav {
    transform: translateY(-1.3cqh);
}

/* Profils et réglages personnels : cartes iOS plus claires et mieux hiérarchisées. */
.kwiker-profile-cover {
    height: 13cqh;
    background: linear-gradient(135deg, #182b4b 0%, #314d86 52%, #633a78 100%);
}

.kwiker-profile-intro {
    margin: 0 3cqw;
    padding: 0 2.8cqw 2.8cqh;
    border: 1px solid rgba(255, 255, 255, .08);
    border-radius: 2.2cqh;
    background: #1c1c1e;
    box-shadow: 0 .8cqh 2cqh rgba(0, 0, 0, .18);
}

.kwiker-profile-intro .kwiker-avatar--profile {
    margin-top: -5cqh;
    border: .7cqh solid #1c1c1e;
    box-shadow: 0 .5cqh 1.4cqh rgba(0, 0, 0, .24), inset 0 0 0 1px rgba(255, 255, 255, .16);
}

.kwiker-profile-actions {
    top: 1.5cqh;
    right: 2.8cqw;
}

.kwiker-edit-button,
.kwiker-follow-button {
    min-height: 4.7cqh;
    box-sizing: border-box;
    border-radius: 1.5cqh;
    padding: .7cqh 2.4cqw;
    font-size: 1.45cqh;
    transition: color .2s ease, background .2s ease, border-color .2s ease, transform .2s ease;
}

.kwiker-edit-button {
    border-color: rgba(255, 255, 255, .2);
    background: rgba(255, 255, 255, .08);
}

.kwiker-edit-button:hover,
.kwiker-follow-button:hover {
    background: rgba(255, 255, 255, .16);
    transform: translateY(-1px);
}

.kwiker-profile-intro h2 {
    margin-top: 1.6cqh;
    font-size: 2.8cqh;
}

.kwiker-profile-intro p {
    margin: 1.8cqh 0;
    color: rgba(255, 255, 255, .78);
}

.kwiker-profile-tabs {
    height: 6.2cqh;
    margin: 1.5cqh 3cqw 0;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, .08);
    border-radius: 1.6cqh;
    background: #1c1c1e;
}

.kwiker-profile-tabs button {
    transition: color .2s ease, background .2s ease;
}

.kwiker-profile-tabs button.is-active,
.kwiker-profile-tabs button:hover {
    background: rgba(77, 141, 255, .1);
}

.kwiker-simple-scroll {
    padding-right: 3cqw;
    padding-left: 3cqw;
}

.kwiker-eyebrow {
    margin-right: 1cqw;
    margin-left: 1cqw;
    color: rgba(255, 255, 255, .52);
    font-size: 1.3cqh;
    letter-spacing: .06cqw;
    text-transform: uppercase;
}

.kwiker-settings-row {
    min-height: 8.2cqh;
    padding: 1cqh 2.4cqw;
}

.kwiker-settings-row strong {
    font-size: 1.65cqh;
}

.kwiker-settings-row small {
    font-size: 1.3cqh;
    line-height: 1.25;
}

.kwiker-settings-icon {
    width: 4.8cqh;
    height: 4.8cqh;
    border-radius: 1.35cqh;
}

.kwiker-setting-state {
    border: 1px solid rgba(255, 255, 255, .1);
    border-radius: 999px;
    padding: .55cqh 1.4cqw;
}

.kwiker-sheet {
    border: 1px solid rgba(255, 255, 255, .1);
    border-bottom: 0;
    border-radius: 3cqh 3cqh 0 0;
    padding: 1cqh 3.5cqw 3.5cqh;
    background: #1c1c1e;
}

.kwiker-sheet-header {
    min-height: 6.6cqh;
    border-bottom: 1px solid rgba(255, 255, 255, .08);
}

.kwiker-sheet-header strong {
    font-size: 1.85cqh;
}

.kwiker-composer-content {
    gap: 2.8cqw;
    padding-top: 2.2cqh;
}

.kwiker-draft-area textarea {
    min-height: 14cqh;
    box-sizing: border-box;
    border: 1px solid rgba(255, 255, 255, .1);
    border-radius: 1.7cqh;
    padding: 1.5cqh 1.8cqw;
    background: #2c2c2e;
}

.kwiker-draft-footer {
    margin-top: 1.2cqh;
    padding-top: 1.2cqh;
    border-top: 1px solid rgba(255, 255, 255, .08);
}

.kwiker-draft-footer button {
    width: 4.5cqh;
    height: 4.5cqh;
    align-items: center;
    justify-content: center;
    border-radius: 1.3cqh;
    background: rgba(77, 141, 255, .12);
    transition: background .2s ease, transform .2s ease;
}

.kwiker-draft-footer button:hover {
    background: rgba(77, 141, 255, .24);
    transform: translateY(-1px);
}

.kwiker-account-preview {
    margin-bottom: 1.2cqh;
    padding: 1.4cqh 1.8cqw;
    border: 1px solid rgba(255, 255, 255, .08);
    border-radius: 1.7cqh;
    background: #2c2c2e;
}

.kwiker-field {
    gap: .8cqh;
    margin-top: 1.5cqh;
    color: rgba(255, 255, 255, .62);
    font-size: 1.35cqh;
    font-weight: 600;
}

.kwiker-field input,
.kwiker-field textarea {
    min-height: 5.6cqh;
    border-color: rgba(255, 255, 255, .1);
    border-radius: 1.45cqh;
    padding: 1.3cqh 1.8cqw;
    background: #2c2c2e;
}

.kwiker-field textarea {
    min-height: 10cqh;
}

.kwiker-form-notice {
    margin-left: 0;
    padding: 1cqh 1.4cqw;
    border-radius: 1.2cqh;
    background: rgba(255, 69, 58, .1);
}

.kwiker-profile-actions {
    position: absolute;
    top: 1.6cqh;
    right: 4cqw;
}

.kwiker-profile-actions .kwiker-edit-button {
    position: static;
}

.kwiker-follow-button {
    min-width: 14cqw;
    border: 1px solid rgba(29, 155, 240, .75);
    border-radius: 999px;
    padding: .8cqh 2.5cqw;
    color: #fff;
    background: var(--kwiker-blue);
    font: inherit;
    font-size: 1.4cqh;
    font-weight: 700;
    cursor: pointer;
}

.kwiker-follow-button.is-following {
    border-color: rgba(255, 255, 255, .28);
    color: rgba(255, 255, 255, .8);
    background: transparent;
}

.kwiker-profile-verified {
    display: inline-flex;
    margin-left: 1cqw;
    padding: .3cqw;
    border-radius: 50%;
    color: #fff;
    background: var(--kwiker-blue);
    vertical-align: middle;
}

.kwiker-profile-type {
    display: inline-block;
    margin-top: .8cqh;
    border-radius: 999px;
    padding: .45cqh 1.3cqw;
    color: #54b7f7;
    background: rgba(29, 155, 240, .14);
    font-size: 1.2cqh;
}

.kwiker-composer-sheet {
    min-height: 35cqh;
}

.kwiker-composer-content {
    display: flex;
    gap: 2.5cqw;
}

.kwiker-draft-area {
    min-width: 0;
    flex: 1;
}

.kwiker-draft-area textarea {
    display: block;
    width: 100%;
    min-height: 15cqh;
    box-sizing: border-box;
    resize: vertical;
    border: 0;
    outline: 0;
    padding: 0;
    color: #fff;
    background: transparent;
    font: inherit;
    font-size: 2cqh;
    line-height: 1.4;
}

.kwiker-draft-area textarea::placeholder {
    color: rgba(255, 255, 255, .42);
}

.kwiker-draft-image {
    display: block;
    width: 100%;
    max-height: 25cqh;
    border-radius: 1.6cqh;
    object-fit: cover;
}

.kwiker-draft-footer {
    display: flex;
    align-items: center;
    gap: 2.5cqw;
    margin-top: 1cqh;
    padding-top: 1.4cqh;
    border-top: 1px solid var(--kwiker-line);
}

.kwiker-draft-footer button {
    display: flex;
    border: 0;
    padding: 0;
    color: var(--kwiker-blue);
    background: transparent;
    cursor: pointer;
}

.kwiker-draft-footer span {
    margin-left: auto;
    color: rgba(255, 255, 255, .42);
    font-size: 1.25cqh;
}

.kwiker-hidden-input {
    display: none;
}

.kwiker-post>.kwiker-avatar-button .kwiker-avatar,
.kwiker-post>.kwiker-avatar {
    width: 5.4cqh;
    height: 5.4cqh;
    font-size: 1.3cqh;
}

.kwiker-avatar--comment-original {
    width: 5.8cqh;
    height: 5.8cqh;
}

.kwiker-comments-sheet {
    display: flex;
    flex-direction: column;
    height: 72cqh;
    max-height: 82cqh;
    padding-bottom: 1.5cqh;
}

.kwiker-comments-count {
    min-width: 4.8cqh;
    color: rgba(255, 255, 255, .42);
    font-size: 1.35cqh;
    text-align: right;
}

.kwiker-comments-scroll {
    min-height: 0;
    flex: 1;
    overflow-y: auto;
    padding: 1.2cqh 0 1cqh;
    scrollbar-width: none;
}

.kwiker-comment-original,
.kwiker-comment {
    display: flex;
    align-items: flex-start;
    gap: 2.5cqw;
}

.kwiker-comment-original {
    padding: 1.3cqh 0 2cqh;
    border-bottom: 1px solid var(--kwiker-line);
}

.kwiker-comment {
    padding: 1.6cqh 0;
}

.kwiker-comment+.kwiker-comment {
    border-top: 1px solid rgba(255, 255, 255, .06);
}

.kwiker-comment-content {
    min-width: 0;
    flex: 1;
}

.kwiker-comment-author {
    display: flex;
    align-items: center;
    gap: .8cqw;
    min-width: 0;
}

.kwiker-comment-author strong {
    overflow: hidden;
    font-size: 1.55cqh;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.kwiker-comment-author span,
.kwiker-comment-author time {
    overflow: hidden;
    color: rgba(255, 255, 255, .4);
    font-size: 1.3cqh;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.kwiker-comment-content p {
    margin: .7cqh 0 0;
    color: rgba(255, 255, 255, .86);
    font-size: 1.55cqh;
    line-height: 1.38;
    overflow-wrap: anywhere;
}

.kwiker-comment-original .kwiker-comment-content p {
    font-size: 1.7cqh;
}

.kwiker-no-comments {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: .8cqh;
    height: 20cqh;
    color: rgba(255, 255, 255, .36);
    text-align: center;
}

.kwiker-no-comments strong {
    color: rgba(255, 255, 255, .72);
    font-size: 1.65cqh;
}

.kwiker-no-comments span {
    font-size: 1.35cqh;
}

.kwiker-comment-form {
    gap: 1.8cqw;
    flex-shrink: 0;
    padding-top: 1.4cqh;
    border-top: 1px solid var(--kwiker-line);
}

.kwiker-comment-input-wrap {
    display: flex;
    align-items: flex-end;
    flex: 1;
    gap: 1cqw;
    min-width: 0;
    border: 1px solid rgba(255, 255, 255, .14);
    border-radius: 1.8cqh;
    padding: 1cqh 1.5cqw 1cqh 1.8cqw;
    background: rgba(118, 118, 128, .16);
}

.kwiker-comment-input-wrap:focus-within {
    border-color: var(--kwiker-blue);
    background: rgba(118, 118, 128, .22);
}

.kwiker-comment-input-wrap textarea {
    min-width: 0;
    flex: 1;
    max-height: 8cqh;
    resize: none;
    border: 0;
    outline: 0;
    padding: 0;
    color: #fff;
    background: transparent;
    font: inherit;
    font-size: 1.55cqh;
    line-height: 1.35;
}

.kwiker-comment-input-wrap textarea::placeholder {
    color: rgba(255, 255, 255, .42);
}

.kwiker-comment-input-wrap span {
    flex: 0 0 auto;
    color: rgba(255, 255, 255, .35);
    font-size: 1.1cqh;
}

.kwiker-comment-form>button {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    width: 4.8cqh;
    height: 4.8cqh;
    border: 0;
    border-radius: 50%;
    color: #fff;
    background: var(--kwiker-blue);
    cursor: pointer;
}

.kwiker-comment-form>button:disabled {
    color: rgba(255, 255, 255, .3);
    background: rgba(255, 255, 255, .12);
    cursor: default;
}

/* Finitions des pages iOS et de la zone de réponse. */
.kwiker-search input,
.kwiker-search input:focus,
.kwiker-search input:focus-visible {
    outline: 0 !important;
    border: 0 !important;
    box-shadow: none !important;
}

.kwiker-search:focus-within {
    outline: 0;
    border-color: transparent;
    box-shadow: none;
}

.kwiker-field input:focus,
.kwiker-field textarea:focus,
.kwiker-field input:focus-visible,
.kwiker-field textarea:focus-visible {
    outline: 0 !important;
    border-color: rgba(255, 255, 255, .18) !important;
    box-shadow: none !important;
}

.kwiker-profile-cover {
    margin: 0 3cqw;
    overflow: hidden;
    border-top-left-radius: 2.2cqh;
    border-top-right-radius: 2.2cqh;
    background: linear-gradient(135deg, #182b4b 0%, #314d86 52%, #633a78 100%);
    box-shadow: none;
}

.kwiker-profile-intro {
    position: relative;
    z-index: 1;
    margin: -1.2cqh 3cqw 0;
    padding: 0 2.8cqw 2.8cqh;
    border: 1px solid rgba(255, 255, 255, .08);
    // border-radius: 2.2cqh;
    // border-bottom-left-radius: 2.2cqh;
    // border-bottom-right-radius: 2.2cqh;
    background: #1c1c1e;
    box-shadow: none;
}

.kwiker-profile-intro .kwiker-avatar--profile {
    margin-top: -5cqh;
    border: .7cqh solid #1c1c1e;
}

.kwiker-profile-actions {
    top: 1.5cqh;
    right: 2.8cqw;
}

.kwiker-edit-button,
.kwiker-follow-button {
    min-height: 4.7cqh;
    box-sizing: border-box;
    border-radius: 1.5cqh;
    padding: .7cqh 2.4cqw;
    font-size: 1.45cqh;
}

.kwiker-profile-intro h2 {
    margin-top: 1.6cqh;
    font-size: 2.8cqh;
    line-height: 1.15;
}

.kwiker-profile-intro p {
    margin: 1.8cqh 0;
    color: rgba(255, 255, 255, .8);
    line-height: 1.4;
}

.kwiker-profile-meta,
.kwiker-profile-stats {
    flex-wrap: wrap;
}

.kwiker-profile-tabs {
    height: 6.2cqh;
    margin: 1.5cqh 3cqw 0;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, .08);
    border-radius: 1.6cqh;
    background: #1c1c1e;
}

.kwiker-profile-tabs button.is-active,
.kwiker-profile-tabs button:hover {
    background: rgba(77, 141, 255, .1);
}

.kwiker-simple-scroll .kwiker-list-card {
    border-color: rgba(255, 255, 255, .1);
    border-radius: 1.8cqh;
    background: #1c1c1e;
    box-shadow: 0 .7cqh 1.8cqh rgba(0, 0, 0, .16), inset 0 1px 0 rgba(255, 255, 255, .025);
}

.kwiker-notification-row {
    min-height: 9.5cqh;
    gap: 2.2cqw;
    padding: 1.3cqh 2.4cqw;
    border-bottom-color: rgba(255, 255, 255, .08);
}

.kwiker-notification-row .kwiker-avatar--tiny {
    width: 5.2cqh;
    height: 5.2cqh;
    font-size: 1.3cqh;
}

.kwiker-notification-row strong {
    font-size: 1.5cqh;
    line-height: 1.25;
}

.kwiker-notification-row small {
    margin-top: .25cqh;
    color: rgba(255, 255, 255, .46);
    font-size: 1.25cqh;
}

.kwiker-notification-row > svg {
    flex: 0 0 auto;
    width: 2.1cqh;
    height: 2.1cqh;
    padding: .8cqh;
    border-radius: 50%;
    color: #fff;
    background: rgba(77, 141, 255, .18);
}

.kwiker-settings-row {
    min-height: 8.2cqh;
    gap: 2.2cqw;
    padding: 1cqh 2.4cqw;
}

.kwiker-settings-row strong {
    font-size: 1.65cqh;
    line-height: 1.2;
}

.kwiker-settings-row small {
    font-size: 1.3cqh;
    line-height: 1.25;
}

.kwiker-settings-icon {
    width: 4.8cqh;
    height: 4.8cqh;
    border-radius: 1.35cqh;
}

.kwiker-setting-state {
    border: 1px solid rgba(255, 255, 255, .12);
    border-radius: 999px;
    padding: .55cqh 1.35cqw;
    white-space: nowrap;
}

.kwiker-sheet-header {
    min-height: 6.6cqh;
}

.kwiker-field input,
.kwiker-field textarea,
.kwiker-draft-area textarea {
    border-color: rgba(255, 255, 255, .12);
    border-radius: 1.5cqh;
    background: #2c2c2e;
}

.kwiker-draft-area textarea {
    padding: 2.2cqh 2.2cqw;
    text-indent: 0;
}

.kwiker-draft-area textarea::placeholder {
    transform: translateY(.15cqh);
}

.kwiker-account-preview {
    margin-bottom: 1.2cqh;
    border-color: rgba(255, 255, 255, .1);
    border-radius: 1.7cqh;
    background: #2c2c2e;
}

.kwiker-form-notice {
    margin-left: 0;
    padding: 1cqh 1.4cqw;
    border-radius: 1.2cqh;
    background: rgba(255, 69, 58, .1);
}

.kwiker-comments-sheet {
    padding-bottom: 5.5cqh;
}

.kwiker-comments-scroll {
    padding-bottom: 1.8cqh;
}

.kwiker-comment-form {
    gap: 1.8cqw;
    margin-bottom: 0;
    padding-top: 1.8cqh;
}

.kwiker-comment-input-wrap {
    min-height: 6.3cqh;
    border-radius: 1.8cqh;
    background: rgba(118, 118, 128, .2);
}

.kwiker-comment-form > button {
    width: 5cqh;
    height: 5cqh;
}

.kwiker-page-enter-active,
.kwiker-page-leave-active,
.kwiker-sheet-enter-active,
.kwiker-sheet-leave-active,
.kwiker-toast-enter-active,
.kwiker-toast-leave-active {
    transition: opacity .2s ease, transform .25s cubic-bezier(.22, 1, .36, 1);
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

.kwiker-toast-enter-from,
.kwiker-toast-leave-to {
    opacity: 0;
    transform: translate(50%, 1cqh);
}
</style>
