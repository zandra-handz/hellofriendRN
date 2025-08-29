import { View, Text  } from "react-native";
import GlobalPressable from "../appwide/button/GlobalPressable";
import React  from "react"; 
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons"; 
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
 

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
  welcomeTextStyle,
  primaryColor,
  fontSize = 13, 
  editMode = false,
  iconSize = 20,
  maxWidth = 100,
  zIndex = 3,
}: Props) => { 
 
  const { selectedFriend  } = useSelectedFriend();
  const navigation = useNavigation();
  // const friendModalButtonHeight = 16;

  const handleNavigateToFriendSelect = () => {
    if (editMode) {
      navigation.navigate("SelectFriend");
    } else {
      return;
    }
  };

  // const RenderIcon = useCallback(
  //   () => (
  //     <GlobalPressable
  //       zIndex={zIndex}
  //       style={{
  //         paddingHorizontal: 0,
  //         maxWidth: editMode ? maxWidth : maxWidth,
  //       }}
  //       onPress={handleNavigateToFriendSelect}
  //       // style={{ flexDirection: "row" }}
  //     >
  //       <View style={{ flexDirection: "row", alignItems: "end" }}>
  //         {editMode && (
  //           <View
  //             style={{
  //               flexDirection: "column",
  //               marginRight: 4,
  //               paddingBottom: 6, // EYEBALL, same as selectedcategorybutton
  //               justifyContent: "flex-end",
  //             }}
  //           >
  //             <MaterialCommunityIcons
  //               name={"pencil-outline"}
  //               size={iconSize}
  //               style={{ height: iconSize }}
  //               color={themeStyles.primaryText.color}
  //             />
  //           </View>
  //         )}

  //         <Text
  //           style={[
  //             themeStyles.primaryText,
  //             appFontStyles.subWelcomeText,
  //             { fontSize: fontSize },
  //           ]}
  //         >
  //           {selectedFriend ? selectedFriend.name : `Pick friend`}
  //         </Text>

  //         <View
  //           style={{
  //             flexDirection: "row",
  //             marginRight: 4,
  //             paddingBottom: 6, // EYEBALL
  //             justifyContent: "flex-end",
  //           }}
  //         >
  //           <MaterialCommunityIcons
  //             name="account-switch-outline"
  //             size={18}
  //             color={themeStyles.primaryText.color}
  //             style={{ marginLeft: 8 }}
  //           />
  //         </View>
  //       </View>
  //       {editMode && (
  //         <View
  //           style={{ height: 2, backgroundColor: "red", width: "100%" }}
  //         ></View>
  //       )}
  //     </GlobalPressable>
  //   ),
  //   [appFontStyles, handleNavigateToFriendSelect, selectedFriend, themeStyles]
  // );
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
        <View style={{ flexDirection: "row"  }}>
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
                color={primaryColor}
              />
            </View>
          )}

<Text
  numberOfLines={1}
  ellipsizeMode="tail"
  style={[
    welcomeTextStyle,
    {
      zIndex: 2,
      color: primaryColor,
      fontSize: fontSize,
      maxWidth: editMode ? maxWidth : maxWidth, // ensure constraint
    },
  ]}
>
            {selectedFriend ? selectedFriend.name : `Pick friend`}
          </Text>

          {/* <View
            style={{
              flexDirection: "row",
              marginRight: 4,
              paddingBottom: 6, // EYEBALL
              justifyContent: "flex-end",
            }}
          >
            <MaterialCommunityIcons
              name="account-switch-outline"
              size={18}
              color={themeStyles.primaryText.color}
              style={{ marginLeft: 8 }}
            />
          </View> */}
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
