import React, { useCallback, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import UpNext from "./UpNext";
import GeckoSvg from "@/app/assets/svgs/gecko-solid.svg";
import HomeScrollSoon from "./HomeScrollSoon";
import manualGradientColors from "@/app/styles/StaticColors";
import Animated, { FadeIn, SlideOutRight } from "react-native-reanimated";

import useSelectFriend from "@/src/hooks/useSelectFriend";
// import { useFriendListAndUpcoming } from "@/src/context/FriendListAndUpcomingContext";

import useFriendListAndUpcoming from "@/src/hooks/usefriendListAndUpcoming";
// Press function is internal
const AllHome = ({
  // friendId, //if this component is ever not wrapped in checking if friend is selected, will need to handle potential deselects
  // lockInCustomString,
  userId,
  isLoading,
  height = "100%",
  borderRadius = 20,
  borderColor = "transparent",
  primaryColor,
  overlayColor,
  lighterOverlayColor,
  darkerOverlayColor,
}) => {
  // const { friendList } = useFriendList();
  // const { upcomingHelloes } = useUpcomingHelloes();

  const { friendListAndUpcoming } = useFriendListAndUpcoming({
    userId: userId,
  });
  const friendList = friendListAndUpcoming?.friends;
  const upcomingHelloes = friendListAndUpcoming?.upcoming;
  const upcomingId = friendListAndUpcoming?.next?.id;
  // const capsuleSummaries = friendListAndUpcoming?.capsule_summaries

  // console.log(capsuleSummaries)

  const { handleSelectFriend } = useSelectFriend({
    userId,
    friendList,
  });

  // const upcomingId = useMemo(() => {
  //   if (!upcomingHelloes?.[0]) {
  //     return;
  //   }
  //   return upcomingHelloes[0].friend.id;
  // }, [upcomingHelloes]);

  const onPress = () => {
    handleSelectFriend(upcomingId);
  };

  return (
    <View
      style={[
        styles.container,
        {
          borderRadius: borderRadius,
          borderColor: borderColor,
          height: height,
        },
      ]}
    >
      {upcomingHelloes && ( //used tp be isLoading
        <View style={styles.upNextWrapper}>
          <UpNext upcomingHelloes={upcomingHelloes} onPress={onPress} />

          <View
            style={styles.soonWrapper}
          >
            <HomeScrollSoon
              lighterOverlayColor={lighterOverlayColor}
              darkerOverlayColor={darkerOverlayColor}
              upcomingHelloes={upcomingHelloes}
              isLoading={isLoading}
              handleSelectFriend={handleSelectFriend}
              friendList={friendList}
              primaryColor={primaryColor}
              overlayColor={overlayColor}
              height={"100%"}
              maxHeight={700}
              borderRadius={10}
              borderColor="black"
            />
          </View> 

          <Animated.View
            entering={FadeIn}
            exiting={SlideOutRight}
            style={styles.geckoTransformer}
          >
            <GeckoSvg
              color={manualGradientColors.homeDarkColor}
              width={200}
              height={200}
            />
          </Animated.View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",

    width: "100%",
    padding: 0,
    marginTop: 40,
    minHeight: 190,
    alignContent: "center",
    borderWidth: 0,
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
    // backgroundColor: 'red',
  },
  upNextWrapper: {
    height: "100%",
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
    overflow: "hidden",
  },
  soonWrapper: {
    zIndex: 3,
    flex: 1,
    width: "100%",
    height: 400,
  },
  geckoTransformer: {
          position: "absolute",
              right: -56,
              top: 0,
              transform: [{ rotate: "180deg" }],
  }
});

export default AllHome;
