import React from "react";
import { View, StyleSheet } from "react-native";
import ContentAddFriend from "@/app/components/friends/ContentAddFriend";
import GlobalAppHeader from "@/app/components/headers/GlobalAppHeader";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import SafeView from "@/app/components/appwide/format/SafeView";
 

const ScreenAddFriend = () => {
  const { themeStyles } = useGlobalStyle();

  return (
    <SafeView style={{ flex: 1 }}>
      <View style={[styles.container, themeStyles.container]}>
        <GlobalAppHeader title={'Add new friend'} /> 
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
