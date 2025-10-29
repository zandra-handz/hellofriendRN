import { fetchCategoriesHistoryCountAPI } from "@/src/calls/api";
import React, { useMemo, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserCategories } from "@/src/calls/api";
import isEqual from "lodash.isequal";

export interface CategoryType {
  id: number;
  name: string;
  // add other fields here if needed
}

type Props = {
  userId: number;
  isInitializing?: boolean;

  enabled: boolean;
};

const useCategories = ({
  userId,
  isInitializing = false,

  enabled = true,
}: Props) => {
  const prevCategoriesRef = useRef<CategoryType[]>([]);

  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["categories", userId],
    queryFn: () => getUserCategories(userId),
    enabled: !!(userId && !isInitializing),
    staleTime: 1000 * 60 * 60 * 10, // 10 hours
  });

  const userCategories = useMemo(() => {
    if (!data) return [];
    if (isEqual(prevCategoriesRef.current, data))
      return prevCategoriesRef.current;
    prevCategoriesRef.current = data;
    return data;
  }, [data]);

  return {
    userCategories,
    isLoading,
    isSuccess,
  };
};

export default useCategories;
