import {
  View,
  Alert,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import InfiniteScrollSpinner from "../appwide/InfiniteScrollSpinner";

import useCategoryHistoryLookup from "@/src/hooks/useCategoryHistoryLookup";
import { AppFontStyles } from "@/app/styles/AppFonts";

import useFriendListAndUpcoming from "@/src/hooks/usefriendListAndUpcoming";

import FriendHistoryMomentItem from "./FriendHistoryMomentItem";
//  import { useFriendList } from "@/src/context/FriendListContext";
// import { useFriendListAndUpcoming } from "@/src/context/FriendListAndUpcomingContext";
 

type Props = {
  categoryId: number;
  closeModal: () => void;
  onViewHelloPress: () => void;
};

const CategoryFriendHistoryList = ({
  userId,
  friendId,
  categoryId,

  helloesList,
  primaryColor,
  closeModal,
  onViewHelloPress,
}: Props) => {
  //  const { friendList } = useFriendList();
  const { friendListAndUpcoming } = useFriendListAndUpcoming({userId: userId});

  const friendList = friendListAndUpcoming?.friends;
  const [completedCapsuleCount, setCompletedCapsuleCount] = useState<number>(0);

  const {
    categoryHistory,
    isLoading,
    isFetching,
    isFetchingNextPage,
    isError,
    fetchNextPage,
    hasNextPage,
  } = useCategoryHistoryLookup({
    categoryId: categoryId,
    friendId: friendId,
  });

  useEffect(() => {
    if (categoryHistory) {
      setCompletedCapsuleCount(categoryHistory.length);
    }
  }, [categoryHistory]);

  const handlePress = useCallback(
    (helloId, momentOriginalId) => () => {
      if (onViewHelloPress) {
        onViewHelloPress(helloId, momentOriginalId);
      }
    },
    [onViewHelloPress]
  );

  const getFriendNameFromList = (friendId) => {
    const friend = friendList.find((friend) => friend.id === friendId);

    return friend?.name || "";
  };

  const getHelloDateFromList = (helloId) => {
    const hello = helloesList.find((hello) => hello.id === helloId);

    return hello.date || "";
  };

  const getCapsuleCount = (count: number) => {
    if (!count) {
      return ``;
    }

    return `(` + count + ` loaded)`;
  };

  const extractItemKey = (item, index) =>
    item?.id ? item.id.toString() : `friend-capsule-${categoryId}-${index}`;

  const renderMiniMomentItem = useCallback(
    ({ item, index }) => (
      <FriendHistoryMomentItem
        item={item}
        index={index}
        onHelloPress={handlePress}
        friendId={friendId}
        friendName={getFriendNameFromList(item.friend)}
        primaryColor={primaryColor}
        helloDate={getHelloDateFromList(item.hello.id)} //hmmmmm backend now returns hello as an object on this. dunno if I like that
      />
    ),
    [
      getFriendNameFromList,
      getHelloDateFromList,
      handlePress,
      // handleOnPress,
      primaryColor,
      styles,
    ]
  );

  return (
    <>
      {categoryHistory && categoryHistory.length > 0 && (
        <FlatList
          ListHeaderComponent={
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                backgroundColor: "teal",
                height: "auto",
                // height: 30,
                alignItems: "center",
              }}
            >
              <Text
                style={[AppFontStyles.subWelcomeText, { color: primaryColor }]}
              >
                History {getCapsuleCount(completedCapsuleCount)}
              </Text>
            </View>
          }
          stickyHeaderIndices={[0]}
          data={categoryHistory}
          keyExtractor={extractItemKey}
          renderItem={renderMiniMomentItem}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            <InfiniteScrollSpinner
              isFetchingNextPage={isFetchingNextPage}
              color={primaryColor}
              height={50}
            />
          }
        ></FlatList>
      )}
    </>
  );
};

//THIS BELOW COPYPASTAD FROM CATEGORYFRIENDHISTORYMODAL
// Just for list item (copy pasta'd this into CategoryHistoryModal as well)
const styles = StyleSheet.create({
  momentItemTextContainer: {
    flexDirection: "row",
    alignItems: "flex-start",


    width: "100%",
  },
  momentItemText: {
    fontSize: 11, 
    fontFamily: "Poppins-Regular",
 
  },
  momentCheckboxContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 0,
    paddingTop: 0,
    paddingRight: 10,
  },
});

export default CategoryFriendHistoryList;
