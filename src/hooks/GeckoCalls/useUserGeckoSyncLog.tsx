 import { useEffect, useRef } from "react";                                                                                                                                                                                                         
  import { fetchGeckoSyncLog } from "../../calls/api";
  import useUser from "../useUser";                                                                                                                                                                                                                    import { useInfiniteQuery } from "@tanstack/react-query";                                                                                                                                                                                          
                                                                                                                                                                                                                                                     
  type Props = {
    fetchAll?: boolean;
    indexNeeded?: number;
    trigger?: string;
    excludeTriggers?: string[];
    since?: string;
    until?: string;
  };

  const useUserGeckoSyncLog = ({
    fetchAll = false,
    indexNeeded = 0,
       trigger = 'update_gecko_data',
    excludeTriggers,
    since,
    until,
  }: Props) => {
    const { user, isInitializing } = useUser();

    const itemsPerPageOnBackend = 30;
    const pagesNeeded = Math.floor(indexNeeded / itemsPerPageOnBackend) + 1;
    const pagesFetchedRef = useRef(1);

    const sortedExcludeKey = excludeTriggers
      ? [...excludeTriggers].sort()
      : null;

    const {
      data: userGeckoSyncLog,
      isLoading: userGeckoSyncLogIsLoading,
      isFetching: userGeckoSyncLogIsFetching,
      isFetchingNextPage,
      isSuccess: userGeckoSyncLogIsSuccess,
      isError: userGeckoSyncLogIsError,
      fetchNextPage,
      hasNextPage,
    } = useInfiniteQuery({
      queryKey: [
        "userGeckoSyncLog",
        user?.id,
        trigger ?? null,
        sortedExcludeKey,
        since ?? null,
        until ?? null,
      ],
      queryFn: async ({ pageParam = 1 }) => {
        return await fetchGeckoSyncLog({
          page: pageParam,
          trigger,
          excludeTriggers,
          since,
          until,
        });
      },
      getNextPageParam: (lastPage) => {
        if (!lastPage?.next) return undefined;
        const nextUrl = new URL(lastPage.next);
        return Number(nextUrl.searchParams.get("page"));
      },
      initialPageParam: 1,
      enabled: !!user?.id,
      staleTime: 0,
      gcTime: 0,
      refetchOnMount: "always",
    });

    useEffect(() => {
      pagesFetchedRef.current = 1;
    }, [trigger, sortedExcludeKey?.join(",")]);

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

    const userGeckoSyncLogFlattened =
      userGeckoSyncLog?.pages.flatMap((page) => page.results) ?? [];

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
      userGeckoSyncLog,
      userGeckoSyncLogFlattened,
      userGeckoSyncLogIsLoading,
      userGeckoSyncLogIsFetching,
      isFetchingNextPage,
      fetchUntilIndex,
      userGeckoSyncLogIsSuccess,
      userGeckoSyncLogIsError,
      fetchNextPage,
      hasNextPage,
    };
  };

  export default useUserGeckoSyncLog;