import { View, Text } from "react-native";
import React from "react";
import SvgIcon from "@/app/styles/SvgIcons";
import GlobalPressable from "../appwide/button/GlobalPressable";
import manualGradientColors from "@/app/styles/StaticColors";
import { AppFontStyles } from "@/app/styles/AppFonts";
type Props = {
  leafColor: string;
  fontColor: string;
  onPress: () => void;
};

const MFeatureWriteButton = ({
  leafColor,
  fontColor,
  onPress = () => console.log("lala"),
}: Props) => {
  const plusColor = manualGradientColors.lightColor;
  const plusBackgroundColor = manualGradientColors.homeDarkColor;

  const welcomeTextStyle = AppFontStyles.welcomeText;

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {/* <GlobalPressable style={{ flexDirection: "row" }} onPress={onPress}> */}
      <Text style={[welcomeTextStyle, { color: fontColor, fontSize: 40 }]}>
        Add{"  "} 
      </Text>
      <View>
        <SvgIcon
        //   name={"pencil_circle"}
             name={"plus_circle"}
          color={plusColor}
          size={40}
          style={{
            position: "absolute",
            top: 0,
            left: -10,
            zIndex: 1000,
            borderRadius: 999,
            backgroundColor: plusBackgroundColor,
          }}
        />
        <SvgIcon
          name={"leaf"}
          color={leafColor}
          size={80}
          style={{ opacity: 0.9 }}
        />
      </View>
      {/* </GlobalPressable> */}
    </View>
  );
};

export default MFeatureWriteButton;
