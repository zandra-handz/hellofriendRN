import { useEffect, useRef } from "react";
import { fetchGeckoPointsLedger } from "../../calls/api";
import useUser from "../useUser";
import { useInfiniteQuery } from "@tanstack/react-query";

type Props = {
  fetchAll?: boolean;
  indexNeeded?: number;
};

const useUserGeckoPointsLedger = ({ fetchAll = false, indexNeeded = 0 }: Props) => {
  const { user, isInitializing } = useUser();

  const itemsPerPageOnBackend = 30;
  const pagesNeeded = Math.floor(indexNeeded / itemsPerPageOnBackend) + 1;
  const pagesFetchedRef = useRef(1);

  const {
    data: userGeckoPointsLedger,
    isLoading: userGeckoPointsLedgerIsLoading,
    isFetching: userGeckoPointsLedgerIsFetching,
    isFetchingNextPage,
    isSuccess: userGeckoPointsLedgerIsSuccess,
    isError: userGeckoPointsLedgerIsError,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["userGeckoPointsLedger", user?.id],
    queryFn: async ({ pageParam = 1 }) => {
      return await fetchGeckoPointsLedger({ page: pageParam });
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

  const userGeckoPointsLedgerFlattened =
    userGeckoPointsLedger?.pages.flatMap((page) => page.results) ?? [];

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
    userGeckoPointsLedger,
    userGeckoPointsLedgerFlattened,
    userGeckoPointsLedgerIsLoading,
    userGeckoPointsLedgerIsFetching,
    isFetchingNextPage,
    fetchUntilIndex,
    userGeckoPointsLedgerIsSuccess,
    userGeckoPointsLedgerIsError,
    fetchNextPage,
    hasNextPage,
  };
};

export default useUserGeckoPointsLedger;
