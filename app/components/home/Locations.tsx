import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useNavigation } from "@react-navigation/native";
import LoadedImages from "../buttons/images/LoadedImages";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import LabeledArrowButton from "../appwide/button/LabeledArrowButton";
import useImageFunctions from "@/src/hooks/useImageFunctions";

import useImageUploadFunctions from "@/src/hooks/useImageUploadFunctions";
type Props = {
  selectedFriend: boolean;
  outerPadding: number;
};

const Locations = ({ selectedFriend = false, outerPadding = 10 }: Props) => {
  const { themeStyles } = useGlobalStyle();
  const navigation = useNavigation();
  const { imageList } = useImageFunctions();
  const { handleCaptureImage, handleSelectImage } = useImageUploadFunctions();

  const PADDING = 20;
  const navigateToImages = () => {
    navigation.navigate("ImageView", { startingIndex: 0 });
  };

  return (
    <>
      {selectedFriend && (
        <View
          style={[
            {
              overflow: "hidden",
              height: 60,
              flexShrink: 1,
              width: "100%",
              padding: PADDING,
              flexDirection: "row",
              alignItems: "center",
              //   paddingBottom: 10,
              backgroundColor:
                themeStyles.overlayBackgroundColor.backgroundColor,
              borderRadius: 16, // the others are at 20 as of 7/7/25, this one is too short to look like it matches when it is also at 20
            },
          ]}
        >
          <View
            style={{
              borderRadius: 20,
              flexDirection: "row",
              height: "100%",
              width: "100%",
              alignItems: "center",

              // marginBottom: outerPadding, // turn back on to add body content to this component
            }}
          >
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <Pressable
                hitSlop={10}
                onPress={
                  imageList && imageList.length > 0
                    ? navigateToImages
                    : () => {}
                }
                style={{ flexDirection: "row" }}
              >
                <MaterialCommunityIcons
                  //  name="image-edit-outline"
                  name="storefront-outline"
                  // name="graph"
                  size={20}
                  color={themeStyles.primaryText.color}
                  style={{ marginBottom: 0 }}
                />
                <Text
                  style={[
                    themeStyles.primaryText,
                    {
                      marginLeft: 6,
                      marginRight: 12,
                      fontWeight: "bold",
                    },
                  ]}
                >
                  Locations ({imageList && imageList.length})
                </Text>
              </Pressable>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Pressable hitSlop={10} onPress={handleCaptureImage}>
                  <Text
                    style={[
                      themeStyles.primaryText,
                      { fontWeight: "bold", fontSize: 13 },
                    ]}
                  >
                    Camera
                  </Text>
                </Pressable>
                <View
                  style={{
                    width: 1,
                    height: "100%",
                    opacity: 0.7,
                    marginHorizontal: 10,
                    backgroundColor: themeStyles.primaryText.color,
                  }}
                ></View>
                <Pressable
                hitSlop={10}
                onPress={handleSelectImage}>
                  <Text
                    style={[
                      themeStyles.primaryText,
                      { fontWeight: "bold", fontSize: 13 },
                    ]}
                  >
                    Upload
                  </Text>
                </Pressable>
              </View>
              {/* {imageList && imageList.length > 0 && (
                <LabeledArrowButton
                  color={themeStyles.primaryText.color}
                  label="View"
                  opacity={0.7}
                  onPress={navigateToImages}
                  //   onPress={() => navigation.navigate("Images")}
                />
              )} */}
            </View>
          </View>

          {/* <View style={{ width: "100%", height: 10 }}></View>   // turn back on to add body content to this component (??) */}
        </View>
      )}
    </>
  );
};

export default Locations;
