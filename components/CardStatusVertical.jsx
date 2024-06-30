import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import DaysSince from '../data/FriendDaysSince';
import NextHello from '../data/FriendDashboardData';
import DisplayNextHello from '../data/DisplayNextHello';

const CardStatusVertical = ({ title, rightTitle, description, showFooter = true, leftContent, rightContent }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [showNextHello, setShowNextHello] = useState(true);

  const toggleModal = (event) => {
    const { pageX, pageY } = event.nativeEvent;
    setModalPosition({ top: pageY, left: pageX });
    setIsModalVisible(!isModalVisible);
  };

  const toggleComponent = () => {
    setShowNextHello(!showNextHello);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.toggleContainer} onPress={toggleComponent}>
        {showNextHello ? <DisplayNextHello /> : <DaysSince />}
      </TouchableOpacity>
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <View style={styles.flexItem}>
            <Text style={styles.title}>{title}</Text>
          </View>
          <View style={styles.flexItem}>
            <Text style={styles.rightTitle}>{rightTitle}</Text>
          </View>
        </View>
        {showFooter && (
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
            <TouchableOpacity style={styles.iconButton} onPress={toggleModal}>
              <FontAwesome5 name="ellipsis-h" size={14} color="#555" solid={false} />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <Modal visible={isModalVisible} animationType="fade" transparent={true}>
        <View style={[styles.modalContainer, { top: modalPosition.top - 50, left: modalPosition.left - 75 }]}>
          <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeButton}>
            <FontAwesome5 name="times" size={20} color="#555" solid={false} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton}>
            <FontAwesome5 name="trash" size={20} color="#FF0000" solid={false} />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    padding: 0,
    marginBottom: 0, 
    width: '60%',
    height: 18,
    alignContent: 'left',  
  },
  toggleContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    
    padding: 0,
  },
  contentContainer: {
    
    flex: 1,
    paddingLeft: 0,
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%', 
    padding: 0,
  },
  flexItem: { 
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
  },
  rightTitle: {
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    paddingTop: 0,
    color: 'black',
    marginBottom: 2,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 2,
    marginTop: 2,
  },
  iconButton: {
    padding: 2,
  },
  modalContainer: {
    position: 'absolute',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  deleteButton: {
    backgroundColor: 'transparent',
    padding: 15,
    borderRadius: 10,
  },
});

export default CardStatusVertical;
