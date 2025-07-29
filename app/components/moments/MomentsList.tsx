import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { View, ViewToken, Pressable, Text } from "react-native";
import GeckoToHelloButton from "./GeckoToHelloButton";
import { useFocusEffect } from "@react-navigation/native";
import EscortBarMinusWidth from "./EscortBarMinusWidth";
import MomentsAdded from "./MomentsAdded";
import CategoryNavigator from "./CategoryNavigator";
import MomentItem from "./MomentItem";
import LargeCornerLizard from "./LargeCornerLizard";
import useTalkingPCategorySorting from "@/src/hooks/useTalkingPCategorySorting";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import SwipeDown from "./SwipeDown";
import Animated, {
  // LinearTransition,
  JumpingTransition,
  // CurvedTransition,
  // EntryExitTransition,
  // SequencedTransition,
  // FadingTransition,
  useSharedValue,
  useAnimatedRef,
  useAnimatedScrollHandler,
  withTiming,
  // runOnJS,
  // runOnUI,
  // scrollTo,
  // Easing,
  FadeOut,
  FadeIn,
  withSpring,
  SlideInRight,
  SlideOutRight,
  SlideOutLeft,
  SlideInLeft,
} from "react-native-reanimated";

import { useNavigation } from "@react-navigation/native";

import { useCapsuleList } from "@/src/context/CapsuleListContext";
import { MaterialIcons } from "@expo/vector-icons";

// import { enableLayoutAnimations } from "react-native-reanimated";
// enableLayoutAnimations(true);
// import { enableFreeze } from "react-native-screens";
// enableFreeze(true);

//const ITEM_HEIGHT = 290;

const MomentsList = ({ scrollTo, categoryColorsMap }) => {
  useEffect(() => {
    if (scrollTo) {
      scrollToCategoryStart(scrollTo);
    }
  }, [scrollTo]);

  const { capsuleList, updateCapsule } = useCapsuleList();
  const { themeStyles } = useGlobalStyle();

  const { categoryNames, categoryStartIndices } = useTalkingPCategorySorting({
    listData: capsuleList,
  });
  const navigation = useNavigation();
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
    if (moment.uniqueIndex !== undefined) {
      flatListRef.current?.scrollToOffset({
        offset: COMBINED_HEIGHT * moment.uniqueIndex,
        animated: false, // disables the "intermediate" rendering problem
      });
    }
  };

  // const scrollToRandomItem = () => {
  //   if (capsuleList.length === 0) return;

  //   const randomIndex = Math.floor(Math.random() * capsuleList.length);
  //   // flatListRef.current?.scrollToIndex({
  //   flatListRef.current?.scrollToOffset({
  //     offset: ITEM_HEIGHT * randomIndex,
  //     // index: randomIndex,
  //     animated: false,
  //   });
  // };

  const saveToHello = useCallback((moment) => {
    try {
      updateCapsule(moment.id, true);
    } catch (error) {
      console.error("Error during pre-save:", error);
    }
  }, []);

  const handleNavigateToMomentView = useCallback((moment) => {
    navigation.navigate("MomentView", { moment: moment });
  }, []);

  // const scrollToEnd = () => {
  //   flatListRef.current?.scrollToEnd({ animated: true });
  // };

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

  const categoryNavVisibility = useSharedValue(1);
  const listVisibility = useSharedValue(1);

  useFocusEffect(
    useCallback(() => {
      listVisibility.value = withSpring(1, { duration: 100 }); //800

      return () => {
        listVisibility.value = withTiming(0, { duration: 2000 }); //NEEDED OR ELSE LISTVISIBILITY BEING ZERO WILL TRIGGER PREADDED BUTTON TO APPEAR just looks bad :)
      };
    }, [])
  );

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const y = event.contentOffset.y;
      scrollY.value = event.contentOffset.y;
      if (y < 10) {
        // if less than ten pixels (on the top of the screen)
        // listVisibility.value = withTiming(1);
        categoryNavVisibility.value = withTiming(1);
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
        listVisibility.value = withSpring(0);
      }
      categoryNavVisibility.value = withTiming(1, { duration: 3000 });
    },
  });

  const renderMomentItem = useCallback(
    ({ item, index }) => (
      <Pressable
        onPress={() =>
          navigation.navigate("MomentView", { moment: item, index: index })
        }
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
    [
      // viewableItemsArray,
      // momentIdToAnimate,
      // fadeAnim,
      handleNavigateToMomentView,
      categoryColorsMap,
      // saveToHello,
    ]
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
    <View style={{ width: "100%", flex: 1, zIndex: 1, elevation: 1 }}>
      <View
        style={{
          position: "absolute",
          flexDirection: "row",
          width: "100%",
          justifyContent: "flex-end",
          alignItems: "center",
          paddingHorizontal: 10,
        }}
      >
       <SwipeDown label={`Undo`} flipLabel={`Back`} visibilityValue={listVisibility} />
      </View>
      {!categoryNavigatorVisible && (
        <Animated.View
          exiting={FadeOut}
          entering={FadeIn}
          style={{ flex: 1, position: "absolute", bottom: 0 }}
        >
          <LargeCornerLizard />
        </Animated.View>
      )}

      <MomentsAdded visibilityValue={listVisibility} />
      <View
        style={{
          alignContent: "center",
          alignSelf: "center",
          width: "100%",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "87%",
        }}
      >
        <Animated.View
          style={{ flex: 1, alignItems: "center" }}
          entering={SlideInRight.duration(260).springify(2000)}
        >
          <Animated.FlatList
            fadingEdgeLength={0}
            itemLayoutAnimation={JumpingTransition}
            // itemLayoutAnimation={CurvedTransition}
            // itemLayoutAnimation={EntryExitTransition}
            //  itemLayoutAnimation={SequencedTransition}
            // itemLayoutAnimation={FadingTransition}
            ref={flatListRef}
            data={memoizedMomentData}
            estimatedItemSize={83}
            // data={capsuleList}
            // fadingEdgeLength={20}
            // viewabilityConfig={viewabilityConfig}
            //  onViewableItemsChanged={onViewableItemsChanged}
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
        </Animated.View>
      </View>

      {/* {!isKeyboardVisible && ( */}
      <>
        {categoryNavigatorVisible &&
          categoryColorsMap &&
          Object.keys(categoryColorsMap).length > 0 && (
            <CategoryNavigator
              onClose={() => setCategoryNavigatorVisible(false)}
              visibilityValue={listVisibility}
              viewableItemsArray={viewableItemsArray}
              categoryNames={categoryNames}
              onPress={scrollToCategoryStart}
              onSearchPress={scrollToMoment}
              categoryColorsMap={categoryColorsMap}
            />
          )}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            paddingHorizontal: 10,
          }}
        >
          {!categoryNavigatorVisible && (
            <Animated.View
              exiting={SlideOutRight}
              entering={SlideInRight}
              style={{
                flexDirection: "row",
                position: "absolute",
                bottom: 16,
                zIndex: 50000,
                height: 38,
                width: 60,
                right: 18,
                justifyContent: "flex-end",
              }}
            >
              <GeckoToHelloButton />
            </Animated.View>
          )}

          {!categoryNavigatorVisible && (
            <>
              <EscortBarMinusWidth onPress={() => setCategoryNavigatorVisible(true)} />
            </>
          )}
        </View>
      </>
      {/* )} */}
    </View>
  );
};

export default MomentsList;
