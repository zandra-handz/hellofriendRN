import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchGeckoGameWins } from "@/src/calls/api";

type Props = {
  userId: number | undefined;
  fetchAll?: boolean;
  indexNeeded?: number;
};

const useGeckoGameWins = ({
  userId,
  fetchAll = false,
  indexNeeded = 0,
}: Props) => {
  const itemsPerPageOnBackend = 30;
  const pagesNeeded = Math.floor(indexNeeded / itemsPerPageOnBackend) + 1;
  const pagesFetchedRef = useRef(1);

  const {
    data: geckoGameWins,
    isLoading: geckoGameWinsIsLoading,
    isFetching: geckoGameWinsIsFetching,
    isFetchingNextPage,
    isSuccess: geckoGameWinsIsSuccess,
    isError: geckoGameWinsIsError,
    fetchNextPage,
    hasNextPage,
    refetch: refetchGeckoGameWins,
  } = useInfiniteQuery({
    queryKey: ["geckoGameWins", userId ?? 0],
    queryFn: async ({ pageParam = 1 }) => {
      return await fetchGeckoGameWins({ page: pageParam });
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.next) return undefined;
      const nextUrl = new URL(lastPage.next);
      return Number(nextUrl.searchParams.get("page"));
    },
    initialPageParam: 1,
    enabled: !!userId,
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

  const geckoGameWinsFlattened =
    geckoGameWins?.pages.flatMap((page) => page.results) ?? [];

  const fetchUntilIndex = async (newIndex: number) => {
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
    geckoGameWins,
    geckoGameWinsFlattened,
    geckoGameWinsIsLoading,
    geckoGameWinsIsFetching,
    isFetchingNextPage,
    fetchUntilIndex,
    geckoGameWinsIsSuccess,
    geckoGameWinsIsError,
    fetchNextPage,
    hasNextPage,
    refetchGeckoGameWins,
  };
};

export default useGeckoGameWins;
