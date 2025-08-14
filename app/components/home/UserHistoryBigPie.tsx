import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import useStatsSortingFunctions from "@/src/hooks/useStatsSortingFunctions";

import Pie from "../headers/Pie";
import CategoryHistoryModal from "../headers/CategoryHistoryModal";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
type Props = {
  listData: object[];
  showLabels: boolean;
  showPercentages: boolean;
  radius: number;
  labelsSize: number;
  // onLongPress: () => void;
  showFooterLabel: boolean;
};

const UserHistoryBigPie = ({
  data,
  seriesData,
  listData,
  showLabels = true,
  showPercentages = false,
  radius = 80,
  labelsSize = 9,
 
  showFooterLabel = true,
}: Props) => {
 
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const { themeStyles } = useGlobalStyle();
  const [viewCategoryId, setViewCategoryId] = useState(null);
  const [viewCategoryName, setViewCategoryName] = useState(null);
 

  const handleCategoryPress = (categoryId, categoryName) => {
    setViewCategoryId(categoryId);
    setViewCategoryName(categoryName); 
    setHistoryModalVisible(true);
    console.log(`category ${categoryId} -- ${categoryName} pressed!`);
  };

 
  return (
    <> 
        <View
          style={{
            height: "100%",
            marginHorizontal: 10,
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Pie
          seriesData={seriesData}
            showPercentages={showPercentages}
            showLabels={showLabels}
      
            widthAndHeight={radius * 2}
            labelsSize={labelsSize}
            onSectionPress={handleCategoryPress}
    
          />
          {showFooterLabel && (
            <View style={{}}>
              <Text
                style={[
                  themeStyles.primaryText,
                  { fontWeight: "bold", fontSize: 13 },
                ]}
              >
                All friends
              </Text>
            </View>
          )}
        </View>
    
      {historyModalVisible && viewCategoryId && viewCategoryName && (
        <View>
          <CategoryHistoryModal
            isVisible={historyModalVisible}
            closeModal={() => setHistoryModalVisible(false)}
            categoryId={viewCategoryId}
            title={viewCategoryName}
          />
        </View>
      )}
    </>
  );
};

export default UserHistoryBigPie;
