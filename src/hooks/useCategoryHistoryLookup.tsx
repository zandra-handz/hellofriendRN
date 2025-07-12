import { View, Text } from 'react-native'
import React from 'react'
import { useUser } from '../context/UserContext'
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { 
  fetchCategoriesHistoryAPI,
  fetchCategoriesHistoryCountAPI,
} from "../calls/api";

type Props = { 
    categoryId: number;
}

const useCategoryHistoryLookup = ({ categoryId }: Props) => {
  const { user, isAuthenticated, isInitializing } = useUser();

  const {
    data: categoryHistory,
    isLoading,
    isFetching,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ["userStats", user?.id, categoryId],
    queryFn: () => fetchCategoriesHistoryAPI(categoryId, true),
    enabled: !!(categoryId && user?.id && isAuthenticated && !isInitializing),
    staleTime: 1000 * 60 * 60 * 10,
  });

 

  return {
    categoryHistory,
    isLoading,
    isFetching,
    isSuccess,
    isError,
  };
};
 

export default useCategoryHistoryLookup