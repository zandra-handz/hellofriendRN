import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, Alert } from "react-native";

import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import ModalWithGoBack from "../alerts/ModalWithGoBack";
import { useNavigation } from "@react-navigation/native";
import { useSelectedFriendStats } from "@/src/context/SelectedFriendStatsContext";
import { useFriendList } from "@/src/context/FriendListContext";
import { useHelloes } from "@/src/context/HelloesContext";
import { MaterialCommunityIcons, Foundation } from "@expo/vector-icons";
import useCategoryHistoryLookup from "@/src/hooks/useCategoryHistoryLookup"; 
import InfiniteScrollSpinner from "../appwide/InfiniteScrollSpinner"; 
interface Props {
  title: string;
  isVisible: boolean;
  closeModal: () => void;
  friendId: number;
  categoryId: number;
}

// method of getting capsule count is TEMPORARY, likely need to change the backend/ backend call being
// made in SelectedFriendStatsContext to just return the count of capsules, and only fetch
// the capsules when needed, using the same hook as the user categories (already doing this)
// and get the count here from the backend as a capsule_ids list like we're doing for the overall user history
const CategoryFriendHistoryModal: React.FC<Props> = ({
  isVisible,
  closeModal,
  title,
  friendId = null,
  categoryId = 3,
}) => {
  const { themeStyles, appSpacingStyles, appFontStyles } = useGlobalStyle();
  const navigation = useNavigation();
  const { friendList } = useFriendList();
  const { helloesList } = useHelloes();

  const { selectedFriendStats } = useSelectedFriendStats();
  const [categoryID, setCategoryID] = useState(null);
  const [friendID, setFriendID] = useState(null);
  const [completedCapsuleCount, setCompletedCapsuleCount] = useState(null);

  if (!friendId) {
    return;
  }

  useEffect(() => {
    if (categoryId && friendId && selectedFriendStats) {
      setCategoryID(categoryId);
      setFriendID(friendId);
      // console.log(`SELECTEDED FRIENDS `, selectedFriendStats);
      // const matchedCategoryStats = selectedFriendStats.find(
      //   (category) => category.id === categoryId
      // );

      // if (matchedCategoryStats && matchedCategoryStats?.completed_capsules) {
      //   const count = matchedCategoryStats?.completed_capsules?.length;

      //   console.log(`COUNT! `, count);
      //   setCompletedCapsuleCount(count);
      // }
    }
  }, [categoryId, friendId, selectedFriendStats]);


  const handleOnPressActions = (helloId) => {
  
    handleGoToHelloView(helloId);
    closeModal();

  };

    const handleOnPress = (helloId) => {
 
        Alert.alert('Warning', 'Leave this screen?', [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
                {text: 'Go to hello', onPress: () => handleOnPressActions(helloId)},
   
        ]);
    
    };

  const {
    categoryHistory,
    isLoading,
    isFetching,
    isFetchingNextPage,
    isError,
    fetchNextPage,
    hasNextPage,
  } = useCategoryHistoryLookup({ categoryId: categoryID, friendId: friendID });

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

  const handleGoToHelloView = (helloId) => {
    // console.log("handleGoToHelloView pressed");
    const helloIndex = helloesList.findIndex((hello) => hello.id === helloId);
     console.log("helloIndex", helloId);

    if (helloIndex) {
      navigation.navigate("HelloView", {
        startingIndex: helloIndex + 1,
        inPersonFilter: false,
      });
    }
  };

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
              <Pressable style={{backgroundColor: 'red'}} onPress={() => handleOnPress(item.hello)}>
                
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
              {item.capsule}
            </Text>

            {/* <View
              style={{
                height: 20,
                width: "100%",
                justifyContent: "flex-end",
                flexDirection: "row",
                alignItems: "center", 
              }}
            > 
                  <MaterialCommunityIcons
                    onPress={handleGoToHelloView}
                        // name="hand-wave-outline"
                          name="calendar-heart"
                        size={20}
                        color={themeStyles.primaryText.color}
                        style={{ marginBottom: 0 }}
                      />

            </View> */}
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

  const getCapsuleCount = (count) => {
    if (!count) {
      return ``;
    }

    return `(` + count + ` loaded)`;
  };

  return (
    <ModalWithGoBack
      isVisible={isVisible}
      headerIcon={
        <Text
          style={[
            themeStyles.primaryText,
            appFontStyles.welcomeText,
            { fontSize: 26 },
          ]}
        >
          <MaterialCommunityIcons
            name={"comment-check-outline"}
            size={24}
            color={themeStyles.modalIconColor.color}
          />
        </Text>
        // <MaterialIcons
        //   name={"category"}
        //   size={appSpacingStyles.modalHeaderIconSize}
        //   color={themeStyles.modalIconColor.color}
        // />
      }
      questionText={title + " " + getCapsuleCount(completedCapsuleCount)}
      children={
        <>
          {categoryHistory && categoryHistory.length > 0 && (
            // this flatlist handles infinite scroll & pagination
            // this is so cool
            <FlatList
              data={categoryHistory} // Already flattened in the hook
              keyExtractor={(item, index) => index.toString()}
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
            />
          )}
        </>
      }
      onClose={closeModal}
    />
  );
};

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

export default CategoryFriendHistoryModal;
