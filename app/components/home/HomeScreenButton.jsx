import { TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

const HomeScreenButton = ({
  onPress,
  label = "ADD NEW IMAGE",
  height = "100%", 
  imageSize = 100,
  image = require("@/app/assets/shapes/chatmountain.png"),
  imagePositionHorizontal,
  imagePositionVertical,   
}) => {
  const { manualGradientColors, appContainerStyles, appFontStyles } = useGlobalStyle();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        appContainerStyles.homeScreenButton,
        {  
          height: height, 
        },
      ]}
    >
      <LinearGradient
        colors={[manualGradientColors.darkColor, manualGradientColors.lightColor]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          ...StyleSheet.absoluteFillObject,
        }}
      />

      {image && (
        <Image
          source={image}
          style={{
            width: imageSize,
            height: imageSize,
            top: imagePositionVertical,
            right: imagePositionHorizontal,
          }}
          resizeMode="contain"
        />
      )}
      <Text
        style={[appFontStyles.homeScreenButtonText, { color: manualGradientColors.homeDarkColor }]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}; 

export default HomeScreenButton;
