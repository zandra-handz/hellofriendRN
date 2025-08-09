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
import { MaterialCommunityIcons, Foundation } from "@expo/vector-icons";
import useCategoryHistoryLookup from "@/src/hooks/useCategoryHistoryLookup";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useFriendList } from "@/src/context/FriendListContext";
import { useHelloes } from "@/src/context/HelloesContext";

type Props = {
  categoryId: number;
  closeModal: () => void;
};

const CategoryFriendHistoryList = ({ categoryId, closeModal }: Props) => {
  const { selectedFriend } = useSelectedFriend();
  const { navigateToHelloView } = useAppNavigations();
  const { friendList } = useFriendList();
  const { themeStyles, appFontStyles } = useGlobalStyle();
  const { helloesList } = useHelloes();
  const [completedCapsuleCount, setCompletedCapsuleCount] = useState<number>(0);

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

  const getFriendNameFromList = (friendId) => {
    const friend = friendList.find((friend) => friend.id === friendId);

    return friend?.name || "";
  };

  const getHelloDateFromList = (helloId) => {
    const hello = helloesList.find((hello) => hello.id === helloId);

    return hello.date || "";
  };

  const handleGoToHelloView = (helloId: number) => {
    // console.log("handleGoToHelloView pressed");
    const helloIndex = helloesList.findIndex(
      (hello: { id: number }) => hello.id === helloId
    );
    console.log("helloIndex", helloId);

    if (helloIndex) {
      navigateToHelloView({
        startingIndex: helloIndex + 1,
        inPersonFilter: false,
      });
    }
  };

  const handleOnPressActions = (helloId: number) => {
    handleGoToHelloView(helloId);
    closeModal();
  };

  const getCapsuleCount = (count: number) => {
    if (!count) {
      return ``;
    }

    return `(` + count + ` loaded)`;
  };

  const handleOnPress = (helloId: number) => {
    Alert.alert("Warning", "Leave this screen?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "Go to hello", onPress: () => handleOnPressActions(helloId) },
    ]);
  };

  const extractItemKey = (item, index) =>
    item?.id ? item.id.toString() : `capsule-${categoryId}-${index}`;

  const renderMiniMomentItem = useCallback(
    ({ item, index }) => (
      <View
        style={[
          styles.momentCheckboxContainer,
          {
            paddingBottom: 10,
            paddingTop: 10,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: themeStyles.primaryText.color,
          },
        ]}
      >
        <View style={styles.momentItemTextContainer}>
          <View style={styles.checkboxContainer}>
            <Foundation
              name={"comment-quotes"}
              size={24}
              color={themeStyles.primaryText.color}
            />
          </View>

          <View style={{ width: "100%", flexShrink: 1 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",

                width: "100%",
              }}
            >
              <Text
                style={[
                  styles.momentItemText,
                  themeStyles.primaryText,
                  { fontFamily: "Poppins-Bold" },
                ]}
              >
                @ {getFriendNameFromList(item.friend)} on{" "}
                {getHelloDateFromList(item.hello)}
              </Text>
              <Pressable
                style={{ backgroundColor: "red" }}
                onPress={() => handleOnPress(item.hello)}
              >
                <MaterialCommunityIcons
                  // name="hand-wave-outline"
                  name="calendar-heart"
                  size={16}
                  color={themeStyles.primaryText.color}
                  style={{ marginHorizontal: 4 }}
                />
              </Pressable>
            </View>
                        <Text style={[styles.momentItemText, themeStyles.primaryText]}>
              {item.time_score}
            </Text>
            <Text style={[styles.momentItemText, themeStyles.primaryText]}>
              {item.capsule}
            </Text>
          </View>
        </View>
      </View>
    ),
    [
      getFriendNameFromList,
      getHelloDateFromList,
      handleGoToHelloView,
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
                aignItems: 'center',
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
