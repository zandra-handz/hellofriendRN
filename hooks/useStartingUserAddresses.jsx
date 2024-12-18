import React, { useEffect, useRef, useState } from 'react';
import Geocoder from 'react-native-geocoding';
import { GOOGLE_API_KEY } from '@env';
 import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useAuthUser } from '../context/AuthUserContext';
import { 
  addUserAddress,
  updateUserAddress,
  deleteUserAddress, 
  fetchUserAddresses,  
} from '../api'; 
import { useMessage } from '../context/MessageContext';

import useCurrentLocation from '../hooks/useCurrentLocation';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';  

Geocoder.init(GOOGLE_API_KEY);

const useStartingUserAddresses = () => {
     const { authUserState } = useAuthUser(); 
    const queryClient = useQueryClient(); 
    const { showMessage } = useMessage(); 
    const [ userAddressMenu, setUserAddressMenu ] = useState([]);
    const [ defaultUserAddress, setDefaultUserAddress ] = useState(null);
    const [ usingCurrent, setUsingCurrent ] = useState(false);
    const {currentLocationDetails } = useCurrentLocation();
//useEffect(() => {
 // if (currentLocationDetails) {
 //   console.log('formatted location data', currentLocationDetails);
    
 // }

//}, [currentLocationDetails]);
 

    const { data: userAddresses = [], isLoadingUserAddresses, isFetchingUserAddresses, isSuccessUserAddresses, isErrorUserAddresses } = useQuery({
      queryKey: ['userAddresses'],
      queryFn: () => fetchUserAddresses(),
      enabled: !!authUserState?.authenticated,
      onSuccess: (data) => { 
          console.log(userAddresses);
          
      }
  });

  useEffect(() => {

    if (userAddresses && userAddresses.length > 0) {
        const menuItems = userAddresses.map((address) => {
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
        
        setUserAddressMenu(menuItems);

        
        if (currentLocationDetails) {
          setDefaultUserAddress(currentLocationDetails);
          setUsingCurrent(true);
      } else {
          const defaultAddress = menuItems.find(address => address.isDefault === true);
          
          if (defaultAddress) {
              setDefaultUserAddress(defaultAddress);
          } else if (menuItems.length > 0) {
              // If no default address but there are menu items, set the first one
              setDefaultUserAddress(menuItems[0]);
          } else { 
              // If no addresses exist, set to "no address"
              setDefaultUserAddress(null); // or "no address" if you prefer a string
          }
      }

    }

}, [userAddresses]);
 


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

    const updateUserAddressMutation = useMutation({
        mutationFn: ({ id, fieldUpdates }) => 
          updateUserAddress(id, fieldUpdates),
        onSuccess: () => {
          showMessage(true, null, `Address updated!`);
          queryClient.invalidateQueries(['userAddresses']);
      
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
      
          timeoutRef.current = setTimeout(() => {
            updateUserAddressMutation.reset();
          }, 2000);
        },
        onError: (error) => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
      
          showMessage(true, null, 'Oops! Error updating user address');
          console.error('Error updating address:', error);
      
          timeoutRef.current = setTimeout(() => {
            updateUserAddressMutation.reset();
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
  
    const updateUserDefaultAddress = async (addressId, newData) => {
      console.log(`updateUserAddress: `, addressId, newData);
      try {
        await updateUserAddressMutation.mutateAsync({ 
          user: authUserState.user.id,
          id: addressId,
          fieldUpdates: newData,
        });
      } catch (error) {
        console.error('Error adding address to user addresses: ', error);
      }
    };
    

    const removeUserAddress = (addressId) => {
      try { 

        deleteUserAddressMutation.mutate(addressId);
      } catch (error) {
        console.error('Error deleting address from friend addresses: ', error);
      }
    };

  


      

  
      
 

    
 

    
 
  
  

    return { 
        userAddresses, 
        userAddressMenu,
        defaultUserAddress,
        createUserAddress,
        updateUserDefaultAddress,
        removeUserAddress, 
        usingCurrent,
};

}



export default useStartingUserAddresses;
