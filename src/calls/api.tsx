import * as SecureStore from "expo-secure-store";
//export const API_URL = 'https://ac67e9fa-7838-487d-a3bc-e7a176f4bfbf-dev.e1-us-cdp-2.choreoapis.dev/hellofriend/hellofriend/rest-api-be2/v1.0/';

//export const API_URL = 'http://167.99.233.148:8000/';
//export const API_URL = 'https://badrainbowz.com/';

import { helloFriendApiClient, setAuthHeader } from "./helloFriendApiClient";
import axios from "axios";
import { MomentFromBackendType } from "../types/MomentContextTypes";
export type addressType = {
  address: string;
  lat: string;
  lng: string;
};

export type addressTypeVariant = {
  address: string;
  latitude: string;
  longitude: string;
};

export function handleApiError(e: unknown, contextMessage = "API error") {
  console.error(`${contextMessage}:`, e);

  if (axios.isAxiosError(e)) {
    if (e.response) {
      console.log("Server responded with: REMOVED THIS it is html doc") //, e.response.data);

      const msg = (e.response.data as { msg?: string })?.msg;
      throw new Error(msg || "Invalid credentials");
    } else if (e.request) {
      console.log("No response from server:", e.request);
      throw new Error("No response from server, please check your network");
    } else {
      console.log("Axios error without response or request:", e.message);
      throw new Error("Unexpected Axios error");
    }
  }

  if (e instanceof Error) {
    console.log("Unexpected non-Axios error:", e.message);
    throw new Error("Unexpected error occurred");
  }

  throw new Error("An unknown error occurred");
}

//axios.defaults.baseURL = API_URL;

export const deleteTokens = async () => {
  await SecureStore.deleteItemAsync("accessToken");
  await SecureStore.deleteItemAsync("refreshToken");
  await SecureStore.deleteItemAsync("pushToken");
  await SecureStore.deleteItemAsync("tokenExpiry");
};

export const signout = async () => {
  try {
    await deleteTokens();
    setAuthHeader(null);
    return true;
  } catch (e) {
    console.log("API signout error", e);
    return false;
  }
};

export const signinWithoutRefresh = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
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
  } catch (e: unknown) {
    handleApiError(e, "Error during signinWithoutRefresh");
  }
};

export const sendResetCodeEmail = async (email: string) => {
  try {
    return await helloFriendApiClient.post("/users/send-reset-code/", {
      email: email,
    });
  } catch (e: unknown) {
    handleApiError(e, "Error during sendResetCodeEmail");
  }
};

export const verifyResetCodeEmail = async ({
  email,
  resetCode,
}: {
  email: string;
  resetCode: string;
}) => {
  try {
    const response = await helloFriendApiClient.post(
      "/users/verify-reset-code/",
      {
        email: email,
        reset_code: resetCode,
      }
    );

    return response;
  } catch (e: unknown) {
    handleApiError(e, "Error during verifyResetCodeEmail");
  }
};

export const resetPassword = async ({
  email,
  resetCode,
  newPassword,
}: {
  email: string;
  resetCode: string;
  newPassword: string;
}) => {
  // console.log(email);
  // console.log(resetCode);

  try {
    const response = await helloFriendApiClient.post("/users/reset-password/", {
      email: email,
      reset_code: resetCode,
      new_password: newPassword,
    });
    // console.log(response);
    return response;
  } catch (e: unknown) {
    handleApiError(e, "Error during resetPassword");
  }
};

export const sendEmail = async (email: string) => {
  try {
    return await helloFriendApiClient.post("/users/send-email/", {
      email: email,
    });
  } catch (e: unknown) {
    handleApiError(e, "Error during sendEmail");
  }
};

export const signup = async ({
  username,
  email,
  password,
}: {
  username: string;
  email: string;
  password: string;
}) => {
  try {
    return await helloFriendApiClient.post("/users/sign-up/", {
      username,
      email,
      password,
    });
  } catch (e: unknown) {
    handleApiError(e, "Error during signup");
  }
};

