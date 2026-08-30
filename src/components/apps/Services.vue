<script setup>
import { computed, ref } from 'vue';
import {
    ArrowLeft, BriefcaseBusiness, Building2, Check, ChevronRight, Clock3, HeartPulse, Inbox,
    MapPin, MessageCircle, Phone, PhoneCall, Reply, Search, Send, ShieldCheck, Users, X,
} from '@lucide/vue';
import { useServicesDirectory } from '../../composables/useServicesDirectory';

const props = defineProps({
    initialCompanies: { type: Array, default: () => [] },
    playerContext: { type: Object, default: null },
});
const emit = defineEmits(['call-contact']);
const {
    companies, employeeContext: bridgeEmployeeContext, inbox, sentMessages, incomingCalls,
    isLoading, lastError, isFiveM, sendServiceMessage, callServiceCompany,
} = useServicesDirectory(props.initialCompanies);

const activeView = ref('directory');
const messageTab = ref('personal');
const activeCategory = ref('Tous');
const searchQuery = ref('');
const selectedCompany = ref(null);
const isComposerVisible = ref(false);
const composeTarget = ref(null);
const messageDraft = ref('');
const messageNotice = ref('');
const isSending = ref(false);

const currentEmployee = computed(() => props.playerContext || bridgeEmployeeContext.value || {});
const isEmployee = computed(() => Boolean(currentEmployee.value?.isEmployee
    || currentEmployee.value?.companyId || currentEmployee.value?.businessId));
const employeeCompanyId = computed(() => currentEmployee.value?.companyId || currentEmployee.value?.businessId || '');
const employeeCompany = computed(() => companies.value.find((company) => company.id === employeeCompanyId.value)
    || currentEmployee.value?.company || null);
const categories = computed(() => ['Tous', ...new Set(companies.value.map(({ category }) => category))]);
const unreadCount = computed(() => inbox.value.filter((message) => message.unread !== false
    && (!employeeCompanyId.value || message.companyId === employeeCompanyId.value)).length);
const employeeMessages = computed(() => inbox.value
    .filter((message) => !employeeCompanyId.value || message.companyId === employeeCompanyId.value)
    .sort((a, b) => b.createdAt - a.createdAt));
const personalMessages = computed(() => [...sentMessages.value].sort((a, b) => b.createdAt - a.createdAt));

const visibleCompanies = computed(() => {
    const query = searchQuery.value.trim().toLowerCase();
    return companies.value.filter((company) => {
        const categoryMatch = activeCategory.value === 'Tous' || company.category === activeCategory.value;
        const searchable = company.name + ' ' + company.category + ' ' + company.phone + ' ' + company.address;
        return categoryMatch && (!query || searchable.toLowerCase().includes(query));
    });
});

const companyIcon = (category) => ({
    Police: ShieldCheck,
    'Médias': Building2,
    Media: Building2,
    Sante: HeartPulse,
    Santé: HeartPulse,
    Services: ShieldCheck,
    Automobile: Building2,
    Transport: PhoneCall,
    Restauration: Building2,
}[category] || Building2);

const formatPhone = (phone) => {
    if (!phone) return 'Numéro indisponible';
    const digits = String(phone).replace(/\D/g, '');
    return digits.length === 7 ? '555-' + digits : String(phone);
};

const openCompany = (company) => {
    selectedCompany.value = company;
    messageNotice.value = '';
};
const closeCompany = () => { selectedCompany.value = null; };

const openMessageComposer = (company, message = null) => {
    const targetCompany = company || employeeCompany.value;
    if (!targetCompany) return;
    composeTarget.value = { company: targetCompany, replyTo: message?.id || null };
    messageDraft.value = '';
    messageNotice.value = '';
    lastError.value = '';
    isComposerVisible.value = true;
    if (message) message.unread = false;
};

const closeMessageComposer = () => {
    if (!isSending.value) isComposerVisible.value = false;
};

const submitMessage = async () => {
    const text = messageDraft.value.trim();
    if (!text || !composeTarget.value) return;
    isSending.value = true;
    const target = composeTarget.value;
    const sent = await sendServiceMessage({
        companyId: target.company.id,
        company: target.company,
        text,
        replyTo: target.replyTo,
        senderName: currentEmployee.value?.name || 'Habitant',
        senderPhone: currentEmployee.value?.phone || '',
    });
    isSending.value = false;
    if (!sent) {
        messageNotice.value = lastError.value || 'Le message n’a pas pu être envoyé.';
        return;
    }
    messageDraft.value = '';
    messageNotice.value = 'Message envoyé';
    setTimeout(() => {
        isComposerVisible.value = false;
        messageNotice.value = '';
    }, 550);
};

