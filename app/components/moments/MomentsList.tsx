import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { View, ViewToken, Pressable, StyleSheet } from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import MomentsAdded from "./MomentsAdded";
import CategoryNavigator from "./CategoryNavigator";
import MomentItem from "./MomentItem";
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";

import Animated, {
  JumpingTransition,
  useSharedValue,
  useAnimatedRef,
  useAnimatedScrollHandler,
  withTiming,
  withSpring,
} from "react-native-reanimated";

type TooltipLayout = "left" | "right" | "alternating";

const MomentsList = ({
  friendColor,
  primaryBackgroundColor,
  primaryColor,
  primaryOverlayColor,
  darkerOverlayColor,
  lighterOverlayColor,
  navigateBack,
  categoryNames,
  categoryStartIndices,
  capsuleList,
  preAdded,
  updateCapsule,
  navigateToMomentView,
  friendId,
  scrollToIndex,
  categoryColorsMap,
  handleNavigateToCreateNew,
  categoryNavigatorVisible,
  handleToggleCatNav,
  topCategoryColorValue,
  tooltipLayout = "left" as TooltipLayout, // "left" | "right" | "alternating"
}) => {
  useEffect(() => {
    if (scrollToIndex) {
      scrollToCategoryStart(scrollToIndex);
    }
  }, [scrollToIndex]);

  const ITEM_HEIGHT = 160;
  const ITEM_BOTTOM_MARGIN = 18;
  const COMBINED_HEIGHT = ITEM_HEIGHT + ITEM_BOTTOM_MARGIN;

  const onViewableItemsChangedRef = useRef(({ viewableItems }) => {
    viewableItemsArray.value = viewableItems;
  });

  useEffect(() => {
    onViewableItemsChangedRef.current = ({ viewableItems }) => {
      viewableItemsArray.value = viewableItems;
      const topMoment = viewableItems[0]?.item;
      if (topMoment && categoryColorsMap[topMoment.user_category]) {
        topCategoryColorValue.value = categoryColorsMap[topMoment.user_category];
      }
    };
  }, [categoryColorsMap, topCategoryColorValue]);

  const viewabilityConfigCallbackPairs = useRef([
    {
      viewabilityConfig: {
        minimumViewTime: 40,
        itemVisiblePercentThreshold: 5,
        waitForInteraction: false,
      },
      onViewableItemsChanged: (info) => onViewableItemsChangedRef.current(info),
    },
  ]);

  const flatListRef = useAnimatedRef(null);
  const momentListBottomSpacer = 600;
  const pressedIndex = useSharedValue(null);
  const pulseValue = useSharedValue(0);

  const scrollToMoment = (moment) => {
    console.log("scroll to moment: ", moment);
    if (moment.uniqueIndex !== undefined) {
      flatListRef.current?.scrollToOffset({
        offset: COMBINED_HEIGHT * moment.uniqueIndex,
        animated: false,
      });
    }
  };

  const saveToHello = useCallback((moment) => {
    if (!friendId || !moment) {
      showFlashMessage(`Oops! Missing data required to save idea to hello`, true, 1000);
      return;
    }
    try {
      showFlashMessage(`Added to hello!`, false, 1000);
      updateCapsule({ friendId: friendId, capsuleId: moment.id, isPreAdded: true });
    } catch (error) {
      showFlashMessage(`Oops! Either showFlashMessage or updateCapsule has errored`, true, 1000);
      console.error("Error during pre-save:", error);
    }
  }, []);

  const scrollToCategoryStart = (category) => {
    console.log(category);
    const categoryIndex = categoryStartIndices[category];
    if (categoryIndex !== undefined) {
      flatListRef.current?.scrollToIndex({
        index: categoryIndex > 0 ? categoryIndex : 0,
        animated: true,
      });
    }
  };

  const viewableItemsArray = useSharedValue<ViewToken[]>([]);

  const memoizedMomentData = useMemo(() => {
    let lastCategory: string | null = null;
    let currentSide: "left" | "right" = "right"; // starting side for alternating

    return capsuleList.map((item) => {
      const rawDate = item?.created || "";
      const date = new Date(rawDate);
      const formattedDate = !isNaN(date.getTime())
        ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date)
        : "lol";

      // Only flip on category change — only relevant for "alternating"
      if (String(item.user_category) !== lastCategory) {
        lastCategory = String(item.user_category);
        currentSide = currentSide === "left" ? "right" : "left";
      }

      const tooltipSide: "left" | "right" =
        tooltipLayout === "left"        ? "left"
        : tooltipLayout === "right"     ? "right"
        : currentSide;                  // "alternating"

      return { ...item, formattedDate, tooltipSide };
    });
  }, [capsuleList, tooltipLayout]);

  useEffect(() => {
    if (capsuleList.length < 1) {
      listVisibility.value = withTiming(0);
    } else if (capsuleList.length === 1) {
      listVisibility.value = withTiming(1);
    }
  }, [capsuleList]);

  useEffect(() => {
    if (!memoizedMomentData || memoizedMomentData.length < 1) {
      listVisibility.value = withTiming(0);
    }
  }, [memoizedMomentData]);

  const categoryNavVisibility = useSharedValue(1);
  const listVisibility = useSharedValue(1);

  useFocusEffect(
    useCallback(() => {
      if (capsuleList.length > 0) {
        listVisibility.value = withSpring(1, { duration: 200 });
        return () => {
          listVisibility.value = withTiming(0, { duration: 200 });
        };
      }
    }, [])
  );

  const scrollY = useSharedValue(0);
  const pullCount = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const y = event.contentOffset.y;
      scrollY.value = y;
      if (y < 10) {
        if (pullCount.value >= 2) {
          categoryNavVisibility.value = withTiming(1);
        }
      } else {
        categoryNavVisibility.value = withTiming(1, { duration: 1000 });
      }
    },
    onBeginDrag: (event) => {
      if (listVisibility.value < 1) {
        listVisibility.value = withSpring(1);
      }
    },
    onEndDrag: (event) => {
      if (event.contentOffset.y <= 0) {
        pullCount.value += 1;
        if (pullCount.value >= 2) {
          listVisibility.value = withSpring(0);
          pullCount.value = 0;
        }
      }
      categoryNavVisibility.value = withTiming(1, { duration: 3000 });
    },
  });

  const renderMomentItem = useCallback(
    ({ item, index }) => (
      <Pressable
        onPress={() => navigateToMomentView({ moment: item, index: index, startWithBackdropTimestamp: Date.now() })}
        style={({ pressed }) => ({
          flex: 1,
          flexDirection: "row",
          width: "100%",
          justifyContent: "center",
          height: ITEM_HEIGHT,
          marginBottom: ITEM_BOTTOM_MARGIN,
          paddingHorizontal: 30,
          opacity: pressed ? 0.6 : 1,
        })}
      >
        <MomentItem
          primaryColor={primaryColor}
          primaryBackgroundColor={primaryBackgroundColor}
          darkerOverlayColor={darkerOverlayColor}
          lighterOverlayColor={lighterOverlayColor}
          friendColor={friendColor}
          momentData={item}
          categorySide={item.tooltipSide}
          combinedHeight={COMBINED_HEIGHT}
          index={index}
          momentDate={item.formattedDate}
          itemHeight={ITEM_HEIGHT}
          visibilityValue={listVisibility}
          scrollYValue={scrollY}
          pressedIndexValue={pressedIndex}
          pulseValue={pulseValue}
          onSend={saveToHello}
          categoryColorsMap={categoryColorsMap}
        />
      </Pressable>
    ),
    [categoryColorsMap]
  );

  const extractItemKey = (item, index) =>
    item?.id ? item.id.toString() : `moment-${index}`;

  const getItemLayout = (item, index) => ({
    length: COMBINED_HEIGHT,
    offset: COMBINED_HEIGHT * index,
    index,
  });

  return (
    <>
      <View style={styles.outerContainer}>
        <MomentsAdded
          overlayBackgroundColor={primaryOverlayColor}
          primaryColor={primaryColor}
          darkerOverlayColor={darkerOverlayColor}
          capsuleList={capsuleList}
          preAdded={preAdded}
          visibilityValue={listVisibility}
        />
        <View style={styles.flatlistOuterWrapper}>
          <View style={styles.flatlistWrapper}>
            <Animated.FlatList
              fadingEdgeLength={0}
              itemLayoutAnimation={JumpingTransition}
              ref={flatListRef}
              data={memoizedMomentData}
              estimatedItemSize={83}
              viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
              scrollEventThrottle={16}
              onScroll={scrollHandler}
              renderItem={renderMomentItem}
              keyExtractor={extractItemKey}
              getItemLayout={getItemLayout}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={10}
              removeClippedSubviews={true}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={() => (
                <View style={{ height: momentListBottomSpacer }} />
              )}
              snapToInterval={COMBINED_HEIGHT}
              decelerationRate="normal"
              keyboardDismissMode="on-drag"
            />
          </View>
        </View>

        <>
          {categoryNavigatorVisible &&
            categoryColorsMap &&
            Object.keys(categoryColorsMap).length > 0 && (
              <CategoryNavigator
                primaryColor={primaryColor}
                backgroundColor={primaryBackgroundColor}
                onClose={handleToggleCatNav}
                visibilityValue={listVisibility}
                viewableItemsArray={viewableItemsArray}
                categoryNames={categoryNames}
                onPress={scrollToCategoryStart}
                onSearchPress={scrollToMoment}
                categoryColorsMap={categoryColorsMap}
              />
            )}
        </>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    width: "100%",
    flex: 1,
    zIndex: 1,
    elevation: 1,
  },
  flatlistOuterWrapper: {
    alignContent: "center",
    alignSelf: "center",
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "87%",
  },
  flatlistWrapper: {
    flex: 1,
    alignItems: "center",
  },
});

