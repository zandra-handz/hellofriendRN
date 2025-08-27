import { View, Text, Pressable } from "react-native";
import React from "react";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useHelloes } from "@/src/context/HelloesContext";
// import { useNavigation } from "@react-navigation/native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
// import useImageFunctions from "@/src/hooks/useImageFunctions";
import useAppNavigations from "@/src/hooks/useAppNavigations";
// import useImageUploadFunctions from "@/src/hooks/useImageUploadFunctions";

type Props = {
  selectedFriend: boolean;
  outerPadding: number;
};

const Helloes = ({ selectedFriend = false, outerPadding = 10 }: Props) => {
  const { themeStyles } = useGlobalStyle();
  const { helloesList } = useHelloes();
  // const navigation = useNavigation();
  // const { imageList } = useImageFunctions();
  // const { handleCaptureImage, handleSelectImage } = useImageUploadFunctions();
  
  
  const { navigateToHelloes } = useAppNavigations();
  const PADDING = 20;
  // const navigateToImages = () => {
  //   navigation.navigate("ImageView", { startingIndex: 0 });
  // };

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
                  helloesList && helloesList.length > 0
                    ? navigateToHelloes
                    : () => {}
                }
                style={{ flexDirection: "row" }}
              >
                <MaterialCommunityIcons
                  //  name="image-edit-outline"
                  name="calendar-heart"
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
                  Helloes ({helloesList && helloesList.length})
                </Text>
              </Pressable>
              <Pressable hitSlop={10} onPress={navigateToHelloes}>
                <Text
                  style={[
                    themeStyles.primaryText,
                    { fontWeight: "bold", fontSize: 13 },
                  ]}
                >
                  Details
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </>
  );
};

export default Helloes;
