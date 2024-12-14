import React, { useEffect, useRef, useState } from 'react';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useAuthUser } from '../context/AuthUserContext';
import {  
  addFriendAddress, 
  updateFriendAddress, 
  fetchFriendAddresses, 
  deleteFriendAddress 
} from '../api'; 
import { useMessage } from '../context/MessageContext';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';  

 
const useStartingFriendAddresses = () => {  
    const { authUserState } = useAuthUser(); 
    const { selectedFriend } = useSelectedFriend();  
    const queryClient = useQueryClient(); 
    const { showMessage } = useMessage(); 
    const [ addressMenu, setAddressMenu ] = useState([]);
    const [ defaultAddress, setDefaultAddress ] = useState(null);

    const { data: friendAddresses = [], isLoading, isFetching, isSuccess, isError } = useQuery({
        queryKey: ['friendAddresses', selectedFriend?.id],
        queryFn: () => fetchFriendAddresses(selectedFriend.id),
        enabled: !!selectedFriend,
        onSuccess: (data) => { 
            console.log(friendAddresses);
            
        }
    });


    useEffect(() => {

        if (friendAddresses && friendAddresses.length > 0) {
            const menuItems = friendAddresses.map((address) => {
                const uniqueKey = `${address.title}-${address.coordinates ? address.coordinates.join(',') : `${address.latitude},${address.longitude}`}`;
    
                return {
                  key: uniqueKey, 
                  id: address.id,
                  address: address.address,
                  title: address.title,
                  label: address.title,
                  isDefault: address.is_default,
                  latitude: address.coordinates ? address.coordinates[0] : address.latitude,
                  longitude: address.coordinates ? address.coordinates[1] : address.longitude,
                  
                };
            });

            setDefaultAddress(menuItems.find(address => address.isDefault === true));
            setAddressMenu(menuItems);
        }

    }, [friendAddresses]);


 

    const timeoutRef = useRef(null); 

  
    const createFriendAddressMutation = useMutation({
        mutationFn: (data) => addFriendAddress(selectedFriend.id, data),
        onSuccess: (newAddress) => {
            showMessage(true, null, `Address added for ${selectedFriend.name}!`);
            
            queryClient.setQueryData(['friendAddresses', selectedFriend?.id], (oldData) => {
             
              if (!oldData || !Array.isArray(oldData)) return [newAddress]; // If no existing data, just return the new address in an array
              return [...oldData, newAddress]; 
            });

 
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
        onSuccess: (data) => {
            showMessage(true, null, `Address deleted for ${selectedFriend.name}!`);
            
            queryClient.setQueryData(['friendAddresses', selectedFriend?.id], (oldData) => {
              if (!oldData || !Array.isArray(oldData)) return []; // If no existing data, return an empty array
              return oldData.filter((address) => address.id !== data.id); // Filter out the deleted address
            });
            //queryClient.invalidateQueries(['friendAddresses', selectedFriend?.id]);
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
      
        onSuccess: (updatedAddress) => {
          showMessage(true, null, `Address updated for ${selectedFriend.name}!`);
       
          queryClient.setQueryData(['friendAddresses', selectedFriend?.id], (oldData) => {
            if (!oldData || !Array.isArray(oldData)) return [];  
      
            return oldData.map((address) => {

              

              if (address.is_default && address.id !== updatedAddress.id) {
                console.log('turning off default for', address.title);
              
                return { ...address, is_default: false };
              }
              if (address.id === updatedAddress.id) {
                console.log('turning on default for address ', address.title);
               
                return { ...address, is_default: true };
              }
 
        
              return address;
            });
          });
      
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
      
          showMessage(true, null, 'Oops! Error updating address');
          console.error('Error updating address:', error);
      
          timeoutRef.current = setTimeout(() => {
            updateFriendAddressMutation.reset();
          }, 2000);
        },
      });
      
 

      const createFriendAddress = (title, address) => {
        try {
          const addressData = {
            title,
            address,
            friend: selectedFriend.id,
            user: authUserState.user.id,
          };

          createFriendAddressMutation.mutate(addressData);

    
        } catch (error) {
          console.error('Error adding address to friend addresses: ', error);
         
        }
      };
    

      //selectedFriend.id is directly in mutation. still not sure which is better approach
      //this file is an unholy mix of both approaches right now sorry
      const removeFriendAddress = (addressId) => {
        try { 

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
        friendAddresses,  
        addressMenu,
        defaultAddress, 
        createFriendAddress,
        updateFriendDefaultAddress,
        removeFriendAddress,
};

}



export default useStartingFriendAddresses;
