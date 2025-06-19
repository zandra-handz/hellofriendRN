import { View, Text, DimensionValue, StyleSheet } from "react-native";
import React, { useState } from "react";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import useImageFunctions from "@/src/hooks/useImageFunctions";

import BelowHeaderContainer from "../scaffolding/BelowHeaderContainer";
import SlideToAdd from "../foranimations/SlideToAdd";


import Animated, {
  SharedValue,
  useAnimatedStyle,
  runOnJS,
  useAnimatedReaction,
} from "react-native-reanimated";

interface ImageViewPageProps {
  item: object;
  index: number;
  width: DimensionValue;
  height: DimensionValue;
  currentIndexValue: SharedValue;
  cardScaleValue: SharedValue;
  openModal: () => void;
  closeModal: () => void;
}

const ImageViewPage: React.FC<ImageViewPageProps> = ({
  item,
  index,
  width,
  height,
  currentIndexValue,
  cardScaleValue,
}) => {
  const { themeStyles } = useGlobalStyle(); 
  const navigation = useNavigation();

  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  const handleEditMoment = () => {
    navigation.navigate("MomentFocus", {
      momentText: item?.capsule || null,
      updateExistingMoment: true,
      existingMomentObject: item || null,
    });
  };


  // don't think i need this... this is just for viewed items whose index changes due to edits
    const [currentIndex, setCurrentIndex] = useState();
  
    useAnimatedReaction(
      () => currentIndexValue.value,
      (newIndex, prevIndex) => {
        if (newIndex !== prevIndex) {
          runOnJS(setCurrentIndex)(newIndex);
        }
      },
      []
    );
  

      const cardScaleAnimation = useAnimatedStyle(() => ({
        transform: [{ scale: cardScaleValue.value }],
      }));
    

  return (
    <Animated.View
      style={[
        cardScaleAnimation,
        {
          gap: 20,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "transparent",
          padding: 4,
          borderWidth: 0, 
          width: width,
        },
      ]}
    >
      <View
        style={{
          backgroundColor: themeStyles.primaryBackground.backgroundColor,
          padding: 10,
          borderRadius: 10,
          width: "100%",
          height: "100%",
          zIndex: 1,
          overflow: "hidden",
        }}
      >
        {/* <BelowHeaderContainer
          height={30}
          alignItems="center"
          marginBottom={0} //default is currently set to 2
          justifyContent="center"
          children={<View></View>}
        /> */}
        <Text style={themeStyles.primaryText}> {item.title}</Text>
        <Text style={themeStyles.primaryText}> {item.category}</Text>
        <View style={styles.imageContainer}>
          <Image
            placeholder={{ blurhash }}
            source={{ uri: item.image }}
            style={styles.modalImage}
            contentFit="cover" //switch to cover to see full image
            cachePolicy={"memory-disk"}
          />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
 
  imageContainer: {
    paddingTop: "3%",
    width: "100%",
    height: "90%",
    overflow: "hidden",
    flexDirection: "column",
  },    
  modalImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    marginBottom: 0,
    borderRadius: 30,
  }, 
});

export default ImageViewPage;
