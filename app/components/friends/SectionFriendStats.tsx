import React, {  useMemo } from "react";
import {  View  } from "react-native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
   
import { MaterialCommunityIcons } from "@expo/vector-icons";
 
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
 import NoToggle from "../user/NoToggle";

const SectionFriendStats = () => {
 
  const { themeStyles } = useGlobalStyle(); 
const { friendDashboardData } = useSelectedFriend();

const daysSince = useMemo(() => {
   return friendDashboardData[0].days_since_words || '';

}, [friendDashboardData]);

const timeScore = useMemo(() => {
  return friendDashboardData[0].time_score || '';

}, [friendDashboardData]);


 
  
  return (
    <View
      style={{
        // borderTopLeftRadius: 0,
        // borderTopRightRadius: 0,
        // padding: 0,
        width: "100%",
        alignSelf: "flex-start",
      }}
    >
      <NoToggle
        label={daysSince}
        icon={
          <MaterialCommunityIcons
            name={"timer"}
            size={20}
            color={themeStyles.primaryText.color}
          />
        }
        onPress={() => {}}
      />

      <NoToggle
        label={timeScore}
        icon={
          <MaterialCommunityIcons
            name={"heart"}
            size={20}
            color={themeStyles.primaryText.color}
          />
        }
        onPress={() => {}}
      />
 
 
    </View>
  );
};

export default SectionFriendStats;
