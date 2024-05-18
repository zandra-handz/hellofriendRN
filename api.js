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
        console.error('Error fetching thought capsules:', error);
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
        return response.data;
    } catch (error) {
        console.error('Error fetching all locations:', error);
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