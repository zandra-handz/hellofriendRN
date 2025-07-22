import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import UserCategoryHistoryChart from "./UserCategoryHistoryChart";
import { useSelectedFriendStats } from "@/src/context/SelectedFriendStatsContext";
import { useUserStats } from "@/src/context/UserStatsContext";
import PieChartModal from "../headers/PieChartModal";

type Props = {
  chartRadius: number;
  chartBorder: number;
  chartBorderColor: string;
  labelsSize: number;
  showLabels: boolean;
};

const UserHistorySmallChart = ({
  chartRadius = 90,
  chartBorder = 6,
  chartBorderColor = 'hotpink',
  labelsSize = 9,
  showLabels = false,
}: Props) => {
  const { selectedFriendStats } = useSelectedFriendStats();
  const { stats } = useUserStats();
  const [largeUserChartVisible, setLargeUserChartVisible] = useState(false);
  const [viewCategoryId, setViewCategoryId] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  const handleSetCategoryDetailsModal = (categoryId) => {
    if (!categoryId) {
      return;
    }
    setViewCategoryId(categoryId);
    setDetailsModalVisible(true);
  };

  return (
    <>
      {selectedFriendStats && (
        <View
          style={{ width: chartRadius * 2 + chartBorder * 2, height: "100%" }}
        >
          <Pressable onPress={() => setLargeUserChartVisible(true)}>
            <View
              style={{
                borderRadius: 999,
                borderWidth: chartBorder,

                alignItems: "center",
                borderColor: chartBorderColor,
              }}
            >
              <UserCategoryHistoryChart
                showLabels={showLabels}
                listData={stats}
                radius={chartRadius}
                labelsSize={labelsSize}
                onLongPress={handleSetCategoryDetailsModal}
                showFooterLabel={false}
              />
            </View>
          </Pressable>
        </View>
      )}
      {largeUserChartVisible && (
        <View>
          <PieChartModal
            isVisible={largeUserChartVisible}
            closeModal={() => setLargeUserChartVisible(false)}
            listData={stats}
            // radius={180} this is now the default
            labelsSize={labelsSize * 2}
            onLongPress={handleSetCategoryDetailsModal}
          />
        </View>
      )}
    </>
  );
};

export default UserHistorySmallChart;
