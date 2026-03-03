// import React, { useState } from "react";
// import { View, ScrollView, StyleSheet } from "react-native"; 
// import FriendThemeEditor from "../buttons/friends/FriendThemeEditor";
// // import { useFriendListAndUpcoming } from "@/src/context/FriendListAndUpcomingContext";
//  import AppModal from "../alerts/AppModal";
// import useFriendListAndUpcoming from "@/src/hooks/usefriendListAndUpcoming";
// // import { useFriendList } from "@/src/context/FriendListContext";
// import { FriendDashboardData } from "@/src/types/FriendTypes";
// import AppModalWithToast from "../alerts/AppModalWithToast";

// interface Props {
//   isVisible: boolean;
//   userId: number;
//   friendId: number;
//   friendName: string;
//   friendDash: FriendDashboardData;
//   textColor: string;
//   backgroundColor: string;
//   friendLightColor: string;
//   friendDarkColor: string;
//   bottomSpacer: number;
//   closeModal: () => void;
// }

// const FriendThemeModal: React.FC<Props> = ({
//   userId,
//   isVisible,
//   friendId,
//   friendName = "",
//   textColor,
//   backgroundColor,
//   friendLightColor,
//   friendDarkColor,
//   friendDash,
//   closeModal,
// }) => {
//   const { friendListAndUpcoming } = useFriendListAndUpcoming({userId: userId});
//   const friendList = friendListAndUpcoming?.friends;

  
//     const [flashMessage, setFlashMessage] = useState<null | {
//       text: string;
//       error: boolean;
//       duration: number;
//     }>(null);
  

//   return (
//     <AppModalWithToast
//       primaryColor={textColor}
//       backgroundColor={backgroundColor}
//       isFullscreen={false}
//       modalIsTransparent={false}
//       isVisible={isVisible} 
//       useCloseButton={true}
//       questionText={friendName}
//        onClose={closeModal}
//              flashMessage={flashMessage}
//       setFlashMessage={setFlashMessage}
//     >
//         <View style={{ flex: 1 }}>
//             <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          
//               <FriendThemeEditor
//                 primaryColor={textColor}
//                 backgroundColor={backgroundColor}
//                 editBoxColor={'transparent'}
//                 friendLightColor={friendLightColor}
//                 friendDarkColor={friendDarkColor}
//                 userId={userId}
//                 friendId={friendId}
//                 friendList={friendList}
//                 manualThemeOn={friendDash?.friend_faves?.use_friend_color_theme}
//                   setFlashMessage={setFlashMessage}
//               />
           
//           </ScrollView>
//         </View>
    
//       </AppModalWithToast>
//   );
// };

// const styles = StyleSheet.create({
//   bodyContainer: {
//     width: "100%",
//     flexDirection: "column",
//     justifyContent: "flex-start",
//     textAlign: "left",
//   }, 
//    scrollViewContainer: {
//     marginVertical: 6,
//     flexDirection: "row",
//     width: "100%",
//     flexWrap: "wrap",
//   },
//   headerContainer: {
//     marginVertical: 8,
//   },
//   sectionContainer: {
//     marginVertical: 8,
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

// export default FriendThemeModal;




