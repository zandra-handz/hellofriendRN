import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import { useUser } from "@/src/context/UserContext";
import { manualGradientColors } from "@/src/hooks/StaticColors";
import { useRoute, RouteProp } from "@react-navigation/native";
import PreAuthSafeViewAndGradientBackground from "@/app/components/appwide/format/PreAuthSafeViewAndGradBackground";

import SimpleBottomButton from "@/app/components/appwide/button/SimpleBottomButton";
import { AuthScreenParams } from "@/src/types/ScreenPropTypes";

import AuthScreenTopTray from "@/app/components/user/AuthScreenTopTray";
import AuthScreenHeader from "@/app/components/user/AuthScreenHeader";
import AuthInputWrapper from "@/app/components/user/AuthInputWrapper";

import { useLDTheme } from "@/src/context/LDThemeContext";
import useSignIn from "@/src/hooks/UserCalls/useSignIn";
import useSignUp from "@/src/hooks/UserCalls/useSignUp";
import LoadingPage from "@/app/components/appwide/spinner/LoadingPage";

const ScreenNewAccount = () => {
  const route = useRoute<RouteProp<Record<string, AuthScreenParams>, string>>();
  const usernameEntered = route.params?.usernameEntered ?? false;
  const { navigateToAuth, navigateBack } = useAppNavigations();
  const { lightDarkTheme } = useLDTheme();
  const [username, setUsername] = useState(usernameEntered);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const { refetch } = useUser();
  const { onSignIn, signinMutation } = useSignIn({ refetchUser: refetch });

  const { onSignUp, signupMutation } = useSignUp({ signInNewUser: onSignIn });

  const usernameInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const verifyPasswordInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const placeholderTextColor = manualGradientColors.homeDarkColor;

  const INPUTS_GAP = 4;
  const DELAY_BEFORE_FOCUS = 300;

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

  const handleBackToSignIn = () => {
    navigateToAuth({ usernameEntered: username });

    setUsername("");
    setEmail("");
    setPassword("");
    setVerifyPassword("");
  };

  const handleCreateAccount = async () => {
    let result;

    if (password !== verifyPassword) {
      return;
    }
    console.log("signing up new user");
    result = await onSignUp(username, email, password);
    if (result && result.status === 201) {
      alert("Sign up was successful!");

      navigateToAuth({ usernameEntered: username });
    } else if (result && result.error) {
      alert("Error: " + result.error);
    }
  };

  const [usernameSubmitted, setUsernameSubmitted] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [passwordSubmitted, setPasswordSubmitted] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  const handleUsernameSubmit = () => {
    setUsernameSubmitted(true);
    setTimeout(() => {
      if (emailInputRef.current && username) {
        emailInputRef.current.focus();
      }
    }, DELAY_BEFORE_FOCUS);
  };

  const handleUsernameChange = (text) => {
 
    setUsername(text);
    if (!text || text.length < 1) {
      setUsernameSubmitted(false);
    }
  };

  const handleEmailSubmit = () => {
    setEmailSubmitted(true);

    setTimeout(() => {
      if (passwordInputRef.current && username) {
        passwordInputRef.current.focus();
      }
    }, DELAY_BEFORE_FOCUS);
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    if (!text || text.length < 1) {
      setEmailSubmitted(false);
    }
  };

  const handleFirstPasswordSubmit = () => {
    setPasswordSubmitted(true);
    setTimeout(() => {
      if (verifyPasswordInputRef.current) {
        verifyPasswordInputRef.current.focus();
      }
    }, DELAY_BEFORE_FOCUS);
  };

  const handleFirstPasswordChange = (text) => {
    setPassword(text);
    if (!text || text.length < 1) {
      setPasswordSubmitted(false);
    }
  };

  const handleVerifyPasswordChange = (text) => {
    setVerifyPassword(text);
    setPasswordsMatch(text === password);
    // if (!text || text.length < 1) {
    //   setPasswordSubmitted(false);
    // }
  };

  const handleUsernameFocus = () => setIsUsernameFocused(true);
  const handleUsernameBlur = () => setIsUsernameFocused(false);

  const handleEmailFocus = () => setIsEmailFocused(true);
  const handleEmailBlur = () => setIsEmailFocused(false);

  const handlePasswordFocus = () => setIsPasswordFocused(true);
  const handlePasswordBlur = () => setIsPasswordFocused(false);

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
      {/* {signupMutation.isPending && (
        <View
          style={{
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
      )} */}

      {!signupMutation.isPending && (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={[{ flex: 1, padding: 10, width: "100%" }]}
        >
          <AuthScreenTopTray
            onBackPress={navigateBack}
            onRightPress={handleBackToSignIn}
            rightLabel="Go to sign in"
          />

          <AuthScreenHeader label={"Create new account"} />

          <View
            style={[styles.inputsContainer, { gap: INPUTS_GAP }]}
            accessible={true}
            accessibilityLabel="Form container"
          >
            <AuthInputWrapper
              condition={username}
              label={"Username"}
              children={
                <TextInput
                  style={[
                    styles.input,
                    isUsernameFocused && styles.inputFocused,
                  ]}
                  placeholder="Username"
                  placeholderTextColor={placeholderTextColor}
                  autoFocus={true}
                  onChangeText={handleUsernameChange}
                  value={username}
                  onSubmitEditing={() => handleUsernameSubmit()}
                  ref={usernameInputRef}
                  onFocus={handleUsernameFocus}
                  onBlur={handleUsernameBlur}
                  accessible={true}
                  accessibilityLabel="Username input"
                  accessibilityHint="Enter your username"
                  importantForAccessibility="yes"
                />
              }
            />

            {username && usernameSubmitted && (
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
                    placeholderTextColor={placeholderTextColor}
                    onChangeText={handleEmailChange}
                    value={email}
                    onSubmitEditing={handleEmailSubmit}
                    ref={emailInputRef}
                    onFocus={handleEmailFocus}
                    onBlur={handleEmailBlur}
                    accessible={true}
                    accessibilityLabel="Email input"
                    accessibilityHint="Enter your email address"
                    importantForAccessibility="yes"
                  />
                }
              />
            )}

            {email && emailSubmitted && (
              <AuthInputWrapper
                condition={password}
                label={"Password"}
                children={
                  <TextInput
                    style={[
                      styles.input,
                      isPasswordFocused && styles.inputFocused,
                    ]}
                    placeholder="Password"
                    placeholderTextColor={placeholderTextColor}
                    autoFocus={false} //true
                    secureTextEntry={true}
                    onChangeText={handleFirstPasswordChange}
                    onSubmitEditing={handleFirstPasswordSubmit}
                    value={password}
                    ref={passwordInputRef}
                    onFocus={handlePasswordFocus}
                    onBlur={handlePasswordBlur}
                    accessible={true}
                    accessibilityLabel="Password input"
                    accessibilityHint="Enter your password"
                    importantForAccessibility="yes"
                  />
                }
              />
            )}

            {password && passwordSubmitted && (
              <AuthInputWrapper
                condition={verifyPassword}
                label={"Verify password"}
                children={
                  <TextInput
                    style={[
                      styles.input,
                      isPasswordFocused && styles.inputFocused,
                      !passwordsMatch && {borderColor: 'red'}
                    ]}
                    ref={verifyPasswordInputRef}
                    placeholder="Verify Password"
                    placeholderTextColor={placeholderTextColor}
                    secureTextEntry={true}
                    onChangeText={handleVerifyPasswordChange}
                    value={verifyPassword}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    accessible={true}
                    accessibilityLabel="Verify Password input"
                    accessibilityHint="Re-enter your password for verification"
                    importantForAccessibility="yes"
                  />
                }
              />
            )}
          </View>

          {username && password && email && passwordsMatch && !isKeyboardVisible && (
            <View
              style={{
                width: "100%",
                paddingBottom: 20,
              }}
            >
              <SimpleBottomButton
                onPress={handleCreateAccount}
                title={"Create account"}
                borderRadius={10}
                backgroundColor={manualGradientColors.homeDarkColor}
                labelColor={manualGradientColors.lightColor}
              />
            </View>
          )}
        </KeyboardAvoidingView>
      )}
    </PreAuthSafeViewAndGradientBackground>
  );
};

const styles = StyleSheet.create({
  inputsContainer: {
    height: 200,
    width: "100%",
    fontFamily: "Poppins-Regular",

    justifyContent: "flex-start",
    flex: 1,
  },
  input: {
    fontFamily: "Poppins-Regular",
    // backgroundColor: "orange",
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
  smallInputHeader: {
    paddingLeft: 10,
    flexDirection: "row",
    height: "100%",
  },
  inputFocused: {
    fontFamily: "Poppins-Regular",
    borderWidth: 3,
  },
  toggleButton: {
    color: "black",
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    selfAlign: "center",
  },
});

export default ScreenNewAccount;
