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
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
 
import { useFriendStyle } from "@/src/context/FriendStyleContext";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useLDTheme } from "@/src/context/LDThemeContext";
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";
import {
  sendResetCodeEmail,
  verifyResetCodeEmail,
  resetPassword,
} from "@/src/calls/api";

import { SafeAreaView } from "react-native-safe-area-context";

import PhoneStatusBar from "@/app/components/appwide/statusbar/PhoneStatusBar";
import SimpleBottomButton from "@/app/components/appwide/button/SimpleBottomButton";

const ScreenRecoverCredentials = () => {
 const { themeAheadOfLoading } = useFriendStyle();
 const { lightDarkTheme} = useLDTheme();
  const {  manualGradientColors,theme, nonCustomHeaderPage  } = useGlobalStyle();
 
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
    <>
      <PhoneStatusBar
      friendId={false}
      themeAheadOfLoading={themeAheadOfLoading}
      theme={theme}
      nonCustomHeaderPage={nonCustomHeaderPage}
      
      />
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
                fontColor={lightDarkTheme.primaryText}
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
                  fontColor={lightDarkTheme.primaryText}
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
    justifyContent: "flex-end",
    flex: 1, 
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
