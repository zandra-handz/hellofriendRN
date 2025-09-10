import axios from "axios";



export const helloFriendApiClientPublic = axios.create({
  baseURL: 'https://badrainbowz.com/', // your API base URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});