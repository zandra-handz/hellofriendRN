import { View,  Pressable } from "react-native";
import React, { useEffect, useCallback, useRef } from "react";
import { FlashList } from "@shopify/flash-list";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import HelloItem from "./HelloItem"; 
import InfiniteScrollSpinner from "../appwide/InfiniteScrollSpinner";

import { useNavigation } from "@react-navigation/native";
type Props = {
  helloesListFull: object[];
  isFetchingNextPage: boolean;
  applyInPersonFilter: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  onPress: () => void;
  triggerScroll: number;
};

const HelloesListNew = ({
  helloesListFull,
  isFetchingNextPage,
  fetchNextPage,
  hasNextPage,
  triggerScroll,
  onPress,
}: Props) => {
  const ITEM_HEIGHT = 140;
  const ITEM_BOTTOM_MARGIN = 4;
  const COMBINED_HEIGHT = ITEM_HEIGHT + ITEM_BOTTOM_MARGIN;
  const navigation = useNavigation();
  const flatListRef = useRef(null);

  const { themeStyles } = useGlobalStyle();

  useEffect(() => {
    if (triggerScroll) {
      scrollToHello(triggerScroll - 1); // PARENT ADDS ONE, THIS COMPONENT REMOVES IT BEFORE SCROLLING; index 0 won't trigger a scroll
    }
  }, [triggerScroll]);

  const scrollToHello = (helloIndex) => {
    if (helloIndex !== undefined) {
      flatListRef.current?.scrollToOffset({
        offset: COMBINED_HEIGHT * helloIndex,
        animated: true,
      });
    }
  };

  const handleNavigateToSingleView = (index) => {
    onPress(index);
  };

  const extractItemKey = (item, index) =>
    item?.id ? item.id.toString() : `hello-${index}`;

  const getItemLayout = (item, index) => {
    return {
      length: COMBINED_HEIGHT,
      offset: COMBINED_HEIGHT * index,
      index,
    };
  };

  const renderHelloItem = useCallback(
    ({ item, index }) => (
      <Pressable
        onPress={() => handleNavigateToSingleView(index)}
        style={{
          height: 40,
          width: "100%",
          height: COMBINED_HEIGHT,
        }}
      >
        <HelloItem
          combinedHeight={COMBINED_HEIGHT}
          itemHeight={ITEM_HEIGHT}
          bottomMargin={ITEM_BOTTOM_MARGIN}
          helloData={item}
          index={index}
        />
      </Pressable>
    ),
    [handleNavigateToSingleView]
  );

  return (
    <View style={{ paddingTop: 30, flex: 1 }}>
      <FlashList
        ref={flatListRef}
        data={helloesListFull}
        // data={filteredData}
        estimatedItemSize={144}
        renderItem={renderHelloItem}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        keyExtractor={extractItemKey}
        // getItemLayout={getItemLayout}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <InfiniteScrollSpinner 
          isFetchingNextPage={isFetchingNextPage}
          color={themeStyles.primaryText.color}
          height={200}
          />
        }
      />
    </View>
  );
};

export default HelloesListNew;
