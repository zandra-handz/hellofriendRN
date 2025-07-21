import * as SecureStore from "expo-secure-store";
//export const API_URL = 'https://ac67e9fa-7838-487d-a3bc-e7a176f4bfbf-dev.e1-us-cdp-2.choreoapis.dev/hellofriend/hellofriend/rest-api-be2/v1.0/';

//export const API_URL = 'http://167.99.233.148:8000/';
//export const API_URL = 'https://badrainbowz.com/';

import { helloFriendApiClient, setAuthHeader } from "./helloFriendApiClient";

//axios.defaults.baseURL = API_URL;

// export const setAuthHeader = (token) => {
//     if (token) {
//         axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     } else {
//         delete axios.defaults.headers.common['Authorization'];
//     }
// };

//

// const refreshTokenFunct = async () => {
//     const storedRefreshToken = await SecureStore.getItemAsync('refreshToken');
//     if (!storedRefreshToken) {
//         console.warn('No refresh token available');
//         return null;  // Return early if there's no refresh token
//     }

//     try {
//         const response = await axios.post('/users/token/refresh/', { refresh: storedRefreshToken });
//         const newAccessToken = response.data.access;

//         await SecureStore.setItemAsync('accessToken', newAccessToken);
//         return newAccessToken;
//     } catch (error) {
//         console.error('Error refreshing token api file:', error);
//         throw error;
//     }
// };

export const deleteTokens = async () => {
  await SecureStore.deleteItemAsync("accessToken");
  await SecureStore.deleteItemAsync("refreshToken");
  await SecureStore.deleteItemAsync("pushToken");
  await SecureStore.deleteItemAsync("tokenExpiry");
};

export const signout = async () => {
  try {
    await deleteTokens(); // does all the below:
    // await SecureStore.deleteItemAsync('accessToken');
    // await SecureStore.deleteItemAsync('refreshToken');
    // await SecureStore.deleteItemAsync('pushToken');
    // await SecureStore.deleteItemAsync('tokenExpiry');
    setAuthHeader(null);
    return true;
  } catch (e) {
    console.log("API signout error", e);
    return false;
  }
};
// Function to handle token refresh
// let isRefreshing = false;
// let refreshSubscribers = [];

// // Subscribe to token refresh completion
// const subscribeTokenRefresh = (callback) => {
//     refreshSubscribers.push(callback);
// };

// // Notify subscribers after token refresh
// const onRefreshed = (newAccessToken) => {
//     refreshSubscribers.forEach(callback => callback(newAccessToken));
//     refreshSubscribers = [];
// };

// Axios Request Interceptor
// axios.interceptors.request.use(
//     async (config) => {
//         const token = await SecureStore.getItemAsync('accessToken');
//         if (token) {
//             config.headers['Authorization'] = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// // Axios Response Interceptor
// axios.interceptors.response.use(

//     (response) => {
//         console.log('Interceptor was here!');
//         return response;
//     },
//     async (error) => {
//         const { config, response } = error;
//         const originalRequest = config;

//         // If the error is a 401 and the request has not been retried yet
//         if (response && response.status === 401 && !originalRequest._retry) {
//             console.log('Interceptor caught a 401!');
//             if (!isRefreshing) {
//                 isRefreshing = true;
//                 originalRequest._retry = true;

//                 try {
//                     const newAccessToken = await refreshTokenFunct();

//                     if (!newAccessToken) {
//                         throw new Error("Failed to refresh token: new access token is null or undefined");
//                     }
//                     console.log('Interceptor acquired new token utilizing refreshTokenFunct!', newAccessToken);

//                     console.log('Interceptor acquired new token utilizing refreshToken!', newAccessToken);
//                     isRefreshing = false;

//                     // Update the Authorization header for all queued requests
//                     onRefreshed(newAccessToken);
//                     setAuthHeader(newAccessToken);
//                     originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
//                     return axios(originalRequest);
//                 } catch (err) {
//                     isRefreshing = false;
//                     return Promise.reject(err);
//                 }
//             } else {
//                 // If token refresh is already in progress, queue the request
//                 return new Promise((resolve) => {
//                     subscribeTokenRefresh((newAccessToken) => {
//                         originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
//                         resolve(axios(originalRequest));
//                     });
//                 });
//             }
//         }

//         return Promise.reject(error);
//     }
// );

export const signinWithoutRefresh = async ({ username, password }) => {
  try {
    const response = await helloFriendApiClient.post("/users/token/", {
      username,
      password,
    });
    const newAccessToken = response.data.access;
    const newRefreshToken = response.data.refresh;

    await SecureStore.setItemAsync("accessToken", newAccessToken);
    await SecureStore.setItemAsync("refreshToken", newRefreshToken);

    setAuthHeader(newAccessToken);

    return response;
  } catch (e) {
    console.error("Error during signinWithoutRefresh:", e);

    if (e.response) {
      console.log("Server responded with:", e.response.data);
      throw new Error(e.response.data.msg || "Invalid credentials"); // Explicit error for invalid credentials
    } else if (e.request) {
      console.log("No response from server:", e.request);
      throw new Error("No response from server, please check your network");
    } else {
      console.log("Unexpected error:", e.message);
      throw new Error("Unexpected error occurred during signin");
    }
  }
};

