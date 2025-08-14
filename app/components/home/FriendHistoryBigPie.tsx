import { View, Text } from "react-native";
import React, { useEffect, useState } from "react"; 
import Pie from "../headers/Pie";
import CategoryFriendHistoryModal from "../headers/CategoryFriendHistoryModal";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
type Props = {
  friendData: object;
  listData: object[];
  showLabels: boolean;
  showPercentages: boolean;

  radius: number;
  labelsSize: number;
 
  showFooterLabel: boolean;
};

const FriendHistoryBigPie = ({
  friendData,
 
  showPercentages = false,
  radius = 80,
  labelsSize = 9,
  showLabels = true,
  seriesData,
 
  showFooterLabel,
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
                {friendData?.name}
              </Text>
            </View>
          )}
        </View>
 
      {historyModalVisible &&
        viewCategoryId &&
        viewCategoryName &&
        friendData && (
          <View>
            <CategoryFriendHistoryModal
              isVisible={historyModalVisible}
              closeModal={() => setHistoryModalVisible(false)}
              categoryId={viewCategoryId}
              categoryName={viewCategoryName}
              friendId={friendData.id}
              title={viewCategoryName}
            />
          </View>
        )}
    </>
  );
};

export default FriendHistoryBigPie;
