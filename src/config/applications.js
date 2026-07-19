import MessageIcon from "../assets/appicons/message.png";
import PhoneIcon from "../assets/appicons/call.png";
import SettingsIcon from "../assets/appicons/settingsapp.png";
import BankIcon from "../assets/appicons/bank.png";
import WeatherIcon from "../assets/appicons/weather.png";

export const applications = [
  {
    id: "weather",
    name: "Météo",
    icon: WeatherIcon,
    page: "weather",
    size: "widget",
    city: "Melbourne",
    temperature: "27",
    condition: "Sunny & Clear skies",
  },
  {
    id: "messages",
    name: "Messages",
    icon: MessageIcon,
    page: "messages",
  },
  {
    id: "phone",
    name: "Téléphone",
    icon: PhoneIcon,
    page: "phone",
  },
  {
    id: "settings",
    name: "Réglages",
    icon: SettingsIcon,
    page: "settings",
  },
  {
    id: "bank",
    name: "Banque",
    icon: BankIcon,
    page: "bank",
  },
];