export const sendResetCodeEmail = async (email) => {
  try {
    return await helloFriendApiClient.post("/users/send-reset-code/", {
      email: email,
    });
  } catch (e) {
    console.log("error sending email:", e);
    return { error: true, msg: e.response.data.msg };
  }
};

export const verifyResetCodeEmail = async ({ email, resetCode }) => {
  // console.log(email);
  // console.log(resetCode);

  try {
    response = await helloFriendApiClient.post("/users/verify-reset-code/", {
      email: email,
      reset_code: resetCode,
    });

    return response;
  } catch (e) {
    console.log("error checking reset code:", e);
    return { error: true, msg: e.response.data.msg };
  }
};

export const resetPassword = async ({ email, resetCode, newPassword }) => {
  // console.log(email);
  // console.log(resetCode);

  try {
    response = await helloFriendApiClient.post("/users/reset-password/", {
      email: email,
      reset_code: resetCode,
      new_password: newPassword,
    });
    // console.log(response);
    return response;
  } catch (e) {
    console.log("error resetting password:", e);
    return { error: true, msg: e.response.data.msg };
  }
};

export const sendEmail = async (email) => {
  try {
    return await helloFriendApiClient.post("/users/send-email/", {
      email: email,
    });
  } catch (e) {
    console.log("error sending email:", e);
    return { error: true, msg: e.response.data.msg };
  }
};

export const signup = async ({ username, email, password }) => {
  try {
    return await helloFriendApiClient.post("/users/sign-up/", {
      username,
      email,
      password,
    });
  } catch (e) {
    console.log("error creating new account:", e);
    return { error: true, msg: e.response.data.msg };
  }
};

export const signin = async ({ username, password }) => {
  //console.log("Signing in with credentials:", { username, password });
  try {
    const result = await helloFriendApiClient.post("/users/token/", {
      username,
      password,
    });
    console.log(`API POST CALL signin`);

    if (result.data && result.data.access) {
      setAuthHeader(result.data.access);
      return result;
    } else {
      throw new Error("Unexpected response format");
    }
  } catch (e) {
    console.error("Error during signin:", e);
    if (e.response) {
      console.log("Server responded with:", e.response.data);
      throw new Error(e.response.data.msg || "Invalid credentials");
    } else {
      console.log("Network error or server not reachable");
      throw new Error("Network error or server not reachable");
    }
  }
};

// this call's serializer currently adds categories
export const getUserSettings = async () => {
  // console.log("Default common headers:", helloFriendApiClient.defaults.headers);

  try {
    const response = await helloFriendApiClient.get(`/users/settings/`);
     console.log("API GET Call getUserSettings", response.data);

    return response.data;
    } catch (error) {
      console.error(`USER SETTINGS ERRORED`);
    // if (error.response) {
    //   // The request was made and the server responded with a status code
    //   console.error("Error response:", error.response.data);
    // } else if (error.request) {
    //   // The request was made but no response was received
    //   console.error("Error request:", error.request);
    // } else {
    //   // Something happened in setting up the request that triggered an Error
    //   console.error("Error message:", error.message);
    // }
    throw error;
  }
};

export const getUserCategories = async (userId) => {
  try {
    const response = await helloFriendApiClient.get(`/users/${userId}/categories/`);
    // console.log("API GET Call getUserCategories", response.data);

    return response.data;
    } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error("Error response:", error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Error request:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error message:", error.message);
    }
    throw error;
  }
};


export const fetchCategoriesHistoryAPI = async (categoryId, returnNonZeroesOnly, page = 1) => {
  try {
    const params = new URLSearchParams();

    if (categoryId) params.append("user_category_id", categoryId);
    if (returnNonZeroesOnly) params.append("only_with_capsules", "true");
    params.append("page", page);

    const response = await helloFriendApiClient.get(`/users/categories/history/?${params.toString()}`);
    console.log(`response from cat history`, response.data);
    if (response?.data) {
      return response.data; // DRF-style: { count, next, previous, results }
    } else {
      console.log("No data returned from fetchCategoriesHistoryAPI.");
      return { results: [], next: null, previous: null };
    }
  } catch (error) {
    console.error("Error fetching category history: ", error?.response || error);
    throw error;
  }
};



export const fetchCapsulesHistoryAPI = async ({ categoryId, friendId, returnNonZeroesOnly = true, page = 1 }) => {

  try {
    const params = new URLSearchParams();

    if (categoryId) params.append("user_category_id", categoryId);
       if (friendId) params.append("friend_id", friendId);
    if (returnNonZeroesOnly) params.append("only_with_capsules", "true");
    params.append("page", page);

    const response = await helloFriendApiClient.get(`/friends/categories/history/capsules/?${params.toString()}`);
    // console.log(`response from capsules history`, response.data);
    if (response?.data) {
      return response.data; // DRF-style: { count, next, previous, results }
    } else {
      console.log("No data returned from fetchCapsulesHistoryAPI.");
      return { results: [], next: null, previous: null };
    }
  } catch (error) {
    console.error("Error fetching category history: ", error?.response || error);
    throw error;
  }
};

