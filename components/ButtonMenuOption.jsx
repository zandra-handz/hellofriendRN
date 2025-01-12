import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ImageGalleryOutlineSvg from '../assets/svgs/image-gallery-outline.svg'; 
 
const ButtonMenuOption = ({
    containerWidth=73,
    circleSize=70,
    icon: Icon,
    iconSize=40,
    iconColor='gray',
    backgroundColor='black',
    onPress,
}) => { 
  const navigation = useNavigation(); 
 

  return (
    <View style={[styles.container, {width: containerWidth}]}>
      <TouchableOpacity
        onPress={onPress ? onPress : null}
        style={[
          styles.circleButton, 
          {
            width: circleSize,
            height: circleSize,
            borderColor: iconColor,
            backgroundColor: backgroundColor,
          },
        ]}
      >  
        {Icon && (
        <Icon width={iconSize} height={iconSize} color={iconColor} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    position: "absolute",
    flexWrap: "wrap", 
    alignContent: "center",
    justifyContent: "center",
  
    zIndex: 1,
  },
  controlButton: {
    flexDirection: "row",
    alignItems: "center",
    textAlign: "center",
  },
  saveButton: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 20,
    justifyContent: "center",
  },
  circleButton: {
    width: 70, // Set width and height to the same value
    height: 70,
    borderRadius: 35, // Half of the width/height to make it a perfect circle

    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: "center",
    alignItems: "center", // Ensure the content is centered within the circle
    backgroundColor: "#f0f", // Optional: set a background color to make it visible
  },
  checkbox: {
    paddingLeft: 10,
    paddingBottom: 2,
  },
  controlButtonText: {
    fontSize: 11,
    fontFamily: "Poppins-Regular",
    justifyContent: "center",
    textAlign: "center",
    alignContent: "center",
  },
});

export default ButtonMenuOption;
