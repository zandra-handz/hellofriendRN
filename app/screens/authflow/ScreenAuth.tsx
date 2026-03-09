 
import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { View, StyleSheet, Keyboard, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useSharedValue, withTiming } from "react-native-reanimated";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";
import useSignIn from "@/src/hooks/UserCalls/useSignIn";
import useSignUp from "@/src/hooks/UserCalls/useSignUp";
import useUser from "@/src/hooks/useUser";
import { useLDTheme } from "@/src/context/LDThemeContext";
import { showSpinner, hideSpinner } from "@/app/components/appwide/button/showSpinner";
import AppCustomSpinner from "@/app/components/appwide/format/AppCustomSpinner";
import LocalSolidSpinner from "@/app/components/appwide/spinner/LocalSolidSpinner";
import OptionInput from "@/app/components/headers/OptionInput";
import BouncyEntrance from "@/app/components/headers/BouncyEntrance";
import SafeViewAppDefault from "@/app/components/appwide/format/SafeViewAppDefault";
import AuthScreenTray from "./AuthScreenTray";
import AuthScreenHeader from "@/app/components/user/AuthScreenHeader";
import AuthBottomButton from "@/app/components/appwide/button/AuthBottomButton";
import AnimatedReverseBackdrop from "@/app/components/appwide/format/AnimatedReverseBackdrop";
import StaticBackdrop from "@/app/components/appwide/format/StaticBackdrop";
import LocalPeacefulGradientSpinner from "@/app/components/appwide/spinner/LocalPeacefulGradientSpinner";

import manualGradientColors from "@/app/styles/StaticColors";
import { AppFontStyles } from "@/app/styles/AppFonts";
import App from "@/App";

const MODE_SIGNIN = "signin";
const MODE_CREATE = "create";

const ScreenAuth = ({ onAuthSuccess, navigation, route }) => {
  const usernameEntered = route.params?.usernameEntered ?? "";
  const initialMode = route.params?.createNewAccount ?? MODE_SIGNIN;
  const prevScreenHasBackdrop = route.params?.prevScreenBackdrop ?? false;
  const triggerReverseBackdrop = route.params?.triggerReverseBackdrop ?? false;

  const { lightDarkTheme } = useLDTheme();
  const { refetch, isInitializing } = useUser();
  const { navigateToWelcome, navigateToRecoverCredentials } = useAppNavigations();

  const ActivateBackdrop = useSharedValue(prevScreenHasBackdrop ? 1 : 0);
  const ReverseBackdrop = useSharedValue(triggerReverseBackdrop ? 1 : 0);

  const backgroundColor = lightDarkTheme.primaryBackground;

  useEffect(() => {
    if (!prevScreenHasBackdrop) {
      ActivateBackdrop.value = withTiming(1, { duration: 600 });
    }
  }, []);

  useEffect(() => {
    if (triggerReverseBackdrop) {
      ReverseBackdrop.value = withTiming(1, { duration: 600 });
    }
  }, []);

  const [mode, setMode] = useState(initialMode);
  const isSignIn = mode === MODE_SIGNIN;

  const [username, setUsername] = useState(usernameEntered);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");

  const [usernameSubmitted, setUsernameSubmitted] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [passwordSubmitted, setPasswordSubmitted] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  const [focusedField, setFocusedField] = useState(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const usernameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const verifyPasswordInputRef = useRef(null);
  const scrollRef = useRef(null);

  const DELAY = 300;
  const INPUT_HEIGHT = 70;
  const INPUT_GAP = 4;
  const BOUNCE_SPEED = 60;

  const textColor = manualGradientColors.lightColor;
  const darkColor = manualGradientColors.homeDarkColor;
  const inputTextStyle = AppFontStyles.subWelcomeText;

  const { onSignIn, signinMutation } = useSignIn({ refetchUser: onAuthSuccess ?? refetch });
  const { onSignUp, signupMutation } = useSignUp({ signInNewUser: onSignIn });

const [isNavigating, setIsNavigating] = useState(false);

 

const isPending = isInitializing || isNavigating || signinMutation.isPending || signinMutation.isLoading || signupMutation.isPending;



// 0=tray, 1=header, 2=username, 3=password (signin) / email (create), 4=password (create), 5=verify (create)
  const staggeredDelays = useMemo(() => {
    const count = isSignIn ? 4 : 6;
    return Array.from({ length: count }, (_, i) => i * BOUNCE_SPEED);
  }, [isSignIn]);

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () => setIsKeyboardVisible(true));
    const hide = Keyboard.addListener("keyboardDidHide", () => setIsKeyboardVisible(false));
    return () => { show.remove(); hide.remove(); };
  }, []);

