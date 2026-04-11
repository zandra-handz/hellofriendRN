import { View, Pressable } from "react-native";
import React, { useCallback } from "react";
import InfiniteScrollSpinner from "../appwide/InfiniteScrollSpinner";
import GeckoSyncLogItem from "./GeckoSyncLogItem";
import Animated, { LinearTransition } from "react-native-reanimated";

type SyncLogEntry = {
  id: number;
  created_at: string;
  trigger: string;

  client_energy: number | null;
  client_surplus: number | null;
  client_multiplier: number | null;
  client_computed_at: string | null;
  client_steps_in_payload: number | null;
  client_distance_in_payload: number | null;
  client_started_on: string | null;
  client_ended_on: string | null;
  client_fatigue: number | null;
  client_recharge: number | null;

  server_energy_before: number | null;
  server_energy_after: number | null;
  server_surplus_before: number | null;
  server_surplus_after: number | null;
  server_updated_at_before: string | null;
  server_updated_at_after: string | null;

  recompute_window_seconds: number | null;
  recompute_active_seconds: number | null;
  recompute_new_steps: number | null;
  recompute_fatigue: number | null;
  recompute_recharge: number | null;
  recompute_net: number | null;

  pending_entries_count: number | null;
  pending_entries_in_window: number | null;
  pending_entries_stale: number | null;
  pending_total_steps_all: number | null;
  pending_total_steps_in_window: number | null;

  energy_delta: number | null;
  phantom_steps: number | null;

  multiplier_active: boolean | null;
  streak_expires_at: string | null;

  total_steps_all_time: number | null;
};

type Props = {
  listData: SyncLogEntry[];
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  primaryColor?: string;
};

const GeckoSyncLogList = ({
  listData,
  isFetchingNextPage,
  fetchNextPage,
  hasNextPage,
  primaryColor = "orange",
}: Props) => {
  const extractItemKey = (item: SyncLogEntry, index: number) =>
    item?.id ? `sync-log-${item.id}` : `sync-log-idx-${index}`;

  const renderItem = useCallback(
    ({ item }: { item: SyncLogEntry }) => (
      <Pressable style={{ width: "100%" }}>
        <GeckoSyncLogItem logData={item} primaryColor={primaryColor} />
      </Pressable>
    ),
    [primaryColor],
  );

  return (
    <View style={{ paddingTop: 0, height: 300, paddingHorizontal: 4, backgroundColor: 'hotpink' }}>
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

export default GeckoSyncLogList;
