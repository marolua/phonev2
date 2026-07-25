import MessageIcon from "../assets/appicons/message.svg";
import PhoneIcon from "../assets/appicons/call.svg";
import SettingsIcon from "../assets/appicons/settings.svg";
import BankIcon from "../assets/appicons/bank.svg";
import ContactIcon from "../assets/appicons/contact.svg";
import PhoneApp from "../components/apps/PhoneApp.vue";
import MessageApp from "../components/apps/Message.vue";
import ContactApp from "../components/apps/Contact.vue";
import SettingsApp from "../components/apps/Settings.vue";

export const applications = [
  {
    id: "weather",
    name: "Météo",
    icon: WeatherIcon,
    page: "weather",
    size: "widget",
    city: "Los Santos",
    temperature: "27",
    condition: "Clear Sky & Sunny",
  },
  {
    id: "phone",
    name: "Téléphone",
    icon: PhoneIcon,
    component: PhoneApp,
    page: "phone",
  },
  {
    id: "messages",
    name: "Messages",
    component: MessageApp,
    icon: MessageIcon,
    page: "messages",
  },
  {
    id: "settings",
    name: "Réglages",
    icon: SettingsIcon,
    component: SettingsApp,
    page: "settings",
  },
  {
    id: "contacts",
    name: "Contacts",
    icon: ContactIcon,
    component: ContactApp,
    page: "contact",
  },
  {
    id: "bank-2",
    name: "Banque",
    icon: BankIcon,
    page: "bank",
  },
  {
    id: "bank-3",
    name: "Banque",
    icon: BankIcon,
    page: "bank",
  },
  {
    id: "bank-4",
    name: "Banque",
    icon: BankIcon,
    page: "bank",
  },
  {
    id: "bank-5",
    name: "Banque",
    icon: BankIcon,
    page: "bank",
  },
];
