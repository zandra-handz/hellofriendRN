// import { fetchFriendGeckoSessionsTimeRange } from "../../calls/api";
// import useUser from "../useUser";
// import { useQuery } from "@tanstack/react-query";

// type Props = {
//   friendId: number;
//   minutes: number;
// };

// const useFriendGeckoSessionsTimeRange = ({ friendId, minutes }: Props) => {
//   const { user } = useUser();

//   const {
//     data: friendGeckoSessionsTimeRange,
//     isLoading: friendGeckoSessionsTimeRangeIsLoading,
//     isFetching: friendGeckoSessionsTimeRangeIsFetching,
//     isSuccess: friendGeckoSessionsTimeRangeIsSuccess,
//     isError: friendGeckoSessionsTimeRangeIsError,
//   } = useQuery({
//     queryKey: ["friendGeckoSessionsTimeRange", user?.id, friendId, minutes],
//     queryFn: async () => {
//       return await fetchFriendGeckoSessionsTimeRange({
//         friendId,
//         minutes,
//       });
//     },
//     enabled: !!(friendId && user?.id && minutes > 0),
//   });

//   return {
//     friendGeckoSessionsTimeRange: friendGeckoSessionsTimeRange ?? [],
//     friendGeckoSessionsTimeRangeIsLoading,
//     friendGeckoSessionsTimeRangeIsFetching,
//     friendGeckoSessionsTimeRangeIsSuccess,
//     friendGeckoSessionsTimeRangeIsError,
//   };
// };

// export default useFriendGeckoSessionsTimeRange;


import { fetchFriendGeckoSessionsTimeRange } from "../../calls/api";
import useUser from "../useUser";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

type GeckoSession = {
  id: number;
  steps: number;
  distance: number;
  started_on: string;
  ended_on: string;
};

type SessionTotals = {
  totalSteps: number;
  totalDistance: number;
  totalDurationSeconds: number;
  totalHours: number;
  sessionCount: number;
  stepsPerHour: number;
  distancePerHour: number;
};

const computeSessionTotals = (sessions: GeckoSession[]): SessionTotals => {
  let totalSteps = 0;
  let totalDistance = 0;
  let totalDurationSeconds = 0;

  for (const s of sessions) {
    totalSteps += s.steps;
    totalDistance += s.distance;
    const start = new Date(s.started_on).getTime();
    const end = new Date(s.ended_on).getTime();
    totalDurationSeconds += Math.max(0, (end - start) / 1000);
  }

  const totalHours = totalDurationSeconds / 3600;

  return {
    totalSteps,
    totalDistance,
    totalDurationSeconds: Math.round(totalDurationSeconds),
    totalHours: Math.round(totalHours * 100) / 100,
    sessionCount: sessions.length,
    stepsPerHour: totalHours > 0 ? Math.round((totalSteps / totalHours) * 10) / 10 : 0,
    distancePerHour: totalHours > 0 ? Math.round((totalDistance / totalHours) * 10) / 10 : 0,
  };
};

type Props = {
  friendId: number;
  minutes: number;
};

const useFriendGeckoSessionsTimeRange = ({ friendId, minutes }: Props) => {
  const { user } = useUser();

    const HARD_CODED_MINUTES = 720; //last 12 hours

  const {
    data: friendGeckoSessionsTimeRange,
    isLoading: friendGeckoSessionsTimeRangeIsLoading,
    isFetching: friendGeckoSessionsTimeRangeIsFetching,
    isSuccess: friendGeckoSessionsTimeRangeIsSuccess,
    isError: friendGeckoSessionsTimeRangeIsError,
  } = useQuery({
    queryKey: ["friendGeckoSessionsTimeRange", user?.id, friendId], // use minutes here only if querying different ranges
    queryFn: async () => {
      return await fetchFriendGeckoSessionsTimeRange({
        friendId,
        minutes,
      });
    },
    enabled: !!(friendId && user?.id &&  HARD_CODED_MINUTES  > 0),
  });

  const sessions: GeckoSession[] = friendGeckoSessionsTimeRange ?? [];

  const sessionTotals = useMemo(() => computeSessionTotals(sessions), [sessions]);

  return {
    friendGeckoSessionsTimeRange: sessions,
    sessionTotals,
    friendGeckoSessionsTimeRangeIsLoading,
    friendGeckoSessionsTimeRangeIsFetching,
    friendGeckoSessionsTimeRangeIsSuccess,
    friendGeckoSessionsTimeRangeIsError,
  };
};

export default useFriendGeckoSessionsTimeRange;