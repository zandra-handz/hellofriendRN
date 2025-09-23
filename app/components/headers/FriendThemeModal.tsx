import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import manualGradientColors from "@/src/hooks/StaticColors";
import { MaterialCommunityIcons } from "@expo/vector-icons"; 
import SectionFriendTheme from "../friends/SectionFriendTheme";
import ModalScaleLikeTree from "../alerts/ModalScaleLikeTree";
 
import { useFriendList } from "@/src/context/FriendListContext";
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

const FriendThemeModal: React.FC<Props> = ({
  userId,
  isVisible,
  friendId,
  friendName = "",
  friendDash, 
  bottomSpacer,
  closeModal,
  lightDarkTheme,
  themeAheadOfLoading, 
}) => {
  const { friendList } = useFriendList();
 
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

export default FriendThemeModal;
