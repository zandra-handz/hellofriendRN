// import React, { useState, useEffect } from "react";
// import { View, StyleSheet, Text, Pressable } from "react-native";
// // import { useUser } from "@/src/context/UserContext";
// import useUser from "@/src/hooks/useUser";
// import Demo from "@/app/components/headers/SkiaDemo";
// import PChainSkia from "@/app/assets/shader_animations/PChainSkia";
// import SignInButton from "@/app/components/user/SignInButton";
// import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
// import { useNavigation } from "@react-navigation/native";
// import LogoSmaller from "@/app/components/appwide/logo/LogoSmaller";
// import { useLDTheme } from "@/src/context/LDThemeContext";
// import manualGradientColors from "@/app/styles/StaticColors";
// import GradientBackground from "@/app/components/appwide/display/GradientBackground";
// import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
// import { AuthScreenNavigationProp } from "@/src/types/ScreenPropTypes";
// import LoadingPage from "@/app/components/appwide/spinner/LoadingPage";
// import MemoizedGeckoSkia from "@/app/assets/shader_animations/GeckoSkia";

// //a frienddate assistant for overwhelmed adults, and for people who just have a lot to talk about
// import PreAuthSafeViewAndGradientBackground from "@/app/components/appwide/format/PreAuthSafeViewAndGradBackground";
// import useAppNavigations from "@/src/hooks/useAppNavigations";
// const ScreenWelcome = () => {
//   const { lightDarkTheme } = useLDTheme();
//   const { user, isInitializing } = useUser();
//   const { selectedFriend, resetFriend } = useSelectedFriend();

//   const [resetAnimation, setResetAnimation] = useState(Date.now());

  

//   useEffect(() => {
//     if (!isInitializing && !user?.id) {
//       console.log("resetting friend");
//       resetFriend();
//     }
//   }, [user?.id, isInitializing]);

//   const { navigateToNewAccount } = useAppNavigations();
//   const navigation = useNavigation<AuthScreenNavigationProp>();

//   const [confirmedUserNotSignedIn, setConfirmedUserNotSignedIn] =
//     useState(false);

//   const handleNavigateToAuthScreen = (userHitCreateAccount: boolean) => {
//     navigation.navigate("Auth", { createNewAccount: !!userHitCreateAccount });
//   };

//   useEffect(() => {
//     if (user?.id) {
//       setConfirmedUserNotSignedIn(false);
//     }
//   }, [user?.id]);

//   useEffect(() => {
//     if (!user?.id && !isInitializing) {
//       setConfirmedUserNotSignedIn(true);
//     }
//   }, [user?.id, isInitializing]);

//   const translateY = useSharedValue(500);

//   useEffect(() => {
//     translateY.value = withSpring(0, { duration: 3000 });
//   }, []);

//   return (
//     <PreAuthSafeViewAndGradientBackground
//       friendColorLight={null}
//       friendColorDark={null}
//       friendId={selectedFriend?.id}
//       backgroundOverlayColor={lightDarkTheme.primaryBackground}
//       style={{
//         flex: 1,
//       }}
//     >
//       <GradientBackground
//         useFriendColors={false}
//         friendColorLight={null}
//         friendColorDark={null}
//         additionalStyles={{
//           ...StyleSheet.absoluteFillObject,

//           alignItems: "center",
//         }}
//       >
//         <View style={styles.container}>
//              {confirmedUserNotSignedIn && !user?.id && (
//           <View style={[StyleSheet.absoluteFill]}>
//             <MemoizedGeckoSkia
//               color1={manualGradientColors.lightColor}
//               color2={manualGradientColors.homeLightColor}
//               bckgColor1={manualGradientColors.lightColor}
//               bckgColor2={manualGradientColors.homeLightColor}

//               startingCoord={[.2,-1.]}
//               restPoint={[.5,.7]}
//               scale={1}
//               gecko_scale={1}
//               gecko_size={1.6}
//               reset={resetAnimation}
//             />
//           </View>
//              )}

//           <>
//             {confirmedUserNotSignedIn && !user?.id && (
//               <>
//                 <View style={styles.logoContainer}>
//                   <LogoSmaller />
//                 </View>
//                 <View style={styles.signInButtonContainer}>
//                   <Pressable
//                   onPress={() => setResetAnimation(Date.now())}
                  
//                     style={{
//                       width: 40,
//                       height: 40,
//                       borderRadius: 999,
//                      // backgroundColor: "hotpink",
//                       alignSelf: "center",
//                       marginVertical: 40,
//                     }}
//                   ></Pressable>
//                   <SignInButton
//                     onPress={() => handleNavigateToAuthScreen(false)}
//                   />

