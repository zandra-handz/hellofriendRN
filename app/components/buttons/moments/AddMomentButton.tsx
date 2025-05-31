import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native"; 
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useNavigation } from "@react-navigation/native";
  import { Feather } from "@expo/vector-icons";
 

interface AddMomentButtonProps {
    disabled: boolean;
}

const AddMomentButton = ({disabled}) => {
  const { themeStyles, manualGradientColors } = useGlobalStyle();
  const navigation = useNavigation();

  const viewSvg = true;

  const handleGoToMomentScreen = () => {
    navigation.navigate("MomentFocus");
  };

  return (
    <View style={[styles.container]}>
      <TouchableOpacity
        onPress={disabled ? () => {} : handleGoToMomentScreen}
        style={[
          styles.circleButton,
          themeStyles.footerIcon,
          {
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
            {/* <View style={{ position: "absolute", bottom: 13, right: 4 }}>
              <AddOutlineSvg
                width={20}
                height={20}
                color={manualGradientColors.darkColor}
              />
            </View> */}
            <Feather
            name="plus"
            size={40}
            color={manualGradientColors.homeDarkColor} />
            {/* <LeavesSingleStemOutlineSvg
              width={40}
              height={40}
              color={manualGradientColors.darkColor}
            /> */}
          </>
        )}
      </TouchableOpacity>
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

export default AddMomentButton;
