import {
  View,
  Text,
  DimensionValue,
  Pressable,
  StyleSheet,
} from "react-native";
import React, { useMemo } from "react";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useFriendList } from "@/src/context/FriendListContext";
import { TextHeightBehavior } from "@shopify/react-native-skia";
import { MaterialCommunityIcons } from "@expo/vector-icons";
type Props = {
  item: object;
  index: number;
  colors: string[];
  selectedId: number;
  onPress: () => void;
  onLongPress: () => void;
  height: DimensionValue;
  width: DimensionValue;
  marginRight: DimensionValue;
};

const UserCategorySelectorButton = ({
  item,
  index,
  colors,
  selectedId,
  onPress,
  onLongPress,
  height,
  width,
  marginRight,
}: Props) => {
  const { themeStyles, manualGradientColors } = useGlobalStyle();
  const { themeAheadOfLoading } = useFriendList();
  return (
    <Pressable
      onPress={() => onPress(item, index)}
      onLongPress={() => onLongPress(item, index)}
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        flexWrap: "wrap",
        height: height,

        width: width,
        marginRight: marginRight,
        borderWidth:  selectedId === item.id
        ? 2 : StyleSheet.hairlineWidth,
        borderColor: colors[index]?.color,
        backgroundColor:
          selectedId === item.id
            ? // ? themeAheadOfLoading.darkColor
            //   colors[index]?.color
             "transparent"
            : "transparent",
        // : themeStyles.lighterOverlayBackgroundColor.backgroundColor,
        paddingHorizontal: 10,

        borderRadius: 10,
        // width: "auto",
        // marginVertical: 6,
        alignItems: "center",
      }}
    >
        {/* <View style={{position: 'absolute',  flex: 1, top: 0, right: 0, left:0,  width: '100%', height: '100%', borderRadius: 10, backgroundColor: themeStyles.primaryBackground.backgroundColor}}/>
  */}
      <View
        style={{
          width: "auto",
          height: "100%",
          flexShrink: 1,
          paddingRight: 6,
          alignItems: "center",
          justifyContent: "flex-start",
          flexDirection: "row", 
        }}
      >
        {selectedId !== item.id && (
          <MaterialCommunityIcons
            name={"shape"}
            size={20}
            color={
              selectedId === item.id
                ? themeAheadOfLoading.fontColor
                : themeStyles.primaryText.color
            }
          />
        )}
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        <Text
          numberOfLines={2}
          style={[
            themeStyles.primaryText,
            {
                 
              fontFamily:
                selectedId === item.id ? "Poppins-Bold" : "Poppins-Regular",
              color:
                selectedId === item.id
                  ?  themeStyles.primaryText.color
                  : themeStyles.primaryText.color,
              // fontWeight: selectedId === item.id ? "bold" : null,
            },
          ]}
        >
          {selectedId === item.id && (
            <Text
              style={[
                themeStyles.primaryText,
                {
                  color:
                    selectedId === item.id
                    //   ? themeAheadOfLoading.fontColor
                      ? themeStyles.primaryText.color
                      : themeStyles.primaryText.color,
                  fontFamily:
                    selectedId === item.id ? "Poppins-Bold" : "Poppins-Regular",
                  // fontWeight: selectedId === item.id ? "bold" : null,
                },
              ]}
            >
              Save to:{" "}
            </Text>
          )}
          {item.name}
        </Text>
      </View>
    </Pressable>
  );
};

//export default React.memo(UserCategorySelectorButton);
export default UserCategorySelectorButton;
