// const DEV_MODE = false;

// const devSettings = {
//     devMode: DEV_MODE,
//     baseURL: DEV_MODE ? "https://staging.badrainbowz.com/" : "https://badrainbowz.com/",
//     socketURL: DEV_MODE ? "wss://staging.badrainbowz.com" : "wss://badrainbowz.com",
// };


// export default devSettings;


import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "stagingMode";

const CONFIG = {
  prod: {
    baseURL: "https://badrainbowz.com/",
    socketURL: "wss://badrainbowz.com",
  },

  staging: {
    baseURL: "https://staging.badrainbowz.com/",
    socketURL: "wss://staging.badrainbowz.com",
  },
};

let stagingMode = false;

// FOR DEV ONLY, REMOVE FOR PROD
type StagingListener = (staging: boolean) => void;
const stagingListeners = new Set<StagingListener>();

// Subscribers (axios clients, socket) re-resolve their URL whenever staging
// mode flips. Returns an unsubscribe fn.
export const subscribeStagingMode = (cb: StagingListener) => {
  stagingListeners.add(cb);
  return () => stagingListeners.delete(cb);
};

const notifyStagingListeners = () => {
  stagingListeners.forEach((cb) => cb(stagingMode));
};

export const isStagingMode = () => stagingMode;

export const getBaseURL = () => {
  return stagingMode
    ? CONFIG.staging.baseURL
    : CONFIG.prod.baseURL;
};

export const getSocketURL = () => {
  return stagingMode
    ? CONFIG.staging.socketURL
    : CONFIG.prod.socketURL;
};

export const setStagingMode = async (enabled: boolean) => {
    console.log('SETTING STAGING')
  stagingMode = enabled;
  // FOR DEV ONLY, REMOVE FOR PROD
  notifyStagingListeners();

  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(enabled),
  );
};

export const hydrateStagingMode = async () => {
  const saved = await AsyncStorage.getItem(STORAGE_KEY);

  if (saved !== null) {
    stagingMode = JSON.parse(saved);
    // FOR DEV ONLY, REMOVE FOR PROD
    notifyStagingListeners();
  }

  return stagingMode;
};