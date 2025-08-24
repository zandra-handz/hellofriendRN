import { View, Text } from "react-native";
import React from "react";
import SmallAddButton from "./SmallAddButton";
import { useNavigation } from "@react-navigation/native";
import useAppNavigations from "@/src/hooks/useAppNavigations";

const NoFriendsMessageUI = ({
  manualGradientColors,
  backgroundColor,
  primaryTextStyle,
  welcomeTextStyle,
  username,
  userCreatedOn,
}) => {
  const navigation = useNavigation();

  const { navigateToAddFriend } = useAppNavigations();

  const ICON_SIZE = 64;
  const BUTTON_SIZE = ICON_SIZE + ICON_SIZE * 0.5;
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
      <Text style={[primaryTextStyle, welcomeTextStyle, { fontSize: 60, lineHeight:90}]}>
        {new Date(userCreatedOn).toDateString() === new Date().toDateString()
          ? `Hi ${username}!`
          : `Hi ${username}!`}
      </Text>
      <Text
        style={[
          primaryTextStyle,
         welcomeTextStyle, { fontSize: 20}
        ]}
      >
        Add a friend to get started
      </Text>
      <View style={{ marginVertical: 20 }}>
        <SmallAddButton
          size={ICON_SIZE}
          manualGradientColors={manualGradientColors}
          primaryColor={primaryTextStyle.color}
          primaryBackground={backgroundColor}
          label={"Add friend"}
          onPress={navigateToAddFriend}
        />
      </View>
    </View>
  );
};

export default NoFriendsMessageUI;
