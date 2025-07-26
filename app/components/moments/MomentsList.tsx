import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { View, Keyboard, ViewToken, Pressable } from "react-native";

import { useFocusEffect } from "@react-navigation/native";

import MomentsAdded from "./MomentsAdded";
import CategoryNavigator from "./CategoryNavigator";
import MomentItem from "./MomentItem";
import LargeCornerLizard from "./LargeCornerLizard";

import useTalkingPCategorySorting from "@/src/hooks/useTalkingPCategorySorting";

import LargeThoughtBubble from "./LargeThoughtBubble";

import Animated, {
  LinearTransition,
  JumpingTransition,
  CurvedTransition,
  EntryExitTransition,
  SequencedTransition,
  FadingTransition,
  useSharedValue,
  useAnimatedRef,
  useAnimatedScrollHandler,
  withTiming,
  runOnJS,
  runOnUI,
  scrollTo,
  Easing,
  withSpring,
  SlideInRight,
} from "react-native-reanimated";

import { useNavigation } from "@react-navigation/native";

import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useCapsuleList } from "@/src/context/CapsuleListContext";

// import { enableLayoutAnimations } from "react-native-reanimated";
// enableLayoutAnimations(true);
// import { enableFreeze } from "react-native-screens";
// enableFreeze(true);

//const ITEM_HEIGHT = 290;

const MomentsList = ({ scrollTo }) => {
  useEffect(() => {
    if (scrollTo) {
      scrollToCategoryStart(scrollTo);
    }
  }, [scrollTo]);

  //   useFocusEffect(
  //   useCallback(() => {
  //   if (scrollTo) {
  //     console.log(`scrollTo: `, scrollTo);
  //     scrollToCategoryStart(scrollTo);
  //   }
  //   }, [scrollTo])
  // );

  const { appContainerStyles } = useGlobalStyle();
  const {
    capsuleList,
    // categoryNames,
    // categoryStartIndices,
    updateCapsule,
  } = useCapsuleList();

  const { categoryNames, categoryStartIndices } = useTalkingPCategorySorting({
    listData: capsuleList,
  });

  const navigation = useNavigation();
  const ITEM_HEIGHT = 64;
  const ITEM_BOTTOM_MARGIN = 18;
  const COMBINED_HEIGHT = ITEM_HEIGHT + ITEM_BOTTOM_MARGIN;

  // console.log('MOMENTS LIST RERENDERED');
  // Move this inside your component:
  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    viewableItemsArray.value = viewableItems;
  }, []);

  // console.log('MOMENTS LIST RERENDERED');

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

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const momentListBottomSpacer = 600;

  // const translateX = useSharedValue(0);
  // const heightAnim = useSharedValue(ITEM_HEIGHT + ITEM_BOTTOM_MARGIN);

  const pressedIndex = useSharedValue(null);
  const pulseValue = useSharedValue(0);

  const belowHeaderIconSize = 28;

  // const scrollY = useSharedValue(0);
  const fadeAnim = useSharedValue(1);
  // const translateY = useSharedValue(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setIsKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setIsKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

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

  const scrollToEnd = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const scrollToCategoryStart = (category) => {
    console.log(category);
    const categoryIndex = categoryStartIndices[category];

    if (categoryIndex !== undefined) {
      flatListRef.current?.scrollToIndex({
        // flatListRef.current?.scrollToOffset({
        index: categoryIndex > 0 ? categoryIndex : 0,
        //  offset: categoryIndex > 0 ? ITEM_HEIGHT * categoryIndex : 0,
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
        listVisibility.value = 0;
      };
    }, [])
  );

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      //console.log(event.contentOffset.y);
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
          // style={{
    
     //   backgroundColor: 'teal',
   flex: 1,
   flexDirection: 'row',
   width: '100%',
   justifyContent: 'center',
      
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
        />
      </Pressable>
    ),
    [
      // viewableItemsArray,
      // momentIdToAnimate,
      // fadeAnim,
      handleNavigateToMomentView,
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
    <View style={{    width: "100%",
    flex: 1,
    zIndex: 1,
    elevation: 1 }}>
      <LargeCornerLizard />
      {/* <LargeThoughtBubble capsuleCount={capsuleList.length} /> */}

      <MomentsAdded visibilityValue={listVisibility} />
      <View
        style={{
          // flex: 1,
          alignContent: "center",
          alignSelf: "center",
          width: "100%",
      
          flexDirection: "column",
          justifyContent: "space-between",
          height: "87%",
        }}
      >
        <Animated.View
          style={{  flex: 1, alignItems: 'center' }}
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
        <CategoryNavigator
          visibilityValue={listVisibility}
          viewableItemsArray={viewableItemsArray}
          categoryNames={categoryNames}
          onPress={scrollToCategoryStart}
          onSearchPress={scrollToMoment}
        />
      </>
      {/* )} */}
    </View>
  );
};

export default MomentsList;
