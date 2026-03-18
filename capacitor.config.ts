import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.guest.registration",
  appName: "GuestRegistration",
  webDir: "dist",
  server: {
    url: "http://192.168.1.44:5173", // correct laptop IP
    cleartext: true,
  },
};

export default config;