export default MomentsList;
















// import React, {
//   useRef,
//   useEffect,
//   useCallback,
//   useMemo,
// } from "react";
// import { View, Text, ViewToken, Pressable, StyleSheet } from "react-native";

// import { useFocusEffect } from "@react-navigation/native";
// import MomentsAdded from "./MomentsAdded";
// import CategoryNavigator from "./CategoryNavigator";
// import MomentItem from "./MomentItem";
// import { showFlashMessage } from "@/src/utils/ShowFlashMessage";

// import Animated, {
//   JumpingTransition,
//   useSharedValue,
//   useAnimatedRef,
//   useAnimatedScrollHandler,
//   withTiming,
//   withSpring,
// } from "react-native-reanimated";

// // ── Single source of truth for item height ─────────────────────
// // getItemLayout AND MomentItem's scroll animations both depend on
// // COMBINED_HEIGHT being accurate. Section headers must NOT add to
// // this height — they are absolutely positioned above the item instead.
// const ITEM_HEIGHT = 100;
// const ITEM_BOTTOM_MARGIN = 0;
// const COMBINED_HEIGHT = ITEM_HEIGHT + ITEM_BOTTOM_MARGIN;
// const SECTION_HEADER_HEIGHT = 36; // visible header sits above the item via negative marginTop on the row

