import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AlertSmall from './AlertSmall';
import InputSearchAddress from './InputSearchAddress';
import InputFilterByFriend from './InputFilterByFriend';
import InputAddLocation from './InputAddLocation';
import InputConsiderTheDrive from './InputConsiderTheDrive';
import InputSearchMidpointLocations from './InputSearchMidpointLocations';
import { useSelectedFriend } from '../context/SelectedFriendContext';

const CardLocationTopper = ({ backgroundColor = 'white', iconColor = '#555', selectedAddress, onToggleStar }) => {
  const [activeModal, setActiveModal] = useState(null);
  const [isStarSelected, setIsStarSelected] = useState(false);
  const { selectedFriend } = useSelectedFriend();

  useEffect(() => {
    // Set the initial state of the star based on whether a friend is selected
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

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.iconButton} onPress={() => toggleModal('search')}>
          <FontAwesome5 name="search" size={16} color={iconColor} solid={false} />
        </TouchableOpacity>
        {selectedFriend && (
          <TouchableOpacity style={styles.iconButton} onPress={toggleStar}>
            <FontAwesome5 name="star" size={14} color={iconColor} solid={isStarSelected} />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.iconButton} onPress={() => toggleModal('add')}>
          <FontAwesome5 name="plus-square" size={14} color={iconColor} solid={false} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => toggleModal('route')}>
          <FontAwesome5 name="route" size={14} color={iconColor} solid={false} />
        </TouchableOpacity>
      </View>
      {activeModal === 'search' && (
        <AlertSmall 
          isModalVisible={true} 
          toggleModal={() => toggleModal('search')} 
          modalTitle='Search for a location'
          modalContent={<InputSearchAddress onClose={() => toggleModal('search')} />} 
        />
      )}
      {activeModal === 'filter' && (
        <AlertSmall 
          isModalVisible={true} 
          toggleModal={() => toggleModal('filter')} 
          modalContent={<InputFilterByFriend onClose={() => toggleModal('filter')} />} 
        />
      )}
      {activeModal === 'add' && (
        <AlertSmall 
          isModalVisible={true} 
          toggleModal={() => toggleModal('add')} 
          modalContent={<InputAddLocation onClose={() => toggleModal('add')} />} 
          modalTitle="Add Location"
        />
      )}
      {activeModal === 'route' && (
        <AlertSmall 
          isModalVisible={true} 
          toggleModal={() => toggleModal('route')} 
          modalContent={<InputSearchMidpointLocations onClose={() => toggleModal('route')} destinationAddress={selectedAddress} />} 
          modalTitle="Find travel times"
        />
      )}
    </View>
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
    borderTopWidth: 0.5,
    borderTopColor: 'black',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 2,
    marginTop: 1,
    paddingBottom: 2,
    marginBottom: 1,
    flex: 1,
  },
  iconButton: {
    padding: 2,
  },
  // Use if replacing icons with text
  iconText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    padding: 2,
  },
});

export default CardLocationTopper;
