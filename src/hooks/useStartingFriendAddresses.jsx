import React, { useEffect, useRef, useState } from "react";
import { useSelectedFriend } from "../context/SelectedFriendContext";
import { useUser } from "../context/UserContext";
import {
  
  fetchFriendAddresses, 
} from "@/src/calls/api";

import { useQuery, useQueryClient  } from "@tanstack/react-query";

// type Props = {
//   userId: number;
//   friendId: number;

// };

const useStartingFriendAddresses = ({userId, friendId}) => {
 
 const queryClient = useQueryClient();
  const [defaultAddress, setDefaultAddress] = useState(null);

  console.warn('STARTING ADDRESSES');

  const {
    data: friendAddresses = [],
    // isLoading,
    // isFetching,
    // isSuccess,
    // isError,
  } = useQuery({
    queryKey: ["friendAddresses", userId, friendId],
    queryFn: () => fetchFriendAddresses(friendId),
    enabled: !!(userId && friendId), //adding isInitializing will cause an infinite regression prop bc of something else in the code here
    staleTime: 1000 * 60 * 20, // 20 minutes
  });
 
// const { data: friendAddresses = { saved: [], temp: [], chosen: null } } = useQuery({
//   queryKey: ["friendAddresses", userId, friendId],
//   queryFn: () => fetchFriendAddresses(friendId),
//   select: (data, oldData) => ({
//     saved: data,
//     temp: oldData?.temp || [],      // keep existing temp
//     chosen: oldData?.chosen || null // keep existing chosen
//   }),
//   enabled: !!(userId && friendId),
//   staleTime: 1000 * 60 * 20,
// });

  // useEffect(() => {
  //   if (friendAddresses && friendAddresses.length > 0) {
  //     setDefaultAddress(
  //       friendAddresses.find((address) => address.is_default === true) ||
  //         (friendAddresses.length > 0 ? friendAddresses[0] : null)
  //     );
  //   }
  // }, [friendAddresses]);

 
 
  return {
    friendAddresses, 
    defaultAddress,  
 
  };
};

export default useStartingFriendAddresses;