export const signin = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
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
  } catch (e: unknown) {
    handleApiError(e, "Error during signin");
  }
};

// this call's serializer currently adds categories
export const getUserSettings = async () => {
  // console.log("Default common headers:", helloFriendApiClient.defaults.headers);

  try {
    const response = await helloFriendApiClient.get(`/users/settings/`);
    console.log("API GET Call getUserSettings", response.data);

    return response.data;
  } catch (e: unknown) {
    handleApiError(e, "Error during getUserSettings");
  }
};

export const getUserCategories = async (userId: number) => {
  try {
    const response = await helloFriendApiClient.get(
      `/users/${userId}/categories/`
    );
    // console.log("API GET Call getUserCategories", response.data);

    return response.data;
  } catch (e: unknown) {
    handleApiError(e, "Error during getUserCategories");
  }
};

// not in use?
// export const fetchCategoriesHistoryAPI = async (
//   categoryId: number,
//   returnNonZeroesOnly: boolean,
//   page = 1
// ) => {
//   try {
//     const params = new URLSearchParams();

//     if (categoryId) params.append("user_category_id", categoryId);
//     if (returnNonZeroesOnly) params.append("only_with_capsules", "true");
//     params.append("page", page);

//     const response = await helloFriendApiClient.get(
//       `/users/categories/history/?${params.toString()}`
//     );
//     console.log(`response from cat history`, response.data);
//     if (response?.data) {
//       return response.data; // DRF-style: { count, next, previous, results }
//     } else {
//       console.log("No data returned from fetchCategoriesHistoryAPI.");
//       return { results: [], next: null, previous: null };
//     }
//   } catch (e: unknown) {
//     handleApiError(e, "Error during fetchCategoriesHistoryAPI");
//   }
// };

export const fetchCapsulesHistoryAPI = async ({
  categoryId,
  friendId,
  returnNonZeroesOnly = true,
  page = 1,
}: {
  categoryId: number;
  friendId: number | null;
  returnNonZeroesOnly: boolean;
  page: number;
}) => {
  try {
    const params = new URLSearchParams();

    if (categoryId) params.append("user_category_id", String(categoryId));
    if (friendId) params.append("friend_id", String(friendId));
    if (returnNonZeroesOnly) params.append("only_with_capsules", "true");
    params.append("page", String(page));

    const response = await helloFriendApiClient.get(
      `/friends/categories/history/capsules/?${params.toString()}`
    );
    // console.log(`response from capsules history`, response.data);
    if (response?.data) {
      // console.log(response.data);
      return response.data; // DRF-style: { count, next, previous, results }
    } else {
      console.log("No data returned from fetchCapsulesHistoryAPI.");
      return { results: [], next: null, previous: null };
    }
  } catch (e: unknown) {
    handleApiError(e, "Error during fetchCapsulesHistoryAPI");
  }
};

export const fetchCategoriesHistoryCountAPI = async ({
  friendId,
  returnNonZeroesOnly,
}: {
  friendId: number;
  returnNonZeroesOnly: boolean;
}) => {
  console.log(
    "~~~~~~~~~~~!~~~~~~~~~~~~!~~~~~~~~~~~~!~~~~~~~~~~!fetchCategoriesHistoryCountAPI  called, friendid: ",
    friendId
  );
  try {
    const params = new URLSearchParams();
    params.append("only_with_capsules", returnNonZeroesOnly.toString());
    if (friendId != null) {
      params.append("friend_id", friendId.toString());
    }
    // const url = `/users/categories/history/summary/?${params.toString()}`;

    const response = await helloFriendApiClient.get(
      `/users/categories/history/summary/?${params.toString()}`
    );
    // console.log(`COUNT ONLY`, response.data);
    if (response && response.data) {
      return response.data;
    } else {
      console.log("fetchThoughtCapsules: no capsules added yet");
      return [];
    }
  } catch (e: unknown) {
    handleApiError(e, "Error during signinWithoutRefresh");
  }
};

