import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
 
import { useNavigation, useRoute } from "@react-navigation/native";
import { useLocations } from "@/src/context/LocationsContext";

import ContentAddLocation from "@/app/components/locations/ContentAddLocation";

import { LinearGradient } from "expo-linear-gradient";
import { useFriendList } from "@/src/context/FriendListContext";

const ScreenAddLocation = () => {
  const route = useRoute();
  const location = route.params?.location ?? null;

  const navigation = useNavigation();
 
  const { themeAheadOfLoading   } = useFriendList();
 

  const { createLocationMutation } = useLocations();

  useEffect(() => {
    if (createLocationMutation.isSuccess) {
      navigation.goBack();
    }
  }, [createLocationMutation]);

  return (
    <LinearGradient
      colors={[themeAheadOfLoading.darkColor, themeAheadOfLoading.lightColor]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.container]}
    >
      <ContentAddLocation title={location.title} address={location.address} />
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

export default ScreenAddLocation;
