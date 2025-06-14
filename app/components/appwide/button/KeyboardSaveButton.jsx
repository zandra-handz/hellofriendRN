import { TouchableOpacity, Text, StyleSheet, View, Image } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

//to use friend colors:
//darkColor={friendColorTheme.useFriendColorTheme != false  ? themeAheadOfLoading.darkColor : undefined}
//lightColor={friendColorTheme.useFriendColorTheme != false ? themeAheadOfLoading.lightColor : undefined}

const KeyboardSaveButton = ({
  onPress,
  label = "ADD NEW IMAGE",
  labelSize = 15,
  height = "auto",
  fontFamily = "Poppins-Bold",
  maxHeight = 50,
  imageSize = 50,
  image = require("@/app/assets/shapes/redheadcoffee.png"),
  imagePositionHorizontal = 0,
  imagePositionVertical = 0,
  borderColor = "transparent",
  borderRadius = 10,
  isDisabled = true,
}) => {
  const { manualGradientColors } = useGlobalStyle();

  return (
    <TouchableOpacity
      onPress={isDisabled ? null : onPress}
      style={[
        styles.container,
        {
          borderColor: borderColor,
          borderRadius: borderRadius,
          height: height,
          maxHeight: maxHeight,
        },
      ]}
    >
      <LinearGradient
        colors={[
          isDisabled ? "gray" : manualGradientColors.darkColor,
          isDisabled ? "gray" : manualGradientColors.lightColor,
        ]}
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

      <View
        style={{
          height: "100%",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Text
          style={[
            {
              fontFamily: fontFamily,
              fontSize: labelSize,
              textTransform: "uppercase",
              paddingRight: "2%",
            },
          ]}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flex: 1,
    width: "100%",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "flex-end",
    //overflow: "hidden",
  },
});

export default KeyboardSaveButton;
