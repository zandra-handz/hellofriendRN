import { View, StyleSheet, FlatList, ListRenderItemInfo } from "react-native";
import React, { useCallback, useEffect, useRef } from "react";
import OptionFriendButton from "../headers/OptionFriendButton";
import { Vibration } from "react-native";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import { Friend } from "@/src/types/FriendTypes";
import manualGradientColors from "@/app/styles/StaticColors";
import SvgIcon from "@/app/styles/SvgIcons";
import BouncyEntranceDown from "../headers/BouncyEntranceDown";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import useUserSettings from "@/src/hooks/useUserSettings";

type FriendListItem = Friend | { message: string };

const STAGGER_SPEED = 20;
const EXIT_DURATION = 180;

// const BouncyEntranceDown = ({ children, delay = 0, style }) => {
//   const translateY = useSharedValue(-60);

//   const animatedStyle = useAnimatedStyle(() => ({
//     transform: [{ translateY: translateY.value }],
//   }));

//   useEffect(() => {
//     translateY.value = withTiming(-60, { duration: 0 });
//     translateY.value = withDelay(
//       delay,
//       withSpring(0, {
//         damping: 20,
//         stiffness: 150,
//         mass: 0.2,
//         overshootClamping: false,
//       }),
//     );
//   }, []);

//   return (
//     <Animated.View pointerEvents="auto" style={[animatedStyle, style]}>
//       {children}
//     </Animated.View>
//   );
// };

const FriendIndicators = ({ friendId, pinnedFriend, upcomingFriend }) => {
  const isPinned = pinnedFriend === friendId;
  const isUpcoming = upcomingFriend === friendId;

  return (
    <View style={styles.itemIndicatorContainer}>
      {isPinned && (
        <View
          style={[
            styles.indicator,
            { backgroundColor: manualGradientColors.homeDarkColor },
          ]}
        >
          <SvgIcon
            name="pin_outline"
            size={12}
            color={manualGradientColors.lightColor}
          />
        </View>
      )}
      {isUpcoming && (
        <View
          style={[
            styles.indicator,
            { backgroundColor: manualGradientColors.homeDarkColor },
          ]}
        >
          <SvgIcon
            name="calendar_clock"
            size={12}
            color={manualGradientColors.lightColor}
          />
        </View>
      )}
    </View>
  );
};

const FriendListUI = ({
  userId,
  friendColorLight,
  friendList,
  handleNavAfterSelect,
  data,
  friendId,
  onPress,
  onLongPress,
  backgroundOverlayColor,
  backgroundColor,
  itemColor,
}: any) => {
  const { navigateToAddFriend } = useAppNavigations();
  const { settings } = useUserSettings({ userId });

  const pinnedFriend = settings?.pinned_friend;
  const upcomingFriend = settings?.upcoming_friend;

  const translateY = useSharedValue(-1000);
  const isExiting = useSharedValue(0);

  const handlePressIn = useCallback(() => {
    isExiting.value = withTiming(1, { duration: 80 });
  }, []);

  const handlePressOut = useCallback(() => {
    isExiting.value = withTiming(0, { duration: 150 });
  }, []);

  const onPressRef = useRef(onPress);
  const handleNavAfterSelectRef = useRef(handleNavAfterSelect);
  const onLongPressRef = useRef(onLongPress);
  useEffect(() => {
    onPressRef.current = onPress;
    handleNavAfterSelectRef.current = handleNavAfterSelect;
    onLongPressRef.current = onLongPress;
  });

  useEffect(() => {
    translateY.value = withSpring(0, { damping: 90, stiffness: 1000 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleLongPress = useCallback((id: number) => {
    Vibration.vibrate(100);
    onLongPressRef.current(id);
  }, []);

  const handlePress = useCallback(
    (id: number, name: string, nextDate: string) => {
      isExiting.value = withTiming(1, { duration: EXIT_DURATION * 0.4 });
      translateY.value = withTiming(800, { duration: EXIT_DURATION });
      setTimeout(() => {
        onPressRef.current(id);
        handleNavAfterSelectRef.current(id, name, nextDate);
      }, EXIT_DURATION * 0.6);
    },
    [],
  );

  const ITEM_HEIGHT = 46;

  const friendIdRef = useRef(friendId);
  useEffect(() => {
    friendIdRef.current = friendId;
  });

  const renderFriendSelectItem = useCallback(
    ({ item, index }: ListRenderItemInfo<FriendListItem>) => {
      const selectedId = friendIdRef.current;
      const isSelected = "id" in item && item.id === selectedId;

      return (
        <View style={styles.sectionContainer}>
          <BouncyEntranceDown
            delay={index * STAGGER_SPEED}
            style={{ width: "100%" }}
          >
            <View style={{ width: "100%" }}>
              {"id" in item && (
                <FriendIndicators
                  friendId={item.id}
                  pinnedFriend={pinnedFriend}
                  upcomingFriend={upcomingFriend}
                />
              )}

              {"id" in item && (
                <OptionFriendButton
                  friend={item}
                  primaryColor={itemColor}
                  backgroundColor={backgroundOverlayColor}
                  buttonColor={backgroundOverlayColor}
                  selectedBorderColor={
                    isSelected
                      ? (friendColorLight ?? itemColor)
                      : (item.theme_color_light ?? itemColor)
                  }
                  isSelected={isSelected}
                  isExiting={isExiting}
                  onPress={
                    isSelected
                      ? undefined
                      : () =>
                          handlePress(
                            item.id,
                            item.name,
                            item.future_date_in_words,
                          )
                  }
                  onPressIn={isSelected ? undefined : handlePressIn}
                  onPressOut={isSelected ? undefined : handlePressOut}
                  onLongPress={() => handleLongPress(item.id)}
                />
              )}
            </View>
          </BouncyEntranceDown>
        </View>
      );
    },
    [
      itemColor,
      friendColorLight,
      backgroundOverlayColor,
      friendList.length,
      pinnedFriend,
      upcomingFriend,
    ],
  );

  const extractItemKey = (item: FriendListItem, index: number) =>
    "id" in item ? item.id.toString() : `add-friend-${index}`;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {data && (
        <FlatList
          data={[...data, { message: "add friend" }]}
          keyExtractor={extractItemKey}
          renderItem={renderFriendSelectItem}
          extraData={{ pinnedFriend, upcomingFriend }}
          numColumns={1}
          showsVerticalScrollIndicator={false}
          style={{ width: "100%" }}
        />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 2,
    minWidth: 2,
    height: "100%",
    width: "100%",
    alignItems: "center",
  },
  sectionContainer: {
    marginVertical: 6,
    flexDirection: "row",
    width: "100%",
    flexWrap: "wrap",
  },
  itemIndicatorContainer: {
    position: "absolute",
    right: 0,
    height: "100%",
    flexDirection: "column",
    zIndex: 1,
  },
  indicator: {
    padding: 4,
    zIndex: 2,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  addFriendButton: {
    flex: 1,
    margin: 2,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
});

export default FriendListUI;
