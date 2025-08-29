import React from "react";
import { View } from "react-native";

import EditTheme from "../buttons/friends/EditTheme";

const SectionFriendTheme = ({manualGradientColors, userId, friendId, manualThemeOn}) => { 
 
 
 
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
      <EditTheme manualGradientColors={manualGradientColors} userId={userId} friendId={friendId} manualThemeOn={manualThemeOn} />
    </View>
  );
};

export default SectionFriendTheme;
