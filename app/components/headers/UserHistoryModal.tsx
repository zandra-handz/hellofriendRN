import React, { useState } from "react";

import { View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import UserHistoryBigPie from "../home/UserHistoryBigPie";
import ModalScaleLikeTree from "../alerts/ModalScaleLikeTree";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
import UserCategoryHistoryList from "./UserCategoryHistoryList";

interface Props {
  isVisible: boolean;
  closeModal: () => void;
  onSearchPress: () => void;

  listData: object[];
  radius: number;
  labelsSize: number;
  seriesData: any;
}

const UserHistoryModal: React.FC<Props> = ({
  friendList,
  isVisible,
  closeModal,

  listData,
  radius = 180, //default instead of multiplying the radius of the preview
  labelsSize,
  seriesData,
  manualGradientColors,
  darkerOverlayBackgroundColor,
  primaryColor,
  primaryOverlayColor,
  welcomeTextStyle,
  subWelcomeTextStyle,
 
}) => {
  const [viewCategoryId, setViewCategoryId] = useState(undefined);

  const handleUpDrillCategoryId = (categoryId) => {
    if (categoryId) {
      setViewCategoryId(categoryId);
    } else {
      setViewCategoryId(null);
    }
  };

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
              upDrillCategoryId={handleUpDrillCategoryId}
              showPercentages={true}
              listData={listData}
              radius={radius}
              labelsSize={labelsSize}
              showFooterLabel={false}
              seriesData={seriesData}
              darkerOverlayBackgroundColor={darkerOverlayBackgroundColor}
              primaryColor={primaryColor}
              primaryOverlayColor={primaryOverlayColor}
              welcomeTextStyle={welcomeTextStyle}
              subWelcomeTextStyle={subWelcomeTextStyle}
            />

            {viewCategoryId && (
              <Animated.View
                entering={SlideInDown.duration(200)} // have to match the timing in pie scaling
                exiting={SlideOutDown.duration(200)} // have to match the timing in pie scaling
                style={{
                  //  backgroundColor: "red",
                  height: viewCategoryId ? "75%" : "0%",
                  flexGrow: 1,
                  width: "100%",
                }}
              >
                <UserCategoryHistoryList friendList={friendList} categoryId={viewCategoryId} primaryColor={primaryColor}/>
              </Animated.View>
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
