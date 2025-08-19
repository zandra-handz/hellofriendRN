import React  from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { TouchableOpacity, AccessibilityInfo } from "react-native"; 
import { useFriendStyle } from "@/src/context/FriendStyleContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

import SectionFriendSettings from "../friends/SectionFriendSettings";

import SectionFriendStats from "../friends/SectionFriendStats";
import SectionFriendTheme from "../friends/SectionFriendTheme";
import ModalScaleLikeTree from "../alerts/ModalScaleLikeTree";

interface Props {
  isVisible: boolean;
  friendName: string;
  bottomSpacer: number;
  closeModal: () => void;
}

const FriendSettingsModal: React.FC<Props> = ({
  isVisible,
  friendName = "",
  bottomSpacer,
  closeModal,
}) => {
  const { themeStyles, appSpacingStyles } = useGlobalStyle();
  const { themeAheadOfLoading } = useFriendStyle();

  const headerIconSize = 26;

  // React.useEffect(() => {
  //   if (isModalVisible) {
  //     AccessibilityInfo.announceForAccessibility("Information opened");
  //   }
  // }, [isModalVisible]);

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
        <ScrollView contentContainerStyle={styles.bodyContainer}>
          <View style={styles.sectionContainer}>
            <SectionFriendStats />
          </View>
          <View style={styles.sectionContainer}>
            <SectionFriendSettings />
          </View>

          <View style={styles.headerContainer}>
            <SectionFriendTheme />
          </View>
        </ScrollView>
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
    margin: "2%",
  },
  sectionContainer: {
    margin: "2%",
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
