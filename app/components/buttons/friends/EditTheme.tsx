import React, { useState } from "react";
import { StyleSheet, Pressable, View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useReadableColors from "@/src/hooks/useReadableColors";
import ColorSwatchesSvg from "../../friends/ColorSwatchesSvg";
import useUpdateFaveTheme from "@/src/hooks/SelectedFriendCalls/useUpdateFavesTheme";
import FormFriendColorThemeUpdate from "@/src/forms/FormFriendColorThemeUpdate";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import useUpdateFriendListColors from "@/src/hooks/useUpdateFriendListColors";
import Toggle from "../../user/Toggle";

const EditTheme = ({
  primaryColor = "orange",
  backgroundColor,
  lighterOverlayColor = "yellow",
  manualGradientColors,
  themeColors,
  friendList,
  userId,
  friendId,
  manualThemeOn,
}) => {
  const { handleSetTheme } = useSelectedFriend();

  const { updateFriendListColorsExcludeSaved } = useUpdateFriendListColors({
    userId: userId,
    setThemeState: handleSetTheme,
  });

  const { handleTurnOffManual, handleTurnOnManual, handleUpdateManualColors } = useUpdateFaveTheme({
    userId: userId,
    friendId: friendId,
  });

  const { getSavedColorTheme, getFontColor, getFontColorSecondary } = useReadableColors(friendList, friendId);

  const [manualTheme, setManualTheme] = useState<boolean>(!!manualThemeOn);
  const [showEdit, setShowEdit] = useState(false);

  const toggleUseFriendColorTheme = async () => {
    const newValue = !manualTheme;
    setManualTheme(newValue);
    await updateColorThemeSetting(newValue);
  };

const updateColorThemeSetting = async (setting) => {
    if (manualTheme) {
      console.log("turning manual off");
      try {
        handleTurnOffManual({
          appDarkColor: "#4caf50",
          appLightColor: "#a0f143",
          fontColor: "#000000",
          fontColorSecondary: "#000000",
        });
        updateFriendListColorsExcludeSaved(friendId, "#4caf50", "#a0f143", "#000000", "#000000");
      } finally {}
    } else {
      try {
        console.log("turning manual on");
        const data = await handleTurnOnManual();
        // console.log(data)
        const fontColor = getFontColor(data.dark_color, data.light_color, false);
        const fontColorSecondary = getFontColorSecondary(data.dark_color, data.light_color, false);

        updateFriendListColorsExcludeSaved(
          friendId,
          data.dark_color,
          data.light_color,
          fontColor,
          fontColorSecondary,
        );
      } finally {}
    }
  };
  const toggleThemeEdit = () => setShowEdit((prev) => !prev);

  return (
    <View
      style={{
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        width: "100%",
        alignSelf: "flex-start",
        backgroundColor: showEdit ? lighterOverlayColor : "transparent",
        padding: showEdit ? 10 : 0,
        borderRadius: showEdit ? 10 : 0,
      }}
    >
      <Toggle
        manualGradientColors={manualGradientColors}
        primaryColor={primaryColor}
        backgroundColor={backgroundColor}
        label="Manual theme"
        icon={<MaterialCommunityIcons name={"palette"} size={20} color={primaryColor} />}
        value={manualTheme}
        onPress={toggleUseFriendColorTheme}
      />

      {manualTheme && (
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 6, alignItems: "center" }}>
          <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
            <View style={{ width: 40, alignItems: "center", justifyContent: "flex-start", flexDirection: "row" }} />
            <Text style={[styles.label, { color: primaryColor }]} />
          </View>

          {!showEdit && (
            <Pressable onPress={toggleThemeEdit}>
              <ColorSwatchesSvg onPress={toggleThemeEdit} darkColor={themeColors.darkColor} lightColor={themeColors.lightColor} />
            </Pressable>
          )}

          {showEdit && (
            <Pressable onPress={toggleThemeEdit} style={{ marginRight: 10 }}>
              <MaterialCommunityIcons name={"cancel"} size={20} color={primaryColor} />
            </Pressable>
          )}
        </View>
      )}

      {showEdit && (
        <View style={{ flex: 1 }}>
          <FormFriendColorThemeUpdate
            handleUpdateManualColors={handleUpdateManualColors}
            onSaveComplete={toggleThemeEdit}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: 38, height: "auto", borderRadius: 15, justifyContent: "center", paddingHorizontal: ".5%", paddingVertical: ".5%", alignItems: "center" },
  pressedStyle: {},
  on: { backgroundColor: "#4cd137" },
  off: { backgroundColor: "#dcdde1" },
  circle: { width: 15, height: 15, borderRadius: 15 / 2 },
  label: {},
});

export default EditTheme;