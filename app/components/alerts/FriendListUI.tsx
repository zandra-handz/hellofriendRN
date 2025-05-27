import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React from "react";
import { FlashList } from "@shopify/flash-list";
import ButtonSelectFriend from "../buttons/friends/ButtonSelectFriend";
import { useFriendList } from "@/src/context/FriendListContext";

const FriendListUI = ({ data, onPress} ) => {
  const { friendList } = useFriendList();

 
  return (
    <View
      style={{
        flex: 1,
        minHeight: 2,
        minWidth: 2,
        height: "100%",
        width: "100%", 
      }}
    >
      {data && data.length > 0 && (
        <FlashList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => onPress(item.id)}
              style={styles.friendContainer}
            >
              <ButtonSelectFriend friend={item} />
            </TouchableOpacity>
          )}
          numColumns={4}
          estimatedItemSize={100}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  friendContainer: { 
   flex: 1, // Make sure it takes up the full available space per column
    margin: 4, // Optional: Adjust margin to control space around each item
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
    maxWidth: Dimensions.get("window").width / 3 - 20, // Divide by 3 to spread items evenly
  },
});

export default FriendListUI;
