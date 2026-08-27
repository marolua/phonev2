import { ref } from "vue";
import defaultWallpaper from "../assets/wallpapers/background42.png";

export const selectedWallpaper = ref(defaultWallpaper);
export const brightness = ref(100);
export const displayScale = ref(100);
export const phoneNumber = ref("521756");
export const selectedLanguage = ref("Français");
export const iconBackgroundColors = ref({
  volume: "#e55646",
  general: "#5d5c5f",
  size: "#0b69f5",
  wallpaper: "#2147f0",
  phone: "#32b910",
});

// Volume settings (0-100)
export const callVolume = ref(70);
export const systemVolume = ref(60);

export const resetPhoneSettings = () => {
  selectedWallpaper.value = defaultWallpaper;
  brightness.value = 100;
  displayScale.value = 100;
  callVolume.value = 70;
  systemVolume.value = 60;
  selectedLanguage.value = "Français";
};
