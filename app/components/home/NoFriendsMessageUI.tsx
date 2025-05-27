import { View, Text } from "react-native";
import React from "react";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import SmallAddButton from "./SmallAddButton";
import { useNavigation } from "@react-navigation/native";

const NoFriendsMessageUI = ({ username, userCreatedOn }) => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyle();
  const navigation = useNavigation();

  return (
    <View style={appContainerStyles.screenContainer}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          height: "auto",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            height: "100%",
            alignItems: "center",
            textAlignVertical: "top",
          }}
        >
          <Text style={[appFontStyles.welcomeText, themeStyles.genericText]}>
            {new Date(userCreatedOn).toDateString() ===
            new Date().toDateString()
              ? `Hi ${username}!`
              : `Hi ${username}!`}
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "column",
          height: "100%",
          alignItems: "center",
        }}
      >
        <Text
          style={[
            themeStyles.genericText,
            {
              fontSize: 15,
              lineHeight: 32,

              fontFamily: "Poppins-Regular",
            },
          ]}
        >
          Please add one or more friends to use this app!
        </Text>
        <SmallAddButton
          label={"Add friend"}
          onPress={() => navigation.navigate("AddFriend")}
        />
      </View>
    </View>
  );
};

export default NoFriendsMessageUI;
