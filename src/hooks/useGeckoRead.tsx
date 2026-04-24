import {
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type Props = {
  userId: number | undefined;
  geckoScoreState: any;
  friendId: number | undefined;
  capsuleCount: number;
};

const useGeckoRead = ({
  userId,
  friendId,
  capsuleCount,
}: Props) => {
  const queryClient = useQueryClient();

  const readKey = useMemo(
    () => ["geckoReadIds", userId, friendId],
    [userId, friendId],
  );

  const readAllKey = useMemo(
    () => ["geckoHasReadAll", userId, friendId],
    [userId, friendId],
  );

  const updateReadIds = useCallback(
    (newIds: string[]) => {
      const current =
        (queryClient.getQueryData(readKey) as string[] | undefined) ?? [];

      // console.log(`readIds: ${current.length} / ${capsuleCount} in cache`);

      queryClient.setQueryData(readKey, (prev: string[] = []) => {
        const existing = new Set(prev);
        const unique = newIds.filter((id) => !existing.has(id));
        if (unique.length === 0) return prev;

        const updated = [...prev, ...unique];
        const nextHasReadAll = capsuleCount > 0 && updated.length >= capsuleCount;
        const currentHasReadAll = queryClient.getQueryData(readAllKey) ?? false;

        if (nextHasReadAll !== currentHasReadAll) {
          queryClient.setQueryData(readAllKey, nextHasReadAll);
        }

        // console.log(`readIds updated: ${updated.length} read, ${capsuleCount} total`);
        return updated;
      });
    },
    [capsuleCount, queryClient, readAllKey, readKey],
  );

  const { data: hasReadAll = false } = useQuery({
    queryKey: readAllKey,
    queryFn: () => false,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const hasInitializedRef = useRef(false);

  const markInitialized = useCallback(() => {
    hasInitializedRef.current = true;
  }, []);

  const getReadIds = useCallback((): string[] => {
    return (queryClient.getQueryData(readKey) as string[] | undefined) ?? [];
  }, [queryClient, readKey]);

   

  return {
   
    updateReadIds,
    getReadIds,
    hasReadAll,
    hasInitializedRef,
    markInitialized,
   
    // streakActive,
 
  };
};

export default useGeckoRead;