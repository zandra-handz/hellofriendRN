import { useMemo } from "react";
import { fetchGeckoCombinedSessionsTimeRange } from "../../calls/api";
import useUser from "../useUser";
import { useInfiniteQuery } from "@tanstack/react-query";

type GeckoSession = {
  id: number;
  steps: number;
  distance: number;
  started_on: string;
  ended_on: string;
};

type SessionTotals = {
  total_steps: number;
  total_distance: number;
  total_duration_seconds: number;
  total_hours: number;
  session_count: number;
  steps_per_hour: number;
  distance_per_hour: number;
};

type Props = {
  minutes: number;
  friendId?: number | null;
};

const useGeckoSessionsTimeRange = ({ minutes, friendId = null }: Props) => {
  const { user } = useUser();

  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    isSuccess,
    isError,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["geckoSessionsTimeRange", user?.id, friendId ?? null],
    queryFn: async ({ pageParam = 1 }) => {
      return await fetchGeckoCombinedSessionsTimeRange({
        minutes,
        friendId,
        page: pageParam,
      });
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.next) return undefined;
      const nextUrl = new URL(lastPage.next);
      return Number(nextUrl.searchParams.get("page"));
    },
    initialPageParam: 1,
    enabled: !!(user?.id && minutes > 0),
  });

  const sessions: GeckoSession[] = useMemo(
    () => data?.pages.flatMap((page) => page.results) ?? [],
    [data]
  );

  const sessionTotals: SessionTotals | null = data?.pages[0]?.totals ?? null;

  return {
    sessions,
    sessionTotals,
    isLoading,
    isFetching,
    isFetchingNextPage,
    isSuccess,
    isError,
    fetchNextPage,
    hasNextPage,
  };
};

export default useGeckoSessionsTimeRange;
