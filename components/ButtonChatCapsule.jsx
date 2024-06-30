import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Modal, View } from 'react-native';
import { FontAwesome5 } from 'react-native-vector-icons'; // Import FontAwesome5 icon library

// Simple hash function to generate a numeric value from a string
const hashCode = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

// Function to convert the hash value to an HSL color
const hashToHSL = (hash) => {
  const hue = Math.abs(hash % 360); // Ensure the hue is within the range of 0-360
  return `hsl(${hue}, 70%, 50%)`; // HSL color with fixed saturation and lightness
};

const ButtonChatCapsule = ({ capsule }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const getCapsuleText = (typed_category) => {
    return typed_category ? typed_category.substring(0, 3) : '';
  };

  const getButtonColor = (typed_category) => {
    if (!typed_category) return '#ccc'; // Default color if category is undefined
    const hash = hashCode(typed_category);
    return hashToHSL(hash);
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.buttonCapsule, { backgroundColor: getButtonColor(capsule.typed_category) }]}
        onPress={toggleModal}
      >
        <FontAwesome5 name="comment" size={14} color="#fff" style={styles.capsuleIcon} />
      </TouchableOpacity>
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: getButtonColor(capsule.typed_category) }]}>
            <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
              <FontAwesome5 name="times" size={20} color="#fff" solid={false} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.reuseButton}>
              <FontAwesome5 name="sync" size={20} color="#fff" solid={false} />
            </TouchableOpacity>
            <View style={styles.capsuleIcon}>
              <FontAwesome5 name="comment" size={24} color="#fff" />
            </View>
            <Text style={[styles.modalTitle, { color: '#fff', fontWeight: 'bold' }]}>{capsule.typed_category}</Text>
            <Text style={[styles.modalText, { color: '#fff' }]}>{capsule.capsule}</Text>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  buttonCapsule: {
    width: 24, // Adjusted width
    height: 24, // Adjusted height
    borderRadius: 15, // Adjusted border radius
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  capsuleIcon: {
    marginHorizontal: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 20, // Rounded border radius
    position: 'relative', // Add relative position for absolute positioning
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  reuseButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default ButtonChatCapsule;