const callCompany = async (company) => {
    const result = await callServiceCompany({ companyId: company.id, companyName: company.name, phone: company.phone });
    if (!result) return;
    emit('call-contact', {
        number: formatPhone(company.phone),
        contact: { firstName: company.name, lastName: '', phone: company.phone },
    });
};

const answerIncomingCall = (call) => {
    incomingCalls.value = incomingCalls.value.filter(({ id }) => id !== call.id);
    emit('call-contact', {
        number: formatPhone(call.callerPhone),
        contact: { firstName: call.callerName, lastName: '', phone: call.callerPhone },
    });
};
</script>

<template>
    <div class="services-app">
        <template v-if="!selectedCompany && activeView === 'directory'">
            <header class="services-header">
                <div>
                    <h1>Companies</h1>
                </div>
                <button v-if="isEmployee" type="button" class="services-inbox-button" aria-label="Boîte entreprise"
                    @click="activeView = 'messages'">
                    <Inbox :size="19" /><span v-if="unreadCount" class="services-badge">{{ unreadCount > 9 ? '9+' :
                        unreadCount }}</span>
                </button>
            </header>
            <div class="services-search">
                <Search :size="17" /><input v-model="searchQuery" type="search"
                    placeholder="Rechercher une entreprise, un service…" />
                <button v-if="searchQuery" type="button" aria-label="Effacer" @click="searchQuery = ''">
                    <X :size="15" />
                </button>
            </div>
            <div class="services-categories" role="tablist" aria-label="Catégories de services">
                <button v-for="category in categories" :key="category" type="button" role="tab"
                    :aria-selected="activeCategory === category"
                    :class="{ 'services-category--active': activeCategory === category }"
                    @click="activeCategory = category">{{ category }}</button>
            </div>
            <main class="services-scroll">
                <div class="services-intro"><span>
                        <Building2 :size="17" /> Entreprises disponibles
                    </span><small>{{ visibleCompanies.length }} résultat{{ visibleCompanies.length > 1 ? 's' : ''
                        }}</small></div>
                <div v-if="isLoading" class="services-empty"><span>Chargement de l’annuaire…</span></div>
                <template v-else>
                    <div v-for="company in visibleCompanies" :key="company.id" class="service-company-row">
                        <button type="button" class="service-company-main" @click="openCompany(company)">
                            <span class="service-company-icon" :style="{ background: company.color }">
                                <component :is="companyIcon(company.category)" :size="21" />
                            </span>
                            <span class="service-company-info"><strong>{{ company.name }}</strong><small>{{
                                company.category }} · {{ company.address }}</small><span
                                    class="service-company-status"><span></span>{{ company.hours }}</span></span>
                            <ChevronRight :size="17" class="service-company-chevron" />
                        </button>
                        <button type="button" class="service-company-call" aria-label="Appeler l’entreprise"
                            @click="callCompany(company)">
                            <Phone :size="17" />
                            <span>Appeler</span>
                        </button>
                        <button type="button" class="service-company-message" aria-label="Envoyer un message"
                            @click="openMessageComposer(company)">
                            <MessageCircle :size="17" />
                            <span>Message</span>
                        </button>
                    </div>
                    <div v-if="!visibleCompanies.length" class="services-empty">
                        <Search :size="29" /><strong>Aucun service trouvé</strong><span>Essaie un autre nom ou une autre
                            catégorie.</span>
                    </div>
                </template>
            </main>
        </template>

        <template v-else-if="!selectedCompany && activeView === 'messages'">
            <header class="services-header services-messages-header">
                <div><span class="services-eyebrow">Communication</span>
                    <h1>Messages</h1>
                </div>
                <span class="services-employee-avatar">
                    <MessageCircle :size="17" />
                </span>
            </header>
            <div class="services-message-tabs" role="tablist" aria-label="Type de messages">
                <button type="button" role="tab" :aria-selected="messageTab === 'personal'"
                    :class="{ 'services-message-tab--active': messageTab === 'personal' }"
                    @click="messageTab = 'personal'">Personal</button>
                <button type="button" role="tab" :aria-selected="messageTab === 'job'"
                    :class="{ 'services-message-tab--active': messageTab === 'job' }"
                    @click="messageTab = 'job'">Job<span v-if="unreadCount">{{ unreadCount }}</span></button>
            </div>
            <main class="services-scroll services-messages-scroll">
                <template v-if="messageTab === 'personal'">
                    <div v-if="personalMessages.length" class="services-message-list">
                        <button v-for="message in personalMessages" :key="message.id" type="button"
                            class="services-personal-message"
                            @click="companies.find((company) => company.id === message.companyId) && openCompany(companies.find((company) => company.id === message.companyId))">
                            <span class="services-message-avatar services-message-avatar--company">{{
                                message.companyName.slice(0, 1).toUpperCase() }}</span>
                            <span class="services-personal-message__content"><strong>{{ message.companyName
                                    }}</strong><span>{{ message.text }}</span></span>
                            <span class="services-personal-message__meta">{{ message.time }}
                                <ChevronRight :size="15" />
                            </span>
                        </button>
                    </div>
                    <div v-else class="services-empty services-messages-empty">
                        <MessageCircle :size="31" /><strong>Aucun message envoyé</strong><span>Les messages envoyés aux
                            entreprises apparaîtront ici.</span>
                    </div>
                </template>
                <template v-else>
                    <div v-if="!isEmployee" class="services-empty services-messages-empty">
                        <BriefcaseBusiness :size="31" /><strong>Espace entreprise</strong><span>Cette boîte est réservée
                            aux employés d’une entreprise.</span>
                    </div>
                    <div v-else-if="employeeMessages.length" class="services-message-list">
                        <article v-for="message in employeeMessages" :key="message.id" class="services-message-card"
                            :class="{ 'services-message-card--unread': message.unread }">
                            <div class="services-message-top"><span class="services-message-avatar">{{
                                message.senderName.slice(0, 1).toUpperCase() }}</span><span><strong>{{
                                        message.senderName }}</strong><small>{{ message.time }}</small></span><span
                                    v-if="message.unread" class="services-unread-dot"></span></div>
                            <p>{{ message.text }}</p>
                            <div class="services-message-actions"><span v-if="message.senderPhone">
                                    <Phone :size="14" /> {{ formatPhone(message.senderPhone) }}
                                </span><button type="button" @click="openMessageComposer(employeeCompany, message)">
                                    <Reply :size="14" /> Répondre
                                </button></div>
                        </article>
                    </div>
                    <div v-else class="services-empty services-messages-empty">
                        <Inbox :size="31" /><strong>Aucun message reçu</strong><span>Les messages envoyés à ton
                            entreprise apparaîtront ici.</span>
                    </div>
                </template>
            </main>
        </template>

        <template v-else-if="!selectedCompany && (activeView === 'actions' || activeView === 'jobs')">
            <header class="services-header">
                <div><span class="services-eyebrow">Los Santos</span>
                    <h1>{{ activeView === 'actions' ? 'Actions' : 'Jobs' }}</h1>
                </div>
            </header>
            <main class="services-scroll">
                <div class="services-empty services-messages-empty">
                    <ShieldCheck :size="31" /><strong>{{ activeView === 'actions' ? 'Actions rapides' : 'Mesentreprises' }}</strong><span>{{ activeView === 'actions' ? 'Les actions liées aux entreprisesseront disponibles ici.' : 'Les entreprises liées à ton personnage apparaîtront ici.' }}</span>
                </div>
            </main>
        </template>

        <template v-else-if="!selectedCompany && activeView === 'inbox'">
            <header class="services-header services-inbox-header">
                <button type="button" class="services-back-button" aria-label="Annuaire"
                    @click="activeView = 'directory'">
                    <ArrowLeft :size="19" />
                </button>
                <div><span class="services-eyebrow">Espace entreprise</span>
                    <h1>{{ employeeCompany?.name || currentEmployee.companyName || 'Ma réception' }}</h1>
                </div>
                <span class="services-employee-avatar">
                    <Users :size="17" />
                </span>
            </header>
            <main class="services-scroll services-inbox-scroll">
                <div v-if="incomingCalls.length" class="services-incoming-call">
                    <span class="services-incoming-icon">
                        <PhoneCall :size="18" />
                    </span>
                    <span><strong>Appel pour l’entreprise</strong><small>{{ incomingCalls[0].callerName }} · {{
                        incomingCalls[0].callerPhone }}</small></span>
                    <button type="button" @click="answerIncomingCall(incomingCalls[0])">Répondre</button>
                </div>
                <div class="services-inbox-summary"><span>
                        <Inbox :size="17" /> Messages reçus
                    </span><small>{{ unreadCount }} non lu{{ unreadCount > 1 ? 's' : '' }}</small></div>
                <div v-if="employeeMessages.length" class="services-message-list">
                    <article v-for="message in employeeMessages" :key="message.id" class="services-message-card"
                        :class="{ 'services-message-card--unread': message.unread }">
                        <div class="services-message-top"><span class="services-message-avatar">{{
                            message.senderName.slice(0, 1).toUpperCase() }}</span><span><strong>{{
                                    message.senderName }}</strong><small>{{ message.time }}</small></span><span
                                v-if="message.unread" class="services-unread-dot"></span></div>
                        <p>{{ message.text }}</p>
                        <div class="services-message-actions"><span v-if="message.senderPhone">
                                <Phone :size="14" /> {{ formatPhone(message.senderPhone) }}
                            </span><button type="button" @click="openMessageComposer(employeeCompany, message)">
                                <Reply :size="14" /> Répondre
                            </button></div>
                    </article>
                </div>
                <div v-else class="services-empty services-inbox-empty">
                    <MessageCircle :size="31" /><strong>Votre boîte est vide</strong><span>Les messages envoyés à votre
                        entreprise apparaîtront ici.</span>
                </div>
            </main>
        </template>

        <Transition name="services-page">
            <section v-if="selectedCompany" class="services-company-page">
                <header class="services-page-header"><button type="button" aria-label="Retour" @click="closeCompany">
                        <ArrowLeft :size="19" />
                    </button><span>Fiche entreprise</span><button type="button" aria-label="Appeler"
                        @click="callCompany(selectedCompany)">
                        <Phone :size="18" />
                    </button></header>
                <div class="services-company-scroll">
                    <div class="services-company-hero" :style="{ background: selectedCompany.color }"><span>
                            <component :is="companyIcon(selectedCompany.category)" :size="34" />
                        </span></div>
                    <div class="services-company-content"><span class="services-company-category">{{
                        selectedCompany.category
                            }}</span>
                        <h2>{{ selectedCompany.name }}</h2>
                        <p>{{ selectedCompany.description }}</p>
                        <div class="services-company-number"><span>
                                <Phone :size="17" /><small>Numéro professionnel</small><strong>{{
                                    formatPhone(selectedCompany.phone) }}</strong>
                            </span><button type="button" @click="callCompany(selectedCompany)">Appeler</button></div>
                        <div class="services-company-details"><span>
                                <MapPin :size="16" /><span><small>Adresse</small><strong>{{ selectedCompany.address
                                        }}</strong></span>
                            </span><span>
                                <Clock3 :size="16" /><span><small>Horaires</small><strong>{{ selectedCompany.hours
                                        }}</strong></span>
                            </span></div>
                        <button type="button" class="services-message-button"
                            @click="openMessageComposer(selectedCompany)">
                            <MessageCircle :size="18" /> Envoyer un message
                        </button>
                    </div>
                </div>
            </section>
        </Transition>

        <div v-if="!selectedCompany" class="services-bottom-nav">
            <button type="button" :class="{ 'services-nav--active': activeView === 'directory' }"
                @click="activeView = 'directory'">
                <Building2 :size="17" /><span>Annuaire</span>
            </button>
            <button type="button" :class="{ 'services-nav--active': activeView === 'messages' }"
                @click="activeView = 'messages'">
                <Inbox :size="17" /><span>Réception</span><b v-if="unreadCount">{{ unreadCount }}</b>
            </button>
            <button type="button" :class="{ 'services-nav--active': activeView === 'actions' }"
                @click="activeView = 'actions'">
                <ShieldCheck :size="17" /><span>Actions</span>
            </button>
            <button type="button" :class="{ 'services-nav--active': activeView === 'jobs' }"
                @click="activeView = 'jobs'">
                <Users :size="17" /><span>Jobs</span>
            </button>
        </div>

        <Transition name="services-sheet">
            <div v-if="isComposerVisible" class="services-composer-backdrop" @click.self="closeMessageComposer">
                <form class="services-composer" @submit.prevent="submitMessage">
                    <div class="services-sheet-grabber"></div>
                    <header class="services-composer-header"><button type="button"
                            @click="closeMessageComposer">Annuler</button><strong>{{ composeTarget?.replyTo ? 'Répondre'
                                :
                                'Message' }}</strong><button type="submit" :disabled="isSending || !messageDraft.trim()">{{
                                isSending ? '…' : 'Envoyer' }}</button></header>
                    <div class="services-composer-content">
                        <div class="services-recipient"><span class="service-company-icon"
                                :style="{ background: composeTarget?.company?.color }">
                                <Building2 :size="18" />
                            </span><span><small>{{ composeTarget?.replyTo ? 'Réponse à' : 'Destinataire'
                                    }}</small><strong>{{
                                        composeTarget?.company?.name }}</strong></span>
                            <Check :size="17" />
                        </div>
                        <textarea v-model="messageDraft" rows="5" maxlength="500" autofocus
                            :placeholder="composeTarget?.replyTo ? 'Écris ta réponse…' : 'Écris ton message à l’entreprise…'"></textarea>
                        <p v-if="messageNotice || lastError" class="services-form-notice">{{ messageNotice || lastError
                            }}</p>
                        <p class="services-form-footnote">
                            <ShieldCheck :size="14" /> Message transmis à la réception de l’entreprise
                        </p>
                    </div>
                </form>
            </div>
        </Transition>
    </div>
