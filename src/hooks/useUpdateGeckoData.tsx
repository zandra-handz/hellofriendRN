// we are invalidating upcomingHelloes when friend added or removed with this line:
// queryClient.invalidateQueries(['upcomingHelloes']);

// also running updateAppSetup from api file in parent component that is creating a new friend
// based on if app_setup_complete is not already true for current user

import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showFlashMessage } from "../utils/ShowFlashMessage";
import { updateFriendGeckoData } from "@/src/calls/api";

type Props = {
  userId: number;
  friendId: number;
};

const useUpdateGeckoData = ({ userId, friendId }: Props) => {
  const queryClient = useQueryClient();

  const timeoutRef = useRef(null);

  const updateFriendGeckoMutation = useMutation({
    mutationFn: (data) => updateFriendGeckoData(data),
    onSuccess: (data) => {
       showFlashMessage(`Game saved!`, false, 1000)
      console.log("Friend gecko data updated successfully.", data);
      queryClient.setQueryData(
        ["friendDashboardData", userId, friendId],
        (old) => {
          if (!old) return old; // if cache is empty, just bail

          return {
            ...old,
            gecko_data: data, // <-- your new data
          };
        },
      );

      queryClient.refetchQueries({queryKey: ["userGeckoCombinedData"]})
      queryClient.refetchQueries({queryKey: ["friendGeckoSessions", userId, friendId]})
      queryClient.refetchQueries({queryKey: ["userGeckoPointsLedger"]})
       queryClient.refetchQueries({queryKey: ["userGeckoScoreState"]})
      
      queryClient.refetchQueries({queryKey: ["friendGeckoSessionsTimeRange", userId, friendId]})
    queryClient.refetchQueries({queryKey: ["userGeckoSessionsTimeRange"]})
       
      
      
      // if (refetchUpcoming) {
      //   refetchUpcoming();
      // }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        updateFriendGeckoMutation.reset();
      }, 2000);
    },
    onError: (error) => {
         showFlashMessage(`Game not saved`, false, 1000);
      // console.error("Error updating friend gecko data: ", error);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        updateFriendGeckoMutation.reset();
      }, 2000);
    },
  });

// const handleUpdateGeckoData = async ({ steps, distance, startedOn, endedOn, pointsEarnedList=[] }) => {
//  showFlashMessage(`Saving Gecko game...`, false, 1000)
 
//   const update = {
//     friend: friendId,
//     steps: steps,
//     distance: distance,
//     started_on: startedOn,
//     ended_on: endedOn,
//     points_earned: pointsEarnedList,


//                 //     [
//                 //   { "amount": 10, "reason": "some reason" },
//                 //   { "amount": 5 }
//                 // ]

//   };

  
//   // console.log("Payload in RQ function before sending:", update);

//   try {
//     await updateFriendGeckoMutation.mutateAsync(update);
//   } catch (error) {
//     console.error("Error updating gecko data in RQ function: ", error);
//   }
// };

//catching error in ScreenGecko instead, to work with the need to update without losing current game values/progress
const handleUpdateGeckoData = async ({
  steps,
  distance,
  startedOn,
  endedOn,
  pointsEarnedList = [],
}) => {
  showFlashMessage(`Saving Gecko game...`, false, 1000);

  const update = {
    friend: friendId,
    steps,
    distance,
    started_on: startedOn,
    ended_on: endedOn,
    points_earned: pointsEarnedList,
  };

  try {
    await updateFriendGeckoMutation.mutateAsync(update);
    return true; // necessary for the way this function is used in ScreenGecko
  } catch (error) {
    console.error("Error updating gecko data:", error);
    return false; // necessary
  }
};

  return { 
    handleUpdateGeckoData,
    updateFriendGeckoMutation,
  };
};

export default useUpdateGeckoData;
