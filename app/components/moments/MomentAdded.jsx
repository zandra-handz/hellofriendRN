import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import ThoughtBubbleOutlineSvg from "@/app/assets/svgs/thought-bubble-outline.svg"; // Import the SVG
 

const MomentAdded = ({
  onPress,
  moment,
  iconSize = 12,
  style,
  disabled = false,
  sameStyleForDisabled = false,
  primaryColor,
  includeDate = true, // New prop to control style
}) => { 

  return (
    <TouchableOpacity
      style={[
        styles.container,
        // themeStyles.genericTextBackgroundShadeTwo,
        style,
        !sameStyleForDisabled && disabled && styles.disabledContainer, // Apply disabled style only if sameStyleForDisabled is false
      ]}
      onPress={!disabled ? onPress : null} // Disable onPress if the button is disabled
      disabled={disabled} // Disable the button interaction
    >
      <View style={styles.iconContainer}>
        <ThoughtBubbleOutlineSvg
          width={iconSize}
          height={iconSize}
          style={{ position: "absolute", right: -8, zIndex: 1000 }}
          color={primaryColor}
        />
      </View>
      <View style={styles.textWrapper}>
        <Text style={[styles.momentText, { color: primaryColor }]}>
          {moment.capsule}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    //borderWidth: 1,
    borderRadius: 20,
    //borderColor: 'black',
    paddingVertical: 0,
    flexDirection: "row",

    borderRadius: 20,
    flexWrap: "wrap",
  },
  disabledContainer: {
    opacity: 0.5, // Visual indication of disabled state
  },
  momentText: {
    //fontFamily: 'Poppins-Regular',
    fontSize: 8,
    paddingLeft: 6,
    flexWrap: "wrap", // Ensure text wrapping inside the text container
  },
  textWrapper: {
    flex: 1, // Take up the remaining space in the container
    flexShrink: 1, // Ensure it doesn't overflow its container
    backgroundColor: "black",
    padding: 2,
    borderRadius: 10,
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  iconContainer: {
    width: "28%", //adjust width of container if changing the absolute positioning of the icon
    flexDirection: "column",
    justifyContent: "flex-end",
    height: "100%",
  },
  creationDateSection: {
    backgroundColor: "transparent",
    alignItems: "flex-end",
  },
  creationDateTextContainer: {
    width: "33.3%",
    padding: 10,
    justifyContent: "center",
    backgroundColor: "transparent",
    borderRadius: 20,
  },
});

export default MomentAdded;
