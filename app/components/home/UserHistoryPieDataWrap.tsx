import { View } from "react-native";
import GlobalPressable from "../appwide/button/GlobalPressable";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useUserStats } from "@/src/context/UserStatsContext";
import UserHistoryModal from "../headers/UserHistoryModal";
import useStatsSortingFunctions from "@/src/hooks/useStatsSortingFunctions";
 
import UserHistoryMiniPie from "./UserHistoryMiniPie";

type Props = {
  chartRadius: number;
  chartBorder: number;
  chartBorderColor: string;
  labelsSize: number;
  showLabels: boolean;
};

const UserHistoryPieDataWrap = ({
 
  friendStyle,
  chartRadius = 90,
  chartBorder = 6,
  chartBorderColor = "hotpink",
  labelsSize = 9,
  showLabels = false,
  manualGradientColors,
  darkerOverlayBackgroundColor,
  primaryColor,
  primaryOverlayColor,
  welcomeTextStyle,
  subWelcomeTextStyle,
}: Props) => {
  const { stats } = useUserStats();
 
  const [largeUserChartVisible, setLargeUserChartVisible] = useState(false);

  const [userHistorySortedList, setUserHistorySortedList] = useState([]);

  const [userHistoryHasAnyCapsules, setUserHistoryHasAnyCapsules] =
    useState(false);
  const { categoryHistorySizes } = useStatsSortingFunctions({
    listData: stats,
  });

  useEffect(() => {
    if (stats) {
      let categories = categoryHistorySizes();

      setUserHistorySortedList(categories.sortedList);
      setUserHistoryHasAnyCapsules(categories.hasAnyCapsules);
    }
  }, [stats]);

  const colors = useMemo(() => {
    if (!userHistorySortedList) return [];

    const count = userHistorySortedList.filter(
      (item) => Number(item.size) > 0
    ).length;
    const hexToRgb = (hex) => hex.match(/\w\w/g).map((c) => parseInt(c, 16));
    const rgbToHex = (rgb) =>
      "#" + rgb.map((c) => c.toString(16).padStart(2, "0")).join("");

    const start = hexToRgb(manualGradientColors.darkColor);
    const end = hexToRgb(friendStyle.darkColor);

    return Array.from({ length: count }, (_, i) => {
      const t = i / Math.max(count - 1, 1);
      const interpolated = start.map((s, j) =>
        Math.round(s + (end[j] - s) * t)
      );
      return rgbToHex(interpolated);
    });
  }, [userHistorySortedList, manualGradientColors.darkColor, friendStyle.darkColor]);

  const seriesData = useMemo(() => {
    if (!userHistorySortedList) return;

    const dataCountList = userHistorySortedList.filter(
      (item) => Number(item.size) > 0
    );
    return dataCountList.map((item, index) => ({
      ...item,
      label: {
        text: item.name.slice(0, 4),
        fontFamily: "Poppins-Regular",
        color: primaryColor,
        fontSize: labelsSize,
      },
      color: colors[index],
    }));
  }, [userHistorySortedList, colors, primaryColor, labelsSize]);

  const handleOpenLargeUserChart = useCallback(() => {
    setLargeUserChartVisible(true);
  }, []);

  const handleCloseLargeUserChart = useCallback(() => {
    setLargeUserChartVisible(false);
  }, []);

  return (
    <>
      {stats && userHistorySortedList && userHistoryHasAnyCapsules && (
        <View
          style={{ width: chartRadius * 2 + chartBorder * 2, height: "100%" }}
        >
          <GlobalPressable onPress={handleOpenLargeUserChart}>
            <View
              style={{
                borderRadius: 999,
                borderWidth: chartBorder,

                alignItems: "center",
                borderColor: chartBorderColor,
              }}
            >
              <UserHistoryMiniPie
                seriesData={seriesData}
                showLabels={showLabels}
                listData={stats}
                radius={chartRadius}
                labelsSize={labelsSize}
                showFooterLabel={false}
                darkerOverlayBackgroundColor={darkerOverlayBackgroundColor}
                primaryColor={primaryColor}
                primaryOverlayColor={primaryOverlayColor}
                welcomeTextStyle={welcomeTextStyle}
                subWelcomeTextStyle={subWelcomeTextStyle}
              />
            </View>
          </GlobalPressable>
        </View>
      )}
      {largeUserChartVisible && (
        <View>
          <UserHistoryModal
      
            seriesData={seriesData}
            isVisible={largeUserChartVisible}
            closeModal={handleCloseLargeUserChart}
            listData={stats}
            // radius={180} this is now the default
            labelsSize={labelsSize * 1.4} 
            manualGradientColors={manualGradientColors}
            darkerOverlayBackgroundColor={darkerOverlayBackgroundColor}
            primaryColor={primaryColor}
            primaryOverlayColor={primaryOverlayColor}
            welcomeTextStyle={welcomeTextStyle}
            subWelcomeTextStyle={subWelcomeTextStyle}
          />
        </View>
      )}
    </>
  );
};

export default UserHistoryPieDataWrap;
