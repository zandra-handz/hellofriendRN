// import React, { useState, useCallback, useMemo, useEffect } from "react";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { isoDateTimeToWeekdayMonthDay, getAgeFromDate } from "@/src/utils/dateUtils";
// import useGeckoVoice from "@/src/hooks/useGeckoVoice";

// const useGeckoSynthesizer = ({
//   userId,
//   geckoCombinedData,
//   geckoConfigs,
//   sessionTotals,
//   friendId,
//   userSessionTotals,
//   capsuleCount,
// }) => {
//   const queryClient = useQueryClient();

//   const gecko = useMemo(() => {
//     if (!sessionTotals || !userSessionTotals || !geckoCombinedData || !geckoConfigs) {
//       return null;
//     }

//     const birthday = isoDateTimeToWeekdayMonthDay(geckoConfigs.created_on, { alwaysShowYear: true });
//     const age = getAgeFromDate(geckoConfigs.created_on); 

//     const lifetimeDistance = geckoCombinedData.total_distance;
//     const lifetimeSteps = geckoCombinedData.total_steps;

//     const recentDistance = userSessionTotals.total_distance;
//     const recentSteps = userSessionTotals.total_steps;
//     // speed, enthusiasm, points

//     const memoryType = geckoConfigs.memory_type;
//     const memoryTypeLabel = geckoConfigs.memory_type_label;

//     const personalityType = geckoConfigs.personality_type;
//     const personalityTypeLabel = geckoConfigs.personality_type_label;
//     // moments pick up pattern 

//     const activeHoursType = geckoConfigs.active_hours_type;
//     const activeHoursTypeLabel = geckoConfigs.active_hours_type_label;
//     // speed and verboseness. maybe sometimes the gecko is truly asleep

//     const storyType = geckoConfigs.story_type;
//     const storyTypeLabel = geckoConfigs.story_type_label;
//     // types of messages, overall 'mission' of the gecko, has little effect on speed or pattern
//     // but does influence types of points the user gets

//     return {
//       birthday,
//       age,
//       lifetimeDistance,
//       lifetimeSteps,
//       recentDistance,
//       recentSteps,
//       memoryType,
//       memoryTypeLabel,
//       personalityType,
//       personalityTypeLabel,
//       activeHoursType,
//       activeHoursTypeLabel,
//       storyType,
//       storyTypeLabel
//     };
//   }, [geckoCombinedData, geckoConfigs, userSessionTotals, sessionTotals]);

//   const HISTORY_SIZE = 20;

//   type HistoryEntry = {
//     id: string | number;
//     category: string;
//     capsule: string;
//   };

//   const readKey = ["geckoReadIds", userId ?? "anon", friendId];
//   const readAllKey = ["geckoHasReadAll", userId ?? "anon", friendId];

//   const { data: readIds = [] } = useQuery({
//     queryKey: readKey,
//     queryFn: () => queryClient.getQueryData(readKey) ?? [],
//     staleTime: Infinity,
//     gcTime: Infinity,
//     initialData: () => queryClient.getQueryData(readKey) ?? [],
//   });

//   const updateReadIds = useCallback(
//     (newIds: string[]) => {
//       queryClient.setQueryData(readKey, (prev: string[] = []) => {
//         const existing = new Set(prev);
//         const unique = newIds.filter((id) => !existing.has(id));
//         if (unique.length === 0) return prev;

//         const updated = [...prev, ...unique];

//         const nextHasReadAll = capsuleCount > 0 && updated.length >= capsuleCount;
//         queryClient.setQueryData(readAllKey, nextHasReadAll);

//         return updated;
//       });
//     },
//     [queryClient, readKey, readAllKey, capsuleCount]
//   );

//   const computedHasReadAll = capsuleCount > 0 && readIds.length >= capsuleCount;

//   const { data: hasReadAll = false } = useQuery({
//     queryKey: readAllKey,
//     queryFn: () => queryClient.getQueryData(readAllKey) ?? false,
//     staleTime: Infinity,
//     gcTime: Infinity,
//     initialData: () => {
//       const cached = queryClient.getQueryData(readAllKey);
//       return typeof cached === "boolean" ? cached : computedHasReadAll;
//     },
//   });

