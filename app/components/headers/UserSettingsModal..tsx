// import React, { useState } from "react";
// import { View,   ScrollView, StyleSheet } from "react-native";
 
// import manualGradientColors from "@/app/styles/StaticColors";
// import SectionAccessibilitySettings from "../user/SectionAccessibilitySettings";

// import AppModalWithToast from "../alerts/AppModalWithToast";
// import SectionFriendManagerSettings from "../friends/SectionFriendManagerSettings";
// import SectionAccountSettings from "../user/SectionAccountSettings";
// import AppModal from "../alerts/AppModal";
// // import { useUserSettings } from "@/src/context/UserSettingsContext";
// import useUserSettings from "@/src/hooks/useUserSettings";
// import { LDTheme } from "@/src/types/LDThemeTypes";
// interface Props {
//   userId: number;
//   isVisible: boolean;
//   bottomSpacer: number;
//   closeModal: () => void; 
//   textColor: string;
//   backgroundColor: string;
// }
// const UserSettingsModal: React.FC<Props> = ({
//   userId,
//   isVisible,
//   closeModal,
//   textColor,
//   backgroundColor,
// }) => {
//   const { settings } = useUserSettings();

//   const [flashMessage, setFlashMessage] = useState<null | {
//     text: string;
//     error: boolean;
//     duration: number;
//   }>(null);

//   return (
//     <AppModalWithToast
//       primaryColor={textColor}
//       backgroundColor={backgroundColor}
//       isFullscreen={false}
//       modalIsTransparent={false}
//       isVisible={isVisible}
//       questionText="User settings"
//       onClose={closeModal}
//       flashMessage={flashMessage}
//       setFlashMessage={setFlashMessage}
//       useCloseButton={true}
//       children={
//         <View style={{ flex: 1 }}>
//           <ScrollView contentContainerStyle={styles.scrollViewContainer}>
//             <SectionAccessibilitySettings
//               backgroundColor={backgroundColor}
//               userId={userId}
//               primaryColor={textColor}
//               settings={settings}
//               setFlashMessage={setFlashMessage}
//             />

//             <SectionFriendManagerSettings
//               backgroundColor={backgroundColor}
//               userId={userId}
//               settings={settings}
//               primaryColor={textColor}
//               manualGradientColors={manualGradientColors}
//               setFlashMessage={setFlashMessage}
//             />

//             {/* <SectionAccountSettings
//               primaryColor={textColor}
//               setFlashMessage={setFlashMessage}
//             /> */}
//           </ScrollView>
//         </View>
//       }
//     />
//   );
// };

// const styles = StyleSheet.create({
//   bodyContainer: {
//     width: "100%",
//     textAlign: "left",
 
//   },
//   headerContainer: {
//     margin: "2%",
//   },
//   scrollViewContainer: {
//     marginVertical: 6,
//     flexDirection: "row",
//     width: "100%",
//     flexWrap: "wrap",
//   },
//   headerText: {
//     fontWeight: "bold",
//     fontSize: 18,
//     lineHeight: 30,
//   },
//   text: {
//     fontSize: 14,
//     lineHeight: 21,
//   },
// });

// export default UserSettingsModal;
import React, { useMemo, useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Alert } from "react-native";

import Toggle from "../user/Toggle";
import SvgIcon from "@/app/styles/SvgIcons";

import AppModalWithToast from "../alerts/AppModalWithToast";
import {
  FlashMessageData,
  settingsUpdateSuccess,
  settingsUpdateError,
} from "../alerts/AllFlashMessages";

import useUpdateSettings from "@/src/hooks/SettingsCalls/useUpdateSettings";
import useUserSettings from "@/src/hooks/useUserSettings";

import BouncyEntrance from "../headers/BouncyEntrance";

// Friend-manager row component used inside the old SectionFriendManagerSettings:
import Reset from "../appwide/button/Reset";

interface Props {
  userId: number;
  isVisible: boolean;
  closeModal: () => void;
  textColor: string;
  backgroundColor: string;
  closeButtonColor: string;
}

