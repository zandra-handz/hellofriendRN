import React, { useEffect, useRef } from "react";
import { TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import LottieView from "lottie-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useGlobalStyle } from "../context/GlobalStyleContext";
import LeafSingleOutlineThickerSvg from '../assets/svgs/leaf-single-outline-thicker.svg';

import LeafSingleOutlineSvg from '../assets/svgs/leaf-single-outline.svg';



const HomeButtonMomentAddSmall = ({
  onPress,
  label = "Add",
  height = "100%",
  borderRadius = 20,
  borderColor = "transparent",
  maxHeight = 100,
  darkColor = "#4caf50",
  lightColor = "rgb(160, 241, 67)",
  imageSize = 540, //540
  image = require("../assets/shapes/fairymagic.png"),
  imagePositionHorizontal = -60,
  imagePositionVertical = -210,
  animSize = 180,
  anim = require("../assets/anims/lightbulbsimple.json"),
  animPositionHorizontal = -48,
  animPositionVertical = -32,
}) => {
  const lottieViewRef = useRef(null);
  const globalStyles = useGlobalStyle();
  const { gradientColors } = useGlobalStyle();

  useEffect(() => {
    if (lottieViewRef.current && anim) {
      try {
        lottieViewRef.current.play();
      } catch (error) {
        console.error("Error playing animation:", error);
      }
    }
  }, [anim]);

  const hideAnimation = true;

  const adjustFontSize = (fontSize) => {
    return globalStyles.fontSize === 20 ? fontSize + 2 : fontSize;
  };

  const textStyles = (fontSize, color) => ({
    fontSize: adjustFontSize(fontSize),
    color,
    ...(globalStyles.highContrast && {
      textShadowColor: "rgba(0, 0, 0, 0.75)",
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 1,
    }),
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        {
          borderRadius: borderRadius,
          borderColor: borderColor,
          height: height,
          maxHeight: maxHeight,
        },
      ]}
    >
      {anim && !hideAnimation && (
        <LottieView
          ref={lottieViewRef}
          source={anim}
          loop
          autoPlay
          style={{
            zIndex: 2,
            position: "absolute",
            width: animSize,
            height: animSize,
            right: animPositionHorizontal,
            top: animPositionVertical,
          }}
          onError={(error) =>
            console.error("Error rendering animation:", error)
          }
        />
      )}

      <LinearGradient
        colors={[darkColor, lightColor]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          ...StyleSheet.absoluteFillObject,
        }}
      />

      <Text
        style={[
          textStyles(20, "#163805"),
          { fontFamily: "Poppins-Bold", paddingRight: 20 },
        ]}
      >
        {label}
      </Text>

      {image && (
        <Image
          source={image}
          style={{
            position: "absolute",
            width: imageSize,
            height: imageSize,
            top: imagePositionVertical,
            right: imagePositionHorizontal,
            transform: [{ scaleX: -1 }], // This flips the image horizontally
          }}
          resizeMode="contain"
        />
      )}
{/* 
                        <LeafSingleOutlineSvg
                          height={80}
                          width={80}
                          color={'black'}
                          fill={'black'}
                          stroke={'black'}
                          style={{position: 'absolute', zIndex: 1000, left: 30}}
                        /> */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flex: 1,
    width: "100%",
    padding: "1%",
    paddingRight: "0%",
    alignContent: "center",
    borderRadius: 40,
    marginVertical: "1%",
    borderWidth: 0,
    alignItems: "center",
    justifyContent: "flex-end",
    overflow: "hidden",
  },
});

export default HomeButtonMomentAddSmall;
