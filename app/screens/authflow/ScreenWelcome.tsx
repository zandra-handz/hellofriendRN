import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useUser } from "@/src/context/UserContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useFocusEffect } from "@react-navigation/native";
import { useMessage } from "@/src/context/MessageContext";
import SignInButton from "@/app/components/user/SignInButton";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import LogoSmaller from "@/app/components/appwide/logo/LogoSmaller";
import { AppState, AppStateStatus } from "react-native"; 
import GradientBackground from "@/app/components/appwide/display/GradientBackground";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { AuthScreenNavigationProp } from "@/src/types/ScreenPropTypes";
import LoadingPage from "@/app/components/appwide/spinner/LoadingPage";
//a frienddate assistant for overwhelmed adults, and for people who just have a lot to talk about
import PreAuthSafeViewAndGradientBackground from "@/app/components/appwide/format/PreAuthSafeViewAndGradBackground";

const ScreenWelcome = () => {
  const { themeStyles, manualGradientColors } = useGlobalStyle();
  const { reInitialize, isAuthenticated } = useUser();
  const navigation = useNavigation<AuthScreenNavigationProp>();

  const [confirmedUserNotSignedIn, setConfirmedUserNotSignedIn] =
    useState(false);

  const handleNavigateToAuthScreen = (userHitCreateAccount: boolean) => {
    navigation.navigate("Auth", { createNewAccount: !!userHitCreateAccount });
  };

  //  const appState = useRef(AppState.currentState);

  //     useEffect(() => {
  //       const subscription = AppState.addEventListener("change", (nextState: AppStateStatus) => {
  //         console.log("Welcome screen: App state changed:", nextState);

  //         if (
  //           appState.current.match(/inactive|background/) &&
  //           nextState === "active"
  //         ) {

  //           console.log("Weclome screen: App has come to the foreground!");
  //           checkIfSignedIn();
  //           if (!reInitialize) {
  //           return;
  //         }

  //         }

  //         appState.current = nextState;
  //       });

  //       return () => subscription.remove(); // cleanup
  //     }, [reInitialize]);

  useFocusEffect(
    useCallback(() => {
      checkIfSignedIn();
    }, [])
  );

  // experimenting with this, not super great right now

  const translateY = useSharedValue(500);

  useEffect(() => {
    translateY.value = withSpring(0, { duration: 3000 });
  }, []);

  const logoRiseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const checkIfSignedIn = async () => {
    try {
      const token = await SecureStore.getItemAsync("accessToken");
      if (token) {
        reInitialize();
      } else {
        setConfirmedUserNotSignedIn(true);
      }
    } catch (error) {
      console.error("Error checking sign-in status", error);
    }
  };

  // const [ triggerMessage, updateTriggerMessage ] = useState('none');

  //   useEffect(() => {
  //     if (triggerMessage === 'validating') {
  //      // showMessage(true, null, "Validating...");
  //       updateTriggerMessage('none');

  //     } else if (triggerMessage === 'signedout') {
  //       showMessage(true, null, "Signed out");
  //       updateTriggerMessage('none');

  //     }

  // },[triggerMessage] );

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
            {(!confirmedUserNotSignedIn || isAuthenticated) && (
              <LoadingPage
                loading={true}
                includeLabel={true}
                label="loading user..."
                spinnerType="circle"
                spinnerSize={40}
                color={manualGradientColors.homeDarkColor}
                labelColor={manualGradientColors.homeDarkColor}
              />
            )}
            {confirmedUserNotSignedIn && !isAuthenticated && (
              <>
                <Animated.View
                  style={[
                    logoRiseStyle,
                    {
                      width: "100%",
                      paddingBottom: "20%",
                      paddingHorizontal: "3%",
                    },
                  ]}
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
