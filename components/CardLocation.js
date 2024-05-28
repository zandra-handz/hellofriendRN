import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import InputAddLocation from './InputAddLocation'; // Import InputAddLocation component
import AlertSmall from './AlertSmall'; // Import AlertSmall component
import ButtonFriend from './ButtonFriend';
import { TapGestureHandler, State } from 'react-native-gesture-handler';

const CardLocation = ({ id, title, address, notes, latitude, longitude, friendsCount, friends, validatedAddress, isSelected, setSelectedLocation }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(address || '');
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
    setIsValidatedAddress(true); // Change to setIsValidatedAddress
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

  return (
    <TapGestureHandler
      ref={doubleTapRef}
      onHandlerStateChange={onDoubleTap}
      numberOfTaps={2}
    >
      <View style={[styles.container, isSelected ? styles.selected : null]}>
        {showSaveButton && (
          <TouchableOpacity style={styles.saveButton} onPress={handleValidateAddress}>
            <Text style={styles.saveButtonText}>Save location</Text>
          </TouchableOpacity>
        )}
        <View style={styles.contentContainer}>
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
        </View>
        <Modal visible={isModalVisible} animationType="fade" transparent={true}>
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeButton}>
              <FontAwesome5 name="times" size={20} color="#555" solid={false} />
            </TouchableOpacity>
            <AlertSmall>
              <InputAddLocation 
                initialAddress={selectedAddress}
                initialLatitude={selectedLatitude}
                initialLongitude={selectedLongitude}
                onClose={() => setIsModalVisible(false)} 
              />
            </AlertSmall>
          </View>
        </Modal>
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
  contentContainer: {
    flex: 1,
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

