import React, { useState, useEffect, onLayoutEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useUser } from "@/src/context/UserContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useMessage } from "@/src/context/MessageContext";
import SignInButton from "@/app/components/user/SignInButton";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import LogoSmaller from "@/app/components/appwide/logo/LogoSmaller"; 
import SafeView from "@/app/components/appwide/format/SafeView";
import GradientBackground from "@/app/components/appwide/display/GradientBackground";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, interpolate, Extrapolation } from 'react-native-reanimated';
// import PhoneStatusBar from "@/app/components/appwide/statusbar/PhoneStatusBar";

//a frienddate assistant for overwhelmed adults, and for people who just have a lot to talk about

const ScreenWelcome = () => {
  const { showMessage } = useMessage();
  const { themeStyles, manualGradientColors } = useGlobalStyle();
  const { reInitialize } = useUser();
  const navigation = useNavigation();

  const translateY = useSharedValue(500);

  const [confirmedUserNotSignedIn, setConfirmedUserNotSignedIn] =
    useState(false);

  const handleNavigateToAuthScreen = (userHitCreateAccount) => {
    navigation.navigate("Auth", { createNewAccount: !!userHitCreateAccount });
  };
 

  useEffect(() => {
    checkIfSignedIn();
  }, []);


  useEffect(() => {
  translateY.value = withSpring(0, { duration: 3000})

  }, []);


  const logoRiseStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateY: translateY.value}
      ] 
  }})

  const checkIfSignedIn = async () => {
    try {
      const token = await SecureStore.getItemAsync("accessToken");
      if (token) { 
        showMessage(true, null, "Reinitializing...");
        reInitialize();
        //handleNavigateToAuthScreen(); //don't need, conditional check in App.tsx will send it straight to the home page once has credentials
      } else {
        setConfirmedUserNotSignedIn(true);
        showMessage(true, null, "Signed out");
      }
    } catch (error) {
      console.error("Error checking sign-in status", error);
    }
  };

  return (
    <SafeView style={{ flex: 1 }}>
      {/* <PhoneStatusBar /> */}
      <GradientBackground
        useFriendColors={false}
        startColor={manualGradientColors.darkColor}
        endColor={manualGradientColors.lightColor}
        reverse={false}
        additionalStyles={{
          ...StyleSheet.absoluteFillObject,

          alignItems: "center",
        }}
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
                <Animated.View
                  style={[logoRiseStyle, {
                    width: "100%",
                    paddingBottom: "20%",
                    paddingHorizontal: "3%",
                  }]}
                >
                  <LogoSmaller
                    accessible={true} //field not in component
                    accessibilityLabel="App Logo" //field not in component
                    accessibilityHint="This is the logo of the app" //field not in component
                  />
                </Animated.View>
                <View
                  style={{
                    bottom: "3%",
                    paddingHorizontal: "3%",
                    width: "100%",
                    right: 0,
                    position: "absolute",
                  }}
                >
                  <SignInButton
                    onPress={() => handleNavigateToAuthScreen(false)}
                    title={"Sign in"}
                    shapeSource={require("@/app/assets/shapes/coffeecupdarkheart.png")}
                    shapeWidth={190}
                    shapeHeight={190}
                    shapePosition="left"
                    shapePositionValue={-48}
                    shapePositionVerticalValue={-23}
                    fontColor={themeStyles.genericText.color}
                    accessible={true}
                    accessibilityLabel={"Sign in button"}
                    accessibilityHint="Press to sign in or create an account"
                  />

                  <View style={{ paddingTop: "3%" }}>
                    <Text
                      style={{
                        color: "black",
                        marginTop: 2,
                        textAlign: "center",
                        fontFamily: "Poppins-Bold",
                        fontSize: 14,
                        lineHeight: 21,
                      }}
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
      </GradientBackground>
    </SafeView>
  );
};
 

export default ScreenWelcome;
