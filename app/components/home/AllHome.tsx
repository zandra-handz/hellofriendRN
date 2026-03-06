 


import React, { useCallback, useMemo, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import UpNext from "./UpNext";
import HomeScrollSoon from "./HomeScrollSoon";
import useSelectFriend from "@/src/hooks/useSelectFriend";
import useFriendListAndUpcoming from "@/src/hooks/usefriendListAndUpcoming";
import { prefetchFriendDash } from "@/src/hooks/prefetchFriendDashUtil";

type Props = {
  userId: number;
  isLoading: boolean;
  height?: string;
  borderRadius?: number;
  borderColor?: string;
  navigateToFriendHome: (id: number) => void;
  textColor: string;
  overlayColor: string;
  lighterOverlayColor: string;
  darkerOverlayColor: string;
};

const AllHome = ({
  userId,
  isLoading,
  height = "100%",
  borderRadius = 20,
  borderColor = "transparent",
  navigateToFriendHome,
  textColor,
  overlayColor,
  lighterOverlayColor,
  darkerOverlayColor,
}: Props) => {
  const queryClient = useQueryClient();

  const { friendListAndUpcoming } = useFriendListAndUpcoming({
    userId: userId,
  });

  const friendList = friendListAndUpcoming?.friends;
  const upcomingHelloes = friendListAndUpcoming?.upcoming;
  const upcomingId = friendListAndUpcoming?.next?.id;

  // Prefetch top 3 upcoming friends when home screen loads
  useEffect(() => {
    if (!userId || !upcomingHelloes?.length) return;

    upcomingHelloes.slice(0, 3).forEach((hello) => {
      const friendId = hello?.friend?.id;
      if (friendId) {
        prefetchFriendDash(userId, friendId, queryClient);
      }
    });
  }, [userId, upcomingHelloes, queryClient]);

  const upcomingFriendName = useMemo(
    () => upcomingHelloes?.[0]?.friend?.name ?? null,
    [upcomingHelloes?.[0]?.friend?.name]
  );

  const upcomingFutureDateInWords = useMemo(
    () => upcomingHelloes?.[0]?.future_date_in_words ?? null,
    [upcomingHelloes?.[0]?.future_date_in_words]
  );

  const { handleSelectFriend } = useSelectFriend({
    userId,
    friendList,
  });

  const onPress = useCallback(() => {
    if (upcomingId) {
      navigateToFriendHome(upcomingId);
    }
  }, [upcomingId, navigateToFriendHome]);

  
  const onSoonPress = useCallback((id) => {
    if (id) {
      navigateToFriendHome(id);
    }
  }, [ navigateToFriendHome]);

  return (
    <View
      style={[
        styles.container,
        {
          borderRadius: borderRadius,
          borderColor: borderColor,
          height: height,
        },
      ]}
    >
      {upcomingHelloes && (
        <View style={styles.upNextWrapper}>
          <UpNext
            friendName={upcomingFriendName}
            futureDateInWords={upcomingFutureDateInWords}
            onPress={onPress}
            textColor={textColor}
          />

          <View style={styles.soonWrapper}>
            <HomeScrollSoon
              lighterOverlayColor={lighterOverlayColor}
              darkerOverlayColor={darkerOverlayColor}
              upcomingHelloes={upcomingHelloes}
              isLoading={isLoading}
              handleSelectFriend={handleSelectFriend}
              onPress={onSoonPress} 
              itemListLength={friendList?.length}
              friendList={friendList}
              primaryColor={textColor}
              overlayColor={overlayColor}
              height={"100%"}
              maxHeight={700}
              borderRadius={10}
              borderColor="black"
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    padding: 0,
    marginTop: 40,
    minHeight: 190,
    alignContent: "center",
    borderWidth: 0,
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
  },
  upNextWrapper: {
    height: "100%",
  
  
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
    overflow: "hidden", 
  },
  soonWrapper: {
    zIndex: 3,
    flex: 1,
    width: "100%",
    marginTop: 90,
    height: 400,
  },
});

export default React.memo(AllHome);