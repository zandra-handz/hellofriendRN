import { View, Text } from "react-native";
import React, { useEffect, useRef, useCallback } from "react";

import { useMutation } from "@tanstack/react-query";
 
import { signinWithoutRefresh } from "@/src/calls/api";
type Props = {
  refetchUser: () => void;
};

const useSignIn = ({ refetchUser }: Props) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

 

  const signinMutation = useMutation({
    mutationFn: signinWithoutRefresh,
    onSuccess: () => {
     refetchUser();
  

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        signinMutation.reset();
      }, 2000);
    },
    onError: (error) => {
      console.error("Sign in mutation error:", error);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        signinMutation.reset();
      }, 2000);
    },
  });

  const onSignIn = useCallback((username: string, password: string) => {

    console.log('signing in!')
  signinMutation.mutate({ username, password }, {
    onError: (error) => {
      console.error("Sign in error", error);
    }
  });
}, [signinMutation]);


 

  // const onSignIn = useCallback(
  //   async (username: string, password: string) => {
  //     try {
  //       await signinMutation.mutateAsync({ username, password });
  //     } catch (error) {
  //       console.error("Sign in error", error);
  //     }
  //   },
  //   [signinMutation]
  // );
  return {
    onSignIn,
    signinMutation,
  };
};

export default useSignIn;
