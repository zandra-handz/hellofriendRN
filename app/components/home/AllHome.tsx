import React, { useCallback, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import UpNext from "./UpNext";
import GeckoSvg from "@/app/assets/svgs/gecko-solid.svg";
import HomeScrollSoon from "./HomeScrollSoon";
import manualGradientColors from "@/src/hooks/StaticColors";
import Animated, { FadeIn, SlideOutRight } from "react-native-reanimated";
import { useUpcomingHelloes } from "@/src/context/UpcomingHelloesContext";
import { useFriendList } from "@/src/context/FriendListContext";
import { useFriendStyle } from "@/src/context/FriendStyleContext";
import useSelectFriend from "@/src/hooks/useSelectFriend";
import useDeselectFriend from "@/src/hooks/useDeselectFriend";
import useAppNavigations from "@/src/hooks/useAppNavigations";

// Press function is internal
const AllHome = ({
  // friendId, //if this component is ever not wrapped in checking if friend is selected, will need to handle potential deselects
  // lockInCustomString,
  isLoading,
  paddingHorizontal,
  getThemeAheadOfLoading,
  header = "Up next",
  height = "100%",
  borderRadius = 20,
  borderColor = "transparent",
  primaryColor,
  overlayColor,
  lighterOverlayColor,
  darkerOverlayColor,
}) => {
  const { friendList } = useFriendList();
  const { upcomingHelloes } = useUpcomingHelloes();
  const { selectFriend } = useSelectedFriend();
  const { navigateToMoments } = useAppNavigations();

  const { resetTheme } = useFriendStyle();
  const { handleSelectFriend } = useSelectFriend({
    friendList,
    resetTheme,
    getThemeAheadOfLoading,
    selectFriend,
  });

 
  const upcomingId = useMemo(() => {
    if (!upcomingHelloes?.[0]) {
      return;
    }
    return upcomingHelloes[0].friend.id;
  }, [upcomingHelloes]);

  const onPress = () => {
   
    handleSelectFriend(upcomingId);
    // const { id, name } = upcomingHelloes[0].friend;
    // const selectedFriend = id === null ? null : { id: id, name: name };
    // selectFriend(selectedFriend);
    // const friend = friendList.find((friend) => friend.id === id);
    // getThemeAheadOfLoading(friend);
  };

  // console.log("hombutton rerendered");

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
        <View
          style={{
            height: "100%",
            width: "100%",
            flexDirection: "column",
            justifyContent: "space-between",
            overflow: "hidden",
            padding: paddingHorizontal,
          }}
        >
          <UpNext upcomingHelloes={upcomingHelloes} onPress={onPress} />

          <View
            //  entering={SlideInDown}
            // exiting={SlideOutDown}
            style={{
              zIndex: 3,
              flex: 1,
              width: "100%",
              height: 400,
            }}
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
          {/* </Animated.View> */}

          <Animated.View
            entering={FadeIn}
            exiting={SlideOutRight}
            style={{
              position: "absolute",
              right: -56,
              top: 0,
              transform: [{ rotate: "180deg" }],
            }}
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
    minHeight: 190,
    alignContent: "center",
    borderWidth: 0,
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
  },
});

export default AllHome;
