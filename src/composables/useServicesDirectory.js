import { onBeforeUnmount, onMounted, ref } from "vue";
import { useFiveMBridge } from "./useFiveMBridge";

const demoCompanies = [
  {
    id: "medical",
    name: "Los Santos Medical Center",
    category: "Santé",
    phone: "555-1001",
    address: "Pillbox Hill",
    hours: "Ouvert 24h/24",
    description:
      "Une équipe médicale disponible pour les urgences et les soins de la ville.",
    color: "linear-gradient(145deg, #d85d78, #6b2c4d)",
  },
  {
    id: "mechanic",
    name: "Benny’s Original Motor Works",
    category: "Automobile",
    phone: "555-2040",
    address: "Strawberry",
    hours: "08:00 – 22:00",
    description: "Réparations, dépannage et personnalisation de véhicules.",
    color: "linear-gradient(145deg, #df8b55, #69313d)",
  },
  {
    id: "cab",
    name: "Downtown Cab Co.",
    category: "Transport",
    phone: "555-3007",
    address: "Centre-ville",
    hours: "Ouvert 24h/24",
    description:
      "Un chauffeur près de vous en quelques minutes, partout à Los Santos.",
    color: "linear-gradient(145deg, #e4b95c, #7a4931)",
  },
  {
    id: "restaurant",
    name: "The Daily Globe",
    category: "Restauration",
    phone: "555-4012",
    address: "Rockford Hills",
    hours: "11:00 – 01:00",
    description:
      "Cuisine locale, réservations et livraisons dans toute la ville.",
    color: "linear-gradient(145deg, #9c6bb2, #3d355e)",
  },
  {
    id: "legal",
    name: "Bureau Hayes & Cole",
    category: "Services",
    phone: "555-5025",
    address: "Alta",
    hours: "09:00 – 18:00",
    description:
      "Conseil juridique et accompagnement administratif pour les habitants.",
    color: "linear-gradient(145deg, #5f86ad, #273950)",
  },
];

demoCompanies.splice(
  0,
  demoCompanies.length,
  {
    id: "lspd",
    name: "Los Santos Police Department",
    category: "Police",
    phone: "555-9111",
    address: "Mission Row",
    hours: "Urgences 24h/24",
    description:
      "Le service de police de Los Santos. Contactez le standard pour une demande non urgente.",
    color: "linear-gradient(145deg, #4b6da8, #1d2747)",
  },
  {
    id: "ems",
    name: "Los Santos EMS",
    category: "Santé",
    phone: "555-9112",
    address: "Pillbox Hill",
    hours: "Urgences 24h/24",
    description:
      "Les secours médicaux de Los Santos pour les urgences, les soins et les demandes médicales.",
    color: "linear-gradient(145deg, #db5b78, #61263f)",
  },
  {
    id: "bennys",
    name: "Benny’s Original Motor Works",
    category: "Automobile",
    phone: "555-2040",
    address: "Strawberry",
    hours: "08:00 – 22:00",
    description: "Réparations, dépannage et personnalisation de véhicules.",
    color: "linear-gradient(145deg, #df8b55, #69313d)",
  },
  {
    id: "burgershot",
    name: "Burger Shot",
    category: "Restauration",
    phone: "555-2929",
    address: "Vespucci Boulevard",
    hours: "10:00 – 02:00",
    description:
      "Le fast-food préféré de Los Santos. Commandes, livraisons et réservations.",
    color: "linear-gradient(145deg, #e45858, #7b2835)",
  },
  {
    id: "lscustoms",
    name: "Los Santos Customs",
    category: "Automobile",
    phone: "555-2041",
    address: "Burton",
    hours: "09:00 – 21:00",
    description:
      "Entretien, peinture et améliorations pour tous les véhicules.",
    color: "linear-gradient(145deg, #808991, #29323c)",
  },
  {
    id: "taxi",
    name: "Downtown Cab Co.",
    category: "Transport",
    phone: "555-3007",
    address: "Centre-ville",
    hours: "Ouvert 24h/24",
    description:
      "Un chauffeur près de vous en quelques minutes, partout à Los Santos.",
    color: "linear-gradient(145deg, #e4b95c, #7a4931)",
  },
  {
    id: "weazel",
    name: "Weazel News",
    category: "Médias",
    phone: "555-5050",
    address: "Vinewood",
    hours: "Rédaction 24h/24",
    description: "Les dernières informations et actualités de Los Santos.",
    color: "linear-gradient(145deg, #d94d75, #582b5d)",
  },
);

