import { useEffect, useRef } from "react";
import { fetchdGeckoCombinedSessions } from "../../calls/api";
import useUser from "../useUser";
import { useInfiniteQuery } from "@tanstack/react-query";

type Props = {
  fetchAll?: boolean;
  indexNeeded?: number;
};

const useUserGeckoSessions = ({ fetchAll = false, indexNeeded = 0 }: Props) => {
  const { user, isInitializing } = useUser();

  const itemsPerPageOnBackend = 30;
  const pagesNeeded = Math.floor(indexNeeded / itemsPerPageOnBackend) + 1;
  const pagesFetchedRef = useRef(1);

  const {
    data: userGeckoSessions,
    isLoading: userGeckoSessionsIsLoading,
    isFetching: userGeckoSessionsIsFetching,
    isFetchingNextPage,
    isSuccess: userGeckoSessionsIsSuccess,
    isError: userGeckoSessionsIsError,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["userGeckoSessions", user?.id],
    queryFn: async ({ pageParam = 1 }) => {
      return await fetchdGeckoCombinedSessions({
        page: pageParam,
      });
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.next) return undefined;
      const nextUrl = new URL(lastPage.next);
      return Number(nextUrl.searchParams.get("page"));
    },
    initialPageParam: 1,
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (!fetchAll || isFetchingNextPage) return;

    const fetchUntilNeeded = async () => {
      while (
        pagesFetchedRef.current < pagesNeeded &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        await fetchNextPage();
        pagesFetchedRef.current += 1;
      }
    };

    fetchUntilNeeded();
  }, [fetchAll, pagesNeeded, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (fetchAll && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchAll, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const userGeckoSessionsFlattened =
    userGeckoSessions?.pages.flatMap((page) => page.results) ?? [];

  const fetchUntilIndex = async (newIndex) => {
    const newPagesNeeded = Math.floor(newIndex / itemsPerPageOnBackend) + 1;
    while (
      pagesFetchedRef.current < newPagesNeeded &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      await fetchNextPage();
      pagesFetchedRef.current += 1;
    }
  };

  return {
    userGeckoSessions,
    userGeckoSessionsFlattened,
    userGeckoSessionsIsLoading,
    userGeckoSessionsIsFetching,
    isFetchingNextPage,
    fetchUntilIndex,
    userGeckoSessionsIsSuccess,
    userGeckoSessionsIsError,
    fetchNextPage,
    hasNextPage,
  };
};

export default useUserGeckoSessions;