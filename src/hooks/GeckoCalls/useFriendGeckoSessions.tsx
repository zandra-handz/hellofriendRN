import { useEffect, useRef, useMemo } from "react";
import {  fetchFriendGeckoSessions } from "../../calls/api"; 
import useUser from "../useUser";
import { useInfiniteQuery } from "@tanstack/react-query";

type Props = {
  friendId: number;
  fetchAll?: boolean;  // New prop to trigger fetching all pages at once
  indexNeeded?: number;
};

const useFriendGeckoSessions = ({ friendId, fetchAll = false, indexNeeded = 0 }: Props) => {
  const { user, isInitializing } = useUser();

  const itemsPerPageOnBackend = 30;

  // console.log('starting index in useFullHelloes', indexNeeded);
  const pagesNeeded = Math.floor(indexNeeded / itemsPerPageOnBackend) + 1;
  // console.log(`pages needed`, pagesNeeded);

const pagesFetchedRef = useRef(1); // starts at 1 because page 1 is fetched initially



  const {
    data: friendGeckoSessions,
    isLoading: friendGeckoSessionsIsLoading,
    isFetching: friendGeckoSessionsIsFetching,
    isFetchingNextPage,
    isSuccess: friendGeckoSessionsIsSuccess,
    isError: friendGeckoSessionsIsError,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["friendGeckoSessions", user?.id, friendId],
    queryFn: async ({ pageParam = 1 }) => {
      return await fetchFriendGeckoSessions({
        friendId: friendId,
        page: pageParam,
      });
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.next) return undefined;
      const nextUrl = new URL(lastPage.next);
      return Number(nextUrl.searchParams.get("page"));
    },
    initialPageParam: 1,
    enabled: !!(friendId && user?.id),  
   // staleTime: 1000 * 60 * 60 * 10,
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

  // When fetchAll is true, keep calling fetchNextPage until no pages left
  useEffect(() => {
    if (fetchAll && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchAll, hasNextPage, isFetchingNextPage, fetchNextPage]);
 
  
  
  const friendGeckoSessionsFlattened = friendGeckoSessions?.pages.flatMap((page) => page.results) ?? [];
 
 
  const fetchUntilIndex = async (newIndex) => {
  const newPagesNeeded = Math.floor(newIndex / itemsPerPageOnBackend) + 1;
  while (pagesFetchedRef.current < newPagesNeeded && hasNextPage && !isFetchingNextPage) {
    await fetchNextPage();
    pagesFetchedRef.current += 1;
  }
};


 


  return {
    friendGeckoSessions,
    friendGeckoSessionsFlattened, 
    friendGeckoSessionsIsLoading,
    friendGeckoSessionsIsFetching,
    isFetchingNextPage,
    fetchUntilIndex,
   friendGeckoSessionsIsSuccess,
    friendGeckoSessionsIsError,
    fetchNextPage,
    hasNextPage, 
  };
};

export default useFriendGeckoSessions;
