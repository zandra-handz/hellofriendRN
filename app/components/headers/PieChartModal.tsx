import React, { useState, useRef, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useCapsuleList } from "@/src/context/CapsuleListContext";

import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  TextInput,
  FlatList,
} from "react-native";
import { useUser } from "@/src/context/UserContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCategories } from "@/src/context/CategoriesContext";
import ModalWithGoBack from "../alerts/ModalWithGoBack";
import FriendCategoryHistoryChart from "../home/FriendCategoryHistoryChart";
import UserCategoryHistoryChart from "../home/UserCategoryHistoryChart";

interface Props {
  isVisible: boolean;
  closeModal: () => void;
 
  onSearchPress: () => void;
  friendData?: object;
  listData: object[];
  radius: number;
  labelsSize: number;
  onLongPress: () => void;
}

const PieChartModal: React.FC<Props> = ({
  isVisible,
  closeModal, 
  friendData,
  listData,
  radius,
  labelsSize,
  onLongPress,
}) => {
  const { themeStyles, appFontStyles, appSpacingStyles } = useGlobalStyle();

  // const momentsInCategory = capsuleList.filter(
  //   (capsule) => capsule?.user_category === categoryId
  // );

  return (
    <ModalWithGoBack
      isVisible={isVisible}
      isFullscreen={false}
      headerIcon={
        <MaterialCommunityIcons
          name={"comment-outline"}
          size={appSpacingStyles.modalHeaderIconSize}
          color={themeStyles.footerIcon.color}
        />
      }
      questionText={friendData ? `${friendData?.name}` : 'All category history'}
      children={
        <View contentContainerStyle={styles.bodyContainer}>
          
            {/* <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                height: "auto",
                alignItems: "center",
                marginTop: 10,
                marginBottom: 20,
              }}
            >
              <Text
                style={[
                  themeStyles.primaryText,
                  appFontStyles.subWelcomeText,
                  { fontSize: 16 },
                ]}
              >
                Description
              </Text>
            </View> */}
            <View>
              {friendData && (
                <FriendCategoryHistoryChart
                showPercentages={true}
                  friendData={friendData}
                  listData={listData}
                  radius={radius}
                  labelsSize={labelsSize}
                  onLongPress={onLongPress}
                  showFooterLabel={false}
                />
              )}
              {!friendData && (
                <UserCategoryHistoryChart
                showPercentages={true}
                  listData={listData}
                  radius={radius}
                  labelsSize={labelsSize}
                  onLongPress={onLongPress}
                  showFooterLabel={false}
                />
              )}
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
    margin: "2%",
  },
  sectionContainer: {
    // height: 100,
    width: "100%",
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
  searchInput: {
    flex: 1,
    fontSize: 15,
    textAlignVertical: "top",
    textAlign: "left",
    paddingRight: 2,
    height: 200,
  },
});

export default PieChartModal;
