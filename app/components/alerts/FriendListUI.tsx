import {
  View, 
  StyleSheet,
  Pressable, 
  FlatList,
  ListRenderItemInfo,
} from "react-native";
import Animated, {
  SlideInRight, 
} from "react-native-reanimated";
import React, { useCallback } from "react";
import ButtonSelectFriend from "../buttons/friends/ButtonSelectFriend";
import { useFriendList } from "@/src/context/FriendListContext";
 
import { useGlobalStyle } from "@/src/context/GlobalStyleContext"; 
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
  data,
  selectedFriendId,
  onPress,
}: FriendListUIProps) => {
  const { friendList } = useFriendList();
  const { themeStyles } = useGlobalStyle(); 
  const itemColor = themeStyles.primaryText.color;
  const elementBackgroundColor =
    themeStyles.overlayBackgroundColor.backgroundColor;

    const {navigateToAddFriend } = useAppNavigations();

  const ITEM_HEIGHT = 50;

  const ITEM_BORDER_RADIUS = 10;

  const selectedId = selectedFriendId; //can be null

  const renderFriendSelectItem = useCallback(
    ({ item, index }: ListRenderItemInfo<FriendListItem>) => (
      <Animated.View
        style={styles.friendContainer}
        entering={SlideInRight.duration(260).springify(2000)}
      >
        {item && "id" in item && item.id !== selectedId && (
          <FriendTintPressable
            startingColor={themeStyles.overlayBackgroundColor.backgroundColor}
            style={styles.friendContainer}
            friendId={item.id}
            onPress={() => onPress(item.id)}
          >
            <ButtonSelectFriend
              borderRadius={ITEM_BORDER_RADIUS}
              backgroundColor={"transparent"}
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
                backgroundColor: themeStyles.primaryBackground.backgroundColor,
                borderRadius: 10,
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
              color={themeStyles.primaryText.color}
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
          //  estimatedItemSize={100}
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
    borderRadius: 10,
    justifyContent: "center",
    flexGrow: 1,
  },
  pressedStyle: {
    opacity: 0.2,
  },
});

export default FriendListUI;
