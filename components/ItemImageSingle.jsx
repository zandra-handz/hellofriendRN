import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import ItemViewImage from '../components/ItemViewImage';

const windowWidth = Dimensions.get('window').width;

const ItemImageSingle = ({ imageObject, width, height }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [title, setTitle] = useState(null);

  useEffect(() => {
    if (imageObject && imageObject.title) {
      setTitle(imageObject.title);
    }
  }, [imageObject]);

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  if (!imageObject) {
    return null; // or some loading indicator if needed
  }

  const dynamicStyles = {
    image: {
      width: width || windowWidth / 3 - 80,
      height: height || windowWidth / 3 - 80,
      margin: 0, 
      borderRadius: 10,
      borderWidth: 2.6,
      borderColor: 'white',
    },
  };

  return (
    <View style={styles.imageContainer}>
      <TouchableOpacity onPress={openModal}>
        <Image source={{ uri: imageObject.image }} style={dynamicStyles.image} />
      </TouchableOpacity>
      {isModalVisible && (
        <ItemViewImage image={imageObject} onClose={closeModal} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    padding: 4, 
    width: '100%',
    flex: 1, 
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    marginBottom: 10,
    borderRadius: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 8,
    marginBottom: 10,
    borderRadius: 8,
    width: '100%',
  },
  icon: {
    marginHorizontal: 10,
  },
});

export default ItemImageSingle;
