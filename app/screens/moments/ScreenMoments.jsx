import React from "react";
import { View, StyleSheet } from "react-native";

import { useCapsuleList } from "@/src/context/CapsuleListContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { LinearGradient } from "expo-linear-gradient";
import { useFriendList } from "@/src/context/FriendListContext";
import SafeView from "@/app/components/appwide/format/SafeView";
import MomentsList from "@/app/components/moments/MomentsList";
import HeaderMoment from "@/app/components/headers/HeaderMoment";

const ScreenMoments = () => {
  const { themeAheadOfLoading } = useFriendList();
  const { themeStyles } = useGlobalStyle();
  const { capsuleList } = useCapsuleList();

  return (
    <SafeView style={{ flex: 1 }}>
      <LinearGradient
        colors={[themeAheadOfLoading.darkColor, themeAheadOfLoading.lightColor]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.container, themeStyles.signinContainer]}
      >
        <HeaderMoment title={"MOMENTS"} />
        <View style={{ flex: 1 }}>{capsuleList && <MomentsList />}</View>
      </LinearGradient>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "101%",
    left: -1,
    padding: 0,
    justifyContent: "space-between",
  },
});

export default ScreenMoments;
