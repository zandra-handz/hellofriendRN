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

export const fetchUserAddresses = async () => {
    try {
        const response = await axios.get(`/users/${userId}/addresses/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user addresses:', error);
        throw error;
    }
};

export const addUserAddress = async (addressData) => {
    try {
        const response = await axios.post(`/users/${userId}/addresses/add/`, addressData);
        return response.data;
    } catch (error) {
        console.error('Error adding user address:', error);
        throw error;
    }
};



export const fetchFriendDashboard = async (friendId) => {
    try {
        const response = await axios.get(`/friends/${friendId}/dashboard/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching friend dashboard data:', error);
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
                capsule: capsule.capsule
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
        if (response) {
            const helloesData = response.data;

            const formattedHelloesList = helloesData.map(hello => ({
                id: hello.id,
                date: hello.past_date_in_words,
                type: hello.type,
                pastCapsules: Object.keys(hello.thought_capsules_shared).map(key => ({
                    id: key,
                    capsule: hello.thought_capsules_shared[key].capsule,
                    typed_category: hello.thought_capsules_shared[key].typed_category,
                }))
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
    try {
        const response = await axios.post(`/friends/${requestData.friend}/helloes/add/`, requestData);
        return response.data;
    } catch (error) {
        console.error('Error saving hello:', error);
        throw error;
    }
};



export const deleteThoughtCapsule = async (capsuleId) => {
    try {
        const response = await axios.delete(`/thoughtcapsules/${capsuleId}/`);
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
                id: friend.id,
                name: friend.name,
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
        const response = await axios.post('/friends/locations/add/', locationData);
        return response.data;
    } catch (error) {
        console.error('Error creating location:', error);
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


export const fetchTypeChoices = async () => {
    try {
        const response = await axios.get('friends/dropdown/hello-type-choices/');
        return response.data.type_choices;
    } catch (error) {
        console.error('Error fetching type choices:', error);
        throw error;
    }
};



