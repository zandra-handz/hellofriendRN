import { View, Pressable } from "react-native";
import React, { useEffect, useCallback, useRef } from "react";
import InfiniteScrollSpinner from "../appwide/InfiniteScrollSpinner";
import GeckoPointsLedgerItem from "./GeckoPointsLedgerItem";
import Animated, { LinearTransition } from "react-native-reanimated";
import useFriendListAndUpcoming from "@/src/hooks/usefriendListAndUpcoming";
import { FlatList } from "react-native";

type LedgerEntry = {
  id: number;
  amount: number;
  created_on: string;
  reason?: string | null;
};

type Props = {
  userId: number;
  listData: LedgerEntry[];
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  triggerScroll: number;
  primaryColor?: string;
};

const GeckoPointsLedgerList = ({
  userId,
  listData,
  isFetchingNextPage,
  fetchNextPage,
  hasNextPage,
  triggerScroll,
  primaryColor = "orange",
}: Props) => {
  const ITEM_HEIGHT = 90;
  const ITEM_BOTTOM_MARGIN = 4;
  const COMBINED_HEIGHT = ITEM_HEIGHT + ITEM_BOTTOM_MARGIN;

  const flatListRef = useRef<FlatList<LedgerEntry>>(null);

    const {  friendNameMap } = useFriendListAndUpcoming({
    userId,
    enabled: true,
  });

  useEffect(() => {
    if (triggerScroll) {
      flatListRef.current?.scrollToOffset({
        offset: COMBINED_HEIGHT * (triggerScroll - 1),
        animated: true,
      });
    }
  }, [triggerScroll]);

  const extractItemKey = (item: LedgerEntry, index: number) =>
    item?.id ? `points-ledger-${item.id}` : `points-ledger-idx-${index}`;

  const renderItem = useCallback(
    ({ item }: { item: LedgerEntry }) => (
      <Pressable style={{ width: "100%", height: COMBINED_HEIGHT }}>
        <GeckoPointsLedgerItem
        friendNameMap={friendNameMap}
          ledgerData={item}
          primaryColor={primaryColor}
        />
      </Pressable>
    ),
    [primaryColor]
  );

  return (
    <View style={{ paddingTop: 0, height: 300, paddingHorizontal: 4 }}>
      <Animated.FlatList
        fadingEdgeLength={20}
        ref={flatListRef}
        data={listData}
        itemLayoutAnimation={LinearTransition}
        renderItem={renderItem}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        keyExtractor={extractItemKey}
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

export default GeckoPointsLedgerList;
