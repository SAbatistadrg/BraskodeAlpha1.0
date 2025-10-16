import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.braskode.sandech',
  appName: 'Braskode',
  webDir: 'dist',
  plugins: {
    Camera: {
      saveToGallery: true,
      permissions: {
        'android.permission.CAMERA': true,
        'android.permission.READ_EXTERNAL_STORAGE': true,
        'android.permission.WRITE_EXTERNAL_STORAGE': true
      }
    },
    Network: {
      allowCORS: true
    },
    Http: {
      enabled: true
    }
  },
  server: {
    allowNavigation: [
      "localhost", 
      "18.230.83.226"
    ],
    cleartext: true
  }
};

export default config;
