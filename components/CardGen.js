import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'; // Import the FontAwesome5 icon library

const CardGen = ({ title, description, showIcon, iconColor }) => {
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
      {showIcon && (
        <View style={styles.iconPlaceholderContainer}>
          <View style={[styles.iconPlaceholder, { backgroundColor: iconColor }]} />
        </View>
      )}
      <View style={[styles.contentContainer, showIcon && styles.contentWithIcon]}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
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
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 0,
    padding: 8,
    paddingLeft: 10,
    marginBottom: 0,
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 1 }, // Shadow for iOS
    shadowOpacity: 0.3, // Shadow for iOS
    shadowRadius: 2, // Shadow for iOS
    width: '100%',
    borderTopWidth: 0.5, // Add top border
    borderTopColor: 'black',
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
  contentContainer: {
    flex: 1,
  },
  contentWithIcon: {
    paddingLeft: 8, // Add some padding to separate from the icon placeholder
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 0,
    padding: 0,
  },
  description: {
    fontSize: 16,
    paddingTop: 0,
    color: 'black',
    marginBottom: 2,
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

export default CardGen;
