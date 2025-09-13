import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";

import { useUser } from "@/src/context/UserContext";
import { manualGradientColors } from "@/src/hooks/StaticColors";
import { useRoute, RouteProp } from "@react-navigation/native";
import PreAuthSafeViewAndGradientBackground from "@/app/components/appwide/format/PreAuthSafeViewAndGradBackground";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import AuthBottomButton from "@/app/components/appwide/button/AuthBottomButton";
import { AuthScreenParams } from "@/src/types/ScreenPropTypes";
import { useFocusEffect } from "@react-navigation/native";
import AuthScreenTopTray from "@/app/components/user/AuthScreenTopTray";
import AuthScreenHeader from "@/app/components/user/AuthScreenHeader";
import AuthInputWrapper from "@/app/components/user/AuthInputWrapper";

import useMessageCentralizer from "@/src/hooks/useMessageCentralizer";
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";
import { useLDTheme } from "@/src/context/LDThemeContext";
import useSignIn from "@/src/hooks/UserCalls/useSignIn";
import LoadingPage from "@/app/components/appwide/spinner/LoadingPage";
import { appFontStyles } from "@/src/hooks/StaticFonts";

type ShareIntentParams = {
  ShareIntent: {
    sharedUrl: string;
  };
};

const ScreenShareIntent = () => {
  const route = useRoute<RouteProp<ShareIntentParams, "ShareIntent">>();
  const sharedUrl = route.params?.sharedUrl;

  const { navigateToNewAccount, navigateBack, navigateToRecoverCredentials } =
    useAppNavigations();
  const { lightDarkTheme } = useLDTheme();

  return (
    <PreAuthSafeViewAndGradientBackground
      settings={null}
      startColor={manualGradientColors.darkColor}
      endColor={manualGradientColors.lightColor}
      friendColorLight={null}
      friendColorDark={null}
      friendId={null}
      includeCustomStatusBar={false}
      backgroundOverlayColor={lightDarkTheme.primaryBackground}
      style={{
        flex: 1,
        // paddingTop: 40, // TEMPORARY
      }}
    >
      {" "}
      <View
        style={{
          flexDirection: "column",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Text style={{}}>
          SHARE INTENT SCREEN!
          <Text style={{ fontSize: 16, color: "#555" }}>
            {sharedUrl || "No URL received"}
          </Text>
        </Text>
        <Pressable
          onPress={navigateBack}
          style={{
            width: "90%",
            padding: 10,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            backgroundColor: manualGradientColors.homeDarkColor,
            borderRadius: 999,
          }}
        >
          <Text
            style={[
              appFontStyles.subWelcomeText,
              { color: manualGradientColors.lightColor },
            ]}
          >
            Back
          </Text>
        </Pressable>
      </View>
    </PreAuthSafeViewAndGradientBackground>
  );
};

const styles = StyleSheet.create({
  inputsContainer: {
    height: 200,
    width: "100%",
    fontFamily: "Poppins-Regular",
    //   backgroundColor: "hotpink",
    justifyContent: "flex-start",
    flex: 1,
  },
  input: {
    fontFamily: "Poppins-Regular",

    height: "auto",
    borderWidth: 2.6,
    padding: 10,
    paddingTop: 10,
    borderRadius: 10,
    alignContent: "center",
    justifyContent: "center",
    borderColor: "black",
    fontSize: 15,
  },
  inputFocused: {
    fontFamily: "Poppins-Regular",
    borderWidth: 3,
  },
  title: {
    fontSize: 62,
    marginBottom: 10,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
  },
  toggleButton: {
    color: "black",
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    selfAlign: "center",
  },
  spinnerContainer: {
    ...StyleSheet.absoluteFillObject, // Cover the entire screen
    backgroundColor: "transparent", // Semi-transparent background
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ScreenShareIntent;