</template>

<style scoped lang="scss">
.services-app {
    --services-accent: #4d8dff;
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

.services-header,
.services-header>div,
.services-inbox-summary,
.services-intro,
.services-company-main,
.services-message-top,
.services-message-actions,
.services-company-details>span,
.services-recipient,
.services-composer-header {
    display: flex;
    align-items: center;
}

.services-header {
    justify-content: space-between;
}

.services-eyebrow {
    display: block;
    margin-bottom: .2cqh;
    color: rgba(255, 255, 255, .42);
    font-size: 1.35cqh;
}

.services-header h1 {
    margin: 0;
    font-size: 5.2cqh;
    font-weight: 700;
    letter-spacing: -.08cqw;
}

.services-inbox-button,
.services-back-button,
.services-employee-avatar {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 5.2cqh;
    height: 5.2cqh;
    border: 0;
    border-radius: 50%;
    color: white;
    background: rgba(77, 141, 255, .16);
    cursor: pointer;
}

.services-badge {
    position: absolute;
    top: -.7cqh;
    right: -.7cqw;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 2.5cqh;
    height: 2.5cqh;
    border-radius: 999px;
    color: white;
    background: #ff453a;
    font-size: 1.1cqh;
    font-weight: 700;
}

.services-search {
    display: flex;
    align-items: center;
    gap: 1.3cqw;
    height: 5.4cqh;
    margin-top: 2cqh;
    padding: 0 1.8cqw;
    border-radius: 1.5cqh;
    color: rgba(255, 255, 255, .52);
    background: rgba(118, 118, 128, .2);
}

.services-search input {
    min-width: 0;
    flex: 1;
    border: 0;
    outline: 0;
    color: white;
    background: transparent;
    font: inherit;
    font-size: 1.7cqh;
}

.services-search input::placeholder {
    color: rgba(255, 255, 255, .45);
}

.services-search button {
    display: flex;
    border: 0;
    padding: 0;
    color: rgba(255, 255, 255, .55);
    background: transparent;
}

.services-categories {
    display: flex;
    gap: 2.8cqw;
    flex-shrink: 0;
    margin: 2.5cqh 0 1.5cqh;
    overflow-x: auto;
    scrollbar-width: none;
}

.services-categories::-webkit-scrollbar {
    display: none;
}

.services-categories button {
    flex-shrink: 0;
    border: 0;
    padding: 0 0 .9cqh;
    color: rgba(255, 255, 255, .45);
    background: transparent;
    font: inherit;
    font-size: 1.5cqh;
    cursor: pointer;
}

.services-categories button.services-category--active {
    color: var(--services-accent);
    border-bottom: .25cqh solid var(--services-accent);
    font-weight: 600;
}

.services-scroll {
    min-height: 0;
    flex: 1;
    overflow-y: auto;
    padding-bottom: 10cqh;
    scrollbar-width: none;
}

.services-scroll::-webkit-scrollbar,
.services-company-scroll::-webkit-scrollbar {
    display: none;
}

.services-intro,
.services-inbox-summary {
    justify-content: space-between;
    margin: 1.2cqh .5cqw;
    color: rgba(255, 255, 255, .84);
    font-size: 1.65cqh;
    font-weight: 600;
}

.services-intro span,
.services-inbox-summary span {
    display: flex;
    align-items: center;
    gap: .8cqw;
}

.services-intro small,
.services-inbox-summary small {
    color: rgba(255, 255, 255, .38);
    font-size: 1.3cqh;
    font-weight: 400;
}

.service-company-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
    gap: 1cqw;
    min-height: 0;
    margin-bottom: 1.5cqh;
    border: 1px solid rgba(255, 255, 255, .09);
    border-radius: 2cqh;
    padding: 1.5cqh 1.5cqw;
    background: rgba(30, 30, 32, .94);
    box-shadow: 0 .8cqh 2cqh rgba(0, 0, 0, .2);
}

