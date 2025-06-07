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
import HomeScrollSoon from "./HomeScrollSoon";

// Press function is internal
const HomeButtonUpNext = ({
  header = "Up next",
  height = "100%",
  maxHeight = 100,
  borderRadius = 20,
  borderColor = "transparent",
}) => {
  const { upcomingHelloes, isLoading } = useUpcomingHelloes();
  const { friendList, friendListLength, getThemeAheadOfLoading } =
    useFriendList();
  const { themeStyles, appFontStyles, themeStyleSpinners, manualGradientColors } =
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
          overflow: 'hidden',
          // maxHeight: maxHeight,
        },
      ]}
    >
      {/* <LinearGradient
       // colors={[darkColor, lightColor]}
         colors={['transparent', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          ...StyleSheet.absoluteFillObject,
        }}
      /> */}
      {loadingNewFriend ||
        (isLoading && (
          <View style={styles.loadingWrapper}>
            <LoadingPage
              loading={loadingNewFriend || isLoading}
              spinnerSize={30}
              color="#000002"
              spinnerType={themeStyleSpinners?.homeScreen}
            />
          </View>
        ))}

      {!loadingNewFriend && !isLoading && (
        <View
          style={{
            height: "100%",
            width: "100%",
            flexDirection: "column",
            justifyContent: "space-between",
            overflow: 'hidden',
          }}
        >
          <View style={{width: '100%', height: 200}}></View>
          <TouchableOpacity onPress={onPress} style={[styles.textContainer]}>
            <Text style={[styles.headerText, appFontStyles.welcomeText]}>{header}</Text>

            <Text
              style={[appFontStyles.welcomeText,
                {
                  color: themeStyles.primaryBackground.backgroundColor,
                  
                
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

            <Text style={[styles.subtitleText, appFontStyles.subWelcomeText]}>
              Say hi on{" "}
              {upcomingHelloes && !isLoading && upcomingHelloes[0]
                ? upcomingHelloes[0].future_date_in_words
                : ""}
              !
            </Text>
          </TouchableOpacity>
          <View
            style={{
              zIndex: 30000,
              height: '100%', 
              width: "100%",
              marginTop: 140,
            }}
          >
            <HomeScrollSoon
              height={"100%"}
              maxHeight={700}
              borderRadius={10}
              borderColor="black"
            />
          </View>
          <View
            style={{
              position: "absolute",
              right: -56,
              top: 120,
              transform: [{ rotate: "180deg" }],
          
            }}
          >
            <GeckoSvg color={manualGradientColors.homeDarkColor} width={200} height={200} />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    padding: 10,
    minHeight: 190,
    alignContent: "center", 
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
    top: 200,
    flexDirection: "column",
    width: "100%",
    justifyContent: "space-around",
  },
  headerText: {
    // fontFamily: "Poppins-Regular",
    // fontWeight: "bold",
    // fontSize: 20,
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
