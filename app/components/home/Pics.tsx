import { View, Text, Pressable } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import LoadingBlock from "../appwide/spinner/LoadingBlock";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useImages from "@/src/hooks/ImageCalls/useImages";
import useImageUploadFunctions from "@/src/hooks/useImageUploadFunctions";
type Props = {
  userId: number;
  friendId: number;
};

const Pics = ({
  isLoading, //loadingDash, NOT images
  userId,
  friendId,
  primaryColor,
  primaryOverlayColor,
}: Props) => {
  const navigation = useNavigation();
  const { imageList } = useImages({
    userId: userId,
    friendId: friendId,
  });
  const { handleCaptureImage, handleSelectImage } = useImageUploadFunctions();

  const PADDING = 20;
  const navigateToImages = () => {
    navigation.navigate("ImageView", { startingIndex: 0 });
  };

  return (
    <>
      {friendId && (
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
              backgroundColor: isLoading ? 'transparent' : primaryOverlayColor,
              borderRadius: 16, // the others are at 20 as of 7/7/25, this one is too short to look like it matches when it is also at 20
            },
          ]}
        >
          {/* {isLoading && <LoadingBlock loading={true} />} */}
          {!isLoading && (
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
                    name="image-multiple-outline"
                    // name="graph"
                    size={20}
                    color={primaryColor}
                    style={{ marginBottom: 0 }}
                  />
                  <Text
                    style={[
                      {
                        color: primaryColor,
                        marginLeft: 6,
                        marginRight: 12,
                        fontWeight: "bold",
                      },
                    ]}
                  >
                    Pics ({imageList && imageList.length})
                  </Text>
                </Pressable>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Pressable hitSlop={10} onPress={handleCaptureImage}>
                    <Text
                      style={[
                        {
                          color: primaryColor,
                          fontWeight: "bold",
                          fontSize: 13,
                        },
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
                      backgroundColor: primaryColor,
                    }}
                  ></View>
                  <Pressable hitSlop={10} onPress={handleSelectImage}>
                    <Text
                      style={[
                        {
                          color: primaryColor,
                          fontWeight: "bold",
                          fontSize: 13,
                        },
                      ]}
                    >
                      Upload
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}

          {/* <View style={{ width: "100%", height: 10 }}></View>   // turn back on to add body content to this component (??) */}
        </View>
      )}
    </>
  );
};

export default Pics;
