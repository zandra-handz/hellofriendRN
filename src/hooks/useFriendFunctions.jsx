// we are invalidating upcomingHelloes when friend added or removed with this line:
// queryClient.invalidateQueries(['upcomingHelloes']);

// also running updateAppSetup from api file in parent component that is creating a new friend
// based on if app_setup_complete is not already true for current user

import {  useRef } from 'react';
import {  useMutation, useQueryClient } from '@tanstack/react-query'; 
import { useMessage } from '@/src/context/MessageContext';
import { useUser } from '@/src/context/UserContext';
import { useFriendList } from '@/src/context/FriendListContext';

import { createFriend, updateFriendSugSettings, deleteFriend  } from '@/src/calls/api';


const useFriendFunctions = () => { 
    const { addToFriendList, removeFromFriendList } = useFriendList();
    const {  user } = useUser();
    const queryClient = useQueryClient(); 
    const { showMessage } = useMessage();

 

    const timeoutRef = useRef(null);


    
    const handleCreateFriend = async (data) => {
        const friend = {
            name: data.name,
            first_name: data.first_name, 
            last_name: data.last_name, 
            first_meet_entered: data.first_meet_entered,
            friendEffort: data.friendEffort,
            friendPriority: data.friendPriority
        };
    
       // console.log("Payload in RQ function before sending:", friend);
    
        try {
            await createFriendMutation.mutateAsync({ ...friend, effort: data.friendEffort, priority: data.friendPriority });
        } catch (error) {
          console.error("Error saving new friend in RQ function: ", error);
        }
      };


      const updateFriendSettingsMutation = useMutation({
        mutationFn: (data) => updateFriendSugSettings(data),
        onSuccess: () => {
            console.log('Friend suggestion settings updated successfully.');
            queryClient.invalidateQueries(['upcomingHelloes']);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
    
            timeoutRef.current = setTimeout(() => {
                updateFriendSettingsMutation.reset();
            }, 2000);
            
        },
        onError: (error) => {
            console.error('Error updating friend suggestion settings: ', error);
            showMessage(true, null, 'Error updating settings! You can update this manually in the settings screen.');
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
    
            timeoutRef.current = setTimeout(() => {
                updateFriendSettingsMutation.reset();
            }, 2000); 
        
        },
    });


    const handleUpdateFriendSettings = async (user, friendId, effort, priority) => {
        const update = {
            user: user.user.id,
            friend: friendId,
            effort_required: effort,
            priority_level: priority,
        };
    
        //console.log("Payload in RQ function before sending:", update);
    
        try {
          await updateFriendSettingsMutation.mutateAsync(update); // Call the mutation with the location data
        } catch (error) {
          console.error("Error saving new friend in RQ function: ", error);
        }
      };



      const createFriendMutation = useMutation({
        mutationFn: (data) => createFriend(data),
        onError: (error) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
    
            timeoutRef.current = setTimeout(() => {
                createFriendMutation.reset();
            }, 2000);
        },
        onSuccess: (data, variables) => {
            
            const { effort, priority } = variables; // Extract original input values
    
            queryClient.setQueryData('newFriend', (oldData) => ({
                ...oldData, // preserve any existing data
                newFriend: data, // update with the new data
            }));
    
            // Extract the friendId from the response
            const friendId = data?.id; // Adjust based on the API response structure

            addToFriendList(data);
            showMessage(true, null, 'Friend added!');

            if (friendId) {

                // Trigger the update function with original input values
                handleUpdateFriendSettings(user.user, friendId, effort, priority);
                
            }
     
        },
        onError: (error) => {
            console.error('Error deleting friend in mutation function: ', error);
        },
    });

    const handleDeleteFriend = async (friendId) => {
     
     
    
        try {
            await deleteFriendMutation.mutateAsync(friendId);
        } catch (error) {
          console.error("Error deleting new friend in RQ function: ", error);
        }
      };


    

        const deleteFriendMutation = useMutation({
            mutationFn: (friendId) => deleteFriend(friendId), // Pass friendId and imageId
            onSuccess: (data) => { 
                console.log('deleted friend response:', data.id);
                showMessage(true, null, 'Friend deleted!');

                //id is from RESPONSE FROM BACKEND
                //this was behaving inconsistently in Expo and I'm not sure why
                removeFromFriendList(data.id);
                
                queryClient.invalidateQueries(['upcomingHelloes']);
     
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                  }
    
     
                timeoutRef.current = setTimeout(() => {
                    deleteFriendMutation.reset(); 
                  }, 2000);
    
            },
            onError: (error) => {
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                  }
    
    
                console.error('Error deleting friend:', error);
                showMessage(true, null, 'Oops! Friend not deleted');
                timeoutRef.current = setTimeout(() => {
                    deleteFriendMutation.reset(); 
                  }, 2000);
            },
        });
    
    
 

    return {
        handleCreateFriend,
        handleUpdateFriendSettings,
        createFriendMutation,
        updateFriendSettingsMutation,
        handleDeleteFriend,
        deleteFriendMutation,
     };

}


export default useFriendFunctions;