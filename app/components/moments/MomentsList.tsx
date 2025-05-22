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
  useDerivedValue,
  useAnimatedScrollHandler,
  withTiming,
  runOnJS,
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
    minimumViewTime: 100,
    itemVisiblePercentThreshold: 50,
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
  const flatListRef = useRef(null);

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
          heightAnim.value = withTiming(ITEM_HEIGHT + ITEM_BOTTOM_MARGIN, {
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

  // may not need to be in a callback since not inside an animated view
  // const scrollToRandomItem = useCallback(() => {
  //   if (capsuleList.length === 0) return;

  //   const randomIndex = Math.floor(Math.random() * capsuleList.length);
  //   flatListRef.current?.scrollToIndex({
  //     index: randomIndex,
  //     animated: true,
  //   });
  // }, [capsuleList]);

  //   const scrollToRandomItem = useCallback(() => {
  //   if (capsuleList.length === 0) return;

  //   const randomIndex = Math.floor(Math.random() * capsuleList.length);
  //   const threshold = 10;
  //   const jumpIndex = Math.max(0, randomIndex - threshold);

  //   // Jump close to the item (no animation to skip intermediate renders)
  //   flatListRef.current?.scrollToOffset({

  //     offset: ITEM_HEIGHT * jumpIndex,
  //     animated: false,
  //   });

  //   // Then smooth scroll the rest of the way
  //   setTimeout(() => {
  //     flatListRef.current?.scrollToIndex({
  //       index: randomIndex,
  //       animated: true,
  //     });
  //   }, 50);
  // }, [capsuleList]);

  const scrollToRandomItem = () => {
    if (capsuleList.length === 0) return;

    const randomIndex = Math.floor(Math.random() * capsuleList.length);
    flatListRef.current?.scrollToIndex({
      index: randomIndex,
      animated: false,
    });
  };

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
        index: categoryIndex > 0 ? categoryIndex : 0,
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
        {/* <BodyStyling
        height={"87%"}
        width={"100%"}
        minHeight={"87%"}
        paddingTop={'0%'}
        transparentBackground={true}
        transparentBorder={true}
        paddingHorizontal={'0%'}
        children={ */}
        <>
          <Animated.FlatList
            // itemLayoutAnimation={JumpingTransition} 
           itemLayoutAnimation={CurvedTransition}
            // itemLayoutAnimation={EntryExitTransition}
           //  itemLayoutAnimation={SequencedTransition}
            // itemLayoutAnimation={FadingTransition}
            ref={flatListRef}
            data={memoizedMomentData}
            // data={capsuleList}
            fadingEdgeLength={20}
            // viewabilityConfig={viewabilityConfig}
            //  onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfigCallbackPairs={
              viewabilityConfigCallbackPairs.current
            }
            renderItem={renderMomentItem}
            keyExtractor={extractItemKey}
            getItemLayout={(data, index) => ({
              length: ITEM_HEIGHT + ITEM_BOTTOM_MARGIN,
              offset: (ITEM_HEIGHT + ITEM_BOTTOM_MARGIN) * index,
              index,
            })}
            // onScroll={scrollHandler}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={10}
            removeClippedSubviews={true}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={() => (
              <View style={{ height: momentListBottomSpacer }} />
            )}
            onScrollToIndexFailed={(info) => {
              //scroll to beginning maybe instead? not sure what this is doing
              flatListRef.current?.scrollToOffset({
                offset: info.averageItemLength * info.index,
                animated: true,
              });
            }}
            snapToInterval={ITEM_HEIGHT + ITEM_BOTTOM_MARGIN}
            snapToAlignment="start"
            decelerationRate="fast" // Optional: makes the scroll feel snappier
            keyboardDismissMode="on-drag"
          />
        </>

        {/* }
      /> */}
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
