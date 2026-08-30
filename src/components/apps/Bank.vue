<script setup>
import { computed, ref } from 'vue';
import {
    ArrowLeft,
    ArrowDownLeft,
    ArrowUpRight,
    ChevronRight,
    CreditCard,
    Eye,
    EyeOff,
    House,
    Landmark,
    Plus,
    ReceiptText,
    Send,
    ShieldCheck,
    UserRound,
    WalletCards,
    X,
} from '@lucide/vue';

const activeTab = ref('home');
const balance = ref(12450.8);
const showBalance = ref(true);
const showCardNumber = ref(false);
const showActionSheet = ref(false);
const detailSheet = ref(null);
const showAllTransactions = ref(false);
const actionType = ref('transfer');
const formError = ref('');
const actionForm = ref({ name: '', amount: '' });
const cardLocked = ref(false);
const contactlessEnabled = ref(true);
const biometricEnabled = ref(true);
const dailyLimit = 1000;
const onlineLimit = 500;
const lastDocumentAction = ref('');

const transactions = ref([
    { id: 1, title: 'Salaire', subtitle: 'Aujourd’hui', amount: 2850, icon: ArrowDownLeft, positive: true },
    { id: 2, title: 'Los Santos Coffee', subtitle: 'Hier · Carte', amount: -6.5, icon: CreditCard, positive: false },
    { id: 3, title: 'Virement à John', subtitle: '28 août · Virement', amount: -120, icon: ArrowUpRight, positive: false },
    { id: 4, title: 'Remboursement', subtitle: '26 août', amount: 48.9, icon: ArrowDownLeft, positive: true },
]);

const formatMoney = (value) => new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
}).format(value);

const formattedBalance = computed(() => showBalance.value ? formatMoney(balance.value) : '••••••');

const actionTitle = computed(() => ({
    transfer: 'Nouveau virement',
    payment: 'Nouveau paiement',
    deposit: 'Ajouter de l’argent',
}[actionType.value]));

const actionLabel = computed(() => actionType.value === 'deposit' ? 'Ajouter' : 'Confirmer');

const detailTitle = computed(() => ({
    cardSecurity: 'Sécurité de la carte',
    cardLimits: 'Plafonds et paiements',
    account: 'Informations du compte',
    privacy: 'Confidentialité et sécurité',
    documents: 'Documents bancaires',
}[detailSheet.value] || ''));

const openAction = (type) => {
    actionType.value = type;
    actionForm.value = { name: '', amount: '' };
    formError.value = '';
    showActionSheet.value = true;
};

const closeAction = () => {
    showActionSheet.value = false;
    formError.value = '';
};

const openDetail = (type) => {
    lastDocumentAction.value = '';
    detailSheet.value = type;
};

const closeDetail = () => {
    detailSheet.value = null;
    lastDocumentAction.value = '';
};

const openDocument = (name) => {
    lastDocumentAction.value = `${name} sélectionné`;
};

const submitAction = () => {
    const amount = Number(actionForm.value.amount);
    const name = actionForm.value.name.trim() || (actionType.value === 'deposit' ? 'Ajout de fonds' : 'Opération');

    if (!Number.isFinite(amount) || amount <= 0) {
        formError.value = 'Indique un montant valide.';
        return;
    }

    const isDeposit = actionType.value === 'deposit';
    if (!isDeposit && amount > balance.value) {
        formError.value = 'Le solde est insuffisant.';
        return;
    }

    balance.value += isDeposit ? amount : -amount;
    transactions.value.unshift({
        id: Date.now(),
        title: name,
        subtitle: isDeposit ? 'Ajout de fonds' : actionType.value === 'transfer' ? 'Virement' : 'Paiement',
        amount: isDeposit ? amount : -amount,
        icon: isDeposit ? ArrowDownLeft : actionType.value === 'transfer' ? Send : ReceiptText,
        positive: isDeposit,
    });
    closeAction();
};

const maskCardNumber = computed(() => showCardNumber.value ? '5217 5600 2048 7314' : '••••  ••••  ••••  7314');
</script>

