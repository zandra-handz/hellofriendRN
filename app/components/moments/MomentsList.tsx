import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { View, Keyboard, ViewToken, TouchableOpacity } from "react-native";

import { useFriendList } from "@/src/context/FriendListContext";
import { useFocusEffect } from "@react-navigation/native";
import ButtonGoToAddMoment from "../buttons/moments/ButtonGoToAddMoment";
import LizardSvg from "@/app/assets/svgs/lizard.svg";
import MomentsNavigator from "./MomentsNavigator";
import CategoryNavigator from "./CategoryNavigator";
import MomentsSearchBar from "./MomentsSearchBar";
import DiceRollScroll from "./DiceRollScroll";
import MomentCardAnimationWrapper from "./MomentCardAnimationWrapper";
import MomentItem from "./MomentItem";
import LargeCornerLizard from "./LargeCornerLizard";
import ButtonIconImages from "../buttons/images/ButtonIconImages";
import ButtonIconMoments from "../buttons/moments/ButtonIconMoments";
import MomentsStaticButton from "../buttons/moments/MomentsStaticButton";
import { AnimatedFlashList, FlashList } from "@shopify/flash-list";
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
  withSpring,
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

//const ITEM_HEIGHT = 290;
const ITEM_HEIGHT = 80;
const ITEM_BOTTOM_MARGIN = 4;
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

  const momentListBottomSpacer = 600;

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

  const categoryNavVisibility = useSharedValue(1);
  const listVisibility = useSharedValue(0);

  //   const scrollHandler = useAnimatedScrollHandler({
  //   onScroll: (event) => {
  //     const y = event.contentOffset.y;
  //   },
  // });

  useFocusEffect(
    useCallback(() => {
      listVisibility.value = withSpring(1, { duration: 800 });

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
      <TouchableOpacity
        onPress={() => navigation.navigate("MomentView", { moment: item })}
        style={{
          flex: 1,
          height: ITEM_HEIGHT,
          marginBottom: ITEM_BOTTOM_MARGIN,
          paddingHorizontal: 2,
        }}
      >
        <MomentItem
          momentData={item}
          combinedHeight={COMBINED_HEIGHT}
          index={index} //ADD to component if want to alternative moment item layout
          momentDate={item.formattedDate}
          itemHeight={ITEM_HEIGHT}
          visibilityValue={listVisibility}
          scrollYValue={scrollY}
          onSend={saveToHello}
        />
      </TouchableOpacity>
      // <MomentCardAnimationWrapper
      //   viewableItemsArray={viewableItemsArray}
      //   item={item}
      //   date={item.formattedDate} // ✅ use precomputed date
      //   index={index}
      //   momentIdToAnimate={momentIdToAnimate}
      //   visibleItemId={visibleItemId}
      //   fadeAnim={fadeAnim}
      //   handleNavigateToMomentView={handleNavigateToMomentView}
      //   saveToHello={saveToHello}
      // />
    ),
    [
      // viewableItemsArray,
      // momentIdToAnimate,
      // fadeAnim,
      handleNavigateToMomentView,
      // saveToHello,
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
            {/* <DiceRollScroll
              size={belowHeaderIconSize}
              color={themeAheadOfLoading.fontColorSecondary}
              onPress={scrollToRandomItem}
            /> */}
            <View
              style={{
                flexDirection: "row",
                height: "100%",
                alignItems: "center",
                width: "50%",
                justifyContent: "flex-end",
              //  overflow: "hidden",
                marginRight: 10, 
                height: 30,
              }}
            > 
            <View style={{width: 30, marginHorizontal: 4}}>
              
                <MomentsStaticButton
                  height={"100%"}
                  iconSize={24}
                  onPress={() => navigation.navigate("Moments")}
                  circleColor={"orange"}
                  countTextSize={8}
                  countColor={
                    themeAheadOfLoading
                      ? themeAheadOfLoading.fontColorSecondary
                      : "orange"
                  }
                />  
                
            </View>
               <View style={{width: 30, marginHorizontal: 4}}>
              
                <ButtonIconImages
                  height={"40%"} //ADJUST POSITION HERE
                  iconSize={24}
                  onPress={() => navigation.navigate("Images")}
                  circleColor={"orange"}
                  countTextSize={8}
                  countColor={
                    themeAheadOfLoading
                      ? themeAheadOfLoading.fontColorSecondary
                      : "orange"
                  }
                /> 
                
             </View>
            </View>

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
            // decelerationRate="fast" // Optional: makes the scroll feel snappier
            decelerationRate="normal"
            keyboardDismissMode="on-drag"
          />
        </>
      </View>

      {!isKeyboardVisible && (
        <>
          <CategoryNavigator
            visibilityValue={listVisibility}
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
