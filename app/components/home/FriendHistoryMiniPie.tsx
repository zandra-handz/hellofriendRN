import { View } from "react-native";
import React from "react";
import Pie from "../headers/Pie";
type Props = {
  listData: object[];
  showLabels: boolean;
  showPercentages: boolean;
  colors: any;
  seriesData: any;
  radius: number;
  labelsSize: number;

  showFooterLabel: boolean;
};

const FriendHistoryMiniPie = ({
  seriesData,
  showPercentages = false,
  radius = 80,
  labelsSize = 9,
  showLabels = true,

  darkerOverlayBackgroundColor,
  primaryColor,
  primaryOverlayColor,
  welcomeTextStyle,
  subWelcomeTextStyle,
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
          darkerOverlayBackgroundColor={darkerOverlayBackgroundColor}
          primaryColor={primaryColor}
          primaryOverlayColor={primaryOverlayColor}
          welcomeTextStyle={welcomeTextStyle}
          subWelcomeTextStyle={subWelcomeTextStyle}
          showPercentages={showPercentages}
          showLabels={showLabels}
          seriesData={seriesData}
          widthAndHeight={radius * 2}
          labelsSize={labelsSize}
        />
      </View>
    </>
  );
};

export default FriendHistoryMiniPie;