useEffect(() => {
  if (signinMutation.isSuccess) {
    showFlashMessage("Success!", false, 2000);
    setIsNavigating(true);
  }
}, [signinMutation.isSuccess]);
  useEffect(() => {
    if (signinMutation.isError) {
      showFlashMessage("Oops! Couldn't sign in", true, 2000);
      setPassword("");
    }
  }, [signinMutation.isError]);

  const focusUsername = () => {
    setTimeout(() => {
      usernameInputRef.current?.focus();
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }, DELAY);
  };

  useFocusEffect(
    useCallback(() => {
      if (!signinMutation.isSuccess) {
        setUsername(usernameEntered || "");
        focusUsername();
      }
    }, [usernameEntered, signinMutation.isSuccess])
  );

  const switchMode = (newMode) => {
    setMode(newMode);
    setEmail("");
    setPassword("");
    setVerifyPassword("");
    setUsernameSubmitted(false);
    setEmailSubmitted(false);
    setPasswordSubmitted(false);
    setPasswordsMatch(false);
    setFocusedField(null);
    setTimeout(() => focusUsername(), DELAY);
  };

  const focusNextInput = (index, inputRef) => {
    if (!inputRef.current) return;
    inputRef.current.focus();
    scrollRef.current?.scrollTo({ y: index * (INPUT_HEIGHT + INPUT_GAP), animated: true });
  };

  const handleUsernameSubmit = () => {
    setUsernameSubmitted(true);
    if (isSignIn) {
      setTimeout(() => focusNextInput(1, passwordInputRef), DELAY);
    } else {
      setTimeout(() => focusNextInput(1, emailInputRef), DELAY);
    }
  };

  const handleEmailSubmit = () => {
    setEmailSubmitted(true);
    setTimeout(() => focusNextInput(2, passwordInputRef), DELAY);
  };

  const handleFirstPasswordSubmit = () => {
    setPasswordSubmitted(true);
    setTimeout(() => focusNextInput(3, verifyPasswordInputRef), DELAY);
  };

  const handleUsernameChange = (text) => {
    setUsername(text);
    if (!text) setUsernameSubmitted(false);
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    if (!text) setEmailSubmitted(false);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    if (!text) setPasswordSubmitted(false);
  };

  const handleVerifyPasswordChange = (text) => {
    setVerifyPassword(text);
    setPasswordsMatch(text === password);
  };

  const handleSignIn = async () => {
    try {
      onSignIn(username, password);
    } catch (e) {
      console.error(e);
    }
  };
