import React from "react";
import { View } from "react-native";

import EditPhone from "../buttons/friends/EditPhone";
import EditEffort from "../buttons/friends/EditEffort";
import EditPriority from "../buttons/friends/EditPriority";

const SectionFriendSettings = ({
 themeAheadOfLoading,
  friendId,
  friendPhone,
  friendEffort,
  friendPriority,
}) => {
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
        friendId={friendId}
        friendPhone={friendPhone}
      />
      <EditEffort
       themeAheadOfLoading={themeAheadOfLoading}
        friendId={friendId}
        friendEffort={friendEffort}
      />
      <EditPriority
         themeAheadOfLoading={themeAheadOfLoading}
        friendId={friendId}
        friendPriority={friendPriority}
      />
    </View>
  );
};

export default SectionFriendSettings;