// const MomentsList = ({
//   friendColor,
//   primaryBackgroundColor,
//   primaryColor,
//   primaryOverlayColor,
//   darkerOverlayColor,
//   lighterOverlayColor,
//   navigateBack,
//   categoryNames,
//   categoryStartIndices,
//   capsuleList,
//   preAdded,
//   updateCapsule,
//   navigateToMomentView,
//   friendId,
//   scrollToIndex,
//   categoryColorsMap,
//   handleNavigateToCreateNew,
//   categoryNavigatorVisible,
//   handleToggleCatNav,
//   topCategoryColorValue,
// }) => {
//   useEffect(() => {
//     if (scrollToIndex) {
//       scrollToCategoryStart(scrollToIndex);
//     }
//   }, [scrollToIndex]);

//   const onViewableItemsChangedRef = useRef(({ viewableItems }) => {
//     viewableItemsArray.value = viewableItems;
//   });

//   useEffect(() => {
//     onViewableItemsChangedRef.current = ({ viewableItems }) => {
//       viewableItemsArray.value = viewableItems;
//       const topMoment = viewableItems[0]?.item;
//       if (topMoment && categoryColorsMap[topMoment.user_category]) {
//         topCategoryColorValue.value = categoryColorsMap[topMoment.user_category];
//       }
//     };
//   }, [categoryColorsMap, topCategoryColorValue]);

