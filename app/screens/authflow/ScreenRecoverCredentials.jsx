import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Keyboard,
} from "react-native";

import PreAuthSafeViewAndGradientBackground from "@/app/components/appwide/format/PreAuthSafeViewAndGradBackground";
import { useFriendStyle } from "@/src/context/FriendStyleContext";
import { useNavigation } from "@react-navigation/native";
import AuthScreenTopTray from "@/app/components/user/AuthScreenTopTray";
import AuthScreenHeader from "@/app/components/user/AuthScreenHeader";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import LoadingPage from "@/app/components/appwide/spinner/LoadingPage";
import AuthInputWrapper from "@/app/components/user/AuthInputWrapper";
import { useLDTheme } from "@/src/context/LDThemeContext";
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";
import {
  sendEmail,
  sendResetCodeEmail,
  verifyResetCodeEmail,
  resetPassword,
} from "@/src/calls/api";

import manualGradientColors  from "@/app/styles/StaticColors";
// import PhoneStatusBar from "@/app/components/appwide/statusbar/PhoneStatusBar";
import AuthBottomButton from "@/app/components/appwide/button/AuthBottomButton";

const ScreenRecoverCredentials = () => {
  const { themeAheadOfLoading } = useFriendStyle();
  const { lightDarkTheme } = useLDTheme();
  const { navigateToAuth } = useAppNavigations();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRequestCodeScreen, setIsRequestCodeScreen] = useState(true);
  const [isValidateCodeScreen, setIsValidateCodeScreen] = useState(false);

  const resetCodeRef = useRef(null);
  const newPasswordInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const [isNewPasswordFocused, setIsNewPasswordFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isResetCodeFocused, setIsResetCodeFocused] = useState(false);
  const navigation = useNavigation();

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setIsKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setIsKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const labelText =
    !isRequestCodeScreen && !isValidateCodeScreen
      ? "Reset code validated! Enter new password: "
      : isRequestCodeScreen
        ? "Enter email associated with account: "
        : "If an account with that email is found, you will be emailed a reset code shortly!";

  const handleSubmit = async () => {
    //need to do something to prevent double calling probably?
    if (!isRequestCodeScreen && !isValidateCodeScreen) {
      try {
        // showMessage(true, null, `Resetting password for ${resetCode}`);

        await resetPassword({ email, resetCode, newPassword });

        // showMessage(false, null, "Password reset successfully! Please log in.");

        handleNavigateBackToAuthScreen();
      } catch (error) {
        console.error(error);
        // showMessage(true, null, `Error! Couldn't reset password.`);
      }
    }
    if (isRequestCodeScreen) {
      try {
        // showMessage(true, null, "Sending email...");
//sendEmail(email);
       sendResetCodeEmail(email);
        setIsRequestCodeScreen(false);
        setIsValidateCodeScreen(true);
      } catch (error) {
        console.error(error);
        // showMessage(true, null, `Error! Can't send email.`);
      }
    }
    setLoading(false);

    if (isValidateCodeScreen) {
      try {
        // showMessage(
        //   true,
        //   null,
        //   `Checking reset code... ${resetCode}, ${email}`
        // );
        await verifyResetCodeEmail({ email, resetCode });

        // showMessage(false, null, "Reset code verified successfully!");
        setIsValidateCodeScreen(false);
      } catch (error) {
        console.error(error);
        // showMessage(true, null, `Error! Couldn't verify reset code.`);
      }
    }
  };

  const handleNavigateBackToAuthScreen = () => {
    navigation.goBack();
  };

  return (
    <PreAuthSafeViewAndGradientBackground
      settings={null}
      startColor={manualGradientColors.darkColor}
      endColor={manualGradientColors.lightColor}
      friendColorLight={null}
      friendColorDark={null}
      friendId={null}
      backgroundOverlayColor={lightDarkTheme.primaryBackground}
      style={{
        flex: 1,
        //paddingTop: 40, // TEMPORARY
      }}
    >
      {loading && (
        <View
          style={{
            // backgroundColor: "orange",
            zIndex: 100000,
            elevation: 100000,
            position: "absolute",
            width: "100%",
            height: "100%",
            flex: 1,
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
          }}
        >
          <LoadingPage
            loading={true}
            spinnerType="circle"
            spinnerSize={40}
            color={"yellow"}
          />
        </View>
      )}

      {!loading && (
        <View style={{ paddingHorizontal: 10 }}>
          <AuthScreenTopTray onBackPress={navigateToAuth} />
          <AuthScreenHeader label={"Recover password"} />

          <AuthScreenHeader overrideFontSize={14} label={labelText} />

          <View
            style={[styles.inputsContainer]}
            accessible={true}
            accessibilityLabel="Form container"
          >
            {isRequestCodeScreen && (
              <AuthInputWrapper
                condition={email}
                label={"Email"}
                children={
                  <TextInput
                    style={[
                      styles.input,
                      isEmailFocused && styles.inputFocused,
                    ]}
                    placeholder="Email"
                    autoFocus={true}
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    onSubmitEditing={handleSubmit}
                    ref={emailInputRef}
                    onFocus={() => setIsEmailFocused(true)}
                    onBlur={() => setIsEmailFocused(false)}
                    accessible={true}
                    accessibilityLabel="Email input"
                    accessibilityHint="Enter your email address"
                    importantForAccessibility="yes"
                  />
                }
              />
            )}

            {isValidateCodeScreen && (
              <AuthInputWrapper
                condition={resetCode}
                label={"Reset code"}
                children={
                  <TextInput
                    style={[
                      styles.input,
                      isResetCodeFocused && styles.inputFocused,
                    ]}
                    placeholder="Reset code"
                    onChangeText={(text) => setResetCode(text)}
                    value={resetCode}
                    onSubmitEditing={handleSubmit}
                    ref={resetCodeRef}
                    onFocus={() => setIsResetCodeFocused(true)}
                    onBlur={() => setIsResetCodeFocused(false)}
                    accessible={true}
                    accessibilityLabel="Reset code input"
                    accessibilityHint="Enter the reset code emailed to you"
                    importantForAccessibility="yes"
                  />
                }
              />
            )}

            {!isRequestCodeScreen && !isValidateCodeScreen && (
              <AuthInputWrapper
                condition={resetCode}
                label={"Reset code"}
                children={
                  <TextInput
                    style={[
                      styles.input,
                      isNewPasswordFocused && styles.inputFocused,
                    ]}
                    placeholder="New password"
                    secureTextEntry={true}
                    onChangeText={(text) => setNewPassword(text)}
                    value={newPassword}
                    onSubmitEditing={handleSubmit}
                    ref={newPasswordInputRef}
                    onFocus={() => setIsNewPasswordFocused(true)}
                    onBlur={() => setIsNewPasswordFocused(false)}
                    accessible={true}
                    accessibilityLabel="New password input"
                    accessibilityHint="Enter new password"
                    importantForAccessibility="yes"
                  />
                }
              />
            )}
          </View>

 
          <View
            style={{
              width: "100%",
              bottom: 0,
 
            }}
          >
            <AuthBottomButton
              onPress={handleSubmit}
              title={isRequestCodeScreen ? "Next" : "Next"}
              fontColor={lightDarkTheme.primaryText}
              accessible={true}
              // accessibilityLabel={
              //   isRequestCodeScreen ? "Sign in button" : "Create account button"
              // }
              // accessibilityHint="Press to sign in or create an account"
            />
          </View>
        </View>
      )}
    </PreAuthSafeViewAndGradientBackground>
  );
};

const styles = StyleSheet.create({
  form: {
    gap: 20,
    height: 200,
    width: "100%",
    fontFamily: "Poppins-Regular",
    bottom: 10,
    paddingHorizontal: "4%",
    position: "absolute",
    justifyContent: "flex-end",
    flex: 1,
  },
  inputsContainer: {
    height: 300,
    width: "100%",
    fontFamily: "Poppins-Regular",

    justifyContent: "flex-start",
    //flex: 1,
  },
  input: {
    fontFamily: "Poppins-Regular",
    placeholderTextColor: "black",
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
  inputHeaderText: {
    color: "black",
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    selfAlign: "center",
  },
  inputSubHeaderText: {
    color: "black",
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    selfAlign: "center",
  },
});

export default ScreenRecoverCredentials;
