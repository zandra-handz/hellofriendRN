import { View, Pressable } from "react-native";
import React, { useCallback, useRef } from "react";
import InfiniteScrollSpinner from "../appwide/InfiniteScrollSpinner";
import GeckoEnergyLogItem from "./GeckoEnergyLogItem";
import Animated, { LinearTransition } from "react-native-reanimated";
import useFriendListAndUpcoming from "@/src/hooks/usefriendListAndUpcoming";
import { FlatList } from "react-native";

type EnergyLogEntry = {
  id: number;
  energy: number;
  surplus_energy: number;
  steps: number;
  friend: number | null;
  recorded_at: string;
};

type Props = {
  userId: number;
  listData: EnergyLogEntry[];
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  primaryColor?: string;
};

const GeckoEnergyLogList = ({
  userId,
  listData,
  isFetchingNextPage,
  fetchNextPage,
  hasNextPage,
  primaryColor = "orange",
}: Props) => {
  const ITEM_HEIGHT = 90;
  const ITEM_BOTTOM_MARGIN = 4;
  const COMBINED_HEIGHT = ITEM_HEIGHT + ITEM_BOTTOM_MARGIN;

  const { friendNameMap } = useFriendListAndUpcoming({
    userId,
    enabled: true,
  });

  const extractItemKey = (item: EnergyLogEntry, index: number) =>
    item?.id ? `energy-log-${item.id}` : `energy-log-idx-${index}`;

  const renderItem = useCallback(
    ({ item }: { item: EnergyLogEntry }) => (
      <Pressable style={{ width: "100%", height: COMBINED_HEIGHT }}>
        <GeckoEnergyLogItem
          friendNameMap={friendNameMap}
          logData={item}
          primaryColor={primaryColor}
        />
      </Pressable>
    ),
    [primaryColor, friendNameMap],
  );

  return (
    <View style={{ paddingTop: 0, height: 300, paddingHorizontal: 4 }}>
      <Animated.FlatList
        fadingEdgeLength={20}
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

export default GeckoEnergyLogList;
