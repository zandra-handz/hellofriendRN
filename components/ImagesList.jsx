import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions, 
} from "react-native"; 
import { useFriendList } from '../context/FriendListContext';
import useImageFunctions from "../hooks/useImageFunctions";

import ImagesNavigator from "../components/ImagesNavigator";

import { FlashList } from "@shopify/flash-list"; 
import { useGlobalStyle } from "../context/GlobalStyleContext";
import ImageCard from '../components/ImageCard';
import MomentsSearchBar from "../components/MomentsSearchBar"; 


const windowWidth = Dimensions.get("window").width;

const ImagesList = ({ 
  width,
  height,
  containerWidth = "100%", 
}) => {
  const { imageList } = useImageFunctions(); 
  const [selectedImageToView, setSelectedImageToView] = useState(null);
  const { themeAheadOfLoading } = useFriendList();
  const { themeStyles } = useGlobalStyle();
 
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
       
                            <View
                              style={[styles.searchBarContent, { backgroundColor: "transparent" }]}
                            >
                                          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "flex-end",
              paddingHorizontal: "3%",
            }}
          >
            <MomentsSearchBar
              data={imageList}
              height={30}
              width={"27%"}
              borderColor={"transparent"}
              placeholderText={"Search"}
              textAndIconColor={themeAheadOfLoading.fontColorSecondary}
              backgroundColor={"transparent"}
              onPress={openImageNav}
              searchKeys={["title", "image_category"]}
            />
          </View>
                            
                            </View>
                                    <View
                                      style={[
                                        styles.backColorContainer,
                                        themeStyles.genericTextBackground,
                                        { borderColor: themeAheadOfLoading.lightColor },
                                      ]}
                                    >
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
        ListFooterComponent={() => (
                                <View style={{ height: 100, width: '100%'}} />)}
      />

      {isImageNavVisible && selectedImageToView && (
        <ImagesNavigator onClose={closeImageNav} image={selectedImageToView} />
      )}
    </View>
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
  searchBarContent: {
    width: "100%",
    paddingHorizontal: "1%",
    paddingBottom: "2%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 3000,
  },
backColorContainer: {
    height: "96%",
    alignContent: "center",
    paddingHorizontal: "4%",
    paddingTop: "6%",
    //flex: 1,
    width: "101%",
    bottom: -10,
    alignSelf: "center",
    borderWidth: 1,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    borderRadius: 30,
    flexDirection: "column",
    justifyContent: "space-between",
    zIndex: 2000,
  },
});

export default ImagesList;