//   useEffect(() => {
//     queryClient.setQueryData(readAllKey, computedHasReadAll);
//   }, [queryClient, readAllKey, computedHasReadAll]);

//   const historyKey = ["geckoMomentHistory", userId ?? "anon", friendId];

//   const { data: momentHistory = [] } = useQuery<HistoryEntry[]>({
//     queryKey: historyKey,
//     queryFn: () => queryClient.getQueryData(historyKey) ?? [],
//     staleTime: Infinity,
//     gcTime: Infinity,
//     initialData: () => queryClient.getQueryData(historyKey) ?? [],
//   });

//   const addToHistory = useCallback(
//     (entry: HistoryEntry) => {
//       queryClient.setQueryData(historyKey, (prev: HistoryEntry[] = []) => {
//         const updated = [...prev, entry];
//         if (updated.length > HISTORY_SIZE) return updated.slice(-HISTORY_SIZE);
//         return updated;
//       });
//     },
//     [queryClient, historyKey]
//   );

//   const { scripts } = useGeckoVoice({
//     personalityType: gecko?.personalityType,
//     memoryType: gecko?.memoryType,
//     storyType: gecko?.storyType,
//   });

//   // ── geckoCombinedData ──
//   // {
//   //   total_distance: 3107,
//   //   total_duration: 58532,
//   //   total_steps: 357910,
//   //   updated_on: "2026-03-24T00:00:04.844030Z"
//   // }

//   // ── geckoConfigs ──
//   // {
//   //   active_hours_type: 1,
//   //   active_hours_type_label: "Day",
//   //   available_choices: {
//   //     active_hours_types: [...],
//   //     memory_types: [...],
//   //     personality_types: [...],
//   //     story_types: [...]
//   //   },
//   //   created_on: "2026-03-28T16:55:38.014345Z",
//   //   memory_type: 3,
//   //   memory_type_label: "Remember Many",
//   //   personality_type: 3,
//   //   personality_type_label: "Brave",
//   //   story_type: 1,
//   //   story_type_label: "Learner",
//   //   updated_on: "2026-03-29T18:28:22.515405Z"
//   // }

//   // ── sessionTotals (friend, from frontend computeSessionTotals) ──
//   // {
//   //   distancePerHour: 679.1,
//   //   sessionCount: 3,
//   //   stepsPerHour: 54738.5,
//   //   totalDistance: 137,
//   //   totalDurationSeconds: 726,
//   //   totalHours: 0.2,
//   //   totalSteps: 11042
//   // }

//   // ── userSessionTotals (from backend) ──
//   // {
//   //   distance_per_hour: 550.1,
//   //   session_count: 32,
//   //   steps_per_hour: 68768.4,
//   //   total_distance: 610,
//   //   total_duration_seconds: 3991,
//   //   total_hours: 1.11,
//   //   total_steps: 76256
//   // }

