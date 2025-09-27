import { FlatList, StyleSheet } from "react-native";
import React, { useCallback, useMemo } from "react";
import useCategoryHistoryLookup from "@/src/hooks/useCategoryHistoryLookup";
import InfiniteScrollSpinner from "../appwide/InfiniteScrollSpinner";
// import { useFriendList } from "@/src/context/FriendListContext";
import { useFriendListAndUpcoming } from "@/src/context/FriendListAndUpcomingContext";
import UserHistoryMomentItem from "./UserHistoryMomentItem";

type Props = {
  categoryId: number;
};

const UserCategoryHistoryList = ({
  categoryId,
  primaryColor = "orange",
}: Props) => {
  const {
    categoryHistory,
    // isLoading,
    // isFetching,
    isFetchingNextPage,
    // isError,
    fetchNextPage,
    hasNextPage,
  } = useCategoryHistoryLookup({ categoryId: categoryId });
  const { friendListAndUpcoming } = useFriendListAndUpcoming();
  const friendList = friendListAndUpcoming?.friends;

  const formatCapsuleCreationDate = (createdOn) => {
    if (!createdOn) return "";

    const date = new Date(createdOn);
    const now = new Date();

    const isCurrentYear = date.getFullYear() === now.getFullYear();

    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      ...(isCurrentYear ? {} : { year: "numeric" }),
    });
  };

  // do we need to do it this way?
  const categoryHistoryFormatted = useMemo(() => {
    return categoryHistory?.map((item) => ({
      ...item,
      formattedDate: formatCapsuleCreationDate(item.created_on),
    }));
  }, [categoryHistory]);

  const getFriendNameFromList = (friendId) => {
    const friend = friendList.find((friend) => friend.id === friendId);

    return friend?.name || "";
  };

  const renderMiniMomentItem = useCallback(
    ({ item, index }) => (
      <UserHistoryMomentItem
        item={item}
        index={index}
        friendName={getFriendNameFromList(item.friend)}
        primaryColor={primaryColor}
      />
    ),
    [
      getFriendNameFromList,
      formatCapsuleCreationDate,
      // getHelloDateFromList,

      primaryColor,
      styles,
    ]
  );

  const extractItemKey = (item, index) =>
    item?.id ? item.id.toString() : `capsule-${categoryId}-${index}`;
  return (
    <>
      {categoryHistoryFormatted && categoryHistoryFormatted.length > 0 && (
        // this flatlist handles infinite scroll & pagination
        // this is so cool
        <FlatList
          data={categoryHistoryFormatted} // Already flattened in the hook
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
        />
      )}
    </>
  );
};

// Just for list item (copy pasta'd this from CategoryFriendHistoryModal)
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

export default UserCategoryHistoryList;
