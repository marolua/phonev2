import { ref } from "vue";
import defaultWallpaper from "../assets/wallpapers/background42.png";

export const selectedWallpaper = ref(defaultWallpaper);
export const brightness = ref(100);
export const displayScale = ref(100);
export const globalVolume = ref(75);
export const callVolume = ref(80);
export const iconBackgroundColors = ref({
  volume: "#e55646",
  general: "#5d5c5f",
  size: "#0b69f5",
  wallpaper: "#2147f0",
  phone: "#32b910",
});
