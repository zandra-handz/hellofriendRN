import React, { useState, useRef } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ButtonFriend from './ButtonFriend';
import AlertSmall from './AlertSmall';
import AlertMicro from './AlertMicro';
import InputUpdateLocation from '../InputUpdateLocation';
import { useLocationList } from '@/src/context/LocationListContext';
import { deleteLocation } from '@/src/calls/api';
import { TapGestureHandler, State } from 'react-native-gesture-handler';

const CardLocation = ({ id, title, address, notes, latitude, longitude, friendsCount, friends, validatedAddress, isSelected, setSelectedLocation, showBottomBar = false }) => {
  const { locationList, setLocationList } = useLocationList();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMicroModalVisible, setIsMicroModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  
  const [selectedAddress, setSelectedAddress] = useState(address || '');
  const [saveLocationModal, setSaveLocationModal] = useState(false); 
  const [selectedFriend, setSelectedFriend] = useState(null); // State to manage selected friend
  const [isFriendMenuVisible, setIsFriendMenuVisible] = useState(false); // State to control friend menu modal

  const doubleTapRef = useRef(null); 

 

  const handleFriendPress = () => {
    setIsFriendMenuVisible(true); // Show friend menu modal
  };
 
 
  const handleValidateAddress = () => {
    setSaveLocationModal(true);
    setIsModalVisible(true);
  }; 
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

  const closeUpdateModal = () => {
    setIsUpdateModalVisible(false);
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
        <View style={styles.iconContainer}>
          <FontAwesome5 name="map-marker-alt" size={30} color="#555" solid={true} style={styles.icon} />
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.iconButtonsContainer}>
              {!showSaveButton && (
                <TouchableOpacity style={styles.iconButton} onPress={() => setIsUpdateModalVisible(true)}>
                  <FontAwesome5 name="edit" size={20} color="#555" solid={false} />
                </TouchableOpacity>
              )}
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
            </View>
          </View>
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

          <View style={styles.bottomBar}>
            <TouchableOpacity style={styles.iconButton} onPress={handleFriendPress}>
              <FontAwesome5 name="users" size={20} color="#555" solid={false} style={styles.icon} />
            </TouchableOpacity>
            {showBottomBar && (
              <>
                <TouchableOpacity style={styles.iconButton}>
                  <FontAwesome5 name="star" size={20} color="#555" solid={false} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                  <FontAwesome5 name="pen-alt" size={20} color="#555" solid={false} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                  <FontAwesome5 name="share-alt" size={20} color="#555" solid={false} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={() => setIsModalVisible(true)}>
                  <FontAwesome5 name="ellipsis-h" size={20} color="#555" solid={false} />
                </TouchableOpacity>
              </>
            )}
          </View>

          <Modal
            animationType="slide"
            transparent={true}
            visible={isFriendMenuVisible}
            onRequestClose={() => setIsFriendMenuVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.closeButton}>
                <TouchableOpacity onPress={() => setIsFriendMenuVisible(false)}>
                  <FontAwesome5 name="times" size={20} color="#000" />
                </TouchableOpacity>
              </View>
              <ScrollView>
                {friends.map((friend, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.friendMenuItem}
                    onPress={() => {
                      setSelectedFriend(friend);
                      setIsFriendMenuVisible(false);
                    }}
                  >
                    <ButtonFriend
                      friendId={friend.id}
                      onPress={() => console.log('Friend pressed:', friend)}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </Modal>

          <AlertSmall
            isModalVisible={isModalVisible}
            toggleModal={closeModal}
            modalContent={
              <InputUpdateLocation
                onClose={closeModal}
                id={id}
                friends={friends}
                title={title}
                address={address}
                notes={notes}
                latitude={latitude}
                longitude={longitude}
              />
            }
            modalTitle={'Update Location'}
          />
          <AlertSmall
            isModalVisible={isUpdateModalVisible}
            toggleModal={closeUpdateModal}
            modalContent={
              <InputUpdateLocation
                onClose={closeUpdateModal}
                id={id}
                friends={friends}
                title={title}
                address={address}
                notes={notes}
                latitude={latitude}
                longitude={longitude}
              />
            }
            modalTitle={'Update Location'}
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
      </View>
    </TapGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    width: '100%',
  },
  selected: {
    borderColor: 'hotpink',
    borderWidth: 2,
  },
  iconContainer: {
    position: 'absolute',
    left: -15,
    top: 15,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  icon: {
    padding: 10,
  },
  contentContainer: {
    marginLeft: 60,
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 8,
  },
  iconButtonsContainer: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 6,
  },
  addressContainer: {
    marginBottom: 8,
  },
  address: {
    fontSize: 16,
    color: 'black',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  friendMenuItem: {
    padding: 10,
  },
});

export default CardLocation;
