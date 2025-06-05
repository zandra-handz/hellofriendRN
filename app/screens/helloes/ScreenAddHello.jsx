import React from "react";
import { StyleSheet } from "react-native";
import ContentAddHello from "@/app/components/helloes/ContentAddHello";
import { LinearGradient } from "expo-linear-gradient";
import { useFriendList } from "@/src/context/FriendListContext";
import SafeView from "@/app/components/appwide/format/SafeView"; 
import GlobalAppHeaderIconVersion from "@/app/components/headers/GlobalAppHeaderIconVersion";
 
import { MaterialCommunityIcons } from "@expo/vector-icons";

const ScreenAddHello = () => {
  const { themeAheadOfLoading } = useFriendList();

  return (
    <SafeView styles={[{ flex: 1 }]}>
      <LinearGradient
        colors={[themeAheadOfLoading.darkColor, themeAheadOfLoading.lightColor]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.container]}
      >
        <GlobalAppHeaderIconVersion
          title={"Add hello for"}
          navigateTo="Helloes"
          icon={
            <MaterialCommunityIcons
              name="hand-wave-outline"
              size={30}
              color={themeAheadOfLoading.fontColorSecondary}
            />
          }
        />

        <ContentAddHello />
      </LinearGradient>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "space-between",
    height: "100%",
  },
});

export default ScreenAddHello;
