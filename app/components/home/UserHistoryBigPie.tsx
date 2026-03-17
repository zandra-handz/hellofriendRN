import { StyleSheet, TextStyle } from "react-native";
import React, { useEffect, useState } from "react";
import AnimatedPieChart from "../headers/AnimatedPieChart";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
} from "react-native-reanimated";

import AnimatedPieChartGloopy from "../headers/AnimatedPieChartGloopy";
import AnimatedPieChartWithCallouts from "../headers/AnimatedPieChartWithCallouts";
type SeriesItem = {
  user_category: number;
  name: string;
  size: number;
  value: number;
  label: {
    text: string;
    fontFamily: string;
    color: string;
    fontSize: number;
  };
  color: string;
};

type Props = {
  seriesData: SeriesItem[];
  showLabels?: boolean;
  showPercentages?: boolean;
  radius?: number;
  labelsSize?: number;
  showFooterLabel?: boolean;
  upDrillCategoryId: (id: number | null) => void;
  darkerOverlayBackgroundColor: string;
  primaryColor: string;
  primaryOverlayColor: string;
  welcomeTextStyle: TextStyle;
  subWelcomeTextStyle: TextStyle;
};

const UserHistoryBigPie = ({
  upDrillCategoryId,
  seriesData,

  showLabels = true,
  showPercentages = false,
  radius = 80,
  labelsSize = 9,

  darkerOverlayBackgroundColor,
  primaryColor,
  primaryOverlayColor,
  welcomeTextStyle,
  subWelcomeTextStyle,
}: Props) => {
  const [viewCategoryId, setViewCategoryId] = useState<number | null>(null);
  const [viewCategoryName, setViewCategoryName] = useState<string | null>(null);

  const handleCategoryPress = (categoryId: number, categoryName: string) => {
    if (categoryId === viewCategoryId) {
      setViewCategoryId(null);
      upDrillCategoryId(null);
      setViewCategoryName(null);
      return;
    }
    setViewCategoryId(categoryId);
    setViewCategoryName(categoryName);
    upDrillCategoryId(categoryId);
  };

  const pieScale = useSharedValue(1);
  const pieY = useSharedValue(1);
  const pieX = useSharedValue(1);

  useEffect(() => {
    if (viewCategoryId) {
      pieScale.value = withTiming(0.5, { duration: 200 });
      pieX.value = withSpring(
        -radius * 1.2,
        withTiming(-radius * 1.2, { duration: 200 }),
      );
      pieY.value = withTiming(-radius * 0.6, { duration: 200 });
    } else {
      pieScale.value = withTiming(1, { duration: 200 });
      pieX.value = withTiming(1, { duration: 200 });
      pieY.value = withTiming(1, { duration: 200 });
    }
  }, [viewCategoryId]);

  // const pieScaleStyle = useAnimatedStyle(() => {
  //   return {
  //     transform: [
  //       { scale: pieScale.value },
  //       { translateX: pieX.value },
  //       { translateY: pieY.value },
  //     ],
  //   };
  // });

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
        <AnimatedPieChartGloopy
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

export default UserHistoryBigPie;