//   const viewabilityConfigCallbackPairs = useRef([
//     {
//       viewabilityConfig: {
//         minimumViewTime: 40,
//         itemVisiblePercentThreshold: 5,
//         waitForInteraction: false,
//       },
//       onViewableItemsChanged: (info) => onViewableItemsChangedRef.current(info),
//     },
//   ]);

//   const flatListRef = useAnimatedRef(null);
//   const momentListBottomSpacer = 600;
//   const pressedIndex = useSharedValue(null);
//   const pulseValue = useSharedValue(0);

//   const scrollToMoment = (moment) => {
//     if (moment.uniqueIndex !== undefined) {
//       flatListRef.current?.scrollToOffset({
//         offset: COMBINED_HEIGHT * moment.uniqueIndex,
//         animated: false,
//       });
//     }
//   };

//   const saveToHello = useCallback((moment) => {
//     if (!friendId || !moment) {
//       showFlashMessage(`Oops! Missing data required to save idea to hello`, true, 1000);
//       return;
//     }
//     try {
//       showFlashMessage(`Added to hello!`, false, 1000);
//       updateCapsule({ friendId, capsuleId: moment.id, isPreAdded: true });
//     } catch (error) {
//       showFlashMessage(`Oops! Either showFlashMessage or updateCapsule has errored`, true, 1000);
//       console.error("Error during pre-save:", error);
//     }
//   }, []);

//   // categoryStartIndices indexes into capsuleList, and our FlatList
//   // data IS capsuleList, so scrollToIndex is always correct here.
//   const scrollToCategoryStart = (category) => {
//     const categoryIndex = categoryStartIndices[category];
//     if (categoryIndex !== undefined) {
//       flatListRef.current?.scrollToIndex({
//         index: categoryIndex > 0 ? categoryIndex : 0,
//         animated: true,
//       });
//     }
//   };

//   const viewableItemsArray = useSharedValue<ViewToken[]>([]);

//   const memoizedMomentData = useMemo(() => {
//     let lastCategory: string | null = null;
//     let currentSide: "left" | "right" = "right";

//     return capsuleList.map((item) => {
//       const rawDate = item?.created || "";
//       const date = new Date(rawDate);
//       const formattedDate = !isNaN(date.getTime())
//         ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date)
//         : "";

//       if (String(item.user_category) !== lastCategory) {
//         lastCategory = String(item.user_category);
//         currentSide = currentSide === "left" ? "right" : "left";
//       }

//       return { ...item, formattedDate, tooltipSide: currentSide };
//     });
//   }, [capsuleList]);

//   useEffect(() => {
//     if (capsuleList.length < 1) {
//       listVisibility.value = withTiming(0);
//     } else if (capsuleList.length === 1) {
//       listVisibility.value = withTiming(1);
//     }
//   }, [capsuleList]);

