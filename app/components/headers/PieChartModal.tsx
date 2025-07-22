import React from "react";
 

import {
  View, 
  StyleSheet, 
} from "react-native"; 
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { MaterialCommunityIcons } from "@expo/vector-icons"; 
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
  onLongPress: (categoryId: number | null) => void;
}

const PieChartModal: React.FC<Props> = ({
  isVisible,
  closeModal, 
  friendData,
  listData,
  radius=180, //default instead of multiplying the radius of the preview
  labelsSize,
  onLongPress,
}) => {
  const { themeStyles, appSpacingStyles } = useGlobalStyle();

 

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
        <View style={styles.bodyContainer}>
          
            <View>
              {friendData && (
                <FriendCategoryHistoryChart
                showPercentages={true}
                  friendData={friendData}
                  listData={listData}
                  showLabels={true}
                  radius={radius}
                  labelsSize={labelsSize}
                  onLongPress={onLongPress} //not hoooked up yet
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
