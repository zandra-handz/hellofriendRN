import React, { useRef, useEffect, useCallback, useMemo } from "react";
import { View, ViewToken, Pressable, StyleSheet } from "react-native";
import RestoreButton from "./RestoreButton";
import GoHomeButton from "./GoHomeButton";
import { useFocusEffect } from "@react-navigation/native";
import MomentsAdded from "./MomentsAdded";
import MomentsAddedStatic from "./MomentsAddedStatic";
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

import { SharedValue } from "react-native-reanimated";

type TooltipLayout = "left" | "right" | "alternating";

type Props = {
  triggerClose: number;
  navigateBack: () => void;
  friendColor: string;
  backgroundColor: string;
  textColor: string;
  overlayColor: string;
  overlayColorDarker: string;
  overlayColorLighter: string;
  categoryNames: string[];
  categoryStartIndices: number[];
  capsuleList: any[]; // replace with your Capsule type if you have one
  preAdded: any[]; // replace with your PreAdded type if you have one
  updateCapsule: (args: any) => void;
  navigateToMomentView: (args: any) => void;
  friendId: number;
  scrollToIndex: number | null;
  categoryColorsMap: Record<string, string>;
  categoryNavigatorVisible: boolean;
  handleToggleCatNav: () => void;
  topCategoryColorValue: SharedValue<string>;
  tooltipLayout?: TooltipLayout;
};

