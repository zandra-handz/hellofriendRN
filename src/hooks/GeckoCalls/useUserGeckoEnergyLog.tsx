import { useEffect, useRef } from "react";
import { fetchGeckoEnergyLog } from "../../calls/api";
import useUser from "../useUser";
import { useInfiniteQuery } from "@tanstack/react-query";

type Props = {
  fetchAll?: boolean;
  indexNeeded?: number;
};

const useUserGeckoEnergyLog = ({ fetchAll = false, indexNeeded = 0 }: Props) => {
  const { user, isInitializing } = useUser();

  const itemsPerPageOnBackend = 30;
  const pagesNeeded = Math.floor(indexNeeded / itemsPerPageOnBackend) + 1;
  const pagesFetchedRef = useRef(1);

  const {
    data: userGeckoEnergyLog,
    isLoading: userGeckoEnergyLogIsLoading,
    isFetching: userGeckoEnergyLogIsFetching,
    isFetchingNextPage,
    isSuccess: userGeckoEnergyLogIsSuccess,
    isError: userGeckoEnergyLogIsError,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["userGeckoEnergyLog", user?.id],
    queryFn: async ({ pageParam = 1 }) => {
      return await fetchGeckoEnergyLog({ page: pageParam });
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

  const userGeckoEnergyLogFlattened =
    userGeckoEnergyLog?.pages.flatMap((page) => page.results) ?? [];

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
    userGeckoEnergyLog,
    userGeckoEnergyLogFlattened,
    userGeckoEnergyLogIsLoading,
    userGeckoEnergyLogIsFetching,
    isFetchingNextPage,
    fetchUntilIndex,
    userGeckoEnergyLogIsSuccess,
    userGeckoEnergyLogIsError,
    fetchNextPage,
    hasNextPage,
  };
};

export default useUserGeckoEnergyLog;
