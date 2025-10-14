import {
  View,
  StyleSheet,
  Pressable,
  FlatList,
  ListRenderItemInfo,
} from "react-native";
import Animated, { SlideOutRight, SlideInDown } from "react-native-reanimated";
import React, { useCallback } from "react";
import ButtonSelectFriend from "../buttons/friends/ButtonSelectFriend";
import { Vibration } from "react-native";
import FriendTintPressable from "../appwide/button/FriendTintPressable";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import GlobalPressable from "../appwide/button/GlobalPressable";
import { Friend } from "@/src/types/FriendTypes";
// import { showFlashMessage } from "@/src/utils/ShowFlashMessage";
import manualGradientColors from "@/app/styles/StaticColors";
import SvgIcon from "@/app/styles/SvgIcons";

type FriendListUIProps = {
  data: Friend[];
  selectedFriendId: number;
  onPress: (itemId: number) => void;
};

type FriendListItem = Friend | { message: string };

const FriendListUI = ({
  handleDeselect,
  autoSelectFriend,
  themeAheadOfLoading,
  friendList,
  lightDarkTheme,
  data,
  friendId,
  onPress,
  onLongPress,
}: FriendListUIProps) => {
  const itemColor = lightDarkTheme.primaryText;
  const elementBackgroundColor = lightDarkTheme.overlayBackground;
  const primaryBackground = lightDarkTheme.primaryBackground;

  const { navigateToAddFriend } = useAppNavigations();

  const handleLongPress = (id) => {
    Vibration.vibrate(100);
    onLongPress(id);
  };

  const ITEM_HEIGHT = 50;

  const ITEM_BORDER_RADIUS = 6;

  const selectedId = friendId; //can be null

  const CARD_BACKGROUND = "rgba(0,0,0,0.8)";

  const flattenedItemInnerContainerStyle = StyleSheet.flatten([
    styles.itemInnerContainer,
    {
      backgroundColor: manualGradientColors.homeDarkColor,
    },
  ]);

  const flattenedGlobalPressableStyle = StyleSheet.flatten([
    styles.friendContainer,
    {
      borderRadius: 10,
      backgroundColor: elementBackgroundColor,
    },
  ]);

  const flattenedSelectedFriendContainerStyle = StyleSheet.flatten([
    styles.friendContainer,
    {
      backgroundColor: primaryBackground,
      borderRadius: ITEM_BORDER_RADIUS,

      height: ITEM_HEIGHT,
    },
  ]);

  const renderFriendSelectItem = useCallback(
    ({ item, index }: ListRenderItemInfo<FriendListItem>) => (
      <Animated.View
        style={styles.friendContainer}
        entering={SlideInDown.duration(180)}
        exiting={SlideOutRight}
      >
        <View style={styles.itemContainer}>
          {autoSelectFriend?.customFriend?.id === item.id && (
            <View style={flattenedItemInnerContainerStyle}>
              <SvgIcon
                name="pin_outline"
                size={12}
                color={manualGradientColors.lightColor}
              />
            </View>
          )}

          {autoSelectFriend?.nextFriend?.id === item.id && (
            <View style={flattenedItemInnerContainerStyle}>
              <SvgIcon
                name={"calendar_clock"}
                size={12}
                color={manualGradientColors.lightColor}
              />
            </View>
          )}
        </View>
        {item && "id" in item && item.id !== selectedId && (
          <FriendTintPressable
            friendList={friendList}
            startingColor={elementBackgroundColor}
            style={styles.friendContainer}
            friendId={item.id}
            onPress={() => onPress(item.id)}
            onLongPress={() => handleLongPress(item.id)}
          >
            <ButtonSelectFriend
              themeTextColor={itemColor}
              backgroundOverlayColor={elementBackgroundColor}
              friendId={friendId}
              themeAheadOfLoading={themeAheadOfLoading}
              borderRadius={ITEM_BORDER_RADIUS}
              backgroundColor={CARD_BACKGROUND}
              color={itemColor}
              friend={item}
              height={ITEM_HEIGHT}
            />
          </FriendTintPressable>
        )}

        {item && "id" in item && item.id === selectedId && (
          <GlobalPressable
            onLongPress={handleDeselect}
            style={flattenedGlobalPressableStyle}
          >
            <ButtonSelectFriend
              disabled={true}
              borderRadius={ITEM_BORDER_RADIUS}
              backgroundColor={elementBackgroundColor}
              color={itemColor}
              friend={item}
              height={ITEM_HEIGHT}
            />
          </GlobalPressable>
        )}

        {!("id" in item) && friendList.length < 20 && (
          <Pressable
            onPress={navigateToAddFriend}
            style={flattenedSelectedFriendContainerStyle}
          >
            <SvgIcon
              name={"account_plus"}
              size={26}
              color={itemColor}
            />
          </Pressable>
        )}
      </Animated.View>
    ),
    [onPress, itemColor, elementBackgroundColor, autoSelectFriend]
  );

  const extractItemKey = (item: FriendListItem, index: number) =>
    "id" in item ? item.id.toString() : `add-friend-${index}`;

  return (
    <Animated.View
      style={styles.animatedViewContainer}
    >
      {data && ( // this will work with an empty [] so you can add a friend for the first time too
        <FlatList
          data={[...data, { message: "add friend" }]}
          keyExtractor={extractItemKey}
          renderItem={renderFriendSelectItem}
          numColumns={1}
          showsVerticalScrollIndicator={false}
        />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    position: "absolute",
    right: 0,
    height: "100%",
    width: "auto",
    flexDirection: "column",
  },
  itemInnerContainer: {
    width: "auto",
    padding: 4,
    zIndex: 2,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },

  friendContainer: {
    flex: 1,
    margin: 2,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
  },
  pressedStyle: {
    opacity: 0.2,
  },
  selectedFriendWrapper: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  animatedViewContainer: {
    flex: 1,
    minHeight: 2,
    minWidth: 2,
    height: "100%",
    width: "100%",
  },
});

export default FriendListUI;
