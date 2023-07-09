import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'locanote',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    LocalNotifications: {
      //smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#92032E",
      sound: "res://raw/notification.wav",
    },
  },
};

export default config;
