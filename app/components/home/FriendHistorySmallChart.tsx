import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import FriendCategoryHistoryChart from "./FriendCategoryHistoryChart";
import { useSelectedFriendStats } from "@/src/context/SelectedFriendStatsContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import PieChartModal from "../headers/PieChartModal";

type Props = {
  chartRadius: number;
  chartBorder: number;
  chartBorderColor: string;
  labelsSize: number;
  showLabels: boolean;
};

const FriendHistorySmallChart = ({
  chartRadius = 90,
  chartBorder = 6,
  chartBorderColor = 'hotpink',
  labelsSize = 9,
  showLabels = false,
}: Props) => {
  const { selectedFriendStats } = useSelectedFriendStats();
  const { selectedFriend } = useSelectedFriend();
  const [largeFriendChartVisible, setLargeFriendChartVisible] = useState(false);
  const [viewCategoryId, setViewCategoryId] = useState<Number | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

 
  const handleSetCategoryDetailsModal = (categoryId: number | null) => {
    if (!categoryId) {
      return;
    }
    setViewCategoryId(categoryId);
    setDetailsModalVisible(true);
  };

  return (
    <>
      {selectedFriendStats && selectedFriendStats.length > 0 && (
        <View style={{ width: (chartRadius * 2) + (chartBorder * 2), height: "100%" }}>
       
          <Pressable onPress={() => setLargeFriendChartVisible(true)}>
            <View
              style={{
                borderRadius: 999,
                borderWidth: chartBorder,
              
                alignItems: "center",
                borderColor: chartBorderColor,
              }}
            >
              <FriendCategoryHistoryChart
                showLabels={showLabels}
                friendData={selectedFriend}
                listData={selectedFriendStats}
                radius={chartRadius}
                labelsSize={labelsSize}
                onLongPress={handleSetCategoryDetailsModal}
              />
            </View>
          </Pressable>
        </View>
      )}
      {largeFriendChartVisible && (
        <View>
          <PieChartModal
            isVisible={largeFriendChartVisible}
            closeModal={() => setLargeFriendChartVisible(false)}
            friendData={selectedFriend}
            listData={selectedFriendStats}
            // radius={180} this is now the default
            labelsSize={labelsSize * 2}
            onLongPress={handleSetCategoryDetailsModal}
          />
        </View>
      )}
    </>
  );
};

export default FriendHistorySmallChart;
