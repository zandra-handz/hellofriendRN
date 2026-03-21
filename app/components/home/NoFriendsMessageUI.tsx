import { View, Text, StyleSheet } from "react-native";
import React from "react"; 
import useAppNavigations from "@/src/hooks/useAppNavigations";
import GlobalPressable from "../appwide/button/GlobalPressable";
import SvgIcon from "@/app/styles/SvgIcons"; 
const NoFriendsMessageUI = ({
  primaryColor,
  backgroundColor,
  welcomeTextStyle,
  username,
  userCreatedOn,
}) => {
  const { navigateToAddFirstFriend } = useAppNavigations();

  // const ICON_SIZE = 100;
 

  return (
    <View
      style={
         styles.container}
    >
      <>
      <Text
        style={[
          welcomeTextStyle,
          { color: primaryColor },
        ]}
      >
        {new Date(userCreatedOn).toDateString() === new Date().toDateString()
          ? `Hi ${username}!`
          : `Hi ${username}!`}
      </Text>
      <Text style={[welcomeTextStyle, { color: primaryColor, fontSize: 20 }]}>
        Add a friend to get started.
      </Text> 
      </>
      <GlobalPressable onPress={navigateToAddFirstFriend} style={styles.pressable}>
        <SvgIcon name={`plus`} size={30} color={primaryColor}/>
      </GlobalPressable>
   
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 200,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "column", 
   // backgroundColor: 'green'
  },
  pressable: {
    height: 40,
    width: 40,
    marginTop: 40
  }
});

export default NoFriendsMessageUI;