//   useEffect(() => {
//     if (!memoizedMomentData || memoizedMomentData.length < 1) {
//       listVisibility.value = withTiming(0);
//     }
//   }, [memoizedMomentData]);

//   const categoryNavVisibility = useSharedValue(1);
//   const listVisibility = useSharedValue(1);

//   useFocusEffect(
//     useCallback(() => {
//       if (capsuleList.length > 0) {
//         listVisibility.value = withSpring(1, { duration: 200 });
//         return () => {
//           listVisibility.value = withTiming(0, { duration: 200 });
//         };
//       }
//     }, []),
//   );

//   const scrollY = useSharedValue(0);
//   const pullCount = useSharedValue(0);

//   const scrollHandler = useAnimatedScrollHandler({
//     onScroll: (event) => {
//       const y = event.contentOffset.y;
//       scrollY.value = y;
//       if (y < 10) {
//         if (pullCount.value >= 2) {
//           categoryNavVisibility.value = withTiming(1);
//         }
//       } else {
//         categoryNavVisibility.value = withTiming(1, { duration: 1000 });
//       }
//     },
//     onBeginDrag: () => {
//       if (listVisibility.value < 1) {
//         listVisibility.value = withSpring(1);
//       }
//     },
//     onEndDrag: (event) => {
//       if (event.contentOffset.y <= 0) {
//         pullCount.value += 1;
//         if (pullCount.value >= 2) {
//           listVisibility.value = withSpring(0);
//           pullCount.value = 0;
//         }
//       }
//       categoryNavVisibility.value = withTiming(1, { duration: 3000 });
//     },
//   });

//   const renderMomentItem = useCallback(
//     ({ item, index }) => {
//       const categoryColor = categoryColorsMap
//         ? (categoryColorsMap[String(item.user_category)] ?? "#ccc")
//         : "#ccc";

//       const isFirstInCategory =
//         categoryStartIndices &&
//         Object.values(categoryStartIndices).includes(index);

//       return (
//         // Outer wrapper is exactly COMBINED_HEIGHT tall — getItemLayout stays accurate.
//         // The section header floats above the card via position:absolute with a
//         // negative top so it overlaps the space above without expanding the row height.
//         <View style={{ height: COMBINED_HEIGHT }}>

//           {isFirstInCategory && (
//             <View
//               style={[
//                 styles.sectionHeader,
//                 {
//                   top: -SECTION_HEADER_HEIGHT,
//                   // nudge the first category down so it doesn't clip off the top
//                   ...(index === 0 && { top: 4 }),
//                 },
//               ]}
//             >
//               <Text style={[styles.sectionHeaderText, { color: categoryColor }]}>
//                 {item.user_category_name ?? ""}
//               </Text>
//               <View
//                 style={[
//                   styles.sectionHeaderLine,
//                   { backgroundColor: `${categoryColor}33` },
//                 ]}
//               />
//             </View>
//           )}

//           <Pressable
//             onPress={() => navigateToMomentView({ moment: item, index })}
//             style={({ pressed }) => ({
//               flex: 1,
//               flexDirection: "row",
//               width: "100%",
//               justifyContent: "center",
//               height: ITEM_HEIGHT,
//               marginBottom: ITEM_BOTTOM_MARGIN,
//               paddingHorizontal: 0,
//               opacity: pressed ? 0.6 : 1,
//             })}
//           >
//             <MomentItem
//               primaryColor={primaryColor}
//               primaryBackgroundColor={primaryBackgroundColor}
//               darkerOverlayColor={darkerOverlayColor}
//               lighterOverlayColor={lighterOverlayColor}
//               friendColor={friendColor}
//               momentData={item}
//               categorySide={item.tooltipSide}
//               combinedHeight={COMBINED_HEIGHT}
//               index={index}
//               momentDate={item.formattedDate}
//               itemHeight={ITEM_HEIGHT}
//               visibilityValue={listVisibility}
//               scrollYValue={scrollY}
//               pressedIndexValue={pressedIndex}
//               pulseValue={pulseValue}
//               onSend={saveToHello}
//               categoryColorsMap={categoryColorsMap}
//             />
//           </Pressable>
//         </View>
//       );
//     },
//     [categoryColorsMap, categoryStartIndices],
//   );

