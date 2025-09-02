import { Pressable } from "react-native";
import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/src/types/NavigationTypes";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { manualGradientColors } from "@/src/hooks/StaticColors";
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

 

const GeckoToHelloButton = ( ) => {
  const navigation = useNavigation<NavigationProp>();
  const navigateToFinalize = () => {
    navigation.navigate("Finalize");
  };

  return (
    <Pressable
      style={{
        width: "auto",
        height: "100%",
        paddingHorizontal: 10,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,

        backgroundColor: manualGradientColors.lightColor,
      }}
      onPress={navigateToFinalize}
    >
      <MaterialCommunityIcons
        name={"arrow-right"}
        size={25}
        color={manualGradientColors.homeDarkColor}
      />
    </Pressable>
  );
};

export default GeckoToHelloButton;
