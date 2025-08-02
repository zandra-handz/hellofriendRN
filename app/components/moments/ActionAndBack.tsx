import { Pressable } from "react-native";
import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/src/types/NavigationTypes";
import { useNavigation } from "@react-navigation/native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type Props = {
  onPress: () => void;
  iconName?: string;
};

const ActionAndBack = ({ onPress, iconName='check'}: Props) => {
  const { manualGradientColors } = useGlobalStyle();
 

  return (
    <Pressable
      style={{
        width: "auto",
        height: 38,
        paddingHorizontal: 10,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,

        backgroundColor: manualGradientColors.lightColor,
      }}
      onPress={onPress}
    >
      <MaterialCommunityIcons
        name={`${iconName}`}
        size={25}
        color={manualGradientColors.homeDarkColor}
      />
    </Pressable>
  );
};

export default ActionAndBack;
