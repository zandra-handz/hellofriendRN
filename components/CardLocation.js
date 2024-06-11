import React, { useState, useRef } from 'react';
import { Button, View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import InputAddLocationQuickSave from './InputAddLocationQuickSave'; // Import InputAddLocation component
import AlertSmall from './AlertSmall'; // Import AlertSmall component
import AlertMicro from './AlertMicro';
import { useLocationList } from '../context/LocationListContext'; 
import { deleteLocation } from '../api'; 
import ButtonFriend from './ButtonFriend';
import { TapGestureHandler, State } from 'react-native-gesture-handler';

const CardLocation = ({ id, title, address, notes, latitude, longitude, friendsCount, friends, validatedAddress, isSelected, setSelectedLocation, showBottomBar=false }) => {
  const { locationList, setLocationList } = useLocationList();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMicroModalVisible, setIsMicroModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(address || '');
  const [saveLocationModal, setSaveLocationModal] = useState(false);
  const [selectedLatitude, setSelectedLatitude] = useState(latitude || '');
  const [selectedLongitude, setSelectedLongitude] = useState(longitude || '');
  const [isValidatedAddress, setIsValidatedAddress] = useState(validatedAddress); // Change name to isValidatedAddress
  const doubleTapRef = useRef(null);

  const handleFriendPress = () => {
    setIsModalVisible(true);
  };

  const handleAddressSelect = (selectedAddress) => {
    setIsModalVisible(false);
    setSelectedAddress(selectedAddress);
  };

  const handleValidateAddress = () => {
    setSaveLocationModal(true); // Change to setIsValidatedAddress
    setIsModalVisible(true);
  };

  

  const showValidateButton = !id || validatedAddress === false || validatedAddress === undefined;
  const showSaveButton = id && typeof id === 'string' && id.startsWith('temp_');

  const onDoubleTap = ({ nativeEvent }) => {
    if (nativeEvent.state === State.ACTIVE) {
      if (!isSelected) {
        setSelectedLocation({ id, title, address, notes, latitude, longitude, friendsCount, friends, validatedAddress });
      }
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const closeMicroModal = () => {
    setIsMicroModalVisible(false);
  };

  const handleDeleteLocation = async (locationId) => {
    console.log(locationId);
    try {
      await deleteLocation(locationId);
      const updatedLocationList = locationList.filter(location => location.id !== locationId);
      setLocationList(updatedLocationList);
    } catch (error) {
      console.error('Error deleting location:', error);
    }
  };


  return (
    <TapGestureHandler
      ref={doubleTapRef}
      onHandlerStateChange={onDoubleTap}
      numberOfTaps={2}
    >

      <View style={[styles.container, isSelected ? styles.selected : null]}>
        <View style={styles.iconPlaceholderContainer}>
            <View style={[styles.iconPlaceholder, { backgroundColor: 'hotpink' }]} />
        </View>
        <View style={styles.contentContainer, styles.contentWithIcon}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.addressContainer}>
            {!id && (
              <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                <Text style={styles.address}>{selectedAddress || address}</Text>
              </TouchableOpacity>
            )}
            {id && (
              <Text style={styles.address}>{selectedAddress || address}</Text>
            )}
          </View>
          <View style={styles.friendButtonsContainer}>
            {friends.map((friend, index) => (
              <ButtonFriend key={index} friend={friend} onPress={() => console.log('Friend pressed:', friend)} />
            ))}
          </View>

          {showBottomBar && (
          <View style={styles.bottomBar}>
            <TouchableOpacity style={styles.iconButton}>
              <FontAwesome5 name="star" size={14} color="#555" solid={false} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <FontAwesome5 name="pen-alt" size={14} color="#555" solid={false} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <FontAwesome5 name="share-alt" size={14} color="#555" solid={false} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => setIsModalVisible(true)}>
              <FontAwesome5 name="ellipsis-h" size={14} color="#555" solid={false} />
            </TouchableOpacity>
          </View>
          )}
        </View>
        <View style={styles.rightPlaceholderContainer}> 
          {showSaveButton && (
            
            <TouchableOpacity style={styles.iconButton} onPress={handleValidateAddress}>
            <FontAwesome5 name="heart" size={20} color="#555" solid={false} />
            </TouchableOpacity>
          )}
          {!showSaveButton && (
            
            <TouchableOpacity style={styles.iconButton} onPress={() => setIsMicroModalVisible(true)}>
            <FontAwesome5 name="heart" size={20} color="#555" solid={true} />
            </TouchableOpacity>
          )}
          {!showSaveButton && (
            <TouchableOpacity style={styles.iconButton}>
              <FontAwesome5 name="edit" size={0} color="#555" solid={false} />
            </TouchableOpacity>
            )}
        </View>
         
          <AlertSmall
            isModalVisible={isModalVisible}
            toggleModal={closeModal}
            modalContent={ 
            <InputAddLocationQuickSave
              onClose={closeModal}
              title={title}
              address={address}  
            />
            }
            modalTitle={'Save Location'}
          /> 
          <AlertMicro
            isModalVisible={isMicroModalVisible}
            toggleModal={closeMicroModal}
            modalContent={
              <>
              <Text>Remove {title} from your saved locations?</Text>
              <Button 
                title="yes"
                onPress={() => handleDeleteLocation(id)} 
                />
              
              </>
            }
            modalTitle={'Remove location'}
          /> 


      </View>
    </TapGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 0,
    padding: 8,
    paddingLeft: 10,
    marginBottom: 0,
    elevation: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.0,
    shadowRadius: 0,
    width: '100%', 
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,
    borderRightWidth: 1.5,
    borderLeftWidth: 1.5,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
    position: 'relative',
    marginBottom: 1, 
  },
  selected: {
    borderColor: 'hotpink',
    borderWidth: .5,   
    marginBottom: 0,

  },
  saveButton: {
    position: 'absolute',
    top: 8,
    right: 10,
    backgroundColor: 'transparent',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    color: 'black',
    fontSize: 12,
    fontWeight: '600',
  }, 
  iconPlaceholderContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    width: 'auto', // One-sixth of the width
  },
  iconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc', // Placeholder color
  },
  rightPlaceholderContainer: {
    position: 'absolute',
    top: 0, // Adjust this value based on your layout needs
    right: 20, // Adjust this value to set the distance from the right edge
    width: 40, // Set the width of the container if needed
    justifyContent: 'center',
    alignItems: 'flex-end',
    flexDirection: 'row',
    marginTop: 8,
  },
  rightPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc', // Placeholder color
  },
  contentContainer: {
    flex: 1,
  },
  contentWithIcon: {
    paddingLeft: 8, // Add some padding to separate from the icon placeholder
    width: '66%',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 2,
    marginTop: 2,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  address: {
    fontSize: 14,
    fontWeight: '400',
    color: 'black',
    marginBottom: 10,
    marginRight: 5,
  },
  friendsCount: {
    fontSize: 12,
    color: 'black',
    marginBottom: 2,
  },
  friendButtonsContainer: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 0,
    borderTopColor: '#ccc',
    paddingTop: 2,
    marginTop: 2,
  },
  iconButton: {
    padding: 2,
    marginLeft: 2,
  },
  modalContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -100 }, { translateY: -100 }],
    width: 200,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  closeButton: {
    position: 'absolute',
    top:0,
    right: 0,
    padding: 10,
  },
});

export default CardLocation;

