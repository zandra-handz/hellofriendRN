import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { View, ViewToken, Pressable, StyleSheet } from "react-native";
import GeckoToHelloButton from "./GeckoToHelloButton";
import { useFocusEffect } from "@react-navigation/native";
import EscortBarMinusWidth from "./EscortBarMinusWidth";
import MomentsAdded from "./MomentsAdded";
import CategoryNavigator from "./CategoryNavigator";
import MomentSearcher from "./MomentSearcher";
import MomentItem from "./MomentItem";
import LargeCornerLizard from "./LargeCornerLizard";
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";
import SwipeDown from "./SwipeDown";
import Animated, {
  JumpingTransition,
  useSharedValue,
  useAnimatedRef,
  useAnimatedScrollHandler,
  withTiming,
 
  withSpring, 
} from "react-native-reanimated";

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
}) => {
  useEffect(() => {
    if (scrollToIndex) {
      scrollToCategoryStart(scrollToIndex);
    }
  }, [scrollToIndex]);

  const ITEM_HEIGHT = 80;
  const ITEM_BOTTOM_MARGIN = 18;
  const COMBINED_HEIGHT = ITEM_HEIGHT + ITEM_BOTTOM_MARGIN;

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    viewableItemsArray.value = viewableItems;
  }, []);

  const viewabilityConfig = useRef({
    minimumViewTime: 40,
    itemVisiblePercentThreshold: 5,
    //viewAreaCoveragePercentThreshold: 50,
    waitForInteraction: false,
  }).current;

  const viewabilityConfigCallbackPairs = useRef([
    {
      viewabilityConfig,
      onViewableItemsChanged,
    },
  ]);

  const flatListRef = useAnimatedRef(null);

  const momentListBottomSpacer = 600;

  const pressedIndex = useSharedValue(null);
  const pulseValue = useSharedValue(0);

  const [categoryNavigatorVisible, setCategoryNavigatorVisible] =
    useState(false);

  const scrollToMoment = (moment) => {
    console.log("scroll to moment: ", moment);
    if (moment.uniqueIndex !== undefined) {
      flatListRef.current?.scrollToOffset({
        offset: COMBINED_HEIGHT * moment.uniqueIndex,
        animated: false, // disables the "intermediate" rendering problem
      });
    }
  };

  const saveToHello = useCallback((moment) => {
    if (!friendId || !moment) {
      showFlashMessage(
        `Oops! Missing data required to save idea to hello`,
        true,
        1000
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
        1000
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
    return capsuleList.map((item) => {
      const rawDate = item?.created || "";
      const date = new Date(rawDate);

      const formattedDate = !isNaN(date.getTime())
        ? new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
          }).format(date)
        : "lol";

      return { ...item, formattedDate };
    });
  }, [capsuleList]);

  useEffect(() => {
    if (capsuleList.length < 1) {
      // console.log("capsule list is empty");
      listVisibility.value = withTiming(0);
    } else if (capsuleList.length === 1) {
      listVisibility.value = withTiming(1);
    }
  }, [capsuleList]);

  useEffect(() => {
    if (!memoizedMomentData || memoizedMomentData.length < 1) {
      // console.log("memoized data triggerd this!", memoizedMomentData);
      listVisibility.value = withTiming(0);
    }
  }, [memoizedMomentData]);

  const categoryNavVisibility = useSharedValue(1);
  const listVisibility = useSharedValue(1);

  useFocusEffect(
    useCallback(() => {
      if (capsuleList.length > 0) {
        listVisibility.value = withSpring(1, { duration: 200 }); //800

        return () => {
          listVisibility.value = withTiming(0, { duration: 200 }); //NEEDED OR ELSE LISTVISIBILITY BEING ZERO WILL TRIGGER PREADDED BUTTON TO APPEAR just looks bad :)
        };
      }
    }, [])
  );

  const scrollY = useSharedValue(0);
  const pullCount = useSharedValue(0); // track number of pulls

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const y = event.contentOffset.y;
      scrollY.value = y;

      if (y < 10) {
        // only trigger categoryNavVisibility if user has pulled twice
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
        pullCount.value += 1; // increment pull count when pulled to top

        if (pullCount.value >= 2) {
          listVisibility.value = withSpring(0);
          // reset counter so it doesn’t keep firing
          pullCount.value = 0;
        }
      }

      categoryNavVisibility.value = withTiming(1, { duration: 3000 });
    },
  });

  const handleCloseCategoryNav = () => {
    setCategoryNavigatorVisible(false);
  };
  const renderMomentItem = useCallback(
    ({ item, index }) => (
      <Pressable
        onPress={() => navigateToMomentView({ moment: item, index: index })}
        style={({ pressed }) => ({
          flex: 1,
          flexDirection: "row",
          width: "100%",
          justifyContent: "center",

          height: ITEM_HEIGHT,
          marginBottom: ITEM_BOTTOM_MARGIN,
          paddingHorizontal: 4,
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
          combinedHeight={COMBINED_HEIGHT}
          index={index} //ADD to component if want to alternative moment item layout
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

  const getItemLayout = (item, index) => {
    return {
      length: COMBINED_HEIGHT,
      offset: COMBINED_HEIGHT * index,
      index,
    };
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.swipeDownContainer}>
        <SwipeDown
          label={`Undo`}
          flipLabel={`Back`}
          visibilityValue={listVisibility}
          primaryColor={primaryColor}
          primaryOverlayColor={primaryOverlayColor}
        />
      </View>
      {!categoryNavigatorVisible && (
        <View style={styles.geckoWrapper}>
          <LargeCornerLizard color={darkerOverlayColor} />
        </View>
      )}

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
            viewabilityConfigCallbackPairs={
              viewabilityConfigCallbackPairs.current
            }
            // contentContainerStyle={{backgroundColor: "teal"}} just for debugging
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
            // onScrollToIndexFailed={(info) => {
            //   //scroll to beginning maybe instead? not sure what this is doing
            //   flatListRef.current?.scrollToOffset({
            //     offset: info.averageItemLength * info.index,
            //     animated: true,
            //   });
            // }}
            snapToInterval={COMBINED_HEIGHT}
            //snapToAlignment="start"
            // decelerationRate="fast" //   makes the scroll feel snappier
            decelerationRate="normal"
            keyboardDismissMode="on-drag"
          />
          {/* </Animated.View> */}
        </View>
      </View>

      <>
        {categoryNavigatorVisible &&
          categoryColorsMap &&
          Object.keys(categoryColorsMap).length > 0 && (
            <CategoryNavigator
              primaryColor={primaryColor}
              backgroundColor={primaryBackgroundColor}
              onClose={handleCloseCategoryNav}
              visibilityValue={listVisibility}
              viewableItemsArray={viewableItemsArray}
              categoryNames={categoryNames}
              onPress={scrollToCategoryStart}
              onSearchPress={scrollToMoment}
              categoryColorsMap={categoryColorsMap}
            />
          )}
        <View style={styles.bottomBarContainer}>
          {!categoryNavigatorVisible && (
            <View style={styles.geckoToHelloButtonContainer}>
              <GeckoToHelloButton />
            </View>
          )}

          {!categoryNavigatorVisible && (
            <>
              <MomentSearcher onSearchPress={scrollToMoment} />

              <EscortBarMinusWidth
                backgroundColor={primaryBackgroundColor}
                overlayColor={primaryOverlayColor}
                primaryColor={primaryColor}
                navigateBack={navigateBack}
                onPress={() => setCategoryNavigatorVisible(true)}
              />
            </>
          )}
        </View>
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    width: "100%",
    flex: 1,
    zIndex: 1,
    elevation: 1,
  },
  swipeDownContainer: {
    position: "absolute",
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  geckoWrapper: {
    flex: 1,
    position: "absolute",
    bottom: 0,
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
  bottomBarContainer: {
    position: "absolute",
    bottom: 10,
    width: "100%",
    paddingHorizontal: 10,
  },
  geckoToHelloButtonContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 6,
    right: 18,
    zIndex: 50000,
    height: 38,
    width: 60,
    justifyContent: "flex-end",
  }
});

export default MomentsList;
