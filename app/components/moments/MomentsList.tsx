import React, { useRef, useState, useEffect  } from "react";
import {
  View, 
  Text, 
  Keyboard,
  ViewToken,
} from "react-native";

import { useFriendList } from "@/src/context/FriendListContext";

import ButtonGoToAddMoment from "../buttons/moments/ButtonGoToAddMoment";
import LizardSvg from "@/app/assets/svgs/lizard.svg"; 
import MomentsNavigator from "./MomentsNavigator";
import CategoryNavigator from "./CategoryNavigator";
import MomentsSearchBar from "./MomentsSearchBar";
import DiceRandom3dSolidSvg from "@/app/assets/svgs/dice-random-3d-solid.svg";

import MomentCardAnimationWrapper from "./MomentCardAnimationWrapper";
 
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler, 
  withTiming,
  runOnJS,
} from "react-native-reanimated";

import { useNavigation } from "@react-navigation/native";

import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useCapsuleList } from "@/src/context/CapsuleListContext";

import BodyStyling from "../scaffolding/BodyStyling";
import BelowHeaderContainer from "../scaffolding/BelowHeaderContainer";

const ITEM_HEIGHT = 290;
const ITEM_BOTTOM_MARGIN = 0; 

const MomentsList = () => {
  const { themeStyles, appContainerStyles } = useGlobalStyle();
  const { themeAheadOfLoading } = useFriendList();
  const {
    capsuleList,
    setMomentIdToAnimate,
    momentIdToAnimate,
    updateCacheWithNewPreAdded,
    categoryNames,
    categoryStartIndices,
    updateCapsule,
  } = useCapsuleList();

  const navigation = useNavigation();

  const [currentVisibleIndex, setCurrentVisibleIndex] = useState(null);
  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };
 

  const [selectedMomentToView, setSelectedMomentToView] = useState(null);
  const [isMomentNavVisible, setMomentNavVisible] = useState(false);
  const flatListRef = useRef(null);
 

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const momentListBottomSpacer = 700;

  const translateX = useSharedValue(0);
  const heightAnim = useSharedValue(ITEM_HEIGHT + ITEM_BOTTOM_MARGIN);

  const belowHeaderIconSize = 28;

  const scrollY = useSharedValue(0);
  const fadeAnim = useSharedValue(1);
  const translateY = useSharedValue(0);

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
    console.log('use effect in momentslist triggered!');
  
    translateX.value = withTiming(500, { duration: 0 }, () => { 
      heightAnim.value = withTiming(0, { duration: 200 }, () => { 
        runOnJS(updateCacheWithNewPreAdded)();
        runOnJS(setMomentIdToAnimate)(null);
 
        fadeAnim.value = 1;
        heightAnim.value = withTiming(ITEM_HEIGHT + ITEM_BOTTOM_MARGIN, { duration: 0 });
        translateX.value = withTiming(0, { duration: 0 });
      });
    });
  }
}, [momentIdToAnimate]);

  const scrollToMoment = (moment) => {
    if (moment.uniqueIndex !== undefined) {
      flatListRef.current?.scrollToIndex({
        index: moment.uniqueIndex,
        animated: true,
      });
    }
  };

  const scrollToRandomItem = () => {
    if (capsuleList.length === 0) return;

    const randomIndex = Math.floor(Math.random() * capsuleList.length);
    flatListRef.current?.scrollToIndex({
      index: randomIndex,
      animated: true,
    });
  };

  const saveToHello = async (moment) => {
    try {
      updateCapsule(moment.id);
    } catch (error) {
      console.error("Error during pre-save:", error);
    }
  };

  const handleNavigateToMomentView = (moment) => {
    navigation.navigate("MomentView", { moment: moment });
  };

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

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });
 
  const viewableItemsArray = useSharedValue<ViewToken[]>([]);

  return (
    <View style={appContainerStyles.screenContainer}>
      <LizardSvg
        height={300}
        width={300}
        color={themeStyles.genericTextBackground.backgroundColor}
        style={appContainerStyles.bigLizardRotate}
      />

      <BelowHeaderContainer
        height={30}
        alignItems="center"
        marginBottom={4}
        justifyContent="flex-end"
        children={
          <>
            <View style={{ flexDirection: "row", marginHorizontal: 10 }}>
              <View style={{ height: 30, justifyContent: "center" }}>
                <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                  pick random{" "}
                </Text>
              </View>
              <DiceRandom3dSolidSvg
                height={belowHeaderIconSize}
                width={belowHeaderIconSize}
                color={themeAheadOfLoading.fontColorSecondary}
                onPress={scrollToRandomItem}
              />
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
              iconSize={belowHeaderIconSize * 0.7}
            />
          </>
        }
      />

      <BodyStyling
        height={"87%"}
        width={"100%"}
        minHeight={"87%"}
        paddingTop={0}
        transparentBackground={true}
        transparentBorder={true}
        paddingHorizontal={0}
        children={
          <>
            <Animated.FlatList
              ref={flatListRef}
              data={capsuleList}
              fadingEdgeLength={20}
              onViewableItemsChanged={({ viewableItems: vItems }) => {
                // console.log(vItems[0]);
                viewableItemsArray.value = vItems;
              }}
              renderItem={({ item, index }) => (
                <MomentCardAnimationWrapper
                  viewableItemsArray={viewableItemsArray}
                  item={item}
                  index={index} 
                  momentIdToAnimate={momentIdToAnimate}
                  fadeAnim={fadeAnim}
                  translateY={translateY}
                  handleNavigateToMomentView={handleNavigateToMomentView}
                  saveToHello={saveToHello}  
                />
              )}
              keyExtractor={(item, index) =>
                item?.id ? item?.id.toString() : `placeholder-${index}`
              }
              getItemLayout={(data, index) => ({
                length: ITEM_HEIGHT + ITEM_BOTTOM_MARGIN,
                offset: (ITEM_HEIGHT + ITEM_BOTTOM_MARGIN) * index,
                index,
              })}
              onScroll={scrollHandler} 
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={10}
              removeClippedSubviews={false}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={() => (
                <View style={{ height: momentListBottomSpacer }} />
              )}
              onScrollToIndexFailed={(info) => { //scroll to beginning maybe instead? not sure what this is doing
                flatListRef.current?.scrollToOffset({
                  offset: info.averageItemLength * info.index,
                  animated: true,
                });
              }}
              snapToInterval={ITEM_HEIGHT + ITEM_BOTTOM_MARGIN} // Set the snapping interval to the height of each item
              snapToAlignment="start" // Align items to the top of the list when snapped
              decelerationRate="fast" // Optional: makes the scroll feel snappier
              keyboardDismissMode="on-drag"
              viewabilityConfig={viewabilityConfig}
            />
          </>
        }
      />

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
