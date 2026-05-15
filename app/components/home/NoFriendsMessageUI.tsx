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
        <GlobalPressable onPress={navigateToAddFirstFriend} style={styles.pressable}>
        {/* <SvgIcon name={`plus`} size={30} color={primaryColor}/> */}
         <Text style={[ { color: primaryColor, fontSize: 18, fontWeight: 'bold' }]}>
        Add a friend to get started.
      </Text> 
      </GlobalPressable>
      </>
    
   
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 100,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "column", 
   // backgroundColor: 'green'
  },
  pressable: {
    height: 40,
    width: '100%',
    marginTop: 0
  }
});

export default NoFriendsMessageUI;
