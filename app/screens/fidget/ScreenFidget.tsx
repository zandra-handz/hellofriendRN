import { View, StyleSheet, Pressable, Text } from "react-native";
import React, { useState, useMemo, useEffect } from "react";
import Demo from "@/app/components/headers/SkiaDemo";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useLDTheme } from "@/src/context/LDThemeContext";
import manualGradientColors from "@/app/styles/StaticColors";
import EscortBarFidgetScreen from "@/app/components/moments/EscortBarFidgetScreen";
import { AppFontStyles } from "@/app/styles/AppFonts";
import GradientBackgroundFidgetOne from "@/app/fidgets/GradientBackgroundFidgetOne";
import { SafeAreaView } from "react-native-safe-area-context";
// import { useFriendDash } from "@/src/context/FriendDashContext";
import useFriendDash from "@/src/hooks/useFriendDash";
import ShaderTestOne from "@/app/components/appwide/button/ShaderTestOne";
// import { useUser } from "@/src/context/UserContext";
import useUser from "@/src/hooks/useUser";
import SpinnerOne from "@/app/components/appwide/button/SpinnerOne";
import SpinnerTwo from "@/app/components/appwide/button/SpinnerTwo";
import Cascader from "@/app/fidgets/Cascader";
import PlainSafeView from "@/app/components/appwide/format/PlainSafeView";
import LiquidGlassExp from "@/app/components/appwide/button/LiquidGlassExp";
import PreAuthSafeViewAndGradientBackground from "@/app/components/appwide/format/PreAuthSafeViewAndGradBackground";
type Props = {};

const ScreenFidget = (props: Props) => {
  const { user } = useUser();
  const { lightDarkTheme } = useLDTheme();
  const { selectedFriend } = useSelectedFriend();
  const { friendDash } = useFriendDash({
    userId: user?.id,
    friendId: selectedFriend?.id,
  });

  const options = [1, 2, 3, 4, 5, 6];

  const pickRandom = options[Math.floor(Math.random() * options.length)];

  const [spinnerViewing, setSpinnerViewing] = useState(pickRandom);

  const handleNextOption = () => {
    const randomPick = Math.floor(Math.random() * options.length);
    // console.log(randomPick);
    const spinnerPicked = options[randomPick];
    setSpinnerViewing(spinnerPicked);
  };

  const welcomeTextStyle = AppFontStyles.welcomeText;
  const primaryColor = lightDarkTheme.priamryText;

  // console.log(friendDash.time_score);
  // console.log(friendDash.days_since);

  //   @property
  // def time_score(self):
  //     days_since = self.days_since
  //     if days_since is None:
  //         return None
  //     elif days_since > 180:
  //         return 6
  //     elif days_since > 90:
  //         return 5
  //     elif days_since > 60:
  //         return 4
  //     elif days_since > 40:
  //         return 3
  //     elif days_since > 20:
  //         return 2
  //     else:
  //         return 1

  const TIME_SCORE = useMemo(() => {
    if (!friendDash || !friendDash?.time_score) {
      return 100;
    }
    return Math.round(100 / friendDash?.time_score);
  }, [friendDash]);

  const DAYS_SINCE = friendDash?.days_since || 0;

  // useEffect(() => {
  //   console.log(`spinner viewing: `, spinnerViewing);
  // }, [spinnerViewing]);

  return (
    // <SafeViewAndGradientBackground
    <PreAuthSafeViewAndGradientBackground
      startColor={manualGradientColors.lightColor}
      endColor={manualGradientColors.darkColor}
      friendColorLight={selectedFriend.lightColor}
      friendColorDark={selectedFriend.darkColor}
      backgroundOverlayColor={lightDarkTheme.primaryBackground}
      friendId={selectedFriend?.id}
      backgroundOverlayHeight={120}
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-end",
        // padding: 10, //consider this approach for all screens if possible
      }}
    >
      {(spinnerViewing === 1 || spinnerViewing === 4) && (
        <View
          style={{
            //  backgroundColor: "pink",
            width: "100%",
            flex: 1,
            alignItems: "center",
          }}
        >
          <View style={{ width: 300, height: "100%" }}>
            <Demo text={""} />
          </View>
        </View>
      )}

      {/* {(spinnerViewing === 2 ) && (
        <View style={StyleSheet.absoluteFillObject}>
          <GradientBackgroundFidgetOne
            secondColorSetDark={selectedFriend.lightColor}
            secondColorSetLight={selectedFriend.darkColor}
            firstColorSetDark={manualGradientColors.lightColor}
            firstColorSetLight={selectedFriend.darkColor}
            // firstColorSetDark={manualGradientColors.lightColor}
            // firstColorSetLight={manualGradientColors.darkColor}
            timeScore={TIME_SCORE}
            speed={TIME_SCORE > 40 ? 2000 : 600}
            style={{ flexDirection: "column", justifyContent: "flex-end" }}
            direction={TIME_SCORE > 40 ? "vertical" : "original"}
          ></GradientBackgroundFidgetOne>
        </View>
      )} */}

      {(spinnerViewing === 2 ||
    
        spinnerViewing === 6) && (
        <View style={StyleSheet.absoluteFill}>
          <SpinnerTwo
            color1={selectedFriend?.lightColor}
            color2={selectedFriend?.darkColor}
          />
        </View>
      )}


            {( 
        spinnerViewing === 5 ||
        spinnerViewing === 3  ) && (
        <View style={[StyleSheet.absoluteFill, {backgroundColor: lightDarkTheme?.primaryBackground}]}>
          <SpinnerOne
            color1={selectedFriend?.lightColor}
            color2={selectedFriend?.darkColor}
          />
        </View>
      )}

      {/* {(spinnerViewing === 3 || spinnerViewing === 6) && (
        <View style={StyleSheet.absoluteFillObject}>
          <Cascader />
        </View>
      )} */}

      <SafeAreaView>
        {(spinnerViewing === 2 || spinnerViewing === 5) && (
          <View
            style={{
              width: "100%",
              height: "auto",
              padding: 10,
              paddingHorizontal: 20,
              flexDirection: "column",
            }}
          >
            <Text style={[welcomeTextStyle, { color: primaryColor }]}>
              Health score: {TIME_SCORE}%
            </Text>
            <Text style={[welcomeTextStyle, { color: primaryColor }]}>
              Days since: {DAYS_SINCE}
            </Text>
          </View>
        )}

        <EscortBarFidgetScreen
          style={{ paddingHorizontal: 10 }}
          primaryColor={lightDarkTheme.primaryText}
          primaryBackground={lightDarkTheme.primaryBackground}
          onPress={handleNextOption}
          label={"Try a different spinner"}
          forwardFlowOn={false}
        />
      </SafeAreaView>
    </PreAuthSafeViewAndGradientBackground>
  );
};

export default ScreenFidget;
