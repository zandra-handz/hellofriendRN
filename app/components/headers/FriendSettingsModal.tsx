import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

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
  friendList,
  bottomSpacer,
  closeModal,
  lightDarkTheme,
  themeAheadOfLoading,
  manualGradientColors,
}) => {
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
          size={30}
          color={lightDarkTheme.priamryText}
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
                primaryColor={lightDarkTheme.primaryText}
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
                primaryColor={lightDarkTheme.primaryText}
              />
            </View>

            <View style={styles.headerContainer}>
              <SectionFriendTheme
                primaryColor={lightDarkTheme.primaryText}
                lighterOverlayColor={lightDarkTheme.lighterOverlayBackground}
                manualGradientColors={manualGradientColors}
                themeAheadOfLoading={themeAheadOfLoading}
                userId={userId}
                friendId={friendId}
                friendList={friendList}
                manualThemeOn={friendDash?.friend_faves?.use_friend_color_theme}
              />
            </View>
          </ScrollView>
          <View
            style={{
              position: "absolute",
              width: 300,
              height: 40,
              bottom: 0,
              right: 0,
              zIndex: 60000,
              elevation: 60000,
              alignItems: 'center', 
            
              
            }}
          >
            <DeleteFriend friendId={friendId} friendName={friendName} />
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
});

export default FriendSettingsModal;
