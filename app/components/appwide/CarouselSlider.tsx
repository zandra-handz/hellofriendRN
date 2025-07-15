import { View  } from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import { useWindowDimensions } from "react-native"; 
import Animated, {
  useAnimatedRef,
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated"; 
import ItemFooter from "../headers/ItemFooter"; 
import { useFriendLocationsContext } from "@/src/context/FriendLocationsContext";
import CarouselItemModal from "./carouselItemModal"; 


type Props = {
  initialIndex: number;
  data: object[];
  useButtons: boolean;

};

const CarouselSlider = ({
  initialIndex, 
  data,
  useButtons=true,
  children: Children,
  onRightPress,
  onRightPressSecondAction, 
 
  footerData,
}: Props) => {
  const { height, width } = useWindowDimensions(); 
  const { stickToLocation, setStickToLocation } = useFriendLocationsContext();

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
      // console.log("scrolling to index for location id", stickToLocation);
      const newIndex = data.findIndex((item) => item.id === stickToLocation);
      // console.log("scrolling to index", newIndex);
      scrollToIndexAfterEdit(newIndex);
      //scrollToEditCompleted();
    }
  }, [stickToLocation]);

  const scrollToIndexAfterEdit = (index) => {
    flatListRef.current?.scrollToIndex({
      index: index,
      animated: false,
    });
    setStickToLocation(null);
  };

  const scrollToStart = () => {
    flatListRef.current?.scrollToIndex({
      index: 0,
      animated: true,
    });
  };

  const scrollToEnd = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

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

      //   <View
      //     style={{
      //         gap: 20,
      //         justifyContent: 'center',
      //         alignItems: 'center',
      //       backgroundColor: "transparent",
      //       padding: 4,
      //       borderWidth: 0,
      //     //   height: ITEM_HEIGHT,
      //       width: COMBINED,
      //     }}
      //   >
      //     <View style={{ backgroundColor: "pink", padding: 10, borderRadius: 10, width: '100%', height: '100%' }}>
      //          <Text>{item.id}</Text>
      //             <Text>{item.locationName}</Text>
      //             <Text>{item.date}</Text>
      //             <Text>{item.additionalNotes}</Text>
      //     </View>

      //   </View>

      // </View>
    ),
    [width, height, currentIndex]
  );

  return (
    <>
      <>
        {/* <View
        style={{ 
          //position: "absolute",
          zIndex: 1000,

          height: 40,
          width: "100%",
          flexDirection: "row",
          justifyContent: "center",
          backgroundColor: themeStyles.overlayBackgroundColor.backgroundColor,
          alignItems: "center",
          paddingHorizontal: 10,
        }}
      >


        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            position: "absolute",
            left: 10,
            width: "29%",
          }}
        >
          <TouchableOpacity onPress={scrollToStart}>
            <MaterialCommunityIcons
              name="step-backward"
              size={20}
              color={themeStyles.primaryText.color}
            />
            {/* <Text
              style={[
                themeStyles.primaryText,
                { fontSize: 14, fontWeight: "bold" },
              ]}
            >
              Start
            </Text> */}
        {/* </TouchableOpacity>
          <TouchableOpacity onPress={scrollToEnd}>
                        <MaterialCommunityIcons
              name="step-forward"
              size={20}
              color={themeStyles.primaryText.color}
            />
            {/* <Text
              style={[
                themeStyles.primaryText,
                { fontSize: 14, fontWeight: "bold" },
              ]}
            >
              End
            </Text> */}
        {/* </TouchableOpacity>   */}
        {/* </View> */}
        {/* <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            flexGrow: 1,
            width: "100%",
          }}
        > */}
        {/* <Text
          numberOfLines={1}
          style={[
            themeStyles.primaryText,
            { fontSize: 14, fontWeight: "bold" },
          ]}
        >
          {" "}
          {currentCategory?.length > 20
            ? currentCategory.slice(0, 20) + "…"
            : currentCategory}
        </Text>
        {/* </View> */}
        {/* <Text
          style={[
            themeStyles.primaryText,
            {
              position: "absolute",
              right: 10,
              fontSize: 14,
              fontWeight: "bold",
            },
          ]}
        >
          {currentIndex} / {data.length}
        </Text>
      </View>    */}

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
          extraData={footerData}
          useButtons={useButtons}
          onRightPress={() => onRightPress(currentIndex.value)}
             onRightPressSecondAction={() => onRightPressSecondAction(data[currentIndex.value])}
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

export default CarouselSlider;