<template>
    <div class="bank-app">
        <header class="bank-header">
            <div>
                <h1>Banque</h1>
            </div>
            <button type="button" class="bank-profile-button" aria-label="Profil" @click="activeTab = 'profile'">
                JM
            </button>
        </header>

        <main class="bank-content">
            <template v-if="activeTab === 'home'">
                <section class="bank-balance-card">
                    <div class="bank-balance-topline">
                        <span>Solde disponible</span>
                        <button type="button" aria-label="Afficher ou masquer le solde"
                            @click="showBalance = !showBalance">
                            <EyeOff v-if="showBalance" size="2.2cqh" />
                            <Eye v-else size="2.2cqh" />
                        </button>
                    </div>
                    <strong class="bank-balance">{{ formattedBalance }}</strong>
                    <div class="bank-balance-footer">
                        <span>Compte courant</span>
                        <span>•• 7314</span>
                    </div>
                </section>

                <section class="bank-section">
                    <div class="bank-section-heading">
                        <h2>Actions rapides</h2>
                    </div>
                    <div class="bank-quick-actions">
                        <button type="button" @click="openAction('transfer')">
                            <span class="bank-action-icon blue">
                                <Send size="2.4cqh" />
                            </span>
                            <span>Virement</span>
                        </button>
                        <button type="button" @click="openAction('payment')">
                            <span class="bank-action-icon purple">
                                <ReceiptText size="2.4cqh" />
                            </span>
                            <span>Payer</span>
                        </button>
                        <button type="button" @click="openAction('deposit')">
                            <span class="bank-action-icon green">
                                <Plus size="2.6cqh" />
                            </span>
                            <span>Ajouter</span>
                        </button>
                    </div>
                </section>

                <section class="bank-section bank-card-section">
                    <div class="bank-section-heading">
                        <h2>Ma carte</h2>
                        <button type="button" @click="activeTab = 'cards'">Voir tout
                            <ChevronRight size="1.8cqh" />
                        </button>
                    </div>
                    <button type="button" class="bank-card-preview" @click="activeTab = 'cards'">
                        <div class="bank-card-brand">
                            <Landmark size="2.6cqh" /> BANK
                        </div>
                        <span class="bank-card-chip"></span>
                        <strong>•••• •••• •••• 7314</strong>
                        <div class="bank-card-bottom"><span>JOHN MCKENZIE</span><span>VISA</span></div>
                    </button>
                </section>

                <section class="bank-section bank-transactions-section">
                    <div class="bank-section-heading">
                        <h2>Dernières opérations</h2>
                        <button type="button" @click="showAllTransactions = true">Tout voir
                            <ChevronRight size="1.8cqh" />
                        </button>
                    </div>
                    <div class="bank-transactions">
                        <div v-for="transaction in transactions.slice(0, 4)" :key="transaction.id"
                            class="bank-transaction">
                            <span class="transaction-icon" :class="transaction.positive ? 'income' : 'expense'">
                                <component :is="transaction.icon" size="2.1cqh" />
                            </span>
                            <span class="transaction-details">
                                <strong>{{ transaction.title }}</strong>
                                <small>{{ transaction.subtitle }}</small>
                            </span>
                            <strong class="transaction-amount" :class="{ income: transaction.positive }">
                                {{ transaction.positive ? '+' : '' }}{{ formatMoney(transaction.amount) }}
                            </strong>
                        </div>
                    </div>
                </section>
            </template>

            <template v-else-if="activeTab === 'cards'">
                <button type="button" class="bank-large-card" @click="showCardNumber = !showCardNumber">
                    <div class="bank-card-brand">
                        <Landmark size="2.8cqh" /> BANK
                    </div>
                    <span class="bank-card-chip"></span>
                    <strong>{{ maskCardNumber }}</strong>
                    <div class="bank-card-bottom"><span>JOHN MCKENZIE</span><span>VISA</span></div>
                </button>
                <div class="bank-settings-list">
                    <button type="button" @click="openDetail('cardSecurity')">
                        <ShieldCheck size="2.2cqh" /><span>Sécurité de la carte</span>
                        <ChevronRight size="2cqh" />
                    </button>
                    <button type="button" @click="openDetail('cardLimits')">
                        <WalletCards size="2.2cqh" /><span>Plafonds et paiements</span>
                        <ChevronRight size="2cqh" />
                    </button>
                </div>
            </template>

            <template v-else>
                <div class="bank-profile-card">
                    <span class="bank-profile-large">JM</span>
                    <div><strong>John McKenzie</strong><small>Client depuis août 2026</small></div>
                    <ChevronRight size="2.2cqh" />
                </div>
                <div class="bank-settings-list">
                    <button type="button" @click="openDetail('account')">
                        <Landmark size="2.2cqh" /><span>Informations du compte</span>
                        <ChevronRight size="2cqh" />
                    </button>
                    <button type="button" @click="openDetail('privacy')">
                        <ShieldCheck size="2.2cqh" /><span>Confidentialité et sécurité</span>
                        <ChevronRight size="2cqh" />
                    </button>
                    <button type="button" @click="openDetail('documents')">
                        <ReceiptText size="2.2cqh" /><span>Documents bancaires</span>
                        <ChevronRight size="2cqh" />
                    </button>
                </div>
            </template>
        </main>

        <Transition name="bank-page">
            <section v-if="showAllTransactions" class="bank-transactions-page">
                <header class="bank-detail-header">
                    <button type="button" class="bank-detail-back" aria-label="Retour"
                        @click="showAllTransactions = false">
                        <ArrowLeft size="2.7cqh" />
                    </button>
                    <strong>Toutes les opérations</strong>
                    <span class="bank-header-spacer"></span>
                </header>
                <p class="bank-page-title">{{ transactions.length }} opérations enregistrées</p>
                <div class="bank-transactions bank-transactions-full">
                    <div v-for="transaction in transactions" :key="transaction.id" class="bank-transaction">
                        <span class="transaction-icon" :class="transaction.positive ? 'income' : 'expense'">
                            <component :is="transaction.icon" size="2.1cqh" />
                        </span>
                        <span class="transaction-details">
                            <strong>{{ transaction.title }}</strong>
                            <small>{{ transaction.subtitle }}</small>
                        </span>
                        <strong class="transaction-amount" :class="{ income: transaction.positive }">
                            {{ transaction.positive ? '+' : '' }}{{ formatMoney(transaction.amount) }}
                        </strong>
                    </div>
                </div>
            </section>
        </Transition>

        <div class="bottom-app-bank">
            <nav class="categories" aria-label="Navigation Banque">
                <button type="button" class="categorie" :class="{ 'categorie-selected': activeTab === 'home' }"
                    @click="activeTab = 'home'">
                    <House size="2.3cqh" /><span>Accueil</span>
                </button>
                <button type="button" class="categorie" :class="{ 'categorie-selected': activeTab === 'cards' }"
                    @click="activeTab = 'cards'">
                    <WalletCards size="2.3cqh" /><span>Cartes</span>
                </button>
                <button type="button" class="categorie" :class="{ 'categorie-selected': activeTab === 'profile' }"
                    @click="activeTab = 'profile'">
                    <UserRound size="2.3cqh" /><span>Profil</span>
                </button>
            </nav>
        </div>

        <Transition name="bank-sheet">
            <div v-if="detailSheet" class="bank-sheet-backdrop" @click.self="closeDetail">
                <section class="bank-detail-sheet">
                    <div class="bank-sheet-grabber" aria-hidden="true"></div>
                    <header class="bank-detail-header">
                        <button type="button" class="bank-detail-cancel" @click="closeDetail">Annuler</button>
                        <strong>{{ detailTitle }}</strong>
                        <button type="button" class="bank-detail-done" @click="closeDetail">Terminé</button>
                    </header>

                    <div class="bank-detail-content" :class="{ 'bank-account-content': detailSheet === 'account' }">
                        <template v-if="detailSheet === 'cardSecurity'">
                            <p class="bank-detail-intro">Gère les protections de ta carte.</p>
                            <div class="bank-settings-list bank-detail-list">
                                <button type="button" class="bank-toggle-row" @click="cardLocked = !cardLocked">
                                    <span>
                                        <ShieldCheck size="2.2cqh" /><span><strong>Verrouiller la
                                                carte</strong><small>{{ cardLocked ? 'Les paiements sont bloqués' :
                                                'Carte active' }}</small></span>
                                    </span>
                                    <b class="bank-setting-state"
                                        :class="{ enabled: cardLocked, locked: cardLocked }">{{ cardLocked ? 'Bloquée' :
                                        'Active' }}</b>
                                </button>
                                <button type="button" class="bank-toggle-row"
                                    @click="contactlessEnabled = !contactlessEnabled">
                                    <span>
                                        <CreditCard size="2.2cqh" /><span><strong>Paiement sans
                                                contact</strong><small>{{ contactlessEnabled ? 'Activé' : 'Désactivé'
                                                }}</small></span>
                                    </span>
                                    <b class="bank-setting-state" :class="{ enabled: contactlessEnabled }">{{
                                        contactlessEnabled ? 'Activé' : 'Désactivé' }}</b>
                                </button>
                            </div>
                        </template>

                        <template v-else-if="detailSheet === 'cardLimits'">
                            <p class="bank-detail-intro">Voici les montants maximums autorisés.</p>
                            <div class="bank-settings-list bank-detail-list">
                                <div class="bank-detail-row"><span>Plafond quotidien</span><strong>{{
                                        formatMoney(dailyLimit) }}</strong></div>
                                <div class="bank-detail-row"><span>Paiements en ligne</span><strong>{{
                                        formatMoney(onlineLimit) }}</strong></div>
                                <div class="bank-detail-row"><span>Retraits au distributeur</span><strong>{{
                                        formatMoney(500) }}</strong></div>
                            </div>
                        </template>

                        <template v-else-if="detailSheet === 'account'">
                            <div class="bank-account-summary">
                                <span class="bank-account-icon">
                                    <Landmark size="3cqh" />
                                </span>
                                <div><small>Compte courant</small><strong>**** 7314</strong></div>
                                <span class="bank-account-status">Actif</span>
                            </div>
                            <p class="bank-detail-section-title">Coordonnées du compte</p>
                            <div class="bank-settings-list bank-account-list">
                                <div class="bank-detail-row"><span>Titulaire</span><strong>John McKenzie</strong></div>
                                <div class="bank-detail-row"><span>IBAN</span><strong>FR76 **** **** 7314</strong></div>
                                <div class="bank-detail-row"><span>Type de compte</span><strong>Compte
                                        personnel</strong></div>
                            </div>
                        </template>

                        <template v-else-if="detailSheet === 'privacy'">
                            <p class="bank-detail-intro">Protège l’accès à ton application Banque.</p>
                            <div class="bank-settings-list bank-detail-list">
                                <button type="button" class="bank-toggle-row"
                                    @click="biometricEnabled = !biometricEnabled">
                                    <span>
                                        <ShieldCheck size="2.2cqh" /><span><strong>Déverrouillage
                                                biométrique</strong><small>{{ biometricEnabled ? 'Activé' : 'Désactivé'
                                                }}</small></span>
                                    </span>
                                    <b class="bank-setting-state" :class="{ enabled: biometricEnabled }">{{
                                        biometricEnabled ? 'Activé' : 'Désactivé' }}</b>
                                </button>
                                <div class="bank-detail-row"><span>Notifications
                                        sensibles</span><strong>Masquées</strong></div>
                            </div>
                        </template>

                        <template v-else-if="detailSheet === 'documents'">
                            <p class="bank-detail-intro">Retrouve tes documents bancaires récents.</p>
                            <div class="bank-settings-list bank-detail-list">
                                <button type="button" class="bank-document-row" @click="openDocument('Relevé du mois')">
                                    <ReceiptText size="2.2cqh" /><span><strong>Relevé du mois</strong><small>PDF · août
                                            2026</small></span>
                                    <ChevronRight size="2cqh" />
                                </button>
                                <button type="button" class="bank-document-row" @click="openDocument('RIB')">
                                    <Landmark size="2.2cqh" /><span><strong>RIB</strong><small>Coordonnées du
                                            compte</small></span>
                                    <ChevronRight size="2cqh" />
                                </button>
                            </div>
                            <p v-if="lastDocumentAction" class="bank-document-notice">{{ lastDocumentAction }}</p>
                        </template>
                    </div>
                </section>
            </div>
        </Transition>

        <Transition name="bank-sheet">
            <div v-if="showActionSheet" class="bank-sheet-backdrop" @click.self="closeAction">
                <form class="bank-action-sheet" @submit.prevent="submitAction">
                    <div class="bank-sheet-grabber" aria-hidden="true"></div>
                    <header>
                        <button type="button" @click="closeAction">Annuler</button>
                        <strong>{{ actionTitle }}</strong>
                        <button type="submit" :disabled="!actionForm.amount">{{ actionLabel }}</button>
                    </header>
                    <div class="bank-form">
                        <label>
                            <span>{{ actionType === 'deposit' ? 'Source' : actionType === 'payment' ? 'Destinataire' :
                                'Bénéficiaire' }}</span>
                            <input v-model="actionForm.name" type="text"
                                :placeholder="actionType === 'deposit' ? 'Ex. Espèces' : 'Nom ou référence'" />
                        </label>
                        <label>
                            <span>Montant</span>
                            <div class="bank-amount-input"><input v-model="actionForm.amount" type="number" min="0.01"
                                    step="0.01" placeholder="0,00" /><b>€</b></div>
                        </label>
                        <p v-if="formError" class="bank-form-error">{{ formError }}</p>
                    </div>
                </form>
            </div>
        </Transition>
    </div>
