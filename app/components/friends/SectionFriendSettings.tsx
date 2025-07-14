import React  from "react";
import {  View   } from "react-native";
 

 import EditPhone from "../buttons/friends/EditPhone";
 import EditEffort from "../buttons/friends/EditEffort";
 import EditPriority from "../buttons/friends/EditPriority";
 

const SectionFriendSettings = () => {
 
 
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
<EditPhone />
      <EditEffort />
      <EditPriority /> 
 
 
    </View>
  );
};

export default SectionFriendSettings;
