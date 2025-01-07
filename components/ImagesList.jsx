import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
} from "react-native";
import ImageView from "../components/ImageView";
import useImageFunctions from "../hooks/useImageFunctions";

import ImagesNavigator from "../components/ImagesNavigator";

import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image"; 

import ImageCard from '../components/ImageCard';
 

const windowWidth = Dimensions.get("window").width;

const ImagesList = ({ 
  width,
  height,
  containerWidth = "100%", 
}) => {
  const { imageList } = useImageFunctions(); 
  const [selectedImageToView, setSelectedImageToView] = useState(null);
 
  const [isImageNavVisible, setImageNavVisible] = useState(false);
 
  const openImageNav = (image) => {
    setSelectedImageToView(image);
    setImageNavVisible(true);
  };

  const closeImageNav = () => {
    setImageNavVisible(false);
  };

  const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

// const thumbhash = '3OcRJYB4d3h/iIeHeEh3eIhw+j2w';
  
 

  return (
    <View style={[styles.container, { width: containerWidth }]}>
      <FlashList
        data={imageList}
        horizontal={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{marginBottom: '2%'}}>

            <ImageCard 
              image={item} 
              imageWidth={width || windowWidth / 3 - 20} 
              imageHeight={height || windowWidth / 3 - 20}
              onPress={() => openImageNav(item)}
              />
        

          </View>
        )}
        numColumns={1} 
        estimatedItemSize={100}
        showsHorizontalScrollIndicator={false}
        scrollIndicatorInsets={{ right: 1 }}
      />

      {isImageNavVisible && selectedImageToView && (
        <ImagesNavigator onClose={closeImageNav} image={selectedImageToView} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
  },
  imageRow: {},
  image: {
    borderRadius: 10, 
  },
});

export default ImagesList;
