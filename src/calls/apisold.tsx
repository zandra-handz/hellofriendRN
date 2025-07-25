import axios from 'axios';  
import * as SecureStore from 'expo-secure-store'; 
//export const API_URL = 'https://ac67e9fa-7838-487d-a3bc-e7a176f4bfbf-dev.e1-us-cdp-2.choreoapis.dev/hellofriend/hellofriend/rest-api-be2/v1.0/';

//export const API_URL = 'http://167.99.233.148:8000/';
export const API_URL = 'https://badrainbowz.com/';

 

axios.defaults.baseURL = API_URL;
 

export const setAuthHeader = (token) => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
};
// not using these yet
const TOKEN_KEY = 'accessToken';
 
export const getToken = async () => await SecureStore.getItemAsync(TOKEN_KEY);

export const setToken = async (token) => await SecureStore.setItemAsync(TOKEN_KEY, token);

export const deleteTokens = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync('refreshToken');
    await SecureStore.deleteItemAsync('pushToken');
};
//

const refreshTokenFunct = async () => {
    const storedRefreshToken = await SecureStore.getItemAsync('refreshToken');
    if (!storedRefreshToken) {
        console.warn('No refresh token available');
        return null;  // Return early if there's no refresh token
    }

    try {
        const response = await axios.post('/users/token/refresh/', { refresh: storedRefreshToken });
        const newAccessToken = response.data.access;

        await SecureStore.setItemAsync('accessToken', newAccessToken);
        return newAccessToken;
    } catch (error) {
        console.error('Error refreshing token api file:', error);
        throw error;
    }
};

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

// Function to handle token refresh
let isRefreshing = false;
let refreshSubscribers = [];

// Subscribe to token refresh completion
const subscribeTokenRefresh = (callback) => {
    refreshSubscribers.push(callback);
};

// Notify subscribers after token refresh
const onRefreshed = (newAccessToken) => {
    refreshSubscribers.forEach(callback => callback(newAccessToken));
    refreshSubscribers = [];
};
 
// Axios Request Interceptor
axios.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Axios Response Interceptor
axios.interceptors.response.use(

    
    (response) => {
        console.log('Interceptor was here!');
        return response;
    },
    async (error) => {
        const { config, response } = error;
        const originalRequest = config;

        // If the error is a 401 and the request has not been retried yet
        if (response && response.status === 401 && !originalRequest._retry) {
            console.log('Interceptor caught a 401!');
            if (!isRefreshing) {
                isRefreshing = true;
                originalRequest._retry = true;

                try {
                    const newAccessToken = await refreshTokenFunct();

                    if (!newAccessToken) {
                        throw new Error("Failed to refresh token: new access token is null or undefined");
                    }
                    console.log('Interceptor acquired new token utilizing refreshTokenFunct!', newAccessToken);
        
                    
                    console.log('Interceptor acquired new token utilizing refreshToken!', newAccessToken);
                    isRefreshing = false;

                    // Update the Authorization header for all queued requests
                    onRefreshed(newAccessToken);
                    setAuthHeader(newAccessToken);
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axios(originalRequest);
                } catch (err) {
                    isRefreshing = false;
                    return Promise.reject(err);
                }
            } else {
                // If token refresh is already in progress, queue the request
                return new Promise((resolve) => {
                    subscribeTokenRefresh((newAccessToken) => {
                        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                        resolve(axios(originalRequest));
                    });
                });
            }
        }

        return Promise.reject(error);
    } 
);

