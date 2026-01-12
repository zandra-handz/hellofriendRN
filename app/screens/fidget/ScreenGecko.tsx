import { View, StyleSheet, Pressable, Text } from "react-native";
import React, { useState, useMemo, useEffect } from "react";

import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useLDTheme } from "@/src/context/LDThemeContext";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import useEditMoment from "@/src/hooks/CapsuleCalls/useEditMoment";
import manualGradientColors from "@/app/styles/StaticColors";
import EscortBarFidgetScreen from "@/app/components/moments/EscortBarFidgetScreen";
import { AppFontStyles } from "@/app/styles/AppFonts";
 
import { SafeAreaView } from "react-native-safe-area-context";
// import { useFriendDash } from "@/src/context/FriendDashContext";
import useFriendDash from "@/src/hooks/useFriendDash"; 
// import { useUser } from "@/src/context/UserContext";
import useUser from "@/src/hooks/useUser"; 
import MomentsSkia from "@/app/assets/shader_animations/MomentsSkia";
import PreAuthSafeViewAndGradientBackground from "@/app/components/appwide/format/PreAuthSafeViewAndGradBackground";
type Props = {};

const ScreenGecko = (props: Props) => {
  const { user } = useUser();
  const { lightDarkTheme } = useLDTheme();
  const { capsuleList } = useCapsuleList();
  const { selectedFriend } = useSelectedFriend();



  const { friendDash } = useFriendDash({
    userId: user?.id,
    friendId: selectedFriend?.id,
  });




  const { handleEditMoment, editMomentMutation } = useEditMoment({
    userId: user?.id,
    friendId: selectedFriend?.id,
  });
 



  const mod = (n, m) => {
    return ((n % m) + m) % m;
  };
 
const momentCoords = useMemo(() => {
  return capsuleList.map(m => ({
    id: m.id,
    coord: [m.screen_x, m.screen_y],
  }));
}, [capsuleList]);

const [scatteredMoments, setScatteredMoments] = useState(momentCoords);

// Function to randomize/scatter moments
const handleRescatterMoments = () => {
  // console.log(`scattering moments!`, scatteredMoments);
  setScatteredMoments(prev =>
    prev.map(m => ({
      ...m,
      coord: [
        Math.random(), // random x between 0 and 1
        Math.random(), // random y between 0 and 1
      ],
    }))
  );
  // console.log(`done!`, scatteredMoments);
}; 
 

  const welcomeTextStyle = AppFontStyles.welcomeText;
  const primaryColor = lightDarkTheme.priamryText;

 

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
  
        <View
          style={[
        StyleSheet.absoluteFill,
            {flex: 1},
            // { backgroundColor: lightDarkTheme?.primaryBackground },
          ]}
        >
        
          <MomentsSkia
          handleEditMoment={handleEditMoment}
      
            color1={manualGradientColors.lightColor}
            color2={manualGradientColors.homeDarkColor}
            momentsData={scatteredMoments}
            startingCoord={[0.5, -.3]}
            restPoint={[1.4, 0.9]}
            scale={.6}
          />
       </View>
     
 

 
{/*   
      <SafeAreaView>
  
        <View style={styles.statsWrapper}>
          <Text style={[welcomeTextStyle, { color: primaryColor }]}>
         
          </Text>
        </View>

        <EscortBarFidgetScreen
          style={{ paddingHorizontal: 10 }}
          primaryColor={lightDarkTheme.primaryText}
          primaryBackground={lightDarkTheme.primaryBackground}
          onPress={handleRescatterMoments}
          label={"Rescatter"}
        />
      </SafeAreaView> */}

       <EscortBarFidgetScreen
          style={{ paddingHorizontal: 10 }}
          primaryColor={lightDarkTheme.primaryText}
          primaryBackground={lightDarkTheme.primaryBackground}
          onPress={handleRescatterMoments}
          label={"Rescatter"}
        />




    </PreAuthSafeViewAndGradientBackground>
  );
};

const styles = StyleSheet.create({
  statsWrapper: {
    width: "100%",
    height: "auto",
    padding: 10,
    paddingHorizontal: 20,
    flexDirection: "column",
  },
});

export default ScreenGecko;
