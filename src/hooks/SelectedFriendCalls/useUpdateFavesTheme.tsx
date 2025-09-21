import { View, Text } from "react-native";
import React, { useRef } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { FriendDashboardData } from "@/src/types/FriendTypes";

import { updateFriendFavesColorThemeSetting } from "@/src/calls/api";

interface ColorThemeUpdateProps {
  savedDarkColor: string;
  savedLightColor: string;
  manualThemeOn: boolean;
}

interface ColorThemeUpdateLoad {
  userId: number;
  friendId: number;

  darkColor: string;
  lightColor: string;
  manualTheme: boolean;
}

type Props = {
  userId: number;
  friendId: number;
};

const useUpdateFaveTheme = ({ userId, friendId }: Props) => {
  const queryClient = useQueryClient();

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
 
 
 
   const updateFavesThemeMutation = useMutation({
     mutationFn: (data: ColorThemeUpdateLoad) =>
       updateFriendFavesColorThemeSetting(data),
 
     // onError: (error) => {
     //   if (timeoutRef.current) {
     //     clearTimeout(timeoutRef.current);
     //   }
 
     //   timeoutRef.current = setTimeout(() => {
     //     createHelloMutation.reset();
     //   }, 2000);
     // },
     onSuccess: (data) => {
       queryClient.setQueryData<FriendDashboardData>(
         ["friendDashboardData", userId, friendId],
         (oldData) => {
           if (!oldData) return oldData;
 
           return {
             ...oldData,
             friend_faves: {
               ...oldData.friend_faves,
               use_friend_color_theme: data.use_friend_color_theme,
             },
           };
         }
       );
     },
   });
 
 
 
 
 
 
 
 
 
 
 
  const handleUpdateFavesTheme = ({
    savedDarkColor,
    savedLightColor,
    manualThemeOn,
  }: ColorThemeUpdateProps) => { 

    if (!userId || !friendId) {
      return;
    }

    const theme: ColorThemeUpdateLoad = {
      userId: userId,
      friendId: friendId,
      darkColor: savedDarkColor,
      lightColor: savedLightColor,
      manualTheme: manualThemeOn, 
    };
    console.log(`theme:`,theme);

    try {
      updateFavesThemeMutation.mutate(theme);
      // await createHelloMutation.mutateAsync(hello); // Call the mutation with the location data
    } catch (error) {
      console.error("Error saving hello:", error);
    }
  };

 
  return { handleUpdateFavesTheme };
};

export default useUpdateFaveTheme;
