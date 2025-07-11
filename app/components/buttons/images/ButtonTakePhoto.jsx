 
import { View, TouchableOpacity,  StyleSheet } from "react-native";
 
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useNavigation } from "@react-navigation/native"; 
import ImageGalleryOutlineSvg from '@/app/assets/svgs/image-gallery-outline.svg'; 
 
const ButtonTakePhoto = ({
    containerWidth=73,
    circleSize=70,
    iconColor='gray', 
}) => {
  const { themeStyles, manualGradientColors } = useGlobalStyle();
  const navigation = useNavigation();
 
  const handleGoToMomentScreen = () => {
    navigation.navigate("MomentFocus");
  };

  return (
    <View style={[styles.container, {width: containerWidth}]}>
      <TouchableOpacity
        onPress={handleGoToMomentScreen}
        style={[
          styles.circleButton,
          themeStyles.footerIcon,
          {
            
            width: circleSize,
            height: circleSize,
            borderColor: iconColor,
            backgroundColor: manualGradientColors.homeDarkColor,
          },
        ]}
      >
  
            <ImageGalleryOutlineSvg
              width={40}
              height={40}
              color={manualGradientColors.darkColor}
            /> 
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
    right: 10,
    bottom: 20,
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

export default ButtonTakePhoto;
