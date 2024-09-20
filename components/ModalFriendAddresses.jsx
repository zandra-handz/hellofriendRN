import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
 import LocationOutlineSvg from '../assets/svgs/location-outline.svg';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useAuthUser } from '../context/AuthUserContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { fetchFriendAddresses, deleteFriendAddress, updateFriendFavesColorThemeSetting, updateFriendFavesColorThemeGradientDirection} from '../api';
import ButtonAddress from './ButtonAddress';
import AlertFormSubmit from '../components/AlertFormSubmit';
import LoadingPage from '../components/LoadingPage';
import BaseModalFooter from '../components/BaseModalFooter';
import BaseRowModalFooter from '../components/BaseRowModalFooter';
import RowExpFriendAddAddresses from '../components/RowExpFriendAddAddresses';

import ButtonAddFriendAddresses from '../components/ButtonAddFriendAddresses';

const ModalFriendAddresses = ({ visible, onClose }) => {
  const { authUserState } = useAuthUser();
  const { themeStyles } = useGlobalStyle();
  const { selectedFriend  } = useSelectedFriend();
  const [friendAddresses, setFriendAddresses] = useState(null);
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
  
  const [isMakingCall, setIsMakingCall] = useState(false);
  const formRef = useRef(null);

  const toggleAddressModal = () => {
    setIsAddressModalVisible(true);
  };

  const closeAddressModal = () => {
    setIsAddressModalVisible(false);
  };

  useEffect(() => {
    if (visible) {
      const fetchAddresses = async () => {
        try {
          const data = await fetchFriendAddresses(selectedFriend.id);
          setFriendAddresses(data);
        } catch (error) {
          console.error('Error fetching friend addresses:', error);
        }
      };
      fetchAddresses();
    }
  }, [visible, selectedFriend]);

 
 
  return (
    <BaseModalFooter
      visible={visible}
      onClose={onClose}
      isMakingCall={isMakingCall}
      LoadingComponent={LoadingPage}
      themeStyles={themeStyles}
    >
      <View style={styles.headerRow}>
        <FontAwesome5 name="map" size={20} style={[styles.headerIcon, themeStyles.modalIconColor]} />
        {selectedFriend?.name && (
          <Text style={[styles.modalTitle, themeStyles.modalText]}>
            Starting Addresses for {selectedFriend.name}
          </Text>
        )}
      </View> 
          <RowExpFriendAddAddresses /> 

          <BaseRowModalFooter 
            iconName='palette' 
            iconSize={20}
            label='Addresses' 
            useToggle={false}
            useCustom={false}
            useAltButton={true}
            altIsSimpleText={false}
            altButtonComplete={<ButtonAddFriendAddresses/>}
            onAltButtonPress={toggleAddressModal} 
            //altButtonComplete={<ButtonResetHelloes />} 
          />  
 
    
 


    
    </BaseModalFooter>
    
  );
};

const styles = StyleSheet.create({
  headerRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 30 },
    
  headerIcon: { 
    marginRight: 10 
  },
  modalTitle: { 
    fontSize: 17, 
    fontFamily: 'Poppins-Bold' 
  },
  icon: {
    alignContent: 'center',
    paddingHorizontal: 4,
  },
 

});

export default ModalFriendAddresses;
