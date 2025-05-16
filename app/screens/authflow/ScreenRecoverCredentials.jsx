import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Dimensions,
  Keyboard,
  TouchableOpacity,
} from "react-native";
// import { useUser } from "@/src/context/UserContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useMessage } from "@/src/context/MessageContext";

import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
// import { useRoute } from "@react-navigation/native";

import {
  sendResetCodeEmail,
  verifyResetCodeEmail,
  resetPassword,
} from "@/src/calls/api";

import { SafeAreaView } from "react-native-safe-area-context";

import PhoneStatusBar from "@/app/components/appwide/statusbar/PhoneStatusBar";
import SimpleBottomButton from "@/app/components/appwide/button/SimpleBottomButton";

//a frienddate assistant for overwhelmed adults, and for people who just have a lot to talk about

const ScreenRecoverCredentials = () => {
  // const route = useRoute();
  // const createNewAccount = route.params?.createNewAccount ?? false;

  const { showMessage } = useMessage();
  const { themeStyles, gradientColors, manualGradientColors } =
    useGlobalStyle();
  const [showSignIn, setShowSignIn] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  // const [verifyPassword, setVerifyPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRequestCodeScreen, setIsRequestCodeScreen] = useState(true);
  const [isValidateCodeScreen, setIsValidateCodeScreen] = useState(false);
  // const [signUpSuccess, setSignUpSuccess] = useState(false);
  // const {
  //   onSignin,
  //   signinMutation,
  //   signupMutation,
  //   onSignUp,
  //   handleSignUp,
  //   reInitialize,
  // } = useUser();
  const usernameInputRef = useRef(null);
  const resetCodeRef = useRef(null);
  const newPasswordInputRef = useRef(null);
  // const verifyPasswordInputRef = useRef(null);
  const emailInputRef = useRef(null);
  // const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [usernameInputVisible, setUsernameInputVisible] = useState(true);
  const [isNewPasswordFocused, setIsNewPasswordFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isResetCodeFocused, setIsResetCodeFocused] = useState(false);
  const navigation = useNavigation();

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // const [confirmedUserNotSignedIn, setConfirmedUserNotSignedIn] =
  //   useState(false);

  // const [fontsLoaded] = useFonts({
  //   "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
  //   "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
  //   "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
  // });

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
    if (usernameInputRef.current) {
      setUsernameInputVisible(true);

      usernameInputRef.current.focus();
    }
  }, []);

  // const handleBackToSignIn = () => {
  //   // setShowSignIn(true);
  //   // setUsername("");
  //   // setEmail("");
  //   // setPassword("");
  //   // setVerifyPassword("");
  //   // setShowSignIn(true);
  //   // setSignInScreen(true);
  //   // setSignUpSuccess(false);
  //   // if (usernameInputRef.current) {
  //   //   setUsernameInputVisible(true);

  //   //   usernameInputRef.current.focus();
  //   // }
  //   setUsernameInputVisible(true);
  // };

  const handleSubmit = async () => {
    //need to do something to prevent double calling probably?
    if (!isRequestCodeScreen && !isValidateCodeScreen) {
      try {
        showMessage(true, null, `Resetting password for ${resetCode}`);
        const reset = await resetPassword({ email, resetCode, newPassword });

        showMessage(false, null, "Password reset successfully! Please log in.");

        handleNavigateBackToAuthScreen();
      } catch (error) {
        console.error(error);
        showMessage(true, null, `Error! Couldn't reset password.`);
      }
    }
    if (isRequestCodeScreen) {
      try {
        showMessage(true, null, "Sending email...");

        sendResetCodeEmail(email);
        setIsRequestCodeScreen(false);
        setIsValidateCodeScreen(true);
      } catch (error) {
        console.error(error);
        showMessage(true, null, `Error! Can't send email.`);
      }
    }
    setLoading(false);

    if (isValidateCodeScreen) {
      try {
        showMessage(
          true,
          null,
          `Checking reset code... ${resetCode}, ${email}`
        );
        const verify = await verifyResetCodeEmail({ email, resetCode });
        // console.log("Logging reply from validate code:", verify);
        // // Handle success response
        showMessage(false, null, "Reset code verified successfully!");
        setIsValidateCodeScreen(false);
      } catch (error) {
        console.error(error);
        showMessage(true, null, `Error! Couldn't verify reset code.`);
      }
    }
  };

  const handleNavigateBackToAuthScreen = () => {
    navigation.goBack();
  };

  // const handleUsernameSubmit = () => {
  //   setUsernameInputVisible(false);
  //   if (newPasswordInputRef.current && username) {
  //     newPasswordInputRef.current.focus();
  //   }

  //   console.log("password input current");
  // };

  // if (!fontsLoaded) {
  //   return null; // Or any other loading indicator if fonts are not yet loaded
  // }

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
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            onPress={handleNavigateBackToAuthScreen}
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
                onPress={handleNavigateBackToAuthScreen}
                accessible={true}
                accessibilityLabel="Toggle button"
                accessibilityHint="Press to toggle between sign in and create account"
              >
                {"Go to sign in"}
              </Text>
            </View>
          </>
          {!loading && (username || email) && !isKeyboardVisible && (
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
                onPress={handleSubmit}
                title={"Recover"}
                shapeSource={require("@/app/assets/shapes/coffeecupdarkheart.png")}
                shapeWidth={190}
                shapeHeight={190}
                shapePosition="left"
                shapePositionValue={-48}
                shapePositionVerticalValue={-23}
                fontColor={themeStyles.genericText.color}
                accessible={true}
                accessibilityLabel={"Submit button"}
                accessibilityHint="Press to recover username or reset password"
              />
            </View>
          )}

          {!loading && (username || email) && isRequestCodeScreen && (
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
                  onPress={handleSubmit}
                  title={isRequestCodeScreen ? "Sign in" : "Create account"}
                  fontColor={themeStyles.genericText.color}
                  accessible={true}
                  accessibilityLabel={
                    isRequestCodeScreen
                      ? "Sign in button"
                      : "Create account button"
                  }
                  accessibilityHint="Press to sign in or create an account"
                />
              </View>
            </>
          )}
        </SafeAreaView>
      </LinearGradient>

      {showSignIn && (
        <View
          style={[styles.form, { bottom: isKeyboardVisible ? 10 : "47%" }]}
          accessible={true}
          accessibilityLabel="Form container"
        >
          <Text style={styles.inputHeaderText} accessible={true}>
            {"Recover password"}
          </Text>

          {!isRequestCodeScreen && !isValidateCodeScreen && (
            <Text style={styles.inputSubHeaderText} accessible={true}>
              {"Reset code validated! Enter new password: "}
            </Text>
          )}

          {isRequestCodeScreen && (
            <Text style={styles.inputSubHeaderText} accessible={true}>
              {"Enter email associated with account: "}
            </Text>
          )}

          {isValidateCodeScreen && (
            <Text style={styles.inputSubHeaderText} accessible={true}>
              {
                "If an account with that email is found, you will be emailed a reset code shortly!"
              }
            </Text>
          )}

          {isRequestCodeScreen && (
            <View style={{ flexDirection: "column", width: "100%" }}>
              <TextInput
                style={[styles.input, isEmailFocused && styles.inputFocused]}
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
            </View>
          )}
          {/* <View style={{ flexDirection: "column", width: "100%" }}> 

            <TextInput
              style={[styles.input, isUsernameFocused && styles.inputFocused]}
              placeholder="Username"
              //autoFocus={true}
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
          </View> */}

          {isValidateCodeScreen && (
            <View style={{ flexDirection: "column", width: "100%" }}>
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
            </View>
          )}

          {!isRequestCodeScreen && !isValidateCodeScreen && (
            <View style={{ flexDirection: "column", width: "100%" }}>
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
            </View>
          )}
        </View>
      )}
    </>
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
    //backgroundColor: 'blue',
    justifyContent: "flex-end",
    flex: 1,
    // width: "100%",
    // right: 0,
  },
  input: {
    fontFamily: "Poppins-Regular",
    //fontWeight: 'bold',
    placeholderTextColor: "black",
    height: "auto",
    // borderBottomWidth: 3,
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
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    selfAlign: "center",
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
  xButtonText: {
    color: "black",
    fontSize: 30,
  },
});

export default ScreenRecoverCredentials;
