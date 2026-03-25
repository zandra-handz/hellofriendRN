import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, Keyboard } from "react-native";

// app components
import AboutAppModal from "./AboutAppModal";
import ReportIssueModal from "./ReportIssueModal";
import UserSettingsModal from "./UserSettingsModal.";
import { showModalMessage } from "@/src/utils/ShowModalMessage";
import CategoryFooterButton from "../buttons/friends/CategoryFooterbutton";
// import useUserGeckoCombinedData from "@/src/hooks/useUserGeckoCombinedData";

// app display/templates
import FooterButtonIconVersion from "./FooterButtonIconVersion";
import useSignOut from "@/src/hooks/UserCalls/useSignOut";

import SvgIcon from "@/app/styles/SvgIcons";

// types
import { LDTheme } from "@/src/types/LDThemeTypes";

type Props = {
  userId: number;
  username: string;
  lightDarkTheme: LDTheme;
};
const HelloFriendFooter = ({
  // skiaFontLarge,
  skiaFontSmall,
  userId,
  username,
  lightDarkTheme,
  geckoCombinedData,
}: Props) => {
  const { onSignOut } = useSignOut();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [aboutModalVisible, setAboutModalVisible] = useState(false);
  const [geckoDataVisible, setGeckoDataVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);

  // these are the only dimensions I foresee potentially changing, hence why they are at top here
  const footerHeight = 90;
  const footerPaddingBottom = 12;
  const footerIconSize = 24;

  const primaryColor = lightDarkTheme.primaryText;

  useEffect(() => {
    if (geckoDataVisible && geckoCombinedData) {

         showModalMessage({
          onConfirm: setGeckoDataVisible(false),
      title: "Your gecko stats",
      body: `Total steps: ${geckoCombinedData.total_steps}\nTotal distance: ${geckoCombinedData.total_distance}`,
    });
    }
  }, [geckoDataVisible]);

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
        label="Sign out"
        icon={
          <SvgIcon
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
        label="Account"
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
    console.log("button pressed!");
    setGeckoDataVisible((prev) => !prev);
  };

  const RenderCategoryButton = useCallback(
    () => (
      <CategoryFooterButton
        skiaFontLarge={skiaFontSmall}
        textColor={primaryColor}
        onPress={() => handleCenterButtonToggle()}
      />
    ),
    [], // was theme colors but I'm not sure why
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
          height: footerHeight,
          paddingBottom: footerPaddingBottom,
          opacity: 0.94,
        },
      ]}
    >
      <View
        style={[
          styles.container,
          {
            // backgroundColor: lightDarkTheme.darkerOverlayBackground,
            height: footerHeight,
            paddingBottom: footerPaddingBottom,
            opacity: 0.94,
          },
        ]}
      >
        <View style={styles.section}>
          <RenderSignOutButton />
        </View>

        <>
          <View style={styles.section}>
            <RenderSettingsButton />
          </View>
        </>
        <>
          <View style={styles.section}>
            <RenderCategoryButton />
          </View>
        </>

        <View style={styles.section}>
          <RenderReportIssueButton />
        </View>
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
            closeModal={() => setSettingsModalVisible(false)}
            textColor={lightDarkTheme.primaryText}
            backgroundColor={lightDarkTheme.primaryBackground}
          />
        </View>
      )}

      {/* {categoriesModalVisible && (
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
      )} */}
      {aboutModalVisible && (
        <View>
          <AboutAppModal
            isVisible={aboutModalVisible}
            closeModal={() => setAboutModalVisible(false)}
            textColor={lightDarkTheme.primaryText}
            backgroundColor={lightDarkTheme.primaryBackground}
          />
        </View>
      )}

      {reportModalVisible && (
        <View>
          <ReportIssueModal
            username={username}
            textColor={lightDarkTheme.primaryText}
            backgroundColor={lightDarkTheme.primaryBackground}
            isVisible={reportModalVisible}
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
