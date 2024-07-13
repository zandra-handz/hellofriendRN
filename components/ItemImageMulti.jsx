import React, { useState } from 'react';
import { View, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity, Modal } from 'react-native';
import ItemViewImage from '../components/ItemViewImage'; // Import your ItemViewImage component
import { useImageList } from '../context/ImageListContext';
const windowWidth = Dimensions.get('window').width;

const ItemImageMulti = ({ imageData, horizontal = true, singleLineScroll = true, width, height }) => {
  const { imageList } = useImageList();
  const [images, setImages] = useState(imageData);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');

  const openModal = (image) => {
    setSelectedImage(image);
    setTitle(image.title); // Initialize title state
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setIsModalVisible(false);
    setIsEditing(false); // Reset editing state
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={imageList}
        horizontal={horizontal && singleLineScroll}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openModal(item)}>
            <Image 
              source={{ uri: item.image }} 
              style={[styles.image, { width: width || windowWidth / 3 - 20, height: height || windowWidth / 3 - 20 }]} 
            />
          </TouchableOpacity>
        )}
        numColumns={horizontal && !singleLineScroll ? 3 : 1}
        columnWrapperStyle={horizontal && !singleLineScroll ? styles.imageRow : null}
        contentContainerStyle={horizontal && !singleLineScroll ? null : styles.imageContainer}
      />

      <Modal visible={isModalVisible} onRequestClose={closeModal} transparent>
        <ItemViewImage image={selectedImage} onClose={closeModal} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    flexDirection: 'row',
  },
  imageRow: {
    flex: 1,
    justifyContent: 'space-between',
  },
  image: {
    margin: 5,
    borderRadius: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

export default ItemImageMulti;
