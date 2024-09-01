import React, { useState } from 'react';
import { View,  StyleSheet, Dimensions, TouchableOpacity, Modal } from 'react-native';
import ItemViewImage from '../components/ItemViewImage'; // Import your ItemViewImage component
import { useImageList } from '../context/ImageListContext';
import { FlashList } from "@shopify/flash-list";  
import { Image } from 'expo-image'; 

const windowWidth = Dimensions.get('window').width;

const ItemImageMulti = ({ horizontal = true, singleLineScroll = true, width, height, containerWidth='100%', borderRadius = 10 }) => {
  const { imageList } = useImageList();  
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ isEditing, setIsEditing] = useState(false);
 

  const openModal = (image) => {
    setSelectedImage(image); 
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setIsModalVisible(false);
    setIsEditing(false);  
  };

  return (
    <View style={[styles.container, {width: containerWidth}]}>
      <FlashList
        data={imageList}
        horizontal={horizontal && singleLineScroll}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openModal(item)}>
            
            <Image
              style={[styles.image, { borderRadius: borderRadius, width: width || windowWidth / 3 - 20, height: height || windowWidth / 3 - 20 }]}
              source={{ uri: item.image }}
              contentFit="cover" // Adjust contentFit as needed
            />
          </TouchableOpacity>
        )}
        numColumns={horizontal && !singleLineScroll ? 3 : 1}
        columnWrapperStyle={horizontal && !singleLineScroll ? styles.imageRow : null} 
        estimatedItemSize={100}
        showsHorizontalScrollIndicator={false}

  // Optional: Customize scroll indicator insets if needed
       scrollIndicatorInsets={{ right: 1 }}
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
    
    height: '100%', 
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