export const createUserCategory = async (
  userId: number,
  newCategoryData: object
) => {
  try {
    const response = await helloFriendApiClient.post(
      `/users/${userId}/categories/add/`,
      newCategoryData
    );
    return response.data;
  } catch (e: unknown) {
    handleApiError(e, "Error during createUserCategory");
  }
};

export const updateUserCategory = async (
  userId: number,
  categoryId: number,
  updates: object
) => {
  console.log(`updates for user category: `, updates);

  try {
    const response = await helloFriendApiClient.patch(
      `/users/${userId}/category/${categoryId}/`,
      updates
    );
    console.log("API PATCH CALL updateUserCategory", response.data);
    return response.data;
  } catch (e: unknown) {
    handleApiError(e, "Error during updateUserCategory");
  }
};

export const deleteUserCategory = async (
  userId: number,
  categoryId: number
) => {
  console.log(`delete category with: `, userId, categoryId);
  try {
    const response = await helloFriendApiClient.delete(
      `/users/${userId}/category/${categoryId}/`
    );
    console.log("API DELTE CALL deleteUserCategory");
    //console.log('API response:', response.data); // Log the response data
    return response.data;
  } catch (e: unknown) {
    handleApiError(e, "Error during deleteUserCategory");
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await helloFriendApiClient.get("/users/get-current/");
    console.log("API GET Call getCurrentUser");

    return response.data;
  } catch (e: unknown) {
    handleApiError(e, "Error during getCurrentUser");
  }
};

export const updateSubscription = async (
  userId: number,
  fieldUpdates: object
) => {
  //is_subscribed_user, subscription_id, subscription_expiration_date
  try {
    const response = await helloFriendApiClient.patch(
      `/users/${userId}/subscription/update/`,
      fieldUpdates
    );
    console.log("API PATCH CALL updateSubscription");
    return response.data;
  } catch (e: unknown) {
    handleApiError(e, "Error during updateSubscription");
  }
};

export const refreshAccessToken = async (refToken: string) => {
  try {
    const response = await helloFriendApiClient.post("/users/token/refresh/", {
      refresh: refToken,
    });
    const newAccessToken = response.data.access;
    setAuthHeader(newAccessToken);
    return response;
  } catch (e: unknown) {
    handleApiError(e, "Error during refreshAccessToken");
  }
};

export const fetchFriendList = async () => {
  try {
    const response = await helloFriendApiClient.get("/friends/all/");

    return response.data;
  } catch (e: unknown) {
    handleApiError(e, "Error during fetchFriendList");
  }
};

export const fetchFriendAddresses = async (friendId: number) => {
  try {
    const response = await helloFriendApiClient.get(
      `/friends/${friendId}/addresses/all/`
    );
    return response.data;
  } catch (e: unknown) {
    handleApiError(e, "Error during fetchFriendAddresses");
  }
};

export const addFriendAddress = async (
  friendId: number,
  addressData: object
) => {
  try {
    const response = await helloFriendApiClient.post(
      `/friends/${friendId}/addresses/add/`,
      addressData
    );
    return response.data;
  } catch (e: unknown) {
    handleApiError(e, "Error during addFriendAddress");
  }
};

export const updateFriendAddress = async (
  friendId: number,
  addressId: number,
  fieldUpdates: object
) => {
  try {
    const response = await helloFriendApiClient.patch(
      `/friends/${friendId}/address/${addressId}/`,
      fieldUpdates
    );

    // console.log(
    //   "API PATCH CALL updateFriendAddress: ");
    //   ,addressId,
    //   fieldUpdates
    // );

    return response.data;
  } catch (e: unknown) {
    handleApiError(e, "Error during updateFriendAddress");
  }
};

export const deleteFriendAddress = async (
  friendId: number,
  addressId: number
) => {
  try {
    const response = await helloFriendApiClient.delete(
      `/friends/${friendId}/address/${addressId}/`
    );
    return response.data;
  } catch (e: unknown) {
    handleApiError(e, "Error during deleteFriendAddress");
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
  } catch (e: unknown) {
    handleApiError(e, "Error during fetchUserAddresses");
  }
};

