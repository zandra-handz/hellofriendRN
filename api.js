import axios from 'axios';

export const API_URL = 'https://ac67e9fa-7838-487d-a3bc-e7a176f4bfbf-dev.e1-us-cdp-2.choreoapis.dev/hellofriend/hellofriend/rest-api-be2/v1.0/';

// Set the base URL for Axios requests
axios.defaults.baseURL = API_URL;

// Function to set authorization header with token
export const setAuthHeader = (token) => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
};

export const signup = async (username, email, password) => {
    try {
        return await axios.post('/users/sign-up/', { username, email, password });
    } catch (e) {
        return { error: true, msg: e.response.data.msg };
    }
};

export const signin = async (username, password) => {
    try {
        const result = await axios.post('/users/token/', { username, password });
        console.log("API signin result: ", result);
        setAuthHeader(result.data.access); 
        return result;
    } catch (e) {
        return { error: true, msg: e.response.data.msg };
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await axios.get('/users/get-current/');
        console.log("API getCurrentUser: ", response);
        return response.data;
        
    } catch (error) {
        console.error('Error fetching current user:', error);
        throw error;
    }
};


export const signout = async () => {
    try {
        
        setAuthHeader(null); 
        console.log("API signout: Authorization header cleared");
        return true;
    } catch (e) {
        console.log("API signout error", e);
        return false;
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
    console.log('addFriendAddress', {addressData}); 
    try {  
      const response = await axios.post(`/friends/${friendId}/addresses/add/`, addressData); // Include friendId in the URL
      return response.data;
    } catch (error) {
      console.error('Error adding friend address:', error);
      throw error;
    }
  };


  export const deleteFriendAddress = async (friendId, addressId) => {
    try {
        const response = await axios.delete(`/friends/${friendId}/address/${addressId}/`);
        console.log('Address deleted successfully');
        return response.data;
    } catch (error) {
        console.error('Error deleting user address:', error);
        throw error;
    }
};


export const addUserAddress = async (userId, addressData) => {
    try {

      const response = await axios.post(`/users/${userId}/addresses/add/`, addressData); // Pass addressData directly
      return response.data;
    } catch (error) {
      console.error('Error adding user address:', error);
      throw error;
    }
  };


  export const deleteUserAddress = async (userId, title) => {
    try { 
      console.log('deleteUserAddress payload: ', {userId, title});
      const response = await axios.post(`/users/${userId}/addresses/delete/`, title); // Pass addressData directly
      console.log('Address deleted successfully');
      return response.data;
    } catch (error) {
      console.error('Error deleting user address:', error);
      throw error;
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

        console.log(locationData);
        const response = await axios.post(`/friends/places/`, locationData);
        console.log('Consider the Drive Response:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error submitting addresses:', error); 
        }
};

export const SearchForMidpointLocations = async (locationData) => {
    try {

      console.log(locationData);
      const response = await axios.post(`/friends/places/near-midpoint/`, locationData);
      console.log('Search for Midpoint Response:', response.data);
      return response.data.suggested_places;
    } catch (error) {
      console.error('Error searching for midpoint locations:', error); 
      }
};

export const updateUserAccessibilitySettings = async (userId, fieldUpdates) => {
    try {
      await axios.patch(`/users/${userId}/settings/update/`, fieldUpdates);
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
        console.log('fetchFriendDashboard Id sent:', friendId);
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

export const addToFriendFavesLocations = async (userId, friendId, locationId) => {
    console.log(`favorite locations add call, ${userId}, ${friendId}, ${locationId}`);
    try {
        const response = await axios.patch(`/friends/${friendId}/faves/add/location/`, {
            
            friend: friendId,
            user: userId, 
            location_id: locationId // Use an array if locationId is a single ID
        });
        console.log('Location added to favorites: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error adding favorite location:', error);
        throw error;
    }
};



export const removeFromFriendFavesLocations = async (userId, friendId, locationId) => {
    console.log(`favorite locations add call, ${userId}, ${friendId}, ${locationId}`);
    try {
        const response = await axios.patch(`/friends/${friendId}/faves/remove/location/`, {
            user: userId,
            friend: friendId,
            location_id: locationId  
        });
        return response.data;
    } catch (error) {
        console.error('Error adding favorite location:', error);
        throw error;
    }
};

export const updateFriendFavesColorThemeSetting = async (userId, friendId, setting) => {
    console.log(`color theme setting call, ${userId}, ${friendId}, ${setting}`);
    try {
        const response = await axios.patch(`/friends/${friendId}/faves/`, {
            
            friend: friendId,
            user: userId, 
            use_friend_color_theme: setting,
        });
        console.log('Color theme setting for friend updated: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating color theme setting for friend:', error);
        throw error;
    }
};

export const updateFriendFavesColorThemeGradientDirection = async (userId, friendId, setting) => {
    console.log(`color theme gradient direction call, ${userId}, ${friendId}, ${setting}`);
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


export const updateFriendFavesColorTheme = async (userId, friendId, darkColor, lightColor) => {
    console.log(`color theme add call, ${userId}, ${friendId}, ${darkColor}, ${lightColor}`);
    try {
        const response = await axios.patch(`/friends/${friendId}/faves/`, {
            
            friend: friendId,
            user: userId, 
            dark_color: darkColor,
            light_color: lightColor
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
        console.log("Upcoming called: ", response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching upcoming helloes:', error);
        throw error;
    }
};




export const fetchThoughtCapsules = async (friendId) => {
    try {
        const response = await axios.get(`/friends/${friendId}/thoughtcapsules/`);
        if (response) {
            const capsuleData = response.data;
            const formattedCapsuleList = capsuleData.map(capsule => ({
                id: capsule.id,
                typedCategory: capsule.typed_category,
                capsule: capsule.capsule,
                created: capsule.created_on,
            }));
            return formattedCapsuleList;
        } else {
            console.log("fetchThoughtCapsules: no capsules added yet");
            return;
        }
    } catch (error) {
        console.error('Error fetching thought capsules: ', error);
        throw error;
    }
};



export const fetchPastHelloes = async (friendId) => {
    try {
        const response = await axios.get(`/friends/${friendId}/helloes/`);
        if (response && response.data) {
            const helloesData = response.data;
            console.log('pastHelloes data: ', helloesData);

            const formattedHelloesList = helloesData.map(hello => ({
                id: hello.id,
                date: hello.past_date_in_words,
                type: hello.type,
                typedLocation: hello.typed_location,
                locationName: hello.location_name,
                location: hello.location, 
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




export const saveThoughtCapsule = async (requestData) => {
    
    try {
        const response = await axios.post(`/friends/${requestData.friend}/thoughtcapsules/add/`, requestData);
        return response.data;
    } catch (error) {
        console.error('Error saving thought capsule:', error);
        throw error;
    }
};


export const saveHello = async (requestData) => {
    console.log(requestData);
    try {
        const response = await axios.post(`/friends/${requestData.friend}/helloes/add/`, requestData);
        return response.data;
    } catch (error) {
        console.error('Error saving hello:', error);
        console.log(response.data);
        throw error;
    }
};



export const deleteThoughtCapsule = async (friendId, capsuleId) => {
    try {
        const response = await axios.delete(`/friends/${friendId}/thoughtcapsules/${capsuleId}/`);
        return response.data;
    } catch (error) {
        console.error('Error deleting thought capsule:', error);
        throw error;
    }
};





export const fetchAllLocations = async () => {
    try {
        const response = await axios.get('/friends/locations/all/');

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
                id: friend,
                name: friend,
            })) : []
        }));
        console.log("API formatted data all locations: ", formattedLocations);
        return formattedLocations;
    } catch (error) {
        console.error('Error fetching all locations:', error);
        throw error;
    }
};

export const createLocation = async (locationData) => {
    try {
        console.log('createLocation payload: ', locationData);
        const response = await axios.post('/friends/locations/add/', locationData);
        console.log(response.data);
        return response.data;
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
        console.log(response);
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
         

        console.log("API formatted data validated locations: ", formattedLocations);
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
        console.log("images/: ", response);
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



export const fetchLocationDetails = async (locationData) => {
    try {
        
      console.log('Location data to get details for: ', locationData);
  
      const response = await axios.post('/friends/places/get-details/', locationData);
  
      // Handle the response data as needed
      console.log('fetchLocationDetails response: ', response.data);
      return response.data;
  
    } catch (error) {
      console.error('Error fetching location details:', error.message);
      throw error; // Re-throw the error to be handled by the calling code
    }
  };