export const signinWithoutRefresh = async ({ username, password }) => {
    try {
        const response = await axios.post('/users/token/', { username, password });

        // set in onSuccess
        const newAccessToken = response.data.access;
        // const newRefreshToken = response.data.refresh;

        // await SecureStore.setItemAsync('accessToken',  newAccessToken);
        // await SecureStore.setItemAsync('refreshToken', newRefreshToken);
            
            
        setAuthHeader(newAccessToken); 

        return response; 
    } catch (e) {
        console.error("Error during signinWithoutRefresh:", e);

        if (e.response) {
            console.log("Server responded with:", e.response.data);
            throw new Error(e.response.data.msg || 'Invalid credentials'); // Explicit error for invalid credentials
        } else if (e.request) {
            console.log("No response from server:", e.request);
            throw new Error('No response from server, please check your network');
        } else {
            console.log("Unexpected error:", e.message);
            throw new Error('Unexpected error occurred during signin');
        }
    }
};

export const sendResetCodeEmail = async (email) => {
  
    try {
        return await axios.post('/users/send-reset-code/', { 'email': email });
    } catch (e) {
        console.log('error sending email:', e);
        return { error: true, msg: e.response.data.msg };
    }
};


export const verifyResetCodeEmail = async ({email, resetCode}) => {
    console.log(email);
    console.log(resetCode);
  
    try {
        response = await axios.post('/users/verify-reset-code/', { 'email': email, 'reset_code': resetCode });
        console.log(response);
        return response;
    } catch (e) {
        console.log('error checking reset code:', e);
        return { error: true, msg: e.response.data.msg };
    }
};

export const resetPassword = async ({email, resetCode, newPassword }) => {
    console.log(email);
    console.log(resetCode);
  
    try {
        response = await axios.post('/users/reset-password/', { 'email': email, 'reset_code': resetCode, 'new_password' : newPassword});
        console.log(response);
        return response;
    } catch (e) {
        console.log('error resetting password:', e);
        return { error: true, msg: e.response.data.msg };
    }
};

export const sendEmail = async (email) => {
  
    try {
        return await axios.post('/users/send-email/', { 'email': email });
    } catch (e) {
        console.log('error sending email:', e);
        return { error: true, msg: e.response.data.msg };
    }
};

export const signup = async ({username, email, password}) => {
  
    try {
        return await axios.post('/users/sign-up/', { username, email, password });
    } catch (e) {
        console.log('error creating new account:', e);
        return { error: true, msg: e.response.data.msg };
    }
};

export const signin = async ({ username, password }) => {
    //console.log("Signing in with credentials:", { username, password });
    try {
        const result = await axios.post('/users/token/', { username, password });
        console.log(`API POST CALL signin`);
        //console.log("API response received:", result);

        if (result.data && result.data.access) {
            //console.log("Access token:", result.data.access);
            setAuthHeader(result.data.access); // Assuming setAuthHeader is defined elsewhere
            return result; // Successful response
        } else {
            throw new Error("Unexpected response format");
        }
    } catch (e) {
        console.error("Error during signin:", e); // Log the full error object
        // Check if e.response exists before accessing its properties
        if (e.response) {
            console.log("Server responded with:", e.response.data);
            throw new Error(e.response.data.msg || 'Invalid credentials'); // Explicit rejection
        } else {
            // Handle network errors or other unexpected errors
            console.log("Network error or server not reachable");
            throw new Error('Network error or server not reachable'); // Explicit rejection
        }
    }
};


export const getCurrentUser = async () => {
    
    try {
        const response = await axios.get('/users/get-current/');
        console.log('API GET Call getCurrentUser');
       // console.log("API getCurrentUser: ", response);
        return response.data;
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            console.error('Error response:', error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('Error request:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error message:', error.message);
        }
        throw error;
    }
};



  export const updateSubscription = async (userId, fieldUpdates) => {  //is_subscribed_user, subscription_id, subscription_expiration_date
    try {
        const response = await axios.patch(`/users/${userId}/subscription/update/`, fieldUpdates);
        console.log('API PATCH CALL updateSubscription');
        //console.log('API response:', response.data); // Log the response data
        return response.data; // Ensure this returns the expected structure
    } catch (error) {
        console.error('Error updating user subscription:', error);
        throw error;
    }
  };





