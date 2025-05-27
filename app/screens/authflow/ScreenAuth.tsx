import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text, 
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { useUser } from "@/src/context/UserContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useMessage } from "@/src/context/MessageContext";

import { useNavigation } from "@react-navigation/native";
import { useRoute, RouteProp } from "@react-navigation/native";
import GradientBackground from "@/app/components/appwide/display/GradientBackground";
import { SafeAreaView } from "react-native-safe-area-context";

import PhoneStatusBar from "@/app/components/appwide/statusbar/PhoneStatusBar";
import SimpleBottomButton from "@/app/components/appwide/button/SimpleBottomButton";
import { AuthScreenParams } from "@/src/types/ScreenPropTypes";
 

const ScreenAuth = () => {
  const route = useRoute<RouteProp<Record<string, AuthScreenParams>, string>>();
  const createNewAccount = route.params?.createNewAccount ?? false;
  const { showMessage } = useMessage();
  const { themeStyles, gradientColors, manualGradientColors } =
    useGlobalStyle();
  const [showSignIn, setShowSignIn] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignInScreen, setSignInScreen] = useState(true);
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const { onSignin, signinMutation, onSignUp } = useUser();
  const usernameInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const verifyPasswordInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  // const [usernameInputVisible, setUsernameInputVisible] = useState(true);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const navigation = useNavigation();

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useLayoutEffect(() => {
    if (createNewAccount === true) {
      console.log("user wants to create new account");
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
      setPassword(null);
    }
  }, [signinMutation]);

  const handleAuthentication = async () => {
    let result;
    if (isSignInScreen) {
      try {
        showMessage(true, null, "Signing you in...");

        onSignin(username, password);
      } catch (error) {
        console.error(error);
        showMessage(true, null, `Error! Not signed in.`);
      }
    } else {
      if (password !== verifyPassword) {
        //alert("Passwords do not match!");
        showMessage(true, null, "Oops! Passwords do not match");
        return;
      }
      console.log("passwords match, sending data...");
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

    console.log("password input current");
  };

  const handleFirstPasswordSubmit = () => {
    // setUsernameInputVisible(false);
    if (verifyPasswordInputRef.current) {
      verifyPasswordInputRef.current.focus();
    }

    console.log("password input current");
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
    <>
      <PhoneStatusBar />
      <GradientBackground
        useFriendColors={false}
        startColor={manualGradientColors.darkColor}
        endColor={manualGradientColors.lightColor}
        reverse={false}
      >
        <SafeAreaView
          style={{
            width: "100%",
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            onPress={handleNavigateBackToWelcomeScreen}
            style={{
              height: 40,
              width: 40,
              alignItems: "center",
              justifyContent: "center",

              backgroundColor: manualGradientColors.homeDarkColor,
              borderRadius: 20, // Half of the height/width to create a circle
            }}
          >
            <Text style={{ fontSize: 18, color: "white", textAlign: "center" }}>
              x
            </Text>
          </TouchableOpacity>

          <>
            <View
              style={{
                height: 40,
                marginLeft: "2%",
                paddingTop: "3%",
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
          {!loading &&
            username &&
            password &&
            !isSignInScreen &&
            !isKeyboardVisible && (
              <View
                style={{
                  width: "100%",
                  position: "absolute",
                  bottom: 0,
                  paddingBottom: 60,
                  right: 0,
                }}
              >
                <SimpleBottomButton
                  onPress={handleAuthentication}
                  title={isSignInScreen ? "Sign in" : "Create account"}
                  shapeSource={require("@/app/assets/shapes/coffeecupdarkheart.png")}
                  shapeWidth={190}
                  shapeHeight={190}
                  shapePosition="left"
                  shapePositionValue={-48}
                  shapePositionVerticalValue={-23}
                  fontColor={themeStyles.genericText.color}
                  accessible={true}
                  accessibilityLabel={
                    isSignInScreen ? "Sign in button" : "Create account button"
                  }
                  accessibilityHint="Press to sign in or create an account"
                />
              </View>
            )}
          {!loading && username && password && isSignInScreen && (
            <>
              <View
                style={{
                  width: "100%",
                  position: "absolute",
                  bottom: 0,
                  paddingBottom: 60,
                  right: 0,
                }}
              >
                <SimpleBottomButton
                  onPress={handleAuthentication}
                  title={isSignInScreen ? "Sign in" : "Create account"}
                  fontColor={themeStyles.genericText.color}
                  accessible={true}
                  accessibilityLabel={
                    isSignInScreen ? "Sign in button" : "Create account button"
                  }
                  accessibilityHint="Press to sign in or create an account"
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
        </SafeAreaView>
      </GradientBackground>

      {showSignIn && (
        <View
          style={[
            {
              gap: 20,
              height: 200,
              width: "100%",
              fontFamily: "Poppins-Regular",
              bottom: 10,
              paddingHorizontal: "4%",
              position: "absolute",
              justifyContent: "flex-end",
              flex: 1,
              bottom: isKeyboardVisible ? 10 : "47%",
            },
          ]}
          accessible={true}
          accessibilityLabel="Form container"
        >
          <Text
            style={{
              color: "black",
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
                style={[styles.input, isPasswordFocused && styles.inputFocused]}
                ref={verifyPasswordInputRef}
                placeholder="Verify Password"
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
    </>
  );
};

const styles = StyleSheet.create({
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
