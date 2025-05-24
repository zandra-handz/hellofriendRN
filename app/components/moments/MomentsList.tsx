import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { View, Keyboard, ViewToken } from "react-native";

import { useFriendList } from "@/src/context/FriendListContext";

import ButtonGoToAddMoment from "../buttons/moments/ButtonGoToAddMoment";
import LizardSvg from "@/app/assets/svgs/lizard.svg";
import MomentsNavigator from "./MomentsNavigator";
import CategoryNavigator from "./CategoryNavigator";
import MomentsSearchBar from "./MomentsSearchBar";
import DiceRollScroll from "./DiceRollScroll";
import MomentCardAnimationWrapper from "./MomentCardAnimationWrapper";

import LargeCornerLizard from "./LargeCornerLizard";

import Animated, {
  LinearTransition,
  JumpingTransition,
  CurvedTransition,
  EntryExitTransition,
  SequencedTransition,
  FadingTransition,
  useSharedValue,
  useAnimatedRef,
  useDerivedValue,
  useAnimatedScrollHandler,
  useAnimatedReaction,
  withTiming,
  runOnJS,
  runOnUI,
  scrollTo,
  Easing,
} from "react-native-reanimated";

import { useNavigation } from "@react-navigation/native";

import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useCapsuleList } from "@/src/context/CapsuleListContext";

import BodyStyling from "../scaffolding/BodyStyling";
import BelowHeaderContainer from "../scaffolding/BelowHeaderContainer";

// import { enableLayoutAnimations } from "react-native-reanimated";
// enableLayoutAnimations(true);
// import { enableFreeze } from "react-native-screens";
// enableFreeze(true);

const ITEM_HEIGHT = 290;
const ITEM_BOTTOM_MARGIN = 0;
const COMBINED_HEIGHT = ITEM_HEIGHT + ITEM_BOTTOM_MARGIN;

