import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  FlatList,
} from "react-native";
import Animated, {
  SlideInRight,
  FadeInRight,
  SlideOutLeft,
} from "react-native-reanimated";
import React, { useCallback } from "react"; 
import ButtonSelectFriend from "../buttons/friends/ButtonSelectFriend";
import { useFriendList } from "@/src/context/FriendListContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const FriendListUI = ({ data, selectedFriendId, onPress }) => {
  const { friendList } = useFriendList();
  const { themeStyles } = useGlobalStyle();
  const navigation = useNavigation();
  const itemColor = themeStyles.primaryText.color;
  const elementBackgroundColor =
    themeStyles.overlayBackgroundColor.backgroundColor;

  const ITEM_HEIGHT = 70;

  const ITEM_BORDER_RADIUS = 10;

  const selectedId = selectedFriendId; //can be null

  const renderFriendSelectItem = useCallback(
    ({ item, index }) => (
      <Animated.View
        style={styles.friendContainer}
        //   exiting={SlideOutLeft} not working yet
        // entering={SlideInRight.duration((index + 1) * (70 - (index + 1) * 1.9))}
       entering={SlideInRight.duration(260).springify(2000)}
    
    
    >
        {item && item?.id && item?.id !== selectedId && (
          <Pressable
            onPress={() => onPress(item.id)}
            style={styles.friendContainer}
          >
            <ButtonSelectFriend
              borderRadius={ITEM_BORDER_RADIUS}
              backgroundColor={elementBackgroundColor}
              color={itemColor}
              friend={item}
              height={ITEM_HEIGHT}
            />
          </Pressable>
        )}
        {item && item?.id && item?.id === selectedId && (
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
              borderRadius={ITEM_BORDER_RADIUS}
              backgroundColor={elementBackgroundColor}
              color={itemColor}
              friend={item}
              height={ITEM_HEIGHT}
            />
          </View>
        )}
        {!item?.id && friendList.length < 20 && (
          <Pressable
            onPress={() => navigation.navigate("AddFriend")}
            style={[
              styles.friendContainer,
              {
                backgroundColor: themeStyles.primaryBackground.backgroundColor,
                borderRadius: 10,
                overflow: "hidden",
                height: ITEM_HEIGHT,
              },
            ]}
          >
            <MaterialCommunityIcons
              name={"account-plus"}
              size={30}
              color={themeStyles.primaryText.color}
            />
          </Pressable>
        )}
      </Animated.View>
    ),
    [onPress, itemColor, elementBackgroundColor]
  );

  const extractItemKey = (item, index) =>
    item?.id ? item.id.toString() : `friendButton-${index}`;

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
          numColumns={3}
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
    margin: 4, 
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    maxWidth: Dimensions.get("window").width / 3 - 14,
     
  },
});

export default FriendListUI;
