import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
 
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useAuthUser } from '../context/AuthUserContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { fetchFriendAddresses, deleteFriendAddress, updateFriendFavesColorThemeSetting, updateFriendFavesColorThemeGradientDirection} from '../api';
import ButtonAddress from './ButtonAddress';
import AlertFormSubmit from '../components/AlertFormSubmit';
import LoadingPage from '../components/LoadingPage';
import BaseModalFooter from '../components/BaseModalFooter';
import BaseRowModalFooter from '../components/BaseRowModalFooter';

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

  const closeColorThemeModal = () => {
    setIsColorThemeModalVisible(false);
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


  const handleDeleteAddress = async (addressId) => {
    try {
      await deleteFriendAddress(selectedFriend.id, addressId);
      fetchAddresses(); // Refresh addresses after deletion
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };
 
 
  return (
    <BaseModalFooter
      visible={visible}
      onClose={onClose}
      isMakingCall={isMakingCall}
      LoadingComponent={LoadingPage}
      themeStyles={themeStyles}
    >
      <View style={styles.headerRow}>
        <FontAwesome5 name="location" size={20} style={[styles.headerIcon, themeStyles.modalIconColor]} />
        {selectedFriend?.name && (
          <Text style={[styles.modalTitle, themeStyles.modalText]}>
            Starting Addresses for {selectedFriend.name}
          </Text>
        )}
      </View>

 

          <BaseRowModalFooter 
            iconName='palette' 
            iconSize={20}
            label='Addresses' 
            useToggle={false}
            useCustom={true}
            customLabel={'Add new'}
            onCustomPress={toggleAddressModal} 
          />  

            <View style={[styles.addressRow, {marginLeft: 34}]}>
            {friendAddresses &&
                friendAddresses.map((friendAddress, index) => (
                <View key={index} style={styles.addressSection}>
                    <ButtonAddress address={friendAddress} onDelete={() => handleDeleteAddress(friendAddress.id)} />
                </View>
                ))}
            </View>
    
            <AlertFormSubmit
                isModalVisible={isAddressModalVisible}
                toggleModal={closeAddressModal}
                headerContent={<PushPinSolidSvg width={18} height={18} color='black' />}
                questionText={'Add starting origin for friend?'}
                formBody={<FormFriendAddressCreate friendId={selectedFriend.id} ref={formRef} />}
                onConfirm={() => {
                    if (formRef.current) {
                    formRef.current.submit(); // Call submit method on the form
                    }
                    closeAddressModal(); // Close the modal after submission
                }}
                onCancel={closeAddressModal}
                confirmText="Add"
                cancelText="Nevermind"
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
 

});

export default ModalFriendAddresses;
