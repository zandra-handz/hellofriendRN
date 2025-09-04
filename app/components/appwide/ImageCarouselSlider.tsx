import { View } from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import { useWindowDimensions } from "react-native";
import { manualGradientColors } from "@/src/hooks/StaticColors";
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import ItemFooter from "../headers/ItemFooter";

import CarouselItemModal from "./carouselItemModal";

type Props = {
  initialIndex: number;
  data: object[];
  // useButtons: boolean;
};

const ImageCarouselSlider = ({
 
  initialIndex,
  data,
  // useButtons = true,
  children: Children,
  onRightPress,
  onRightPressSecondAction,
  stickToLocation,
  setStickToLocation,

  // footerData,
  primaryColor,
  overlayColor,
  dividerStyle,
  welcomeTextStyle,
  themeAheadOfLoading,
}: Props) => {
  const { height, width } = useWindowDimensions();

  const ITEM_WIDTH = width - 40;
  const ITEM_MARGIN = 20;
  const COMBINED = ITEM_WIDTH + ITEM_MARGIN * 2;
  const flatListRef = useAnimatedRef(null);

  const [itemModalVisible, setItemModalVisible] = useState(false);

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

  useEffect(() => {
    if (stickToLocation) {
      console.log("scrolling to index for location id", stickToLocation);

      const newIndex = data.findIndex((item) => item.id === stickToLocation);
      console.log("scrolling to index", newIndex);

      if (newIndex >= 0 && newIndex < data.length) {
        scrollToIndexAfterEdit(newIndex);
      }
      //scrollToEditCompleted();
    }
  }, [stickToLocation]);

  const scrollToIndexAfterEdit = (index) => {
    if (!setStickToLocation) {
      return;
    }
    flatListRef.current?.scrollToIndex({
      index: index,
      animated: false,
    });
    setStickToLocation(null);
  };

  const [modalData, setModalData] = useState({ title: "", data: {} });

  const handleSetModalData = (data) => {
    setModalData(data);
    setItemModalVisible(true);
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const y = event.contentOffset.y;
      const x = event.contentOffset.x;

      scrollY.value = y;
      scrollX.value = x;
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

      <View style={{ flex: 1, height: "100%" }}>
        <Children
          item={item}
          listLength={data?.length || 0}
          index={index}
          width={width}
          height={height}
          currentIndexValue={currentIndex}
          cardScaleValue={cardScale}
          openModal={handleSetModalData}
          closeModal={() => setItemModalVisible(false)}
        />
      </View>
    ),
    [width, height, currentIndex]
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

        <ItemFooter 
          data={data}
          visibilityValue={floaterItemsVisibility}
          currentIndexValue={currentIndex}
          // extraData={footerData}
          // useButtons={useButtons}
          onRightPress={() => onRightPress(currentIndex.value)}
          onRightPressSecondAction={() =>
            onRightPressSecondAction(data[currentIndex.value])
          }
          primaryColor={primaryColor}
          overlayColor={overlayColor}
          dividerStyle={dividerStyle}
          welcomeTextStyle={welcomeTextStyle} 
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
            manualGradientColors={manualGradientColors}
          />
        </View>
      )}
    </>
  );
};

export default ImageCarouselSlider;
