import React, { useState, useEffect, useCallback, useMemo } from "react";
import { View, Text, ScrollView, StyleSheet, FlatList } from "react-native";

import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import ModalWithGoBack from "../alerts/ModalWithGoBack";
import { useFriendList } from "@/src/context/FriendListContext";
import { useUserStats } from "@/src/context/UserStatsContext";
 
import InfiniteScrollSpinner from "../appwide/InfiniteScrollSpinner";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  Foundation,
} from "@expo/vector-icons";
import useCategoryHistoryLookup from "@/src/hooks/useCategoryHistoryLookup";
interface Props {
  isVisible: boolean;
  closeModal: () => void;
  categoryId: number;
}

const CategoryHistoryModal: React.FC<Props> = ({
  isVisible,
  closeModal,
  title,
  data,
  categoryId = 3,
}) => {
  const { themeStyles, appSpacingStyles, appFontStyles } = useGlobalStyle();
  const { friendList } = useFriendList();
  const { stats } = useUserStats();
  const [categoryID, setCategoryID] = useState(null);
  const [completedCapsuleCount, setCompletedCapsuleCount] = useState(0);
  useEffect(() => {
    if (categoryId && stats) {
      setCategoryID(categoryId);

      const matchedCategoryStats = stats.find(
        (category) => category.id === categoryId
      );

      if (matchedCategoryStats && matchedCategoryStats?.capsule_ids) {
        const count = matchedCategoryStats?.capsule_ids?.length;

        // console.log(`COUNT! `, count);
        setCompletedCapsuleCount(count);
      }
    }
  }, [categoryId, stats]);

  const {
    categoryHistory,
    isLoading,
    isFetching,
    isFetchingNextPage,
    isError,
    fetchNextPage,
    hasNextPage,
  } = useCategoryHistoryLookup({ categoryId: categoryID });

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
                @ {getFriendNameFromList(item.friend)} on {item.formattedDate}
              </Text>
              {/* <MaterialCommunityIcons
                  onPress={handleGoToHelloView}
                  // name="hand-wave-outline"
                  name="calendar-heart"
                  size={16}
                  color={themeStyles.primaryText.color}
                  style={{ marginHorizontal: 4 }}
                /> */}
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
      formatCapsuleCreationDate,
      // getHelloDateFromList,

      themeStyles,
      styles,
    ]
  );

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
      questionText={`${title} (${completedCapsuleCount})`}
      children={
        <>
          {categoryHistoryFormatted && categoryHistoryFormatted.length > 0 && (
            // this flatlist handles infinite scroll & pagination
            // this is so cool
            <FlatList
              data={categoryHistoryFormatted} // Already flattened in the hook
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderMiniMomentItem}
              // renderItem={({ item }) => (
              //   <View style={styles.momentCheckboxContainer}>
              //     <View style={styles.momentItemTextContainer}>
              //       <View style={{ height: "100%" }}>
              //         <View style={styles.checkboxContainer}>
              //           <MaterialCommunityIcons
              //             name={"message"}
              //             size={24}
              //             color={themeStyles.modalIconColor.color}
              //           />
              //         </View>
              //       </View>
              //       <View style={{ width: "86%" }}>
              //         <Text
              //           style={[styles.momentItemText, themeStyles.genericText]}
              //         >
              //           {item.capsule}
              //         </Text>
              //         <Text
              //           style={[styles.momentItemText, themeStyles.genericText]}
              //         >
              //           @ {getFriendNameFromList(item.friend)}
              //         </Text>
              //       </View>
              //     </View>
              //   </View>
              // )}
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

// Just for list item (copy pasta'd this from CategoryFriendHistoryModal)
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

export default CategoryHistoryModal;
