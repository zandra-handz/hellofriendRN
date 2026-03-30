import { useEffect, useMemo } from "react";
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
};

const useUserGeckoSessionsTimeRange = ({ minutes }: Props) => {
  const { user } = useUser();

  const HARD_CODED_MINUTES = 720; //last 12 hours

  const {
    data,
    isLoading: userGeckoSessionsTimeRangeIsLoading,
    isFetching: userGeckoSessionsTimeRangeIsFetching,
    isFetchingNextPage,
    isSuccess: userGeckoSessionsTimeRangeIsSuccess,
    isError: userGeckoSessionsTimeRangeIsError,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["userGeckoSessionsTimeRange", user?.id], //add minutes to this only if querying different ranges
    queryFn: async ({ pageParam = 1 }) => {
      return await fetchGeckoCombinedSessionsTimeRange({
        minutes,
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

  const sessions = useMemo(
    () => data?.pages.flatMap((page) => page.results) ?? [],
    [data]
  );

  const userSessionTotals: SessionTotals | null = data?.pages[0]?.totals ?? null;

  return {
    userGeckoSessionsTimeRange: sessions,
    userSessionTotals,
    userGeckoSessionsTimeRangeIsLoading,
    userGeckoSessionsTimeRangeIsFetching,
    isFetchingNextPage,
    userGeckoSessionsTimeRangeIsSuccess,
    userGeckoSessionsTimeRangeIsError,
    fetchNextPage,
    hasNextPage,
  };
};

export default useUserGeckoSessionsTimeRange;