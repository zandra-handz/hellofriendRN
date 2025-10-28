import { View } from "react-native";
import React, { useCallback, useState, useEffect, useMemo } from "react";
// import { useSelectedFriendStats } from "@/src/context/SelectedFriendStatsContext";
import useSelectedFriendStats from "@/src/hooks/useSelectedFriendStats";
import { useHelloes } from "@/src/context/HelloesContext";
import GlobalPressable from "../appwide/button/GlobalPressable";
import FriendHistoryMiniPie from "./FriendHistoryMiniPie";
import useStatsSortingFunctions from "@/src/hooks/useStatsSortingFunctions";
import FriendHistoryModal from "../headers/FriendHistoryModal";
import manualGradientColors from "@/app/styles/StaticColors";
// import { useFriendList } from "@/src/context/FriendListContext";
type Props = {
  chartRadius: number;
  chartBorder: number;
  chartBorderColor: string;
  labelsSize: number;
  showLabels: boolean;
};
const FriendHistoryPieDataWrap = React.memo(
  ({
    userId,
    friendId,
    chartRadius = 90,
    chartBorder = 6,
    chartBorderColor = "hotpink",
    labelsSize = 9,
    showLabels = false,
    selectedFriendName,
    primaryColor, 
    primaryOverlayColor,
    darkerOverlayBackgroundColor,
    themeColors,
  }: Props) => {
    const { helloesList } = useHelloes();
    // const { friendList } = useFriendList();
     const { selectedFriendStats } = useSelectedFriendStats({
    userId: userId, friendId: friendId, friendIsReady: true, enabled: true
  });
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

      const count = friendHistorySortedList.filter(
        (item) => Number(item.size) > 0
      ).length;
      const hexToRgb = (hex) => hex.match(/\w\w/g).map((c) => parseInt(c, 16));
      const rgbToHex = (rgb) =>
        "#" + rgb.map((c) => c.toString(16).padStart(2, "0")).join("");

      const start = hexToRgb(manualGradientColors.darkColor);
      const end = hexToRgb(themeColors.darkColor);

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
      themeColors.darkColor,
    ]);

    const seriesData = useMemo(() => {
      if (!friendHistorySortedList) return;

      const dataCountList = friendHistorySortedList.filter(
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
    }, [friendHistorySortedList, colors, primaryColor, labelsSize]);

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
              <GlobalPressable 
                onPress={handleOpenLargeChart}
              >
                <View
                  style={{
                    borderRadius: 999,
                    borderWidth: chartBorder,
                    width: chartRadius * 2 + chartBorder * 2,
                    height: chartRadius * 2 + chartBorder * 2,
                    alignItems: "center",
                    borderColor: chartBorderColor,
                  }}
                >
                  {friendHistorySortedList && (
                    <FriendHistoryMiniPie
                      darkerOverlayBackgroundColor={
                        darkerOverlayBackgroundColor
                      }
                      primaryColor={primaryColor}
                      primaryOverlayColor={primaryOverlayColor}

                      colors={colors}
                      seriesData={seriesData}
                      data={friendHistorySortedList}
                      showLabels={showLabels}
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
              friendId={friendId}
              helloesList={helloesList}
                          themeColors={themeColors} 
              darkerOverlayBackgroundColor={darkerOverlayBackgroundColor}
              primaryColor={primaryColor}
              primaryOverlayColor={primaryOverlayColor}
        
              seriesData={seriesData}
              isVisible={largeFriendChartVisible}
              closeModal={handleCloseLargeChart}
              friendName={selectedFriendName}
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
