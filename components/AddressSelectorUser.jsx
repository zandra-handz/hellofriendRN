import React, { useState, useEffect } from 'react'; 
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Geocoder from 'react-native-geocoding';
import { GOOGLE_API_KEY } from '@env'; 
import SelectAddressModal from '../components/SelectAddressModal';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; 
import EditPencilOutlineSvg from '../assets/svgs/edit-pencil-outline.svg';
import { useGlobalStyle } from '../context/GlobalStyleContext';

import  useStartingUserAddresses from '../hooks/useStartingUserAddresses';

import LocationCheckSvg from "../assets/svgs/location-check.svg";
import LocationPlusSvg from "../assets/svgs/location-plus.svg";

import DualLocationSearcher from '../components/DualLocationSearcher';

import CheckmarkOutlineSvg from '../assets/svgs/checkmark-outline.svg';

import SlideToAdd from '../components/SlideToAdd'; 
import SlideToDelete from '../components/SlideToDelete'; 

// Initialize Geocoder with your Google Maps API key
Geocoder.init(GOOGLE_API_KEY);

const AddressSelectorUser = ({ setAddressInParent, height, titleBottomMargin, currentLocation, currentAddressOption, contextTitle }) => {
    const { usingCurrent, userAddressMenu, defaultUserAddress, updateUserDefaultAddress, createUserAddress,  removeUserAddress } = useStartingUserAddresses();
    
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [showAddressOptions, setShowAddressOptions] = useState(false);
  const { themeStyles } = useGlobalStyle(); 
  const [ isExistingAddress, setIsExistingAddress ] = useState(false);
    

  useEffect(() => {
    if (defaultUserAddress) {
  
      handleCheckIfExistingAndSelect(defaultUserAddress);  
    }
  }, [defaultUserAddress]);

  const handleCheckIfExistingAndSelect = (address) => {
    setIsExistingAddress(false); //to clear
    const isExisting = userAddressMenu.find(menuAddress => 
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

  const handleUpdateUserDefaultAddress = (addressId) => {
    const newData = {
        is_default: true,  //backend will turn the previous one to false
      };
    updateUserDefaultAddress(addressId, newData);
}

const handleAddUserAddress = (title, address) => {
    createUserAddress(title, address);
};

const handleDeleteUserAddress = (addressId) => { 
    try {
    removeUserAddress(addressId);
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
        {selectedAddress &&
            defaultUserAddress && !usingCurrent && 
            selectedAddress !== defaultUserAddress && (

              <View style={styles.defaultLocationIconContainer}>
              <LocationPlusSvg height={24} width={24} color={themeStyles.genericText.color} />

              <TouchableOpacity
               onPress={() => handleUpdateUserDefaultAddress(selectedAddress.id)} 
               >
                <Text
                  style={[themeStyles.genericText, styles.defaultButtonText, {width: 40, alignItems: 'center', textAlign: 'center', flexWrap: 'wrap'}]}
                >
                  new default
                </Text>
              </TouchableOpacity>
            </View>
            )}

          {selectedAddress &&
            defaultUserAddress && !usingCurrent &&
            selectedAddress === defaultUserAddress && (
              <View style={styles.defaultLocationIconContainer}>
                <LocationCheckSvg height={24} width={24} color={"orange"} />
                <Text style={[themeStyles.genericText, styles.defaultButtonText, {color: 'orange'}]}>
                  default
                </Text>
              </View>
            )}

            {selectedAddress &&
            defaultUserAddress && usingCurrent && (
              <View style={styles.defaultLocationIconContainer}>
                <LocationCheckSvg height={24} width={24} color={"orange"} />
                <Text style={[themeStyles.genericText, styles.defaultButtonText, {color: 'orange'}]}>
                  current
                </Text>
              </View>
            )}
           
           
           {selectedAddress && selectedAddress.address && (
              <Text style={[themeStyles.genericText, styles.displayText]}>{selectedAddress?.title}</Text>
            )}
            {!selectedAddress && !userAddressMenu && (
              <Text style={[themeStyles.genericText, styles.displayText]}>No addresses saved</Text>
            )} 
          {userAddressMenu.length > 0 && ( 
          <EditPencilOutlineSvg
            height={24}
            width={24}
            size={24}
            color={themeStyles.genericText.color}
            onPress={() => setIsEditingAddress(prev => !prev)}
            style={styles.icon}
          /> 
          )}
          {userAddressMenu.length === 0 && ( 
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
                
                
                <Animated.View style={[styles.sliderContainer, {marginTop: '2%'}]}>
                      <SlideToAdd
                        onPress={() => handleAddUserAddress(selectedAddress.title, selectedAddress.address)}
                        sliderText={`Save`} 
                        targetIcon={CheckmarkOutlineSvg}
                        disabled={!selectedAddress}
                      />
                </Animated.View> 
                )}
                

                {selectedAddress && selectedAddress.id && isExistingAddress && (
                <> 
                
                
                <Animated.View style={[styles.sliderContainer, {marginTop: '2%'}]}>
                      <SlideToDelete
                        onPress={() => handleDeleteUserAddress(selectedAddress.id)}
                        sliderText={`Remove from my starting addresses`} 
                        targetIcon={CheckmarkOutlineSvg}
                        buttonBackgroundColor={'transparent'}
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
        locationListDrilledOnce={userAddressMenu}
        />
      }
        isEditingAddress={isEditingAddress}
        setIsEditingAddress={setIsEditingAddress}
        localAddressOptions={userAddressMenu}
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
  defaultButtonText: {
    fontSize: 10, 
  },
  defaultLocationIconContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: '3%',
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

export default AddressSelectorUser;
