import React from "react";
import { StyleSheet } from "react-native"; 
import { useFriendList } from "@/src/context/FriendListContext";
import { useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

import ContentMomentFocus from "@/app/components/moments/ContentMomentFocus";

const ScreenMomentFocus = () => {
  const route = useRoute();
  const momentText = route.params?.momentText ?? null;
  const updateExistingMoment = route.params?.updateExistingMoment ?? false;
  const existingMomentObject = route.params?.existingMomentObject ?? null;
  const { themeAheadOfLoading, updateSafeViewGradient  } = useFriendList();

   updateSafeViewGradient(true);

  return (
    <LinearGradient
      colors={[themeAheadOfLoading.darkColor, themeAheadOfLoading.lightColor]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.container]}
    >
      <ContentMomentFocus
        momentText={momentText || null}
        updateExistingMoment={updateExistingMoment}
        existingMomentObject={existingMomentObject}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "space-between",
  },
});

export default ScreenMomentFocus;
