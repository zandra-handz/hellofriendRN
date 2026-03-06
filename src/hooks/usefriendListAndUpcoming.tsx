// import React, {  useMemo } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { fetchUpcomingHelloesAndFriends } from "@/src/calls/api";

// type Props = {
//   userId: number;
//   isInitializing?: boolean;

//   enabled: boolean;
// };

// const useFriendListAndUpcoming = ({
//   userId,
//   isInitializing = false,
//   enabled = true,
// }: Props) => {
//   const {
//     data: friendListAndUpcoming,
//     isLoading,
//     isFetching,
//     isSuccess,
//     isError,
//   } = useQuery({
//     queryKey: ["friendListAndUpcoming", userId], // keys: friends -- old friendList
//     //         upcoming -- old upcomingHelloes
//     queryFn: () => fetchUpcomingHelloesAndFriends(),
//     enabled: !!userId && !isInitializing, //removed isInitializing to test
//     retry: 4,
//     staleTime: 1000 * 60 * 60 * 1, // 1 hr //need time check?
//     // staleTime: 1000 * 60 * 240, // minutes

//     // use useUpNextCache in tandem to set query cache, will not cause this component to rerender unless it it setting something different
 
//     select: (data) => {
//       if (isError) return [];

//       let nextFriend = null;
//       let upcomingWithSummaries = []; 

//       // find next upcoming friend
//       if (data.upcoming?.length && data.friends?.length) {
//         nextFriend = data.friends.find(
//           (friend) => Number(friend.id) === Number(data.upcoming[0]?.friend?.id)
//         );
//       }

   
//       // find next upcoming friend
//       if (data.upcoming?.length && data.friends?.length && data.capsule_summaries?.length) {
//         // console.log(`CAPSULE SUMMMMMSSSSS`,data?.capsule_summaries)
//         const capsuleMap = {};

//         data.capsule_summaries.forEach(cs => {
//           capsuleMap[cs.id] = cs;
//         })

//          upcomingWithSummaries = data.upcoming.map(upcoming => {
//           const friendId = upcoming.friend.id;
//           const capsuleSummary = capsuleMap[friendId] || null;

//           return {
//             ...upcoming, 
//             capsule_summary: capsuleSummary?.capsule_summary || [],
//             capsule_count: capsuleSummary?.capsule_count || 0
//           };
//         })


//         // console.log(data.capsule_summary)

//         // console.log(`capsule map`, data.capsule_summary)
        
//       }

//       // alphabetize friends list
//       const locale = "en"; // or whatever you need
//       const sortedFriends =
//         data.friends
//           ?.slice()
//           .sort((a, b) =>
//             a.name.localeCompare(b.name, locale, { sensitivity: "case" })
//           ) || [];

 
//       return {
//         ...data,
//          upcoming: upcomingWithSummaries,
//         friends: sortedFriends,
//         next: nextFriend,
//       };
//     },
//   });

//   //     select: (data) => {
//   //       if (isError) {
//   //         return [];
//   //       }

//   //       if (data.upcoming?.length && data.friends?.length) {
//   //         let upcomingFriend;
//   //         upcomingFriend = data.friends.find(
//   //           (friend) => Number(friend.id) === Number(data.upcoming[0]?.friend?.id)
//   //         );
//   //         data.next = upcomingFriend;
//   //         console.log(`user in friend listr`, data?.user);
//   //       }
//   //       return data || [];
//   //     },
//   //   });

//   //   useEffect(() => {
//   //     if (isError) {
//   //       onSignOut();
//   //     }
//   //   }, [isError]);

//   const upNext = useMemo(() => {
//     return friendListAndUpcoming?.next; // not sure if this is ready to go yet
//   }, [friendListAndUpcoming]);

//   return {
//     friendListAndUpcoming,
//     friendListAndUpcomingIsFetching: isFetching,
//     friendListAndUpcomingIsSuccess: isSuccess,
//     upNext,
//     isLoading,
//   };
// };

// export default useFriendListAndUpcoming;


import React, { useMemo } from "react";
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
    queryKey: ["friendListAndUpcoming", userId],
    queryFn: () => fetchUpcomingHelloesAndFriends(),
    enabled: !!userId && !isInitializing,
    retry: 4,
    staleTime: 1000 * 60 * 60 * 1,

    select: (data) => {
      if (isError) return [];

      let nextFriend = null;
      let upcomingWithSummaries = [];

      if (data.upcoming?.length && data.friends?.length) {
        nextFriend = data.friends.find(
          (friend) => Number(friend.id) === Number(data.upcoming[0]?.friend?.id)
        );
      }

      // Build upcoming date map: friendId -> future_date_in_words
      const upcomingDateMap: Record<number, string | null> = {};
      if (data.upcoming?.length) {
        data.upcoming.forEach((upcoming) => {
          upcomingDateMap[upcoming.friend.id] = upcoming.future_date_in_words ?? null;
        });
      }

      if (data.upcoming?.length && data.friends?.length && data.capsule_summaries?.length) {
        const capsuleMap = {};
        data.capsule_summaries.forEach((cs) => {
          capsuleMap[cs.id] = cs;
        });

        upcomingWithSummaries = data.upcoming.map((upcoming) => {
          const friendId = upcoming.friend.id;
          const capsuleSummary = capsuleMap[friendId] || null;
          return {
            ...upcoming,
            capsule_summary: capsuleSummary?.capsule_summary || [],
            capsule_count: capsuleSummary?.capsule_count || 0,
          };
        });
      }

      const locale = "en";
      const sortedFriends =
        data.friends
          ?.slice()
          .sort((a, b) =>
            a.name.localeCompare(b.name, locale, { sensitivity: "case" })
          )
          // Join future_date_in_words onto each friend
          .map((friend) => ({
            ...friend,
            future_date_in_words: upcomingDateMap[friend.id] ?? null,
          })) || [];

      return {
        ...data,
        upcoming: upcomingWithSummaries,
        friends: sortedFriends,
        next: nextFriend,
      };
    },
  });

  const upNext = useMemo(() => {
    return friendListAndUpcoming?.next;
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