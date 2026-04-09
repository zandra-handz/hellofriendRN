// import { useCallback, useEffect, useMemo, MutableRefObject } from "react";                                                                                                  import { useQuery, useQueryClient } from "@tanstack/react-query";                                                                                                         
//   import { isoDateTimeToWeekdayMonthDay, getAgeFromDate } from "@/src/utils/dateUtils";                                                                                       import useGeckoVoice from "@/src/hooks/useGeckoVoice";                                                                                                                      import { showFlashMessage } from "../utils/ShowFlashMessage";                                                                                                             
//                                                                                                                                                                               const useGeckoSynthesizer_WS = ({
//     userId,
//     geckoCombinedData,
//     geckoScoreState,
//     scoreStateRef,
//     sessionTotals,
//     friendId,
//     userSessionTotals,
//     capsuleCount,
//   }: {
//     userId: number | undefined;
//     geckoCombinedData: any;
//     geckoScoreState: any;
//     scoreStateRef: MutableRefObject<any>;
//     sessionTotals: any;
//     friendId: number | undefined;
//     userSessionTotals: any;
//     capsuleCount: number;
//   }) => {
//     const queryClient = useQueryClient();

//     const gecko = useMemo(() => {
//       const ss = scoreStateRef.current;
//       if (!sessionTotals || !userSessionTotals || !geckoScoreState || !geckoCombinedData || !ss) {
//         return null;
//       }

//       const birthday = ss.gecko_created_on
//         ? isoDateTimeToWeekdayMonthDay(ss.gecko_created_on, { alwaysShowYear: true })
//         : null;
//       const age = ss.gecko_created_on ? getAgeFromDate(ss.gecko_created_on) : null;

//       return {
//         birthday,
//         age,
//         lifetimeDistance: geckoCombinedData.total_distance,
//         lifetimeSteps: geckoCombinedData.total_steps,
//         recentDistance: userSessionTotals.total_distance,
//         recentSteps: userSessionTotals.total_steps,
//         memoryType: ss.memory_type,
//         memoryTypeLabel: ss.memory_type_label,
//         personalityType: ss.personality_type,
//         personalityTypeLabel: ss.personality_type_label,
//         activeHoursType: ss.active_hours_type,
//         activeHoursTypeLabel: ss.active_hours_type_label,
//         storyType: ss.story_type,
//         storyTypeLabel: ss.story_type_label,
//         scoreBaseMultiplier: geckoScoreState.base_multiplier,
//         scoreMultiplier: geckoScoreState.multiplier,
//       };
//     }, [geckoCombinedData, geckoScoreState, userSessionTotals, sessionTotals]);

//     const streakActive = useMemo(() => {
//       if (!geckoScoreState?.expires_at) return false;
//       if (geckoScoreState.multiplier <= geckoScoreState.base_multiplier) return false;
//       return new Date(geckoScoreState.expires_at).getTime() > Date.now();
//     }, [geckoScoreState?.expires_at, geckoScoreState?.multiplier, geckoScoreState?.base_multiplier]);

//     useEffect(() => {
//       if (!streakActive || !geckoScoreState?.expires_at) return;
//       showFlashMessage(`Streak achieved!`, false, 2000);
//     }, [streakActive]);

//     const isAwake = useMemo(() => {
//       const ss = scoreStateRef.current;
//       if (!ss?.active_hours || !Array.isArray(ss.active_hours) || ss.active_hours.length === 0) {
//         return true;
//       }
//       const currentHour = new Date().getHours();
//       return ss.active_hours.includes(currentHour);
//     }, [geckoScoreState]);

//     const readKey = useMemo(
//       () => ["geckoReadIds", userId, friendId],
//       [userId, friendId]
//     );

//     const readAllKey = useMemo(
//       () => ["geckoHasReadAll", userId, friendId],
//       [userId, friendId]
//     );

//     const updateReadIds = useCallback(
//       (newIds: string[]) => {
//         const t = performance.now();
//         const current = (queryClient.getQueryData(readKey) as string[] | undefined) ?? [];
//         console.log(`readIds: ${current.length} / ${capsuleCount} in cache`);
//         queryClient.setQueryData(readKey, (prev: string[] = []) => {
//           const existing = new Set(prev);
//           const unique = newIds.filter((id) => !existing.has(id));
//           if (unique.length === 0) return prev;
//           const updated = [...prev, ...unique];
//           const nextHasReadAll = capsuleCount > 0 && updated.length >= capsuleCount;
//           const currentHasReadAll = queryClient.getQueryData(readAllKey) ?? false;
//           if (nextHasReadAll !== currentHasReadAll) {
//             queryClient.setQueryData(readAllKey, nextHasReadAll);
//           }
//           console.log(`readIds updated: ${updated.length} read, ${capsuleCount} total`);
//           return updated;
//         });
//         console.log(`setQueryData took ${(performance.now() - t).toFixed(2)}ms`);
//       },
//       [queryClient, readKey, readAllKey, capsuleCount]
//     );

//     const { data: hasReadAll = false } = useQuery({
//       queryKey: readAllKey,
//       queryFn: () => false,
//       staleTime: Infinity,
//       gcTime: Infinity,
//     });

//     const initializedKey = useMemo(
//       () => ["geckoHasInitialized", userId, friendId],
//       [userId, friendId]
//     );

//     const { data: hasInitialized = false } = useQuery({
//       queryKey: initializedKey,
//       queryFn: () => false,
//       staleTime: Infinity,
//       gcTime: Infinity,
//     });

//     const markInitialized = useCallback(() => {
//       queryClient.setQueryData(initializedKey, true);
//     }, [queryClient, initializedKey]);

