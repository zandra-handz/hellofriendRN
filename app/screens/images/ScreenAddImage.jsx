import React from "react";
import { View, StyleSheet } from "react-native";
import SafeView from "@/app/components/appwide/format/SafeView";
import HeaderBase from "@/app/components/headers/HeaderBase";

// state
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import ContentAddImage from "@/app/components/images/ContentAddImage";

// nav
import { useRoute } from "@react-navigation/native";

const ScreenAddImage = () => {
  const route = useRoute();
  const imageUri = route.params?.imageUri ?? false;

  const { themeStyles } = useGlobalStyle();

  return (
    <SafeView style={{ flex: 1 }}>
      <View style={[styles.container, themeStyles.container]}>
        <HeaderBase headerTitle="Upload" navigateTo="Images" icon="image" />
        <ContentAddImage imageUri={imageUri} />
      </View>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ScreenAddImage;
