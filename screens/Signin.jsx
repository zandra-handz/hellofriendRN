import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Dimensions,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView, 
  Platform,
} from "react-native";
import { useAuthUser } from "../context/AuthUserContext";
import { useGlobalStyle } from "../context/GlobalStyleContext";
import { useMessage } from "../context/MessageContext";
import ButtonColorHighlight from "../components/ButtonColorHighlight";
import { useFonts } from "expo-font";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import Logo from "../components/Logo";
import { LinearGradient } from "expo-linear-gradient";

import { SafeAreaView } from "react-native-safe-area-context";

import PhoneStatusBar from "../components/PhoneStatusBar";

//a frienddate assistant for overwhelmed adults, and for people who just have a lot to talk about

const TOKEN_KEY = "my-jwt";

const Signin = () => {
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
  const {
    onSignin,
    signinMutation,
    signupMutation,
    onSignUp,
    handleSignUp,
    reInitialize,
  } = useAuthUser();
  const usernameInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const verifyPasswordInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [usernameInputVisible, setUsernameInputVisible] = useState(true);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const navigation = useNavigation();

  const [confirmedUserNotSignedIn, setConfirmedUserNotSignedIn] =
    useState(false);

  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
  });

  useEffect(() => {
    if (usernameInputRef.current) {
      setUsernameInputVisible(true);

      usernameInputRef.current.focus();
    }
  }, []);

  const dismissKeyboard = (e) => {
    // Prevents dismissing the keyboard, I don't like this approach
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => {
    checkIfSignedIn();
  }, []);

  const toggleMode = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setVerifyPassword("");
    setSignInScreen(false);
    setSignUpSuccess(false);
    setUsernameInputVisible(true);

    // Delay the focus function by 500ms (for example)
    setTimeout(() => {
      handleCreateAccountInitialFocus();
    }, 100); // Delay in milliseconds (500ms = 0.5 seconds)
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
    if (usernameInputRef.current) {
      setUsernameInputVisible(true);

      usernameInputRef.current.focus();
    }
    setUsernameInputVisible(true);
  };

  useEffect(() => {
    if (signinMutation.isError) {
      setPassword(null);
      console.log("useeffect for sign in mutation error");
      setUsernameInputVisible(true);

      if (usernameInputRef.current) {
        setUsernameInputVisible(true);
        usernameInputRef.current.focus();
      }
    }
  }, [signinMutation]);

  const checkIfSignedIn = async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) {
        console.log(token);
        showMessage(true, null, "Reinitializing...");
        reInitialize();
        // Optionally, handle any other logic needed after re-initialization
      } else {
        // No token found, show sign in
        setShowSignIn(true);
        setConfirmedUserNotSignedIn(true);
        showMessage(true, null, "Signed out");
      }
    } catch (error) {
      console.error("Error checking sign-in status", error);
      // Handle errors as necessary
    }
  };

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
        alert("Passwords do not match!");
        showMessage(true, null, "Oops! Passwords do not match");
        return;
      }
      console.log("passwords match, sending data...");
      result = await onSignUp(username, email, password);
      if (result && result.status === 201) {
        alert("Sign up was successful!");
        setSignUpSuccess(true);
        setLoading(false);
        navigation.navigate("Signin");
      } else if (result && result.error) {
        alert("Error: " + result.error);
      }
    }
    setLoading(false);
  };

  const handleUsernameSubmit = () => {
    setUsernameInputVisible(false);
    if (passwordInputRef.current) {
      passwordInputRef.current.focus();
    }

    console.log("password input current");
  };

  const handleFirstPasswordSubmit = () => {
    setUsernameInputVisible(false);
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

  if (!fontsLoaded) {
    return null; // Or any other loading indicator if fonts are not yet loaded
  }

  return (
    <>
      <PhoneStatusBar />
      <LinearGradient
        colors={[
          manualGradientColors.darkColor,
          manualGradientColors.lightColor,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.container]}
      >
        <SafeAreaView
          style={{
            width: "100%", 
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* <TouchableWithoutFeedback onPress={dismissKeyboard}> */}
          <>
            {confirmedUserNotSignedIn && (
              <>
                <View style={{ width: "100%", paddingTop: "12%" }}>
                  <Logo
                    accessible={true} //field not in component
                    accessibilityLabel="App Logo" //field not in component
                    accessibilityHint="This is the logo of the app" //field not in component
                  />
                  <View
                    style={{
                      marginTop: "14%",
                      paddingHorizontal: "4%",
                      zIndex: 1000,
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      width: "100%",
                    }}
                  >
                    <Text
                      style={styles.toggleButton}
                      onPress={isSignInScreen ? toggleMode : handleBackToSignIn}
                      accessible={true}
                      accessibilityLabel="Toggle button"
                      accessibilityHint="Press to toggle between sign in and create account"
                    >
                      {isSignInScreen ? "Create account" : "Back to sign in"}
                    </Text>
                  </View>
                </View>
                <KeyboardAvoidingView
  behavior={Platform.OS === "ios" ? "padding" : undefined}
  style={{ flex: 1  }} >
 
                {showSignIn && (
                  <View
                    style={styles.form}
                    accessible={true}
                    accessibilityLabel="Form container"
                  >
                    {!isSignInScreen && usernameInputVisible && (
                      <View style={{ flexDirection: "column", width: "100%" }}>
                        <Text style={styles.inputTitleTextAndPadding}>
                          Email
                        </Text>
                        <TextInput
                          style={[
                            styles.input,
                            isEmailFocused && styles.inputFocused,
                          ]}
                          placeholder="Email"
                          placeholderTextColor={"gray"}
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
                                        {isSignInScreen && (
                      <View style={{ flexDirection: "column", width: "100%", height: '29%' }}>
                         {/* MANUAL SPACER BECAUSE USERNAME AND PASSWORD FLY UP WITHOUT EMAIL INPUT TO PUSH IT DOWN UGH */}
                      </View>
                    )}
                    {usernameInputVisible && (
                      <View style={{ flexDirection: "column", width: "100%" }}>
                        <Text style={styles.inputTitleTextAndPadding}>
                          Username
                        </Text>

                        <TextInput
                          style={[
                            styles.input,
                            isUsernameFocused && styles.inputFocused,
                          ]}
                          placeholder="Username"
                          autoFocus={true}
                          placeholderTextColor={"gray"}
                          onChangeText={(text) => setUsername(text)}
                          value={username}
                          onSubmitEditing={handleUsernameSubmit}
                          ref={usernameInputRef}
                          onFocus={() => setIsUsernameFocused(true)}
                          onBlur={() => setIsUsernameFocused(false)}
                          accessible={true}
                          accessibilityLabel="Username input"
                          accessibilityHint="Enter your username"
                          importantForAccessibility="yes"
                        />
                      </View>
                    )}

                    {username && !usernameInputVisible && (
                      <View style={{ flexDirection: "column", width: "100%" }}>
                        <Text style={styles.inputTitleTextAndPadding}>
                          Password
                        </Text>
                        <TextInput
                          style={[
                            styles.input,
                            isPasswordFocused && styles.inputFocused,
                          ]}
                          placeholder="Password"
                          autoFocus={true}
                          placeholderTextColor={"gray"}
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
                                            {!loading && username && password && (
                      <>
                        <View
                          style={{
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            width: "40%",
                            flex: 1,
                            zIndex: 1000,
                          }}
                        >
                          <ButtonColorHighlight
                            onPress={handleAuthentication}
                            title={
                              isSignInScreen ? "Sign in" : "Create account"
                            }
                            shapeSource={require("../assets/shapes/coffeecupdarkheart.png")}
                            shapeWidth={190}
                            shapeHeight={190}
                            shapePosition="left"
                            shapePositionValue={-48}
                            shapePositionVerticalValue={-23}
                            fontColor={themeStyles.genericText.color}
                            accessible={true}
                            accessibilityLabel={
                              isSignInScreen
                                ? "Sign in button"
                                : "Create account button"
                            }
                            accessibilityHint="Press to sign in or create an account"
                          />
                        </View>

                        {signUpSuccess && (
                          <Text
                            style={styles.successMessage}
                            accessible={true}
                            accessibilityLabel="Sign up success message"
                            accessibilityHint="Message indicating sign up was successful"
                          >
                            Sign up successful! Please log in.
                          </Text>
                        )}
                      </>
                    )}
                      </View>
                    )}
                    {!isSignInScreen && username && !usernameInputVisible && (
                      <View style={{ flexDirection: "column", width: "100%" }}>
                        <Text style={styles.inputTitleTextAndPadding}>
                          Verify Password
                        </Text>
                        <TextInput
                          style={[
                            styles.input,
                            isPasswordFocused && styles.inputFocused,
                          ]}
                          ref={verifyPasswordInputRef}
                          placeholder="Verify Password"
                          placeholderTextColor={"gray"}
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
                                            {!loading && username && password && (
                      <>
                        <View
                          style={{
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            width: "40%",
                            flex: 1,
                            zIndex: 1000,
                          }}
                        >
                          <ButtonColorHighlight
                            onPress={handleAuthentication}
                            title={
                              isSignInScreen ? "Sign in" : "Create account"
                            }
                            shapeSource={require("../assets/shapes/coffeecupdarkheart.png")}
                            shapeWidth={190}
                            shapeHeight={190}
                            shapePosition="left"
                            shapePositionValue={-48}
                            shapePositionVerticalValue={-23}
                            fontColor={themeStyles.genericText.color}
                            accessible={true}
                            accessibilityLabel={
                              isSignInScreen
                                ? "Sign in button"
                                : "Create account button"
                            }
                            accessibilityHint="Press to sign in or create an account"
                          />
                        </View>

                        {signUpSuccess && (
                          <Text
                            style={styles.successMessage}
                            accessible={true}
                            accessibilityLabel="Sign up success message"
                            accessibilityHint="Message indicating sign up was successful"
                          >
                            Sign up successful! Please log in.
                          </Text>
                        )}
                      </>
                    )}
                      </View>
                    )}

                  </View>
                )}
                </KeyboardAvoidingView>
              </>
            )}
          </>
          {/* </TouchableWithoutFeedback> */}
        </SafeAreaView>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  form: {
    gap: 10,
    width: "100%",
    fontFamily: "Poppins-Regular",
    // bottom: "54%",
    // position: "absolute",
    // width: "100%",
    // right: 0,
  },
  input: {
    //backgroundColor:'#121212',

    fontFamily: "Poppins-Regular",
    placeholderTextColor: "lightgray",
    height: "auto",
    //borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 1,
    padding: 10,
    paddingTop: 14,
    //borderRadius: 10,
    alignContent: "center",
    justifyContent: "center",
    fontFamily: "Poppins-Regular",
    fontSize: 20,
  },
  inputFocused: {
    borderColor: "orange",
    borderBottomWidth: 1,
  },
  container: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,

    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height + 100,
    justifyContent: "space-between",

    alignItems: "center",
    width: "100%",
    paddingHorizontal: "3%",
  },
  title: {
    fontSize: 62,
    marginBottom: 10,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
  },
  inputTitleTextAndPadding: {
    paddingLeft: "3%",
    //paddingBottom: "2%",
    fontSize: 18,
    fontWeight: "bold",
  },
  appDescription: {
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
  toggleButton: {
    color: "black",
    marginTop: 2,
    textAlign: "center",
    //fontFamily: 'Poppins-Bold',
    fontWeight: "bold",
    fontSize: 16,
    lineHeight: 21,
  },
  spinnerContainer: {
    ...StyleSheet.absoluteFillObject, // Cover the entire screen
    backgroundColor: "transparent", // Semi-transparent background
    justifyContent: "center",
    alignItems: "center",
  },
  successMessage: {
    marginTop: 10,
    color: "green",
    textAlign: "center",
    fontFamily: "Poppins-Regular",
  },
});

export default Signin;