//                   <Text
//                     style={[
//                       styles.bottomText,
//                       {
//                         color: manualGradientColors.homeDarkColor,
//                       },
//                     ]}
//                     onPress={navigateToNewAccount}
//                     accessible={true}
//                     accessibilityLabel="Toggle button"
//                     accessibilityHint="Press to toggle between sign in and create account"
//                   >
//                     New account
//                   </Text>
//                 </View>
//               </>
//             )}
//           </>
//         </View>
//       </GradientBackground>
//     </PreAuthSafeViewAndGradientBackground>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     width: "100%",
//     flex: 1,
//     flexDirection: "column",
//     justifyContent: "center",
//   },
//   logoContainer: {
//     width: "100%",
//     paddingBottom: 400,
//     paddingHorizontal: 20,
//   },
//   signInButtonContainer: {
//     bottom: 40,
//     paddingHorizontal: 10,
//     width: "100%",
//     right: 0,
//     position: "absolute",
//   },
//   bottomText: {
//     marginTop: 20,
//     textAlign: "center",
//     fontFamily: "Poppins-Bold",
//     fontWeight: 'bold',
//     fontSize: 15,
//     lineHeight: 21,
//   },
// });

// export default ScreenWelcome;


import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import useUser from "@/src/hooks/useUser"; 
import SignInButton from "@/app/components/user/SignInButton";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useNavigation } from "@react-navigation/native";
import LogoSmaller from "@/app/components/appwide/logo/LogoSmaller";
import { useLDTheme } from "@/src/context/LDThemeContext";
import manualGradientColors from "@/app/styles/StaticColors";
import GradientBackground from "@/app/components/appwide/display/GradientBackground";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { AuthScreenNavigationProp } from "@/src/types/ScreenPropTypes";
 
import MemoizedGeckoSkia from "@/app/assets/shader_animations/GeckoSkia";
import PreAuthSafeViewAndGradientBackground from "@/app/components/appwide/format/PreAuthSafeViewAndGradBackground";
import useAppNavigations from "@/src/hooks/useAppNavigations";

const ScreenWelcome = () => {
  const { lightDarkTheme } = useLDTheme();
  const { user, isInitializing } = useUser();
  const { selectedFriend, resetFriend } = useSelectedFriend();

  const [resetAnimation, setResetAnimation] = useState(Date.now());
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (!isInitializing && !user?.id) {
      // console.log("resetting friend");
      resetFriend();
    }
  }, [user?.id, isInitializing]);

  const { navigateToNewAccount } = useAppNavigations();
  const navigation = useNavigation<AuthScreenNavigationProp>();

  const [confirmedUserNotSignedIn, setConfirmedUserNotSignedIn] = useState(false);

  const handleNavigateToAuthScreen = (userHitCreateAccount: boolean) => {
    navigation.navigate("Auth", { createNewAccount: !!userHitCreateAccount });
  };

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
        console.log('Starting animation after delay');
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
        additionalStyles={{
          ...StyleSheet.absoluteFillObject,
          alignItems: "center",
        }}
      >
        <View style={styles.container}>
          {showAnimation && (
            <View style={[StyleSheet.absoluteFill]}>
              <MemoizedGeckoSkia
                color1={manualGradientColors.lightColor}
                color2={manualGradientColors.homeLightColor}
                bckgColor1={manualGradientColors.lightColor}
                bckgColor2={manualGradientColors.homeLightColor}
                startingCoord={[.2,-1.]}
                restPoint={[.5,.7]}
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
                  <LogoSmaller />
                </View>
                <View style={styles.signInButtonContainer}>
                  <Pressable
                    onPress={() => setResetAnimation(Date.now())}
                    style={{
                      width: 'auto',
                      alignItems: 'center',
                      padding: 10,
                      height: 40,
                      borderRadius: 999,
                      alignSelf: "center",
                      backgroundColor: 'pink',
                      marginVertical: 40,
                    }}
                  ><Text style={{fontSize:16, fontWeight: 'bold', color: lightDarkTheme.primaryBackground}}>[DEBUG] Resetter</Text></Pressable>
                  <SignInButton
                    onPress={() => handleNavigateToAuthScreen(false)}
                  />

                  <Text
                    style={[
                      styles.bottomText,
                      {
                        color: manualGradientColors.homeDarkColor,
                      },
                    ]}
                    onPress={navigateToNewAccount}
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
      </GradientBackground>
    </PreAuthSafeViewAndGradientBackground>
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
    fontWeight: 'bold',
    fontSize: 15,
    lineHeight: 21,
  },
});

export default ScreenWelcome;