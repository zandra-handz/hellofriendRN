import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useUser } from "@/src/context/UserContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useMessage } from "@/src/context/MessageContext";
import SignInButton from "@/app/components/user/SignInButton";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import LogoSmaller from "@/app/components/appwide/logo/LogoSmaller"; 
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import GradientBackground from "@/app/components/appwide/display/GradientBackground";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'; 
import { AuthScreenNavigationProp } from "@/src/types/ScreenPropTypes";
import { runOnJS, runOnUI } from 'react-native-reanimated';
//a frienddate assistant for overwhelmed adults, and for people who just have a lot to talk about
import PreAuthSafeViewAndGradientBackground from "@/app/components/appwide/format/PreAuthSafeViewAndGradBackground";

const ScreenWelcome = () => {
  const { showMessage } = useMessage();
  const { themeStyles, manualGradientColors } = useGlobalStyle();
  const { reInitialize } = useUser();
  const navigation = useNavigation<AuthScreenNavigationProp>();

  const [confirmedUserNotSignedIn, setConfirmedUserNotSignedIn] =
    useState(false);

  const handleNavigateToAuthScreen = (userHitCreateAccount: boolean) => {
    navigation.navigate("Auth", { createNewAccount: !!userHitCreateAccount });
  };
 

  useEffect(() => {
    checkIfSignedIn();
  }, []);

// experimenting with this, not super great right now 

  const translateY = useSharedValue(500); 

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
        updateTriggerMessage('validating');
 
   
        reInitialize();
        //handleNavigateToAuthScreen(); //don't need, conditional check in App.tsx will send it straight to the home page once has credentials
      } else {
        setConfirmedUserNotSignedIn(true);

       updateTriggerMessage('signedout');
      }
    } catch (error) {
      console.error("Error checking sign-in status", error);
    }
  };



  const [ triggerMessage, updateTriggerMessage ] = useState('none');

    useEffect(() => {
      if (triggerMessage === 'validating') {
       // showMessage(true, null, "Validating...");
        updateTriggerMessage('none');

      } else if (triggerMessage === 'signedout') {
        showMessage(true, null, "Signed out");
        updateTriggerMessage('none');

      }

  },[triggerMessage] );

 

  return (
    <PreAuthSafeViewAndGradientBackground style={{ flex: 1 }}> 
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
                  <LogoSmaller />
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
    </PreAuthSafeViewAndGradientBackground>
  );
};
 

export default ScreenWelcome;
