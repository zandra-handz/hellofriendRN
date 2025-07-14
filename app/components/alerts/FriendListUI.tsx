import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Dimensions,
  FlatList,
} from "react-native";
import Animated, { SlideInRight, FadeInRight, SlideOutLeft } from "react-native-reanimated";
import React, { useCallback } from "react";
import { AnimatedFlashList, FlashList } from "@shopify/flash-list";
import ButtonSelectFriend from "../buttons/friends/ButtonSelectFriend";
import { useFriendList } from "@/src/context/FriendListContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const FriendListUI = ({ data, onPress }) => {
  const { friendList } = useFriendList();
const { themeStyles} = useGlobalStyle();
const navigation = useNavigation();
    const itemColor = themeStyles.primaryText.color;
    const elementBackgroundColor = themeStyles.overlayBackgroundColor.backgroundColor;


    const ITEM_HEIGHT = 70;

  const renderFriendSelectItem = useCallback(
    ({ item, index }) => (
      <Animated.View
        style={styles.friendContainer}
           //   exiting={SlideOutLeft} not working yet
        entering={SlideInRight.duration(
          (index + 1) * (70 - ((index + 1) * 1.9))
        )}
      >
        {item && item?.id && (
      
  
        <TouchableOpacity
          onPress={() => onPress(item.id)}
          style={styles.friendContainer}
        >
          <ButtonSelectFriend backgroundColor={elementBackgroundColor} color={itemColor} friend={item} height={ITEM_HEIGHT} />
        </TouchableOpacity>
            
        )}
        {!item?.id && friendList.length < 20 && (
              <TouchableOpacity
           onPress={() => navigation.navigate("AddFriend")}
          style={[styles.friendContainer, {backgroundColor: themeStyles.primaryBackground.backgroundColor, borderRadius: 10, overflow:'hidden', height: ITEM_HEIGHT}]}
        >
         <MaterialCommunityIcons
         name={"account-plus"}
         size={30}
         color={themeStyles.primaryText.color}
         />
        </TouchableOpacity>

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
          data={[...data, {message: 'add friend'}]}
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
    flex: 1, // Make sure it takes up the full available space per column
    margin: 4, // Optional: Adjust margin to control space around each item
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    maxWidth: Dimensions.get("window").width / 3 - 14, // Divide by 3 to spread items evenly
  },
});

export default FriendListUI;
