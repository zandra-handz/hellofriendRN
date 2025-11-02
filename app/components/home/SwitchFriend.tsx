import { View, Text } from "react-native";
import GlobalPressable from "../appwide/button/GlobalPressable";
import React from "react";  
import SvgIcon from "@/app/styles/SvgIcons";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import { AppFontStyles } from "@/app/styles/AppFonts";

type Props = {
  fontSize: number;
  hideLabel: boolean;
  editMode: boolean;
  iconSize: number;
  maxWidth: number;
  zIndex: number;
};

//similar to topbar but has its own spinner instead of centering based on parent component
const SwitchFriend = ({
 
  
  primaryColor = 'orange',
  fontSize = 13,
  editMode = false,
  iconSize = 20,
  maxWidth = 100,
  zIndex = 3,
}: Props) => {
  const { selectedFriend } = useSelectedFriend();
 

  const { navigateToSelectFriend} = useAppNavigations();

  const handleNavigateToFriendSelect = () => {
    if (editMode) {
      navigateToSelectFriend({useNavigateBack: true})
    } else {
      return;
    }
  }; 

  return (
    <>
      <GlobalPressable
        zIndex={zIndex}
        style={{
          paddingHorizontal: 0,
          maxWidth: editMode ? maxWidth : maxWidth,
        }}
        onPress={handleNavigateToFriendSelect}
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
              <SvgIcon
                name={"pencil_outline"}
                size={iconSize}
                style={{ height: iconSize }}
                color={primaryColor}
              />
            </View>
          )}

<Text
  numberOfLines={1}
  ellipsizeMode="tail"
  style={[
    AppFontStyles.welcomeText,
    {
      zIndex: 2,
      color: primaryColor,
      fontSize: fontSize,
      maxWidth: editMode ? maxWidth : maxWidth,
    },
  ]}
>
  {selectedFriend?.name
    ? selectedFriend.name.length > 12
      ? `${selectedFriend.name.slice(0, 12)}...`
      : selectedFriend.name
    : "Pick friend"}
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

export default SwitchFriend;