export const addUserAddress = async (addressData: object) => {
  try {
    const response = await helloFriendApiClient.post(
      `/users/addresses/add/`,
      addressData
    );
    return response.data;
  } catch (e: unknown) {
    handleApiError(e, "Error during addUserAddress");
  }
};

//not finished yet 12/13/2024
export const updateUserAddress = async (
  addressId: number,
  fieldUpdates: object
) => {
  try {
    const response = await helloFriendApiClient.patch(
      `/users/address/${addressId}/`,
      fieldUpdates
    );

    console.log("API PATCH CALL updateUserAddress: ", addressId, fieldUpdates);

    return response.data;
  } catch (e: unknown) {
    handleApiError(e, "Error during updateUserAddress");
  }
};

export const deleteUserAddress = async (addressId: number) => {
  try {
    const response = await helloFriendApiClient.delete(
      `/users/address/${addressId}/`
    );

    if (response.status === 200) {
      console.log("Address deleted successfully");
      return { success: true };
    }

    return { success: false, message: "Unexpected response status." };
  } catch (e: unknown) {
    handleApiError(e, "Error during deleteUserAddress");
  }
};

export const validateAddress = async (userId: number, address: string) => {
  try {
    const response = await helloFriendApiClient.post(
      `/friends/location/validate-only/`,
      {
        user: userId,
        address: address,
      }
    );
    return response.data;
  } catch (e: unknown) {
    handleApiError(e, "Error during validateAddress");
  }
};

// export const GetTravelComparisons = async (locationData) => {
export const GetTravelComparisons = async (
  userAddress: addressType,
  friendAddress: addressType,
  location: addressTypeVariant
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
  } catch (e: unknown) {
    handleApiError(e, "Error during getTravelComparisons");
  }
};

export const SearchForMidpointLocations = async (locationData: object) => {
  try {
    const response = await helloFriendApiClient.post(
      `/friends/places/near-midpoint/`,
      locationData
    );
    return response.data.suggested_places;
  } catch (e: unknown) {
    handleApiError(e, "Error during SearchForMidpointLocations");
  }
};

export const updateUserAccessibilitySettings = async (fieldUpdates: object) => {
  console.log(fieldUpdates);
  try {
    const response = await helloFriendApiClient.patch(
      `/users/settings/update/`,
      fieldUpdates
    );
    console.log("API PATCH CALL updateUserAccessibilitySettings");
    console.log('API response:', response.data); // Log the response data
    return response.data; // Ensure this returns the expected structure
  } catch (e: unknown) {
    handleApiError(e, "Error during updateUserAccessibilitySettings");
  }
};

export const updateUserProfile = async (
  userId: number,
  firstName: string,
  lastName: string,
  dateOfBirth: string, // not sure what data type this is
  gender: string,
  address: string
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
  } catch (e: unknown) {
    handleApiError(e, "Error during updateUserProfile");
  }
};

export const fetchFriendDashboard = async (friendId: number) => {
  const startTime = Date.now(); // TIMER START

  try {
    const response = await helloFriendApiClient.get(
      `/friends/${friendId}/dashboard/`
    );

    const endTime = Date.now(); // TIMER END
    const duration = endTime - startTime;

    

    console.log(`API GET CALL fetchFriendDashboard took ${duration}ms`);

    return response.data[0] || null;
  } catch (error) {
    const endTime = Date.now(); // TIMER END FOR ERROR CASE TOO
    const duration = endTime - startTime;
    console.error(
      `Error fetching friend dashboard (after ${duration}ms):`,
      error
    );
    throw error;
  }
};

export const remixAllNextHelloes = async (userId: number) => {
  try {
    const response = await helloFriendApiClient.post(
      `/friends/remix/all/`,
      userId
    );
    return response.status;
  } catch (e: unknown) {
    handleApiError(e, "Error during remixAllNextHelloes");
  }
};

export type FriendFaveLocationDataType = {
  friendId: number;
  userId: number;
  locationId: number;
};

