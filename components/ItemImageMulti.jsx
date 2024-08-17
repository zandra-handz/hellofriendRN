import React, { useState } from 'react';
import { View, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity, Modal } from 'react-native';
import ItemViewImage from '../components/ItemViewImage'; // Import your ItemViewImage component
import { useImageList } from '../context/ImageListContext';
import { FlashList } from "@shopify/flash-list"; 

const windowWidth = Dimensions.get('window').width;

const ItemImageMulti = ({ imageData, horizontal = true, singleLineScroll = true, width, height, borderRadius = 10 }) => {
  const { imageList } = useImageList();
  const [images, setImages] = useState(imageData);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');

  const openModal = (image) => {
    setSelectedImage(image);
    setTitle(image.title); 
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setIsModalVisible(false);
    setIsEditing(false); // Reset editing state
  };

  return (
    <View style={styles.container}>
      <FlashList
        data={imageList}
        horizontal={horizontal && singleLineScroll}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openModal(item)}>
            
            <Image 
              source={{ uri: item.image }} 
              style={[styles.image, { borderRadius: borderRadius, width: width || windowWidth / 3 - 20, height: height || windowWidth / 3 - 20 }]} 
            />  
          </TouchableOpacity>
        )}
        numColumns={horizontal && !singleLineScroll ? 3 : 1}
        columnWrapperStyle={horizontal && !singleLineScroll ? styles.imageRow : null}
        contentContainerStyle={horizontal && !singleLineScroll ? null : styles.imageContainer}
        estimatedItemSize={100}
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
    backgroundColor: 'transparent', 
    width: '100%',
    height: '100%',
  },
  imageContainer: {
    flexDirection: 'row', 
   
  },
  imageRow: {
    flex: 1, 
    justifyContent: 'space-between',
  },  
  image: { 
    borderRadius: 10,
    marginRight: 10,
  },
});

export default ItemImageMulti;
