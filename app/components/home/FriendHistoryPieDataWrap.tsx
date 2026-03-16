import { View } from "react-native";
import React, { useCallback, useState, useMemo } from "react";
import useSelectedFriendStats from "@/src/hooks/useSelectedFriendStats";
import useHelloes from "@/src/hooks/useHelloes";
import { useFriendCategoryColors } from "@/src/context/FriendCategoryColorsContext";
import GlobalPressable from "../appwide/button/GlobalPressable";
import FriendHistoryMiniPie from "./FriendHistoryMiniPie";
import FriendHistoryModal from "../headers/FriendHistoryModal";
import buildPieChart from "@/src/hooks/utils_buildPieChart";

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
    const { helloesList } = useHelloes({ userId: userId, friendId: friendId });
    const { friendCategoryColorsMap } = useFriendCategoryColors();

    const {
      selectedFriendStats,
      sortedList,
      hasAnyCapsules,
    } = useSelectedFriendStats({
      userId: userId,
      friendId: friendId,
      friendIsReady: true,
      enabled: true,
    });

    const [largeFriendChartVisible, setLargeFriendChartVisible] = useState(false);

    const colors = useMemo(() => {
      if (!sortedList) return [];
      return sortedList
        .filter((item) => Number(item.size) > 0)
        .map((item) => friendCategoryColorsMap[item.user_category] || "#888888");
    }, [sortedList, friendCategoryColorsMap]);

    const seriesData = useMemo(() => {
      if (!sortedList) return [];
      const nonZero = sortedList.filter((item) => Number(item.size) > 0);
      return nonZero.map((item, index) => ({
        ...item,
        label: {
          text: item.name.slice(0, 4),
          fontFamily: "Poppins-Regular",
          color: primaryColor,
          fontSize: labelsSize,
        },
        color: colors[index],
      }));
    }, [sortedList, colors, primaryColor, labelsSize]);

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
          sortedList &&
          hasAnyCapsules && (
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
                    width: chartRadius * 2 + chartBorder * 2,
                    height: chartRadius * 2 + chartBorder * 2,
                    alignItems: "center",
                    borderColor: chartBorderColor,
                  }}
                >
                  {sortedList && (
                    <FriendHistoryMiniPie
                      darkerOverlayBackgroundColor={darkerOverlayBackgroundColor}
                      primaryColor={primaryColor}
                      primaryOverlayColor={primaryOverlayColor}
                      colors={colors}
                      seriesData={seriesData}
                      data={sortedList}
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
              userId={userId}
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