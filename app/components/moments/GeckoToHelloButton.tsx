import { View, Pressable, Text } from "react-native";
import React from "react";
import GeckoButton from "../home/GeckoButton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/src/types/NavigationTypes";
import { useNavigation } from "@react-navigation/native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type Props = {};

const GeckoToHelloButton = (props: Props) => {
  const { manualGradientColors } = useGlobalStyle();
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
        alignItems: 'center',
     justifyContent: 'center',
        borderRadius: 5,

        backgroundColor: manualGradientColors.lightColor,
      }}
      onPress={navigateToFinalize}
    >
        <MaterialCommunityIcons
        name={'arrow-right'}
        size={25}
        color={manualGradientColors.homeDarkColor}
        />
      {/* <Text
        style={[
          {
            color: manualGradientColors.homeDarkColor,
            fontFamily: "Poppins-Bold",
            fontWeight: 'bold',
            fontSize: 20,
          },
        ]}
      >Go</Text> */}
    </Pressable>
  );
};

export default GeckoToHelloButton;
