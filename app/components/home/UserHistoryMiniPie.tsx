import { View  } from "react-native";
import React  from "react";
 
import Pie from "../headers/Pie"; 
type Props = {
  listData: object[];
  showLabels: boolean;
  showPercentages: boolean;
  radius: number;
  labelsSize: number;
  // onLongPress: () => void;
  showFooterLabel: boolean;
};

const UserHistoryMiniPie = ({
 
  seriesData, 
  showLabels = true,
  showPercentages = false,
  radius = 80,
  labelsSize = 9, 
}: Props) => {
 
 

 
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
          
    
          />
 
        </View>
 
    </>
  );
};

export default UserHistoryMiniPie;
