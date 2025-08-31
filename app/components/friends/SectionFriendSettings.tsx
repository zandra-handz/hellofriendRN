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
  primaryColor,
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
            primaryColor={primaryColor}
      />
      <EditEffort
       themeAheadOfLoading={themeAheadOfLoading}
        friendId={friendId}
        friendEffort={friendEffort}
            primaryColor={primaryColor}
      />
      <EditPriority
         themeAheadOfLoading={themeAheadOfLoading}
        friendId={friendId}
        friendPriority={friendPriority}
        primaryColor={primaryColor}
      />
    </View>
  );
};

export default SectionFriendSettings;
