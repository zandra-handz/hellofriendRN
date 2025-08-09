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
import ModalScaleLikeTree from "../alerts/ModalScaleLikeTree";
 
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
  const { themeStyles, appSpacingStyles, manualGradientColors} = useGlobalStyle();

 const BOTTOM_SPACER = 60;

  return (
    <ModalScaleLikeTree
      isVisible={isVisible}
      bottomSpacer={BOTTOM_SPACER}
        helpModeTitle="Help mode: Charts"
        borderRadius={60}
      isFullscreen={false}
        useModalBar={true}
      rightSideButtonItem={
        <MaterialCommunityIcons
          name={`chart-pie`}
          size={50}
          color={manualGradientColors.darkHomeColor}
        />
      } 
      buttonTitle= {friendData ? `${friendData?.name}` : 'All category history'}
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