const MomentsList = ({
  shouldResetRef,
  triggerClose,
  navigateBack,
  friendColor,
  backgroundColor,
  textColor,
  overlayColor,
  overlayColorDarker,
  overlayColorLighter,
  categoryNames,
  categoryStartIndices,
  capsuleList,
  preAdded,
  updateCapsule,
  navigateToMomentView,
  friendId,
  scrollToIndex,
  categoryColorsMap,
  categoryNavigatorVisible,
  handleToggleCatNav,
  topCategoryColorValue,
  tooltipLayout = "left" as TooltipLayout, // "left" | "right" | "alternating"
}: Props) => {
  const NAV_BACK_LIST_VISIBILITY_TIMING = 500;
  const NAV_BACK_SCROLL_TIMING = 10;
  const NAV_BACK_NAVIGATION_TIMING = 300;

  const flatListRef = useAnimatedRef(null);

  useEffect(() => {
    if (triggerClose && triggerClose > 0) {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });

      setTimeout(() => {
        pullCount.value = 2;
        scrollY.value = 0;
        listVisibility.value = withTiming(0, {
          duration: NAV_BACK_LIST_VISIBILITY_TIMING,
        });
      }, NAV_BACK_SCROLL_TIMING);

      setTimeout(() => {
        navigateBack();
      }, NAV_BACK_NAVIGATION_TIMING);
    }
  }, [triggerClose]);

  // useEffect(() => {
  //   if (scrollToIndex) {
  //     console.log("scroll to index!!!!", scrollToIndex);
  //     scrollToCategoryStart(scrollToIndex);
  //   }
  // }, [scrollToIndex]);

  // useFocusEffect(
  //   useCallback(() => {
  //     listVisibility.value = 0;
  //     pullCount.value = 0;
  //     listVisibility.value = withSpring(1);

  //     if (scrollToIndex) {
  //       setTimeout(() => {
  //         scrollToCategoryStart(scrollToIndex);
  //       }, 200); // wait for spring to finish
  //     }
  //   }, [scrollToIndex])
  // );

  const isFirstFocus = useRef(true);

  useFocusEffect(
    useCallback(() => {
      if (isFirstFocus.current) {
        listVisibility.value = 0;
        pullCount.value = 0;
        listVisibility.value = withSpring(1);

        if (scrollToIndex) {
          setTimeout(() => {
            scrollToCategoryStart(scrollToIndex);
          }, 200);
        }
        isFirstFocus.current = false;
      }
    }, [scrollToIndex]),
  );
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
        topCategoryColorValue.value =
          categoryColorsMap[topMoment.user_category];
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
      showFlashMessage(
        `Oops! Missing data required to save idea to hello`,
        true,
        1000,
      );
      return;
    }
    try {
      showFlashMessage(`Added to hello!`, false, 1000);
      updateCapsule({
        friendId: friendId,
        capsuleId: moment.id,
        isPreAdded: true,
      });
    } catch (error) {
      showFlashMessage(
        `Oops! Either showFlashMessage or updateCapsule has errored`,
        true,
        1000,
      );
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
        ? new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
          }).format(date)
        : "lol";

      // Only flip on category change — only relevant for "alternating"
      if (String(item.user_category) !== lastCategory) {
        lastCategory = String(item.user_category);
        currentSide = currentSide === "left" ? "right" : "left";
      }

      const tooltipSide: "left" | "right" =
        tooltipLayout === "left"
          ? "left"
          : tooltipLayout === "right"
            ? "right"
            : currentSide; // "alternating"

      return { ...item, formattedDate, tooltipSide };
    });
  }, [capsuleList, tooltipLayout]);

  // useEffect(() => {
  //   if (capsuleList.length < 1) {
  //     listVisibility.value = withTiming(0);
  //   } else if (capsuleList.length === 1) {
  //     listVisibility.value = withTiming(1);
  //   }
  // }, [capsuleList]);

  useEffect(() => {
    if (!memoizedMomentData || memoizedMomentData.length < 1) {
      listVisibility.value = withTiming(0);
    } else {
      listVisibility.value = withTiming(1);
    }
  }, [memoizedMomentData]);

  const categoryNavVisibility = useSharedValue(1);
  const listVisibility = useSharedValue(1);

  // useFocusEffect(
  //   useCallback(() => {
  //     if (capsuleList.length > 0) {
  //       listVisibility.value = withSpring(1, { duration: 200 });
  //       return () => {
  //         listVisibility.value = withTiming(0, { duration: 200 });
  //       };
  //     }
  //   }, [])
  // );

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
        onPress={() =>
          navigateToMomentView({
            index: index,
            startWithBackdropTimestamp: Date.now(),
            momentId: item.id,
          })
        }
        style={({ pressed }) => ({
          flex: 1,
          flexDirection: "row",
          width: "100%",
          justifyContent: "center",
          height: ITEM_HEIGHT,
          marginBottom: ITEM_BOTTOM_MARGIN,
          paddingHorizontal: 20,
          opacity: pressed ? 0.6 : 1,
        })}
      >
        <MomentItem
          primaryColor={textColor}
          primaryBackgroundColor={backgroundColor}
          darkerOverlayColor={overlayColorDarker}
          lighterOverlayColor={overlayColorLighter}
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
    [categoryColorsMap],
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
        {/* <MomentsAdded
          overlayBackgroundColor={overlayColor}
          primaryColor={textColor}
          darkerOverlayColor={overlayColorDarker}
          capsuleList={capsuleList}
          preAdded={preAdded}
          visibilityValue={listVisibility}
        /> */}
        <View style={styles.flatlistOuterWrapper}>
          <View style={styles.flatlistWrapper}>
            <Animated.FlatList
              fadingEdgeLength={0}
              itemLayoutAnimation={JumpingTransition}
              ref={flatListRef}
              data={memoizedMomentData}
              estimatedItemSize={83}
              viewabilityConfigCallbackPairs={
                viewabilityConfigCallbackPairs.current
              }
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
        
            <RestoreButton
              primaryColor={textColor}
              darkerOverlayColor={'transparent'}
              preAdded={preAdded}
            />

            <GoHomeButton
              primaryColor={textColor}
              darkerOverlayColor={'transparent'}
              shouldResetRef={shouldResetRef}
            /> 
        </View>

        <>
          {categoryNavigatorVisible &&
            categoryColorsMap &&
            Object.keys(categoryColorsMap).length > 0 && (
              <CategoryNavigator
                primaryColor={textColor}
                backgroundColor={backgroundColor}
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
  buttonsWrapper: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 10,
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
