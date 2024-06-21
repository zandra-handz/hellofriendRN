import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AlertSmall from './AlertSmall';
import InputSearchAddress from './InputSearchAddress';
import InputAddLocation from './InputAddLocation';
import InputConsiderTheDrive from './InputConsiderTheDrive';
import InputSearchMidpointLocations from './InputSearchMidpointLocations';
import { useSelectedFriend } from '../context/SelectedFriendContext';

const CardLocationTopper = ({ backgroundColor = 'white', iconColor = '#555', selectedAddress, onToggleStar }) => {
  const [activeModal, setActiveModal] = useState(null);
  const [isStarSelected, setIsStarSelected] = useState(false);
  const { selectedFriend } = useSelectedFriend();
  const [destinationForDrive, setDestinationForDrive] = useState(null); // New state to store destination for driving modal

  useEffect(() => {
    setIsStarSelected(selectedFriend !== null);
  }, [selectedFriend]);

  const toggleModal = (modal) => {
    setActiveModal(activeModal === modal ? null : modal);
  };

  const toggleStar = () => {
    const newStarState = !isStarSelected;
    setIsStarSelected(newStarState);
    onToggleStar(newStarState);
  };

  const handleClockButtonPress = () => {
    setDestinationForDrive(selectedAddress); // Save destination address when clock button is pressed
    setActiveModal('route');
  };

  return (
    <>
      <View style={[styles.container, { backgroundColor }]}>
        <View style={styles.bottomBar}>
          {selectedFriend && (
          <>
            <View style={styles.floatingContainer}>
              <TouchableOpacity style={styles.iconButton} onPress={toggleStar}>
                <FontAwesome5 name="star" size={15} color={'black'} solid={isStarSelected} />
              </TouchableOpacity>
            </View>
          <View style={styles.floatingContainer}>
            <TouchableOpacity style={styles.iconButton} onPress={() => toggleModal('midpoint')}>
              <FontAwesome5 name="dot-circle" size={15} color={'black'} solid={false} />
            </TouchableOpacity>
          </View>
          </>
          )}
          <View style={styles.floatingContainer}>
            <TouchableOpacity style={styles.iconButton} onPress={() => toggleModal('search')}>
              <FontAwesome5 name="search" size={15} color={'black'} solid={false} />
            </TouchableOpacity>
          </View>
          {selectedFriend && (
          <View style={styles.floatingContainer}>
            <TouchableOpacity style={styles.iconButton} onPress={handleClockButtonPress}>
              <FontAwesome5 name="clock" size={15} color={'black'} solid={false} />
            </TouchableOpacity>
          </View>
          )}
        </View>
      </View>
      {activeModal === 'search' && (
        <AlertSmall 
          isModalVisible={true} 
          toggleModal={() => setActiveModal(null)} 
          modalTitle='Search for a location'
          modalContent={<InputSearchAddress onClose={() => setActiveModal(null)} />} 
        />
      )}
      {activeModal === 'plus' && (
        <AlertSmall 
          isModalVisible={true} 
          toggleModal={() => setActiveModal(null)} 
          modalTitle='Search for a location'
          modalContent={<InputAddLocation onClose={() => setActiveModal(null)} />} 
        />
      )}
      {activeModal === 'route' && (
        <AlertSmall 
          isModalVisible={true} 
          toggleModal={() => setActiveModal(null)} 
          modalContent={
            <InputConsiderTheDrive 
              onClose={() => setActiveModal(null)} 
              destinationAddress={destinationForDrive} 
            />
          } 
          modalTitle="Find travel times"
        />
      )} 
      {activeModal === 'midpoint' && (
        <AlertSmall 
          isModalVisible={true} 
          toggleModal={() => setActiveModal(null)} 
          modalContent={<InputSearchMidpointLocations onClose={() => setActiveModal(null)} destinationAddress={selectedAddress} />} 
          modalTitle="Find midpoint locations"
        />
      )} 
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 0,
    padding: 0,
    marginBottom: 0,
    elevation: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.0,
    shadowRadius: 0,
    width: '100%',
    borderTopWidth: 0.0,
    borderTopColor: 'transparent',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around', 
    alignItems: 'center',
    paddingTop: 4, 
    paddingBottom: 4,
    borderBottomWidth: .5,
    borderBottomColor: 'gray',
    flex: 1,
  },
  floatingContainer: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    borderRadius: 20,
    height: 30,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginLeft: 6,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: .2,
    borderColor: 'gray',
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 3,
  },
  iconButton: {
    padding: 2,
  },
});

export default CardLocationTopper;
