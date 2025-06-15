import { View, Text, DimensionValue, StyleSheet } from "react-native";
import React from "react";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import { useFriendList } from "@/src/context/FriendListContext";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import useImageFunctions from "@/src/hooks/useImageFunctions";

import BelowHeaderContainer from "../scaffolding/BelowHeaderContainer";
import SlideToAdd from "../foranimations/SlideToAdd";

interface ImageViewPageProps {
  item: object;
  index: number;
  width: DimensionValue;
  height: DimensionValue;
  currentIndex: number;
}

const ImageViewPage: React.FC<ImageViewPageProps> = ({
  item,
  index,
  width,
  height,
  currentIndex,
}) => {
  const { themeStyles } = useGlobalStyle();
  const { updateCapsule } = useCapsuleList();
  const { themeAheadOfLoading } = useFriendList();
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



  return (
    <View
      style={{
        gap: 20,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
        padding: 4,
        borderWidth: 0,
        //   height: ITEM_HEIGHT,
        width: width,
      }}
    >
      <View
        style={{
          backgroundColor: themeStyles.primaryBackground.backgroundColor,
          padding: 10,
          borderRadius: 10,
          width: "100%",
          height: "100%",
          zIndex: 1,
          overflow: 'hidden',
        }}
      >
              <BelowHeaderContainer
                height={30}
                alignItems="center"
                marginBottom={0} //default is currently set to 2
                justifyContent="center"
                children={<View></View>
                }
              />
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
    </View>
  );
};


const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    width: "100%", 
    zIndex: 1,
  },
  modalContent: {
    width: "100%",
    flexDirection: "column",
    flex: 1,
  },
  container: {
    borderRadius: 30,
    width: "100%",

    paddingHorizontal: "5%", 
    paddingBottom: "5%",
    flexDirection: "column",
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  innerContainer: {
    height: '90%', //440
    width: '100%',
    alignContent: "center",
    paddingHorizontal: "4%",
    paddingTop: "2%",
    width: "101%",
    alignSelf: "center",
    borderWidth: 1,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    borderRadius: 30,
    flexDirection: "column",
    justifyContent: "space-between",
    overflow: "hidden",
    zIndex: 2000,
  },
  imageContainer: {
    paddingTop: '3%',
    width: "100%",
    height: "90%",
    overflow: "hidden",
    flexDirection: "column",
  },
  categoryHeader: {
    paddingBottom: "2%",
    paddingVertical: '2%',
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "flex-start",
    width: "100%", 
    minHeight: 30,
    height: "auto",
    maxHeight: 40,
  }, 
  titleText: {
    fontSize: 14, 
    fontFamily: "Poppins-Regular",
  },
  categoryText: {
    fontSize: 14, 
    lineHeight: 21,
    color: "darkgrey",
    overflow: "hidden",
    textTransform: "uppercase",
  }, 
  imageText: {
    //fontWeight: 'bold',
    fontSize: 16,
    paddingVertical: "0%",
  },
  modalImageContainer: {
    width: "100%",
    height: "80%",
    borderRadius: 20,
  },
  modalImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    marginBottom: 0,
    borderRadius: 30,
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
  },
});

export default ImageViewPage;
