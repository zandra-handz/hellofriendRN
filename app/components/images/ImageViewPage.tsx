import { View, Text, DimensionValue, StyleSheet } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";

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
  welcomeTextStyle,
  primaryColor = "orange",
}) => {
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
          // backgroundColor: themeStyles.primaryBackground.backgroundColor,
          backgroundColor: "transparent",
          flexDirection: "column",
          justifyContent: "flex-start",
          padding: 0,
          borderRadius: 10,
          width: "100%",
          height: "100%",
          zIndex: 1,
          overflow: "hidden",
        }}
      >
        <View style={[]}>
          <View style={{ width: "100%", position: "absolute" }}>
            <Text style={[welcomeTextStyle, { color: primaryColor }]}>
              {" "}
              {item.title}
            </Text>
            <Text style={{ color: primaryColor }}> {item.category}</Text>
          </View>
          <Image
            placeholder={{ blurhash }}
            source={{ uri: item.image }}
            style={styles.modalImage}
            contentFit="contain" //switch to cover to see full image
            cachePolicy={"memory-disk"}
          />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    paddingTop: 0,
    width: "100%",
    flex: 1,
    overflow: "hidden",
    flexDirection: "column",
    borderRadius: 30,
    overflow: "hidden",
  },
  modalImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    marginBottom: 0,
    borderRadius: 30,
    overflow: "hidden",
  },
});

export default ImageViewPage;

 