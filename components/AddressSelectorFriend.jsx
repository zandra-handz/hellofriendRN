import React, { useState, useEffect } from 'react'; 
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Geocoder from 'react-native-geocoding';
import { GOOGLE_API_KEY } from '@env'; 
import SelectAddressModal from '../components/SelectAddressModal';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; 
import EditPencilOutlineSvg from '../assets/svgs/edit-pencil-outline.svg';
import { useGlobalStyle } from '../context/GlobalStyleContext';

import  useStartingFriendAddresses from '../hooks/useStartingFriendAddresses';


import DualLocationSearcher from '../components/DualLocationSearcher';

import CheckmarkOutlineSvg from '../assets/svgs/checkmark-outline.svg';

import SlideToAdd from '../components/SlideToAdd'; 
import SlideToDelete from '../components/SlideToDelete'; 

// Initialize Geocoder with your Google Maps API key
Geocoder.init(GOOGLE_API_KEY);

const AddressSelectorFriend = ({ selectedFriendId, setAddressInParent, height, titleBottomMargin, currentLocation, currentAddressOption, contextTitle }) => {
    const { addressMenu, defaultAddress, updateFriendDefaultAddress, createFriendAddress,  removeFriendAddress } = useStartingFriendAddresses();
    
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [showAddressOptions, setShowAddressOptions] = useState(false);
  const { themeStyles } = useGlobalStyle(); 
  const [ isExistingAddress, setIsExistingAddress ] = useState(false);
    

  useEffect(() => {
    if (defaultAddress && addressMenu && addressMenu.length > 0) {
  
      handleCheckIfExistingAndSelect(defaultAddress || addressMenu[0]);  
    }
  }, [defaultAddress, addressMenu]);

  const handleCheckIfExistingAndSelect = (address) => {
    setIsExistingAddress(false); //to clear
    const isExisting = addressMenu.find(menuAddress => 
      menuAddress.address === address.address || 
      menuAddress.id === address.id
    );

    if (isExisting) {
        setSelectedAddress(isExisting);
        setAddressInParent(isExisting);
        console.log(`set address in selector via parent function`);
    
    } else {
        setSelectedAddress(address);
        setAddressInParent(address);
        console.log(`set address in selector via parent function`);
    
    }
    setIsExistingAddress(!!isExisting);
  };
 

  const handleAddressSelect = (address) => {
    if (address) { 
      handleCheckIfExistingAndSelect(address);
      setIsEditingAddress(false); 
    };
  }

  const handleUpdateFriendDefaultAddress = (addressId) => {
    const newData = {
        is_default: true,  //backend will turn the previous one to false
      };
    updateFriendDefaultAddress(selectedFriendId, addressId, newData);
}

const handleAddFriendAddress = (title, address) => {
  try {  
  createFriendAddress(title, address);
  setIsExistingAddress(true);
  } catch (error) {
    console.log('error saving new address for friend');
  }
};

const handleDeleteFriendAddress = (addressId) => { 
    try {
    removeFriendAddress(addressId);
    setIsExistingAddress(false); 
    } catch (error) {
        console.log(error);
    }
};


  return (
    <>
      <View style={[styles.container, themeStyles.genericTextBackground, {height: height}]}>
        <View style={{flexDirection: 'row',  alignContent: 'center'}}>
        <Text style={[styles.title, themeStyles.genericText, {marginBottom: titleBottomMargin}]}>{contextTitle}</Text>
          {currentAddressOption && !currentLocation && ( 
          <TouchableOpacity style={{marginHorizontal: '3%' }} onPress={() => {}}>
            <Text style={[ themeStyles.genericText, {fontSize: 14, fontWeight: 'bold' }]}>
              Use current location? (Not available at this time)
            </Text>
          </TouchableOpacity>
          )}
        </View>

        <View style={[styles.displayContainer, themeStyles.genericTextBackgroundShadeTwo, {borderColor: themeStyles.genericText.color}]}>
           {selectedAddress && selectedAddress.address && (
              <Text style={[themeStyles.genericText, styles.displayText]}>{selectedAddress?.title}</Text>
            )}
            {!selectedAddress && !addressMenu && (
              <Text style={[themeStyles.genericText, styles.displayText]}>No addresses saved</Text>
            )} 
          {addressMenu.length > 0 && ( 
          <EditPencilOutlineSvg
            height={24}
            width={24}
            size={24}
            color={themeStyles.genericText.color}
            onPress={() => setIsEditingAddress(prev => !prev)}
            style={styles.icon}
          /> 
          )}
          {addressMenu.length === 0 && ( 
          <FontAwesome
            name="search"
            size={24}
            color={themeStyles.genericText.color}
            onPress={() => setIsEditingAddress(prev => !prev)}
            style={styles.icon}
          /> 
          )}

        </View>
        {selectedAddress && !isExistingAddress && (
                
                
                <Animated.View style={styles.sliderContainer}>
                      <SlideToAdd
                        onPress={() => handleAddFriendAddress(selectedAddress.title, selectedAddress.address)}
                        sliderText={`Save`} 
                        targetIcon={CheckmarkOutlineSvg}
                        disabled={!selectedAddress}
                      />
                </Animated.View> 
                )}
                

                {selectedAddress && selectedAddress.id && isExistingAddress && (
                <>
                <TouchableOpacity 
                    onPress={() => handleUpdateFriendDefaultAddress(selectedAddress.id)} 
                    style={{
                        width: 50, 
                        height: 20, 
                        backgroundColor: 'blue'}}> 
                </TouchableOpacity>
                
                
                <Animated.View style={[styles.sliderContainer]}>
                      <SlideToDelete
                        onPress={() => handleDeleteFriendAddress(selectedAddress.id)}
                        sliderText={`Remove from list`} 
                        targetIcon={CheckmarkOutlineSvg}
                        disabled={false} 
                      />
                </Animated.View> 
                </>
                )}


        

    </View>
      
      <SelectAddressModal
      content={
        <DualLocationSearcher
        onPress={handleAddressSelect}
        locationListDrilledOnce={addressMenu}
        />
      }
        isEditingAddress={isEditingAddress}
        setIsEditingAddress={setIsEditingAddress}
        localAddressOptions={addressMenu}
        selectedAddress={selectedAddress}
        onAddressSelect={(address) => { 
          handleCheckIfExistingAndSelect(address);
        }}
        setShowAddressOptions={setShowAddressOptions}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: { 
    flexDirection: 'column', 
    borderRadius: 0,  
    width: '100%', 
    minHeight: 80, 
    paddingVertical: 10,
  },
  title: {
    fontSize: 16, 
    //textTransform: 'uppercase', 
  },
  displayContainer: {
    flexDirection: 'row',
    alignItems: 'center', 
    width: '100%',  
    borderRadius: 20, 
    paddingHorizontal: '3%',
    paddingVertical: '3%',
    paddingRight: '10%', //space for the icon button
  },
  displayText: {
    fontSize: 16,
    lineHeight: 21, 
  },
  icon: {
    position: 'absolute', 
    right: 10,
 
  },
  addressText: {
    fontSize: 16, 
  },
  searchIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  pickerContainer: {
    flex: 1,
  },
  hardcodedLabel: {
    fontSize: 16, 
  },
  picker: {
    height: 50,
  },
  searchButton: {
    marginLeft: 10,
  }, 
  closeButton: {
    marginTop: 20,
    backgroundColor: 'limegreen',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  sliderContainer: { 
    height: 24,
    borderRadius: 20,  
    zIndex: 3, 
    flexDirection: 'row',
    justifyContent: 'space-between',
}, 
});

export default AddressSelectorFriend;
