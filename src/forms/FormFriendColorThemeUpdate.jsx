import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Pressable } from "react-native";
import ColorPicker, { Panel1, HueSlider } from "reanimated-color-picker";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import useUpdateFriendListColors from "@/src/hooks/useUpdateFriendListColors";
import useUser from "@/src/hooks/useUser";

const FormFriendColorThemeUpdate = ({ handleUpdateManualColors, onSaveComplete }) => {
  const { user } = useUser();
  const { selectedFriend, handleSetTheme } = useSelectedFriend();
  const { updateFriendListColors } = useUpdateFriendListColors({ userId: user?.id, setThemeState: handleSetTheme });

  const [darkColor, setDarkColor] = useState(selectedFriend.darkColor || "#000000");
  const [lightColor, setLightColor] = useState(selectedFriend.lightColor || "#FFFFFF");

  const handleSwapColors = () => {
    setDarkColor(lightColor);
    setLightColor(darkColor);
  };

  const handleSubmit = async () => {
    const fontColor = lightColor;
    const fontColorSecondary = darkColor;

    try {
      await handleUpdateManualColors({
        darkColor,
        lightColor,
        fontColor,
        fontColorSecondary,
      });

      updateFriendListColors(
        selectedFriend.id,
        darkColor,
        lightColor,
        fontColor,
        fontColorSecondary
      );

      onSaveComplete?.();
    } catch (error) {
      console.error("Error updating friend color theme:", error);
    }
  };

  const onSelectLightColor = (color) => setLightColor(color.hex.slice(0, 7));
  const onSelectDarkColor = (color) => setDarkColor(color.hex.slice(0, 7));

  return (
    <View style={styles.container}>
      <View style={{ width: "100%" }}>
        <View style={styles.inputContainer}>
          <Text style={[styles.colorValue, { color: "orange" }]}>Dark Color:</Text>
          <View style={[styles.colorBlock, { backgroundColor: darkColor }]} />
        </View>
        <View style={styles.pickerContainer}>
          <ColorPicker style={{ width: "100%" }} value={darkColor} onCompleteJS={onSelectDarkColor}>
            <Panel1 style={{ borderRadius: 20, borderWidth: 1 }} />
            <HueSlider style={{ borderRadius: 20, paddingTop: 6, borderWidth: 1 }} />
          </ColorPicker>
        </View>
      </View>

      <TouchableOpacity style={styles.swapButtonContainer} onPress={handleSwapColors}>
        <Text style={styles.swapButtonText}>SWAP</Text>
      </TouchableOpacity>

      <View style={{ width: "100%" }}>
        <View style={styles.inputContainer}>
          <Text style={[styles.colorValue, { color: "orange" }]}>Light Color:</Text>
          <View style={[styles.colorBlock, { backgroundColor: lightColor }]} />
        </View>
        <View style={styles.pickerContainer}>
          <ColorPicker style={{ width: "100%" }} value={lightColor} onCompleteJS={onSelectLightColor}>
            <Panel1 style={{ borderRadius: 20, borderWidth: 1 }} />
            <HueSlider style={{ borderRadius: 20, paddingTop: 6, borderWidth: 1 }} />
          </ColorPicker>
        </View>
      </View>

      <Pressable style={styles.saveButtonContainer} onPress={handleSubmit}>
        <Text style={styles.saveButtonText}>SAVE</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    flexDirection: "column",
    height: "100%",
    width: "100%",
    padding: 0,
  },
  swapButtonContainer: {
    width: "100%",
    alignContent: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  swapButtonText: {
    fontFamily: "Poppins-Bold",
    color: "white",
  },
  saveButtonContainer: {
    width: "100%",
    alignContent: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 10,
  },
  saveButtonText: {
    fontFamily: "Poppins-Bold",
    color: "orange",
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