.service-company-main {
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    width: 100%;
    min-width: 0;
    gap: 1.8cqw;
    border: 0;
    padding: .5cqh 0 1cqh;
    color: white;
    text-align: left;
    background: transparent;
    font: inherit;
    cursor: pointer;
}

.service-company-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 6.2cqh;
    height: 6.2cqh;
    border-radius: 1.8cqh;
    background: rgba(77, 141, 255, .2);
}

.service-company-info {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
    gap: .45cqh;
}

.service-company-info strong {
    overflow: hidden;
    font-size: 1.75cqh;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.service-company-info small {
    overflow: hidden;
    color: rgba(255, 255, 255, .48);
    font-size: 1.35cqh;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.service-company-status {
    display: flex;
    align-items: center;
    gap: .7cqw;
    color: rgba(255, 255, 255, .38);
    font-size: 1.2cqh;
}

.service-company-status span {
    width: .9cqh;
    height: .9cqh;
    border-radius: 50%;
    background: #30d158;
}

.service-company-chevron {
    flex-shrink: 0;
    color: rgba(255, 255, 255, .3);
}

.service-company-call {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: .8cqw;
    width: 100%;
    height: 4.8cqh;
    border: 0;
    border-radius: 1.2cqh;
    color: var(--services-accent);
    background: rgba(77, 141, 255, .14);
    font: inherit;
    font-size: 1.35cqh;
    font-weight: 600;
    cursor: pointer;
}

.service-company-message {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: .8cqw;
    width: 100%;
    height: 4.8cqh;
    border: 0;
    border-radius: 1.2cqh;
    color: #ff9bb3;
    background: rgba(255, 59, 107, .13);
    font: inherit;
    font-size: 1.35cqh;
    font-weight: 600;
    cursor: pointer;
}

.service-company-call:hover,
.service-company-message:hover {
    filter: brightness(1.15);
}

.services-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 1cqh;
    min-height: 22cqh;
    color: rgba(255, 255, 255, .38);
    text-align: center;
}

.services-empty strong {
    color: rgba(255, 255, 255, .84);
    font-size: 2cqh;
}

.services-empty span {
    font-size: 1.45cqh;
}

.services-inbox-header {
    gap: 1.5cqw;
}

.services-inbox-header>div {
    flex: 1;
    min-width: 0;
    flex-direction: column;
    align-items: flex-start;
}

.services-inbox-header h1 {
    overflow: hidden;
    max-width: 100%;
    font-size: 2.4cqh;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.services-incoming-call {
    display: flex;
    align-items: center;
    gap: 1.5cqw;
    margin: 1cqh 0 2.3cqh;
    padding: 1.5cqh;
    border: 1px solid rgba(48, 209, 88, .2);
    border-radius: 1.8cqh;
    background: rgba(48, 209, 88, .1);
}

.services-incoming-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 5cqh;
    height: 5cqh;
    border-radius: 50%;
    color: #30d158;
    background: rgba(48, 209, 88, .15);
}

.services-incoming-call>span:nth-child(2) {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: .4cqh;
    min-width: 0;
}

.services-incoming-call strong {
    font-size: 1.45cqh;
}

.services-incoming-call small {
    color: rgba(255, 255, 255, .5);
    font-size: 1.25cqh;
}

.services-incoming-call button {
    border: 0;
    color: #6bea91;
    background: transparent;
    font: inherit;
    font-size: 1.3cqh;
    font-weight: 600;
    cursor: pointer;
}

.services-message-list {
    display: flex;
    flex-direction: column;
    gap: 1.2cqh;
}

.services-message-card {
    border-radius: 1.8cqh;
    padding: 1.6cqh 1.7cqw;
    background: rgba(30, 30, 32, .96);
}

.services-message-card--unread {
    border-left: .5cqw solid var(--services-accent);
    background: rgba(40, 48, 68, .96);
}

.services-message-top {
    gap: 1.2cqw;
}

.services-message-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 4.5cqh;
    height: 4.5cqh;
    border-radius: 50%;
    color: white;
    background: linear-gradient(145deg, #7187bd, #31384f);
    font-size: 1.65cqh;
    font-weight: 600;
}

.services-message-top>span:nth-child(2) {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: .25cqh;
}

.services-message-top strong {
    font-size: 1.55cqh;
}

.services-message-top small {
    color: rgba(255, 255, 255, .42);
    font-size: 1.2cqh;
}

.services-unread-dot {
    width: 1.1cqh;
    height: 1.1cqh;
    border-radius: 50%;
    background: var(--services-accent);
}

.services-message-card p {
    margin: 1.3cqh 0;
    color: rgba(255, 255, 255, .75);
    font-size: 1.55cqh;
    line-height: 1.35;
}

.services-message-actions {
    justify-content: space-between;
    color: rgba(255, 255, 255, .4);
    font-size: 1.2cqh;
}

.services-message-actions span,
.services-message-actions button {
    display: flex;
    align-items: center;
    gap: .7cqw;
}

.services-message-actions button {
    border: 0;
    color: var(--services-accent);
    background: transparent;
    font: inherit;
    font-weight: 600;
    cursor: pointer;
}

.services-inbox-empty {
    min-height: 34cqh;
}

.services-company-page {
    position: absolute;
    z-index: 4;
    inset: 0;
    display: flex;
    flex-direction: column;
    padding-top: 8cqh;
    background: #0a0a0a;
}

.services-page-header {
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

.services-page-header span {
    color: rgba(255, 255, 255, .72);
    font-size: 1.5cqh;
    font-weight: 600;
}

.services-page-header button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 4.8cqh;
    height: 4.8cqh;
    border: 0;
    border-radius: 50%;
    color: white;
    background: rgba(20, 20, 20, .6);
    cursor: pointer;
}

.services-company-scroll {
    min-height: 0;
    overflow-y: auto;
    scrollbar-width: none;
}

.services-company-hero {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 24cqh;
    margin: 0 0 2.5cqh;
    border-radius: 0 0 3cqh 3cqh;
}

.services-company-hero>span {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 11cqh;
    height: 11cqh;
    border-radius: 3cqh;
    color: white;
    background: rgba(0, 0, 0, .22);
}

.services-company-content {
    padding: 0 3cqh 6cqh;
}

.services-company-category {
    color: var(--services-accent);
    font-size: 1.4cqh;
    font-weight: 600;
}

.services-company-content h2 {
    margin: 1cqh 0;
    font-size: 3.3cqh;
    line-height: 1.1;
}

.services-company-content>p {
    margin: 0 0 2.5cqh;
    color: rgba(255, 255, 255, .58);
    font-size: 1.65cqh;
    line-height: 1.4;
}

.services-company-number {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1cqw;
    padding: 1.7cqh 1.6cqw;
    border: 1px solid rgba(77, 141, 255, .2);
    border-radius: 1.8cqh;
    background: rgba(77, 141, 255, .1);
}

.services-company-number>span {
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 1cqw;
    align-items: center;
    color: var(--services-accent);
}

.services-company-number small,
.services-company-number strong {
    grid-column: 2;
}

.services-company-number small {
    color: rgba(255, 255, 255, .4);
    font-size: 1.15cqh;
}

.services-company-number strong {
    color: white;
    font-size: 1.8cqh;
    letter-spacing: .08cqw;
}

.services-company-number svg {
    grid-row: span 2;
}

.services-company-number button,
.services-message-button {
    border: 0;
    border-radius: 1.2cqh;
    color: white;
    background: var(--services-accent);
    font: inherit;
    font-size: 1.35cqh;
    font-weight: 600;
    cursor: pointer;
}

.services-company-number button {
    padding: 1.1cqh 1.6cqw;
}

.services-company-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1cqw;
    margin: 2cqh 0;
}

