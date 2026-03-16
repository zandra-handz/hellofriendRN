import { View, Text, StyleSheet } from "react-native";
import React, { useState, useMemo } from "react";
import { useLDTheme } from "@/src/context/LDThemeContext";
import useUser from "@/src/hooks/useUser";
import { SafeAreaView } from "react-native-safe-area-context";
import TextHeader from "@/app/components/appwide/format/TextHeader";
import useUserStats from "@/src/hooks/useUserStats";
import { AppFontStyles } from "@/app/styles/AppFonts";
import UserCategoryHistoryList from "@/app/components/headers/UserCategoryHistoryList";
import buildPieChart from "@/src/hooks/utils_buildPieChart";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";

import UserHistoryBigPie from "@/app/components/home/UserHistoryBigPie";

type Props = {};

const ScreenHistory = (props: Props) => {
  const { user } = useUser();
  const { lightDarkTheme } = useLDTheme();

  const { stats, sortedList, hasAnyCapsules, statsCategoryColorsMap } =
    useUserStats({
      userId: user.id,
      isInitializing: false,
      enabled: true,
    });

  const [userHistoryHasAnyCapsules, setUserHistoryHasAnyCapsules] =
    useState(false);

  const [viewCategoryId, setViewCategoryId] = useState(undefined);

  const handleUpDrillCategoryId = (categoryId) => {
    if (categoryId) {
      setViewCategoryId(categoryId);
    } else {
      setViewCategoryId(null);
    }
  };

  const backgroundColor = lightDarkTheme.primaryBackground;
  const textColor = lightDarkTheme.primaryText;

  const pieLabelSize = 9;
  const pieLabelColor = textColor;

  const pieData = useMemo(
    () =>
      buildPieChart({
        sortedList: sortedList,
        colorsMap: statsCategoryColorsMap,
        labelColor: pieLabelColor,
        labelSize: pieLabelSize,
      }),
    [sortedList, statsCategoryColorsMap, pieLabelColor, pieLabelSize],
  );

  const welcomeTextStyle = AppFontStyles.welcomeText;
  const subWelcomeTextStyle = AppFontStyles.subWelcomeText;

  const headerLabel = "Top Categories";

  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: backgroundColor,
          paddingHorizontal: 0,
        }}
      >
        <TextHeader
          label={headerLabel}
          color={textColor}
          fontStyle={welcomeTextStyle}
          showNext={false}
          nextEnabled={false}
        />

        {stats && (
          <View style={styles.outerPieWrapper}>
            <UserHistoryBigPie
              upDrillCategoryId={handleUpDrillCategoryId}
              showPercentages={true}
              listData={stats}
              // radius={180}
              radius={110}
              labelsSize={pieLabelSize}
              showFooterLabel={false}
              seriesData={pieData}
              darkerOverlayBackgroundColor={
                lightDarkTheme.darkerGlassBackground
              }
              primaryColor={textColor}
              primaryOverlayColor={"transparent"}
              welcomeTextStyle={welcomeTextStyle}
              subWelcomeTextStyle={subWelcomeTextStyle}
            />
            {viewCategoryId && (
              <Animated.View
                entering={SlideInDown.duration(200)} // have to match the timing in pie scaling
                exiting={SlideOutDown.duration(200)} // have to match the timing in pie scaling
                style={{
                    paddingTop: 40,
                  height: viewCategoryId ? "40%" : "0%",
                  flexGrow: 1,
                  width: "100%",
                }}
              >
                <UserCategoryHistoryList
                  userId={user.id}
                  categoryId={viewCategoryId}
                  primaryColor={textColor}
                />
              </Animated.View>
            )}
          </View>
        )}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    paddingHorizontal: 0,
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

export default ScreenHistory;
