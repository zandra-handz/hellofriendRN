import { View } from "react-native";
import React, { useCallback, useState, useEffect, useMemo } from "react";
import { useSelectedFriendStats } from "@/src/context/SelectedFriendStatsContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
 
import { useFriendStyle } from "@/src/context/FriendStyleContext";
 import GlobalPressable from "../appwide/button/GlobalPressable";
import FriendHistoryMiniPie from "./FriendHistoryMiniPie";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import useStatsSortingFunctions from "@/src/hooks/useStatsSortingFunctions";
import FriendHistoryModal from "../headers/FriendHistoryModal";
type Props = {
  chartRadius: number;
  chartBorder: number;
  chartBorderColor: string;
  labelsSize: number;
  showLabels: boolean;
};
const FriendHistoryPieDataWrap = React.memo(
  ({
    chartRadius = 90,
    chartBorder = 6,
    chartBorderColor = "hotpink",
    labelsSize = 9,
    showLabels = false,
  }: Props) => {
    const { selectedFriendStats } = useSelectedFriendStats();
    const { themeAheadOfLoading } = useFriendStyle();
    const { themeStyles, manualGradientColors } = useGlobalStyle();
    const { selectedFriend } = useSelectedFriend();
    const [largeFriendChartVisible, setLargeFriendChartVisible] =
      useState(false);

    const [friendHistorySortedList, setFriendHistorySortedList] = useState([]);

    const [friendHistoryHasAnyCapsules, setFriendHistoryHasAnyCapsules] =
      useState(false);

    const { categoryHistorySizes } = useStatsSortingFunctions({
      listData: selectedFriendStats,
    });

    useEffect(() => {
      if (selectedFriendStats) {
        let categories = categoryHistorySizes();

        setFriendHistorySortedList(categories.sortedList);
        setFriendHistoryHasAnyCapsules(categories.hasAnyCapsules);
      }
    }, [selectedFriendStats]);



    const colors = useMemo(() => {
      if (!friendHistorySortedList) return [];

      const count = friendHistorySortedList.filter((item) => Number(item.size) > 0).length;
      const hexToRgb = (hex) => hex.match(/\w\w/g).map((c) => parseInt(c, 16));
      const rgbToHex = (rgb) =>
        "#" + rgb.map((c) => c.toString(16).padStart(2, "0")).join("");

      const start = hexToRgb(manualGradientColors.darkColor);
      const end = hexToRgb(themeAheadOfLoading.darkColor);

      return Array.from({ length: count }, (_, i) => {
        const t = i / Math.max(count - 1, 1);
        const interpolated = start.map((s, j) =>
          Math.round(s + (end[j] - s) * t)
        );
        return rgbToHex(interpolated);
      });
    }, [
      friendHistorySortedList,
      manualGradientColors.darkColor,
      themeAheadOfLoading.darkColor,
    ]);

    const seriesData = useMemo(() => {
      if (!friendHistorySortedList) return;

      const dataCountList = friendHistorySortedList.filter((item) => Number(item.size) > 0);
      return dataCountList.map((item, index) => ({
        ...item,
        label: {
          text: item.name.slice(0, 4),
          fontFamily: "Poppins-Regular",
          color: themeStyles.primaryText.color,
          fontSize: labelsSize,
        },
        color: colors[index],
      }));
    }, [
      friendHistorySortedList,
      colors,
      themeStyles.primaryText.color,
      labelsSize,
    ]);

    const handleOpenLargeChart = useCallback(() => {
      setLargeFriendChartVisible(true);
    }, []);

        const handleCloseLargeChart = useCallback(() => {
      setLargeFriendChartVisible(false);
    }, []);

    return (
      <>
        {selectedFriendStats &&
          selectedFriendStats.length > 0 &&
          friendHistorySortedList &&
          friendHistoryHasAnyCapsules && (
            <View
              style={{
                width: chartRadius * 2 + chartBorder * 2,
                height: "100%",
              }}
            >
              <GlobalPressable onPress={handleOpenLargeChart}>
                <View
                  style={{
                    borderRadius: 999,
                    borderWidth: chartBorder,

                    alignItems: "center",
                    borderColor: chartBorderColor,
                  }}
                >
                  {friendHistorySortedList && (
                    
                  <FriendHistoryMiniPie
                  colors={colors}
                  seriesData={seriesData}
                    data={friendHistorySortedList}
                    showLabels={showLabels}
                    friendData={selectedFriend}
                    listData={selectedFriendStats}
                    radius={chartRadius}
                    labelsSize={labelsSize}
                  />
                  
                  )}
                </View>
              </GlobalPressable>
            </View>
          )}

        {largeFriendChartVisible && (
          <View>
            <FriendHistoryModal
            seriesData={seriesData}
              isVisible={largeFriendChartVisible}
              closeModal={handleCloseLargeChart}
              friendData={selectedFriend}
              listData={selectedFriendStats}
              labelsSize={labelsSize * 1.4}
            />
          </View>
        )}
      </>
    );
  },
  (prevProps, nextProps) =>
    prevProps.chartRadius === nextProps.chartRadius &&
    prevProps.chartBorder === nextProps.chartBorder &&
    prevProps.chartBorderColor === nextProps.chartBorderColor &&
    prevProps.labelsSize === nextProps.labelsSize &&
    prevProps.showLabels === nextProps.showLabels
);

export default FriendHistoryPieDataWrap;
