import React, {
  useState, 
  forwardRef,
  useImperativeHandle,
} from "react";
import { View, Button, StyleSheet, Text, TouchableOpacity, Pressable } from "react-native";
import ColorPicker, { Panel1, HueSlider } from "reanimated-color-picker"; // Correct import
import { updateFriendFavesColorTheme } from "@/src/calls/api"; // Import the updateFriendFavesColorTheme function
import { useUser } from "@/src/context/UserContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useFriendList } from "@/src/context/FriendListContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import tinycolor from "tinycolor2";

const FormFriendColorThemeUpdate = forwardRef((props, ref) => {
  const { user } = useUser();
  const { updateFriendListColors, themeAheadOfLoading } = useFriendList();
  const { selectedFriend } = useSelectedFriend();
  const [darkColor, setDarkColor] = useState(
    themeAheadOfLoading.darkColor || "#000000"
  ); 
  const [lightColor, setLightColor] = useState(
    themeAheadOfLoading.lightColor || "#FFFFFF"
  ); 

  const { themeStyles } = useGlobalStyle();

  const showInHouseSaveButton = false;

  const getFontColor = (baseColor, targetColor, isInverted) => {
    let fontColor = targetColor;

    if (
      !tinycolor.isReadable(baseColor, targetColor, {
        level: "AA",
        size: "small",
      })
    ) {
      fontColor = isInverted ? "#ffffff" : "#000000";

      if (
        !tinycolor.isReadable(baseColor, fontColor, {
          level: "AA",
          size: "small",
        })
      ) {
        // If not readable, switch to the opposite color
        fontColor = fontColor === "#ffffff" ? "#000000" : "#ffffff";
      }
    }

    return fontColor; 
  };

  const getFontColorSecondary = (baseColor, targetColor, isInverted) => {
    let fontColorSecondary = baseColor;
 
    if (
      !tinycolor.isReadable(targetColor, baseColor, {
        level: "AA",
        size: "small",
      })
    ) {
      // If not readable, switch to black or white based on isInverted
      fontColorSecondary = isInverted ? "#000000" : "#ffffff";

      if (
        !tinycolor.isReadable(targetColor, fontColorSecondary, {
          level: "AA",
          size: "small",
        })
      ) {
        // If not readable, switch to the opposite color
        fontColorSecondary =
          fontColorSecondary === "#000000" ? "#ffffff" : "#000000";
      }
    }

    return fontColorSecondary;
  };

  // useEffect(() => {
  //   if (props.onMakingCallChange) {
  //     props.onMakingCallChange(isMakingCall);
  //   }
  // }, [isMakingCall, props]);

  useImperativeHandle(ref, () => ({
    submit: handleSubmit,
  }));

  // When picking new colors
  const handleSwapColors = () => {
    const newLightColor = darkColor;
    const newDarkColor = lightColor;
    setDarkColor(newDarkColor);
    setLightColor(newLightColor);
  };

  const handleSubmit = async () => {
    const fontColor = getFontColor(darkColor, lightColor, false);
    const fontColorSecondary = getFontColorSecondary(
      darkColor,
      lightColor,
      false
    );

    try {
      await updateFriendFavesColorTheme(
        user.id,
        selectedFriend.id,
        darkColor,
        lightColor,
        fontColor,
        fontColorSecondary
      );

      updateFriendListColors(
        selectedFriend.id,
        darkColor,
        lightColor,
        fontColor,
        fontColorSecondary
      );

      setTimeout(() => {}, 3000);
    } catch (error) {
      console.error("Error updating friend color theme:", error);
    }
  };
  const onSelectLightColor = (color) => {
    const hexColor = color.hex.slice(0, 7);
    setLightColor(hexColor);
  };

  const onSelectDarkColor = (color) => {
    const hexColor = color.hex.slice(0, 7);
    setDarkColor(hexColor);
  };

  return (
    <View style={styles.container}>
      <View style={{ width: "100%" }}>
        <View style={styles.inputContainer}>
          <Text style={[styles.colorValue, themeStyles.subHeaderText]}>
            Dark Color:{" "}
          </Text> 
            <View
              style={[
                styles.colorBlock,
                {
                  backgroundColor: darkColor,
                  borderColor:
                    themeStyles.genericTextBackgroundShadeTwo.backgroundColor,
                },
              ]}
            /> 
        </View>
        <View style={styles.pickerContainer}>
          <ColorPicker
            style={{ width: "100%" }}
            value={darkColor}
            onComplete={onSelectDarkColor}
          >
            <Panel1
              style={{
                borderRadius: 20,
                borderWidth: 1,
                borderColor:
                  themeStyles.genericTextBackgroundShadeTwo.backgroundColor,
              }}
            />
            <HueSlider
              style={{
                borderRadius: 20,
                paddingTop: 6,
                borderWidth: 1,
                borderColor:
                  themeStyles.genericTextBackgroundShadeTwo.backgroundColor,
              }}
            />
          </ColorPicker>
        </View>
      </View>
      <TouchableOpacity
        style={styles.swapButtonContainer}
        onPress={handleSwapColors}
      >
        <Text style={styles.swapButtonText}>SWAP</Text>
      </TouchableOpacity>

      <View style={{ width: "100%" }}>
        <View style={styles.inputContainer}>
          <Text style={[styles.colorValue, themeStyles.subHeaderText]}>
            Light Color:{" "}
          </Text> 
            <View
              style={[
                styles.colorBlock,
                {
                  backgroundColor: lightColor,
                  borderColor:
                    themeStyles.genericTextBackgroundShadeTwo.backgroundColor,
                },
              ]}
            /> 
        </View>
        <View style={styles.pickerContainer}>
          <ColorPicker
            style={{ width: "100%" }}
            value={lightColor}
            onComplete={onSelectLightColor}
          >
            <Panel1
              style={{
                borderRadius: 20,
                borderWidth: 1,
                borderColor:
                  themeStyles.genericTextBackgroundShadeTwo.backgroundColor,
              }}
            />
            <HueSlider
              style={{
                borderRadius: 20,
                paddingTop: 6,
                borderWidth: 1,
                borderColor:
                  themeStyles.genericTextBackgroundShadeTwo.backgroundColor,
              }}
            />
          </ColorPicker>
        </View>
      </View>

      {showInHouseSaveButton && (
        <Button title="Save Colors" onPress={handleSubmit} />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    flexDirection: "column",
    height: "100%",
    width: "100%",
    padding: 0,
  },
  saveMessage: {
    color: "green",
  },
  swapButtonContainer: {
    width: "100%",
    textAlign: "center",
    alignContent: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  swapButtonText: {
    fontFamily: "Poppins-Bold",
    color: "white",
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pickerContainer: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 6,
  },
  colorValue: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    marginTop: 10,
  },
  colorBlock: {
    height: 40,
    width: 240,
    borderRadius: 20,
    borderWidth: 1,
  },
});

export default FormFriendColorThemeUpdate;
