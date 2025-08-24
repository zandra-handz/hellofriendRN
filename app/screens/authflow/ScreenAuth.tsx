import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
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
import { useUserSettings } from "@/src/context/UserSettingsContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useNavigation } from "@react-navigation/native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PreAuthSafeViewAndGradientBackground from "@/app/components/appwide/format/PreAuthSafeViewAndGradBackground";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import SimpleBottomButton from "@/app/components/appwide/button/SimpleBottomButton";
import { AuthScreenParams } from "@/src/types/ScreenPropTypes";

import useMessageCentralizer from "@/src/hooks/useMessageCentralizer";
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";
import FSMainSpinner from "@/app/components/appwide/spinner/FSMainSpinner";
import useSignIn from "@/src/hooks/UserCalls/useSignIn";
import useSignUp from "@/src/hooks/UserCalls/useSignUp";
import LoadingPage from "@/app/components/appwide/spinner/LoadingPage";
const ScreenAuth = () => {
  const route = useRoute<RouteProp<Record<string, AuthScreenParams>, string>>();
  const createNewAccount = route.params?.createNewAccount ?? false;
const { selectedFriend } = useSelectedFriend();
const { settings } = useUserSettings();
  const { showSigninErrorMessage } = useMessageCentralizer();
  const {  themeStyles, manualGradientColors } = useGlobalStyle();
  const [showSignIn, setShowSignIn] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignInScreen, setSignInScreen] = useState(true);
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const {  refetch  } = useUser();
  const { onSignIn, signinMutation } = useSignIn({refetchUser: refetch});

  const { onSignUp } = useSignUp({signInNewUser: onSignIn});
  const [success, setSuccess] = useState(false);
  const usernameInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const verifyPasswordInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const [isUsernameFocused, setIsUsernameFocused] = useState(false); 
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const navigation = useNavigation();

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const placeholderTextColor =  manualGradientColors.homeDarkColor;

  useEffect(() => {
    if (signinMutation.isSuccess) {
      setSuccess(true);
      console.log(`sign in successful!`);
      showFlashMessage(`Success!`, false, 3000);
    }
  }, [signinMutation.isSuccess]);

 
  useLayoutEffect(() => {
    if (createNewAccount === true) {
      toggleMode();
    }
  }, [createNewAccount]);

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


  useEffect(() => {

  console.log(`signin mutation pending changed!`);
}, [signinMutation.isPending]);

  const toggleMode = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setVerifyPassword("");
    setSignInScreen(false);
    setSignUpSuccess(false);
    setTimeout(() => {
      handleCreateAccountInitialFocus();
    }, 100);
  };

  const handleBackToSignIn = () => {
    setShowSignIn(true);
    setUsername("");
    setEmail("");
    setPassword("");
    setVerifyPassword("");
    setShowSignIn(true);
    setSignInScreen(true);
    setSignUpSuccess(false);
  };

  useEffect(() => {
    if (signinMutation.isError) {
      showSigninErrorMessage();
      setPassword(null);
    }
  }, [signinMutation]);

  const handleAuthentication = async () => {
    let result;
    if (isSignInScreen) {
      console.log('signing user in');
      try {
        onSignIn(username, password);
      } catch (error) {
        console.error(error);
      }
    } else {
      if (password !== verifyPassword) { 
        return;
      }
      console.log('signing up new user');
      result = await onSignUp(username, email, password);
      if (result && result.status === 201) {
        alert("Sign up was successful!");
        setSignUpSuccess(true);
        setLoading(false);
        navigation.navigate("Auth");
      } else if (result && result.error) {
        alert("Error: " + result.error);
      }
    }
    setLoading(false);
  };

  const handleNavigateBackToWelcomeScreen = () => {
    navigation.goBack();
  };

  const handleUsernameSubmit = () => {
    // setUsernameInputVisible(false);
    if (passwordInputRef.current && username) {
      passwordInputRef.current.focus();
    }
  };

  const handleFirstPasswordSubmit = () => {
    // setUsernameInputVisible(false);
    if (verifyPasswordInputRef.current) {
      verifyPasswordInputRef.current.focus();
    }
  };

  const handleCreateAccountInitialFocus = () => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  };

  const handleEmailSubmit = () => {
    if (usernameInputRef.current) {
      usernameInputRef.current.focus();
    }
  };

  return (
    <PreAuthSafeViewAndGradientBackground
    settings={settings}
      startColor={manualGradientColors.darkColor}
      endColor={manualGradientColors.lightColor}
      friendColorLight={null}
      friendColorDark={null}
      friendId={selectedFriend?.id}
      backgroundOverlayColor={themeStyles.primaryBackground.backgroundColor}
      style={{
        flex: 1,
      }}
    >

      {signinMutation.isPending && (
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
          color={'yellow'}

        />

                </View>

      )}
      {!signinMutation.isPending && (
        
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[{ flex: 1, paddingHorizontal: 10, width: '100%' }]}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            height: 50,
            alignItems: "center",
            // paddingHorizontal: 10, // doing in keyboard avoiding view
          }}
        >
          <Pressable
            onPress={handleNavigateBackToWelcomeScreen}
            style={{
              height: 32,
              width: 32,
              alignItems: "center",
              justifyContent: "center",
              alignContent: "center",

              flexDirection: "column",

              backgroundColor: manualGradientColors.homeDarkColor,
              borderRadius: 20, // Half of the height/width to create a circle
            }}
          >
            <MaterialCommunityIcons
              name={"arrow-left"}
              size={16}
              color={manualGradientColors.lightColor}
            />
          </Pressable>

          <>
            <View
              style={{
                height: "100%",
                justifyContent: "center",
              }}
            >
              <Text
                style={styles.toggleButton}
                onPress={isSignInScreen ? toggleMode : handleBackToSignIn}
                accessible={true}
                accessibilityLabel="Toggle button"
                accessibilityHint="Press to toggle between sign in and create account"
              >
                {isSignInScreen ? "Create new account?" : "Go to sign in"}
              </Text>
            </View>
          </>
        </View>

       

        {showSignIn && !success && (
          <View
            style={[
              {
                gap: 20,
                height: 200,
                width: "100%",
                fontFamily: "Poppins-Regular",
                // paddingHorizontal: 10, // doing in keyboard avoiding view
                paddingTop: 30, 
                justifyContent: "flex-start",
                flex: 1,
                // bottom: isKeyboardVisible ? 10 : "47%",
              },
            ]}
            accessible={true}
            accessibilityLabel="Form container"
          >
            <Text
              style={{
                color: manualGradientColors.darkHomeColor,
                fontFamily: "Poppins-Bold",
                fontSize: 16,
                selfAlign: "center",
              }}
              accessible={true}
            >
              {isSignInScreen ? "Sign in" : "Create new account"}
            </Text>
            {!isSignInScreen && (
              <View style={{ flexDirection: "column", width: "100%" }}>
                <TextInput
                  style={[styles.input, isEmailFocused && styles.inputFocused]}
                  placeholder="Email"
                  placeholderTextColor={placeholderTextColor}
                  onChangeText={(text) => setEmail(text)}
                  value={email}
                  onSubmitEditing={handleEmailSubmit}
                  ref={emailInputRef}
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setIsEmailFocused(false)}
                  accessible={true}
                  accessibilityLabel="Email input"
                  accessibilityHint="Enter your email address"
                  importantForAccessibility="yes"
                />
              </View>
            )}
            <View style={{ flexDirection: "column", width: "100%" }}>
              <TextInput
                style={[styles.input, isUsernameFocused && styles.inputFocused]}
                placeholder="Username"
                  placeholderTextColor={placeholderTextColor}
                autoFocus={true}
                onChangeText={(text) => setUsername(text)}
                value={username}
                onSubmitEditing={() => handleUsernameSubmit()}
                ref={usernameInputRef}
                onFocus={() => setIsUsernameFocused(true)}
                onBlur={() => setIsUsernameFocused(false)}
                accessible={true}
                accessibilityLabel="Username input"
                accessibilityHint="Enter your username"
                importantForAccessibility="yes"
              />
            </View>

            <View style={{ flexDirection: "column", width: "100%" }}>
              <TextInput
                style={[styles.input, isPasswordFocused && styles.inputFocused]}
                placeholder="Password"
                  placeholderTextColor={placeholderTextColor}
                autoFocus={false} //true
                secureTextEntry={true}
                onChangeText={(text) => setPassword(text)}
                onSubmitEditing={
                  isSignInScreen
                    ? handleAuthentication
                    : handleFirstPasswordSubmit
                }
                value={password}
                ref={passwordInputRef}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                accessible={true}
                accessibilityLabel="Password input"
                accessibilityHint="Enter your password"
                importantForAccessibility="yes"
              />
            </View>

            {isSignInScreen && (
              <View style={{ flexDirection: "row", width: "100%" }}>
                <Text
                  style={styles.toggleButton}
                  onPress={() => navigation.navigate("RecoverCredentials")}
                  accessible={true}
                  accessibilityLabel="Toggle button"
                  accessibilityHint="Press to toggle between sign in and create account"
                >
                  {"Forgot username or password"}
                </Text>
              </View>
            )}
            {!isSignInScreen && (
              <View style={{ flexDirection: "column", width: "100%" }}>
                <TextInput
                  style={[
                    styles.input,
                    isPasswordFocused && styles.inputFocused,
                  ]}
                  ref={verifyPasswordInputRef}
                  placeholder="Verify Password"
                    placeholderTextColor={placeholderTextColor}
                  secureTextEntry={true}
                  onChangeText={(text) => setVerifyPassword(text)}
                  value={verifyPassword}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  accessible={true}
                  accessibilityLabel="Verify Password input"
                  accessibilityHint="Re-enter your password for verification"
                  importantForAccessibility="yes"
                />
              </View>
            )}
          </View>
        )}

        {!loading &&
          username &&
          password &&
          !isSignInScreen &&
          !isKeyboardVisible && (
            <View
              style={{
                width: "100%",
              paddingBottom: 20,
                // position: "absolute",
                // bottom: 0,
                // paddingBottom: 10,
                // right: 0,
              }}
            >
              <SimpleBottomButton
                onPress={handleAuthentication}
                title={isSignInScreen ? "Sign in" : "Create account"}
                borderRadius={10}
                backgroundColor={manualGradientColors.homeDarkColor}
                labelColor={manualGradientColors.lightColor}
              />
            </View>
          )}
         {!loading && username && password && isSignInScreen && (
          <>
            <View
              style={{
                width: "100%",
                // position: "absolute",
                // bottom: 0,
                  //  backgroundColor: 'teal',
                   paddingBottom: 20,
                // paddingBottom: 60,
                // right: 0,
              }}
            >
              <SimpleBottomButton
                onPress={handleAuthentication}
                title={isSignInScreen ? "Sign in" : "Create account"}
                borderRadius={10}
                backgroundColor={manualGradientColors.homeDarkColor}
                labelColor={manualGradientColors.lightColor}
              />
            </View>

            {signUpSuccess && (
              <Text
                style={{
                  marginTop: 10,
                  color: "green",
                  textAlign: "center",
                  fontFamily: "Poppins-Regular",
                }}
                accessible={true}
                accessibilityLabel="Sign up success message"
                accessibilityHint="Message indicating sign up was successful"
              >
                Sign up successful! Please log in.
              </Text>
            )}
          </>
        )}
      </KeyboardAvoidingView>
      
      )}
    </PreAuthSafeViewAndGradientBackground>
  );
};

const styles = StyleSheet.create({
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
