import React, { useEffect, useRef, useState } from 'react';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useAuthUser } from '../context/AuthUserContext';
import { addUserAddress, addFriendAddress, fetchFriendAddresses, deleteFriendAddress } from '../api'; 
import { useMessage } from '../context/MessageContext';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';  

 
const useStartingAddresses = () => {  
    const { authUserState } = useAuthUser(); 
    const { selectedFriend, friendDashboardData } = useSelectedFriend();  
    const [ userAddresses, setUserAddresses ] = useState([]);
    const queryClient = useQueryClient(); 
    const { showMessage } = useMessage();
    //const [ friendAddresses, setFriendAddresses ] = useState([]);

    const { data: friendAddresses = [], isLoading, isFetching, isSuccess, isError } = useQuery({
        queryKey: ['friendAddresses', selectedFriend?.id],
        queryFn: () => fetchFriendAddresses(selectedFriend.id),
        enabled: !!friendDashboardData,
        onSuccess: (data) => { 
            console.log(friendAddresses);
            
        }
    });

    const timeoutRef = useRef(null);

    useEffect(() => {
        if (authUserState) {
            const addresses = getUserAddresses();
            setUserAddresses((prev) => JSON.stringify(prev) !== JSON.stringify(addresses) ? addresses : prev);
        }
    }, [authUserState]);


   // useEffect(() => {
     //   const addresses = getFriendAddresses();
       // setFriendAddresses((prev) => JSON.stringify(prev) !== JSON.stringify(addresses) ? addresses : prev);
   // }, [friendDashboardData]);


    const getUserAddresses = () => {
        return authUserState?.user?.addresses || [];  
    };

  //  const getFriendAddresses = () => friendDashboardData?.[0]?.friend_addresses || [];

 //I don't know if this is enough/might need to reset source data
    const createUserAddress = async ({title, address}) => {
        try {
          const addressData = {
            title: title,
            address: address,
          };
          response = await addUserAddress(authUserState.user.id, addressData);
          console.log('createUserAddress in useStartingAddresses:', response);
          setUserAddresses(prevAddresses => [...prevAddresses, response]);

        } catch (error) {
          console.error('Error adding address in createUserAddress in useStartingAddresses:', error); 
        }
      };

      const createFriendAddressMutation = useMutation({
        mutationFn: (data) => addFriendAddress(selectedFriend.id, data),
        onSuccess: () => {
            showMessage(true, null, `Address added for ${selectedFriend.name}!`);
            
            queryClient.invalidateQueries(['friendAddresses', selectedFriend?.id]);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
              }

 
            timeoutRef.current = setTimeout(() => {
                createFriendAddressMutation.reset(); 
              }, 2000);
        },
        onError: (error) => { 
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
              }

              showMessage(true, null, 'Oops! Error adding address');
            console.error('Error adding address:', error);
            timeoutRef.current = setTimeout(() => {
                createFriendAddressMutation.reset(); 
              }, 2000);
        },

      });

      
      const deleteFriendAddressMutation = useMutation({
        mutationFn: (data) => deleteFriendAddress(selectedFriend.id, data),
        onSuccess: () => {
            showMessage(true, null, `Address deleted for ${selectedFriend.name}!`);
            
            queryClient.invalidateQueries(['friendAddresses', selectedFriend?.id]);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
              }

 
            timeoutRef.current = setTimeout(() => {
                deleteFriendAddressMutation.reset(); 
              }, 2000);
        },
        onError: (error) => { 
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
              }

              showMessage(true, null, 'Oops! Error deleting address');
            console.error('Error deleting address:', error);
            timeoutRef.current = setTimeout(() => {
                deleteFriendAddressMutation.reset(); 
              }, 2000);
        },

      });

      

 

      const createFriendAddress = (friendId, title, address) => {
        try {
          const addressData = {
            title,
            address,
            friend: friendId,
            user: authUserState.user.id,
          };

          createFriendAddressMutation.mutate(addressData);

    
        } catch (error) {
          console.error('Error adding address to friend addresses: ', error);
         
        }
      };
    

      const removeFriendAddress = (friendId, addressId) => {
        try {
          const addressData = { 
            address: addressId,
            friend: friendId, 
             
          };

          deleteFriendAddressMutation.mutate(addressId);

    
        } catch (error) {
          console.error('Error deleting address from friend addresses: ', error);
         
        }
      };


    
 
  
  

    return { 
        userAddresses,
        friendAddresses,  
        createUserAddress,
        createFriendAddress,
        removeFriendAddress,
};

}



export default useStartingAddresses;
