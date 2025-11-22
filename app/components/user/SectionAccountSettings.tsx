import React from "react";
import { View, StyleSheet, ColorValue } from "react-native"; 
import NoToggle from "./NoToggle";
import SvgIcon from "@/app/styles/SvgIcons";


type Props = {
  primaryColor: ColorValue;
}

const SectionAccountSettings = ({ primaryColor }: Props) => {
 

  return (
    <View style={styles.container}>
      <NoToggle
        primaryColor={primaryColor}
        label="Account"
        icon={<SvgIcon name={"account"} size={20} color={primaryColor} />}
        onPress={() => console.log("nothing here yet")}
      />

      <NoToggle
         primaryColor={primaryColor}
        label="Password"
        icon={<SvgIcon name={"lock_outline"} size={20} color={primaryColor} />}
        onPress={() => console.log("nothing here yet")}
      />
      <NoToggle
         primaryColor={primaryColor}
        label="Delete Account"
        icon={<SvgIcon name={"delete"} size={20} color={primaryColor} />}
        onPress={() => console.log("nothing here yet")}
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
