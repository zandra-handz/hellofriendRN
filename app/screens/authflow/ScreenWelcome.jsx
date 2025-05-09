import React, { useState, useEffect, useRef } from "react";
import {
  View, 
  StyleSheet,
  Text, 
} from "react-native";
import { useAuthUser } from "@/src/context/AuthUserContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useMessage } from "@/src/context/MessageContext";
import SignInButton from "@/app/components/user/SignInButton"; 
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import LogoSmaller from "@/app/components/appwide/logo/LogoSmaller";
import { LinearGradient } from "expo-linear-gradient";
 

import PhoneStatusBar from "@/app/components/appwide/statusbar/PhoneStatusBar";

//a frienddate assistant for overwhelmed adults, and for people who just have a lot to talk about

const TOKEN_KEY = "accessToken";

const ScreenWelcome = () => {
  const { showMessage } = useMessage();
  const { themeStyles,   manualGradientColors } =
    useGlobalStyle();
  const [showSignIn, setShowSignIn] = useState(true); 
  const {
 
    reInitialize,
  } = useAuthUser();
  const usernameInputRef = useRef(null); 
  const emailInputRef = useRef(null); 
  const navigation = useNavigation(); 

  const [confirmedUserNotSignedIn, setConfirmedUserNotSignedIn] =
    useState(false);

 
 

  useEffect(() => {
    if (usernameInputRef.current) {
      setUsernameInputVisible(true);

      usernameInputRef.current.focus();
    }
  }, []);


  const handleNavigateToAuthScreen = (userHitCreateAccount) => {
    navigation.navigate("Auth", { createNewAccount: !!userHitCreateAccount });
  };


  const dismissKeyboard = (e) => {
    // Prevents dismissing the keyboard, I don't like this approach
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => {
    checkIfSignedIn();
  }, []);
 
 

  const checkIfSignedIn = async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) {
        console.log(token);
        showMessage(true, null, "Reinitializing...");
        reInitialize();
        //handleNavigateToAuthScreen(); //don't need, conditional check in App.jsx will send it straight to the home page once has credentials
    
      } else { 
        setShowSignIn(true);
        setConfirmedUserNotSignedIn(true);
        showMessage(true, null, "Signed out");
      }
    } catch (error) {
      console.error("Error checking sign-in status", error);
      // Handle errors as necessary
    }
  };
 
 
  return (
    <>

    
      <PhoneStatusBar />
      <LinearGradient
        colors={[
          manualGradientColors.darkColor,
          manualGradientColors.lightColor,
        ]}
        start={{ x: 0, y: 1 }}      // REVERSED:  start={{ x: 0, y: 0 }} 
        end={{ x: 1, y: 0 }} //end={{ x: 1, y: 1 }}
        style={[styles.container]}
      >
        <View
          style={{
            width: "100%", 
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
          }}
        > 
          <>
            {confirmedUserNotSignedIn && (
              <>
                <View style={{ width: "100%", paddingBottom: '20%', paddingHorizontal: '3%' }}>
                  <LogoSmaller
                    accessible={true} //field not in component
                    accessibilityLabel="App Logo" //field not in component
                    accessibilityHint="This is the logo of the app" //field not in component
                  />

                </View> 
                <View
                    style={{
                      bottom: '3%',
                      paddingHorizontal: "3%", 
                      width: "100%", 
                      right: 0,
                      position: 'absolute',
                    }}
                  >
                    <SignInButton
                            onPress={() => handleNavigateToAuthScreen(false)}
                            title={ "Sign in" 
                            }
                            shapeSource={require("@/app/assets/shapes/coffeecupdarkheart.png")}
                            shapeWidth={190}
                            shapeHeight={190}
                            shapePosition="left"
                            shapePositionValue={-48}
                            shapePositionVerticalValue={-23}
                            fontColor={themeStyles.genericText.color}
                            accessible={true}
                            accessibilityLabel={
                               "Sign in button" 
                            }
                            accessibilityHint="Press to sign in or create an account"
                          />

                    <View style={{paddingTop: '3%'}}>

                    <Text
                      style={styles.nonSignInButtonText}
                      onPress={() => handleNavigateToAuthScreen(true)} 
                      accessible={true}
                      accessibilityLabel="Toggle button"
                      accessibilityHint="Press to toggle between sign in and create account"
                    >
                       New account
                    </Text>

                    </View>
                  </View>
              </>
            )}
          </> 
        </View>
        
      </LinearGradient>
 
    </>
  );
};

const styles = StyleSheet.create({
  form: {
    gap: 10,
    height: 200,
    width: "100%",
    fontFamily: "Poppins-Regular",
    bottom: 10,
     position: "absolute",
     backgroundColor: 'blue',
     justifyContent: 'flex-end',
     flex: 1,
    // width: "100%",
    // right: 0,
  },
  input: { 
    fontFamily: "Poppins-Regular",
    placeholderTextColor: "lightgray",
    height: "auto", 
    borderBottomWidth: 1,
    padding: 10,
    paddingTop: 14,
    //borderRadius: 10,
    alignContent: "center",
    justifyContent: "center",
    fontFamily: "Poppins-Regular",
    fontSize: 16,
  },
  inputFocused: {
    borderColor: "orange",
    borderBottomWidth: 1,
  },
  container: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,

    // position: "absolute",
    // width: Dimensions.get("window").width,
    // height: Dimensions.get("window").height + 100,
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
  nonSignInButtonText: {
    color: "black",
    marginTop: 2,
    textAlign: "center",
    fontFamily: 'Poppins-Bold',
    //fontWeight: "bold",
    fontSize: 14,
    lineHeight: 21,
  }, 
});

export default ScreenWelcome;
