import React from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import NoToggle from "./NoToggle";
import SvgIcon from "@/app/styles/SvgIcons";

const SectionAccountSettings = ({ primaryColor }) => {
  const navigation = useNavigation();

  return (
    <View
      style={styles.container}
    >
      <NoToggle
        primaryColor={primaryColor}
        label="Account"
        icon={<SvgIcon name={"account"} size={20} color={primaryColor} />}
        onPress={() => navigation.navigate("UserDetails")}
      />

      <NoToggle
        label="Password"
        icon={<SvgIcon name={"lock_outline"} size={20} color={primaryColor} />}
        onPress={() => navigation.navigate("UserDetails")}
      />
      <NoToggle
        label="Delete Account"
        icon={<SvgIcon name={"delete"} size={20} color={primaryColor} />}
        onPress={() => navigation.navigate("UserDetails")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignSelf: "flex-start",
  },
});

export default SectionAccountSettings;