const normalizeCompany = (company, index = 0) => ({
  id: company?.id ?? "company-" + index,
  name: company?.name || company?.label || "Entreprise",
  category: company?.category || "Services",
  phone: company?.phone || "555-0000",
  address: company?.address || "Los Santos",
  hours: company?.hours || "Horaires non renseignés",
  description:
    company?.description ||
    "Contactez cette entreprise pour plus d’informations.",
  color: company?.color || demoCompanies[index % demoCompanies.length].color,
});

const normalizeMessage = (message, index = 0) => ({
  id: message?.id ?? "service-message-" + Date.now() + "-" + index,
  companyId: message?.companyId || message?.company?.id || "",
  companyName: message?.companyName || message?.company?.name || "Entreprise",
  senderName: message?.senderName || message?.sender || "Habitant",
  senderPhone: message?.senderPhone || message?.phone || "",
  text: message?.text || message?.message || "",
  time:
    message?.time ||
    new Intl.DateTimeFormat("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(Date.now()),
  createdAt: Number(message?.createdAt ?? Date.now()),
  unread: message?.unread !== false,
  replyTo: message?.replyTo || null,
});

export const useServicesDirectory = (initialCompanies = []) => {
  const { invoke, isFiveM } = useFiveMBridge();
  const companies = ref(
    (initialCompanies.length ? initialCompanies : demoCompanies).map(
      normalizeCompany,
    ),
  );
  const employeeContext = ref(null);
  const inbox = ref([]);
  const sentMessages = ref([]);
  const incomingCalls = ref([]);
  const isLoading = ref(false);
  const lastError = ref("");

  const loadCompanies = async () => {
    if (!isFiveM.value) return companies.value;
    isLoading.value = true;
    const response = await invoke("getServiceCompanies");
    const remoteCompanies = Array.isArray(response)
      ? response
      : response?.companies;
    if (Array.isArray(remoteCompanies))
      companies.value = remoteCompanies.map(normalizeCompany);
    isLoading.value = false;
    return companies.value;
  };

  const loadEmployeeContext = async () => {
    if (!isFiveM.value) {
      employeeContext.value = { isEmployee: false };
      return employeeContext.value;
    }
    const response = await invoke("getServiceEmployeeContext");
    employeeContext.value = response?.employee || response || {};
    return employeeContext.value;
  };

  const loadInbox = async () => {
    if (!isFiveM.value) return inbox.value;
    const response = await invoke("getServiceInbox");
    const messages = Array.isArray(response) ? response : response?.messages;
    if (Array.isArray(messages)) inbox.value = messages.map(normalizeMessage);
    return inbox.value;
  };

  const sendServiceMessage = async (payload) => {
    lastError.value = "";
    const response = await invoke("sendServiceMessage", payload);
    if (isFiveM.value && (!response || response.success === false)) {
      lastError.value =
        response?.message || "Le message n’a pas pu être envoyé.";
      return null;
    }
    const message = normalizeMessage(
      response?.message || {
        ...payload,
        companyName: payload.company?.name,
        senderName: payload.senderName || "Moi",
        unread: false,
      },
    );
    sentMessages.value.unshift(message);
    return message;
  };

  const callServiceCompany = async (payload) => {
    const response = await invoke("callServiceCompany", payload);
    if (isFiveM.value && response?.success === false) {
      lastError.value = response.message || "L’appel n’a pas pu être lancé.";
      return null;
    }
    return response || { success: true };
  };

  const handleServiceEvent = (event) => {
    const payload = event.detail || event.data || {};
    const type = String(payload.type || payload.action || "").toLowerCase();
    const messagePayload = payload.message || payload.serviceMessage;
    const callPayload = payload.call || payload.serviceCall;
    if (type.includes("message") && messagePayload)
      inbox.value.unshift(normalizeMessage(messagePayload));
    if (type.includes("call") && callPayload) {
      incomingCalls.value.unshift({
        id: callPayload.id || "service-call-" + Date.now(),
        companyId: callPayload.companyId || employeeContext.value?.companyId,
        callerName: callPayload.callerName || callPayload.name || "Appelant",
        callerPhone: callPayload.callerPhone || callPayload.phone || "",
        time: callPayload.time || "À l’instant",
      });
    }
  };

  onMounted(() => {
    loadCompanies();
    loadEmployeeContext();
    loadInbox();
    window.addEventListener("services:event", handleServiceEvent);
    window.addEventListener("message", handleServiceEvent);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("services:event", handleServiceEvent);
    window.removeEventListener("message", handleServiceEvent);
  });

  return {
    companies,
    employeeContext,
    inbox,
    sentMessages,
    incomingCalls,
    isLoading,
    lastError,
    isFiveM,
    loadCompanies,
    loadEmployeeContext,
    loadInbox,
    sendServiceMessage,
    callServiceCompany,
  };
};
