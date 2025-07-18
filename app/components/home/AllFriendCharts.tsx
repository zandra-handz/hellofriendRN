import { View, Text } from "react-native";
import React, {   useState, useEffect } from "react";  
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";  
import { ScrollView } from "react-native-gesture-handler"; 
 
import CategoryDetailsModal from "../headers/CategoryDetailsModal";
import { useSelectedFriendStats } from "@/src/context/SelectedFriendStatsContext";
import { useUserStats } from "@/src/context/UserStatsContext"; 
import FriendCategoryHistoryChart from "./FriendCategoryHistoryChart";
import UserCategoryHistoryChart from "./UserCategoryHistoryChart";
type Props = {
  selectedFriend: boolean;
  outerPadding: DimensionValue;
};

//selectedFriend is the full friend object so can access the fields (.name, etc)
const AllFriendCharts = ({ selectedFriend, outerPadding }: Props) => {
  const { themeStyles  } = useGlobalStyle();
 
  const { stats } = useUserStats(); 
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
 

  const { selectedFriendStats } = useSelectedFriendStats();

 
  const HEIGHT = 270;

  const CHART_RADIUS = 90;
  const CHART_STROKE_WIDTH = 8;
  const CHART_OUTER_STROKE_WIDTH = 10;
  const GAP = 0.02;

  const LABELS_SIZE = 9;
  const LABELS_DISTANCE_FROM_CENTER = -34;
  const LABELS_SLICE_END = 4;
  const [viewCategoryId, setViewCategoryId] = useState(null);

  const handleSetCategoryDetailsModal = (categoryId) => {
    if (!categoryId) {
      return;
    }
    setViewCategoryId(categoryId);
    setDetailsModalVisible(true);
  };

  // useEffect(() => {
  //   if (selectedFriendStats){
  //     console.log('~~~~~~~~~SELECTED FRIEND STATS!', selectedFriendStats);
  //   }

  // }, [selectedFriendStats]);

  useEffect(() => {
    if (selectedFriendStats) { 
      console.log(`aaaand friend stats: `, selectedFriendStats);
    }
  }, [ selectedFriendStats]);

  return (
    <View
      style={[
        {
          overflow: "hidden",
          height: HEIGHT,
          width: "100%",
          padding: 10,
          paddingBottom: 10,
          backgroundColor: themeStyles.overlayBackgroundColor.backgroundColor,
          borderRadius: 20,
        },
      ]}
    >
      <View
        style={{
          borderRadius: 20,
          flexDirection: "row",
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",

          // backgroundColor: 'orange',
          marginBottom: outerPadding,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <MaterialCommunityIcons
            // name="comment-check"
            //  name="message-text-clock"
            name="heart-pulse"
            // name="graph"
            size={20}
            color={themeStyles.primaryText.color}
            style={{ marginBottom: 0 }}
          />
          <Text
            style={[
              themeStyles.primaryText,
              {
                marginLeft: 6,
                marginRight: 12,
                fontWeight: "bold",
              },
            ]}
          >
            Talking Points History
          </Text>
        </View>
        {/* <LabeledArrowButton
          color={themeStyles.primaryText.color}
          label="View"
          opacity={0.7}
          onPress={() => navigation.navigate("Helloes")}
        /> */}
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {selectedFriendStats && (
          <FriendCategoryHistoryChart
            friendData={selectedFriend}
            
            listData={selectedFriendStats}
            radius={CHART_RADIUS}
            labelsSize={LABELS_SIZE}
            onLongPress={handleSetCategoryDetailsModal}
          />
        )}

        {stats && stats.length > 0 && (
          <UserCategoryHistoryChart
            listData={stats}
            radius={CHART_RADIUS}
            onLongPress={handleSetCategoryDetailsModal}
            labelsSize={5}
          />
        )}
      </ScrollView>

      <View style={{ width: "100%", height: 10 }}></View>
      {detailsModalVisible && (
        <View>
          <CategoryDetailsModal
            isVisible={detailsModalVisible}
            closeModal={() => setDetailsModalVisible(false)}
            categoryId={viewCategoryId}
          />
        </View>
      )}
    </View>
  );
};

export default AllFriendCharts;
