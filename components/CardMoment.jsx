import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'; // Import the FontAwesome5 icon library

const CardMoment = ({ title, description, showIcon, iconColor }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  const toggleModal = (event) => {
    // Calculate the position of the modal window based on the ellipsis button position
    const { pageX, pageY } = event.nativeEvent;
    setModalPosition({ top: pageY, left: pageX });
    setIsModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.container}>
      <View style={styles.triangleCorner} />
      {showIcon && (
        <View style={styles.iconContainer}>
          <FontAwesome5 name="comment" size={30} color={iconColor} solid={true} style={styles.icon} />
        </View>
      )}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.iconButton}>
            <FontAwesome5 name="star" size={20} color="#555" solid={false} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <FontAwesome5 name="pen-alt" size={20} color="#555" solid={false} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <FontAwesome5 name="share-alt" size={20} color="#555" solid={false} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={toggleModal}>
            <FontAwesome5 name="ellipsis-h" size={20} color="#555" solid={false} />
          </TouchableOpacity>
        </View>
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
    backgroundColor: 'white',
    borderRadius: 20,
    marginBottom: 16,
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 1 }, // Shadow for iOS
    shadowOpacity: 0.3, // Shadow for iOS
    shadowRadius: 2, // Shadow for iOS
    width: '100%',
    padding: 12,
  },
  triangleCorner: {
    position: 'absolute',
    top: 0,
    left: 12,
    width: 0,
    height: 0,
    borderTopWidth: 12,
    borderTopColor: 'transparent',
    borderRightWidth: 12,
    borderRightColor: 'white',
    borderLeftWidth: 12,
    borderLeftColor: 'transparent',
    borderBottomWidth: 12,
    borderBottomColor: 'transparent',
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
    marginLeft: 40, // Adjusted to accommodate the icon
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: 'black',
    marginBottom: 8,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 8,
  },
  iconButton: {
    padding: 6,
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

export default CardMoment;
