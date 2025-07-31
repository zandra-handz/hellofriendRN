import { View, Pressable, Text } from "react-native";
import React from "react";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import Animated from 'react-native-reanimated';

type Props = {
  onPress: () => void;
  label: string;
};

const TopBar = ({ onPress, label = "categories" }: Props) => {
  const { themeStyles, manualGradientColors, appFontStyles } = useGlobalStyle();
  return (
    <View style={{ paddingHorizontal: 10 }}> 
      <Pressable onPress={onPress}//could make whole bar a pressable instead 
        style={[
          themeStyles.primaryBackground,
          {
            height: 50,
            paddingHorizontal: 20,
            flexDirection: "row",
            paddingVertical: 10,
            alignItems: "center",
            justifyContent: "center",
            // justifyContent: 'space-between',
            borderRadius: 10,
            marginVertical: 10,
          },
        ]}
      >
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <MaterialIcons
            name={"keyboard-arrow-up"}
            size={16}
            color={manualGradientColors.homeDarkColor}
            color={themeStyles.primaryText.color}
            style={{
              position: "absolute",
              bottom: 17,
            }}
          />
          <Text
            style={[
              themeStyles.primaryText,
              appFontStyles.subWelcomeText,
              { fontSize: 13 },
            ]}
          >
            {label}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

export default TopBar;
