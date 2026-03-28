import { FlatList, StyleSheet } from "react-native";
import React, { useCallback, useMemo } from "react";
import useCategoryHistoryLookup from "@/src/hooks/useCategoryHistoryLookup";
import InfiniteScrollSpinner from "../appwide/InfiniteScrollSpinner";

import useFriendListAndUpcoming from "@/src/hooks/usefriendListAndUpcoming";
import UserHistoryMomentItem from "./UserHistoryMomentItem";
import { AppFontStyles } from "@/app/styles/AppFonts";
import { isoDateToWeekdayMonthDay } from "@/src/hooks/utils_dateFormatting";

type Props = {
  categoryId: number;
};

const UserCategoryHistoryList = ({
  userId,
  categoryId,
  primaryColor = "orange",
}: Props) => {
  const {
    categoryHistory,
    isFetchingNextPage,

    fetchNextPage,
    hasNextPage,
  } = useCategoryHistoryLookup({ categoryId: categoryId });
  const { friendListAndUpcoming } = useFriendListAndUpcoming({
    userId: userId,
  });
  const friendList = friendListAndUpcoming?.friends;

  const subWelcomeTextStyle = AppFontStyles.subWelcomeText;

  const categoryHistoryFormatted = useMemo(() => {
    if (!categoryHistory) return [];

    return categoryHistory.flatMap((group) =>
      group.capsules.map((capsule) => ({
        ...capsule,
        formattedDate: isoDateToWeekdayMonthDay(
          group.hello?.date || capsule.created_on,
        ),
        helloType: group.hello?.type,
      })),
    );
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
        textStyle={subWelcomeTextStyle}
      />
    ),
    [
      getFriendNameFromList,
      // formatCapsuleCreationDate,
      // getHelloDateFromList,

      primaryColor,
      styles,
    ],
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