export const addToFriendFavesLocations = async (
  data: FriendFaveLocationDataType
) => {
  try {
    const response = await helloFriendApiClient.patch(
      `/friends/${data.friendId}/faves/add/location/`,
      {
        friend: data.friendId,
        user: data.userId,
        location_id: data.locationId, // Use an array if locationId is a single ID
      }
    );
    return response.data;
  } catch (e: unknown) {
    handleApiError(e, "Error during addToFriendFavesLocations");
  }
};

export const removeFromFriendFavesLocations = async (
  data: FriendFaveLocationDataType
) => {
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
  } catch (e: unknown) {
    handleApiError(e, "Error during removeFromFriendFavesLocations");
  }
};


export const updateFriendDefaultCategory = async ({
  userId,
  friendId,
  categoryId,
}: {
  userId: number;
  friendId: number;
  caegoryId: number;
}) => {
  try {
    const response = await helloFriendApiClient.patch(
      `/friends/${friendId}/faves/`,
      {
        friend: friendId,
        user: userId,
        friend_default_category: categoryId,
      }
    );

    console.log("API PATCH CALL updateFriendDefaultCategory");
    return response.data;
  } catch (e: unknown) {
    handleApiError(e, "Error updateFriendDefaultCategory");
  }
};

export const updateFriendFavesColorThemeSetting = async ({
  userId,
  friendId,
  darkColor,
  lightColor,
  manualTheme,
}: {
  userId: number;
  friendId: number;
  darkColor: string;
  lightColor: string;
  manualTheme: boolean;
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
  } catch (e: unknown) {
    handleApiError(e, "Error during updateFriendFavesColorThemeSetting");
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
  userId: number,
  friendId: number,
  setting: object
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
  } catch (e: unknown) {
    handleApiError(
      e,
      "Error during updateFriendFavesColorThemeGradientDirection"
    );
  }
};

export const updateFriendFavesColorTheme = async (
  userId: number,
  friendId: number,
  darkColor: string,
  lightColor: string,
  fontColor: string,
  fontColorSecondary: string
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
  } catch (e: unknown) {
    handleApiError(e, "Error during updateFriendFavesColorTheme");
  }
};

//this will update the theme colors in Friend Faves and Friend but will
//leave the saved colors in Friend untouched, so that they can be used later
// export const resetFriendFavesColorThemeToDefaultOld = async (
//   userId,
//   friendId,
//   darkColor,
//   lightColor,
//   fontColor,
//   fontColorSecondary
// ) => {
//   try {
//     const response = await helloFriendApiClient.patch(
//       `/friends/${friendId}/faves/`,
//       {
//         friend: friendId,
//         user: userId,
//         dark_color: darkColor,
//         light_color: lightColor,
//         font_color: fontColor,
//         font_color_secondary: fontColorSecondary,
//         use_friend_color_theme: false,
//       }
//     );
//     console.log("Color theme for friend updated: ", response.data);
//     return response.data;
//   } catch (e: unknown) {
//     handleApiError(e, "Error during signinWithoutRefresh");
//   }
// };

export const fetchUpcomingHelloes = async () => {
  try {
    const response = await helloFriendApiClient.get("/friends/upcoming/");
    // console.error(response.data);
    return response.data;
  } catch (e: unknown) {
    handleApiError(e, "Error during fetchUpcomingHelloes");
  }
};



export const fetchMomentsAPI = async (friendId: number) => {
  // console.log('~~~~~~~~~~~!~~~~~~~~~~~~!~~~~~~~~~~~~!~~~~~~~~~~!fetchMomentsAPI called');
  try {
    const response = await helloFriendApiClient.get(
      `/friends/${friendId}/thoughtcapsules/`
    );
    //  console.log(response.data);
    if (response && response.data) {
      const capsules = response.data.map((capsule: MomentFromBackendType) => ({
        id: capsule.id,
        typedCategory: capsule.typed_category || "Uncategorized",
        capsule: capsule.capsule,
        created: capsule.created_on,
        preAdded: capsule.pre_added_to_hello,
        user_category: capsule.user_category,
        user_category_name: capsule.user_category_name || "No category",
      }));
      return capsules;
    } else {
      // console.log("fetchThoughtCapsules: no capsules added yet");
      return []; // Return an empty array if no capsules
    }
  } catch (e: unknown) {
    handleApiError(e, "Error during fetchMomentsAPI");
  }
};

