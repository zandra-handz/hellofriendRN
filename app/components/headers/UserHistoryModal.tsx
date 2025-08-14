import React from "react";

import { View, StyleSheet } from "react-native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import FriendHistoryBigPie from "../home/FriendHistoryBigPie";
import UserHistoryBigPie from "../home/UserHistoryBigPie";
import ModalScaleLikeTree from "../alerts/ModalScaleLikeTree";

interface Props {
  isVisible: boolean;
  closeModal: () => void;
  onSearchPress: () => void;
 
  listData: object[];
  radius: number;
  labelsSize: number;
  seriesData: any;
  // onLongPress: (categoryId: number | null) => void;
}

const UserHistoryModal: React.FC<Props> = ({
  isVisible,
  closeModal,
 
  listData,
  radius = 180, //default instead of multiplying the radius of the preview
  labelsSize,
  seriesData,
  // onLongPress,
}) => {
  const { manualGradientColors } = useGlobalStyle();

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
      buttonTitle={"All category history"}
      children={
        <View style={styles.bodyContainer}>
          <View>
  
              <UserHistoryBigPie
                showPercentages={true}
                listData={listData}
                radius={radius}
                labelsSize={labelsSize} 
                showFooterLabel={false}
                seriesData={seriesData}
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
    margin: "2%",
  },
  sectionContainer: {
 
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

export default UserHistoryModal;