//     const getReadIds = useCallback((): string[] => {
//       return (queryClient.getQueryData(readKey) as string[] | undefined) ?? [];
//     }, [queryClient, readKey]);

//     const { scripts } = useGeckoVoice({
//       personalityType: gecko?.personalityType,
//       memoryType: gecko?.memoryType,
//       storyType: gecko?.storyType,
//     });

//     return {
//       gecko,
//       updateReadIds,
//       getReadIds,
//       hasReadAll,
//       hasInitialized,
//       markInitialized,
//       scripts,
//       streakActive,
//       isAwake,
//     };
//   };

//   export default useGeckoSynthesizer_WS;


import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { isoDateTimeToWeekdayMonthDay, getAgeFromDate } from "@/src/utils/dateUtils";
import useGeckoVoice from "@/src/hooks/useGeckoVoice";
import { showFlashMessage } from "../utils/ShowFlashMessage";

type Props = {
  userId: number | undefined;
  geckoCombinedData: any;
  geckoScoreState: any;
  liveScoreState: any;
  sessionTotals: any;
  friendId: number | undefined;
  userSessionTotals: any;
  capsuleCount: number;
  getScoreState?: () => void;
};

const useGeckoSynthesizer_WS = ({
  userId,
  geckoCombinedData,
  geckoScoreState,
  liveScoreState,
  sessionTotals,
  friendId,
  userSessionTotals,
  capsuleCount,
  getScoreState,
}: Props) => {
  const queryClient = useQueryClient();
  const hasShownStreakFlashRef = useRef(false);

  // Prefer websocket state; fall back to query state only if needed
  const ss = liveScoreState ?? geckoScoreState ?? null;

  const gecko = useMemo(() => {
    if (!sessionTotals || !userSessionTotals || !geckoCombinedData || !ss) {
      return null;
    }

    const birthday = ss.gecko_created_on
      ? isoDateTimeToWeekdayMonthDay(ss.gecko_created_on, {
          alwaysShowYear: true,
        })
      : null;

    const age = ss.gecko_created_on ? getAgeFromDate(ss.gecko_created_on) : null;

    return {
      birthday,
      age,
      lifetimeDistance: geckoCombinedData.total_distance,
      lifetimeSteps: geckoCombinedData.total_steps,
      recentDistance: userSessionTotals.total_distance,
      recentSteps: userSessionTotals.total_steps,
      memoryType: ss.memory_type,
      memoryTypeLabel: ss.memory_type_label,
      personalityType: ss.personality_type,
      personalityTypeLabel: ss.personality_type_label,
      activeHoursType: ss.active_hours_type,
      activeHoursTypeLabel: ss.active_hours_type_label,
      storyType: ss.story_type,
      storyTypeLabel: ss.story_type_label,
      scoreBaseMultiplier: ss.base_multiplier,
      scoreMultiplier: ss.multiplier,
    };
  }, [geckoCombinedData, sessionTotals, ss, userSessionTotals]);

  const streakActive = useMemo(() => {
    if (!ss?.expires_at) return false;
    if ((ss.multiplier ?? 1) <= (ss.base_multiplier ?? 1)) return false;
    return new Date(ss.expires_at).getTime() > Date.now();
  }, [ss]);

  useEffect(() => {
    if (streakActive && !hasShownStreakFlashRef.current) {
      hasShownStreakFlashRef.current = true;
      showFlashMessage("Streak achieved!", false, 2000);
    }

    if (!streakActive) {
      hasShownStreakFlashRef.current = false;
    }
  }, [streakActive]);

  useEffect(() => {
    if (!ss?.expires_at) return;
    if ((ss.multiplier ?? 1) <= (ss.base_multiplier ?? 1)) return;

    const msUntilExpiry = new Date(ss.expires_at).getTime() - Date.now();
    if (msUntilExpiry <= 0) return;

    const timeout = setTimeout(() => {
      console.log("gecko streak expired — requesting fresh score state");
      getScoreState?.();

      // optional safety net for any query consumers still using the old key
      if (userId != null) {
        queryClient.invalidateQueries({
          queryKey: ["userGeckoScoreState", userId],
        });
      }
    }, msUntilExpiry);

    return () => clearTimeout(timeout);
  }, [getScoreState, queryClient, ss, userId]);

  const isAwake = useMemo(() => {
    if (!ss?.active_hours || !Array.isArray(ss.active_hours) || ss.active_hours.length === 0) {
      return true;
    }

    const currentHour = new Date().getHours();
    return ss.active_hours.includes(currentHour);
  }, [ss]);

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

      console.log(`readIds: ${current.length} / ${capsuleCount} in cache`);

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

        console.log(`readIds updated: ${updated.length} read, ${capsuleCount} total`);
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

  const initializedKey = useMemo(
    () => ["geckoHasInitialized", userId, friendId],
    [userId, friendId],
  );

  const { data: hasInitialized = false } = useQuery({
    queryKey: initializedKey,
    queryFn: () => false,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const markInitialized = useCallback(() => {
    queryClient.setQueryData(initializedKey, true);
  }, [initializedKey, queryClient]);

  const getReadIds = useCallback((): string[] => {
    return (queryClient.getQueryData(readKey) as string[] | undefined) ?? [];
  }, [queryClient, readKey]);

  const { scripts } = useGeckoVoice({
    personalityType: gecko?.personalityType,
    memoryType: gecko?.memoryType,
    storyType: gecko?.storyType,
  });

  return {
    gecko,
    updateReadIds,
    getReadIds,
    hasReadAll,
    hasInitialized,
    markInitialized,
    scripts,
    streakActive,
    isAwake,
  };
};

export default useGeckoSynthesizer_WS;