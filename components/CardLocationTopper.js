import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AlertSmall from './AlertSmall';
import InputSearchAddress from './InputSearchAddress';
import InputFilterByFriend from './InputFilterByFriend';
import InputAddLocation from './InputAddLocation';
import InputConsiderTheDrive from './InputConsiderTheDrive';

const CardLocationTopper = ({ backgroundColor = 'white', iconColor = '#555' }) => {
  const [activeModal, setActiveModal] = useState(null);

  const toggleModal = (modal) => {
    setActiveModal(activeModal === modal ? null : modal);
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.iconButton} onPress={() => toggleModal('search')}>
          <FontAwesome5 name="search" size={16} color={iconColor} solid={false} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => toggleModal('filter')}>
          <FontAwesome5 name="filter" size={14} color={iconColor} solid={false} />
        </TouchableOpacity>
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
          modalContent={<InputConsiderTheDrive onClose={() => toggleModal('route')} />} 
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
