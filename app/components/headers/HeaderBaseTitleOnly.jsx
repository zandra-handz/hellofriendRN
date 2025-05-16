import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { useUser } from "@/src/context/UserContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useFriendList } from "@/src/context/FriendListContext";

const HeaderBaseTitleOnly = () => {
  const { user } = useUser();
  const { themeStyles } = useGlobalStyle();
  const { themeAheadOfLoading } = useFriendList();

  return (
    <View
      style={[
        styles.headerContainer,
        themeStyles.headerContainer,
        { backgroundColor: themeAheadOfLoading.darkColor },
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "flex-start",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={[
            styles.headerText,
            themeStyles.headerText,
            {
              color: themeAheadOfLoading.fontColor,
              paddingLeft: 0,
            },
          ]}
        >
          {`Setting up account for ${user.user.username}`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    padding: 10,
    paddingTop: 66, //FOR TEST BUILD: 12 For dev: 66
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "space-between",
    height: 110, //FOR TEST BUILD: 60 (or 56?) //For dev: 110
  },
  headerText: {
    fontSize: 18,
    paddingVertical: 2,
    fontFamily: "Poppins-Bold",
  },
  usernameText: {
    fontSize: 14,
    paddingVertical: 2,
    fontFamily: "Poppins-Bold",
  },
});

export default HeaderBaseTitleOnly;