export const fetchCompletedMomentsAPI = async (friendId: number) => {
  // console.log('~~~~~~~~~~~!~~~~~~~~~~~~!~~~~~~~~~~~~!~~~~~~~~~~!fetchMomentsAPI called');
  try {
    const response = await helloFriendApiClient.get(
      `/friends/${friendId}/thoughtcapsules/completed/`
    );
    //  console.log(`COMPLETED MOMENTS!!!!!~~~~~~~~~~~~~~~~~`, response.data);
    if (response && response.data) {
      const capsules = response.data.map((capsule: MomentFromBackendType) => ({
        id: capsule.id,
        created: capsule.created_on,
        preAdded: capsule.pre_added_to_hello,
        user_category: capsule.user_category,
        user_category_name: capsule.user_category_name || "No category",
      }));
      return capsules;
    } else {
      // console.log("fetchThoughtCapsules: no capsules added yet");
      return []; // Return an empty array if no capsules
    }
  } catch (e: unknown) {
    handleApiError(e, "Error during fetchCompleteMomentsAPI");
  }
};

export const fetchCategoriesFriendHistoryAPI = async (
  friendId: number,
  returnNonZeroesOnly: boolean
) => {
  // console.log(`non zeros: `, returnNonZeroesOnly);
  // console.log('~~~~~~~~~~~!~~~~~~~~~~~~!~~~~~~~~~~~~!~~~~~~~~~~!fetchMomentsAPI called');
  try {
    // const response = await helloFriendApiClient.get(
    //   `/friends/${friendId}/categories/history/?only_with_capsules=${returnNonZeroesOnly}`
    // );

    const response = await helloFriendApiClient.get(
      `/users/categories/history/?only_with_capsules=${returnNonZeroesOnly}&friend_id=${friendId}`
    );

       console.log(`FRIEND HISTORY`, response.data);
 
    if (response && response.data) {
      return response.data;
    } else {
      return [];
    }
  } catch (e: unknown) {
    handleApiError(e, "Error during fetchCompleteMomentsAPI");
  }
};

