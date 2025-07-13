import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { useUser } from '../context/UserContext'
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";




import { 
  fetchCategoriesHistoryAPI,
  fetchCategoriesHistoryCountAPI,
} from "../calls/api";


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


// const useCategoryHistoryLookup = ({ categoryId }: Props) => {
//   const { user, isAuthenticated, isInitializing } = useUser();

//   const {
//     data: categoryHistory,
//     isLoading,
//     isFetching,
//     isSuccess,
//     isError,
//   } = useQuery({
//     queryKey: ["userStats", user?.id, categoryId],
//     queryFn: () => fetchCategoriesHistoryAPI(categoryId, true),
//     enabled: !!(categoryId && user?.id && isAuthenticated && !isInitializing),
//     staleTime: 1000 * 60 * 60 * 10,
//   });


  

 

//   return {
//     categoryHistory,
//     isLoading,
//     isFetching,
//     isSuccess,
//     isError,
//   };
// };
 


// export default useCategoryHistoryLookup
//  
const useCategoryHistoryLookup = ({ categoryId }: { categoryId: number }) => {
  const { user, isAuthenticated, isInitializing } = useUser();

  console.log("categoryId", categoryId);
console.log("user.id", user?.id);
console.log("isAuthenticated", isAuthenticated);
console.log("isInitializing", isInitializing);
console.log(
  "✅ enabled = ",
  !!(categoryId && user?.id && isAuthenticated && !isInitializing)
);

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
    queryKey: ["userStats", user?.id, categoryId],
    queryFn: async ({ pageParam = 1 }) => {
      console.log("🔄 Calling fetchCategoriesHistoryAPI with page:", pageParam);
      return await fetchCategoriesHistoryAPI(categoryId, true, pageParam);
    },
    getNextPageParam: (lastPage) => {
      console.log("📦 Last page received:", lastPage);
      if (!lastPage?.next) return undefined;
      const nextUrl = new URL(lastPage.next);
      return Number(nextUrl.searchParams.get("page"));
    },
    initialPageParam: 1,
    enabled: !!(categoryId && user?.id && isAuthenticated && !isInitializing),
    staleTime: 1000 * 60 * 60 * 10,
  });

  const flatResults = data?.pages.flatMap((page) => page.results) ?? [];

  useEffect(() => {
    if (flatResults) {
        console.log(`FLAT RESULTS`, flatResults);
    }

  }, [flatResults]);

    useEffect(() => {
    if (data) {
        console.log(`DATA RESULTS`, data);
    }

  }, [data]);

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

//   const {
//     data,
//     isLoading,
//     isFetching,
//     isFetchingNextPage,
//     isSuccess,
//     isError,
//     fetchNextPage,
//     hasNextPage,
//   } = 
  
//  useInfiniteQuery<
//   CategoryHistoryResponse, 
//   Error, 
//   CategoryHistoryResponse, 
//   (string | number | undefined)[], 
//   number
// >
//   ({
    
    
    
    
//     queryKey: ["userStats", user?.id, categoryId],
//     queryFn: async ({ pageParam = 1 }) => {
//       return await fetchCategoriesHistoryAPI(categoryId, true, pageParam);
//     },
//     getNextPageParam: (lastPage) => {
//       if (!lastPage?.next) return undefined;
//       const nextUrl = new URL(lastPage.next);
//       return Number(nextUrl.searchParams.get("page"));
//     },
//     initialPageParam: 1,
//     enabled: !!(categoryId && user?.id && isAuthenticated && !isInitializing),
//     staleTime: 1000 * 60 * 60 * 10,
//   });

//   useEffect(() => {
//     if (data) {
//         console.log(data);
//     }

//   }, [data]);

//   const flatResults = data?.pages.flatMap((page) => page.results) ?? [];

//   return {
//     categoryHistory: flatResults,
//     isLoading,
//     isFetching,
//     isFetchingNextPage,
//     isSuccess,
//     isError,
//     fetchNextPage,
//     hasNextPage,
//   };
// };

export default useCategoryHistoryLookup;