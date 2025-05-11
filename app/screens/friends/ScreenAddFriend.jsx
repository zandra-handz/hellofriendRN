import React from "react";
import { View, StyleSheet } from "react-native";
import ContentAddFriend from "@/app/components/friends/ContentAddFriend";

import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import SafeView from "@/app/components/appwide/format/SafeView";

import HeaderBase from "@/app/components/headers/HeaderBase";

const ScreenAddFriend = () => {
  const { themeStyles } = useGlobalStyle();

  return (
    <SafeView style={{ flex: 1 }}>
      <View style={[styles.container, themeStyles.container]}>
        <HeaderBase headerTitle="Add new friend" />
        <View style={styles.mainContainer}>
          <ContentAddFriend />
        </View>
      </View>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,  
  },
  mainContainer: {
    flex: 1,
    paddingBottom: 10,
  },
});

export default ScreenAddFriend;
