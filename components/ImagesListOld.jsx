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
 

const windowWidth = Dimensions.get("window").width;

const ImagesListOld = ({
  horizontal = true,
  singleLineScroll = true,
  width,
  height,
  containerWidth = "100%",
  borderRadius = 10,
}) => {
  const { imageList } = useImageFunctions();
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageToView, setSelectedImageToView] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isImageNavVisible, setImageNavVisible] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

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
        horizontal={horizontal && singleLineScroll}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openImageNav(item)}>
            <Image
            placeholder={{ blurhash }}
              style={[
                styles.image,
                {
                  borderRadius: borderRadius,
                  width: width || windowWidth / 3 - 20,
                  height: height || windowWidth / 3 - 20,
                },
              ]}
              source={{ uri: item.image }}
              contentFit="cover"
              cachePolicy={'memory-disk'}
            />
          </TouchableOpacity>
        )}
        numColumns={horizontal && !singleLineScroll ? 3 : 1}
        columnWrapperStyle={
          horizontal && !singleLineScroll ? styles.imageRow : null
        }
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
    marginRight: 10,
  },
});

export default ImagesListOld;
