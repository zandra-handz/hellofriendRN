import axios from "axios";
// import devSettings from "@/app/styles/DevMode";

import { getBaseURL, subscribeStagingMode } from "@/app/styles/DevMode";



export const helloFriendApiClientPublic = axios.create({
  // baseURL: devSettings.baseURL,
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// FOR DEV ONLY, REMOVE FOR PROD
// Re-resolve baseURL once whenever staging mode is toggled/hydrated.
subscribeStagingMode(() => {
  helloFriendApiClientPublic.defaults.baseURL = getBaseURL();
});