//   const extractItemKey = (item, index) =>
//     item?.id ? item.id.toString() : `moment-${index}`;

//   // getItemLayout is back — every row is COMBINED_HEIGHT, headers are
//   // absolutely positioned so they don't affect the measured height.
//   const getItemLayout = (_data, index) => ({
//     length: COMBINED_HEIGHT,
//     offset: COMBINED_HEIGHT * index,
//     index,
//   });

//   return (
//     <>
//       <View style={styles.outerContainer}>
//         <MomentsAdded
//           overlayBackgroundColor={primaryOverlayColor}
//           primaryColor={primaryColor}
//           darkerOverlayColor={darkerOverlayColor}
//           capsuleList={capsuleList}
//           preAdded={preAdded}
//           visibilityValue={listVisibility}
//         />
//         <View style={styles.flatlistOuterWrapper}>
//           <View style={styles.flatlistWrapper}>
//             <Animated.FlatList
//               fadingEdgeLength={0}
//               itemLayoutAnimation={JumpingTransition}
//               ref={flatListRef}
//               data={memoizedMomentData}
//               estimatedItemSize={COMBINED_HEIGHT}
//               viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
//               scrollEventThrottle={16}
//               onScroll={scrollHandler}
//               renderItem={renderMomentItem}
//               keyExtractor={extractItemKey}
//               getItemLayout={getItemLayout}
//               initialNumToRender={10}
//               maxToRenderPerBatch={10}
//               windowSize={10}
//               removeClippedSubviews={true}
//               showsVerticalScrollIndicator={false}
//               ListFooterComponent={() => <View style={{ height: momentListBottomSpacer }} />}
//               snapToInterval={COMBINED_HEIGHT}
//               decelerationRate="normal"
//               keyboardDismissMode="on-drag"
//             />
//           </View>
//         </View>

//         {categoryNavigatorVisible &&
//           categoryColorsMap &&
//           Object.keys(categoryColorsMap).length > 0 && (
//             <CategoryNavigator
//               primaryColor={primaryColor}
//               backgroundColor={primaryBackgroundColor}
//               onClose={handleToggleCatNav}
//               visibilityValue={listVisibility}
//               viewableItemsArray={viewableItemsArray}
//               categoryNames={categoryNames}
//               onPress={scrollToCategoryStart}
//               onSearchPress={scrollToMoment}
//               categoryColorsMap={categoryColorsMap}
//             />
//           )}
//       </View>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   outerContainer: {
//     width: "100%",
//     flex: 1,
//     zIndex: 1,
//     elevation: 1,
//   },
//   flatlistOuterWrapper: {
//     alignContent: "center",
//     alignSelf: "center",
//     width: "100%",
//     flexDirection: "column",
//     justifyContent: "space-between",
//     height: "87%",
//   },
//   flatlistWrapper: {
//     flex: 1,
//     alignItems: "center",
//   },
//   sectionHeader: {
//     position: "absolute",
//     left: 24,
//     right: 0,
//     height: SECTION_HEADER_HEIGHT,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//     zIndex: 2,
//   },
//   sectionHeaderText: {
//     fontSize: 11,
//     fontWeight: "600",
//     letterSpacing: 1.2,
//     textTransform: "uppercase",
//     fontFamily: "Poppins-Regular",
//     flexShrink: 0,
//   },
//   sectionHeaderLine: {
//     flex: 1,
//     height: StyleSheet.hairlineWidth,
//     borderRadius: 1,
//     marginRight: 24,
//   },
// });

// export default MomentsList;