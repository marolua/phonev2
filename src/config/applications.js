import MessageIcon from "../assets/appicons/message.png";
import PhoneIcon from "../assets/appicons/call.png";
import SettingsIcon from "../assets/appicons/settingsapp.png";
import BankIcon from "../assets/appicons/bank.png";
import WeatherIcon from "../assets/appicons/weather.png";
import WeatherApp from "../components/apps/WeatherApp.vue";
import ContactIcon from '../assets/appicons/contact.png';

export const applications = [
  {
    id: "weather",
    name: "Météo",
    icon: WeatherIcon,
    page: "weather",
    size: "widget",
    component: WeatherApp,
    city: "Los Santos",
    temperature: "27",
    condition: "Clear Sky & Sunny",
  },
  {
    id: "phone",
    name: "Téléphone",
    icon: PhoneIcon,
    page: "phone",
  },
  {
    id: "messages",
    name: "Messages",
    icon: MessageIcon,
    page: "messages",
  },
  {
    id: "settings",
    name: "Réglages",
    icon: SettingsIcon,
    page: "settings",
  },
  {
    id: "contacts",
    name: "Contacts",
    icon: BankIcon,
    page: "bank",
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