const MomentsList = () => {
  const { appContainerStyles } = useGlobalStyle();
  const { themeAheadOfLoading } = useFriendList();
  const {
    capsuleList,
    setMomentIdToAnimate,

    momentIdToAnimate,
    momentIdToUpdate,
    setMomentIdToUpdate,
    updateCacheWithNewPreAdded,
    updateCacheWithEditedMoment,
    categoryNames,
    categoryStartIndices,
    updateCapsule,
  } = useCapsuleList();

  const navigation = useNavigation();

  // const viewabilityConfig = {
  //  itemVisiblePercentThreshold: 50,
  //  // viewAreaCoveragePercentThreshold: 50,

  // };

  // Move this inside your component:
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

  const [selectedMomentToView, setSelectedMomentToView] = useState(null);
  const [isMomentNavVisible, setMomentNavVisible] = useState(false);
  const flatListRef = useAnimatedRef(null);

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const momentListBottomSpacer = 700;

  const translateX = useSharedValue(0);
  const heightAnim = useSharedValue(ITEM_HEIGHT + ITEM_BOTTOM_MARGIN);

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

  useEffect(() => {
    if (momentIdToAnimate) {
      translateX.value = withTiming(500, { duration: 0 }, () => {
        heightAnim.value = withTiming(0, { duration: 200 }, () => {
          runOnJS(updateCacheWithNewPreAdded)();
          runOnJS(setMomentIdToAnimate)(null);

          fadeAnim.value = 1;
          heightAnim.value = withTiming(COMBINED_HEIGHT, {
            duration: 0,
          });
          translateX.value = withTiming(0, { duration: 0 });
        });
      });
    }
  }, [momentIdToAnimate]);

  // useEffect(() => {
  //   if (momentIdToUpdate) {
  //     console.log("moment updated!");
  //     runOnJS(updateCacheWithEditedMoment)();
  //     runOnJS(setMomentIdToUpdate)(null);
  //   }
  // }, [momentIdToUpdate]);

  // const scrollToMoment = (moment) => {
  //   if (moment.uniqueIndex !== undefined) {
  //     flatListRef.current?.scrollToIndex({
  //       index: moment.uniqueIndex,
  //       animated: true,
  //     });
  //   }
  // };

  const scrollToMoment = (moment) => {
    if (moment.uniqueIndex !== undefined) {
      flatListRef.current?.scrollToOffset({
        offset: ITEM_HEIGHT * moment.uniqueIndex,
        animated: false, // disables the "intermediate" rendering problem
      });
    }
  };
  

  const scrollToRandomItem = () => {
    if (capsuleList.length === 0) return;

    const randomIndex = Math.floor(Math.random() * capsuleList.length);
   // flatListRef.current?.scrollToIndex({
      flatListRef.current?.scrollToOffset({
         offset: ITEM_HEIGHT * randomIndex,
     // index: randomIndex,
      animated: false,
    });
  };


  // FOR WRAPPER: 
//   const scrollY = useSharedValue(0);
//   const scrollHandler = useAnimatedScrollHandler({
//     onScroll: (event) => {
//       // console.log(scrollY.value);
//       scrollY.value = event.contentOffset.y;
//     },
//   });// Configuration
// const ITEM_HEIGHT = 290;
// const PIXELS_PER_SECOND = 600; // Fixed speed (600px per second)
// const MIN_DURATION = 500; // Minimum animation time
// const MAX_DURATION = 10000; // Safety cap (optional)

// const currentOffset = useSharedValue(0);
// const targetOffset = useSharedValue(0);
// const shouldScroll = useSharedValue(false);
// const timeoutId = React.useRef<NodeJS.Timeout | null>(null);

// // Animation driver - CONSTANT SPEED
// const animatedOffset = useDerivedValue(() => {
//   const distance = Math.abs(targetOffset.value - currentOffset.value);
  
//   // Pure linear duration calculation
//   const duration = Math.min(
//     MAX_DURATION,
//     Math.max(
//       MIN_DURATION,
//       (distance / PIXELS_PER_SECOND) * 1000 // ms = (px / (px/s)) * 1000
//     )
//   );

//   return withTiming(targetOffset.value, {
//     duration,
//     easing: Easing.linear, // Constant speed
//   });
// });

// // Apply scroll position (unchanged)
// useDerivedValue(() => {
//   if (shouldScroll.value) {
//     scrollTo(flatListRef, 0, animatedOffset.value, false);
//     currentOffset.value = animatedOffset.value;
//   }
// });

// const scrollToRandomItem = () => {
//   if (!capsuleList?.length) return;

//   // Clear any pending timeout
//   if (timeoutId.current) {
//     clearTimeout(timeoutId.current);
//     timeoutId.current = null;
//   }

//   const randomIndex = Math.floor(Math.random() * capsuleList.length);
//   targetOffset.value = randomIndex * ITEM_HEIGHT;
//   shouldScroll.value = true;

//   const distance = Math.abs(targetOffset.value - currentOffset.value);
  
//   // Match the animation duration
//   const duration = Math.min(
//     MAX_DURATION,
//     Math.max(
//       MIN_DURATION,
//       (distance / PIXELS_PER_SECOND) * 1000
//     )
//   );

//   timeoutId.current = setTimeout(() => {
//     shouldScroll.value = false;
//   }, duration);
// };

  // changed to a callback to help list animation performance
  const saveToHello = useCallback((moment) => {
    try {
      updateCapsule(moment.id);
    } catch (error) {
      console.error("Error during pre-save:", error);
    }
  }, []);

  // changed to a callback to help list animation performance
  const handleNavigateToMomentView = useCallback((moment) => {
    navigation.navigate("MomentView", { moment: moment });
  }, []);

  const closeMomentNav = () => {
    setMomentNavVisible(false);
  };

  const scrollToCategoryStart = (category) => {
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

  // const scrollHandler = useAnimatedScrollHandler({
  //   onScroll: (event) => {
  //     scrollY.value = event.contentOffset.y;
  //   },
  // });

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

  // const getFormattedDate = (item) => {
  //   let rawDate = item?.created || '';
  //   const date = new Date(rawDate);

  //   const formattedDate = !isNaN(date.getTime())
  //     ? new Intl.DateTimeFormat("en-US", {
  //         month: "short",
  //         day: "numeric",
  //       }).format(date)
  //     : "lol";

  //   return formattedDate;
  // };
  const visibleItemId = useDerivedValue(() => {
    const topItems = viewableItemsArray.value.slice(0, 1);
    return topItems.length > 0 && topItems[0].isViewable
      ? topItems[0].item.id
      : null;
  });
  const renderMomentItem = useCallback(
    ({ item, index }) => (
      <MomentCardAnimationWrapper
        viewableItemsArray={viewableItemsArray}
        item={item}
        date={item.formattedDate} // ✅ use precomputed date
        index={index}
        momentIdToAnimate={momentIdToAnimate}
        visibleItemId={visibleItemId}
        fadeAnim={fadeAnim}
        handleNavigateToMomentView={handleNavigateToMomentView}
        saveToHello={saveToHello}
      />
    ),
    [
      viewableItemsArray,
      momentIdToAnimate,
      fadeAnim,
      handleNavigateToMomentView,
      saveToHello,
    ]
  );

  // const renderMomentItem = useCallback(

  //   ({ item, index }) => (

  //     <MomentCardAnimationWrapper
  //       viewableItemsArray={viewableItemsArray}
  //       item={item}
  //       date={getFormattedDate(item)}
  //       index={index}
  //       momentIdToAnimate={momentIdToAnimate}
  //       fadeAnim={fadeAnim}
  //       translateY={translateY}
  //       handleNavigateToMomentView={handleNavigateToMomentView}
  //       saveToHello={saveToHello}
  //     />
  //   ),
  //   [
  //     viewableItemsArray,
  //     momentIdToAnimate,
  //     fadeAnim,
  //     translateY,
  //     handleNavigateToMomentView,
  //     saveToHello,
  //   ]
  // );

  const extractItemKey = (item, index) =>
    item?.id ? item.id.toString() : `placeholder-${index}`;

  const getItemLayout = (item, index) => {
    return {
      length: COMBINED_HEIGHT,
      offset: COMBINED_HEIGHT * index,
      index,
    };
  };

  return (
    <View style={appContainerStyles.screenContainer}>
      <LargeCornerLizard />

      <BelowHeaderContainer
        height={30}
        alignItems="center"
        marginBottom={4}
        justifyContent="flex-end"
        children={
          <>
            <DiceRollScroll
              size={belowHeaderIconSize}
              color={themeAheadOfLoading.fontColorSecondary}
              onPress={scrollToRandomItem}
            />
            <MomentsSearchBar
              data={capsuleList}
              height={25}
              width={"47%"}
              borderColor={themeAheadOfLoading.fontColorSecondary}
              placeholderText={"Search"}
              textAndIconColor={themeAheadOfLoading.fontColorSecondary}
              backgroundColor={"transparent"}
              onPress={scrollToMoment}
              searchKeys={["capsule", "typedCategory"]}
              iconSize={belowHeaderIconSize * 0.5}
            />
          </>
        }
      />

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
        <>
          <Animated.FlatList
            //  itemLayoutAnimation={JumpingTransition}
            // itemLayoutAnimation={CurvedTransition}
            // itemLayoutAnimation={EntryExitTransition}
            //  itemLayoutAnimation={SequencedTransition}
            // itemLayoutAnimation={FadingTransition}
            ref={flatListRef}
            data={memoizedMomentData}
           // data={capsuleList}
            // fadingEdgeLength={20}
            // viewabilityConfig={viewabilityConfig}
            //  onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfigCallbackPairs={
              viewabilityConfigCallbackPairs.current
            }
            // scrollEventThrottle={16}
           // onScroll={scrollHandler}
            renderItem={renderMomentItem}
            keyExtractor={extractItemKey}
            getItemLayout={getItemLayout}
            // onScroll={scrollHandler}
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
            // decelerationRate="fast" // Optional: makes the scroll feel snappier
            decelerationRate="normal"
            keyboardDismissMode="on-drag"
          />
        </>
      </View>

      {!isKeyboardVisible && (
        <>
          <CategoryNavigator
            viewableItemsArray={viewableItemsArray}
            categoryNames={categoryNames}
            onPress={scrollToCategoryStart}
          />

          <ButtonGoToAddMoment />
        </>
      )}

      {isMomentNavVisible && selectedMomentToView && (
        <MomentsNavigator
          onClose={closeMomentNav}
          moment={selectedMomentToView}
        />
      )}
    </View>
  );
};

export default MomentsList;
