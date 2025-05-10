import React from "react";
import { StyleSheet } from "react-native";
import { useFriendList } from "@/src/context/FriendListContext";
import { useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import SafeView from "@/app/components/appwide/format/SafeView";
import ContentMomentFocus from "@/app/components/moments/ContentMomentFocus";
import HeaderMoment from "@/app/components/headers/HeaderMoment";

const ScreenMomentFocus = () => {
  const route = useRoute();
  const momentText = route.params?.momentText ?? null;
  const updateExistingMoment = route.params?.updateExistingMoment ?? false;
  const existingMomentObject = route.params?.existingMomentObject ?? null;
  const { themeAheadOfLoading } = useFriendList();

  return (
    <SafeView styles={{ flex: 1 }}>
      <LinearGradient
        colors={[themeAheadOfLoading.darkColor, themeAheadOfLoading.lightColor]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.container]}
      >
        <HeaderMoment writeView={true} />
        <ContentMomentFocus
          momentText={momentText || null}
          updateExistingMoment={updateExistingMoment}
          existingMomentObject={existingMomentObject}
        />
      </LinearGradient>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: "100%",
    justifyContent: "space-between",
  },
});

export default ScreenMomentFocus;
