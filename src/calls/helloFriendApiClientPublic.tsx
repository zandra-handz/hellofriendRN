import axios from "axios";
import devSettings from "@/app/styles/DevMode";



export const helloFriendApiClientPublic = axios.create({
  baseURL: devSettings.baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});