const handleCreateAccount = async () => {
  if (password !== verifyPassword) return;
  const result = await onSignUp(username, email, password);
  if (result?.status === 201) {
    showFlashMessage("Account created!", false, 2000);
    setIsNavigating(true);
  } else if (result?.error) {
    showFlashMessage("Error: " + result.error, true, 2000);
  }
};

  const canSubmitSignIn = username && password && !isPending;
  const canSubmitCreate = username && email && password && passwordsMatch && !isPending && !isKeyboardVisible;

  const activeInputProps = {
    textStyle: inputTextStyle,
    buttonPadding: 4,
    primaryColor: textColor,
    backgroundColor: backgroundColor,
    buttonColor: textColor,
  };

  return (
    <>
{/* 
    {isPending && (
      <AppCustomSpinner
      backgroundColor={
        backgroundColor
      }
      color1={manualGradientColors.lightColor}
      color2={manualGradientColors.darkColor}
      />
    )} */}
{isPending ? showSpinner(backgroundColor) : hideSpinner()}

      <SafeViewAppDefault customStatusIsDarkMode={true} style={styles.container}>
        <StaticBackdrop
          color={backgroundColor}
          zIndex={0}
          isVisibleValue={ActivateBackdrop}
          startsVisible={true}
        />

        {triggerReverseBackdrop && (
          <AnimatedReverseBackdrop
            color={backgroundColor}
            isVisibleValue={ReverseBackdrop}
          />
        )}

        {!isPending && (
          <View style={styles.outerContainer}>
            <BouncyEntrance delay={staggeredDelays[0]} style={{ width: "100%" }}>
              <AuthScreenTray
                onBackPress={() => switchMode(isSignIn ? MODE_CREATE : MODE_SIGNIN)}
                rightLabel={isSignIn ? "Forgot password" : null}
                onRightPress={isSignIn ? navigateToRecoverCredentials : null}
                onHomePress={navigateToWelcome}
                iconColor={manualGradientColors.lightColor}
              />
            </BouncyEntrance>

            <BouncyEntrance delay={staggeredDelays[1]} style={{ width: "100%" }}>
              <AuthScreenHeader
                color={textColor}
                label={isSignIn ? "Sign in" : "Create new account"}
              />
            </BouncyEntrance>

            <View style={styles.inputsContainer}>
              <ScrollView
                ref={scrollRef}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 280 }}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.inputRow}>
                  <BouncyEntrance delay={staggeredDelays[2]} style={{ width: "100%" }}>
                    <OptionInput
                      {...activeInputProps}
                      inputRef={usernameInputRef}
                      value={username}
                      onChangeText={handleUsernameChange}
                      placeholder="Username"
                      autoComplete="username"
                      enterKeyHint="next"
                      autoFocus={!isSignIn}
                      onSubmitEditing={handleUsernameSubmit}
                      onFocus={() => setFocusedField("username")}
                      onBlur={() => setFocusedField(null)}
                      accessibilityLabel="Username input"
                      accessibilityHint="Enter your username"
                    />
                  </BouncyEntrance>
                </View>

                {!isSignIn && username && usernameSubmitted && (
                  <View style={styles.inputRow}>
                    <BouncyEntrance delay={staggeredDelays[3]} style={{ width: "100%" }}>
                      <OptionInput
                        {...activeInputProps}
                        inputRef={emailInputRef}
                        value={email}
                        onChangeText={handleEmailChange}
                        placeholder="Email"
                        inputMode="email"
                        keyboardType="email-address"
                        enterKeyHint="next"
                        onSubmitEditing={handleEmailSubmit}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                        accessibilityLabel="Email input"
                        accessibilityHint="Enter your email address"
                      />
                    </BouncyEntrance>
                  </View>
                )}

                {((isSignIn && username && usernameSubmitted) ||
                  (!isSignIn && email && emailSubmitted)) && (
                  <View style={styles.inputRow}>
                    <BouncyEntrance delay={staggeredDelays[isSignIn ? 3 : 4]} style={{ width: "100%" }}>
                      <OptionInput
                        {...activeInputProps}
                        inputRef={passwordInputRef}
                        value={password}
                        onChangeText={handlePasswordChange}
                        placeholder="Password"
                        secureTextEntry={true}
                        autoComplete={isSignIn ? "current-password" : "new-password"}
                        enterKeyHint={isSignIn ? "enter" : "next"}
                        onSubmitEditing={isSignIn ? handleSignIn : handleFirstPasswordSubmit}
                        onFocus={() => setFocusedField("password")}
                        onBlur={() => setFocusedField(null)}
                        accessibilityLabel="Password input"
                        accessibilityHint="Enter your password"
                      />
                    </BouncyEntrance>
                  </View>
                )}

                {!isSignIn && password && passwordSubmitted && (
                  <View style={styles.inputRow}>
                    <BouncyEntrance delay={staggeredDelays[5]} style={{ width: "100%" }}>
                      <OptionInput
                        {...activeInputProps}
                        primaryColor={!passwordsMatch && verifyPassword ? "red" : textColor}
                        buttonColor={!passwordsMatch && verifyPassword ? "red" : textColor}
                        inputRef={verifyPasswordInputRef}
                        value={verifyPassword}
                        onChangeText={handleVerifyPasswordChange}
                        placeholder="Verify Password"
                        secureTextEntry={true}
                        onSubmitEditing={handleCreateAccount}
                        onFocus={() => setFocusedField("verify")}
                        onBlur={() => setVerifyPassword("")}
                        accessibilityLabel="Verify Password input"
                        accessibilityHint="Re-enter your password for verification"
                      />
                    </BouncyEntrance>
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        )}

        <View style={styles.bottomButtonWrapper}>
          {isSignIn && canSubmitSignIn && (
            <AuthBottomButton
              onPress={handleSignIn}
              title="Sign in"
              borderRadius={10}
              backgroundColor={darkColor}
              labelColor={textColor}
            />
          )}
          {!isSignIn && canSubmitCreate && (
            <AuthBottomButton
              onPress={handleCreateAccount}
              title="Create account"
              borderRadius={10}
              backgroundColor={darkColor}
              labelColor={textColor}
            />
          )}
        </View>
      </SafeViewAppDefault>
    </>
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

export default ScreenAuth;