export const fetchCategoriesHistoryCountAPI = async ( {friendId, returnNonZeroesOnly}) => {
  // console.log(`non zeros: `, returnNonZeroesOnly);
   console.log('~~~~~~~~~~~!~~~~~~~~~~~~!~~~~~~~~~~~~!~~~~~~~~~~!fetchCategoriesHistoryCountAPI  called, friendid: ', friendId);
  try {


    const params = new URLSearchParams();
params.append("only_with_capsules", returnNonZeroesOnly.toString());
if (friendId != null) {
  params.append("friend_id", friendId.toString());
}
const url = `/users/categories/history/summary/?${params.toString()}`;
    
    const response = await helloFriendApiClient.get(
      `/users/categories/history/summary/?${params.toString()}`);
    //  console.log(`COUNT ONLY`, response.data);
 if (response && response.data) {
  // console.log(`API CALL fetchCategoriesistory:`, response.data);

 
  return response.data;
 
    } else {
       console.log("fetchThoughtCapsules: no capsules added yet");
      return []; // Return an empty array if no capsules
    }
  } catch (error) {
    console.error("Error fetching thought capsules: ", error.response);
    throw error;
  }
};


export const createUserCategory = async (userId, newCategoryData) => { 
    console.log(`newCategoryData: `); //, newCategoryData);
  try {
    const response = await helloFriendApiClient.post(
      `/users/${userId}/categories/add/`,
      newCategoryData
    ); 
    // console.log('createusercategory response: ', response.data); // Log the response data
    return response.data; // Ensure this returns the expected structure
  } catch (error) {
    console.error("Error updating user settings:", error);
    throw error;
  }
};

export const updateUserCategory = async (userId, categoryId, updates) => {
  console.log(`updates for user category: `, updates);
  
  try {
    const response = await helloFriendApiClient.patch(
     `/users/${userId}/category/${categoryId}/`,
      updates
    );
    console.log("API PATCH CALL updateUserCategory", response.data);
    //console.log('API response:', response.data); // Log the response data
    return response.data; // Ensure this returns the expected structure
  } catch (error) {
    console.error("Error updating user category:", error);
    throw error;
  }
};


export const deleteUserCategory = async (userId, categoryId) => {
      console.log(`delete category with: `, userId, categoryId);
  try {
    const response = await helloFriendApiClient.delete(
     `/users/${userId}/category/${categoryId}/`
    );
    console.log("API DELTE CALL deleteUserCategory");
    //console.log('API response:', response.data); // Log the response data
    return response.data; // Ensure this returns the expected structure
  } catch (error) {
    console.error("Error deleting user category:", error);
    throw error;
  }
};


export const getCurrentUser = async () => {
  try {
    const response = await helloFriendApiClient.get("/users/get-current/");
    console.log("API GET Call getCurrentUser");//, response.data);
 
    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error("Error response:", error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Error request:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error message:", error.message);
    }
    throw error;
  }
};

export const updateSubscription = async (userId, fieldUpdates) => {
  //is_subscribed_user, subscription_id, subscription_expiration_date
  try {
    const response = await helloFriendApiClient.patch(
      `/users/${userId}/subscription/update/`,
      fieldUpdates
    );
    console.log("API PATCH CALL updateSubscription");
    //console.log('API response:', response.data); // Log the response data
    return response.data; // Ensure this returns the expected structure
  } catch (error) {
    console.error("Error updating user subscription:", error);
    throw error;
  }
};

export const refreshAccessToken = async (refToken) => {
  try {
    const response = await helloFriendApiClient.post("/users/token/refresh/", {
      refresh: refToken,
    });
    const newAccessToken = response.data.access;
    setAuthHeader(newAccessToken);
    return response;
  } catch (e) {
    return { error: true, msg: e.response.data.msg };
  }
};

export const fetchFriendList = async () => {
  try {
    const response = await helloFriendApiClient.get("/friends/all/");
 
    return response.data;
  } catch (error) {
    console.error("Error fetching friend list:", error);
    throw error;
  }
};

