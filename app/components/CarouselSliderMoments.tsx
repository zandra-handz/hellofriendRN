import { View } from "react-native";
import React, {   useCallback } from "react";
import { useWindowDimensions } from "react-native";
import Animated, {
  useAnimatedRef, 
  useAnimatedScrollHandler,
  useSharedValue, 
  withTiming,
} from "react-native-reanimated";
import ItemFooterMoments from "./headers/ItemFooterMoments"; 
type Props = {
  initialIndex: number;
  data: object[];
  categoryColorsMap: object;
  useButtons: boolean;
};

const CarouselSliderMoments = ({
  userId,
  friendId,
  fontStyle,
  initialIndex,
  lightDarkTheme, 
  data,
  categoryColorsMap,
  useButtons = true,
  children: Children,
  onRightPress,
  onRightPressSecondAction,
  // footerData,

}: Props) => {
  const { height, width } = useWindowDimensions();
 

  const ITEM_WIDTH = width - 40;
  const ITEM_MARGIN = 20;
  const COMBINED = ITEM_WIDTH + ITEM_MARGIN * 2;
  const flatListRef = useAnimatedRef(null); 
 

  const scrollX = useSharedValue(0);
  const scrollY = useSharedValue(0);
  const currentIndex = useSharedValue(0);
  const floaterItemsVisibility = useSharedValue(1);
  const cardScale = useSharedValue(1);

  const extractItemKey = (item, index) =>
    item?.id ? item.id.toString() : `item-${index}`;

  const getItemLayout = (item, index) => {
    return {
      length: COMBINED,
      offset: COMBINED * index,
      index,
    };
  };

  const scrollTo = (index: number) => {
    floaterItemsVisibility.value = withTiming(0, { duration: 10 });
    cardScale.value = withTiming(0.94, { duration: 10 });

 
    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
    });

 
    setTimeout(() => {
      floaterItemsVisibility.value = withTiming(1, { duration: 400 });
      cardScale.value = withTiming(1, { duration: 400 });
    }, 300); 
  };

 
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const y = event.contentOffset.y;
      const x = event.contentOffset.x;

      scrollY.value = y;
      scrollX.value = x;

      // if (y < 10) {
      //   floaterItemsVisibility.value = withTiming(1);
      // } else {
      //   floaterItemsVisibility.value = withTiming(1, { duration: 1000 });
      // }
      //floaterItemsVisibility.value = withTiming(0, { duration: 1000 });
      // Update sharedValue for horizontal index
      currentIndex.value = Math.round(x / COMBINED);
    },

    onBeginDrag: (event) => {
      floaterItemsVisibility.value = withTiming(0, { duration: 10 });
      cardScale.value = withTiming(0.94, { duration: 10 });
    },
    onEndDrag: (event) => {
      if (event.contentOffset.y <= 0) {
        // Optional
      }
      floaterItemsVisibility.value = withTiming(1, { duration: 400 });
      cardScale.value = withTiming(1, { duration: 400 });
    },
  });

  const renderPage = useCallback(
    ({ item, index }) => (
      // <View style={{marginHorizontal: ITEM_MARGIN}}>

      <Children
        textColor={lightDarkTheme.primaryText}
        darkerOverlayColor={
          lightDarkTheme.darkerOverlayBackground 
        }
        lighterOverlayColor={
          lightDarkTheme.lighterOverlayBackground 
        }
        welcomeTextStyle={fontStyle}
        userId={userId}
        friendId={friendId}
        categoryColorsMap={categoryColorsMap}
        item={item}
        listLength={data?.length || 0}
        index={index}
        width={width}
        height={height}
        marginBottom={2} //space between this card and the footer bar (there's already some slight padding around the whole card)
        currentIndexValue={currentIndex}
        cardScaleValue={cardScale}
    
        marginKeepAboveFooter={10} //ONLY MOMENT VIEW PAGE HAS THIS PROP RN, this is just to push positioning up a level for readability
      />
    ),
    [width, height, currentIndex, categoryColorsMap]
  );

  return (
    <>
      <>
        <Animated.FlatList
          data={data}
          ref={flatListRef}
          horizontal={true}
          renderItem={renderPage}
          initialScrollIndex={initialIndex}
          nestedScrollEnabled
          //           viewabilityConfigCallbackPairs={
          //   viewabilityConfigCallbackPairs.current
          // }
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          onScroll={scrollHandler}
          //  onScroll={handleScroll}
          keyExtractor={extractItemKey}
          getItemLayout={getItemLayout}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={5}
          removeClippedSubviews={true}
          showsVerticalScrollIndicator={false}
          snapToAlignment={"start"}
          //snapToInterval={width}
          pagingEnabled
          //   snapToOffsets={true}
          ListFooterComponent={() => <View style={{ width: 100 }} />}
        />
        {/* {type === 'location' && ( */}

        <ItemFooterMoments //this component is now NOT absolutely positioned, so that it can get calculated with the card above and they won't overlap on different screens
          data={data}
          scrollTo={scrollTo}
          primaryColor={lightDarkTheme.primaryText}
          primaryBackground={lightDarkTheme.primaryBackground}
          fontStyle={fontStyle}
          height={50} // matches escort read only bar inside
          marginBottom={10} // eyeballed to match finalize styling honestly
          visibilityValue={floaterItemsVisibility}
          currentIndexValue={currentIndex}
          categoryColorsMap={categoryColorsMap}
      
          useButtons={useButtons}
          onRightPress={() => onRightPress(currentIndex.value)}
          onRightPressSecondAction={() =>
            onRightPressSecondAction(data[currentIndex.value])
          }
        />

        {/* )} */}
      </>

 
    </>
  );
};

export default CarouselSliderMoments;
