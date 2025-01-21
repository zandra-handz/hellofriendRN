import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Dimensions, 
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { useAuthUser } from "../context/AuthUserContext";
import { useGlobalStyle } from "../context/GlobalStyleContext";
import { useMessage } from "../context/MessageContext"; 
import { useFonts } from "expo-font"; 
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useRoute } from "@react-navigation/native";

import { SafeAreaView } from "react-native-safe-area-context";

import PhoneStatusBar from "../components/PhoneStatusBar";
import SimpleBottomButton from "../components/SimpleBottomButton";

//a frienddate assistant for overwhelmed adults, and for people who just have a lot to talk about

const TOKEN_KEY = "my-jwt";

const ScreenRecoverCredentials = () => {
  const route = useRoute();
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

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const [confirmedUserNotSignedIn, setConfirmedUserNotSignedIn] =
    useState(false);

  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
  });



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
 

 
  const handleBackToSignIn = () => {
    // setShowSignIn(true);
    // setUsername("");
    // setEmail("");
    // setPassword("");
    // setVerifyPassword("");
    // setShowSignIn(true);
    // setSignInScreen(true);
    // setSignUpSuccess(false);
    // if (usernameInputRef.current) {
    //   setUsernameInputVisible(true);

    //   usernameInputRef.current.focus();
    // }
    setUsernameInputVisible(true);
  };
 
 

 

  const handleNavigateBackToAuthScreen = () => {
    navigation.goBack();
  };

  const handleUsernameSubmit = () => {
    setUsernameInputVisible(false);
    if (passwordInputRef.current && username) {
      passwordInputRef.current.focus();
    }

    console.log("password input current");
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
                  marginLeft: '2%',
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
                <View style={{width: '100%', position: 'absolute', bottom: 0, paddingBottom: 60, right: 0}}> 
                    <SimpleBottomButton
                      onPress={handleAuthentication}
                      title={"Recover"}
                      shapeSource={require("../assets/shapes/coffeecupdarkheart.png")}
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
          
        </SafeAreaView>

      </LinearGradient>

      {showSignIn && (
        <View
          style={[styles.form, { bottom: isKeyboardVisible ? 10 : "47%" }]}
          accessible={true}
          accessibilityLabel="Form container"
        >
                      <Text
                  style={styles.inputHeaderText} 
                  accessible={true} 
                >
                  {"Recover password"}
                </Text> 
          <Text
                  style={styles.inputSubHeaderText} 
                  accessible={true} 
                >
                  {"Enter username or email: "}
                </Text> 
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
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    selfAlign: 'center', 
  },  
  inputHeaderText: {
    color: "black",  
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    selfAlign: 'center', 
  },
  inputSubHeaderText: {
    color: "black",  
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    selfAlign: 'center', 
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