.services-company-details>span {
    align-items: flex-start;
    gap: 1cqw;
    padding: 1.4cqh 1.2cqw;
    border-radius: 1.5cqh;
    color: var(--services-accent);
    background: rgba(255, 255, 255, .06);
}

.services-company-details>span>span {
    display: flex;
    flex-direction: column;
    gap: .35cqh;
    min-width: 0;
}

.services-company-details small {
    color: rgba(255, 255, 255, .38);
    font-size: 1.15cqh;
}

.services-company-details strong {
    overflow: hidden;
    color: rgba(255, 255, 255, .82);
    font-size: 1.3cqh;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.services-message-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1cqw;
    width: 100%;
    min-height: 5.8cqh;
}

.services-bottom-nav {
    position: absolute;
    right: 3cqh;
    bottom: 2cqh;
    left: 3cqh;
    display: flex;
    justify-content: space-around;
    min-height: 6cqh;
    border: 1px solid rgba(255, 255, 255, .08);
    border-radius: 1.8cqh;
    background: rgba(30, 30, 32, .96);
}

.services-bottom-nav button {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: .35cqh;
    flex: 1;
    border: 0;
    color: rgba(255, 255, 255, .42);
    background: transparent;
    font: inherit;
    font-size: 1.15cqh;
    cursor: pointer;
}

