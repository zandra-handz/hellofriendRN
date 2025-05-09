import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useFocusEffect } from "@react-navigation/native"; 
import ButtonInfo from "../buttons/users/ButtonInfo";
import ButtonFriendProfileCircle from "../buttons/friends/ButtonFriendProfileCircle";
import GeckoSolidSvg from "@/app/assets/svgs/gecko-solid.svg";

//icon size for friend settings button is 28

const HellofriendHeader = () => {
  const { themeStyles, setNonCustomHeaderPage } = useGlobalStyle();
  const { selectedFriend, friendLoaded } = useSelectedFriend();

  const ICON_SIZE = 28;

  useFocusEffect(
    React.useCallback(() => {
      setNonCustomHeaderPage(true);
      return () => {
        setNonCustomHeaderPage(false);
      };
    }, [])
  );

  return (
    <View style={[styles.headerContainer, themeStyles.headerContainer]}>
      <View style={styles.leftSection}>
        <View style={styles.userProfile}>
          <ButtonFriendProfileCircle />
        </View>
      </View>

      <View style={styles.middleSection}>
        {selectedFriend && friendLoaded && (
          // <View style={{height: 44, width: 90, flexDirection: 'column', paddingBottom: 10, justifyContent: 'flex-end'}}>
          //       <View style={{transform: [{ rotate: '240deg' }] }}>

          //           <GeckoSolidSvg width={74} height={74} color={themeStyles.genericText.color} />

          //       </View>
          //     </View>

          <View style={{ justifyContent: "center", paddingBottom: 14 }}>
            <View style={{ transform: [{ rotate: "180deg" }] }}>
              <GeckoSolidSvg
                width={50}
                height={50}
                color={themeStyles.genericText.color}
              />
            </View>
          </View>
        )}
        {(!selectedFriend || !friendLoaded) && (
          <Text style={[styles.logoText, themeStyles.headerText]}>HF</Text>
        )}
      </View>

      <View style={styles.rightSection}>
        <View style={styles.userProfile}>
          <ButtonInfo iconSize={ICON_SIZE} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    padding: 10,
    paddingTop: 0, // Adjust as needed // 60
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "space-between",
    height: 80, // Adjust as needed   // 120 ?
  },
  leftSection: {
    flex: 1,
    alignItems: "flex-start",
    top: 0,
  },
  middleSection: {
    flex: 1,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
  },
  rightSection: {
    flex: 1,
    alignItems: "flex-end",
    top: 0,
  },
  headerText: {
    fontSize: 20,
    paddingVertical: 2,
    fontFamily: "Poppins-Regular",
  },
  logoText: {
    fontSize: 22,
    fontFamily: "Poppins-Regular",
  },
  usernameText: {
    fontSize: 18,
    paddingVertical: 2,
    fontFamily: "Poppins-Regular",
    paddingRight: 6,
    paddingBottom: 6,
  },
  userProfile: {
    flexDirection: "row",
    alignItems: "center",
  },
  moreIcon: {
    marginLeft: 10, // Adjust spacing between user icon and three dots
  },
});

export default HellofriendHeader;
