import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import useUser from "@/src/hooks/useUser";
import SignInButton from "@/app/components/user/SignInButton";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import AppTitle from "@/app/components/appwide/logo/AppTitle";
  import { useLDTheme } from "@/src/context/LDThemeContext";
import manualGradientColors from "@/app/styles/StaticColors";
import { useSharedValue, withSpring } from "react-native-reanimated";
import { AuthScreenNavigationProp } from "@/src/types/ScreenPropTypes";
import SafeViewAppDefault from "@/app/components/appwide/format/SafeViewAppDefault";
import MemoizedGeckoSkia from "@/app/assets/shader_animations/GeckoSkia";
 
import useAppNavigations from "@/src/hooks/useAppNavigations";
import AnimatedBackdrop from "@/app/components/appwide/format/AnimatedBackdrop";

const ScreenWelcome = () => { 
  const { user, isInitializing } = useUser();
  const { resetFriend } = useSelectedFriend();
const { lightDarkTheme} = useLDTheme();
  const [resetAnimation, setResetAnimation] = useState(Date.now());
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (!isInitializing && !user?.id) {
      // console.log("resetting friend");
      resetFriend();
    }
  }, [user?.id, isInitializing]);

  useFocusEffect(
  useCallback(() => {
    turnBackdropOnValue.value = false;
  }, [])
);

  const { navigateToAuth  } = useAppNavigations();
 

  const [confirmedUserNotSignedIn, setConfirmedUserNotSignedIn] =
    useState(false);

        const turnBackdropOnValue = useSharedValue(false);

  const handleNavigateToAuth = useCallback(() => {
    navigateToAuth({  prevScreenBackdrop: false, createNewAccount: "signin" })
       turnBackdropOnValue.value = true;
  },[navigateToAuth]);


    const handleNavigateToCreate = useCallback(() => {
    navigateToAuth({  prevScreenBackdrop: false, createNewAccount: "create" })
       turnBackdropOnValue.value = true;
  },[navigateToAuth]);

  useEffect(() => {
    if (user?.id) {
      setConfirmedUserNotSignedIn(false);
      setShowAnimation(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id && !isInitializing) {
      setConfirmedUserNotSignedIn(true);
    }
  }, [user?.id, isInitializing]);

  // Delay showing animation to ensure component is stable
  useEffect(() => {
    if (confirmedUserNotSignedIn && !user?.id) {
      const timer = setTimeout(() => {
        console.log("Starting animation after delay");
        setShowAnimation(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setShowAnimation(false);
    }
  }, [confirmedUserNotSignedIn, user?.id]);

  const translateY = useSharedValue(500);

  useEffect(() => {
    translateY.value = withSpring(0, { duration: 3000 });
  }, []);

  return (
    <SafeViewAppDefault
      // backgroundColor={lightDarkTheme.primaryBackground}
      style={{
        flex: 1,
      }}
    >
           <AnimatedBackdrop color={lightDarkTheme.backdropColor} zIndex={100} isVisibleValue={turnBackdropOnValue  } />
         
      <View style={styles.container}>
        {showAnimation && (
          <View style={[StyleSheet.absoluteFill]}>
            <MemoizedGeckoSkia
              color1={manualGradientColors.lightColor}
              color2={manualGradientColors.homeLightColor}
              bckgColor1={manualGradientColors.lightColor}
              bckgColor2={manualGradientColors.homeLightColor}
              startingCoord0={0.2}
              startingCoord1={-1}
              restPoint0={0.5}
              restPoint1={0.7}
              scale={1}
              gecko_scale={1}
              gecko_size={1.6}
              reset={resetAnimation}
            />
          </View>
        )}

        <>
          {confirmedUserNotSignedIn && !user?.id && (
            <>
              <View style={styles.logoContainer}>
                <AppTitle labelColor={manualGradientColors.homeDarkColor} />
              </View>
              <View style={styles.signInButtonContainer}>
                <Pressable
                  onPress={() => setResetAnimation(Date.now())}
                  style={{
                    width: "auto",
                    width: 200,
                    alignItems: "center",
                    padding: 10,
                    height: 40,
                    borderRadius: 999,
                    alignSelf: "center",
                    //  backgroundColor: 'pink',
                    marginVertical: 40,
                  }}
                >
                  {/* <Text style={{fontSize:16, fontWeight: 'bold', color: lightDarkTheme.primaryBackground}}>[DEBUG] Resetter</Text> */}
                </Pressable>

                <SignInButton
                  onPress={handleNavigateToAuth}
                  labelColor={manualGradientColors.homeDarkColor}
                  backgroundColor={manualGradientColors.whiteColor}
                />

                <Text
                  style={[
                    styles.bottomText,
                    {
                      color: manualGradientColors.homeDarkColor,
                    },
                  ]}
                  onPress={handleNavigateToCreate}
                  accessible={true}
                  accessibilityLabel="Toggle button"
                  accessibilityHint="Press to toggle between sign in and create account"
                >
                  New account
                </Text>
              </View>
            </>
          )}
        </>
      </View>
    </SafeViewAppDefault>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  logoContainer: {
    width: "100%",
    paddingBottom: 400,
    paddingHorizontal: 20,
  },
  signInButtonContainer: {
    bottom: 40,
    paddingHorizontal: 10,
    width: "100%",
    right: 0,
    position: "absolute",
  },
  bottomText: {
    marginTop: 20,
    textAlign: "center",
    fontFamily: "Poppins-Bold",
    fontWeight: "bold",
    fontSize: 15,
    lineHeight: 21,
  },
});

export default ScreenWelcome;
