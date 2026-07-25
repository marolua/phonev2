import MessageIcon from "../assets/appicons/message.png";
import PhoneIcon from "../assets/appicons/call.png";
import SettingsIcon from "../assets/appicons/settingsapp.png";
import BankIcon from "../assets/appicons/bank.png";
import WeatherIcon from "../assets/appicons/weather.png";
import ContactIcon from "../assets/appicons/contact.png";
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
