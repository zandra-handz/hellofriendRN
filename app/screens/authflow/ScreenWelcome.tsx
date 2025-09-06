import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useUser } from "@/src/context/UserContext"; 
 
import SignInButton from "@/app/components/user/SignInButton";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useNavigation } from "@react-navigation/native";
import LogoSmaller from "@/app/components/appwide/logo/LogoSmaller";
import { useLDTheme } from "@/src/context/LDThemeContext";
import { manualGradientColors } from "@/src/hooks/StaticColors";
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
import useAppNavigations from "@/src/hooks/useAppNavigations";
const ScreenWelcome = () => {
  const { lightDarkTheme} = useLDTheme(); 

  const { user, isInitializing } = useUser();
  const { selectedFriend } = useSelectedFriend();

  const { navigateToNewAccount} = useAppNavigations();
  const navigation = useNavigation<AuthScreenNavigationProp>();

  const [confirmedUserNotSignedIn, setConfirmedUserNotSignedIn] =
    useState(false);

  const handleNavigateToAuthScreen = (userHitCreateAccount: boolean) => {
    navigation.navigate("Auth", { createNewAccount: !!userHitCreateAccount });
  };


  const handleNavigateToNewAccoint = () => {

  };

  useEffect(() => {
    if (user) {
      setConfirmedUserNotSignedIn(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user && !isInitializing) {
      setConfirmedUserNotSignedIn(true);
    }
  }, [user, isInitializing]);

  const translateY = useSharedValue(500);

  useEffect(() => {
    translateY.value = withSpring(0, { duration: 3000 });
  }, []);

  const logoRiseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <PreAuthSafeViewAndGradientBackground

      friendColorLight={null}
      friendColorDark={null}
      friendId={selectedFriend?.id}
      backgroundOverlayColor={lightDarkTheme.primaryBackground}
      style={{
        flex: 1,
      }}
    >
      <GradientBackground
        useFriendColors={false}
        friendColorLight={null}
        friendColorDark={null}
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
            {(!confirmedUserNotSignedIn || user?.id) && (
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
            {confirmedUserNotSignedIn && !user?.id && (
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
                      onPress={navigateToNewAccount}
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