.services-bottom-nav button.services-nav--active {
    color: var(--services-accent);
}

.services-bottom-nav b {
    position: absolute;
    top: .4cqh;
    right: 27%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.1cqh;
    height: 2.1cqh;
    border-radius: 50%;
    color: white;
    background: #ff453a;
    font-size: 1cqh;
}

.services-composer-backdrop {
    position: absolute;
    z-index: 6;
    inset: 0;
    display: flex;
    align-items: flex-end;
    background: rgba(0, 0, 0, .5);
}

.services-composer {
    width: 100%;
    max-height: 72%;
    box-sizing: border-box;
    border-radius: 3cqh 3cqh 0 0;
    padding-bottom: 3cqh;
    background: #242426;
    box-shadow: 0 -1cqh 4cqh rgba(0, 0, 0, .35);
}

.services-sheet-grabber {
    width: 9cqw;
    height: .55cqh;
    margin: 1cqh auto;
    border-radius: 999px;
    background: rgba(255, 255, 255, .24);
}

.services-composer-header {
    justify-content: space-between;
    min-height: 6cqh;
    padding: 0 3cqw;
    border-bottom: 1px solid rgba(255, 255, 255, .09);
}

.services-composer-header button {
    width: 15cqw;
    border: 0;
    padding: 0;
    color: var(--services-accent);
    background: transparent;
    font: inherit;
    font-size: 1.45cqh;
    cursor: pointer;
}

