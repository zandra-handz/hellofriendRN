import { View, Text } from "react-native";
import React, { useRef  } from "react";

import { useMutation } from "@tanstack/react-query";
 
import { signup } from "@/src/calls/api";
type Props = {
   signInNewUser: (args: { username: string; password: string }) => void;



};

//     onSignUp: (
//     username: string,
//     email: string,
//     password: string
//   ) => Promise<void>;

const useSignUp = ({ signInNewUser }: Props) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: async (result) => {
      // if (result.data) {
      //     await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);
      //     await reInitialize(); // Refetch user data after sign-up
      // }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        signupMutation.reset();
      }, 2000);
    },
    onError: () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        signupMutation.reset();
      }, 2000);
    },
  });

  const onSignUp = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      const credentials = { username, email, password };
      await signupMutation.mutateAsync(credentials);
      signInNewUser(username, password);
    } catch (error) {
      console.error("Sign up error", error);
    }
  };

  return {
    onSignUp,
    signupMutation,
  };
};

export default useSignUp;