export const refreshAccessToken = async (refToken) => {
    try {
        const response = await axios.post('/users/token/refresh/', { refresh: refToken });
        const newAccessToken = response.data.access;
        setAuthHeader(newAccessToken);
        return response;
    } catch (e) {
        return { error: true, msg: e.response.data.msg };
    }
};
 

export const fetchFriendList = async () => {
    try {
        const response = await axios.get('/friends/all/');
        return response.data;
    } catch (error) {
        console.error('Error fetching friend list:', error);
        throw error;
    }
};


export const fetchFriendAddresses = async (friendId) => {
    try {
        const response = await axios.get(`/friends/${friendId}/addresses/all/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching friend dashboard data:', error);
        throw error;
    }
};


export const addFriendAddress = async (friendId, addressData) => {
    
    try {  
      const response = await axios.post(`/friends/${friendId}/addresses/add/`, addressData); // Include friendId in the URL
      return response.data;
    } catch (error) {
      console.error('Error adding friend address:', error);
      throw error;
    }
  };



  export const updateFriendAddress = async (friendId, addressId, fieldUpdates) => {
    
    try {  
      const response = await axios.patch(`/friends/${friendId}/address/${addressId}/`, fieldUpdates); 
      
      console.log('API PATCH CALL updateFriendAddress: ', addressId, fieldUpdates);
        
      return response.data;
    } catch (error) {
      console.error('Error adding friend address:', error);
      throw error;
    }
  };


  export const deleteFriendAddress = async (friendId, addressId) => {
    try {
        const response = await axios.delete(`/friends/${friendId}/address/${addressId}/`);
        return response.data;
    } catch (error) {
        console.error('Error deleting user address:', error);
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
        const response = await axios.get(`/users/addresses/all/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user addresses:', error);
        throw error;
    }
};

export const addUserAddress = async (addressData) => {
    try {
        console.log(addressData);

      const response = await axios.post(`/users/addresses/add/`, addressData); // Pass addressData directly
      return response.data;
    } catch (error) {
      console.error('Error adding user address:', error);
      throw error;
    }
  };


  //not finished yet 12/13/2024
  export const updateUserAddress = async (addressId, fieldUpdates) => {
    
    try {  
      const response = await axios.patch(`/users/address/${addressId}/`, fieldUpdates); 
      
      console.log('API PATCH CALL updateUserAddress: ', addressId, fieldUpdates);
        
      return response.data;
    } catch (error) {
      console.error('Error adding user address:', error);
      throw error;
    }
  };


  export const deleteUserAddress = async (addressId) => {
    try { 
        const response = await axios.delete(`/users/address/${addressId}/`); 

        if (response.status === 200) {
            console.log('Address deleted successfully');
            return { success: true }; 
        }

        return { success: false, message: 'Unexpected response status.' };
    } catch (error) {
        console.error('Error deleting user address:', error);

        // Check if error response is available and get the status
        if (error.response) {
            return { success: false, message: `Request failed with status code ${error.response.status}` };
        }
        
        return { success: false, message: 'Network error or other issue.' };
    }
};

  

export const validateAddress = async (userId, address) => {
    try {
        const response = await axios.post(`/friends/location/validate-only/`, {
            user: userId,
            address: address,
        });
        return response.data;
    } catch (error) {
        console.error('Error validating address:', error);
    }
};
  

export const GetTravelComparisons = async (locationData) => {
      try {
 
        const response = await axios.post(`/friends/places/`, locationData);
        //console.log('Consider the Drive Response', response.data);
        return response.data;
      } catch (error) {
        console.error('Error submitting addresses:', error); 
        }
};

export const SearchForMidpointLocations = async (locationData) => {
    try {
 
      const response = await axios.post(`/friends/places/near-midpoint/`, locationData);
      //console.log('Search for Midpoint Response:', response.data);
      return response.data.suggested_places;
    } catch (error) {
      console.error('Error searching for midpoint locations:', error); 
      }
};

export const updateUserAccessibilitySettings = async (userId, fieldUpdates) => {
    try {
        const response = await axios.patch(`/users/${userId}/settings/update/`, fieldUpdates);
        console.log('API PATCH CALL updateUserAccessibilitySettings');
        //console.log('API response:', response.data); // Log the response data
        return response.data; // Ensure this returns the expected structure
    } catch (error) {
        console.error('Error updating user settings:', error);
        throw error;
    }
  };



export const updateUserProfile = async (userId, firstName, lastName, dateOfBirth, gender, address) => {
    try {
      await axios.put(`/users/${userId}/profile/update/`, {
        user: userId,
        first_name: firstName,
        last_name: lastName,
        date_of_birth: dateOfBirth,
        gender: gender,
        addresses: address
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };



export const fetchFriendDashboard = async (friendId) => {
    try {
        const response = await axios.get(`/friends/${friendId}/dashboard/`);
        console.log('API GET CALL fetchFriendDashboard', response.data );
      
        return response.data;
    } catch (error) {
        console.error('Error fetching friend dashboard data:', error);
        throw error;
    }
};

export const remixAllNextHelloes = async (userId) => {
    try {
        const response = await axios.post(`/friends/remix/all/`, userId);
        return response.data;
    } catch (error) {
        console.error('Error remixing next helloes:', error);
        throw error;
    }
};

export const addToFriendFavesLocations = async (data) => {
    //console.log(data);
    try {
        const response = await axios.patch(`/friends/${data.friendId}/faves/add/location/`, {
            
            friend: data.friendId,
            user: data.userId, 
            location_id: data.locationId // Use an array if locationId is a single ID
        });
        //console.log('Location added to favorites: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error adding favorite location:', error);
        throw error;
    }
};



export const removeFromFriendFavesLocations = async (data) => {
    
    try {
        const response = await axios.patch(`/friends/${data.friendId}/faves/remove/location/`, {
            user: data.userId,
            friend: data.friendId,
            location_id: data.locationId  
        });
        return response.data;
    } catch (error) {
        console.error('Error removing favorite location:', error);
        throw error;
    }
};

export const updateFriendFavesColorThemeSetting = async (userId, friendId, savedDarkColor, savedLightColor) => { 
     
    try {
        const response = await axios.patch(`/friends/${friendId}/faves/`, {
            
            friend: friendId,
            user: userId, 
            dark_color: savedDarkColor,
            light_color: savedLightColor,
            use_friend_color_theme: true,
        });
        console.log('API PATCH CALL updateFriendFavesColorThemeSetting');
        return response.data;
    } catch (error) {
        console.error('Error updating color theme setting for friend:', error);
        throw error;
    }
};

export const resetFriendFavesColorThemeToDefault = async (userId, friendId, setting) => {

    
    try {
        const response = await axios.patch(`/friends/${friendId}/faves/`, {
            
            friend: friendId,
            user: userId, 
            dark_color: '#4caf50',
            light_color: '#a0f143',
            font_color: '#000000',
            font_color_secondary: '#000000',
            use_friend_color_theme: false,
        });
        
        console.log(`API PATCH CALL resetFriendFavesColorThemeToDefault`);
        return response.data;
    } catch (error) {
        console.error('Error updating color theme setting for friend:', error);
        throw error;
    }
};

//Don't think this is in use anymore, it was a dumb option
export const updateFriendFavesColorThemeGradientDirection = async (userId, friendId, setting) => {
    //console.log(`color theme gradient direction call, ${userId}, ${friendId}, ${setting}`);
    try {
        const response = await axios.patch(`/friends/${friendId}/faves/`, {
            
            friend: friendId,
            user: userId, 
            second_color_option: setting,
        });
        console.log('Color theme gradient direction for friend updated: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating color theme gradient direction for friend:', error);
        throw error;
    }
};


export const updateFriendFavesColorTheme = async (userId, friendId, darkColor, lightColor, fontColor, fontColorSecondary) => {
    
    try {
        const response = await axios.patch(`/friends/${friendId}/faves/`, {
            
            friend: friendId,
            user: userId, 
            dark_color: darkColor,
            light_color: lightColor,
            font_color: fontColor,
            font_color_secondary: fontColorSecondary,
            use_friend_color_theme: true,
        });
        console.log('Color theme for friend updated: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating color theme for friend:', error);
        throw error;
    }
};

//this will update the theme colors in Friend Faves and Friend but will
//leave the saved colors in Friend untouched, so that they can be used later
export const resetFriendFavesColorThemeToDefaultOld = async (userId, friendId, darkColor, lightColor, fontColor, fontColorSecondary) => {
    
    try {
        const response = await axios.patch(`/friends/${friendId}/faves/`, {
            
            friend: friendId,
            user: userId, 
            dark_color: darkColor,
            light_color: lightColor,
            font_color: fontColor,
            font_color_secondary: fontColorSecondary,
            use_friend_color_theme: false,
        });
        console.log('Color theme for friend updated: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating color theme for friend:', error);
        throw error;
    }
};




export const fetchUpcomingHelloes = async () => {
    try {
        const response = await axios.get('/friends/upcoming/');
        console.log("API GET CALL fetchUpcomingHelloes");
        return response.data;
    } catch (error) {
        // Log the entire error object for debugging
        //console.error('ERROR API GET CALL fetchUpcomingHelloes:', error);

        // Log specific details about the error if they exist
        if (error.response) {
            // If the server responded with a status code out of the 2xx range
            //console.error('Error Response:', error.response);
            console.error('Response Status:', error.response.status); // e.g., 500
            console.error('Response Headers:', error.response.headers);
           //console.error('Response Data:', error.response.data); // Error message from server
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
    try {
        const response = await axios.get(`/friends/${friendId}/thoughtcapsules/`);
        if (response && response.data) { 
            const capsules = response.data.map(capsule => ({
                id: capsule.id,
                typedCategory: capsule.typed_category || 'Uncategorized',
                capsule: capsule.capsule,
                created: capsule.created_on,
                preAdded: capsule.pre_added_to_hello,
            }));
            return capsules;
        } else {
            console.log("fetchThoughtCapsules: no capsules added yet");
            return []; // Return an empty array if no capsules
        }
    } catch (error) {
        console.error('Error fetching thought capsules: ', error);
        throw error;
    }
};



export const deleteHelloAPI = async (data) => {
    try {
        const response = await axios.delete(`/friends/${data.friend}/helloes/${data.id}/`);
        return response.data;
    } catch (error) {
        console.error('Error deleting hello:', error);
        throw error;
    }
};

// NOT CORRECT OR COMPLETE
// export const updateHelloAPI = async (friendId, helloId, helloesData) => {
//     try {
//         const response = await axios.patch(`/friends/${friendId}/helloes/${helloId}/`, helloesData);
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
        const response = await axios.get(`/friends/${friendId}/helloes/`);
        if (response && response.data) {
            const helloesData = response.data;
            console.log('API GET CALL fetchPastHelloes');

            const formattedHelloesList = helloesData.map(hello => ({
                id: hello.id,
                created: hello.created_on,
                updated: hello.updated_on,
                dateLong: hello.date,
                date: hello.past_date_in_words,
                type: hello.type,
                typedLocation: hello.typed_location,
                locationName: hello.location_name,
                location: hello.location, 
                additionalNotes: hello.additional_notes,
                pastCapsules: hello.thought_capsules_shared
                    ? Object.keys(hello.thought_capsules_shared).map(key => ({
                          id: key,
                          capsule: hello.thought_capsules_shared[key].capsule,
                          typed_category: hello.thought_capsules_shared[key].typed_category,
                      }))
                    : []
            })); 

            return formattedHelloesList; 
        } else {
            console.log("fetchPastHelloes: no helloes added yet");
            return [];
        }
    } catch (error) {
        console.error('Error fetching helloes: ', error);
        throw error;
    }
};




export const saveMomentAPI = async (requestData) => {
    
    try {
        const response = await axios.post(`/friends/${requestData.friend}/thoughtcapsules/add/`, requestData);
        return response.data;
    } catch (error) {
        console.error('Error saving thought capsule:', error);
        throw error;
    }
};


export const saveHello = async (requestData) => {

    try {
        const response = await axios.post(`/friends/${requestData.friend}/helloes/add/`, requestData);
        console.log('response from saveHello endpoint: ', response);
        return response;
        
    } catch (error) {
        console.error('Error saving hello:', error);
        console.log(response.data);
        throw error;
    }
};



export const deleteMomentAPI = async (data) => {
    try {
        const response = await axios.delete(`/friends/${data.friend}/thoughtcapsule/${data.id}/`);
        return response.data;
    } catch (error) {
        console.error('Error deleting thought capsule:', error);
        throw error;
    }
};

export const updateMomentAPI = async (friendId, capsuleId, capsuleData) => {
    console.log(`data in updateMomentApi ${capsuleId}, ${capsuleData}`);
    try {
        const response = await axios.patch(`/friends/${friendId}/thoughtcapsule/${capsuleId}/`, capsuleData);
        console.log(response.capsule);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error updating thought capsule:', {
                message: error.message,
                status: error.response.status,
                data: error.response.data,
            });
        } else {
            console.error('Error updating thought capsule:', error.message);
        }
        throw error;
    }
};


export const updateMultMomentsAPI = async (friendId, capsulesAndChanges) => {
    try {
        
        const capsuleData = { 
                capsules: capsulesAndChanges.map(capsule => ({
                id: capsule.id,
                fields_to_update: capsule.fieldsToUpdate
        })) };

        console.log('updateThoughtCapsules payload data: ', capsuleData);

        const response = await axios.patch(`/friends/${friendId}/thoughtcapsules/batch-update/`, capsuleData);
        return response.data;
    } catch (error) {
        console.error('Error batch-updating thought capsules:', error);
        throw error;
    }
};





export const fetchAllLocations = async () => {
    try {
        const response = await axios.get('/friends/locations/all/');

        const formattedLocations = response.data.map(location => ({
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
            friends: location.friends ? location.friends.map(friend => ({
                id: friend,
                name: friend,
            })) : []
        })); 
        return formattedLocations;
    } catch (error) {
        console.error('Error fetching all locations:', error);
        throw error;
    }
};

export const createLocation = async (locationData) => {
    try { 
        const response = await axios.post('/friends/locations/add/', locationData);
        console.log('API Response:', response); // Log the full response for debugging
        return response.data; // Ensure that this is what you expect
    } catch (error) {
        console.error('Error creating location:', error, locationData);
        throw error;
    }
};

export const deleteLocation = async (locationId) => {
    console.log(locationId);
    try {
        const response = await axios.delete(`friends/location/${locationId}/`);
        return response.data;
    } catch (error) {
        console.error('Error deleting location:', error);
        throw error;
    }
};


export const updateLocation = async (locationId, locationData) => {
    console.log('updateLocation payload in api file: ', locationData);
    try {
        const response = await axios.patch(`friends/location/${locationId}/`, locationData);
        return response.data;
    } catch (error) {
        console.error('Error updating location:', error);
        throw error;
    }
};


// Not being used
export const fetchValidatedLocations = async () => {
    try {
        const response = await axios.get('/friends/locations/validated/');

        const formattedLocations = response.data.map(location => ({
            id: location.id,
            address: location.address,
            latitude: location.latitude,
            longitude: location.longitude,
            notes: location.notes,
            title: location.title,
            notes: location.personal_experience_info,
            validatedAddress: location.validated_address,
            friendsCount: location.friends ? location.friends.length : 0,
            friends: location.friends ? location.friends.map(friend => ({
                id: friend.id,
                name: friend.name,
            })) : []
        }));
         

        //console.log("API formatted data validated locations: ", formattedLocations);
        return formattedLocations;
    } catch (error) {
        console.error('Error fetching validated locations:', error);
        throw error;
    }
};



export const createFriend = async (friendData) => {
    try {
        const res = await axios.post('/friends/create/', friendData);
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const deleteFriend = async (friendId) => {

    try {
        const response = await axios.delete(`/friends/${friendId}/info/`);
        return response.data;
    } catch (error) {
        console.error('Error deleting friend:', error);
        throw error;
    }
};



export const updateFriendSugSettings = async (SugSettingsData) => {
    try {
        const res = await axios.put(`/friends/${SugSettingsData.friend}/settings/update/`, SugSettingsData);
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};




export const updateAppSetup = async () => {
    try {
        const response = await axios.post('/friends/update-app-setup/');
        return response.data;
    } catch (error) {
        console.error('Error updating app setup:', error);
        throw error;
    }
};


export const fetchFriendImagesByCategory = async (friendId) => {
    try {
        const response = await axios.get(`/friends/${friendId}/images/by-category/`);
        console.log("API GET CALL fetchFriendImagesByCategory"); //, response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching friend images by category:', error);
        throw error;
    }
};



export const createFriendImage = async (friendId, formData) => {
    console.log('FormData in createFriendImage:', friendId, formData);
    
    try {
        const response = await axios.post(`/friends/${friendId}/images/add/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('Image created successfully:', response.data);
        return response.data; // Return the created image data if needed
    } catch (error) {
        console.error('Error creating friend image:', error);
        throw error; // Throw error to handle it in component level
    }
};


export const fetchFriendImage = async (friendId, imageId) => {
    
    try {
        const response = await axios.get(`/friends/${friendId}/image/${imageId}/`);

        console.log('API fetchFriendImage response: ', response.data);
        return response.data; 
    } catch (error) {
        console.error('API fetchFriendImage error: ', error);
        throw error; 
    }
};

export const updateFriendImage = async (friendId, imageId) => {
    
    try {
        const response = await axios.patch(`/friends/${friendId}/image/${imageId}/`);

        console.log('API updateFriendImage response: ', response.data);
        return response.data; 
    } catch (error) {
        console.error('API updateFriendImage error: ', error);
        throw error; 
    }
};


export const deleteFriendImage = async (friendId, imageId) => {
    
    try {
        const response = await axios.delete(`/friends/${friendId}/image/${imageId}/`);

        console.log('API fetchFriendImage response: ', response.data);
        return response.data; 
    } catch (error) {
        console.error('API fetchFriendImage error: ', error);
        throw error; 
    }
};



export const fetchTypeChoices = async () => {
    try {
        const response = await axios.get('friends/dropdown/hello-type-choices/');
        return response.data.type_choices;
    } catch (error) {
        console.error('Error fetching type choices:', error);
        throw error;
    }
};

export const fetchParkingChoices = async () => {
    try {
        const response = await axios.get('friends/dropdown/location-parking-type-choices/');
        console.log('fetchParkingChoices: ', response.data.type_choices);
        return response.data.type_choices;
    } catch (error) {
        console.error('Error fetching parking choices:', error);
        throw error;
    }
};



export const fetchLocationDetails = async (locationData) => {
    try {
         
      const response = await axios.post('/friends/places/get-details/', locationData);
  
      console.log(`API POST CALL fetchLocationDetails`);
      return response.data;
  
    } catch (error) {
      console.error('Error fetching location details:', error.message);
      throw error; 
      
    }
  };