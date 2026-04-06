

import React, { useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUpcomingHelloesAndFriends } from "@/src/calls/api";

type Props = {
  userId: number;
  isInitializing?: boolean;
  enabled: boolean;
};

const friendListQueryOptions = (userId: number) => ({
  queryKey: ["friendListAndUpcoming", userId],
  queryFn: () => fetchUpcomingHelloesAndFriends(),
  enabled: !!userId,
  retry: 4,
});

const useFriendListAndUpcoming = ({
  userId,
  isInitializing = false,
  enabled = true,
}: Props) => {
  const selectFn = useCallback((data) => {
    let nextFriend = null;
    let upcomingWithSummaries = [];

    if (data.upcoming?.length && data.friends?.length) {
      nextFriend = data.friends.find(
        (friend) => Number(friend.id) === Number(data.upcoming[0]?.friend?.id)
      );
    }
 
    const upcomingDateMap: Record<number, string | null> = {};
    if (data.upcoming?.length) {
      data.upcoming.forEach((upcoming) => {
        upcomingDateMap[upcoming.friend.id] = upcoming.future_date_in_words ?? null;
      });
    }
    

    if (data.upcoming?.length && data.friends?.length && data.capsule_summaries?.length) {
      const capsuleMap = {};
      data.capsule_summaries.forEach((cs) => {
        capsuleMap[cs.id] = cs;
      });

      upcomingWithSummaries = data.upcoming.map((upcoming) => {
        const friendId = upcoming.friend.id;
        const capsuleSummary = capsuleMap[friendId] || null;
        return {
          ...upcoming,
          capsule_summary: capsuleSummary?.capsule_summary || [],
          capsule_count: capsuleSummary?.capsule_count || 0,
        };
      });
    }

    const locale = "en";
    const sortedFriends =
      data.friends
        ?.slice()
        .sort((a, b) =>
          a.name.localeCompare(b.name, locale, { sensitivity: "case" })
        )
        .map((friend) => ({
          ...friend,
          future_date_in_words: upcomingDateMap[friend.id] ?? null,
        })) || [];

    const friendNameMap: Record<number, string> = {};
    if (sortedFriends) {
      for (const f of sortedFriends) {
        friendNameMap[f.id] = f.name;
      }
    }

    return {
      ...data,
      upcoming: upcomingWithSummaries,
      friends: sortedFriends,
      next: nextFriend,
      friendNameMap,
    };
  }, []);

  const {
    data: friendListAndUpcoming,
    isLoading,
    isFetching,
    isSuccess,
    isError,
  } = useQuery({
    ...friendListQueryOptions(userId),
    enabled: !!userId && !isInitializing && enabled,
    select: selectFn,
  });

  const upNext = useMemo(() => {
    return friendListAndUpcoming?.next;
  }, [friendListAndUpcoming]);

  return {
    friendListAndUpcoming,
    friendNameMap: friendListAndUpcoming?.friendNameMap ?? {},
    friendListAndUpcomingIsFetching: isFetching,
    friendListAndUpcomingIsSuccess: isSuccess,
    upNext,
    isLoading,
  };
};

export default useFriendListAndUpcoming;