export const fetchFriendAddresses = async (friendId) => {
  try {
    const response = await helloFriendApiClient.get(
      `/friends/${friendId}/addresses/all/`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching friend dashboard data:", error);
    throw error;
  }
};

export const addFriendAddress = async (friendId, addressData) => {
  try {
    const response = await helloFriendApiClient.post(
      `/friends/${friendId}/addresses/add/`,
      addressData
    ); // Include friendId in the URL
    return response.data;
  } catch (error) {
    console.error("Error adding friend address:", error);
    throw error;
  }
};

export const updateFriendAddress = async (
  friendId,
  addressId,
  fieldUpdates
) => {
  try {
    const response = await helloFriendApiClient.patch(
      `/friends/${friendId}/address/${addressId}/`,
      fieldUpdates
    );

    console.log(
      "API PATCH CALL updateFriendAddress: ",
      addressId,
      fieldUpdates
    );

    return response.data;
  } catch (error) {
    console.error("Error adding friend address:", error);
    throw error;
  }
};

export const deleteFriendAddress = async (friendId, addressId) => {
  try {
    const response = await helloFriendApiClient.delete(
      `/friends/${friendId}/address/${addressId}/`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting user address:", error);
    throw error;
  }
};

// path('<int:user_id>/addresses/add/', views.AddAddressView.as_view()),
// path('<int:user_id>/addresses/delete/', views.DeleteAddressView.as_view()),
// path('<int:user_id>/settings/', views.UserSettingsDetail.as_view()),
// path('<int:user_id>/settings/update/', views.UserSettingsDetail.as_view()),
// path('<int:user_id>/profile/', views.UserProfileDetail.as_view()),
// path('<int:user_id>/profile/update/', views.UserProfileDetail.as_view()),
// path('<int:user_id>/subscription/update/', views.UpdateSubscriptionView.as_view()),

// path('addresses/all/', views.UserAddressesAll.as_view()),
// path('addresses/validated/', views.UserAddressesValidated.as_view()),
// path('addresses/add/', views.UserAddressCreate.as_view()),
// path('address/<int:pk>/', views.UserAddressDetail.as_view()),

export const fetchUserAddresses = async () => {
  try {
    const response = await helloFriendApiClient.get(`/users/addresses/all/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user addresses:", error);
    throw error;
  }
};

export const addUserAddress = async (addressData) => {
  try {
    console.log(addressData);

    const response = await helloFriendApiClient.post(
      `/users/addresses/add/`,
      addressData
    ); // Pass addressData directly
    return response.data;
  } catch (error) {
    console.error("Error adding user address:", error);
    throw error;
  }
};

//not finished yet 12/13/2024
export const updateUserAddress = async (addressId, fieldUpdates) => {
  try {
    const response = await helloFriendApiClient.patch(
      `/users/address/${addressId}/`,
      fieldUpdates
    );

    console.log("API PATCH CALL updateUserAddress: ", addressId, fieldUpdates);

    return response.data;
  } catch (error) {
    console.error("Error adding user address:", error);
    throw error;
  }
};

export const deleteUserAddress = async (addressId) => {
  try {
    const response = await helloFriendApiClient.delete(
      `/users/address/${addressId}/`
    );

    if (response.status === 200) {
      console.log("Address deleted successfully");
      return { success: true };
    }

    return { success: false, message: "Unexpected response status." };
  } catch (error) {
    console.error("Error deleting user address:", error);

    // Check if error response is available and get the status
    if (error.response) {
      return {
        success: false,
        message: `Request failed with status code ${error.response.status}`,
      };
    }

    return { success: false, message: "Network error or other issue." };
  }
};

export const validateAddress = async (userId, address) => {
  try {
    const response = await helloFriendApiClient.post(
      `/friends/location/validate-only/`,
      {
        user: userId,
        address: address,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error validating address:", error);
  }
};

// export const GetTravelComparisons = async (locationData) => {
export const GetTravelComparisons = async (
  userAddress,
  friendAddress,
  location
) => {
  try {
    const locationData = {
      address_a_address: userAddress.address,
      address_a_lat: parseFloat(userAddress.lat),
      address_a_long: parseFloat(userAddress.lng),
      address_b_address: friendAddress.address,
      address_b_lat: parseFloat(friendAddress.lat),
      address_b_long: parseFloat(friendAddress.lng),
      destination_address: location.address,
      destination_lat: parseFloat(location.latitude),
      destination_long: parseFloat(location.longitude),
      perform_search: false,
    };

    const response = await helloFriendApiClient.post(
      `/friends/places/`,
      locationData
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting addresses:", error);
    throw error; // <== re-throw to notify react-query about the error
  }
};

export const SearchForMidpointLocations = async (locationData) => {
  try {
    const response = await helloFriendApiClient.post(
      `/friends/places/near-midpoint/`,
      locationData
    );
    //console.log('Search for Midpoint Response:', response.data);
    return response.data.suggested_places;
  } catch (error) {
    console.error("Error searching for midpoint locations:", error);
  }
};

export const updateUserAccessibilitySettings = async (fieldUpdates) => {
  try {
    const response = await helloFriendApiClient.patch(
      `/users/settings/update/`,
      fieldUpdates
    );
    console.log("API PATCH CALL updateUserAccessibilitySettings");
    //console.log('API response:', response.data); // Log the response data
    return response.data; // Ensure this returns the expected structure
  } catch (error) {
    console.error("Error updating user settings:", error);
    throw error;
  }
};

export const updateUserProfile = async (
  userId,
  firstName,
  lastName,
  dateOfBirth,
  gender,
  address
) => {
  try {
    await helloFriendApiClient.put(`/users/${userId}/profile/update/`, {
      user: userId,
      first_name: firstName,
      last_name: lastName,
      date_of_birth: dateOfBirth,
      gender: gender,
      addresses: address,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export const fetchFriendDashboard = async (friendId) => {
  console.warn('fetching frienddashboard for friend: ', friendId);
  try {
    const response = await helloFriendApiClient.get(
      `/friends/${friendId}/dashboard/`
    );
    console.log("API GET CALL fetchFriendDashboard"); //, response.data); //, response.data );

    return response.data;
  } catch (error) {
    console.error("Error fetching friend dashboard data:", error);
    throw error;
  }
};

export const remixAllNextHelloes = async (userId) => {
  try {
    const response = await helloFriendApiClient.post(
      `/friends/remix/all/`,
      userId
    );
    // console.log(response.data);
    return response.status;
  } catch (error) {
    console.error("Error remixing next helloes:", error);
    throw error;
  }
};

export const addToFriendFavesLocations = async (data) => {
  //console.log(data);
  try {
    const response = await helloFriendApiClient.patch(
      `/friends/${data.friendId}/faves/add/location/`,
      {
        friend: data.friendId,
        user: data.userId,
        location_id: data.locationId, // Use an array if locationId is a single ID
      }
    );
    //console.log('Location added to favorites: ', response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding favorite location:", error);
    throw error;
  }
};

export const removeFromFriendFavesLocations = async (data) => {
  try {
    const response = await helloFriendApiClient.patch(
      `/friends/${data.friendId}/faves/remove/location/`,
      {
        user: data.userId,
        friend: data.friendId,
        location_id: data.locationId,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error removing favorite location:", error);
    throw error;
  }
};

export const updateFriendFavesColorThemeSetting = async ({
  userId,
  friendId,
  darkColor,
  lightColor,
  manualTheme,
}) => {
  try { 
    const response = await helloFriendApiClient.patch(
      `/friends/${friendId}/faves/`,
      {
        friend: friendId,
        user: userId,
        dark_color: darkColor,
        light_color: lightColor,
        use_friend_color_theme: manualTheme,
      }
    );

    console.log("API PATCH CALL updateFriendFavesColorThemeSetting");
    return response.data;
  } catch (error) {
    console.error("Error updating color theme setting for friend:", error);
    throw error;
  }
};

//redundant
// export const resetFriendFavesColorThemeToDefault = async (userId, friendId, setting) => {

//     try {
//         const response = await helloFriendApiClient.patch(`/friends/${friendId}/faves/`, {

//             friend: friendId,
//             user: userId,
//             dark_color: '#4caf50',
//             light_color: '#a0f143',
//             font_color: '#000000',
//             font_color_secondary: '#000000',
//             use_friend_color_theme: false,
//         });

//         console.log(`API PATCH CALL resetFriendFavesColorThemeToDefault`);
//         return response.data;
//     } catch (error) {
//         console.error('Error updating color theme setting for friend:', error);
//         throw error;
//     }
// };

//Don't think this is in use anymore, it was a dumb option
export const updateFriendFavesColorThemeGradientDirection = async (
  userId,
  friendId,
  setting
) => {
  //console.log(`color theme gradient direction call, ${userId}, ${friendId}, ${setting}`);
  try {
    const response = await helloFriendApiClient.patch(
      `/friends/${friendId}/faves/`,
      {
        friend: friendId,
        user: userId,
        second_color_option: setting,
      }
    );
    console.log(
      "Color theme gradient direction for friend updated: ",
      response.data
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error updating color theme gradient direction for friend:",
      error
    );
    throw error;
  }
};

export const updateFriendFavesColorTheme = async (
  userId,
  friendId,
  darkColor,
  lightColor,
  fontColor,
  fontColorSecondary
) => {
  try {
    const response = await helloFriendApiClient.patch(
      `/friends/${friendId}/faves/`,
      {
        friend: friendId,
        user: userId,
        dark_color: darkColor,
        light_color: lightColor,
        font_color: fontColor,
        font_color_secondary: fontColorSecondary,
        use_friend_color_theme: true,
      }
    );
    console.log("Color theme for friend updated: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating color theme for friend:", error);
    throw error;
  }
};

//this will update the theme colors in Friend Faves and Friend but will
//leave the saved colors in Friend untouched, so that they can be used later
export const resetFriendFavesColorThemeToDefaultOld = async (
  userId,
  friendId,
  darkColor,
  lightColor,
  fontColor,
  fontColorSecondary
) => {
  try {
    const response = await helloFriendApiClient.patch(
      `/friends/${friendId}/faves/`,
      {
        friend: friendId,
        user: userId,
        dark_color: darkColor,
        light_color: lightColor,
        font_color: fontColor,
        font_color_secondary: fontColorSecondary,
        use_friend_color_theme: false,
      }
    );
    console.log("Color theme for friend updated: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating color theme for friend:", error);
    throw error;
  }
};

export const fetchUpcomingHelloes = async () => {
  try {
    const response = await helloFriendApiClient.get("/friends/upcoming/");
    //  console.log("API GET CALL fetchUpcomingHelloes", response.data);
    return response.data;
  } catch (error) {
    console.error("ERROR API GET CALL fetchUpcomingHelloes:", error);

    if (error.response) {
      // console.error('Response Status:', error.response.status);
      // console.error('Response Headers:', error.response.headers);
      console.error("Response Data:", error.response.data); // Error message from server
    } else if (error.request) {
      // If the request was made but no response was received
      // console.error('Error Request:', error.request);
    } else {
      // If something else caused the error
      //  console.error('Error Message:', error.message);
    }

    throw error; // Re-throw the error so the calling function can handle it
  }
};

export const fetchMomentsAPI = async (friendId) => {
  // console.log('~~~~~~~~~~~!~~~~~~~~~~~~!~~~~~~~~~~~~!~~~~~~~~~~!fetchMomentsAPI called');
  try {
    const response = await helloFriendApiClient.get(
      `/friends/${friendId}/thoughtcapsules/`
    );
    //  console.log(response.data);
    if (response && response.data) {
      const capsules = response.data.map((capsule) => ({
        id: capsule.id,
        typedCategory: capsule.typed_category || "Uncategorized",
        capsule: capsule.capsule,
        created: capsule.created_on,
        preAdded: capsule.pre_added_to_hello,
        user_category: capsule.user_category,
        user_category_name: capsule.user_category_name || 'No category',
      }));
      return capsules;
    } else {
      // console.log("fetchThoughtCapsules: no capsules added yet");
      return []; // Return an empty array if no capsules
    }
  } catch (error) {
    console.error("Error fetching thought capsules: ", error);
    throw error;
  }
};

export const fetchCompletedMomentsAPI = async (friendId) => {
  // console.log('~~~~~~~~~~~!~~~~~~~~~~~~!~~~~~~~~~~~~!~~~~~~~~~~!fetchMomentsAPI called');
  try {
    const response = await helloFriendApiClient.get(
      `/friends/${friendId}/thoughtcapsules/completed/`
    );
    //  console.log(`COMPLETED MOMENTS!!!!!~~~~~~~~~~~~~~~~~`, response.data);
    if (response && response.data) {
      const capsules = response.data.map((capsule) => ({
        id: capsule.id, 
        created: capsule.created_on,
        preAdded: capsule.pre_added_to_hello,
        user_category: capsule.user_category,
        user_category_name: capsule.user_category_name || 'No category',
      }));
      return capsules;
    } else {
      // console.log("fetchThoughtCapsules: no capsules added yet");
      return []; // Return an empty array if no capsules
    }
  } catch (error) {
    console.error("Error fetching completed thought capsules: ", error);
    throw error;
  }
};


export const fetchCategoriesFriendHistoryAPI = async (friendId, returnNonZeroesOnly) => {
  // console.log(`non zeros: `, returnNonZeroesOnly);
  // console.log('~~~~~~~~~~~!~~~~~~~~~~~~!~~~~~~~~~~~~!~~~~~~~~~~!fetchMomentsAPI called');
  try {
    // const response = await helloFriendApiClient.get(
    //   `/friends/${friendId}/categories/history/?only_with_capsules=${returnNonZeroesOnly}`
    // );

    const response = await helloFriendApiClient.get(
    `/users/categories/history/?only_with_capsules=${returnNonZeroesOnly}&friend_id=${friendId}`
  );
    //  console.log(response.data);
 if (response && response.data) {
  // console.log(`API CALL fetchCategoriesFriendHistory:`, response.data);

  // response.data.forEach((category) => {
  //   console.log(`Category: ${category.name}`);
  //   category.completed_capsules_for_friend.forEach((capsule, index) => {
  //     console.log(`  Capsule ${index + 1}:`, capsule);
  //   });
  // });

  return response.data;
 
    } else {
      // console.log("fetchThoughtCapsules: no capsules added yet");
      return []; // Return an empty array if no capsules
    }
  } catch (error) {
    console.error("Error fetching thought capsules: ", error);
    throw error;
  }
};


export const deleteHelloAPI = async (data) => {
  try {
    const response = await helloFriendApiClient.delete(
      `/friends/${data.friend}/helloes/${data.id}/`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting hello:", error);
    throw error;
  }
};

// NOT CORRECT OR COMPLETE
// export const updateHelloAPI = async (friendId, helloId, helloesData) => {
//     try {
//         const response = await helloFriendApiClient.patch(`/friends/${friendId}/helloes/${helloId}/`, helloesData);
//         return response.data;
//     } catch (error) {
//         if (error.response) {
//             console.error('Error updating hello:', {
//                 message: error.message,
//                 status: error.response.status,
//                 data: error.response.data,
//             });
//         } else {
//             console.error('Error updating hello:', error.message);
//         }
//         throw error;
//     }
// };

export const fetchPastHelloes = async (friendId) => {
  try {
    const response = await helloFriendApiClient.get(
      `/friends/${friendId}/helloes/summary/`
    );
    if (response && response.data) {
      // const helloesData = response.data;
      console.log("API GET CALL fetchPastHelloes"); //, response.data);
return response.data;
    //  const formattedHelloesList = helloesData.map((hello) => {
    //     const pastCapsules = hello.thought_capsules_shared
    //       ? Object.keys(hello.thought_capsules_shared).map((key) => {
    //           const capsule = hello.thought_capsules_shared[key];
    //           // console.log(`Capsule ID ${key}:`, capsule); // ✅ log all fields for this capsule

    //           return {
    //             id: key,
    //             capsule: capsule.capsule,
    //             typed_category: capsule.typed_category,
    //             user_category: capsule.user_category,
    //             user_category_name: capsule.user_category_name,
    //           };
    //         })
    //       : [];

    //     return {
    //       id: hello.id,
    //       created: hello.created_on,
    //       updated: hello.updated_on,
    //       dateLong: hello.date,
    //       date: hello.past_date_in_words,
    //       type: hello.type,
    //       typedLocation: hello.typed_location,
    //       locationName: hello.location_name,
    //       location: hello.location,
    //       additionalNotes: hello.additional_notes,
    //       pastCapsules: pastCapsules,
    //     };
    //   });
    //   return formattedHelloesList;
    } else {
      console.log("fetchPastHelloes: no helloes added yet");
      return [];
    }
  } catch (error) {
    console.error("Error fetching helloes: ", error);
    throw error;
  }
};

export const saveMomentAPI = async (requestData) => {
    console.log(`saving moment with data: `, requestData);
  try {
    const response = await helloFriendApiClient.post(
      `/friends/${requestData.friend}/thoughtcapsules/add/`,
      requestData
    );
    console.log(`saved moment: `, response.data);
    return response.data;
  } catch (error) {
    console.error("Error saving thought capsule:", error);
    throw error;
  }
};


export const fetchPastHelloesFull = async ({friendId, page = 1}) => {
  try {

    const params = new URLSearchParams();

    params.append("page", page);

    console.log(params);
    console.log(`hello full friend id: `, friendId);

    const response = await helloFriendApiClient.get(
      `/friends/${friendId}/helloes/?${params.toString()}`);
   console.log(response.data.results);
    if (response?.data && response?.data?.results) {


    //  const formattedHelloesList = response.data.results.map((hello) => {
    //     const pastCapsules = hello.thought_capsules_shared
    //       ? Object.keys(hello.thought_capsules_shared).map((key) => {
    //           const capsule = hello.thought_capsules_shared[key];
    //           // console.log(`Capsule ID ${key}:`, capsule); // ✅ log all fields for this capsule

    //           return {
    //             id: key,
    //             capsule: capsule.capsule,
    //             typed_category: capsule.typed_category,
    //             user_category: capsule.user_category,
    //             user_category_name: capsule.user_category_name,
    //           };
    //         })
    //       : [];

    //     return {
    //      
    //       thought_capsules_shared: pastCapsules,
    //     };
    //   });
    //   return formattedHelloesList;

      return response.data; // DRF-style: { count, next, previous, results }
    } else {
      console.log("No data returned from fetchCategoriesHistoryAPI.");
      return { results: [], next: null, previous: null };
    }

 
  } catch (error) {
    console.error("Error fetching helloes: ", error);
    throw error;
  }
};


export const saveHello = async (requestData) => {
  // console.log('saveHellodata: ', requestData);
  try {
    const response = await helloFriendApiClient.post(
      `/friends/${requestData.friend}/helloes/add/`,
      requestData
    );
    // console.log("response from saveHello endpoint: ", response);
    return response.data;
  } catch (error) {
    console.error("Error saving hello:", error);
    // console.log(response.data);
    throw error;
  }
};

export const deleteMomentAPI = async (data) => {
  try {
    const response = await helloFriendApiClient.delete(
      `/friends/${data.friend}/thoughtcapsule/${data.id}/`
    );
    // console.log(`deleted moment: `, response.status);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error updating thought capsule:", {
        message: error.message,
        status: error.response.status,
        data: error.response.data,
      });
    } else {
      console.error("Error updating thought capsule:", error.message);
    }
    throw error;
  }
};

export const updateMomentAPI = async (friendId, capsuleId, capsuleData) => {

    // console.log(`updating moment with data: `, capsuleData);
//   console.log(
//     `data in updateMomentApi ${capsuleId}, ${capsuleData?.pre_added_to_hello}`
//   );
  try {
    const response = await helloFriendApiClient.patch(
      `/friends/${friendId}/thoughtcapsule/${capsuleId}/`,
      capsuleData
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error updating thought capsule:", {
        message: error.message,
        status: error.response.status,
        data: error.response.data,
      });
    } else {
      console.error("Error updating thought capsule:", error.message);
    }
    throw error;
  }
};

export const updateMultMomentsAPI = async (friendId, capsulesAndChanges) => {
  try {
    const capsuleData = {
      capsules: capsulesAndChanges.map((capsule) => ({
        id: capsule.id,
        fields_to_update: capsule.fieldsToUpdate,
      })),
    };

    console.log("updateThoughtCapsules payload data: ", capsuleData);

    const response = await helloFriendApiClient.patch(
      `/friends/${friendId}/thoughtcapsules/batch-update/`,
      capsuleData
    );
    return response.data;
  } catch (error) {
    console.error("Error batch-updating thought capsules:", error);
    throw error;
  }
};

export const fetchAllLocations = async () => {
  try {
    const response = await helloFriendApiClient.get("/friends/locations/all/");

    // why did i do this?
    const formattedLocations = response.data.map((location) => ({
      id: location.id,
      address: location.address,
      zipCode: location.zip_code,
      latitude: location.latitude,
      longitude: location.longitude,
      category: location.category,
      parking_score: location.parking_score,
      title: location.title,
      personal_experience_info: location.personal_experience_info,
      validatedAddress: location.validated_address,
      friendsCount: location.friends ? location.friends.length : 0,
      friends: location.friends
        ? location.friends.map((friend) => ({
            id: friend,
            name: friend,
          }))
        : [],
    }));
    return formattedLocations;
  } catch (error) {
    console.error("Error fetching all locations:", error);
    throw error;
  }
};

export const createLocation = async (locationData) => {
  try {
    const response = await helloFriendApiClient.post(
      "/friends/locations/add/",
      locationData
    );
    //  console.log('API Response:', response); // Log the full response for debugging
    return response.data; // Ensure that this is what you expect
  } catch (error) {
    console.error("Error creating location:", error, locationData);
    throw error;
  }
};

export const deleteLocation = async (locationId) => {
  console.log(locationId);
  try {
    const response = await helloFriendApiClient.delete(
      `friends/location/${locationId}/`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting location:", error);
    throw error;
  }
};

export const updateLocation = async (locationId, locationData) => {
  console.log("updateLocation payload in api file: ", locationData);
  try {
    const response = await helloFriendApiClient.patch(
      `friends/location/${locationId}/`,
      locationData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating location:", error);
    throw error;
  }
};

// Not being used
export const fetchValidatedLocations = async () => {
  try {
    const response = await helloFriendApiClient.get(
      "/friends/locations/validated/"
    );

    const formattedLocations = response.data.map((location) => ({
      id: location.id,
      address: location.address,
      latitude: location.latitude,
      longitude: location.longitude,
      notes: location.notes,
      title: location.title,
      notes: location.personal_experience_info,
      validatedAddress: location.validated_address,
      friendsCount: location.friends ? location.friends.length : 0,
      friends: location.friends
        ? location.friends.map((friend) => ({
            id: friend.id,
            name: friend.name,
          }))
        : [],
    }));

    //console.log("API formatted data validated locations: ", formattedLocations);
    return formattedLocations;
  } catch (error) {
    console.error("Error fetching validated locations:", error);
    throw error;
  }
};

export const createFriend = async (friendData) => {
  try {
    const res = await helloFriendApiClient.post("/friends/create/", friendData);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteFriend = async (friendId) => {
  try {
    const response = await helloFriendApiClient.delete(
      `/friends/${friendId}/info/`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting friend:", error);
    throw error;
  }
};

export const updateFriendSugSettings = async (SugSettingsData) => {
  try {
    const res = await helloFriendApiClient.put(
      `/friends/${SugSettingsData.friend}/settings/update/`,
      SugSettingsData
    );

    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateAppSetup = async () => {
  try {
    const response = await helloFriendApiClient.post(
      "/friends/update-app-setup/"
    );
    return response.data;
  } catch (error) {
    console.error("Error updating app setup:", error);
    throw error;
  }
};

export const fetchFriendImagesByCategory = async (friendId) => {
  try {
    const response = await helloFriendApiClient.get(
      `/friends/${friendId}/images/by-category/`
    );
    console.log("API GET CALL fetchFriendImagesByCategory"); //, response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching friend images by category:", error);
    throw error;
  }
};

export const createFriendImage = async (friendId, formData) => {
  console.log("FormData in createFriendImage:", friendId, formData);

  try {
    const response = await helloFriendApiClient.post(
      `/friends/${friendId}/images/add/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Image created successfully:", response.data);
    return response.data; // Return the created image data if needed
  } catch (error) {
    console.error("Error creating friend image:", error);
    throw error; // Throw error to handle it in component level
  }
};

export const fetchFriendImage = async (friendId, imageId) => {
  try {
    const response = await helloFriendApiClient.get(
      `/friends/${friendId}/image/${imageId}/`
    );

    console.log("API fetchFriendImage response: ", response.data);
    return response.data;
  } catch (error) {
    console.error("API fetchFriendImage error: ", error);
    throw error;
  }
};

export const updateFriendImage = async (friendId, imageId) => {
  try {
    const response = await helloFriendApiClient.patch(
      `/friends/${friendId}/image/${imageId}/`
    );

    console.log("API updateFriendImage response: ", response.data);
    return response.data;
  } catch (error) {
    console.error("API updateFriendImage error: ", error);
    throw error;
  }
};

export const deleteFriendImage = async (friendId, imageId) => {
  try {
    const response = await helloFriendApiClient.delete(
      `/friends/${friendId}/image/${imageId}/`
    );

    console.log("API fetchFriendImage response: ", response.data);
    return response.data;
  } catch (error) {
    console.error("API fetchFriendImage error: ", error);
    throw error;
  }
};

export const fetchTypeChoices = async () => {
  try {
    const response = await helloFriendApiClient.get(
      "friends/dropdown/hello-type-choices/"
    );
    return response.data.type_choices;
  } catch (error) {
    console.error("Error fetching type choices:", error);
    throw error;
  }
};

export const fetchParkingChoices = async () => {
  try {
    const response = await helloFriendApiClient.get(
      "friends/dropdown/location-parking-type-choices/"
    );
    console.log("fetchParkingChoices: ", response.data.type_choices);
    return response.data.type_choices;
  } catch (error) {
    console.error("Error fetching parking choices:", error);
    throw error;
  }
};

export const fetchLocationDetails = async (locationData) => {
  try {
    const response = await helloFriendApiClient.post(
      "/friends/places/get-details/",
      locationData
    );

    // console.log(`API POST CALL fetchLocationDetails`, response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching location details:", error.message);
    throw error;
  }
};
