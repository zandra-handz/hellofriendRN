import { View, Text, StyleSheet } from "react-native";
import React, { useState, useMemo } from "react";
import { useLDTheme } from "@/src/context/LDThemeContext";
// import { useUser } from "@/src/context/UserContext";
import useUser from "@/src/hooks/useUser";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { SafeAreaView } from "react-native-safe-area-context";
import TextHeader from "@/app/components/appwide/format/TextHeader";

import { daysSincedDateField } from "@/src/utils/DaysSince";
import HelloQuickView from "@/app/components/alerts/HelloQuickView";
import { AppFontStyles } from "@/app/styles/AppFonts";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
import useHelloes from "@/src/hooks/useHelloes";
import { useFriendCategoryColors } from "@/src/context/FriendCategoryColorsContext";
import useSelectedFriendStats from "@/src/hooks/useSelectedFriendStats";
import buildPieChart from "@/src/hooks/utils_buildPieChart";
import FriendHistoryBigPie from "@/app/components/home/FriendHistoryBigPie";
import CategoryFriendHistoryList from "@/app/components/headers/CategoryFriendHistoryList";
import AppModal from "@/app/components/alerts/AppModal";
import HelloViewModal from "@/app/components/alerts/HelloViewModal";
type Props = {};

const ScreenFriendHistory = (props: Props) => {
  const { user } = useUser();
  const { lightDarkTheme } = useLDTheme();

  const { selectedFriend } = useSelectedFriend();
  const { helloesList } = useHelloes({
    userId: user.id,
    friendId: selectedFriend.id,
  });
  const { friendCategoryColorsMap, friendStatsCategoryColorsMap } =
    useFriendCategoryColors();

  const { selectedFriendStats, sortedList, hasAnyCapsules } =
    useSelectedFriendStats({
      userId: user.id,
      friendId: selectedFriend.id,
      friendIsReady: true,
      enabled: true,
    });

  const pieData = useMemo(
    () =>
      buildPieChart({
        sortedList: sortedList,
        colorsMap: friendStatsCategoryColorsMap,
        labelColor: pieLabelColor,
        labelSize: pieLabelSize,
      }),
    [sortedList, friendStatsCategoryColorsMap, pieLabelColor, pieLabelSize],
  );

  const [quickView, setQuickView] = useState<null | ItemViewProps>(null);
  const nullQuickView = () => {
    setQuickView(null);
  };

  const backgroundColor = lightDarkTheme.primaryBackground;
  const textColor = lightDarkTheme.primaryText;

  const welcomeTextStyle = AppFontStyles.welcomeText;
  const subWelcomeTextStyle = AppFontStyles.subWelcomeText;

  const pieLabelSize = 9;
  const pieLabelColor = textColor;

  const headerLabel = selectedFriend.name
    ? `History for ${selectedFriend.name}`
    : "History";

  const handleFakeClose = () => {
    console.log("no close");
  };

  const toggleHelloView = () => {
    setHelloViewVisible((prev) => !prev);
  };

  const [helloViewData, setHelloViewData] = useState<{
    helloObject: any;
    momentOriginalId: string | undefined;
    helloIndex: number;
  } | null>(null);

  const helloViewVisible = helloViewData !== null;

  const closeHelloView = () => {
    setHelloViewData(null);
  };

  const handleViewHello = (id: number, momentOriginalId?: string) => {
    const helloIndex = helloesList.findIndex((hello) => hello.id === id);
    const helloObject = helloIndex !== -1 ? helloesList[helloIndex] : null;

    if (helloObject) {
      setHelloViewData({ helloObject, momentOriginalId, helloIndex });
    }
  };

  const SMALL_CHART_RADIUS = 30;
  const SMALL_CHART_BORDER = 3;

  const [viewCategoryId, setViewCategoryId] = useState(undefined);

  const handleUpDrillCategoryId = (categoryId) => {
    if (categoryId) {
      setViewCategoryId(categoryId);
    } else {
      setViewCategoryId(null);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: backgroundColor,
      }}
    >
      <TextHeader
        label={headerLabel}
        color={textColor}
        fontStyle={welcomeTextStyle}
        showNext={false}
        nextEnabled={false} 
      />

      {helloViewData && helloViewVisible && (
        <HelloViewModal
          isVisible={helloViewVisible}
          onClose={closeHelloView}
          friendId={selectedFriend.id}
          data={helloViewData.helloObject}
          momentOriginalId={helloViewData.momentOriginalId}
          index={helloViewData.helloIndex}
          lightColor={selectedFriend.lightColor}
          primaryColor={textColor}
          backgroundColor={backgroundColor}
        />
      )}

      {selectedFriendStats && (
        <View style={styles.outerPieWrapper}>
          <FriendHistoryBigPie
            darkerOverlayBackgroundColor={lightDarkTheme.darkerGlassBackground}
            primaryColor={textColor}
            primaryOverlayColor={"transparent"}
            welcomeTextStyle={welcomeTextStyle}
            subWelcomeTextStyle={subWelcomeTextStyle}
            upDrillCategoryId={handleUpDrillCategoryId}
            showPercentages={true}
            listData={selectedFriendStats}
            showLabels={true}
            radius={110}
            labelsSize={pieLabelSize}
            showFooterLabel={false}
            seriesData={pieData}
          />

          {viewCategoryId && (
            <Animated.View
              entering={SlideInDown.duration(200)} // have to match the timing in pie scaling
              exiting={SlideOutDown.duration(200)} // have to match the timing in pie scaling
              style={{
                //  backgroundColor: "red",
                paddingTop: 40,
                height: viewCategoryId ? "40%" : "0%",
                flexGrow: 1,
                width: "100%",
              }}
            >
              <CategoryFriendHistoryList
                userId={user.id}
                friendId={selectedFriend.id}
                helloesList={helloesList}
                categoryId={viewCategoryId}
                closeModal={handleFakeClose}
                onViewHelloPress={handleViewHello}
                primaryColor={textColor}
              />
            </Animated.View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    borderRadius: 30,
    height: "auto",
    marginVertical: 0,
  },
  outerPieWrapper: {
    width: "100%",
    flex: 1,
    paddingBottom: 30,
  },
});

export default ScreenFriendHistory;