const UserSettingsModal: React.FC<Props> = ({
  userId,
  isVisible,
  closeModal,
  textColor,
  backgroundColor,
  closeButtonColor='red'
}) => {
  const { settings } = useUserSettings();

  const [flashMessage, setFlashMessage] = useState<FlashMessageData | null>(
    null,
  );
 
  const { updateSettingsMutation, updateSettings } = useUpdateSettings({
    userId,
  });
 
  useEffect(() => {
    if (updateSettingsMutation.isSuccess) setFlashMessage(settingsUpdateSuccess);
  }, [updateSettingsMutation.isSuccess]);

  useEffect(() => {
    if (updateSettingsMutation.isError) setFlashMessage(settingsUpdateError);
  }, [updateSettingsMutation.isError]);

  const manualTheme = useMemo(() => {
    if (!settings) return false;
    return settings.manual_dark_mode !== null;
  }, [settings]);
 
  const toggleManualTheme = () => {
    if (!settings) return;
    const newValue = !manualTheme;
    updateSettings({ manual_dark_mode: newValue ? false : null });
  };

  const updateLightDark = () => {
    if (!settings) return;
    updateSettings({ manual_dark_mode: !settings.manual_dark_mode });
  };

  const updateHighContrastMode = () => {
    if (!settings) return;
    updateSettings({ high_contrast_mode: !settings.high_contrast_mode });
  };

  const updateLargeText = () => {
    if (!settings) return;
    updateSettings({ large_text: !settings.large_text });
  };

  const updateSimplifyAppForFocus = () => {
    if (!settings) return;
    updateSettings({ simplify_app_for_focus: !settings.simplify_app_for_focus });
  };

  const updateReceiveNotifications = () => {
    if (!settings) return;
    updateSettings({ receive_notifications: !settings.receive_notifications });
  };

  const toggleScreenReader = () => {
    Alert.alert(
      "Screen Reader Required",
      "Please enable the screen reader in your device settings to use this feature.",
      [{ text: "OK", style: "default" }],
      { cancelable: true },
    );
  };
 
  const lockInNext = useMemo(() => {
    if (!settings) return false;
    return settings.lock_in_next === true;
  }, [settings]);

  const toggleLockInNext = () => {
    if (!settings) return;
    updateSettings({ lock_in_next: !settings.lock_in_next });
  };

  // --- BouncyEntrance sequencing like GoOptionsModal ---
  const speed = 10;

  // Rows in order:
  // 1 Manual theme
  // 2 Light/Dark (conditional)
  // 3 High contrast
  // 4 Large text
  // 5 Simplify
  // 6 Receive notifications
  // 7 Screen reader
  // 8 Autoselect next friend
  // 9 Reset all hello dates
  const baseCount = 8; // all rows except the conditional Light/Dark
  const totalAnimatedItems = baseCount + (manualTheme ? 1 : 0);

  const staggeredDelays = useMemo(
    () => Array.from({ length: totalAnimatedItems }, (_, idx) => idx * speed),
    [totalAnimatedItems],
  );

  if (!settings) {
    return (
      <AppModalWithToast
        primaryColor={textColor}
        backgroundColor={backgroundColor}
        isFullscreen={false}
        modalIsTransparent={false}
        isVisible={isVisible}
        questionText="User settings"
        onClose={closeModal}
        flashMessage={flashMessage}
        setFlashMessage={setFlashMessage}
        useCloseButton={true}
      >
        <View style={{ flex: 1 }} />
      </AppModalWithToast>
    );
  }

  let i = 0;

  return (
    <AppModalWithToast
      primaryColor={textColor}
      backgroundColor={backgroundColor}
      isFullscreen={false}
      modalIsTransparent={false}
      isVisible={isVisible}
      questionText="User settings"
      onClose={closeModal}
      flashMessage={flashMessage}
      setFlashMessage={setFlashMessage}
      useCloseButton={true}
      closeButtonColor={closeButtonColor}
    >
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <View style={styles.sectionContainer}>
            <BouncyEntrance delay={staggeredDelays[i++]} style={{ width: "100%" }}>
              <Toggle
                backgroundColor={backgroundColor}
                primaryColor={textColor}
                label="Manual theme"
                icon={
                  <SvgIcon name="theme_light_dark" size={20} color={textColor} />
                }
                value={manualTheme}
                onPress={toggleManualTheme}
              />
            </BouncyEntrance>
          </View>

          {manualTheme && (
            <View style={styles.sectionContainer}>
              <BouncyEntrance delay={staggeredDelays[i++]} style={{ width: "100%" }}>
                <Toggle
                  backgroundColor={backgroundColor}
                  primaryColor={textColor}
                  label="Light/Dark"
                  icon={<SvgIcon name="compare" size={20} color={textColor} />}
                  value={settings.manual_dark_mode === true}
                  onPress={updateLightDark}
                />
              </BouncyEntrance>
            </View>
          )}

          <View style={styles.sectionContainer}>
            <BouncyEntrance delay={staggeredDelays[i++]} style={{ width: "100%" }}>
              <Toggle
                backgroundColor={backgroundColor}
                primaryColor={textColor}
                label="High Contrast Mode"
                icon={<SvgIcon name="text_shadow" size={20} color={textColor} />}
                value={settings.high_contrast_mode}
                onPress={updateHighContrastMode}
              />
            </BouncyEntrance>
          </View>

          <View style={styles.sectionContainer}>
            <BouncyEntrance delay={staggeredDelays[i++]} style={{ width: "100%" }}>
              <Toggle
                backgroundColor={backgroundColor}
                primaryColor={textColor}
                label="Large Text"
                icon={
                  <SvgIcon
                    name="format_font_size_increase"
                    size={20}
                    color={textColor}
                  />
                }
                value={settings.large_text}
                onPress={updateLargeText}
              />
            </BouncyEntrance>
          </View>

          <View style={styles.sectionContainer}>
            <BouncyEntrance delay={staggeredDelays[i++]} style={{ width: "100%" }}>
              <Toggle
                backgroundColor={backgroundColor}
                primaryColor={textColor}
                label="Simplify App For Focus"
                icon={
                  <SvgIcon
                    name="image_filter_center_focus"
                    size={20}
                    color={textColor}
                  />
                }
                value={settings.simplify_app_for_focus}
                onPress={updateSimplifyAppForFocus}
              />
            </BouncyEntrance>
          </View>

          <View style={styles.sectionContainer}>
            <BouncyEntrance delay={staggeredDelays[i++]} style={{ width: "100%" }}>
              <Toggle
                backgroundColor={backgroundColor}
                primaryColor={textColor}
                label="Receive Notifications"
                icon={<SvgIcon name="bell" size={20} color={textColor} />}
                value={settings.receive_notifications}
                onPress={updateReceiveNotifications}
              />
            </BouncyEntrance>
          </View>

          <View style={styles.sectionContainer}>
            <BouncyEntrance delay={staggeredDelays[i++]} style={{ width: "100%" }}>
              <Toggle
                backgroundColor={backgroundColor}
                primaryColor={textColor}
                label="Screen Reader"
                icon={<SvgIcon name="volume_high" size={20} color={textColor} />}
                value={settings.screen_reader}
                onPress={toggleScreenReader}
              />
            </BouncyEntrance>
          </View>

          {/* ---- Friend manager rows (now part of the same sequence) ---- */}
          <View style={styles.sectionContainer}>
            <BouncyEntrance delay={staggeredDelays[i++]} style={{ width: "100%" }}>
              <Toggle
                backgroundColor={backgroundColor}
                primaryColor={textColor}
                label="Autoselect Next Friend"
                icon={<SvgIcon name="account" size={20} color={textColor} />}
                value={lockInNext}
                onPress={toggleLockInNext}
              />
            </BouncyEntrance>
          </View>

          <View style={styles.sectionContainer}>
            <BouncyEntrance delay={staggeredDelays[i++]} style={{ width: "100%" }}>
              <Reset
                userId={userId}
                label="Reset all hello dates"
                icon={<SvgIcon name="timer_sync" size={20} color={textColor} />}
                primaryColor={textColor}
              />
            </BouncyEntrance>
          </View>
        </ScrollView>
      </View>
    </AppModalWithToast>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    marginVertical: 6,
    flexDirection: "row",
    width: "100%",
    flexWrap: "wrap",
  },
  sectionContainer: {
    marginVertical: 6,
    flexDirection: "row",
    width: "100%",
    flexWrap: "wrap",
  },
});

export default UserSettingsModal;