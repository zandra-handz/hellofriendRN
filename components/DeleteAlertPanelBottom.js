import React, { useRef, useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FormFriendAddressCreate from '../forms/FormFriendAddressCreate'; 
import FormFriendColorThemeUpdate from '../forms/FormFriendColorThemeUpdate'; 
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useAuthUser } from '../context/AuthUserContext';
import { fetchFriendAddresses, deleteFriendAddress, updateFriendFavesColorThemeSetting, updateFriendFavesColorThemeGradientDirection} from '../api';

import ToggleButton from '../components/ToggleButton';
import ButtonAddress from './ButtonAddress';
import PushPinSolidSvg from '../assets/svgs/push-pin-solid.svg'; // Import the SVG
import ArtistColorPaletteSvg from '../assets/svgs/artist-color-palette.svg';
import AlertFormSubmit from '../components/AlertFormSubmit';

const AlertPanelBottom = ({ visible, profileData, onClose }) => {
  const { authUserState } = useAuthUser(); 
  const { selectedFriend, friendColorTheme, setFriendColorTheme, updateFriendColorTheme } = useSelectedFriend();
  const [friendAddresses, setFriendAddresses] = useState(null);
  
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
  
  const [isColorThemeModalVisible, setIsColorThemeModalVisible] = useState(false);
 
  const formRef = useRef(null);  

  const [useFriendColorTheme, setUseFriendColorTheme] = useState(false);
  const [invertGradientDirection, setInvertGradientDirection] = useState(false);

  useEffect(() => {
    if (friendColorTheme) {
      setUseFriendColorTheme(friendColorTheme.useFriendColorTheme === true || friendColorTheme.useFriendColorTheme === null);
      setInvertGradientDirection(friendColorTheme.invertGradient === true);
      
      console.log('friendColorTheme useEffect inside panelbottom: ', friendColorTheme);
    }
  }, [friendColorTheme]);

  const toggleUseFriendColorTheme = () => {
    const newValue = !useFriendColorTheme;
    console.log('newValue: ', newValue, useFriendColorTheme);
    setUseFriendColorTheme(newValue);
    updateColorThemeSetting(newValue);
    console.log('newValue: ', newValue, useFriendColorTheme);
  };

  const toggleColorThemeGradientDirection = () => {
    const newValue = !invertGradientDirection;
    console.log('newValue: ', newValue, invertGradientDirection);
    setInvertGradientDirection(newValue);
    updateGradientDirectionSetting(newValue);
    console.log('newValue for gradient direction: ', newValue, invertGradientDirection);
  };

  const updateColorThemeSetting = async (setting) => {
    try {
      const newSettings = { ...friendColorTheme, ...setting};
      await updateFriendFavesColorThemeSetting(authUserState.user.id, selectedFriend.id, setting);
      setFriendColorTheme(prev => ({
        ...prev,
        useFriendColorTheme: setting
      }));
      console.log('Color theme setting updated successfully ', setting);
    } catch (error) {
      console.error('Error updating color theme setting:', error);
    }
  };

  const updateGradientDirectionSetting = async (setting) => {
    try {
      const newSettings = { ...friendColorTheme, ...setting};
      await updateFriendFavesColorThemeGradientDirection(authUserState.user.id, selectedFriend.id, setting);
      setFriendColorTheme(prev => ({
        ...prev,
        invertGradient: setting
      }));
      console.log('Color theme gradient direction updated successfully ', setting);
    } catch (error) {
      console.error('Error updating color theme gradient direction:', error);
    }
  };

  const closeAddressModal = () => {
    setIsAddressModalVisible(false);
  };

  const closeColorThemeModal = () => {
    setIsColorThemeModalVisible(false);
  };


  const toggleAddressModal = () => {
    setIsAddressModalVisible(true);
  };

  
  const toggleColorThemeModal = () => {
    setIsColorThemeModalVisible(true);
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
    <Modal transparent={true} visible={visible} animationType="slide" presentationStyle="overFullScreen">
      <View style={styles.overlay}>
        <View style={styles.container}>
        
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <FontAwesome5 name="times" size={20} color="black" solid={false} />
          </TouchableOpacity>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View>
              
              <View style={styles.row}>
                <FontAwesome5 name="user" size={20} color="black" style={styles.icon} />
                <Text style={styles.modalTitle}>Settings for {selectedFriend.name}</Text>
                </View>
              <View style={styles.addressRow}>
                <FontAwesome5 name="map-marker-alt" size={20} color="black" style={[styles.icon, styles.mapIcon]} />
                <Text style={styles.sectionTitle}>Starting Addresses</Text>
                </View>
                <View style={[styles.addressRow, {marginLeft: 34}]}>
                {friendAddresses &&
                  friendAddresses.map((friendAddress, index) => (
                    <View key={index} style={styles.addressSection}>
                      <ButtonAddress address={friendAddress} onDelete={() => handleDeleteAddress(friendAddress.id)} />
                    </View>
                  ))}
                <TouchableOpacity onPress={toggleAddressModal} style={styles.editButton}>
                  <FontAwesome5 name="plus" size={12} color="white" />
                </TouchableOpacity>
                
              </View> 


              
              <View style={styles.addressRow}>
                <FontAwesome5 name="palette" size={20} color="black" style={[styles.icon, styles.mapIcon]} />
                <Text style={styles.sectionTitle}>Color Theme</Text>

                <TouchableOpacity onPress={toggleColorThemeModal} style={styles.editButton}>
                  <FontAwesome5 name="plus" size={12} color="white" />
                </TouchableOpacity>
              </View> 
              <View style={styles.addressRow}>
                <FontAwesome5 name="palette" size={20} color="black" style={[styles.icon, styles.mapIcon]} />
                <Text style={styles.sectionTitle}>Color Theme</Text>
                <FontAwesome5 name="adjust" size={20} color="black" style={styles.icon} />
                  <Text style={styles.label}>teeest</Text>
                  <ToggleButton value={useFriendColorTheme} onToggle={toggleUseFriendColorTheme} />   
              </View>
              <View style={styles.addressRow}>
                <FontAwesome5 name="palette" size={20} color="black" style={[styles.icon, styles.mapIcon]} />
                <Text style={styles.sectionTitle}>Invert gradient?</Text>
                <FontAwesome5 name="adjust" size={20} color="black" style={styles.icon} />
                  <Text style={styles.label}>Invert gradient?</Text>
                  <ToggleButton value={invertGradientDirection} onToggle={toggleColorThemeGradientDirection} />   
              </View>
            </View>
          </ScrollView>
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

        <AlertFormSubmit
          isModalVisible={isColorThemeModalVisible}
          toggleModal={closeColorThemeModal}
          headerContent={<ArtistColorPaletteSvg width={38} height={38} color='black' />}
          questionText={`Update color theme for friend dashboard?`}
          formBody={<FormFriendColorThemeUpdate ref={formRef} />}
          onConfirm={() => {
            if (formRef.current) {
              formRef.current.submit(); // Call submit method on the form
            }
            closeColorThemeModal(); // Close the modal after submission
          }}
          onCancel={closeColorThemeModal}
          confirmText="Update"
          cancelText="Nevermind"
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: '60%',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalTitle: {
    fontSize:20,
    fontFamil: 'Poppins-Bold',
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 10,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  addressSection: {
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    marginLeft: 5,
  },
  editButton: {
    marginLeft: 3,
    borderRadius: 15,
    backgroundColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapIcon: {
    marginLeft: 2,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
});

export default AlertPanelBottom;