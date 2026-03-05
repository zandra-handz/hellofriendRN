import React, { useState, useEffect, useRef, useMemo } from "react";
import { View, StyleSheet, Keyboard } from "react-native";
import { useSharedValue, withTiming } from "react-native-reanimated";

import SafeViewAppDefault from "@/app/components/appwide/format/SafeViewAppDefault";
import StaticBackdrop from "@/app/components/appwide/format/StaticBackdrop";
import AuthScreenHeader from "@/app/components/user/AuthScreenHeader";
import AuthScreenTray from "./AuthScreenTray";
import AuthBottomButton from "@/app/components/appwide/button/AuthBottomButton";
import OptionInput from "@/app/components/headers/OptionInput";
import BouncyEntrance from "@/app/components/headers/BouncyEntrance";

import useAppNavigations from "@/src/hooks/useAppNavigations";
import { useLDTheme } from "@/src/context/LDThemeContext";

import {
  sendResetCodeEmail,
  verifyResetCodeEmail,
  resetPassword,
} from "@/src/calls/api";

import manualGradientColors from "@/app/styles/StaticColors";
import { AppFontStyles } from "@/app/styles/AppFonts";

const ScreenRecoverCredentials = () => {
  const { lightDarkTheme } = useLDTheme();
  const { navigateToAuth, navigateToWelcome } = useAppNavigations();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRequestCodeScreen, setIsRequestCodeScreen] = useState(true);
  const [isValidateCodeScreen, setIsValidateCodeScreen] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const resetCodeRef = useRef(null);
  const newPasswordInputRef = useRef(null);
  const emailInputRef = useRef(null);

  const BOUNCE_SPEED = 60;
  const textColor = manualGradientColors.lightColor;
  const darkColor = manualGradientColors.homeDarkColor;
  const inputTextStyle = AppFontStyles.subWelcomeText;

  // backdrop starts visible
  const ActivateBackdrop = useSharedValue(1);

  const staggeredDelays = useMemo(
    () => Array.from({ length: 4 }, (_, i) => i * BOUNCE_SPEED),
    [],
  );

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () => setIsKeyboardVisible(true));
    const hide = Keyboard.addListener("keyboardDidHide", () => setIsKeyboardVisible(false));
    return () => { show.remove(); hide.remove(); };
  }, []);

  const labelText = !isRequestCodeScreen && !isValidateCodeScreen
    ? "Reset code validated! Enter new password:"
    : isRequestCodeScreen
      ? "Enter email associated with account:"
      : "If an account with that email is found, you will be emailed a reset code shortly!";

  const handleSubmit = async () => {
    if (!isRequestCodeScreen && !isValidateCodeScreen) {
      try {
        await resetPassword({ email, resetCode, newPassword });
        navigateToAuth({});
      } catch (error) {
        console.error(error);
      }
    }
    if (isRequestCodeScreen) {
      try {
        sendResetCodeEmail(email);
        setIsRequestCodeScreen(false);
        setIsValidateCodeScreen(true);
      } catch (error) {
        console.error(error);
      }
    }
    setLoading(false);
    if (isValidateCodeScreen) {
      try {
        await verifyResetCodeEmail({ email, resetCode });
        setIsValidateCodeScreen(false);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const activeInputProps = {
    textStyle: inputTextStyle,
    buttonPadding: 4,
    primaryColor: textColor,
    backgroundColor: lightDarkTheme.primaryBackground,
    buttonColor: textColor,
  };

  return (
    <SafeViewAppDefault customStatusIsDarkMode={true} style={styles.container}>
      <StaticBackdrop
        color={lightDarkTheme.primaryBackground}
        zIndex={0}
        isVisibleValue={ActivateBackdrop}
        startsVisible={true}
      />

      <View style={styles.outerContainer}>
        <BouncyEntrance delay={staggeredDelays[0]} style={{ width: "100%" }}>
          <AuthScreenTray
            onBackPress={navigateToAuth}
            onHomePress={navigateToWelcome}
            rightLabel={null}
            onRightPress={null}
            iconColor={manualGradientColors.lightColor}
          />
        </BouncyEntrance>

        <BouncyEntrance delay={staggeredDelays[1]} style={{ width: "100%" }}>
          <AuthScreenHeader color={textColor} label={"Recover password"} />
        </BouncyEntrance>

        <BouncyEntrance delay={staggeredDelays[2]} style={{ width: "100%" }}>
          <AuthScreenHeader color={textColor} overrideFontSize={14} label={labelText} />
        </BouncyEntrance>

        <View style={styles.inputsContainer}>
          {isRequestCodeScreen && (
            <View style={styles.inputRow}>
              <BouncyEntrance delay={staggeredDelays[3]} style={{ width: "100%" }}>
                <OptionInput
                  {...activeInputProps}
                  inputRef={emailInputRef}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email"
                  inputMode="email"
                  keyboardType="email-address"
                  autoFocus={true}
                  enterKeyHint="next"
                  onSubmitEditing={handleSubmit}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  accessibilityLabel="Email input"
                  accessibilityHint="Enter your email address"
                />
              </BouncyEntrance>
            </View>
          )}

          {isValidateCodeScreen && (
            <View style={styles.inputRow}>
              <BouncyEntrance delay={staggeredDelays[3]} style={{ width: "100%" }}>
                <OptionInput
                  {...activeInputProps}
                  inputRef={resetCodeRef}
                  value={resetCode}
                  onChangeText={setResetCode}
                  placeholder="Reset code"
                  autoFocus={true}
                  enterKeyHint="next"
                  onSubmitEditing={handleSubmit}
                  onFocus={() => setFocusedField("resetCode")}
                  onBlur={() => setFocusedField(null)}
                  accessibilityLabel="Reset code input"
                  accessibilityHint="Enter the reset code emailed to you"
                />
              </BouncyEntrance>
            </View>
          )}

          {!isRequestCodeScreen && !isValidateCodeScreen && (
            <View style={styles.inputRow}>
              <BouncyEntrance delay={staggeredDelays[3]} style={{ width: "100%" }}>
                <OptionInput
                  {...activeInputProps}
                  inputRef={newPasswordInputRef}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="New password"
                  secureTextEntry={true}
                  autoFocus={true}
                  enterKeyHint="enter"
                  onSubmitEditing={handleSubmit}
                  onFocus={() => setFocusedField("newPassword")}
                  onBlur={() => setFocusedField(null)}
                  accessibilityLabel="New password input"
                  accessibilityHint="Enter your new password"
                />
              </BouncyEntrance>
            </View>
          )}
        </View>
      </View>

      <View style={styles.bottomButtonWrapper}>
        <AuthBottomButton
          onPress={handleSubmit}
          title="Next"
          borderRadius={10}
          backgroundColor={darkColor}
          labelColor={textColor}
        />
      </View>
    </SafeViewAppDefault>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  outerContainer: {
    paddingHorizontal: 10,
    flex: 1,
  },
  inputsContainer: {
    width: "100%",
    justifyContent: "flex-start",
    flex: 1,
  },
  inputRow: {
    width: "100%",
    marginVertical: 6,
  },
  bottomButtonWrapper: {
    width: "100%",
    bottom: 0,
    paddingHorizontal: 4,
  },
});

export default ScreenRecoverCredentials;