import { View, Text  } from "react-native";
import GlobalPressable from "../appwide/button/GlobalPressable";
import React from "react";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
 
import { MaterialCommunityIcons } from "@expo/vector-icons"; 

type Props = {
  fontSize: number;
  hideLabel: boolean;
  editMode: boolean;
  iconSize: number;
  maxWidth: number;
  zIndex: number;
  onPress: () => void;
  marginRight: number;
};

//similar to topbar but has its own spinner instead of centering based on parent component
const EditDescriptionButton = ({
  fontSize = 13,
  hideLabel = false,
  editMode = false,
  iconSize = 20,
  maxWidth = 100,
  onPress,
  zIndex = 3,
  marginRight,
}: Props) => {
  const { appFontStyles, themeStyles } = useGlobalStyle();

  // const friendModalButtonHeight = 16;

  return (
    <>
      <GlobalPressable
        zIndex={zIndex}
        style={{
          paddingHorizontal: 0,
          maxWidth: editMode ? maxWidth : maxWidth,
          marginRight: marginRight,
        }}
        onPress={onPress}
        // style={{ flexDirection: "row" }}
      >
        <View style={{ flexDirection: "row" }}>
          {editMode && (
            <View
              style={{
                flexDirection: "column",
                marginRight: 4,
                paddingBottom: 6, // EYEBALL, same as selectedcategorybutton
                justifyContent: "flex-end",
              }}
            >
              <MaterialCommunityIcons
                name={"pencil-outline"}
                size={iconSize}
                style={{ height: iconSize }}
                color={themeStyles.primaryText.color}
              />
            </View>
          )}

          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[
              appFontStyles.welcomeText,
              {
                zIndex: 2,

                color: themeStyles.primaryText.color,
                fontSize: fontSize,
                maxWidth: editMode ? maxWidth : maxWidth, // ensure constraint
              },
            ]}
          >
            Description
          </Text>
        </View>
        {editMode && (
          <View
            style={{ height: 2, backgroundColor: "red", width: "100%" }}
          ></View>
        )}
      </GlobalPressable>
    </>
  );
};

export default EditDescriptionButton;
