import React from "react";
import { View } from "react-native";

import EditPhone from "../buttons/friends/EditPhone";
import EditEffort from "../buttons/friends/EditEffort";
import EditPriority from "../buttons/friends/EditPriority";

// import useRefetchUpcomingHelloes from "@/src/hooks/UpcomingHelloesCalls/useRefetchUpcomingHelloes";

const SectionFriendSettings = ({
  userId, 
  themeColors,
  friendId,
  friendPhone,
  friendEffort,
  friendPriority,
  primaryColor,
}) => {
  // const { refetchUpcomingHelloes } = useRefetchUpcomingHelloes({
  //   userId: userId,
  // });

  // .days_since_words && .time_Score
  return (
    <View
      style={{
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        padding: 0,
        width: "100%",
        alignSelf: "flex-start",
      }}
    >
      <EditPhone
        userId={userId}
        friendId={friendId}
        friendPhone={friendPhone}
        primaryColor={primaryColor}
      />
      <EditEffort
        userId={userId}
        themeColors={themeColors} 
        friendId={friendId}
        friendEffort={friendEffort}
        primaryColor={primaryColor}
        // refetchUpcoming={refetchUpcomingHelloes}
      />
      <EditPriority
        userId={userId}
         themeColors={themeColors} 
        friendId={friendId}
        friendPriority={friendPriority}
        primaryColor={primaryColor}
        // refetchUpcoming={refetchUpcomingHelloes}
      />
    </View>
  );
};

export default SectionFriendSettings;
