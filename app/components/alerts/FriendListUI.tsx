import {
  View,
  StyleSheet,
  Pressable,
  FlatList,
  ListRenderItemInfo,
} from "react-native";
import Animated, {
  SlideInRight,
  SlideInDown,
  FadeOut,
} from "react-native-reanimated";
import React, { useCallback } from "react";
import ButtonSelectFriend from "../buttons/friends/ButtonSelectFriend";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import FriendTintPressable from "../appwide/button/FriendTintPressable";
import useAppNavigations from "@/src/hooks/useAppNavigations";

import { Friend } from "@/src/types/FriendTypes";

type FriendListUIProps = {
  data: Friend[];
  selectedFriendId: number;
  onPress: (itemId: number) => void;
};

type FriendListItem = Friend | { message: string };

const FriendListUI = ({
  themeAheadOfLoading,
  friendList,
  lightDarkTheme,
  data,
  friendId,
  onPress,
}: FriendListUIProps) => {
  const itemColor = lightDarkTheme.primaryText;
  const elementBackgroundColor = lightDarkTheme.overlayBackground;

  const { navigateToAddFriend } = useAppNavigations();

  const ITEM_HEIGHT = 50;

  const ITEM_BORDER_RADIUS = 6;

  const selectedId = friendId; //can be null

  const CARD_BACKGROUND = "rgba(0,0,0,0.8)";

  const renderFriendSelectItem = useCallback(
    ({ item, index }: ListRenderItemInfo<FriendListItem>) => (
      <Animated.View
        style={styles.friendContainer}
        entering={SlideInDown.duration(180)}
        exiting={FadeOut}
        // entering={SlideInRight.duration(260).springify(2000)}
      >
        {item && "id" in item && item.id !== selectedId && (
          <FriendTintPressable
            friendList={friendList}
            startingColor={lightDarkTheme.overlayBackground}
            style={styles.friendContainer}
            friendId={item.id}
            onPress={() => onPress(item.id)}
          >
            <ButtonSelectFriend
              themeTextColor={lightDarkTheme.primaryText}
              backgroundOverlayColor={lightDarkTheme.overlayBackground}
             
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
          <View
            style={[
              styles.friendContainer,
              {
                borderWidth: 2,
                borderColor: "yellow",
                borderRadius: ITEM_BORDER_RADIUS,
              },
            ]}
          >
            <ButtonSelectFriend
              disabled={true}
              borderRadius={ITEM_BORDER_RADIUS}
              backgroundColor={elementBackgroundColor}
              color={itemColor}
              friend={item}
              height={ITEM_HEIGHT}
            />
          </View>
        )}

        {!("id" in item) && friendList.length < 20 && (
          <Pressable
            onPress={navigateToAddFriend}
            style={[
              styles.friendContainer,
              {
                backgroundColor: lightDarkTheme.primaryBackground,
                borderRadius: ITEM_BORDER_RADIUS,
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                height: ITEM_HEIGHT,
              },
            ]}
          >
            <MaterialCommunityIcons
              name={"account-plus"}
              size={26}
              color={lightDarkTheme.primaryText}
            />
          </Pressable>
        )}
      </Animated.View>
    ),
    [onPress, itemColor, elementBackgroundColor]
  );

  const extractItemKey = (item: FriendListItem, index: number) =>
    "id" in item ? item.id.toString() : `add-friend-${index}`;

  return (
    <Animated.View
      style={{
        flex: 1,
        minHeight: 2,
        minWidth: 2,
        height: "100%",
        width: "100%",
      }}
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
  friendContainer: {
    flex: 1,
    margin: 2,
    overflow: "hidden",
    // borderRadius: 2,
    justifyContent: "center",
    flexGrow: 1,
  },
  pressedStyle: {
    opacity: 0.2,
  },
});

export default FriendListUI;
