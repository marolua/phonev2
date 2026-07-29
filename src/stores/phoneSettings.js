import { ref } from "vue";
import defaultWallpaper from "../assets/wallpapers/background42.png";

export const selectedWallpaper = ref(defaultWallpaper);
export const brightness = ref(100);
export const displayScale = ref(100);
export const iconBackgroundColors = ref({
  volume: "#e55646",
  general: "#5d5c5f",
  size: "#f59e0b",
  wallpaper: "#ef4444",
  phone: "#10b981"
});
