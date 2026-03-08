import { View, StyleSheet, Pressable, Text } from "react-native";
import React, { useState, useMemo, useEffect } from "react";
import Demo from "@/app/components/headers/SkiaDemo";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useLDTheme } from "@/src/context/LDThemeContext";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import useEditMoment from "@/src/hooks/CapsuleCalls/useEditMoment";
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
import SpinnerThree from "@/app/components/appwide/button/SpinnerThree";
import SpinnerFour from "@/app/components/appwide/button/SpinnerFour";
import TextHeader from "@/app/components/appwide/format/TextHeader";
import SpinnerFive from "@/app/components/appwide/button/SpinnerFive";
import SpinnerSix from "@/app/components/appwide/button/SpinnerSix";
import SpinnerSeven from "@/app/components/appwide/button/SpinnerSeven";
import SpinnerGeckoToes from "@/app/components/appwide/button/SpinnerGeckoToes";
import PlainSafeView from "@/app/components/appwide/format/PlainSafeView";
import LiquidGlassExp from "@/app/components/appwide/button/LiquidGlassExp";
import PChainSkia from "@/app/assets/shader_animations/PChainSkia";
import SafeViewAppDefault from "@/app/components/appwide/format/SafeViewAppDefault";
import PreAuthSafeViewAndGradientBackground from "@/app/components/appwide/format/PreAuthSafeViewAndGradBackground";
type Props = {};

const ScreenFidget = (props: Props) => {
  const { lightDarkTheme } = useLDTheme();
  const { selectedFriend } = useSelectedFriend();

  const backgroundColor = lightDarkTheme.primaryBackground;
  const textColor = lightDarkTheme.primaryText;

  const color1 = manualGradientColors.lightColor;
  const color2 = manualGradientColors.darkColor;

  const mod = (n, m) => {
    return ((n % m) + m) % m;
  };

  const [spinnerViewing, setSpinnerViewing] = useState(0);

  const handleNextOption = () => {
    const next = mod(spinnerViewing + 1, 6);
    setSpinnerViewing(next);
  };

  const welcomeTextStyle = AppFontStyles.welcomeText;

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

  // useEffect(() => {
  //   console.log(`spinner viewing: `, spinnerViewing);
  // }, [spinnerViewing]);

  return (
    // <SafeViewAndGradientBackground
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: backgroundColor,
        paddingHorizontal: 10,
      }}
    >
      <TextHeader
        label={`Spinner ${spinnerViewing}`}
        color={textColor}
        fontStyle={welcomeTextStyle}
        showNext={true}
        nextEnabled={true}
        nextIconName={`arrow_right`}
        onNext={handleNextOption}
        nextColor={textColor}
        nextBackgroundColor={"transparent"}
        backgroundColor={"transparent"}
        zIndex={10}
      />

      <View style={StyleSheet.absoluteFill}>
        {spinnerViewing === 0 && <SpinnerOne color1={color1} color2={color2} />}
        {spinnerViewing === 1 && <SpinnerTwo color1={color1} color2={color2} />}

        {spinnerViewing === 2 && <SpinnerThree color1={color1} color2={color2} />}
        {/* {spinnerViewing === 3 && (
          <SpinnerFour color1={color1} color2={color2} />
        )} */}
        {spinnerViewing === 3 && (
          <SpinnerFive color1={color1} color2={color2} />
        )}

        {spinnerViewing === 4 && (
          <SpinnerSix color1={color1} color2={color2} />
        )} 
        {spinnerViewing === 5 && (
          <SpinnerSeven color1={color1} color2={color2} />
        )}


      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  shaderContainer: {},
});

export default ScreenFidget;
