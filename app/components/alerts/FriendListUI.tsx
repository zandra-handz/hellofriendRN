import {
  View,
  StyleSheet,
  Pressable,
  FlatList,
  ListRenderItemInfo,
} from "react-native"; 
import React, { useCallback } from "react";
import ButtonSelectFriend from "../buttons/friends/ButtonSelectFriend";
import { Vibration } from "react-native";
import FriendTintPressable from "../appwide/button/FriendTintPressable";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import GlobalPressable from "../appwide/button/GlobalPressable";
import { Friend } from "@/src/types/FriendTypes";
import manualGradientColors from "@/app/styles/StaticColors";
import SvgIcon from "@/app/styles/SvgIcons";

type FriendListUIProps = {
  data: Friend[];
  selectedFriendId: number;
  onPress: (itemId: number) => void;
};

type FriendListItem = Friend | { message: string };

const FriendListUI = ({
  touchLocationX,
  touchLocationY,
  visibility,
  scale,
  screenDiagonal,
  handleDeselect,
  autoSelectFriend,
  themeColors,
  friendColors,
  friendList,
  setGradientColors,
  lightDarkTheme,
  handleNavAfterSelect,
  useNavigateBack,
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

  const ITEM_HEIGHT = 46;

  const ITEM_BORDER_RADIUS = 10;

  const selectedId = friendId; //can be null

  const CARD_BACKGROUND = "rgba(0,0,0,0.9)";

  const renderFriendSelectItem = useCallback(
    ({ item, index }: ListRenderItemInfo<FriendListItem>) => (
      < View 
      >
        <View style={styles.itemContainer}>
          {autoSelectFriend?.customFriend?.id === item.id && (
            <View
              style={[
                styles.itemInnerContainer,
                {
                  backgroundColor: manualGradientColors.homeDarkColor,
                },
              ]}
            >
              <SvgIcon
                name="pin_outline"
                size={12}
                color={manualGradientColors.lightColor}
              />
            </View>
          )}

          {autoSelectFriend?.nextFriend?.id === item.id && (
            <View
              style={[
                styles.itemInnerContainer,
                {
                  backgroundColor: manualGradientColors.homeDarkColor,
                },
              ]}
            >
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
            touchLocationX={touchLocationX}
            touchLocationY={touchLocationY}
            visibility={visibility}
            scaleValue={scale}
            screenDiagonal={screenDiagonal}
            setGradientColors={setGradientColors}
            friendColorValues={friendColors}
            friendList={friendList}
            startingColor={elementBackgroundColor}
            style={styles.friendContainer}
            friendId={item.id}
            onPress={() => onPress(item.id)}
            handleNavAfterSelect={handleNavAfterSelect}
            useNavigateBack={useNavigateBack}
            onLongPress={() => handleLongPress(item.id)}
          >
            <ButtonSelectFriend
              themeTextColor={itemColor}
              backgroundOverlayColor={elementBackgroundColor}
              friendId={friendId}
              themeColors={themeColors}
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
            style={styles.friendContainer}
          >
            <ButtonSelectFriend
          
              borderRadius={ITEM_BORDER_RADIUS}
              backgroundColor={elementBackgroundColor}
              color={itemColor}
              friend={item}
              height={ITEM_HEIGHT}
              fontColor={themeColors.fontColor}
            />
          </GlobalPressable>
        )}

        {!("id" in item) && friendList.length < 20 && (
          <Pressable
            onPress={navigateToAddFriend}
            style={[
              {
                backgroundColor: primaryBackground,
                borderRadius: ITEM_BORDER_RADIUS,

                height: ITEM_HEIGHT,
              },
              styles.friendContainer,
            ]}
          >
            <SvgIcon name={"account_plus"} size={26} color={itemColor} />
          </Pressable>
        )}
      </ View>
    ),
    [onPress, itemColor, elementBackgroundColor, autoSelectFriend]
  );

  const extractItemKey = (item: FriendListItem, index: number) =>
    "id" in item ? item.id.toString() : `add-friend-${index}`;

  return (
    <View style={styles.animatedViewContainer}>
      {data && ( // this will work with an empty [] so you can add a friend for the first time too
        <FlatList
          data={[...data, { message: "add friend" }]}
          keyExtractor={extractItemKey}
          renderItem={renderFriendSelectItem}
          numColumns={1}
          showsVerticalScrollIndicator={false}
          style={{ width: "100%" }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    position: "absolute",
    right: 0,
    height: "100%",
   

    flexDirection: "column",
  },
  itemInnerContainer: {
 
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
    width: "100%",
   // borderRadius: 10,
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
    alignItems: "center", 
  },
});

export default FriendListUI;
