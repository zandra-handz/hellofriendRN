import { View, Pressable, StyleSheet, Dimensions } from "react-native";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";

import manualGradientColors from "@/app/styles/StaticColors";
// import { useFriendList } from "@/src/context/FriendListContext";
import FriendListUI from "@/app/components/alerts/FriendListUI";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";

// import { useUserSettings } from "@/src/context/UserSettingsContext";
import { useFriendStyle } from "@/src/context/FriendStyleContext";
import { useLDTheme } from "@/src/context/LDThemeContext";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import { useUser } from "@/src/context/UserContext";
import useUpdateSettings from "@/src/hooks/SettingsCalls/useUpdateSettings";
import useSelectFriend from "@/src/hooks/useSelectFriend";
import { useFriendListAndUpcoming } from "@/src/context/FriendListAndUpcomingContext";
import { deselectFriendFunction } from "@/src/hooks/deselectFriendFunction";
import { useQueryClient } from "@tanstack/react-query";
import { useAutoSelector } from "@/src/context/AutoSelectorContext";
import SvgIcon from "@/app/styles/SvgIcons";
import Animated, {
  withTiming,
  withSpring,
  useDerivedValue,
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
} from "react-native-reanimated";

import { ColorValue } from "react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

import { LinearGradient } from "expo-linear-gradient";
import ScreenAddImage from "../images/ScreenAddImage";
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const ScreenSelectFriend = (
  {
    // navigationDisabled = false
  }
) => {
  const { lightDarkTheme } = useLDTheme();
  const { autoSelectFriend } = useAutoSelector();

  const { friendListAndUpcoming } = useFriendListAndUpcoming();
  const friendList = friendListAndUpcoming?.friends;
  const queryClient = useQueryClient();
  // 🔹 Shared values for circle position
  const touchLocationX = useSharedValue(-999);
  const touchLocationY = useSharedValue(-999);
  const visibility = useSharedValue(0);

  const friendColors = useSharedValue(["#4caf50", "#a0f143"]);

  const { user } = useUser();

  const { getThemeAheadOfLoading, themeAheadOfLoading, resetTheme } =
    useFriendStyle();
  const { selectedFriend, selectFriend } = useSelectedFriend();
  const { updateSettings } = useUpdateSettings({ userId: user?.id });

  const toggleLockOnFriend = (id) => {
    // if (id !== selectedFriend?.id) {
    //   handleSelectFriend(id);
    // }
    updateSettings({ lock_in_custom_string: id });
  };

  const handleDeselect = useCallback(() => {
    deselectFriendFunction({
      userId: user?.id,
      queryClient: queryClient,
      updateSettings: updateSettings,
      friendId: selectedFriend?.id,
      autoSelectFriend: autoSelectFriend,
      selectFriend: selectFriend,
      resetTheme: resetTheme,
      getThemeAheadOfLoading: getThemeAheadOfLoading,
    });
  }, [
    user?.id,
    queryClient,
    autoSelectFriend,
    updateSettings,
    selectedFriend?.id,
    selectFriend,
    resetTheme,
    getThemeAheadOfLoading,
  ]);

  const locale = "en-US";
  const { navigateBack, navigateToHome } = useAppNavigations();

  // usememo is not actually doing anything since dependency is a list...
  const alphabFriendList: object[] = useMemo(() => {
    if (!friendList || !(friendList?.length > 0)) {
      return [];
    }
    const summaryOfSorted = friendList
      .slice()
      .sort((a, b) =>
        a.name.localeCompare(b.name, locale, { sensitivity: "case" })
      );

    if (!summaryOfSorted || !(summaryOfSorted.length > 0)) {
      return [];
    }

    return summaryOfSorted;
  }, [friendList]);

  // useEffect(() => {
  //   console.log("touch locations changed!");
  //   if (touchLocationX !== -999 && touchLocationY !== -999) {
  //     visibility.value = withTiming(1, { duration: 80 });
  //     scale.value = withTiming(20, { duration: 1000 });
  //   } else {
  //     visibility.value = withTiming(1, { duration: 80 });
  //     scale.value = withTiming(0, { duration: 3000 });
  //   }
  // }, [touchLocationX, touchLocationY]);

  const [gradientColors, setGradientColors] = useState<
    [ColorValue, ColorValue]
  >(["#4caf50", "#a0f143"]);
  const screenDiagonal = Math.sqrt(screenWidth ** 2 + screenHeight ** 2);
  // useEffect(() => {
  //   console.warn("touch changed");
  //   // const screenDiagonal = Math.sqrt(screenWidth ** 2 + screenHeight ** 2);

  //   if (touchLocationX !== -999 && touchLocationY !== -999 && friendColors) {
  //     visibility.value = withTiming(1, { duration: 80 });
  //     scale.value = withTiming(screenDiagonal, { duration: 2000 });
  //     setGradientColors(friendColors.value);
  //     console.log("setting colors: ", friendColors.value);
  //   } else {
  //     visibility.value = withTiming(0, { duration: 300 });
  //     scale.value = withTiming(circleSize, { duration: 300 });
  //   }
  // }, [touchLocationX, touchLocationY, friendColors]);

  const scale = useSharedValue(0);

  const animatedGradientProps = useAnimatedProps(() => ({
    colors: friendColors.value.length >= 2
      ? (friendColors.value as [ColorValue, ColorValue])
      : ['#4caf50', '#a0f143'], // fallback
  })) as any; // ✅ cast to any to satisfy TS
 
 

  const animatedCircleStyle = useAnimatedStyle(() => {
    
    // calculate size: either initial or full screen
    const size = scale.value; // scale.value could be initial 50 -> full screen

    // adjust position so the circle expands from touch point
    const left = touchLocationX.value - size / 2;
    const top = touchLocationY.value - size / 2;

    return {
      // position: "absolute",
      top,
      left,
      width: size,
      height: size,
     // borderRadius: size / 2, // keep circle shape
      borderRadius: 999,
      backgroundColor: "rgba(255,255,255,0.4)",
      opacity: visibility.value,
    };
  }, [scale, visibility, touchLocationX, touchLocationY]);

  const { handleSelectFriend } = useSelectFriend({
    friendList,
    resetTheme,
    getThemeAheadOfLoading,
    selectFriend,
    navigateOnSelect: navigateToHome,
    //   navigateOnSelect: undefined,
  });

  const flattenedTopBarStyle = StyleSheet.flatten([
    {
      backgroundColor: lightDarkTheme.primaryBackground,
    },
    styles.topBar,
  ]);

  const direction = [0, 0,  1, 0];

  return (
    <>
      <SafeViewAndGradientBackground
        friendColorLight={manualGradientColors.lightColor}
        friendColorDark={manualGradientColors.darkColor}
        backgroundOverlayColor={lightDarkTheme.primaryBackground}
        friendId={false}
        style={styles.safeViewContainer}
      >
        <Animated.View
          style={[
            animatedCircleStyle,
            ,
            {
              position: "absolute",
              overflow: "hidden",
              borderRadius: 999,

              width: 10,
              height: 10,
              //  zIndex: 40000,
              backgroundColor: "red",
        
            },
          ]}
        >
          <AnimatedLinearGradient
            //  animatedProps={animatedGradientProps }
            colors={gradientColors}
            start={{ x: direction[0], y: direction[1] }}
            end={{ x: direction[2], y: direction[3] }}
            style={[StyleSheet.absoluteFill ]}
          />
        </Animated.View>
        <View style={flattenedTopBarStyle}>
          <Pressable
            hitSlop={30}
            onPress={navigateBack}
            onLongPress={handleDeselect}
            style={styles.topBarButton}
          >
            <SvgIcon
              name={"chevron_left"}
              size={20}
              color={lightDarkTheme.primaryText}
            />
          </Pressable>
          <SvgIcon
            name="account_switch_outline"
            size={26}
            color={lightDarkTheme.primaryText}
          />
        </View>
        <View style={styles.friendsListWrapper}>
          {alphabFriendList && (
            <FriendListUI
              touchLocationX={touchLocationX}
              touchLocationY={touchLocationY}
              friendColors={friendColors}
              visibility={visibility}
              scale={scale}
              setGradientColors={setGradientColors}
              screenDiagonal={screenDiagonal}
              autoSelectFriend={autoSelectFriend}
              handleDeselect={handleDeselect}
              themeAheadOfLoading={themeAheadOfLoading}
              friendList={friendList}
              lightDarkTheme={lightDarkTheme}
              data={alphabFriendList}
              friendId={selectedFriend ? selectedFriend?.id : null}
              onPress={handleSelectFriend}
              onLongPress={toggleLockOnFriend}
            />
          )}
        </View>
      </SafeViewAndGradientBackground>
    </>
  );
};

const styles = StyleSheet.create({
  safeViewContainer: {
    paddingHorizontal: 10,
    flex: 1,
  },
  topBar: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginVertical: 10,
  },
  topBarButton: {
    position: "absolute",
    left: 0,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: 60,
  },
  friendsListWrapper: {
    width: "100%",
    flex: 1,
  },
});

export default ScreenSelectFriend;
