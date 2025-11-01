import React, { createContext, useContext, useEffect, useMemo } from "react";
import { useUser } from "./UserContext";
import { fetchUpcomingHelloesAndFriends } from "../calls/api";
import { useQuery } from "@tanstack/react-query";

import useSignOut from "../hooks/UserCalls/useSignOut";

// remix helloes is in a separate hook
const FriendListAndUpcomingContext = createContext({});

export const useFriendListAndUpcoming = () => {
  return useContext(FriendListAndUpcomingContext);
};

//IMPORTANT!  use useUpNextCache in tandem to set up next query cache
// might not have needed to make it detachable, if this turns out to be the case, can put it in here if doesn't add renders
export const FriendListAndUpcomingProvider = ({ children }) => {
  const { user, isInitializing } = useUser();
  const { onSignOut } = useSignOut();

  const {
    data: friendListAndUpcoming,
    isLoading,
    isFetching,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ["friendListAndUpcoming", user?.id], // keys: friends -- old friendList
    //         upcoming -- old upcomingHelloes
    queryFn: () => fetchUpcomingHelloesAndFriends(),
    enabled: !!user?.id && !isInitializing, //removed isInitializing to test
    retry: 4,
    staleTime: 1000 * 60 * 20, // 20 minutes

    // use useUpNextCache in tandem to set query cache, will not cause this component to rerender unless it it setting something different
    select: (data) => {
      if (isError) return [];

      let nextFriend = null;
      let upcomingWithSummaries = []; 

      // find next upcoming friend
      if (data.upcoming?.length && data.friends?.length) {
        nextFriend = data.friends.find(
          (friend) => Number(friend.id) === Number(data.upcoming[0]?.friend?.id)
        );
      }

   
      // find next upcoming friend
      if (data.upcoming?.length && data.friends?.length && data.capsule_summaries?.length) {
        const capsuleMap = {};

        data.capsule_summaries.forEach(cs => {
          capsuleMap[cs.id] = cs;
        })

         upcomingWithSummaries = data.upcoming.map(upcoming => {
          const friendId = upcoming.friend.id;
          const capsuleSummary = capsuleMap[friendId] || null;

          return {
            ...upcoming, 
            capsule_summary: capsuleSummary?.capsule_summary || [],
            capsule_count: capsuleSummary?.capsule_count || 0
          };
        })


        // console.log(data.upcoming)

        // console.log(`capsule map`, upcomingWithSummaries)
        
      }

      // alphabetize friends list
      const locale = "en"; // or whatever you need
      const sortedFriends =
        data.friends
          ?.slice()
          .sort((a, b) =>
            a.name.localeCompare(b.name, locale, { sensitivity: "case" })
          ) || [];

 
      return {
        ...data,
         upcoming: upcomingWithSummaries,
        friends: sortedFriends,
        next: nextFriend,
      };
    },
  });

  // DONT DELETE, THIS IS FOR SETTING THE CACHE FOR NEXT IN CONTEXT IF WANT TO DOWN THE LINE
  //     useEffect(() => {
  //   if (isSuccess && data?.upcoming?.length && data?.friends?.length) {
  //     const upcomingFriend = data.friends.find(
  //       (friend) => Number(friend.id) === Number(data.upcoming[0]?.friend?.id)
  //     );

  //     queryClient.setQueryData(["upcoming-friends", user?.id], (old) => ({
  //       ...old,
  //       next: upcomingFriend,
  //     }));
  //   }
  // }, [isSuccess, data, queryClient, user?.id]);

  // useEffect(() => {
  //   if (isError) {
  //     onSignOut();
  //   }
  // }, [isError]);

  const upNext = useMemo(() => {
    return friendListAndUpcoming?.next; // not sure if this is ready to go yet
  }, [friendListAndUpcoming]);

  const contextValue = useMemo(
    () => ({
      friendListAndUpcoming,
      friendListAndUpcomingIsFetching: isFetching,
      friendListAndUpcomingIsSuccess: isSuccess,
      upNext,

      isLoading,
    }),
    [friendListAndUpcoming, upNext, isFetching, isSuccess, isLoading]
  );

  return (
    <FriendListAndUpcomingContext.Provider value={contextValue}>
      {children}
    </FriendListAndUpcomingContext.Provider>
  );
};
