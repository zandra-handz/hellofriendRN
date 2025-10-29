import React, { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUpcomingHelloesAndFriends } from "@/src/calls/api";

type Props = {
  userId: number;
  isInitializing?: boolean;

  enabled: boolean;
};

const useFriendListAndUpcoming = ({
  userId,
  isInitializing = false,
  enabled = true,
}: Props) => {
  const {
    data: friendListAndUpcoming,
    isLoading,
    isFetching,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ["friendListAndUpcoming", userId], // keys: friends -- old friendList
    //         upcoming -- old upcomingHelloes
    queryFn: () => fetchUpcomingHelloesAndFriends(),
    enabled: !!userId && !isInitializing, //removed isInitializing to test
    retry: 4,
    staleTime: 1000 * 60 * 20, // 20 minutes

    // use useUpNextCache in tandem to set query cache, will not cause this component to rerender unless it it setting something different
    staleTime: 1000 * 60 * 20, // 20 minutes
    select: (data) => {
      if (isError) return [];

      let nextFriend = null;

      // find next upcoming friend
      if (data.upcoming?.length && data.friends?.length) {
        nextFriend = data.friends.find(
          (friend) => Number(friend.id) === Number(data.upcoming[0]?.friend?.id)
        );
      }

      // alphabetize friends list
      const locale = "en"; // or whatever you need
      const sortedFriends =
        data.friends
          ?.slice()
          .sort((a, b) =>
            a.name.localeCompare(b.name, locale, { sensitivity: "case" })
          ) || [];

      // return new object, immutable
      return {
        ...data,
        friends: sortedFriends,
        next: nextFriend,
      };
    },
  });

  //     select: (data) => {
  //       if (isError) {
  //         return [];
  //       }

  //       if (data.upcoming?.length && data.friends?.length) {
  //         let upcomingFriend;
  //         upcomingFriend = data.friends.find(
  //           (friend) => Number(friend.id) === Number(data.upcoming[0]?.friend?.id)
  //         );
  //         data.next = upcomingFriend;
  //         console.log(`user in friend listr`, data?.user);
  //       }
  //       return data || [];
  //     },
  //   });

  //   useEffect(() => {
  //     if (isError) {
  //       onSignOut();
  //     }
  //   }, [isError]);

  const upNext = useMemo(() => {
    return friendListAndUpcoming?.next; // not sure if this is ready to go yet
  }, [friendListAndUpcoming]);

  return {
    friendListAndUpcoming,
    friendListAndUpcomingIsFetching: isFetching,
    friendListAndUpcomingIsSuccess: isSuccess,
    upNext,

    isLoading,
  };
};

export default useFriendListAndUpcoming;
