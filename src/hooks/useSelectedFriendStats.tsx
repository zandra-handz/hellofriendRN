 
// import { fetchCategoriesHistoryCountAPI } from "@/src/calls/api";
// import React, { useMemo } from "react";
// import { useQuery, useQueryClient } from "@tanstack/react-query";

// type Props = {
//   userId: number;
//   isInitializing?: boolean;
//   friendIsReady: boolean;
//   enabled: boolean;

//   friendId: number;
// };

// const useSelectedFriendStats = ({
//   userId,
//   isInitializing=false,
//   friendId,
//   friendIsReady,
//   enabled,
// }: Props) => {
//   const queryClient = useQueryClient();

//   const { data: selectedFriendStats, isLoading: loadingFriendStats } = useQuery(
//     {
//       queryKey: ["selectedFriendStats", userId, friendId],
//       queryFn: () =>
//         fetchCategoriesHistoryCountAPI({
//           friendId: friendId,
//           returnNonZeroesOnly: true,
//         }),
//       // queryFn: () => fetchCategoriesFriendHistoryAPI(selectedFriend.id, false), //return non-empty categories only
//       enabled: !!(
//         userId &&
//         friendId &&
//         friendIsReady &&
//         !isInitializing &&
//         enabled
//       ),
//       staleTime: 1000 * 60 * 60 * 10, // 10 hours
//     }
//   );

//   const refetchFriendStats = () => {
//     if (userId && !isInitializing && friendId) {
//       queryClient.refetchQueries(["selectedFriendStats", userId, friendId]);
//     }
//   };

//   const invalidateFriendStats = () => {
//     if (userId && !isInitializing && friendId) {
//       queryClient.invalidateQueries(["selectedFriendStats", userId, friendId]);
//     }
//   };

//   return {
//     selectedFriendStats,
//     loadingFriendStats,
//     refetchFriendStats,
//     invalidateFriendStats,
//   };
// };

// export default useSelectedFriendStats;



import { fetchCategoriesHistoryCountAPI } from "@/src/calls/api";
import React, { useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type Props = {
  userId: number;
  isInitializing?: boolean;
  friendIsReady: boolean;
  enabled: boolean;
  friendId: number;
};

const useSelectedFriendStats = ({
  userId,
  isInitializing = false,
  friendId,
  friendIsReady,
  enabled,
}: Props) => {
  const queryClient = useQueryClient();

  const { data: selectedFriendStats, isLoading: loadingFriendStats } = useQuery({
    queryKey: ["selectedFriendStats", userId, friendId],
    queryFn: () =>
      fetchCategoriesHistoryCountAPI({
        friendId: friendId,
        returnNonZeroesOnly: true,
      }),
    enabled: !!(userId && friendId && friendIsReady && !isInitializing && enabled),
    staleTime: 1000 * 60 * 60 * 10,
  });

  const { sortedList, hasAnyCapsules } = useMemo(() => {
    if (!selectedFriendStats || !Array.isArray(selectedFriendStats) || selectedFriendStats.length === 0) {
      return { sortedList: [], hasAnyCapsules: false };
    }

    let totalCapsuleCount = 0;
    const categorySizeMap = new Map();

    selectedFriendStats.forEach((category) => {
      const categoryId = Number(category.id);
      const categoryName = String(category.name);
      const categorySize =
        category.completed_capsules?.length ||
        category.capsule_ids?.length ||
        0;

      totalCapsuleCount += categorySize;
      categorySizeMap.set(categoryId, {
        name: categoryName,
        size: categorySize,
      });
    });

    const sorted = Array.from(categorySizeMap.entries())
      .map(([user_category, sizeAndName]) => ({
        user_category,
        name: sizeAndName.name,
        size: sizeAndName.size,
        value: sizeAndName.size,
      }))
      .sort((a, b) => b.size - a.size);

    return {
      sortedList: sorted,
      hasAnyCapsules: totalCapsuleCount > 0,
    };
  }, [selectedFriendStats]);

  const refetchFriendStats = () => {
    if (userId && !isInitializing && friendId) {
      queryClient.refetchQueries({ queryKey: ["selectedFriendStats", userId, friendId] });
    }
  };

  const invalidateFriendStats = () => {
    if (userId && !isInitializing && friendId) {
      queryClient.invalidateQueries({ queryKey: ["selectedFriendStats", userId, friendId] });
    }
  };

  return {
    selectedFriendStats,
    sortedList,
    hasAnyCapsules,
    loadingFriendStats,
    refetchFriendStats,
    invalidateFriendStats,
  };
};

export default useSelectedFriendStats;