export const deleteHelloAPI = async (data: { friend: number; id: number }) => {
  try {
    const response = await helloFriendApiClient.delete(
      `/friends/${data.friend}/helloes/${data.id}/`
    );
    return response.data;
  } catch (e: unknown) {
    handleApiError(e, "Error during deleteHelloAPI");
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

export const fetchPastHelloes = async (friendId: number) => {
  try {
    const response = await helloFriendApiClient.get(
      `/friends/${friendId}/combinedhelloes/summary/`
    );
    if (response && response.data) {

   //   console.error("API GET CALL fetchPastHelloes", response.data); //, response.data);
      
      return response.data;
    } else {
      return [];
    }
  } catch (e: unknown) {
    handleApiError(e, "Error during fetchPastHelloes");
  }
};

export const saveMomentAPI = async (requestData: {friend: number}) => {
  console.log(`saving moment with data: `, requestData);
  try {
    const response = await helloFriendApiClient.post(
      `/friends/${requestData.friend}/thoughtcapsules/add/`,
      requestData
    );
    console.log(`saved moment: `, response.data);
    return response.data;
  } catch (e: unknown) {
    handleApiError(e, "Error during saveMomentAPI");
  }
};

export const fetchPastHelloesFull = async ({
  friendId,
  page = 1,
}: {
  friendId: number;
  page: number;
}) => {
  try {
    const params = new URLSearchParams();

    params.append("page", String(page));

    // console.log(params);
    // console.log(`hello full friend id: `, friendId);

    const response = await helloFriendApiClient.get(
      `/friends/${friendId}/helloes/?${params.toString()}`
    );
    // console.log(response.data.results);
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
  } catch (e: unknown) {
    handleApiError(e, "Error during fetchPastHelloesFull");
  }
};

export const saveHello = async (requestData: {friend: number}) => {
  try {
    const response = await helloFriendApiClient.post(
      `/friends/${requestData.friend}/helloes/add/`,
      requestData
    );
    return response.data;
  } catch (e: unknown) {
    handleApiError(e, "Error during saveHello");
  }
};

export const deleteMomentAPI = async (data: {friend: number; id: number}) => {
  try {
    const response = await helloFriendApiClient.delete(
      `/friends/${data.friend}/thoughtcapsule/${data.id}/`
    );
    return response.data;
  } catch (e: unknown) {
    handleApiError(e, "Error during deleteMomentAPI");
  }
};

export const updateMomentAPI = async (
  friendId: number,
  capsuleId: number,
  capsuleData: object
) => { 
  try {
    const response = await helloFriendApiClient.patch(
      `/friends/${friendId}/thoughtcapsule/${capsuleId}/`,
      capsuleData
    );
    // console.log(response.data);
    return response.data;
  } catch (e: unknown) {
    handleApiError(e, "Error during updateMomentAPI");
  }
};


export type CapsulesAndChangesDataType = {
  id: number;
  fieldsToUpdate: object;
}


export const updateMultMomentsAPI = async (
  friendId: number,
  capsulesAndChanges: []
) => {
  try {
    const capsuleData = {
      capsules: capsulesAndChanges.map((capsule: CapsulesAndChangesDataType) => ({
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
  } catch (e: unknown) {
    handleApiError(e, "Error during updateMultMomentsAPI");
  }
};


export type LocationFromBackendType = {
id: number;
address: string;
zip_code: string;
latitude: string;
longitude: string;
category: number;
parking_score: string;
title: string;
personal_experience_info: string;
validated_address: string;
friends: number[];


}

export const fetchAllLocations = async () => {
  try {
    const response = await helloFriendApiClient.get("/friends/locations/all/");

    // why did i do this?
    const formattedLocations = response.data.map((location: LocationFromBackendType) => ({
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
  } catch (e: unknown) {
    handleApiError(e, "Error during fetchAllLocations");
  }
};

export const createLocation = async (locationData: object) => {
  try {
    const response = await helloFriendApiClient.post(
      "/friends/locations/add/",
      locationData
    );
    //  console.log('API Response:', response);
    return response.data;
  } catch (e: unknown) {
    handleApiError(e, "Error during createLocation");
  }
};

export const deleteLocation = async (locationId: number) => {
  try {
    const response = await helloFriendApiClient.delete(
      `friends/location/${locationId}/`
    );
    return response.data;
  } catch (e: unknown) {
    handleApiError(e, "Error during deleteLocation");
  }
};

export const updateLocation = async (
  locationId: number,
  locationData: object
) => {
  // console.log("updateLocation payload in api file: ", locationData);
  try {
    const response = await helloFriendApiClient.patch(
      `friends/location/${locationId}/`,
      locationData
    );
    return response.data;
  } catch (e: unknown) {
    handleApiError(e, "Error during updateLocation");
  }
};

// Not being used
// export const fetchValidatedLocations = async () => {
//   try {
//     const response = await helloFriendApiClient.get(
//       "/friends/locations/validated/"
//     );

//     const formattedLocations = response.data.map((location) => ({
//       id: location.id,
//       address: location.address,
//       latitude: location.latitude,
//       longitude: location.longitude,
//       notes: location.notes,
//       title: location.title,
//       notes: location.personal_experience_info,
//       validatedAddress: location.validated_address,
//       friendsCount: location.friends ? location.friends.length : 0,
//       friends: location.friends
//         ? location.friends.map((friend) => ({
//             id: friend.id,
//             name: friend.name,
//           }))
//         : [],
//     }));

//     //console.log("API formatted data validated locations: ", formattedLocations);
//     return formattedLocations;
//   } catch (error) {
//     console.error("Error fetching validated locations:", error);
//     throw error;
//   }
// };

export const createFriend = async (friendData: object) => {
  try {
    const res = await helloFriendApiClient.post("/friends/create/", friendData);
    return res.data;
  } catch (e: unknown) {
    handleApiError(e, "Error during createFriend");
  }
};

export const deleteFriend = async (friendId: number) => {
  try {
    const response = await helloFriendApiClient.delete(
      `/friends/${friendId}/info/`
    );
    return response.data;
  } catch (e: unknown) {
    handleApiError(e, "Error during deleteFriend");
  }
};

export const updateFriendSugSettings = async (SugSettingsData: {friend: number}) => {
  try {
    const res = await helloFriendApiClient.put(
      `/friends/${SugSettingsData.friend}/settings/update/`,
      SugSettingsData
    );

    return res.data;
  } catch (e: unknown) {
    handleApiError(e, "Error during updateFriendSugSettings");
  }
};

export const updateAppSetup = async () => {
  try {
    const response = await helloFriendApiClient.post(
      "/friends/update-app-setup/"
    );
    return response.data;
  } catch (e: unknown) {
    handleApiError(e, "Error during updateAppSetup");
  }
};

export const fetchFriendImagesByCategory = async (friendId: number) => {
  try {
    const response = await helloFriendApiClient.get(
      `/friends/${friendId}/images/by-category/`
    );
    console.log("API GET CALL fetchFriendImagesByCategory");
    return response.data;
  } catch (e: unknown) {
    handleApiError(e, "Error during fetchFriendImagesByCategory");
  }
};

export const createFriendImage = async (friendId: number, formData: object) => {
  // console.log("FormData in createFriendImage:", friendId, formData);

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
  } catch (e: unknown) {
    handleApiError(e, "Error during createFriendImage");
  }
};

export const fetchFriendImage = async (friendId: number, imageId: number) => {
  try {
    const response = await helloFriendApiClient.get(
      `/friends/${friendId}/image/${imageId}/`
    );

    console.log("API fetchFriendImage response: ", response.data);
    return response.data;
  } catch (e: unknown) {
    handleApiError(e, "Error during fetchFriendImage");
  }
};

export const updateFriendImage = async (friendId: number, imageId: number) => {
  try {
    const response = await helloFriendApiClient.patch(
      `/friends/${friendId}/image/${imageId}/`
    );

    console.log("API updateFriendImage response: ", response.data);
    return response.data;
  } catch (e: unknown) {
    handleApiError(e, "Error during updateFriendImage");
  }
};

export const deleteFriendImage = async (friendId: number, imageId: number) => {
  try {
    const response = await helloFriendApiClient.delete(
      `/friends/${friendId}/image/${imageId}/`
    );

    console.log("API fetchFriendImage response: ", response.data);
    return response.data;
  } catch (e: unknown) {
    handleApiError(e, "Error during deleteFriendImage");
  }
};

export const fetchTypeChoices = async () => {
  try {
    const response = await helloFriendApiClient.get(
      "friends/dropdown/hello-type-choices/"
    );
    return response.data.type_choices;
  } catch (e: unknown) {
    handleApiError(e, "Error during fetchTypeChoices");
  }
};

export const fetchParkingChoices = async () => {
  try {
    const response = await helloFriendApiClient.get(
      "friends/dropdown/location-parking-type-choices/"
    );
    console.log("fetchParkingChoices: ", response.data.type_choices);
    return response.data.type_choices;
  } catch (e: unknown) {
    handleApiError(e, "Error during fetchParkingChoices");
  }
};

export const fetchLocationDetails = async (locationData: object) => {
  try {
    const response = await helloFriendApiClient.post(
      "/friends/places/get-details/",
      locationData
    );

    // console.log(`API POST CALL fetchLocationDetails`, response.data);
    return response.data;
  } catch (e: unknown) {
    handleApiError(e, "Error during fetchLocationDetails");
  }
};
