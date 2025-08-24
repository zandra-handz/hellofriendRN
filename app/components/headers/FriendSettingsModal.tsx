import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { TouchableOpacity, AccessibilityInfo } from "react-native"; 
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

import SectionFriendSettings from "../friends/SectionFriendSettings";

import SectionFriendStats from "../friends/SectionFriendStats";
import SectionFriendTheme from "../friends/SectionFriendTheme";
import ModalScaleLikeTree from "../alerts/ModalScaleLikeTree";

import DeleteFriend from "../friends/DeleteFriend";

import { FriendDashboardData } from "@/src/types/FriendTypes"; 

interface Props {
  isVisible: boolean;
  userId: number;
  friendId: number;
  friendName: string;
  friendDash: FriendDashboardData;
  bottomSpacer: number;
  closeModal: () => void;

}

const FriendSettingsModal: React.FC<Props> = ({
  userId,
  isVisible,
  friendId,
  friendName = "",
  friendDash,
  bottomSpacer,
  closeModal,
    themeAheadOfLoading,
}) => {
  const { themeStyles, appSpacingStyles } = useGlobalStyle();
 
//  console.log(friendDash?.friend_faves?.use_friend_color_theme);
//  console.log(friendDash);
  return (
    <ModalScaleLikeTree
      bottomSpacer={bottomSpacer}
      friendTheme={themeAheadOfLoading}
      isVisible={isVisible}
      headerIcon={
        <MaterialCommunityIcons
          name={"wrench"}
          size={appSpacingStyles.modalHeaderIconSize}
          color={themeStyles.footerIcon.color}
        />
      }
      useModalBar={true}
      rightSideButtonItem={
        <MaterialCommunityIcons
          name={`wrench`}
          size={50}
          color={themeAheadOfLoading.fontColorSecondary}
        />
      }
      buttonTitle={`${friendName}`}
      children={
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.bodyContainer}>
            <View style={styles.sectionContainer}>
              <SectionFriendStats
 
                friendDaysSince={friendDash?.days_since_words}
                friendTimeScore={friendDash?.time_score}
              />
            </View>
            <View style={styles.sectionContainer}>
              <SectionFriendSettings
              themeAheadOfLoading={themeAheadOfLoading}
                friendId={friendId}
                friendPhone={friendDash?.suggestion_settings?.phone_number}
                friendEffort={friendDash?.suggestion_settings?.effort_required}
                friendPriority={friendDash?.suggestion_settings?.priority_level}
              />
            </View>

            <View style={styles.headerContainer}>
              <SectionFriendTheme
              themeAheadOfLoading={themeAheadOfLoading}
                userId={userId}
                friendId={friendId}
                manualThemeOn={friendDash?.friend_faves?.use_friend_color_theme}
              />
            </View>
                  <DeleteFriend friendId={friendId} friendName={friendName} />
          </ScrollView>
    
        </View>
      }
      onClose={closeModal}
    />
  );
};

const styles = StyleSheet.create({
  bodyContainer: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-start",
    textAlign: "left",
  },
  headerContainer: {
    marginVertical: 8,
  },
  sectionContainer: {
    marginVertical: 8,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 18,
    lineHeight: 30,
  },
  text: {
    fontSize: 14,
    lineHeight: 21,
  },
});

export default FriendSettingsModal;
