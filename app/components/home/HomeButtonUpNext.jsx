import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useFriendList } from "@/src/context/FriendListContext";
import { useUpcomingHelloes } from "@/src/context/UpcomingHelloesContext";

import LoadingPage from "../appwide/spinner/LoadingPage";
import LizardSvg from "@/app/assets/svgs/lizard";
import GeckoSvg from "@/app/assets/svgs/gecko-solid.svg";

// Press function is internal
const HomeButtonUpNext = ({
  header = "UP NEXT",
  height = "100%",
  maxHeight = 100,
  borderRadius = 20,
  borderColor = "transparent",
}) => {
  const { upcomingHelloes, isLoading } = useUpcomingHelloes();
  const { friendList, friendListLength, getThemeAheadOfLoading } =
    useFriendList();
  const { themeStyles, themeStyleSpinners, manualGradientColors } =
    useGlobalStyle();
  const { darkColor, lightColor } = manualGradientColors;
  const { setFriend, loadingNewFriend } = useSelectedFriend();

  const onPress = () => {
    const { id, name } = upcomingHelloes[0].friend;
    const selectedFriend = id === null ? null : { id: id, name: name };
    setFriend(selectedFriend);
    const friend = friendList.find((friend) => friend.id === id);
    getThemeAheadOfLoading(friend);
  };

  return (
    <View
      style={[
        styles.container,
        {
          borderRadius: borderRadius,
          borderColor: borderColor,
          height: height,
          maxHeight: maxHeight,
        },
      ]}
    >
      <LinearGradient
        colors={[darkColor, lightColor]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          ...StyleSheet.absoluteFillObject,
        }}
      />
      {loadingNewFriend ||
        (isLoading && (
          <View style={styles.loadingWrapper}>
            <LoadingPage
              loading={loadingNewFriend || isLoading}
              spinnerSize={70}
              color="#000002"
              spinnerType={themeStyleSpinners?.homeScreen}
            />
          </View>
        ))}

      {!loadingNewFriend && !isLoading && (
        <TouchableOpacity
          onPress={onPress}
          style={{ height: "100%", width: "100%" }}
        >
          <View style={styles.textContainer}>
            <Text style={styles.headerText}>{header}</Text>

            <Text
              style={[
                {
                  color: themeStyles.genericTextBackground.backgroundColor,
                  fontSize: 18,
                },
              ]}
            >
              {upcomingHelloes &&
              friendListLength &&
              !isLoading &&
              upcomingHelloes[0]
                ? upcomingHelloes[0].friend.name
                : "Please add a friend to use this feature!"}
            </Text>

            <Text style={styles.subtitleText}>
              {upcomingHelloes && !isLoading && upcomingHelloes[0]
                ? upcomingHelloes[0].future_date_in_words
                : ""}
            </Text>
          </View>
          {/* <View
            style={{
              position: "absolute",
              right: -66,
              top: -66,
              transform: [{ rotate: "240deg" }],
            }}
          >
            <LizardSvg color={"black"} width={180} height={180} />
          </View> */}
                    <View
            style={{
              position: "absolute",
              right: -56,
              top: -76,
              transform: [{ rotate: "180deg" }],
            }}
          >
            <GeckoSvg color={"black"} width={200} height={200} />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    padding: "5%",
    minHeight: 190,
    alignContent: "center",
    marginVertical: "1%",
    borderWidth: 0,
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
  },
  loadingWrapper: {
    flex: 1,
    width: "100%",
  },
  textContainer: {
    zIndex: 5,
    position: "absolute",
    paddingLeft: "2%",
    paddingRight: "16%",
    flexDirection: "column",
    width: "100%",
    justifyContent: "space-around",
  },
  headerText: {
    fontFamily: "Poppins-Regular",
    fontSize: 28,
  },
  subtitleText: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeButtonUpNext;