//   // ── user sessions (example, from paginated endpoint) ──
//   // {
//   //   count: 32,
//   //   next: "https://badrainbowz.com/users/gecko/sessions/range/?minutes=720&page=2",
//   //   previous: null,
//   //   results: [
//   //     { distance: 4, ended_on: "2026-03-29T22:47:00.046000Z", friend: 153, id: 202, started_on: "2026-03-29T22:46:42.569000Z", steps: 274 },
//   //     { distance: 1, ended_on: "2026-03-29T22:44:33.923000Z", friend: 153, id: 201, started_on: "2026-03-29T22:44:31.215000Z", steps: 20 },
//   //     { distance: 3, ended_on: "2026-03-29T22:42:48.946000Z", friend: 99, id: 200, started_on: "2026-03-29T22:42:45.328000Z", steps: 61 },
//   //     { distance: 3, ended_on: "2026-03-29T22:41:56.931000Z", friend: 154, id: 199, started_on: "2026-03-29T22:41:45.815000Z", steps: 563 },
//   //     { distance: 4, ended_on: "2026-03-29T22:15:15.970000Z", friend: 89, id: 198, started_on: "2026-03-29T22:15:08.827000Z", steps: 83 },
//   //     { distance: 3, ended_on: "2026-03-29T22:13:25.065000Z", friend: 153, id: 197, started_on: "2026-03-29T22:13:14.229000Z", steps: 418 },
//   //     { distance: 1, ended_on: "2026-03-29T21:29:47.410000Z", friend: 89, id: 196, started_on: "2026-03-29T21:29:43.569000Z", steps: 20 },
//   //     { distance: 13, ended_on: "2026-03-29T21:20:18.967000Z", friend: 99, id: 195, started_on: "2026-03-29T21:20:01.649000Z", steps: 414 },
//   //     { distance: 1, ended_on: "2026-03-29T19:38:51.687000Z", friend: null, id: 194, started_on: "2026-03-29T19:38:46.063000Z", steps: 20 },
//   //     { distance: 19, ended_on: "2026-03-29T18:29:37.116000Z", friend: null, id: 193, started_on: "2026-03-29T18:28:35.575000Z", steps: 1005 },
//   //   ],
//   //   totals: {
//   //     distance_per_hour: 550.1,
//   //     session_count: 32,
//   //     steps_per_hour: 68768.4,
//   //     total_distance: 610,
//   //     total_duration_seconds: 3991,
//   //     total_hours: 1.11,
//   //     total_steps: 76256
//   //   }
//   // }

//   // ── friend sessions (example, unpaginated) ──
//   // [
//   //   { distance: 23, ended_on: "2026-03-29T18:28:00.824000Z", friend: 99, id: 192, started_on: "2026-03-29T18:22:57.998000Z", steps: 4141, user: 2 },
//   //   { distance: 46, ended_on: "2026-03-29T18:22:56.446000Z", friend: 99, id: 191, started_on: "2026-03-29T18:18:57.345000Z", steps: 3746, user: 2 },
//   //   { distance: 68, ended_on: "2026-03-29T18:15:51.572000Z", friend: 99, id: 190, started_on: "2026-03-29T18:12:47.297000Z", steps: 3155, user: 2 },
//   // ]

//   return {
//     gecko,
//     readIds,
//     updateReadIds,
//     hasReadAll,
//     scripts,
//     momentHistory,
//     addToHistory,
//   };
// };

// export default useGeckoSynthesizer;


import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { isoDateTimeToWeekdayMonthDay, getAgeFromDate } from "@/src/utils/dateUtils";
import useGeckoVoice from "@/src/hooks/useGeckoVoice";
import { showFlashMessage } from "../utils/ShowFlashMessage";

