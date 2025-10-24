import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";

import SvgIcon from "@/app/styles/SvgIcons";
import SectionFriendSettings from "../friends/SectionFriendSettings";
import SectionFriendStats from "../friends/SectionFriendStats";
import ModalScaleLikeTree from "../alerts/ModalScaleLikeTree";

import DeleteFriend from "../friends/DeleteFriend";

import { FriendDashboardData } from "@/src/types/FriendTypes";
import { LDTheme } from "@/src/types/LDThemeTypes"; 
interface Props {
  isVisible: boolean;
  userId: number;
  friendId: number;
  friendName: string;
  friendDash: FriendDashboardData;
  bottomSpacer: number;
  closeModal: () => void;
  lightDarkTheme: LDTheme; 
  handleDeselectFriend: () => void;
}

const FriendSettingsModal: React.FC<Props> = ({
  userId,
  isVisible,
  friendId,
  friendName = "",
  friendDash,
  handleDeselectFriend,
  themeColors,

  bottomSpacer,
  closeModal,
  lightDarkTheme, 
}) => { 
  return (
    <ModalScaleLikeTree
      bottomSpacer={bottomSpacer}
      friendTheme={themeColors}
      isVisible={isVisible}
      headerIcon={
        <SvgIcon name={"wrench"} size={30} color={lightDarkTheme.primaryText} />
      }
      useModalBar={true}
      rightSideButtonItem={
        <SvgIcon
          name={`wrench`}
          size={50}
          color={themeColors.fontColorSecondary}
        />
      }
      buttonTitle={`${friendName}`}
      children={
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.bodyContainer}>
            <View style={styles.sectionContainer}>
              <SectionFriendStats
                primaryColor={lightDarkTheme.primaryText}
                friendDaysSince={friendDash?.days_since_words}
                friendTimeScore={friendDash?.time_score}
              />
            </View>
            <View style={styles.sectionContainer}>
              <SectionFriendSettings
                userId={userId} 
                themeColors={themeColors}
                friendId={friendId}
                friendPhone={friendDash?.suggestion_settings?.phone_number}
                friendEffort={friendDash?.suggestion_settings?.effort_required}
                friendPriority={friendDash?.suggestion_settings?.priority_level}
                primaryColor={lightDarkTheme.primaryText}
              />
            </View>
          </ScrollView>
          <View
            style={styles.deleteFriendContainer}
          >
            <DeleteFriend
              userId={userId}
              friendId={friendId}
              friendName={friendName}
              handleDeselectFriend={handleDeselectFriend}
            />
          </View>
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
  deleteFriendContainer: {
    position: "absolute",
    width: 300,
    height: 40,
    bottom: 0,
    right: 0,
    zIndex: 60000,
    elevation: 60000,
    alignItems: "center",
  },
});

export default FriendSettingsModal;
