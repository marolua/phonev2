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
import CameraApp from "../components/apps/Camera.vue";
import PhotosApp from "../components/apps/Photos.vue";
import NotesApp from "../components/apps/Notes.vue";
import CalculatorApp from "../components/apps/Calculator.vue";
import BankApp from "../components/apps/Bank.vue";
import NewsApp from "../components/apps/News.vue";
import ServicesApp from "../components/apps/Services.vue";
import TwitterApp from "../components/apps/Kwiker.vue";

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
    component: CameraApp,
    page: "camera",
  },
  {
    id: "photos",
    name: "Photos",
    icon: GalleryIcon,
    component: PhotosApp,
    page: "photos",
  },
  {
    id: "notes",
    name: "Notes",
    icon: NotesIcon,
    component: NotesApp,
    page: "notes",
  },
  {
    id: "calculator",
    name: "Calculatrice",
    icon: CalculatorIcon,
    component: CalculatorApp,
    page: "calculator",
  },
  {
    id: "bank",
    name: "Banque",
    icon: BankIcon,
    component: BankApp,
    page: "bank",
  },
  {
    id: "news",
    name: "News",
    icon: NewsIcon,
    component: NewsApp,
    page: "news",
  },
  {
    id: "services",
    name: "Services",
    icon: ServicesIcon,
    component: ServicesApp,
    page: "services",
  },
  {
    id: "twitter",
    name: "Kwiker",
    icon: TwitterIcon,
    component: KwikerApp,
    page: "twitter",
  },
];
