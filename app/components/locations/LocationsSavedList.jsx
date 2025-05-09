import React, { useEffect, useRef } from "react";
import { View, Dimensions, StyleSheet,   Animated } from "react-native";
 
import { useGlobalStyle } from "@/src/context/GlobalStyleContext"; 
import ShopOutlineSvg from "@/app/assets/svgs/shop-outline.svg";
import LocationCard from "./LocationCard";
import { LinearTransition } from "react-native-reanimated";
 
const LocationsSavedList = ({
  locationList,
  addToFavoritesFunction,
  removeFromFavoritesFunction,
  scrollTo,
}) => {
  const { themeStyles } = useGlobalStyle(); 

  const flatListRef = useRef(null);

  const ITEM_HEIGHT = 170;
  const ITEM_BOTTOM_MARGIN = 6;
  const COMBINED = ITEM_HEIGHT + ITEM_BOTTOM_MARGIN;

  const momentListBottomSpacer = Dimensions.get("screen").height - 200;

  const scrollToLocationId = (locationId) => {
    const index = locationList.findIndex(
      (location) => location.id === locationId
    );
    console.log(index);
    if (index !== -1) {
      flatListRef.current?.scrollToIndex({
        index,
        animated: true,
      });
    }
  };

  // useEffect(() => {
  //     console.log('locationSavedList rerendered');
  // }, []);

  useEffect(() => {
    if (scrollTo) {
      setTimeout(() => {
        scrollToLocationId(scrollTo);
        console.log("scrolllllTo:", scrollTo);
      }, 0); // Delay of 100ms
    }
  }, [scrollTo]);

  return (
    <View
      style={[styles.container, { height: 651 }]}
      onLayout={(event) => {
        console.log("Parent layout height:", event.nativeEvent.layout.height);
      }}
    >
      <Animated.FlatList
        ref={flatListRef}
        data={locationList}
        horizontal={false}
        keyExtractor={(location) => location.id.toString()}
        getItemLayout={(data, index) => ({
          length: COMBINED,
          offset: COMBINED * index,
          index,
        })}
        renderItem={({ item: location }) => (
          <LocationCard
            addToFavorites={addToFavoritesFunction}
            removeFromFavorites={removeFromFavoritesFunction}
            height={ITEM_HEIGHT}
            bottomMargin={ITEM_BOTTOM_MARGIN}
            location={location}
            iconColor={themeStyles.genericText.color}
            color={themeStyles.genericText.color}
            icon={ShopOutlineSvg}
            iconSize={25}
          />
        )}
        numColumns={1}
        columnWrapperStyle={null}
        estimatedItemSize={COMBINED}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        onLayout={(event) => {
          console.log(
            "FlashList layout height:",
            event.nativeEvent.layout.height
          );
        }}
        keyboardDismissMode="on-drag"
        itemLayoutAnimation={LinearTransition}
        // onScroll={(event) => {
        //   console.log("Scroll offset:", event.nativeEvent.contentOffset.y);
        // }}
        scrollIndicatorInsets={{ right: 1 }}
        onScrollToIndexFailed={(info) => {
          console.log("Saved Location List scroll to index failed:", info); // Logs the error information
          flatListRef.current?.scrollToOffset({
            offset: info.averageItemLength * info.index,
            animated: true,
          });
        }}
        snapToInterval={COMBINED} // Set the snapping interval to the height of each item
        snapToAlignment="start" // Align items to the top of the list when snapped
        decelerationRate="fast" // Optional: makes the scroll feel snappier
        ListFooterComponent={() => (
          <View style={{ height: momentListBottomSpacer }} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: "4%",
    backgroundColor: "transparent",
    width: "100%",
    minHeight: 2,
    height: "100%",
    flex: 1,
  },
  headerText: {
    color: "black",
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    marginTop: 4,
    marginBottom: 6,
  },
  imageRow: {
    justifyContent: "space-between",
  },
});

export default LocationsSavedList;
