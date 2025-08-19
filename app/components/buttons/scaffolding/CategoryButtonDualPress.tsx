import React from "react";
import { Pressable, Text } from "react-native"; 
import { useFriendStyle } from "@/src/context/FriendStyleContext";

type Props = {
  onPress: () => void;
  onLongPress: () => void;
  label: string;
  buttonPrefix: string;
  selected: boolean;
  width: number;
  labelFontSize: number;
  height: number;
};

const CategoryButtonDualPress = ({
  onPress,
  onLongPress,
  label,
  buttonPrefix = "Add to",
  selected = false,
  width = 100,
  height,
}: Props) => {
  const { themeAheadOfLoading } = useFriendStyle();

  return (
    <Pressable
      style={{
        flexDirection: "row",
        width: width,
        height: height,
        alignItems: "center",
        alignContent: "center",
        textAlign: "center",
        paddingHorizontal: 4,
        justifyContent: "center",
        overflow: "hidden",
        borderRadius: 20,
        backgroundColor: selected
          ? themeAheadOfLoading.darkColor
          : themeAheadOfLoading.lightColor,
      }}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <Text
        style={{
          fontWeight: selected ? "bold" : null,
          color: selected
            ? themeAheadOfLoading.fontColor
            : themeAheadOfLoading.fontColorSecondary,
        }}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {selected ? `${buttonPrefix} #` : `#`}
        {label}
        {selected ? `?` : null}
      </Text>
    </Pressable>
  );
};

export default CategoryButtonDualPress;
