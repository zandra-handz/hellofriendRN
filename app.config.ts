import { ExpoConfig, ConfigContext } from '@expo/config';
import * as dotenv from 'dotenv';
import withIntentFilters from './withIntentFilters';
import withShareIntent from "./withShareIntent";

const config = ({ config: baseConfig }: ConfigContext): ExpoConfig => {
  return {
    ...baseConfig,
    expo: {
      name: 'sampleproject',
      slug: 'sampleproject',
      version: '1.0.0',
      orientation: 'portrait',
      newArchEnabled: true,
      icon: './app/assets/shapes/lizard.png',
      userInterfaceStyle: 'automatic',

      ios: {
        bundleIdentifier: 'com.badrainbowz.sampleproject',
        buildNumber: '1.0.0',
        supportsTablet: true,
        googleServicesFile: './GoogleService-Info.plist',
        infoPlist: {
          NSLocationWhenInUseUsageDescription:
            'This app uses your location to show your current position on the map.',
        },
        config: {
          usesNonExemptEncryption: false,
        },
      },

      android: {
        permissions: [
          'android.permission.READ_MEDIA_IMAGES',
          'android.permission.READ_MEDIA_VIDEO',
          'android.permission.READ_MEDIA_AUDIO',
          'android.permission.POST_NOTIFICATIONS',
          'READ_EXTERNAL_STORAGE',
          'WRITE_EXTERNAL_STORAGE',
        ],
        package: 'com.badrainbowz.sampleproject',
        googleServicesFile: './google-services.json',
        backgroundColor: '#000002',
        config: {
          googleMaps: {
            apiKey: process.env.GOOGLE_API_KEY || 'AIzaSyAY-lQdQaVSKpPz9h2GiX_Jde47nv3FsNg',
          },
        },
        intentFilters: [
          {
            action: 'VIEW',
            data: [{ mimeType: 'image/*' }],
            category: ['BROWSABLE', 'DEFAULT'],
          },
          {
            action: 'SEND',
            data: [{ mimeType: 'image/*' }],
            category: ['DEFAULT'],
          },
        ],
      },

      splash: {
        image: './app/assets/shapes/happyskull.png',
        resizeMode: 'contain',
        backgroundColor: '#000002',
      },

      assetBundlePatterns: ['**/*'],

      web: {
        favicon: './app/assets/favicon.png',
      },

      plugins: [
        [
          '@sentry/react-native/expo',
          {
            url: 'https://sentry.io/',
            project: 'hellofriend',
            organization: 'badrainbowz',
          },
        ],
        'expo-secure-store',
        'expo-font',
        '@react-native-firebase/app',
        '@react-native-firebase/messaging',
        [
          'expo-build-properties',
          {
            ios: { useFrameworks: 'static' },
          },
        ],
        withIntentFilters, // ← use the imported function
        withShareIntent,
      ],

      scheme: 'hellofriend',

      extra: {
        eas: {
          projectId: '3564e25f-85ac-4c60-9f14-93d9153871b3',
        },
      },
    },
  };
};

export default config;
