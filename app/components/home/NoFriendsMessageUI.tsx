import { View, Text } from "react-native";
import React from "react";
import SmallAddButton from "./SmallAddButton"; 
import useAppNavigations from "@/src/hooks/useAppNavigations";
import { manualGradientColors } from "@/src/hooks/StaticColors";
const NoFriendsMessageUI = ({
 
  primaryColor,
  backgroundColor, 
  welcomeTextStyle,
  username,
  userCreatedOn,
}) => { 

  const { navigateToAddFriend } = useAppNavigations();

  const ICON_SIZE = 100;
 
  const EYEBALL_BOTTOM_PADDING = 60;

  return (
    <View
      style={{
        width: "100%",
        flex: 1,
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",

        backgroundColor: backgroundColor,
        paddingBottom: EYEBALL_BOTTOM_PADDING,
        paddingHorizontal: 10,
       
      }}
    >
      <Text style={[ welcomeTextStyle, { color: primaryColor, fontSize: 60, lineHeight:90}]}>
        {new Date(userCreatedOn).toDateString() === new Date().toDateString()
          ? `Hi ${username}!`
          : `Hi ${username}!`}
      </Text>
      <Text
        style={[ 
         welcomeTextStyle, { color: primaryColor, fontSize: 20}
        ]}
      >
        Add some friends to get started
      </Text>
      <View style={{ marginVertical: 20 }}>
        <SmallAddButton
          size={ICON_SIZE} 
          primaryColor={primaryColor}
          primaryBackground={backgroundColor}
          label={"Add friend"}
          onPress={navigateToAddFriend}
        />
      </View>
    </View>
  );
};

export default NoFriendsMessageUI;
