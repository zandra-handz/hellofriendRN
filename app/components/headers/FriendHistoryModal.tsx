import React, { useState } from "react";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
import { View, StyleSheet } from "react-native";
import manualGradientColors from "@/app/styles/StaticColors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import FriendHistoryBigPie from "../home/FriendHistoryBigPie";
import ModalScaleLikeTree from "../alerts/ModalScaleLikeTree";
import CategoryFriendHistoryList from "./CategoryFriendHistoryList";
import { daysSincedDateField } from "@/src/utils/DaysSince";
import HelloQuickView from "../alerts/HelloQuickView";
import { AppFontStyles } from "@/app/styles/AppFonts";
 

interface Props {
  isVisible: boolean;
  closeModal: () => void;
  onSearchPress: () => void;
  friendName?: string;
  listData: object[];
  radius: number;
  labelsSize: number;
  seriesData: any;
  // onLongPress: (categoryId: number | null) => void;
}

const FriendHistoryModal: React.FC<Props> = ({
  friendId,

  helloesList,
  darkerOverlayBackgroundColor,
  primaryColor,
  primaryOverlayColor,

  themeAheadOfLoading,
  isVisible,
  closeModal,
  friendName,
  listData,
  radius = 180, //default instead of multiplying the radius of the preview
  labelsSize,
  seriesData,
  // onLongPress,
}) => {
  const welcomeTextStyle = AppFontStyles.welcomeText;
  const subWelcomeTextStyle = AppFontStyles.subWelcomeText;

  
  const [quickView, setQuickView] = useState<null | ItemViewProps>(null);
  const nullQuickView = () => {
    setQuickView(null);
  };

  const [viewCategoryId, setViewCategoryId] = useState(undefined);

  const handleViewHello = (id, momentOriginalId) => {
    const helloIndex = helloesList.findIndex((hello) => hello.id === id);
    const helloObject = helloIndex !== -1 ? helloesList[helloIndex] : null;

    if (helloObject != undefined) {
      const daysSince = daysSincedDateField(helloObject.date);

      const word = Number(daysSince) != 1 ? `days` : `day`;
   
      setQuickView({
        topBarText: `Hello on ${helloObject.past_date_in_words}   |   ${daysSince} ${word} ago`,
        view: (
          <HelloQuickView
            friendId={friendId}
            data={helloObject}
            momentOriginalId={momentOriginalId}
            index={helloIndex}
            themeAheadOfLoading={themeAheadOfLoading}
            primaryColor={primaryColor}
          />
        ),
        message: `hi hi hi`,
        update: false,
      });
    }
  };

  const handleFakeClose = () => {
    console.log("no close");
  };

  const handleUpDrillCategoryId = (categoryId) => {
    if (categoryId) {
      setViewCategoryId(categoryId);
    } else {
      setViewCategoryId(null);
    }
  };
  const BOTTOM_SPACER = 60;

  return (
    <>
      <ModalScaleLikeTree
        //ModalScaleLikeTree is prettier
        isVisible={isVisible}
        bottomSpacer={BOTTOM_SPACER}
        helpModeTitle="Help mode: Charts"
        borderRadius={60}
        isFullscreen={false}
        useModalBar={true}
        quickView={quickView}
        nullQuickView={nullQuickView}
        rightSideButtonItem={
          <MaterialCommunityIcons
            name={`chart-pie`}
            size={50}
            color={manualGradientColors.darkHomeColor}
          />
        }
        buttonTitle={friendName ? `${friendName}` : "All category history"}
        children={
          <View style={styles.bodyContainer}>
            <View>
              {friendName && (
                <FriendHistoryBigPie
                  darkerOverlayBackgroundColor={darkerOverlayBackgroundColor}
                  primaryColor={primaryColor}
                  primaryOverlayColor={primaryOverlayColor}
                  welcomeTextStyle={welcomeTextStyle}
                  subWelcomeTextStyle={subWelcomeTextStyle}
                  upDrillCategoryId={handleUpDrillCategoryId}
                  showPercentages={true}
                  listData={listData}
                  showLabels={true}
                  radius={radius}
                  labelsSize={labelsSize}
                  showFooterLabel={false}
                  seriesData={seriesData}
                />
              )}

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
                  <CategoryFriendHistoryList
                    friendId={friendId}
                    helloesList={helloesList}
                    categoryId={viewCategoryId}
                    closeModal={handleFakeClose}
                    onViewHelloPress={handleViewHello}
                    primaryColor={primaryColor}
                  />
                </Animated.View>
              )}
            </View>
          </View>
        }
        onClose={closeModal}
      />
    </>
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

export default FriendHistoryModal;
