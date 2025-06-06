import { View, Text, Dimensions } from "react-native";
import React, {   useCallback } from "react";
import { useWindowDimensions } from "react-native";

import Animated, { useAnimatedRef } from "react-native-reanimated";

const CarouselSlider = ({ initialIndex, data, children: Children }) => {
  const { height, width } = useWindowDimensions();
//const { width } = Dimensions.get('screen');
  const ITEM_HEIGHT = "100%";
  const ITEM_WIDTH = width - 40;
  const ITEM_MARGIN = 20;

  const COMBINED = ITEM_WIDTH + ITEM_MARGIN * 2;

  const flatListRef = useAnimatedRef(null);

  const extractItemKey = (item, index) =>
    item?.id ? item.id.toString() : `hello-${index}`;

  const getItemLayout = (item, index) => {
    return {
      length: COMBINED,
      offset: COMBINED * index,
      index,
    };
  };

  const renderHelloPage = useCallback(
    ({ item, index }) => (
      // <View style={{marginHorizontal: ITEM_MARGIN}}>
      <Children item={item} index={index} width={width} height={height}/>

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
    [width]
  );

  return (
    <>
      <Animated.FlatList
        data={data}
        ref={flatListRef}
        horizontal={true}
        renderItem={renderHelloPage}
        initialScrollIndex={initialIndex}
        //           viewabilityConfigCallbackPairs={
        //   viewabilityConfigCallbackPairs.current
        // }
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        // onScroll={scrollHandler}
        keyExtractor={extractItemKey}
        getItemLayout={getItemLayout}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
        showsVerticalScrollIndicator={false}
        snapToAlignment={"start"}
        //snapToInterval={width}
        pagingEnabled
        //   snapToOffsets={true}
        ListFooterComponent={() => (
          <View style={{ width: 100 }} />
        )}
      />
    </>
  );
};

export default CarouselSlider;
