import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const helloFriendApiClient = axios.create({
  baseURL: 'https://badrainbowz.com/',
  timeout: 10000,
});

let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token) {
  refreshSubscribers.forEach(cb => cb(token));
  refreshSubscribers = [];
}

const setAuthHeader = (token) => {
  if (token) {
    helloFriendApiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete helloFriendApiClient.defaults.headers.common['Authorization'];
  }
};

const deleteTokens = async () => {
  await SecureStore.deleteItemAsync('accessToken');
  await SecureStore.deleteItemAsync('refreshToken');
  await SecureStore.deleteItemAsync('pushToken');
};

const refreshTokenFunct = async () => {
  const storedRefreshToken = await SecureStore.getItemAsync('refreshToken');
  if (!storedRefreshToken) {
    console.warn('No refresh token available');
    return null;
  }

  try {
    const response = await helloFriendApiClient.post('/users/token/refresh/', {
      refresh: storedRefreshToken,
    });

    const newAccessToken = response.data.access;
    await SecureStore.setItemAsync('accessToken', newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error('Error refreshing token api file:', error);
    throw error;
  }
};

helloFriendApiClient.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

helloFriendApiClient.interceptors.response.use(
  (response) => {
    console.log('Interceptor was here!');
    return response;
  },
  async (error) => {
    const { config, response } = error;
    const originalRequest = config;

    if (response && response.status === 401 && !(originalRequest as any)._retry) {
      if (!isRefreshing) {
        isRefreshing = true;
        (originalRequest as any)._retry = true;

        try {
          const newAccessToken = await refreshTokenFunct();
          if (!newAccessToken) throw new Error('Failed to refresh token');

          onRefreshed(newAccessToken);
          setAuthHeader(newAccessToken);
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          isRefreshing = false;
          return helloFriendApiClient(originalRequest);
        } catch (err) {
          isRefreshing = false;
          await deleteTokens(); // Optional: wipe tokens if refresh fails
          return Promise.reject(err);
        }
      } else {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            resolve(helloFriendApiClient(originalRequest));
          });
        });
      }
    }

    return Promise.reject(error);
  }
);

export const signout = async () => {
    try {
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
        await SecureStore.deleteItemAsync('tokenExpiry');
        setAuthHeader(null); 
        console.log("API signout: Authorization header cleared");
        return true;
    } catch (e) {
        console.log("API signout error", e);
        return false;
    }
};

export { helloFriendApiClient, setAuthHeader };