import React, { useMemo, useEffect, useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";

import AppModalWithToast from "../alerts/AppModalWithToast";
import BouncyEntrance from "../headers/BouncyEntrance";

import Toggle from "../user/Toggle";
import SvgIcon from "@/app/styles/SvgIcons";

import useFriendListAndUpcoming from "@/src/hooks/usefriendListAndUpcoming";
import { FriendDashboardData } from "@/src/types/FriendTypes";

import useReadableColors from "@/src/hooks/useReadableColors";
import useUpdateFaveTheme from "@/src/hooks/SelectedFriendCalls/useUpdateFavesTheme";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import useUpdateFriendListColors from "@/src/hooks/useUpdateFriendListColors";

import ColorPalettes from "@/src/forms/ColorPalettes";

import {
  FlashMessageData,
  friendFavesManualOffSuccess,
  friendFavesManualOffError,
  friendFavesManualOnSuccess,
  friendFavesManualOnError,
  friendFavesColorsSavedSuccess,
  friendFavesColorsSavedError,
} from "../alerts/AllFlashMessages";

interface Props {
  isVisible: boolean;
  userId: number;
  friendId: number;
  friendName: string;
  friendDash: FriendDashboardData;
  textColor: string;
  backgroundColor: string;
  friendLightColor: string;
  friendDarkColor: string;
  bottomSpacer: number;
  closeModal: () => void;
}

const FriendThemeModal: React.FC<Props> = ({
  userId,
  isVisible,
  friendId,
  friendName = "",
  textColor,
  backgroundColor,
  friendLightColor,
  friendDarkColor,
  friendDash,
  closeModal,
}) => {
  const { friendListAndUpcoming } = useFriendListAndUpcoming({ userId });
  const friendList = friendListAndUpcoming?.friends ?? [];

  const [flashMessage, setFlashMessage] = useState<FlashMessageData | null>(
    null,
  );

  // --- these were inside FriendThemeEditor ---
  const { handleSetTheme } = useSelectedFriend();

  const { updateFriendListColorsExcludeSaved } = useUpdateFriendListColors({
    userId,
    setThemeState: handleSetTheme,
  });

  const {
    handleTurnOffManual,
    handleTurnOnManual,
    handleUpdateManualColors,
    disableManualMutation,
    updateColorsMutation,
    enableManualMutation,
  } = useUpdateFaveTheme({ userId, friendId });

  const { getSavedColorTheme, getFontColor, getFontColorSecondary } =
    useReadableColors(friendList, friendId);

  const initialManualOn = !!friendDash?.friend_faves?.use_friend_color_theme;

  const [manualTheme, setManualTheme] = useState<boolean>(initialManualOn);
  const [showEdit, setShowEdit] = useState<boolean>(false);

  // ✅ NEW: delay-mount heavy editor content so modal feels fast
  const [mountEditor, setMountEditor] = useState(false);

  // if you open the modal, reset editor mount timing
  useEffect(() => {
    if (isVisible) {
      setMountEditor(false);
      // mount after entrances start (tweak as needed)
      const t = setTimeout(() => setMountEditor(true), 220);
      return () => clearTimeout(t);
    }
  }, [isVisible]);

  // flash messages (same as before)
  useEffect(() => {
    if (disableManualMutation.isSuccess)
      setFlashMessage(friendFavesManualOffSuccess);
  }, [disableManualMutation.isSuccess]);

  useEffect(() => {
    if (disableManualMutation.isError)
      setFlashMessage(friendFavesManualOffError);
  }, [disableManualMutation.isError]);

  useEffect(() => {
    if (updateColorsMutation.isSuccess)
      setFlashMessage(friendFavesColorsSavedSuccess);
  }, [updateColorsMutation.isSuccess]);

  useEffect(() => {
    if (updateColorsMutation.isError)
      setFlashMessage(friendFavesColorsSavedError);
  }, [updateColorsMutation.isError]);

  useEffect(() => {
    if (enableManualMutation.isSuccess)
      setFlashMessage(friendFavesManualOnSuccess);
  }, [enableManualMutation.isSuccess]);

  useEffect(() => {
    if (enableManualMutation.isError)
      setFlashMessage(friendFavesManualOnError);
  }, [enableManualMutation.isError]);

  const toggleThemeEdit = () => setShowEdit((p) => !p);

  const updateColorThemeSetting = async () => {
    // NOTE: this mirrors your existing code (even though it's a bit confusing)
    // It uses the CURRENT manualTheme value to decide which mutation to run.
    if (manualTheme) {
      // turning OFF
      handleTurnOffManual({
        appDarkColor: "#4caf50",
        appLightColor: "#a0f143",
        fontColor: "#000000",
        fontColorSecondary: "#000000",
      });
      updateFriendListColorsExcludeSaved(
        friendId,
        "#4caf50",
        "#a0f143",
        "#000000",
        "#000000",
      );
    } else {
      // turning ON
      const response = getSavedColorTheme();
      const fontColor = getFontColor(
        response.savedDarkColor,
        response.savedLightColor,
        false,
      );
      const fontColorSecondary = getFontColorSecondary(
        response.savedDarkColor,
        response.savedLightColor,
        false,
      );
      await handleTurnOnManual();
      updateFriendListColorsExcludeSaved(
        friendId,
        response.savedDarkColor,
        response.savedLightColor,
        fontColor,
        fontColorSecondary,
      );
    }
  };

  const toggleUseFriendColorTheme = async () => {
    const newValue = !manualTheme;
    setManualTheme(newValue);
    await updateColorThemeSetting();
    // if turning off, also collapse editor
    if (!newValue) setShowEdit(false);
  };

  // --- single connected entrance sequence ---
  // 0: Manual theme row
  // 1: Preview pill row (only if manualTheme true)
  // 2: Editor panel (only if manualTheme && showEdit && mountEditor)
  const speed = 20;
  const totalItems =
    1 + (manualTheme ? 1 : 0) + (manualTheme && showEdit && mountEditor ? 1 : 0);

  const delays = useMemo(
    () => Array.from({ length: totalItems }, (_, idx) => idx * speed),
    [totalItems],
  );

  let i = 0;

  return (
    <AppModalWithToast
      primaryColor={textColor}
      backgroundColor={backgroundColor}
      isFullscreen={false}
      modalIsTransparent={false}
      isVisible={isVisible}
      useCloseButton={true}
      questionText={friendName}
      onClose={closeModal}
      flashMessage={flashMessage}
      setFlashMessage={setFlashMessage}
    >
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          {/* 1) Manual theme toggle */}
          <View style={styles.sectionContainer}>
            <BouncyEntrance delay={delays[i++]} style={{ width: "100%" }}>
              <Toggle
                primaryColor={textColor}
                backgroundColor={backgroundColor}
                label="Manual theme"
                icon={<SvgIcon name="palette" size={20} color={textColor} />}
                value={manualTheme}
                onPress={toggleUseFriendColorTheme}
              />
            </BouncyEntrance>
          </View>

          {/* 2) Preview pill row (separate row so it can animate independently) */}
          {manualTheme && (
            <View style={styles.sectionContainer}>
              <BouncyEntrance delay={delays[i++]} style={{ width: "100%" }}>
                <View style={styles.previewRow}>
                  <View style={{ flex: 1 }} />
                  <View style={styles.previewRight}>
                    <View style={styles.previewSpacer} />
                    <View style={styles.previewPillWrap}>
                      <View style={styles.previewPillTouch} onTouchEnd={toggleThemeEdit}>
                        <View
                          style={[
                            styles.previewHalf,
                            { backgroundColor: friendDarkColor },
                          ]}
                        />
                        <View
                          style={[
                            styles.previewHalf,
                            { backgroundColor: friendLightColor },
                          ]}
                        />
                        {showEdit && (
                          <View style={styles.cancelOverlay}>
                            <SvgIcon
                              name="cancel"
                              size={14}
                              color="rgba(255,255,255,0.8)"
                            />
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              </BouncyEntrance>
            </View>
          )}

          {/* 3) Heavy editor panel — mounted AFTER short delay so modal feels fast */}
          {manualTheme && showEdit && mountEditor && (
            <View style={styles.sectionContainer}>
              <BouncyEntrance delay={delays[i++]} style={{ width: "100%" }}>
                <View style={styles.editFormContainer}>
                  <ColorPalettes
                    userId={userId}
                    friendId={friendId}
                    friendLightColor={friendLightColor}
                    friendDarkColor={friendDarkColor}
                    handleSetTheme={handleSetTheme}
                    handleUpdateManualColors={handleUpdateManualColors}
                    onSaveComplete={toggleThemeEdit}
                  />
                </View>
              </BouncyEntrance>
            </View>
          )}
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
    marginVertical: 2, // keep tight like your other modal
    flexDirection: "row",
    width: "100%",
    flexWrap: "wrap",
  },

  // --- preview pill row layout ---
  previewRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  previewRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  previewSpacer: { width: 0 },

  previewPillWrap: {
    justifyContent: "center",
    alignItems: "center",
  },
  previewPillTouch: {
    flexDirection: "row",
    width: 52,
    height: 26,
    borderRadius: 50,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  previewHalf: { flex: 1 },
  cancelOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },

  editFormContainer: {
    marginTop: 10,
    width: "100%",
  },
});

export default FriendThemeModal;