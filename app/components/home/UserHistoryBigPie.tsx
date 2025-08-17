import { View, Text } from "react-native";
import React, { useEffect, useState } from "react"; 
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import Pie from "../headers/Pie"; 
type Props = {
  listData: object[];
  showLabels: boolean;
  showPercentages: boolean;
  radius: number;
  labelsSize: number;
  // onLongPress: () => void;
  showFooterLabel: boolean;
    upDrillCategoryId: () => void;
};

const UserHistoryBigPie = ({
 
  upDrillCategoryId,
  seriesData,
 
  showLabels = true,
  showPercentages = false,
  radius = 80,
  labelsSize = 9,
  
}: Props) => { 
 
  const [viewCategoryId, setViewCategoryId] = useState(null);
  const [viewCategoryName, setViewCategoryName] = useState(null);
 


  const handleCategoryPress = (categoryId, categoryName) => {
        if (categoryId === viewCategoryId) {
        setViewCategoryId(null);
    upDrillCategoryId(null);
    setViewCategoryName(null);
    return;
    }
    setViewCategoryId(categoryId);
    setViewCategoryName(categoryName); 
       upDrillCategoryId(categoryId);
    // setHistoryModalVisible(true);
    // console.log(`category ${categoryId} -- ${categoryName} pressed!`);
  };

  const pieScale = useSharedValue(1);
  const pieY = useSharedValue(1);
  const pieX = useSharedValue(1);

    useEffect(() => {
      if (viewCategoryId) {
        pieScale.value = withTiming(0.5, { duration: 200 });
        pieX.value = withSpring(-radius * 1.2, withTiming(-radius * 1.2, { duration: 200 }));
        pieY.value = withTiming(-radius * .6, { duration: 200 });
      } else {
        pieScale.value = withTiming(1, { duration: 200 });
        pieX.value = withTiming(1, { duration: 200 });
        pieY.value = withTiming(1, { duration: 200 });
      }
    }, [viewCategoryId]);

      const pieScaleStyle = useAnimatedStyle(() => {
        return {
          transform: [{ scale: pieScale.value }, { translateX: pieX.value }, { translateY: pieY.value}],
        };
      });
 
  return (
    <>  
      <Animated.View
        style={[
          pieScaleStyle,
          {
            height: !viewCategoryId ? radius * 2 : radius,
            flexShrink: 1,
            width: "100%",
            //  marginHorizontal: 10,
            alignItems: "center",
            flexDirection: "column",
          //  backgroundColor: "orange",
          },
        ]}
      >
          <Pie
          seriesData={seriesData}
            showPercentages={showPercentages}
            showLabels={showLabels}
      
            widthAndHeight={radius * 2}
            labelsSize={labelsSize}
            onSectionPress={handleCategoryPress}
    
          />
 
        </Animated.View>
 
    </>
  );
};

export default UserHistoryBigPie;
