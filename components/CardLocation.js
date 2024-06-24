import React, { useState, useRef } from 'react';
import { Button, View, ScrollView, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import InputAddLocationQuickSave from './InputAddLocationQuickSave';
import AlertSmall from './AlertSmall';
import AlertMicro from './AlertMicro';
import InputUpdateLocation from './InputUpdateLocation';
import { useLocationList } from '../context/LocationListContext';
import { deleteLocation } from '../api';
import ButtonFriend from './ButtonFriend';
import { TapGestureHandler, State } from 'react-native-gesture-handler';

const CardLocation = ({ id, title, address, notes, latitude, longitude, friendsCount, friends, validatedAddress, isSelected, setSelectedLocation, showBottomBar = false }) => {
  const { locationList, setLocationList } = useLocationList();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMicroModalVisible, setIsMicroModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(address || '');
  const [saveLocationModal, setSaveLocationModal] = useState(false);
  const [selectedLatitude, setSelectedLatitude] = useState(latitude || '');
  const [selectedLongitude, setSelectedLongitude] = useState(longitude || '');
  const [isValidatedAddress, setIsValidatedAddress] = useState(validatedAddress);
  const doubleTapRef = useRef(null);

  const scrollViewRef = useRef(null);
  const positions = useRef([]).current;

  const onLayout = (event, index) => {
    const { layout } = event.nativeEvent;
    positions[index] = layout.x;
  };

  const onMomentumScrollEnd = (event) => {
    const { contentOffset } = event.nativeEvent;
    const closest = positions.reduce((prev, curr) => {
      return Math.abs(curr - contentOffset.x) < Math.abs(prev - contentOffset.x) ? curr : prev;
    });
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: closest, animated: true });
    }
  };

  const handleFriendPress = () => {
    setIsModalVisible(true);
  };

  const handleUpdatePress = () => {
    setIsUpdateModalVisible(true);
  };

  const handleAddressSelect = (selectedAddress) => {
    setIsModalVisible(false);
    setSelectedAddress(selectedAddress);
  };

  const handleValidateAddress = () => {
    setSaveLocationModal(true);
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
        <View style={styles.iconPlaceholderContainer}>
          <View style={[styles.iconPlaceholder, { backgroundColor: 'hotpink' }]} />
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
          <ScrollView
            horizontal={true}
            style={styles.friendButtonsContainer}
            showsHorizontalScrollIndicator={false}
            ref={scrollViewRef}
            onMomentumScrollEnd={onMomentumScrollEnd}
            decelerationRate="fast"
          >
            {friends.map((friend, index) => (
              <View
                style={styles.friendButtonWrapper}
                key={index}
                onLayout={(event) => onLayout(event, index)}
              >
                <ButtonFriend
                  friendId={friend.id}
                  onPress={() => console.log('Friend pressed:', friend)}
                />
              </View>
            ))}
          </ScrollView>

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
    padding: 20,
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
  iconPlaceholderContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    marginRight: 16,
    width: 'auto',
  },
  iconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',
  },
  contentContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
    marginTop: 2,
  },
  iconButtonsContainer: {
    flexDirection: 'row',
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
    marginRight: 30,
  },
  friendsCount: {
    fontSize: 12,
    color: 'black',
    marginBottom: 2,
  },
  friendButtonsContainer: {
    flexDirection: 'row',
    marginBottom: 6,
    marginTop: 6,
    overflow: 'scroll',
    marginRight: -100,
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
    top: 0,
    right: 0,
    padding: 10,
  },
});

export default CardLocation;
