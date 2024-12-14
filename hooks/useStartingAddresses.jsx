import React, { useEffect, useRef, useState } from 'react';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useAuthUser } from '../context/AuthUserContext';
import { addUserAddress, deleteUserAddress, fetchUserAddresses, addFriendAddress, updateFriendAddress, fetchFriendAddresses, deleteFriendAddress } from '../api'; 
import { useMessage } from '../context/MessageContext';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';  

 
const useStartingAddresses = () => {  
    const { authUserState } = useAuthUser(); 
    const { selectedFriend, friendDashboardData } = useSelectedFriend();  
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

    const { data: userAddresses = [], isLoadingUserAddresses, isFetchingUserAddresses, isSuccessUserAddresses, isErrorUserAddresses } = useQuery({
      queryKey: ['userAddresses'],
      queryFn: () => fetchUserAddresses(),
      enabled: !!authUserState?.authenticated,
      onSuccess: (data) => { 
          console.log(userAddresses);
          
      }
  });

    const timeoutRef = useRef(null);


    const createUserAddressMutation = useMutation({
      mutationFn: (data) => addUserAddress(data),
      onSuccess: () => {
          showMessage(true, null, `Address added`);
          
          queryClient.invalidateQueries(['userAddresses']);
          if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }


          timeoutRef.current = setTimeout(() => {
              createUserAddressMutation.reset(); 
            }, 2000);
      },
      onError: (error) => { 
          if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }

            showMessage(true, null, 'Oops! Error adding address');
          console.error('Error adding address:', error);
          timeoutRef.current = setTimeout(() => {
              createUserAddressMutation.reset(); 
            }, 2000);
      },

    });


    const deleteUserAddressMutation = useMutation({
      mutationFn: (data) => deleteUserAddress(data),
      onSuccess: () => {
          showMessage(true, null, `Address deleted!`);
          
          queryClient.invalidateQueries(['userAddresses']);
          if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }


          timeoutRef.current = setTimeout(() => {
              deleteUserAddressMutation.reset(); 
            }, 2000);
      },
      onError: (error) => { 
          if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }

            showMessage(true, null, 'Oops! Error deleting address');
          console.error('Error deleting address:', error);
          timeoutRef.current = setTimeout(() => {
              deleteUserAddressMutation.reset(); 
            }, 2000);
      },

    });


    const createUserAddress = (title, address) => {
      try {
        const addressData = {
          title,
          address, 
          user: authUserState.user.id,
        };

        createUserAddressMutation.mutate(addressData);

  
      } catch (error) {
        console.error('Error adding address to friend addresses: ', error);
       
      }
    };
  

    const removeUserAddress = (addressId) => {
      try {
        const addressData = { 
          address: addressId, 
           
        };

        deleteUserAddressMutation.mutate(addressId);
      } catch (error) {
        console.error('Error deleting address from friend addresses: ', error);
      }
    };

 

  
  //  const getFriendAddresses = () => friendDashboardData?.[0]?.friend_addresses || [];

 

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

      const updateFriendAddressMutation = useMutation({
        mutationFn: ({ friend, id, fieldUpdates }) => 
          updateFriendAddress(friend, id, fieldUpdates),
        onSuccess: () => {
          showMessage(true, null, `Address updated for ${selectedFriend.name}!`);
          //queryClient.invalidateQueries(['friendAddresses', selectedFriend?.id]);
      
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
      
          timeoutRef.current = setTimeout(() => {
            updateFriendAddressMutation.reset();
          }, 2000);
        },
        onError: (error) => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
      
          showMessage(true, null, 'Oops! Error adding address');
          console.error('Error adding address:', error);
      
          timeoutRef.current = setTimeout(() => {
            updateFriendAddressMutation.reset();
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


      const updateFriendDefaultAddress = async (friendId, addressId, newData) => {
        console.log(`updateFriendAddress: `, friendId, addressId, newData);
        try {
          await updateFriendAddressMutation.mutateAsync({
            friend: friendId,
            user: authUserState.user.id,
            id: addressId,
            fieldUpdates: newData,
          });
        } catch (error) {
          console.error('Error adding address to friend addresses: ', error);
        }
      };
      


    
 
  
  

    return { 
        userAddresses, 
        createUserAddress,
        removeUserAddress,
        friendAddresses,   
        createFriendAddress,
        updateFriendDefaultAddress,
        removeFriendAddress,
};

}



export default useStartingAddresses;
