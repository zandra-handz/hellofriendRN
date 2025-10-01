import React, { useState, useRef } from "react";
import { StyleSheet, Pressable, View, Text } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFriendStyle } from "@/src/context/FriendStyleContext";
import useReadableColors from "@/src/hooks/useReadableColors";
import ColorSwatchesSvg from "../../friends/ColorSwatchesSvg";
import useUpdateFaveTheme from "@/src/hooks/SelectedFriendCalls/useUpdateFavesTheme";
import FormFriendColorThemeUpdate from "@/src/forms/FormFriendColorThemeUpdate";

import useUpdateFriendListColors from "@/src/hooks/useUpdateFriendListColors";

import Toggle from "../../user/Toggle";

const EditTheme = ({
  primaryColor = "orange",
  lighterOverlayColor = "yellow",
  manualGradientColors,
  themeAheadOfLoading,
  friendList,
  userId,
  friendId,
  manualThemeOn,
}) => {
  const { handleSetTheme } = useFriendStyle();

  const { updateFriendListColorsExcludeSaved } = useUpdateFriendListColors({
    userId: userId,
    setThemeState: handleSetTheme,
  });
  const { handleUpdateFavesTheme } = useUpdateFaveTheme({
    userId: userId,
    friendId: friendId,
  });

  // const [isMakingCall, setIsMakingCall] = useState(false);
  const formRef = useRef(null);
  const { getSavedColorTheme, getFontColor, getFontColorSecondary } =
    useReadableColors(friendList, friendId);

  // console.log(friendDashboardData);
  const [manualTheme, setManualTheme] = useState<boolean>(!!manualThemeOn);

  const toggleUseFriendColorTheme = async () => {
    const newValue = !manualTheme;
    setManualTheme(newValue);
    await updateColorThemeSetting(newValue);
  };

  const updateColorThemeSetting = async (setting) => {
    // setIsMakingCall(true);

    if (manualTheme) {
      // if state before toggling Color Theme is off
      console.log("turning manual off");
      try {
        await handleUpdateFavesTheme({
 
          manualThemeOn: false,
        });

        updateFriendListColorsExcludeSaved(
          friendId,
          "#4caf50",
          "#a0f143",
          "#000000",
          "#000000"
        );
      } finally {
        // setIsMakingCall(false);
      }
    } else {
      try {
        console.log("turning manual on");
        const response = getSavedColorTheme();
        const fontColor = getFontColor(
          response.savedDarkColor,
          response.savedLightColor,
          false
        );
        const fontColorSecondary = getFontColorSecondary(
          response.savedDarkColor,
          response.savedLightColor,
          false
        );

        console.log(response);

        // await updateFriendFavesColorThemeSetting(
        await handleUpdateFavesTheme({
          savedDarkColor: response.savedDarkColor,

          savedLightColor: response.savedLightColor,
          manualThemeOn: true,
        });

        //This also includes setThemeAheadOfLoading
        updateFriendListColorsExcludeSaved(
          friendId,
          response.savedDarkColor,
          response.savedLightColor,
          fontColor,
          fontColorSecondary
        );
 
      } finally { 
      }
    }
  };

  const [showEdit, setShowEdit] = useState(false);

  const toggleThemeEdit = () => {
    setShowEdit((prev) => !prev);
  };

  const handleSaveNewTheme = async () => {
    if (formRef.current) {
      // setIsMakingCall(true);
      await formRef.current.submit();
      // setIsMakingCall(false);
      toggleThemeEdit(); // Toggle invisible after submission completes
    }
  };

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
        label="Manual theme"
        icon={
          <MaterialCommunityIcons
            name={"palette"}
            size={20}
            color={primaryColor}
          />
        }
        value={manualTheme}
        onPress={toggleUseFriendColorTheme}
      />

      {manualTheme && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: 6,
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
            <View
              style={{
                width: 40,
                alignItems: "center",
                justifyContent: "flex-start",
                flexDirection: "row",
              }}
            ></View>
            <Text style={[styles.label, { color: primaryColor }]}></Text>
          </View>

          {!showEdit && (
            <Pressable onPress={toggleThemeEdit}>
              <ColorSwatchesSvg
                onPress={toggleThemeEdit}
                darkColor={themeAheadOfLoading.darkColor}
                lightColor={themeAheadOfLoading.lightColor}
              />
            </Pressable>
          )}

          {showEdit && (
            <>
              <Pressable onPress={toggleThemeEdit} style={{ marginRight: 10 }}>
                <MaterialCommunityIcons
                  name={"cancel"}
                  size={20}
                  color={primaryColor}
                />
              </Pressable>
              <Pressable onPress={handleSaveNewTheme}>
                <MaterialCommunityIcons
                  name={"check"}
                  size={20}
                  color={primaryColor}
                />
              </Pressable>
            </>
          )}
        </View>
      )}
      {showEdit && (
        <View style={{ flex: 1 }}>
          <FormFriendColorThemeUpdate
            ref={formRef}
            // onMakingCallChange={(false) => {
            //   // setIsMakingCall(isMakingCall);
            //   // console.log("Is making callaaa:", isMakingCall);
            // }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 38,
    height: "auto",
    borderRadius: 15,
    justifyContent: "center",
    paddingHorizontal: ".5%",
    paddingVertical: ".5%",
    alignItems: "center",
  },
  pressedStyle: {},
  on: {
    backgroundColor: "#4cd137",
  },
  off: {
    backgroundColor: "#dcdde1",
  },
  circle: {
    width: 15,
    height: 15,
    borderRadius: 15 / 2,
  },
});

export default EditTheme;
