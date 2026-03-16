import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
} from "react-native-reanimated"; 
import AnimatedPieChartWithCallouts from "../headers/AnimatedPieChartWithCallouts";

type Props = {
  listData: object[];
  showLabels: boolean;
  showPercentages: boolean;

  radius: number;
  labelsSize: number;

  showFooterLabel: boolean;
  upDrillCategoryId: () => void;
};

const FriendHistoryBigPie = ({
  upDrillCategoryId,
  showPercentages = false,
  radius = 80,
  labelsSize = 9,
  showLabels = true,
  seriesData,
  darkerOverlayBackgroundColor,
  primaryColor,
  primaryOverlayColor,
  welcomeTextStyle,
  subWelcomeTextStyle,
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
    upDrillCategoryId(categoryId);
    setViewCategoryName(categoryName); 
  };

  const pieScale = useSharedValue(1);
  const pieY = useSharedValue(1);
  const pieX = useSharedValue(1);

  useEffect(() => {
    if (viewCategoryId) {
      pieScale.value = withTiming(0.5, { duration: 200 });
      pieX.value = withSpring(
        -radius * 1.2,
        withTiming(-radius * 1.2, { duration: 200 })
      );
      pieY.value = withTiming(-radius * 0.6, { duration: 200 });
    } else {
      pieScale.value = withTiming(1, { duration: 200 });
      pieX.value = withTiming(1, { duration: 200 });
      pieY.value = withTiming(1, { duration: 200 });
    }
  }, [viewCategoryId]);

 

  return (
    <>
      <Animated.View
        style={[
          // pieScaleStyle,
          {
            // height: !viewCategoryId ? radius * 2 : radius,
               height:   radius * 2 ,
          }, styles.pieWrapper,
        ]}
      >
        <AnimatedPieChartWithCallouts
          duration={400}
          darkerOverlayBackgroundColor={darkerOverlayBackgroundColor}
          primaryColor={primaryColor}
          primaryOverlayColor={primaryOverlayColor}
          welcomeTextStyle={welcomeTextStyle}
          subWelcomeTextStyle={subWelcomeTextStyle}
          data={seriesData}
          showLabels={showLabels}
          showPercentages={showPercentages}
          labelsSize={labelsSize}
          size={radius * 2}
          radius={radius}
          labelLayout={!viewCategoryId ? "" : ""}
          selectedCategoryId={viewCategoryId}
          onSectionPress={handleCategoryPress ? handleCategoryPress : null}
        />
      </Animated.View>
    </>
  );
};


const styles = StyleSheet.create({
  pieWrapper: {
    flexShrink: 1,
    width: "100%",
    alignItems: "center",
    flexDirection: "column",
  },
});

export default FriendHistoryBigPie;
