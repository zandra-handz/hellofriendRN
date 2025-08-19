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
 
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useFriendList } from "@/src/context/FriendListContext";
import { useHelloes } from "@/src/context/HelloesContext"; 
import FriendHistoryMomentItem from "./FriendHistoryMomentItem";
 

type Props = {
  categoryId: number;
  closeModal: () => void;
  onViewHelloPress: () => void;
};

const CategoryFriendHistoryList = ({
  categoryId,
  closeModal,
  onViewHelloPress,
}: Props) => {
  const { selectedFriend } = useSelectedFriend(); 
  const { friendList } = useFriendList();
  const { themeStyles, appFontStyles } = useGlobalStyle();
  const { helloesList } = useHelloes();
  const [completedCapsuleCount, setCompletedCapsuleCount] = useState<number>(0);
  const [quickView, setQuickView] = useState<null | {
    topBarText: String;
    view: React.ReactElement;
    message: string;
    update: boolean;
  }>(null);
  if (!categoryId || !selectedFriend?.id) {
    return;
  }

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
    friendId: selectedFriend.id,
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
      friendName={getFriendNameFromList(item.friend)}
      helloDate={getHelloDateFromList(item.hello)}/>
      
    ),
    [
      getFriendNameFromList,
      getHelloDateFromList,
      handlePress,
      // handleOnPress,
      themeStyles,
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
                style={[themeStyles.primaryText, appFontStyles.subWelcomeText]}
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
              color={themeStyles.primaryText.color}
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
    // lineHeight: 15,
    fontFamily: "Poppins-Regular",
    // width: "100%",
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
