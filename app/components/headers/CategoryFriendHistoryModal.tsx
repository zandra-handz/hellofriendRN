import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, FlatList } from "react-native";
import { TouchableOpacity, AccessibilityInfo } from "react-native";

import InfoOutlineSvg from "@/app/assets/svgs/info-outline.svg";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import ModalWithoutSubmit from "../alerts/ModalWithoutSubmit";

import { useUserStats } from "@/src/context/UserStatsContext";
import { useSelectedFriendStats } from "@/src/context/SelectedFriendStatsContext";
import { useFriendList } from "@/src/context/FriendListContext";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import useCategoryHistoryLookup from "@/src/hooks/useCategoryHistoryLookup";
interface Props {
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
  data,
  friendId = null,
  categoryId = 3,
}) => {
  const { themeStyles, appSpacingStyles, appFontStyles } = useGlobalStyle();
  const { friendList } = useFriendList();
  const { stats } = useUserStats();
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
      console.log(`SELECTEDED FRIENDS `, selectedFriendStats);
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

  const {
    categoryHistory,
    isLoading,
    isFetching,
    isFetchingNextPage,
    isError,
    fetchNextPage,
    hasNextPage,
  } = useCategoryHistoryLookup({ categoryId: categoryID, friendId: friendID });
  const headerIconSize = 26;

 

  useEffect(() => {
      if (categoryHistory) {
         setCompletedCapsuleCount(categoryHistory.length);
      }

  }, [categoryHistory]);

  const getFriendNameFromList = (friendId) => {
    const friend = friendList.find((friend) => friend.id === friendId);

    return friend?.name || "";
  };

  const getCapsuleCount = (count) => {
    if (!count) {
      return;
    }

    return `(` + count + `)`;
    

  };

  return (
    <ModalWithoutSubmit
      isVisible={isVisible}
      headerIcon={
        <Text
          style={[
            themeStyles.primaryText,
            appFontStyles.welcomeText,
            { fontSize: 26 },
          ]}
        >
          #
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
              renderItem={({ item }) => (
                <View style={styles.momentCheckboxContainer}>
                  <View style={styles.momentItemTextContainer}>
                    <View style={{ height: "100%" }}>
                      <View style={styles.checkboxContainer}>
                        <MaterialCommunityIcons
                          name={"message"}
                          size={24}
                          color={themeStyles.modalIconColor.color}
                        />
                      </View>
                    </View>
                    <View style={{ width: "86%" }}>
                      <Text
                        style={[styles.momentItemText, themeStyles.genericText]}
                      >
                        {item.capsule}
                      </Text>
                      <Text
                        style={[styles.momentItemText, themeStyles.genericText]}
                      >
                        @ {getFriendNameFromList(item.friend)}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
              onEndReached={() => {
                if (hasNextPage && !isFetchingNextPage) {
                  fetchNextPage();
                }
              }}
              onEndReachedThreshold={0.5} // adjust as needed
              ListFooterComponent={
                isFetchingNextPage ? (
                  <Text
                    style={[styles.momentItemText, themeStyles.genericText]}
                  >
                    Loading more...
                  </Text>
                ) : null
              }
            />
          )}
        </>
      }
      onClose={closeModal}
    />
  );
};

const styles = StyleSheet.create({
  bodyContainer: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-start",
    textAlign: "left",
  },
  headerContainer: {
    margin: "2%",
  },
  sectionContainer: {
    margin: "2%",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 18,
    lineHeight: 30,
  },
  text: {
    fontSize: 14,
    lineHeight: 21,
  },
  momentItemTextContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    paddingBottom: 20,
    width: "100%",
    borderBottomWidth: 0.4,
    borderBottomColor: "#fff",
  },
  newMomentItemTextContainer: {
    flexDirection: "row", // Allows text to wrap
    // Ensures text wraps to the next line
    alignItems: "flex-start", // Aligns text to the top
    marginBottom: 10,
    paddingBottom: 20,
    maxHeight: 200,
    width: "100%",
  },
  momentItemText: {
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    width: "100%",
  },
  newMomentItemText: {
    fontSize: 20,
    fontFamily: "Poppins-Regular",
    width: "100%",
  },
  momentModalContainer: {
    width: "100%",
    borderRadius: 10,
    padding: 0,

    height: 480,
    maxHeight: "80&",
    alignItems: "center",
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
    paddingTop: 4,
    paddingRight: 10,
    paddingLeft: 6,
  },
});

export default CategoryFriendHistoryModal;
