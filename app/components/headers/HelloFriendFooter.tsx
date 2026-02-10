import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, Keyboard } from "react-native";

// app components
import AboutAppModal from "./AboutAppModal";
import ReportIssueModal from "./ReportIssueModal";
import UserSettingsModal from "./UserSettingsModal.";
// import FriendSettingsModal from "./FriendSettingsModal";
import CategoriesModal from "./CategoriesModal";
import CategoryFooterButton from "../buttons/friends/CategoryFooterbutton";
// app display/templates
import FooterButtonIconVersion from "./FooterButtonIconVersion";
// import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import useSignOut from "@/src/hooks/UserCalls/useSignOut";

import SvgIcon from "@/app/styles/SvgIcons";

// types
import { LDTheme } from "@/src/types/LDThemeTypes";
import manualGradientColors from "@/app/styles/StaticColors";

type Props = {
  userId: number;
  username: string;
  lightDarkTheme: LDTheme;
  friendListLength: number;
};
const HelloFriendFooter = ({
  userId,
  username,
  lightDarkTheme,
  friendListLength,
  themeColors,
}: Props) => {
  const dividerStyle = lightDarkTheme.divider;

  const { onSignOut } = useSignOut();
  // const { selectFriend } = useSelectedFriend();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const [aboutModalVisible, setAboutModalVisible] = useState(false);
  const [categoriesModalVisible, setCategoriesModalVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  // const [friendSettingsModalVisible, setFriendSettingsModalVisible] =
  //   useState(false);

  // these are the only dimensions I foresee potentially changing, hence why they are at top here
  const footerHeight = 90;
  const footerPaddingBottom = 12;
  const footerIconSize = 24;

  const primaryColor = lightDarkTheme.primaryText;
  // const primaryBackground = lightDarkTheme.primaryBackground;
  // const overlayColor =
  //   friendListLength > 0
  //     ? lightDarkTheme.overlayBackground
  //     : lightDarkTheme.primaryBackground;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setIsKeyboardVisible(true),
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setIsKeyboardVisible(false),
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // buttons rendered in callbacks, all using the same template except for the friend profile button
  const RenderSignOutButton = useCallback(
    () => (
      <FooterButtonIconVersion
        primaryColor={primaryColor}
        confirmationRequired={true}
        confirmationTitle={"Just to be sure"}
        confirmationMessage={"Sign out?"}
        // label="Deselect"
        label="Sign out"
        icon={
          <SvgIcon
            // name={"keyboard-backspace"}
            name={"logout"}
            size={footerIconSize}
            color={primaryColor}
            style={{
              transform: [{ scaleX: -1 }],
            }}
          />
        }
        onPress={() => onSignOut()}
      />
    ),
    [primaryColor],
  );

  const RenderSettingsButton = useCallback(
    () => (
      <FooterButtonIconVersion
        primaryColor={primaryColor}
        label="Settings"
        icon={
          <SvgIcon
            name={"settings_suggest"} // might just want to use 'settings' here, not sure what 'settings-suggest' actually means, just looks pretty
            //  name={"app-settings-alt"}
            size={footerIconSize}
            color={primaryColor}
          />
        }
        onPress={() => setSettingsModalVisible(true)}
      />
    ),
    [primaryColor],
  );

  const RenderReportIssueButton = useCallback(
    () => (
      <FooterButtonIconVersion
        primaryColor={primaryColor}
        label="Report"
        icon={
          <SvgIcon
            name={"bug_outline"}
            size={footerIconSize}
            color={primaryColor}
          />
        }
        onPress={() => setReportModalVisible(true)}
      />
    ),
    [primaryColor],
  );

  const handleCenterButtonToggle = () => {
    // console.log("center button toggled!");
    // if (friendId) {
    //   setFriendSettingsModalVisible(true);
    // } else {
    setCategoriesModalVisible((prev) => !prev);
    // }
  };

  const RenderCategoryButton = useCallback(
    () => <CategoryFooterButton onPress={() => handleCenterButtonToggle()} />,
    [themeColors],
  );

  const RenderAboutAppButton = useCallback(
    () => (
      <FooterButtonIconVersion
        primaryColor={primaryColor}
        label="About"
        icon={
          <SvgIcon
            name={"information_outline"}
            size={footerIconSize}
            color={primaryColor}
          />
        }
        onPress={() => setAboutModalVisible(true)}
      />
    ),
    [primaryColor],
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: manualGradientColors.homeLightColor,
          height: footerHeight,
          paddingBottom: footerPaddingBottom,
          opacity: 0.94,
        },
      ]}
    >
      {/* <GradientBackground
      useFriendColors={false}
      screenname={"hellofriendfooter"}
      friendColorDark={themeColors.darkColor}
      friendColorLight={themeColors.lightColor}
      additionalStyles={[
        styles.container,
        {
          height: footerHeight,
          paddingBottom: footerPaddingBottom,
          opacity: 0.94,
        },
      ]}
    > */}
      <View
        style={[
          styles.container,
          {
            backgroundColor: lightDarkTheme.darkerOverlayBackground,
            height: footerHeight,
            paddingBottom: footerPaddingBottom,
            paddingBottom: footerPaddingBottom,
            opacity: 0.94,
            // backgroundColor: manualGradientColors.homeLightColor,
          },
        ]}
      >
        <View style={styles.section}>
          <RenderSignOutButton />
        </View>

        <View style={[styles.divider, dividerStyle]} />
        <>
          <View style={styles.section}>
            <RenderSettingsButton />
          </View>
        </>

        <View style={[styles.divider, dividerStyle]} />
        <>
          <View style={styles.section}>
            <RenderCategoryButton />
          </View>
        </>

        <View style={[styles.divider, dividerStyle]} />

        <View style={styles.section}>
          <RenderReportIssueButton />
        </View>

        <View style={[styles.divider, dividerStyle]} />
        <>
          <View style={styles.section}>
            <RenderAboutAppButton />
          </View>
        </>
      </View>

      {settingsModalVisible && userId && (
        <View>
          <UserSettingsModal
            userId={userId}
            isVisible={settingsModalVisible}
            bottomSpacer={footerHeight - 30} //for safe view
            closeModal={() => setSettingsModalVisible(false)}
            lightDarkTheme={lightDarkTheme}
          />
        </View>
      )}

      {categoriesModalVisible && (
        <View>
          <CategoriesModal
            userId={userId}
            primaryColor={primaryColor}
            isVisible={categoriesModalVisible}
            isKeyboardVisible={isKeyboardVisible}
            bottomSpacer={footerHeight - 30} //for safe view
            closeModal={() => setCategoriesModalVisible(false)}
          />
        </View>
      )}
      {aboutModalVisible && (
        <View>
          <AboutAppModal
            isVisible={aboutModalVisible}
            closeModal={() => setAboutModalVisible(false)}
            bottomSpacer={footerHeight - 30} //for safe view
            primaryColor={primaryColor}
          />
        </View>
      )}

      {reportModalVisible && (
        <View>
          <ReportIssueModal
            username={username}
            primaryColor={primaryColor}
            isVisible={reportModalVisible}
            bottomSpacer={footerHeight - 30} //for safe view
            closeModal={() => setReportModalVisible(false)}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    position: "absolute",
    // borderTopRightRadius: 20,
    // borderTopLeftRadius: 20,
    borderRadius: 999,
    bottom: 0,
    zIndex: 50000,
  },
  section: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    marginVertical: 10,
  },
});

export default HelloFriendFooter;
