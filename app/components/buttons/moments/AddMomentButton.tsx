import React from "react";
import { View, TouchableOpacity, Pressable, Text, StyleSheet } from "react-native"; 
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useNavigation } from "@react-navigation/native";
  import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
 

interface AddMomentButtonProps {
    disabled?: boolean;
    iconSize: number;
    circleSize: number;
}

const AddMomentButton: React.FC<AddMomentButtonProps> = ({disabled=false, iconSize=40, circleSize=70}) => {
  const { themeStyles, manualGradientColors } = useGlobalStyle();
  const navigation = useNavigation();

  const viewSvg = true;

  const handleGoToMomentScreen = () => {
    navigation.navigate("MomentFocus");
  };

  return (
    <View style={[styles.container]}>
      <Pressable
        onPress={disabled ? () => {} : handleGoToMomentScreen}
        style={[
          styles.circleButton,
          themeStyles.footerIcon,
          {
                width: circleSize, // Set width and height to the same value
    height: circleSize,
    borderRadius: circleSize / 2, // Half of the width/height to make it a perfect circle
            borderColor: 'transparent',
            backgroundColor: manualGradientColors.lightColor,
          },
        ]}
      >
        {!viewSvg && (
          <Text style={[styles.controlButtonText, themeStyles.footerText]}>
            Add moment
          </Text>
        )}
        {viewSvg && (
          <>
    
            <MaterialCommunityIcons
            name="playlist-plus"
            size={iconSize}
            color={manualGradientColors.homeDarkColor} />
    
          </>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
   // position: "absolute",
    flexWrap: "wrap",
    width: 73,
    alignContent: "center",
    justifyContent: "center",
   // right: 10,
   // bottom: 170,
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

export default AddMomentButton;
