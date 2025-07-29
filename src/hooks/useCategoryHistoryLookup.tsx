import { useUser } from "../context/UserContext";
import { useInfiniteQuery } from "@tanstack/react-query";

import { fetchCapsulesHistoryAPI } from "../calls/api";

type Capsule = {
  id: number;
  capsule: string;
  // INCOMPLETE
};

type CategoryHistoryResponse = {
  results: Capsule[];
  next: string | null;
  previous: string | null;
  count: number;
};

type Props = {
  categoryId: number;
};

const useCategoryHistoryLookup = ({
  categoryId,
  friendId = null,
}: {
  categoryId: number;
  friendId?: number | null;
}) => {
  const { user, isAuthenticated, isInitializing } = useUser();

  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    isSuccess,
    isError,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<
    CategoryHistoryResponse,
    Error,
    CategoryHistoryResponse,
    (string | number | undefined)[],
    number
  >({
    queryKey: friendId
      ? ["friendStats", user?.id, categoryId, "friend", friendId]
      : ["userStats", user?.id, categoryId],
    queryFn: async ({ pageParam = 1 }) => {
      return await fetchCapsulesHistoryAPI({
        categoryId: categoryId,
        friendId: friendId,
        returnNonZeroesOnly: true,
        page: pageParam,
      });
    },
    getNextPageParam: (lastPage) => {
      // console.log("Last page received:", lastPage);
      if (!lastPage?.next) return undefined;
      const nextUrl = new URL(lastPage.next);
      return Number(nextUrl.searchParams.get("page"));
    },
    initialPageParam: 1,
    enabled: !!(categoryId && user?.id && isAuthenticated && !isInitializing),
    staleTime: 1000 * 60 * 60 * 10,
  });

  const flatResults = data?.pages.flatMap((page) => page.results) ?? [];

  return {
    categoryHistory: flatResults,
    isLoading,
    isFetching,
    isFetchingNextPage,
    isSuccess,
    isError,
    fetchNextPage,
    hasNextPage,
  };
};

export default useCategoryHistoryLookup;
