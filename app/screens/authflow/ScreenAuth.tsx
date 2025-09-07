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
const ScreenAuth = () => {
  const route = useRoute<RouteProp<Record<string, AuthScreenParams>, string>>();
  const usernameEntered = route.params?.usernameEntered ?? false;
  const { navigateToNewAccount, navigateBack, navigateToRecoverCredentials } =
    useAppNavigations();
  const { showSigninErrorMessage } = useMessageCentralizer();
  const { lightDarkTheme } = useLDTheme();
  const [username, setUsername] = useState(usernameEntered);
  const [password, setPassword] = useState("");

  const { refetch } = useUser();
  const { onSignIn, signinMutation } = useSignIn({ refetchUser: refetch });

  const usernameInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  // const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const placeholderTextColor = manualGradientColors.homeDarkColor;

  const INPUTS_GAP = 4;
  const DELAY_BEFORE_FOCUS = 300;

  const handleUsernameFocus = () => setIsUsernameFocused(true);
  const handleUsernameBlur = () => setIsUsernameFocused(false);

  const handlePasswordFocus = () => setIsPasswordFocused(true);
  const handlePasswordBlur = () => setIsPasswordFocused(false);

  const handleFocusUsername = () => {
    setTimeout(() => {
      if (usernameInputRef.current) {
        usernameInputRef.current.focus();
      }
    }, DELAY_BEFORE_FOCUS);
  };

  useFocusEffect(
    useCallback(() => {
      if (usernameEntered) {
        setUsername(usernameEntered);
        handleFocusUsername();
      }
    }, [usernameEntered])
  );

  useEffect(() => {
    if (signinMutation.isSuccess) {
      showFlashMessage(`Success!`, false, 3000);
    }
  }, [signinMutation.isSuccess]);

  // useEffect(() => {
  //   const keyboardDidShowListener = Keyboard.addListener(
  //     "keyboardDidShow",
  //     () => setIsKeyboardVisible(true)
  //   );
  //   const keyboardDidHideListener = Keyboard.addListener(
  //     "keyboardDidHide",
  //     () => setIsKeyboardVisible(false)
  //   );

  //   return () => {
  //     keyboardDidShowListener.remove();
  //     keyboardDidHideListener.remove();
  //   };
  // }, []);

  const handleCreateNew = () => {
    navigateToNewAccount({ usernameEntered: username });
  };

  useEffect(() => {
    if (signinMutation.isError) {
      showSigninErrorMessage();
      setPassword(null);
    }
  }, [signinMutation]);

  const handleAuthentication = async () => {
    console.log("signing user in");
    handlePasswordBlur();
    try {
      onSignIn(username, password);
    } catch (error) {
      console.error(error);
    }
  };

  const [usernameSubmitted, setUsernameSubmitted] = useState(false);

  const handleUsernameSubmit = () => {
    setUsernameSubmitted(true);
    setTimeout(() => {
      if (passwordInputRef.current && username) {
        passwordInputRef.current.focus();
      }
    }, DELAY_BEFORE_FOCUS);
  };

  const handleUsernameChange = (text) => {
    setUsername(text);
    if (!text || text.length < 1) {
      setUsernameSubmitted(false);
    }
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

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
      {signinMutation.isPending && (
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
      {!signinMutation.isPending && (
        // <KeyboardAvoidingView
        //   behavior={Platform.OS === "ios" ? "padding" : "height"}
        //   style={[{ flex: 1, padding: 10, width: "100%" }]}
        // >
        <View
          style={{ paddingHorizontal: 10, flex: 1, 
            // backgroundColor: "pink" 
          }}
        >
          <AuthScreenTopTray
            onBackPress={handleCreateNew}
            rightLabel={"Forgot password"}
            onRightPress={navigateToRecoverCredentials}
          />

          <AuthScreenHeader label={"Sign in"} />

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
                    { color: manualGradientColors.homeDarkColor },
                  ]}
                  placeholder="Username"
                  placeholderTextColor={placeholderTextColor}
                  autoFocus={true}
                  onChangeText={handleUsernameChange}
                  value={username}
                  onSubmitEditing={handleUsernameSubmit}
                  ref={usernameInputRef}
                  onPress={handleUsernameFocus}
                  onFocus={handleUsernameFocus}
                  onBlur={handleUsernameBlur}
                  accessible={true}
                  autoComplete={"username"}
                  accessibilityLabel="Username input"
                  accessibilityHint="Enter your username"
                  importantForAccessibility="yes"
                  enterKeyHint={"next"}
                />
              }
            />

            {username && usernameSubmitted && (
              <AuthInputWrapper
                condition={password}
                label={"Password"}
                children={
                  <TextInput
                    style={[
                      styles.input,
                      isPasswordFocused && styles.inputFocused,
                      { color: manualGradientColors.homeDarkColor },
                    ]}
                    placeholder="Password"
                    placeholderTextColor={placeholderTextColor}
                    // color={lightDarkTheme.primaryText}
                    autoFocus={false} //true
                    secureTextEntry={true}
                    onChangeText={handlePasswordChange}
                    onSubmitEditing={handleAuthentication}
                    autoComplete={"current-password"}
                    value={password}
                    ref={passwordInputRef}
                    onFocus={handlePasswordFocus}
                    onBlur={handlePasswordBlur}
                    accessible={true}
                    accessibilityLabel="Password input"
                    accessibilityHint="Enter your password"
                    importantForAccessibility="yes"
                    enterKeyHint={"enter"}
                  />
                }
              />
            )}
          </View>
        </View>
        // </KeyboardAvoidingView>
      )}
      <View
        style={{
          width: "100%",
          bottom: 0,
          paddingHorizontal: 4,
 
        }}
      >
        {username && password && !signinMutation.isPending && (
          <AuthBottomButton
            onPress={handleAuthentication}
            title={"Sign in"}
            borderRadius={10}
            backgroundColor={manualGradientColors.homeDarkColor}
            labelColor={manualGradientColors.lightColor}
          />
        )}
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

export default ScreenAuth;
