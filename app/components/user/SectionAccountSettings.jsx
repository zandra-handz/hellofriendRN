import React, { useState } from "react";
import { View,   StyleSheet } from "react-native"; 
import { useNavigation } from "@react-navigation/native";
import NoToggle from "./NoToggle"; 

import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

const SectionAccountSettings = () => {
  const { themeStyles } = useGlobalStyle();
  const [isMakingCall, setIsMakingCall] = useState(false);
  const navigation = useNavigation();

  const navigateToUserDetails = () => {
    if (selectedFriend) {
      navigation.navigate("UserDetails");
    }
  };

  return (
    <View
      style={{
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        padding: 0,
        width: "100%",
        alignSelf: "flex-start",
      }}
    >
      <NoToggle
        label="Account"
        icon={
          <MaterialCommunityIcons
            name={"account"}
            size={20}
            color={themeStyles.primaryText.color}
          />
        }
        onPress={() => navigation.navigate("UserDetails")}
      />

      <NoToggle
        label="Password"
        icon={
          <MaterialIcons
            name={"password"}
            size={20}
            color={themeStyles.primaryText.color}
          />
        }
        onPress={() => navigation.navigate("UserDetails")}
      />
      <NoToggle
        label="Delete Account"
        icon={
          <MaterialCommunityIcons
            name={"delete"}
            size={20}
            color={themeStyles.primaryText.color}
          />
        }
        onPress={() => navigation.navigate("UserDetails")}
      /> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    padding: 0, // changed this from ModalColorTheme
    width: "100%",
    alignSelf: "flex-start",
  },
  accountSettingsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    width: "100%",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  icon: {
    marginRight: 10,
    marginLeft: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    marginLeft: 5,
    marginRight: 10,
  },
});

export default SectionAccountSettings;
