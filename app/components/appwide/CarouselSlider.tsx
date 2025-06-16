import { View, Text, Dimensions, TouchableOpacity } from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import { useWindowDimensions } from "react-native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import Animated, { useAnimatedRef } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ItemFooter from "../headers/ItemFooter";
import { useLocations } from "@/src/context/LocationsContext";
import { useFriendLocationsContext } from "@/src/context/FriendLocationsContext";

const CarouselSlider = ({
  initialIndex,
  scrollToEdit,
  scrollToEditCompleted,
  data,
  children: Children,
  onIndexChange,
  type,
  footerData,
}) => {
  const { height, width } = useWindowDimensions();
  const { themeStyles } = useGlobalStyle();
  const { stickToLocation, setStickToLocation } = useFriendLocationsContext();
  //const { width } = Dimensions.get('screen');
  const ITEM_HEIGHT = "100%";
  const ITEM_WIDTH = width - 40;
  const ITEM_MARGIN = 20;
console.log('CAROUSEL RERENDERED');
console.log(stickToLocation);
  const COMBINED = ITEM_WIDTH + ITEM_MARGIN * 2; 
  const flatListRef = useAnimatedRef(null);


    const [currentIndex, setCurrentIndex] = useState(initialIndex + 1);
  const [currentCategory, setCurrentCategory] = useState(
    data[initialIndex + 1]?.typedCategory || data[initialIndex + 1]?.image_category
  );

  const extractItemKey = (item, index) =>
    item?.id ? item.id.toString() : `hello-${index}`;

  const getItemLayout = (item, index) => {
    return {
      length: COMBINED,
      offset: COMBINED * index,
      index,
    };
  };

useEffect(() => {
  if (stickToLocation) {
    console.log('scrolling to index for location id', stickToLocation);
    const newIndex = data.findIndex((item) => item.id === stickToLocation);
    console.log('scrolling to index', newIndex);
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
      <View style={{flex: 1, height: '89%'}}>
        <Children item={item} index={index} width={width} height={height} currentIndex={currentIndex} />
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
        nestedScrollEnabled
        //           viewabilityConfigCallbackPairs={
        //   viewabilityConfigCallbackPairs.current
        // }
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        // onScroll={scrollHandler}
        onScroll={handleScroll}
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
      {type === 'location' && (
        
      <ItemFooter location={data[currentIndex - 1]} extraData={footerData}/>
      
      )}
    </>
  );
};

export default CarouselSlider;
