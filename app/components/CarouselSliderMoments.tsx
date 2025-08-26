import { View } from "react-native";
import React, { useState, useCallback } from "react";
import { useWindowDimensions } from "react-native";
import Animated, {
  useAnimatedRef, 
  useAnimatedScrollHandler,
  useSharedValue, 
  withTiming,
} from "react-native-reanimated";
import ItemFooterMoments from "./headers/ItemFooterMoments";
import CarouselItemModal from "./appwide/carouselItemModal";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
type Props = {
  initialIndex: number;
  data: object[];
  categoryColorsMap: object;
  useButtons: boolean;
};

const CarouselSliderMoments = ({
  userId,
  friendId,
  initialIndex,
  data,
  categoryColorsMap,
  useButtons = true,
  children: Children,
  onRightPress,
  onRightPressSecondAction,
  // footerData,

}: Props) => {
  const { height, width } = useWindowDimensions();
  const { themeStyles, appFontStyles } = useGlobalStyle();

  const ITEM_WIDTH = width - 40;
  const ITEM_MARGIN = 20;
  const COMBINED = ITEM_WIDTH + ITEM_MARGIN * 2;
  const flatListRef = useAnimatedRef(null);

  const [itemModalVisible, setItemModalVisible] = useState(false);

  //  console.log(`category colors in slider`, categoryColorsMap);

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

  // const scrollToStart = () => {
  //   flatListRef.current?.scrollToIndex({
  //     index: 0,
  //     animated: true,
  //   });
  // };

  // const scrollToEnd = () => {
  //   flatListRef.current?.scrollToEnd({ animated: true });
  // };

  const [modalData, setModalData] = useState({ title: "", data: {} });

  const handleSetModalData = (data) => {
    setModalData(data);
    setItemModalVisible(true);
  };

  // const handleScroll = useCallback(
  //   (event) => {
  //     const offsetX = event.nativeEvent.contentOffset.x;
  //     const currentIndex = Math.round(offsetX / COMBINED);
  //     onIndexChange?.(currentIndex);
  //     setCurrentIndex(currentIndex + 1);
  //     setCurrentCategory(
  //       data[currentIndex]?.typedCategory ||
  //         data[currentIndex]?.category ||
  //         data[currentIndex]?.date
  //     );
  //   },
  //   [COMBINED, onIndexChange]
  // );

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
        textColor={themeStyles.primaryText.color}
        darkerOverlayColor={
          themeStyles.darkerOverlayBackgroundColor.backgroundColor
        }
        lighterOverlayColor={
          themeStyles.lighterOverlayBackgroundColor.backgroundColor
        }
        welcomeTextStyle={appFontStyles.welcomeText}
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
        openModal={handleSetModalData}
        closeModal={() => setItemModalVisible(false)}
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

      {itemModalVisible && (
        <View>
          <CarouselItemModal
            // item={data[currentIndex]} not syncing right item, removed it from modal; data solely from the user-facing component
            icon={modalData?.icon}
            title={modalData?.title}
            display={modalData?.contentData}
            isVisible={itemModalVisible}
            closeModal={() => setItemModalVisible(false)}
            onPress={modalData?.onPress}
          />
        </View>
      )}
    </>
  );
};

export default CarouselSliderMoments;
