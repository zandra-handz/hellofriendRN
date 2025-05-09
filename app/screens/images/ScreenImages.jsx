import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { useFriendList } from "@/src/context/FriendListContext";
import ImageMenuButton from "@/app/components/images/ImageMenuButton";
import useImageFunctions from "@/src/hooks/useImageFunctions";
import ImagesList from "@/app/components/images/ImagesList";

import { LinearGradient } from "expo-linear-gradient";

const ScreenImages = () => {
  const { imageList } = useImageFunctions();
  const { themeAheadOfLoading, updateSafeViewGradient } = useFriendList();
  updateSafeViewGradient(true);

  return (
    <LinearGradient
      colors={[themeAheadOfLoading.darkColor, themeAheadOfLoading.lightColor]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.container]}
    >
      <View style={{ flex: 1 }}>
        {imageList.length > 0 ? (
          <>
            <ImagesList height={80} width={80} singleLineScroll={false} />
          </>
        ) : (
          <Text></Text>
        )}
      </View>
      <ImageMenuButton />
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

export default ScreenImages;
