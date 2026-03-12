import { View, Text } from 'react-native'
import React from 'react'
 
import { signout } from '@/src/calls/api';

import {  useQueryClient  } from "@tanstack/react-query";

import { useAuthActions } from '@/src/context/AuthActionsContext';
// const useSignOut = ( ) => { 
//    const queryClient = useQueryClient();


//       const onSignOut = async () => {
//         await signout(); 
    
//         queryClient.resetQueries(["currentUser"], {
//           exact: true,
//           refetchActive: false,
//         });
    
//         queryClient.removeQueries({ exact: false }); // removes all queries
//         queryClient.cancelQueries(); // cancel inflight queries
//         //   queryClient.clear();
//       };
//   return {
//     onSignOut
//   }
// }

const useSignOut = () => {
  const { onSignOut } = useAuthActions();
  return { onSignOut };
};

export default useSignOut;