import MessageIcon from "../assets/appicons/message.svg";
import PhoneIcon from "../assets/appicons/call.svg";
import SettingsIcon from "../assets/appicons/settings.svg";
import BankIcon from "../assets/appicons/bank.svg";
import ContactIcon from "../assets/appicons/contact.svg";
import PhotoIcon from "../assets/appicons/camera.svg";
import GalleryIcon from "../assets/appicons/gallery.svg";
import NotesIcon from "../assets/appicons/notes.svg";
import CalculatorIcon from "../assets/appicons/calculator.svg";
import NewsIcon from "../assets/appicons/news.svg";
import ServicesIcon from "../assets/appicons/Services.jpg";
import TwitterIcon from "../assets/appicons/twitter.png";
import PhoneApp from "../components/apps/PhoneApp.vue";
import MessageApp from "../components/apps/Message.vue";
import ContactApp from "../components/apps/Contact.vue";
import SettingsApp from "../components/apps/Settings.vue";

export const applications = [
  {
    id: "weather",
    name: "Météo",
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
    id: "camera",
    name: "Caméra",
    icon: PhotoIcon,
    component: SettingsApp,
    page: "camera",
  },
  {
    id: "photos",
    name: "Photos",
    icon: GalleryIcon,
    component: SettingsApp,
    page: "photos",
  },
  {
    id: "notes",
    name: "Notes",
    icon: NotesIcon,
    component: SettingsApp,
    page: "notes",
  },
  {
    id: "calculator",
    name: "Calculatrice",
    icon: CalculatorIcon,
    component: SettingsApp,
    page: "calculator",
  },
  {
    id: "bank",
    name: "Banque",
    icon: BankIcon,
    component: SettingsApp,
    page: "bank",
  },
  {
    id: "news",
    name: "News",
    icon: NewsIcon,
    component: SettingsApp,
    page: "news",
  },
  {
    id: "services",
    name: "Services",
    icon: ServicesIcon,
    component: SettingsApp,
    page: "services",
  },
  {
    id: "twitter",
    name: "Kwiker",
    icon: TwitterIcon,
    component: SettingsApp,
    page: "twitter",
  },
];