const useGeckoSynthesizer = ({
  userId,
  geckoCombinedData,
  geckoConfigs,
  geckoScoreState,
  sessionTotals,
  friendId,
  userSessionTotals,
  capsuleCount,
}) => {
  const queryClient = useQueryClient();

  const gecko = useMemo(() => {
    if (!sessionTotals || !userSessionTotals || !geckoScoreState || !geckoCombinedData || !geckoConfigs) {
      return null;
    }

    console.log(`gecko score state`, geckoScoreState);

    const birthday = isoDateTimeToWeekdayMonthDay(geckoConfigs.created_on, { alwaysShowYear: true });
    const age = getAgeFromDate(geckoConfigs.created_on); 

    const lifetimeDistance = geckoCombinedData.total_distance;
    const lifetimeSteps = geckoCombinedData.total_steps;

    const recentDistance = userSessionTotals.total_distance;
    const recentSteps = userSessionTotals.total_steps;
    // speed, enthusiasm, points

    const memoryType = geckoConfigs.memory_type;
    const memoryTypeLabel = geckoConfigs.memory_type_label;

    const personalityType = geckoConfigs.personality_type;
    const personalityTypeLabel = geckoConfigs.personality_type_label;
    // moments pick up pattern 

    const activeHoursType = geckoConfigs.active_hours_type;
    const activeHoursTypeLabel = geckoConfigs.active_hours_type_label;
    // speed and verboseness. maybe sometimes the gecko is truly asleep

    const storyType = geckoConfigs.story_type;
    const storyTypeLabel = geckoConfigs.story_type_label;

    const scoreBaseMultiplier = geckoScoreState.base_multiplier;
    const scoreMultiplier = geckoScoreState.multiplier;
    

    // types of messages, overall 'mission' of the gecko, has little effect on speed or pattern
    // but does influence types of points the user gets

    return {
      birthday,
      age,
      lifetimeDistance,
      lifetimeSteps,
      recentDistance,
      recentSteps,
      memoryType,
      memoryTypeLabel,
      personalityType,
      personalityTypeLabel,
      activeHoursType,
      activeHoursTypeLabel,
      storyType,
      storyTypeLabel,
      scoreBaseMultiplier,
      scoreMultiplier
    };
  }, [geckoCombinedData, geckoConfigs, userSessionTotals, sessionTotals]);

  const streakActive = useMemo(() => {
    if (!geckoScoreState?.expires_at) return false;
    if (geckoScoreState.multiplier <= geckoScoreState.base_multiplier) return false;
    return new Date(geckoScoreState.expires_at).getTime() > Date.now();
  }, [geckoScoreState?.expires_at, geckoScoreState?.multiplier, geckoScoreState?.base_multiplier]);

  useEffect(() => {
    if (!streakActive || !geckoScoreState?.expires_at) return;


    showFlashMessage(`Streak achieved!`, false, 2000);
    const msUntilExpiry =
      new Date(geckoScoreState.expires_at).getTime() - Date.now();
    if (msUntilExpiry <= 0) return;

    const timeout = setTimeout(() => {
      console.log("gecko streak expired — refetching score state");
      queryClient.invalidateQueries({
        queryKey: ["userGeckoScoreState", userId],
      });
    }, msUntilExpiry);

    return () => clearTimeout(timeout);
  }, [streakActive, geckoScoreState?.expires_at, queryClient, userId]);

  const readKey = useMemo(
    () => ["geckoReadIds", userId, friendId],
    [userId, friendId]
  );

  const readAllKey = useMemo(
    () => ["geckoHasReadAll", userId, friendId],
    [userId, friendId]
  );

  // const { data: readIds = [] } = useQuery({
  //   queryKey: readKey,
  //   queryFn: () => [],
  //   staleTime: Infinity,
  //   gcTime: Infinity,
  // });

  const updateReadIds = useCallback(
    (newIds: string[]) => {
      const t = performance.now();
      const current = (queryClient.getQueryData(readKey) as string[] | undefined) ?? [];
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
      console.log(`setQueryData took ${(performance.now() - t).toFixed(2)}ms`);
    },
    [queryClient, readKey, readAllKey, capsuleCount]
  );

  const { data: hasReadAll = false } = useQuery({
    queryKey: readAllKey,
    queryFn: () => false,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const initializedKey = useMemo(
    () => ["geckoHasInitialized", userId, friendId],
    [userId, friendId]
  );

  const { data: hasInitialized = false } = useQuery({
    queryKey: initializedKey,
    queryFn: () => false,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const markInitialized = useCallback(() => {
    queryClient.setQueryData(initializedKey, true);
  }, [queryClient, initializedKey]);

  const getReadIds = useCallback((): string[] => {
    return (queryClient.getQueryData(readKey) as string[] | undefined) ?? [];
  }, [queryClient, readKey]);

  const { scripts } = useGeckoVoice({
    personalityType: gecko?.personalityType,
    memoryType: gecko?.memoryType,
    storyType: gecko?.storyType,
  });

  // ── geckoCombinedData ──
  // {
  //   total_distance: 3107,
  //   total_duration: 58532,
  //   total_steps: 357910,
  //   updated_on: "2026-03-24T00:00:04.844030Z"
  // }

  // ── geckoConfigs ──
  // {
  //   active_hours_type: 1,
  //   active_hours_type_label: "Day",
  //   available_choices: {
  //     active_hours_types: [...],
  //     memory_types: [...],
  //     personality_types: [...],
  //     story_types: [...]
  //   },
  //   created_on: "2026-03-28T16:55:38.014345Z",
  //   memory_type: 3,
  //   memory_type_label: "Remember Many",
  //   personality_type: 3,
  //   personality_type_label: "Brave",
  //   story_type: 1,
  //   story_type_label: "Learner",
  //   updated_on: "2026-03-29T18:28:22.515405Z"
  // }

  // ── sessionTotals (friend, from frontend computeSessionTotals) ──
  // {
  //   distancePerHour: 679.1,
  //   sessionCount: 3,
  //   stepsPerHour: 54738.5,
  //   totalDistance: 137,
  //   totalDurationSeconds: 726,
  //   totalHours: 0.2,
  //   totalSteps: 11042
  // }

  // ── userSessionTotals (from backend) ──
  // {
  //   distance_per_hour: 550.1,
  //   session_count: 32,
  //   steps_per_hour: 68768.4,
  //   total_distance: 610,
  //   total_duration_seconds: 3991,
  //   total_hours: 1.11,
  //   total_steps: 76256
  // }

  // ── user sessions (example, from paginated endpoint) ──
  // {
  //   count: 32,
  //   next: "https://badrainbowz.com/users/gecko/sessions/range/?minutes=720&page=2",
  //   previous: null,
  //   results: [
  //     { distance: 4, ended_on: "2026-03-29T22:47:00.046000Z", friend: 153, id: 202, started_on: "2026-03-29T22:46:42.569000Z", steps: 274 },
  //     { distance: 1, ended_on: "2026-03-29T22:44:33.923000Z", friend: 153, id: 201, started_on: "2026-03-29T22:44:31.215000Z", steps: 20 },
  //     { distance: 3, ended_on: "2026-03-29T22:42:48.946000Z", friend: 99, id: 200, started_on: "2026-03-29T22:42:45.328000Z", steps: 61 },
  //     { distance: 3, ended_on: "2026-03-29T22:41:56.931000Z", friend: 154, id: 199, started_on: "2026-03-29T22:41:45.815000Z", steps: 563 },
  //     { distance: 4, ended_on: "2026-03-29T22:15:15.970000Z", friend: 89, id: 198, started_on: "2026-03-29T22:15:08.827000Z", steps: 83 },
  //     { distance: 3, ended_on: "2026-03-29T22:13:25.065000Z", friend: 153, id: 197, started_on: "2026-03-29T22:13:14.229000Z", steps: 418 },
  //     { distance: 1, ended_on: "2026-03-29T21:29:47.410000Z", friend: 89, id: 196, started_on: "2026-03-29T21:29:43.569000Z", steps: 20 },
  //     { distance: 13, ended_on: "2026-03-29T21:20:18.967000Z", friend: 99, id: 195, started_on: "2026-03-29T21:20:01.649000Z", steps: 414 },
  //     { distance: 1, ended_on: "2026-03-29T19:38:51.687000Z", friend: null, id: 194, started_on: "2026-03-29T19:38:46.063000Z", steps: 20 },
  //     { distance: 19, ended_on: "2026-03-29T18:29:37.116000Z", friend: null, id: 193, started_on: "2026-03-29T18:28:35.575000Z", steps: 1005 },
  //   ],
  //   totals: {
  //     distance_per_hour: 550.1,
  //     session_count: 32,
  //     steps_per_hour: 68768.4,
  //     total_distance: 610,
  //     total_duration_seconds: 3991,
  //     total_hours: 1.11,
  //     total_steps: 76256
  //   }
  // }

  // ── friend sessions (example, unpaginated) ──
  // [
  //   { distance: 23, ended_on: "2026-03-29T18:28:00.824000Z", friend: 99, id: 192, started_on: "2026-03-29T18:22:57.998000Z", steps: 4141, user: 2 },
  //   { distance: 46, ended_on: "2026-03-29T18:22:56.446000Z", friend: 99, id: 191, started_on: "2026-03-29T18:18:57.345000Z", steps: 3746, user: 2 },
  //   { distance: 68, ended_on: "2026-03-29T18:15:51.572000Z", friend: 99, id: 190, started_on: "2026-03-29T18:12:47.297000Z", steps: 3155, user: 2 },
  // ]

  return {
    gecko,
    updateReadIds,
    getReadIds,
    hasReadAll,
    hasInitialized,
    markInitialized,
    scripts,
    streakActive,
  };
};

export default useGeckoSynthesizer;