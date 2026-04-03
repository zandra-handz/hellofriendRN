import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import GlobalPressable from "../../appwide/button/GlobalPressable";
import AnimatedClimber from "@/app/screens/fidget/AnimatedClimber";
import manualGradientColors from "@/app/styles/StaticColors";
import useUserGeckoPointsLedger from "@/src/hooks/GeckoCalls/useUserGeckoPointsLedger";
import { showModalMessageAndList } from "@/src/utils/ShowModalMessage";
import GeckoPointsLedgerList from "../../helloes/GeckoPointsLedgerList";

const GeckoPointsFooterButton = ({
  skiaFontLarge,
  textColor,
  geckoCombinedData,
  highlightColor = "limegreen",
}: {
  skiaFontLarge: any;
  textColor: string;
  geckoCombinedData: any;
  highlightColor?: string;
}) => {
  const circleSize = 56;
  const totalPoints = geckoCombinedData?.total_gecko_points ?? 0;
  const [isHighlighted, setIsHighlighted] = useState(false);

  const {
    userGeckoPointsLedgerFlattened,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useUserGeckoPointsLedger({});

  useEffect(() => {
    if (!isHighlighted) return;

    showModalMessageAndList({
      title: `Your gecko points`,
      body: `Total points: ${totalPoints}`,
      confirmLabel: "Got it!",
      onConfirm: () => setIsHighlighted(false),
      listElement: userGeckoPointsLedgerFlattened?.length ? (
        <GeckoPointsLedgerList
          listData={userGeckoPointsLedgerFlattened}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          triggerScroll={0}
          primaryColor={textColor}
        />
      ) : (
        <Text style={{ color: "#6a6a6a", fontSize: 13 }}>
          No points yet.
        </Text>
      ),
    });
  }, [isHighlighted, userGeckoPointsLedgerFlattened, isFetchingNextPage]);

  const handlePress = () => {
    if (isHighlighted) {
      setIsHighlighted(false);
      return;
    }
    setIsHighlighted(true);
  };

  const borderColor = isHighlighted
    ? highlightColor
    : manualGradientColors.lightColor;

  const renderProfileIcon = () => {
    return (
      <View
        style={[
          styles.outerTreeWrapper,
          {
            borderColor,
            borderWidth: 2,
            width: circleSize,
            height: circleSize,
            borderRadius: 999,
          },
        ]}
      >
        <View style={styles.treeWrapper}>
          {skiaFontLarge && (
            <AnimatedClimber
              total={totalPoints}
              skiaFont={skiaFontLarge}
              textColor={textColor}
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <GlobalPressable onPress={handlePress} style={{}}>
        <View>
          {renderProfileIcon()}
          <View style={styles.timerWrapper}></View>
        </View>
      </GlobalPressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    flexDirection: "row",
  },
  outerTreeWrapper: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 18,
  },
  treeWrapper: {
    flex: 1,
    position: "absolute",
    right: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
    top: 0,
    bottom: 0,
  },
  timerWrapper: {
    position: "absolute",
    top: -13,
    right: 13,
    zIndex: 1000,
  },
});

export default GeckoPointsFooterButton;