.services-composer-header button:last-child {
    text-align: right;
    font-weight: 600;
}

.services-composer-header strong {
    font-size: 1.8cqh;
}

.services-composer-content {
    padding: 2cqh 3cqh 0;
}

.services-recipient {
    gap: 1.3cqw;
    padding: 1.3cqh 1.4cqw;
    border-radius: 1.5cqh;
    background: rgba(255, 255, 255, .06);
}

.services-recipient>span:nth-child(2) {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: .3cqh;
}

.services-recipient small {
    color: rgba(255, 255, 255, .4);
    font-size: 1.2cqh;
}

.services-recipient strong {
    font-size: 1.5cqh;
}

.services-recipient>svg {
    color: #30d158;
}

.services-composer-content textarea {
    width: 100%;
    min-height: 16cqh;
    box-sizing: border-box;
    margin-top: 2cqh;
    border: 0;
    border-radius: 1.5cqh;
    outline: 0;
    padding: 1.5cqw;
    color: white;
    background: rgba(118, 118, 128, .18);
    font: inherit;
    font-size: 1.7cqh;
    line-height: 1.4;
    resize: none;
}

.services-composer-content textarea:focus {
    box-shadow: 0 0 0 .2cqh rgba(77, 141, 255, .32);
}

.services-form-notice {
    margin: 1.2cqh 0 0;
    color: #65d69a;
    font-size: 1.35cqh;
}

.services-form-footnote {
    display: flex;
    align-items: center;
    gap: .8cqw;
    margin: 1.8cqh 0 0;
    color: rgba(255, 255, 255, .38);
    font-size: 1.2cqh;
}

.services-page-enter-active,
.services-page-leave-active,
.services-sheet-enter-active,
.services-sheet-leave-active {
    transition: opacity .25s ease, transform .28s cubic-bezier(.22, 1, .36, 1);
}

.services-page-enter-from,
.services-page-leave-to {
    opacity: 0;
    transform: translateX(100%);
}

.services-sheet-enter-from,
.services-sheet-leave-to {
    opacity: 0;
    transform: translateY(100%);
}
</style>