</template>

<style scoped lang="scss">
.bank-app {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
    user-select: none;
    padding: 15cqw 3cqh 0;
    color: white;
    background: #0a0a0a;
}

.bank-header,
.bank-section-heading,
.bank-balance-topline,
.bank-balance-footer,
.bank-card-bottom,
.bank-transaction,
.bank-profile-card {
    display: flex;
    align-items: center;
}

.bank-header,
.bank-section-heading,
.bank-balance-topline,
.bank-balance-footer,
.bank-card-bottom,
.bank-profile-card {
    justify-content: space-between;
}

.bank-greeting {
    display: block;
    margin-bottom: 0.3cqh;
    color: rgba(255, 255, 255, 0.48);
    font-size: 1.4cqh;
}

.bank-header h1 {
    margin: 0;
    font-size: 4.8cqh;
    font-weight: 700;
}

.bank-profile-button,
.bank-profile-large {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0;
    border-radius: 50%;
    color: white;
    background: linear-gradient(145deg, #647bd0, #354273);
    font-weight: 600;
}

.bank-profile-button {
    width: 5.5cqh;
    height: 5.5cqh;
    font-size: 1.7cqh;
    cursor: pointer;
}

.bank-content {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
    overflow-y: auto;
    padding: 2.5cqh 0 3cqh;
}

.bank-balance-card {
    flex-shrink: 0;
    min-height: 18cqh;
    box-sizing: border-box;
    border-radius: 2.4cqh;
    padding: 2.5cqh 3cqw 2cqh;
    background: linear-gradient(135deg, #4264c6 0%, #263d86 53%, #172654 100%);
    box-shadow: 0 1.5cqh 3cqh rgba(36, 73, 176, 0.24);
}

.bank-balance-topline {
    color: rgba(255, 255, 255, 0.68);
    font-size: 1.45cqh;
}

.bank-balance-topline button {
    display: flex;
    border: 0;
    padding: 0;
    color: white;
    background: transparent;
    cursor: pointer;
}

.bank-balance {
    display: block;
    margin: 1.5cqh 0 2cqh;
    font-size: 4.8cqh;
    font-weight: 600;
    letter-spacing: 0.05cqw;
}

.bank-balance-footer {
    padding-top: 1.4cqh;
    border-top: 1px solid rgba(255, 255, 255, 0.16);
    color: rgba(255, 255, 255, 0.62);
    font-size: 1.35cqh;
}

.bank-section {
    margin-top: 2.8cqh;
}

.bank-section-heading {
    margin: 0 0 1.2cqh 0.5cqw;
}

.bank-section-heading h2 {
    margin: 0;
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.85cqh;
    font-weight: 600;
}

.bank-section-heading button {
    display: flex;
    align-items: center;
    gap: 0.4cqw;
    border: 0;
    padding: 0;
    color: #6f9cff;
    background: transparent;
    font: inherit;
    font-size: 1.35cqh;
    cursor: pointer;
}

.bank-quick-actions {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5cqw;
}

.bank-quick-actions button {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 0.8cqh;
    border: 0;
    border-radius: 1.8cqh;
    padding: 1.4cqh 0 1.2cqh;
    color: rgba(255, 255, 255, 0.76);
    background: rgba(30, 30, 32, 0.96);
    font: inherit;
    font-size: 1.35cqh;
    cursor: pointer;
}

.bank-action-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 5.4cqh;
    height: 5.4cqh;
    border-radius: 1.7cqh;
}

.bank-action-icon.blue {
    color: #79a4ff;
    background: rgba(77, 141, 255, 0.16);
}

.bank-action-icon.purple {
    color: #c09cff;
    background: rgba(155, 89, 255, 0.16);
}

.bank-action-icon.green {
    color: #65d69a;
    background: rgba(48, 209, 88, 0.14);
}

.bank-card-preview,
.bank-large-card {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    overflow: hidden;
    border: 0;
    color: white;
    text-align: left;
    background: linear-gradient(130deg, #17191e, #414853 48%, #15171b);
    box-shadow: 0 1cqh 2.5cqh rgba(0, 0, 0, 0.35);
    cursor: pointer;
}

.bank-card-preview::after,
.bank-large-card::after {
    position: absolute;
    top: -10cqh;
    right: -8cqw;
    width: 28cqw;
    height: 28cqw;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 50%;
    content: '';
}

.bank-card-preview {
    width: 100%;
    height: 20cqh;
    border-radius: 2.2cqh;
    padding: 2cqh 3cqw 1.6cqh;
}

.bank-large-card {
    width: 100%;
    height: 25cqh;
    border-radius: 2.6cqh;
    padding: 2.5cqh 4cqw 2cqh;
}

.bank-card-brand {
    display: flex;
    align-items: center;
    gap: 1cqw;
    font-size: 1.55cqh;
    font-weight: 700;
    letter-spacing: 0.12cqw;
}

.bank-card-chip {
    position: absolute;
    top: 7.8cqh;
    left: 3cqw;
    width: 6cqw;
    height: 3.8cqh;
    border-radius: 0.8cqh;
    background: linear-gradient(135deg, #c7a766, #f4d79a 48%, #a98242);
}

.bank-large-card .bank-card-chip {
    left: 4cqw;
}

.bank-card-preview>strong,
.bank-large-card>strong {
    margin-top: auto;
    font-size: 2cqh;
    font-weight: 500;
    letter-spacing: 0.15cqw;
}

.bank-large-card>strong {
    font-size: 2.4cqh;
}

.bank-card-bottom {
    color: rgba(255, 255, 255, 0.62);
    font-size: 1.1cqh;
    letter-spacing: 0.1cqw;
}

.bank-transactions {
    overflow: hidden;
    border-radius: 1.7cqh;
    background: rgba(30, 30, 30, 0.92);
}

.bank-transaction {
    gap: 1.8cqw;
    min-height: 7.5cqh;
    padding: 0 2cqw;
}

.bank-transaction+.bank-transaction {
    border-top: 1px solid rgba(255, 255, 255, 0.07);
}

.transaction-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 4.4cqh;
    height: 4.4cqh;
    border-radius: 50%;
}

.transaction-icon.income {
    color: #54d487;
    background: rgba(48, 209, 88, 0.14);
}

.transaction-icon.expense {
    color: #ff8179;
    background: rgba(255, 69, 58, 0.13);
}

.transaction-details {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
    gap: 0.3cqh;
}

.transaction-details strong {
    overflow: hidden;
    font-size: 1.55cqh;
    font-weight: 500;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.transaction-details small {
    color: rgba(255, 255, 255, 0.42);
    font-size: 1.25cqh;
}

.transaction-amount {
    color: #ff8f88;
    font-size: 1.45cqh;
    font-weight: 600;
}

.transaction-amount.income {
    color: #5cda90;
}

.bank-transactions-page {
    position: absolute;
    z-index: 5;
    inset: 0;
    overflow-y: auto;
    box-sizing: border-box;
    padding: 15cqw 3cqh 10cqh;
    background: #0a0a0a;
}

.bank-detail-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 5cqh;
    font-size: 1.9cqh;
}

.bank-detail-header button {
    display: flex;
    align-items: center;
    gap: 0.7cqw;
    border: 0;
    padding: 0;
    color: #6f9cff;
    background: transparent;
    font: inherit;
    font-size: 1.55cqh;
    cursor: pointer;
}

.bank-detail-header .bank-detail-back {
    width: 5cqh;
    height: 5cqh;
    justify-content: center;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 50%;
    padding: 0;
    color: white;
    background: rgba(55, 55, 58, 0.95);
    box-shadow: 0 0.6cqh 1.2cqh rgba(0, 0, 0, 0.45);
}

.bank-detail-header .bank-detail-done {
    justify-content: flex-end;
    width: 10cqw;
}

.bank-header-spacer {
    width: 10cqw;
}

.bank-transactions-full {
    margin-top: 2cqh;
}

.bank-detail-sheet {
    position: relative;
    width: 100%;
    min-height: 48%;
    box-sizing: border-box;
    border-radius: 3cqh 3cqh 0 0;
    padding-bottom: 4cqh;
    color: white;
    background: rgba(38, 38, 40, 0.99);
}

.bank-detail-sheet .bank-detail-header {
    min-height: 7cqh;
    padding: 0 3cqw;
    border-bottom: 1px solid rgba(255, 255, 255, 0.09);
}

.bank-detail-sheet .bank-detail-header>strong {
    font-size: 2.05cqh;
    font-weight: 600;
}

.bank-detail-header .bank-detail-cancel {
    justify-content: flex-start;
    width: 11cqw;
    color: rgba(255, 255, 255, 0.72);
    font-size: 1.55cqh;
}

.bank-account-sheet {
    height: 100%;
    min-height: 100%;
    border-radius: 0;
    padding: 15cqw 3cqh 5cqh;
    background: #0a0a0a;
}

.bank-account-sheet .bank-detail-header {
    flex-shrink: 0;
    padding: 0;
    border-bottom: 0;
}

.bank-account-content {
    gap: 1.2cqh;
    padding: 2.5cqh 3cqw 0;
}

.bank-account-summary {
    display: flex;
    align-items: center;
    gap: 2cqw;
    min-height: 11cqh;
    box-sizing: border-box;
    border: 1px solid rgba(111, 156, 255, 0.3);
    border-radius: 2.3cqh;
    padding: 1.7cqh 2cqw;
    background: linear-gradient(135deg, rgba(68, 104, 201, 0.95), rgba(38, 61, 134, 0.96));
    box-shadow: 0 1.2cqh 2.5cqh rgba(36, 73, 176, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.bank-account-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 5.5cqh;
    height: 5.5cqh;
    flex-shrink: 0;
    border-radius: 1.6cqh;
    color: white;
    background: rgba(255, 255, 255, 0.16);
}

.bank-account-summary div {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 0.4cqh;
}

.bank-account-summary small {
    color: rgba(255, 255, 255, 0.7);
    font-size: 1.3cqh;
}

.bank-account-summary strong {
    color: white;
    font-size: 2.05cqh;
    font-weight: 600;
    letter-spacing: 0.08cqw;
}

.bank-account-status {
    border-radius: 1.4cqh;
    padding: 0.7cqh 1.3cqw;
    color: #b9ffd1;
    background: rgba(48, 209, 88, 0.18);
    font-size: 1.2cqh;
    font-weight: 600;
}

.bank-detail-section-title {
    margin: 0;
    color: rgba(255, 255, 255, 0.46);
    font-size: 1.35cqh;
    font-weight: 600;
    letter-spacing: 0.04cqw;
    text-transform: uppercase;
}

.bank-account-list {
    display: flex;
    flex-direction: column;
    gap: 1.1cqh;
}

.bank-detail-content {
    display: flex;
    flex-direction: column;
    gap: 1.2cqh;
    padding: 2.5cqh 3cqw 0;
}

.bank-detail-intro {
    margin: 0.2cqh 0 0.8cqh;
    color: rgba(255, 255, 255, 0.55);
    font-size: 1.35cqh;
}

.bank-detail-row,
.bank-toggle-row,
.bank-document-row {
    display: flex;
    align-items: center;
    min-height: 7cqh;
    box-sizing: border-box;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 1.8cqh;
    padding: 1cqh 1.8cqw;
    color: rgba(255, 255, 255, 0.78);
    background: linear-gradient(135deg, rgba(65, 65, 68, 0.7), rgba(43, 43, 45, 0.82));
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 0.7cqh 1.4cqh rgba(0, 0, 0, 0.14);
    font: inherit;
    text-align: left;
}

.bank-detail-row {
    justify-content: space-between;
    gap: 2cqw;
}

.bank-detail-row span,
.bank-detail-row strong {
    font-size: 1.4cqh;
}

.bank-detail-row span {
    color: rgba(255, 255, 255, 0.5);
}

.bank-detail-row strong {
    color: white;
    font-weight: 500;
    text-align: right;
}

.bank-toggle-row,
.bank-document-row {
    width: 100%;
    gap: 1.8cqw;
    cursor: pointer;
    transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
}

.bank-toggle-row:hover,
.bank-document-row:hover {
    border-color: rgba(111, 156, 255, 0.45);
    background: linear-gradient(135deg, rgba(67, 79, 112, 0.82), rgba(43, 43, 45, 0.9));
}

.bank-toggle-row:active,
.bank-document-row:active {
    transform: scale(0.985);
}

.bank-toggle-row>span,
.bank-document-row>span {
    display: flex;
    align-items: center;
    gap: 1.8cqw;
    min-width: 0;
    flex: 1;
}

.bank-toggle-row svg,
.bank-document-row>svg:first-child {
    flex-shrink: 0;
    color: #6f9cff;
}

.bank-toggle-row strong,
.bank-document-row strong {
    display: block;
    color: white;
    font-size: 1.55cqh;
    font-weight: 500;
}

.bank-toggle-row small,
.bank-document-row small {
    display: block;
    margin-top: 0.3cqh;
    color: rgba(255, 255, 255, 0.45);
    font-size: 1.25cqh;
}

.bank-toggle {
    position: relative;
    display: block;
    width: 8.5cqw;
    height: 4.6cqh;
    flex-shrink: 0;
    border-radius: 3cqh;
    background: rgba(255, 255, 255, 0.2);
    box-shadow: inset 0 0.3cqh 0.6cqh rgba(0, 0, 0, 0.24);
    transition: background 0.2s ease;
}

.bank-toggle b {
    position: absolute;
    top: 0.45cqh;
    left: 0.45cqw;
    width: 3.7cqh;
    height: 3.7cqh;
    border-radius: 50%;
    background: white;
    box-shadow: 0 0.25cqh 0.6cqh rgba(0, 0, 0, 0.32);
    transition: transform 0.2s ease;
}

.bank-toggle.enabled {
    background: #4d8dff;
}

.bank-toggle.enabled b {
    transform: translateX(3.7cqw);
}

.bank-slider-row {
    display: flex;
    flex-direction: column;
    gap: 1.3cqh;
    min-height: 9cqh;
    box-sizing: border-box;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 1.8cqh;
    padding: 1.5cqh 1.8cqw;
    color: rgba(255, 255, 255, 0.62);
    font-size: 1.45cqh;
    background: linear-gradient(135deg, rgba(65, 65, 68, 0.7), rgba(43, 43, 45, 0.82));
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 0.7cqh 1.4cqh rgba(0, 0, 0, 0.14);
}

.bank-slider-row span {
    display: flex;
    justify-content: space-between;
}

.bank-slider-row strong,
.bank-slider-row b {
    color: white;
    font-weight: 500;
}

.bank-slider-row input {
    width: 100%;
    height: 0.7cqh;
    margin: 0.5cqh 0 0.4cqh;
    appearance: none;
    border-radius: 1cqh;
    outline: none;
    accent-color: #6f9cff;
    background: linear-gradient(90deg, #6f9cff var(--slider-progress, 20%), rgba(255, 255, 255, 0.18) var(--slider-progress, 20%));
}

.bank-slider-row input::-webkit-slider-thumb {
    width: 2.8cqh;
    height: 2.8cqh;
    appearance: none;
    border: 2px solid white;
    border-radius: 50%;
    background: #6f9cff;
    box-shadow: 0 0.25cqh 0.7cqh rgba(0, 0, 0, 0.35);
    cursor: pointer;
}

.bank-slider-row input::-moz-range-thumb {
    width: 2.8cqh;
    height: 2.8cqh;
    border: 2px solid white;
    border-radius: 50%;
    background: #6f9cff;
    box-shadow: 0 0.25cqh 0.7cqh rgba(0, 0, 0, 0.35);
    cursor: pointer;
}

.bank-document-row>svg:last-child {
    color: rgba(255, 255, 255, 0.3);
}

.bank-document-notice {
    margin: 0;
    color: #65d69a;
    font-size: 1.35cqh;
}

.bottom-app-bank {
    display: flex;
    justify-content: center;
    width: 100%;
    min-height: 18%;
    flex-shrink: 0;
    border-radius: 6cqh;
    z-index: 2;

    .categories {
        display: flex;
        justify-content: space-around;
        align-items: center;
        width: 100%;
        height: 68%;
        border-radius: 6cqh;
        background-color: rgba(51, 51, 51, 0.3);
        box-shadow:
            0 10px 26px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.85),
            inset 0 -6px 10px -6px rgba(0, 0, 0, 0.15);

        .categorie {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            gap: 0.75cqh;
            width: 30%;
            height: 90%;
            border-radius: 5.7cqh;
            border: 0;
            color: rgba(255, 255, 255, 0.8);
            font-family: "SF Pro Display";
            font-size: 1.6cqh;
            font-weight: 500;
            background: transparent;
            transition: all ease-in-out 0.2s;

            &.categorie-selected {
                color: #4d8dff;
            }

            &:hover {
                cursor: pointer;
            }
        }
    }
}

.bank-page-title {
    margin: 1cqh 0 3cqh;
    color: rgba(255, 255, 255, 0.46);
    font-size: 1.45cqh;
}

.bank-page-title h2 {
    margin: 0.5cqh 0 0;
    color: white;
    font-size: 4cqh;
}

.bank-settings-list {
    overflow: hidden;
    margin-top: 3cqh;
    border-radius: 1.7cqh;
    background: rgba(30, 30, 30, 0.92);
}

.bank-settings-list button {
    display: flex;
    align-items: center;
    gap: 1.8cqw;
    min-height: 7cqh;
    width: 100%;
    border: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.07);
    padding: 0 2.5cqw;
    color: rgba(255, 255, 255, 0.82);
    background: transparent;
    font: inherit;
    font-size: 1.55cqh;
    text-align: left;
    cursor: pointer;
}

.bank-settings-list button:last-child {
    border-bottom: 0;
}

.bank-settings-list button svg:last-child {
    margin-left: auto;
    color: rgba(255, 255, 255, 0.3);
}

.bank-settings-list button svg:first-child {
    color: #6f9cff;
}

.bank-detail-list,
.bank-account-list {
    margin-top: 0;
    border: 1px solid rgba(255, 255, 255, 0.06);
    background: rgba(51, 51, 51, 0.92);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.bank-detail-list .bank-toggle-row,
.bank-detail-list .bank-document-row,
.bank-detail-list .bank-detail-row,
.bank-account-list .bank-detail-row {
    min-height: 7.2cqh;
    border: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0;
    padding: 1.1cqh 2cqw;
    background: transparent;
    box-shadow: none;
}

.bank-detail-list .bank-toggle-row:last-child,
.bank-detail-list .bank-document-row:last-child,
.bank-detail-list .bank-detail-row:last-child,
.bank-account-list .bank-detail-row:last-child {
    border-bottom: 0;
}

.bank-detail-list .bank-toggle-row:hover,
.bank-detail-list .bank-document-row:hover {
    border-color: transparent;
    background: rgba(255, 255, 255, 0.06);
}

.bank-slider-list {
    gap: 0;
}

.bank-slider-list .bank-slider-row {
    min-height: 10cqh;
    border: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0;
    padding: 1.6cqh 2cqw;
    background: transparent;
    box-shadow: none;
}

.bank-slider-list .bank-slider-row:last-child {
    border-bottom: 0;
}

.bank-setting-state {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 11cqw;
    box-sizing: border-box;
    border: 1px solid rgba(111, 156, 255, 0.3);
    border-radius: 1.3cqh;
    padding: 0.7cqh 1.2cqw;
    color: #a9c5ff;
    background: rgba(77, 141, 255, 0.15);
    font-size: 1.2cqh;
    font-weight: 600;
    text-align: center;
}

.bank-setting-state.locked {
    border-color: rgba(255, 69, 58, 0.3);
    color: #ffaaa4;
    background: rgba(255, 69, 58, 0.14);
}

.bank-profile-card {
    gap: 2cqw;
    min-height: 9cqh;
    border-radius: 1.7cqh;
    padding: 1.5cqh 2.5cqw;
    background: rgba(30, 30, 30, 0.92);
}

.bank-profile-large {
    width: 5.5cqh;
    height: 5.5cqh;
    font-size: 1.8cqh;
}

.bank-profile-card div {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 0.4cqh;
}

.bank-profile-card strong {
    font-size: 1.8cqh;
}

.bank-profile-card small {
    color: rgba(255, 255, 255, 0.45);
    font-size: 1.3cqh;
}

.bank-profile-card>svg {
    color: rgba(255, 255, 255, 0.3);
}

.bank-sheet-backdrop {
    position: absolute;
    z-index: 10;
    inset: 0;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    background: rgba(0, 0, 0, 0.62);
    backdrop-filter: blur(0.7cqh);
}

.bank-action-sheet {
    position: relative;
    width: 100%;
    min-height: 45%;
    box-sizing: border-box;
    border-radius: 3cqh 3cqh 0 0;
    padding-bottom: 4cqh;
    color: white;
    background: rgba(38, 38, 40, 0.99);
}

.bank-sheet-grabber {
    width: 10cqw;
    height: 0.5cqh;
    margin: 1cqh auto 0;
    border-radius: 1cqh;
    background: rgba(255, 255, 255, 0.35);
}

.bank-action-sheet header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 7cqh;
    padding: 0 3cqw;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    font-size: 1.9cqh;
}

.bank-action-sheet header button {
    border: 0;
    padding: 0;
    color: #6f9cff;
    background: transparent;
    font: inherit;
    font-size: 1.55cqh;
    cursor: pointer;
}

.bank-action-sheet header button:first-child {
    color: rgba(255, 255, 255, 0.7);
}

.bank-action-sheet header button:disabled {
    color: rgba(111, 156, 255, 0.35);
    cursor: default;
}

.bank-form {
    display: flex;
    flex-direction: column;
    gap: 1.6cqh;
    padding: 3cqh 4cqw 0;
}

.bank-form label {
    display: flex;
    flex-direction: column;
    gap: 0.6cqh;
    color: rgba(255, 255, 255, 0.55);
    font-size: 1.45cqh;
}

.bank-form input {
    width: 100%;
    height: 5.6cqh;
    box-sizing: border-box;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 1.4cqh;
    padding: 0 2cqw;
    outline: none;
    color: white;
    background: rgba(255, 255, 255, 0.1);
    font: inherit;
    font-size: 1.8cqh;
}

.bank-form input:focus {
    border-color: rgba(111, 156, 255, 0.85);
}

.bank-form input::placeholder {
    color: rgba(255, 255, 255, 0.35);
}

.bank-amount-input {
    display: flex;
    align-items: center;
    height: 5.6cqh;
    box-sizing: border-box;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 1.4cqh;
    padding-right: 2cqw;
    background: rgba(255, 255, 255, 0.1);
}

.bank-amount-input input {
    flex: 1;
    border: 0;
    background: transparent;
}

.bank-amount-input b {
    color: rgba(255, 255, 255, 0.7);
    font-size: 1.8cqh;
}

.bank-form-error {
    margin: 0;
    color: #ff8179;
    font-size: 1.45cqh;
}

.bank-sheet-enter-active,
.bank-sheet-leave-active {
    transition: opacity 0.25s ease;
}

.bank-sheet-enter-active .bank-action-sheet,
.bank-sheet-leave-active .bank-action-sheet,
.bank-sheet-enter-active .bank-detail-sheet,
.bank-sheet-leave-active .bank-detail-sheet {
    transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.bank-sheet-enter-from,
.bank-sheet-leave-to {
    opacity: 0;
}

.bank-sheet-enter-from .bank-action-sheet,
.bank-sheet-leave-to .bank-action-sheet,
.bank-sheet-enter-from .bank-detail-sheet,
.bank-sheet-leave-to .bank-detail-sheet {
    transform: translateY(100%);
}

.bank-page-enter-active,
.bank-page-leave-active {
    transition: opacity 0.2s ease;
}

.bank-page-enter-from,
.bank-page-leave-to {
    opacity: 0;
}
</style>
