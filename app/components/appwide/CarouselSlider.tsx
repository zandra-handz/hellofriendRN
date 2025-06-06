import { View, Text, Dimensions, TouchableOpacity } from "react-native";
import React, { useState, useCallback } from "react";
import { useWindowDimensions } from "react-native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import Animated, { useAnimatedRef } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const CarouselSlider = ({
  initialIndex,
  data,
  children: Children,
  onIndexChange,
}) => {
  const { height, width } = useWindowDimensions();
  const { themeStyles } = useGlobalStyle();
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

  const scrollToStart = () => {
    flatListRef.current?.scrollToIndex({
      index: 0,
      animated: true,
    });
  };

  const scrollToEnd = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const [currentIndex, setCurrentIndex] = useState(initialIndex + 1);
  const [currentCategory, setCurrentCategory] = useState(
    data[initialIndex]?.typedCategory || data[initialIndex]?.image_category
  );

  const handleScroll = useCallback(
    (event) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const currentIndex = Math.round(offsetX / COMBINED);
      onIndexChange?.(currentIndex);
      setCurrentIndex(currentIndex + 1);
      setCurrentCategory(
        data[currentIndex]?.typedCategory ||
          data[currentIndex]?.category ||
          data[currentIndex]?.date
      );
    },
    [COMBINED, onIndexChange]
  );

  const renderHelloPage = useCallback(
    ({ item, index }) => (
      // <View style={{marginHorizontal: ITEM_MARGIN}}>
      <>
        <Children item={item} index={index} width={width} height={height} />
      </>

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
      <View
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
          </TouchableOpacity>
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
          </TouchableOpacity>
        </View>
        {/* <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            flexGrow: 1,
            width: "100%",
          }}
        > */}
        <Text
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
        <Text
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
      </View>
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
        onScroll={handleScroll}
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
        ListFooterComponent={() => <View style={{ width: 100 }} />}
      />
    </>
  );
};

export default CarouselSlider;
