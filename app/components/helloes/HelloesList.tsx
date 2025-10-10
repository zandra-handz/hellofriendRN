import { View, Pressable } from "react-native";
import React, { useEffect, useCallback, useMemo, useRef } from "react";
import HelloItem from "./HelloItem";
import InfiniteScrollSpinner from "../appwide/InfiniteScrollSpinner";
import { AppFontStyles } from "@/app/styles/AppFonts";

import Animated, {
  LinearTransition, 
} from "react-native-reanimated";

type FontStyles = {
  welcomeText: string;
  subWelcomeText: string;
};

type Props = { 
  helloesListFull: object[];
  isFetchingNextPage: boolean;
  applyInPersonFilter: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  onPress: () => void;
  triggerScroll: number;
};

const HelloesList = ({
 
  helloesListFull,
  isFetchingNextPage,
  fetchNextPage,
  hasNextPage,
  triggerScroll,
  primaryColor = "orange",
  onPress,
}: Props) => {
  const ITEM_HEIGHT = 90;
  const ITEM_BOTTOM_MARGIN = 4;
  const COMBINED_HEIGHT = ITEM_HEIGHT + ITEM_BOTTOM_MARGIN;

  const flatListRef = useRef(null);

  const fontStyles: FontStyles = useMemo(() => {
    return {
      welcomeText: AppFontStyles?.welcomeText ?? {
        fontSize: 18,
        fontWeight: "600",
      },
      subWelcomeText: AppFontStyles?.subWelcomeText ?? {
        fontSize: 14,
        color: "orange",
      },
    };
  }, [AppFontStyles]);
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

  const handleNavigateToSingleView = useCallback(
    (index: number) => {
      onPress(index);
    },
    [onPress]
  );
  const extractItemKey = (item, index) =>
    item?.id ? item.id.toString() : `hello-${index}`;

  // 2️⃣ Use it in renderHelloItem without creating a new arrow function
  const renderHelloItem = useCallback(
    ({ item, index }) => (
      <Pressable
        onPress={handleNavigateToSingleView.bind(null, index)}
        style={{
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
          primaryColor={primaryColor}
          welcomeTextStyle={fontStyles.welcomeText}
          subWelcomeTextStyle={fontStyles.subWelcomeText}
        />
      </Pressable>
    ),
    [handleNavigateToSingleView, primaryColor, fontStyles]
  );

  return (
    <View style={{ paddingTop: 0, flex: 1, paddingHorizontal: 4 }}>
      <Animated.FlatList
        fadingEdgeLength={20}
        ref={flatListRef}
        data={helloesListFull}
        // data={filteredData}
        itemLayoutAnimation={LinearTransition}
        // estimatedItemSize={144}
        renderItem={renderHelloItem}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        keyExtractor={extractItemKey}
        //getItemLayout={getItemLayout}
        // getItemLayout={getItemLayout}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <InfiniteScrollSpinner
            isFetchingNextPage={isFetchingNextPage}
            color={primaryColor}
            height={200}
          />
        }
      />
    </View>
  );
};

export default HelloesList;
