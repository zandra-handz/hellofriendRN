import {
  Text,
  View,
  StyleSheet,
  Alert,
  ColorValue,
  DimensionValue,
} from "react-native";
import React, { useState, useEffect } from "react";
import GlobalPressable from "../appwide/button/GlobalPressable";
import GeckoMineSvg from "@/app/styles/svgs/gecko-mine";
import { showModalMessageAndList } from "@/src/utils/ShowModalMessage";
import useUserGeckoSessionsTimeRange from "@/src/hooks/GeckoCalls/useUserGeckoSessionsTimeRange";
import InfiniteScrollList from "../helloes/InfiniteScrollList";
import { formatDurationFromSeconds } from "./util_formatDurationFromSeconds";

const formatMinutesLabel = (minutes: number): string => {
  if (minutes < 60) return `${minutes}m`;
  if (minutes < 1440) return `${Math.round(minutes / 60)}h`;
  return `${Math.round(minutes / 1440)}d`;
};

interface UserGeckoFooterButtonProps {
  label?: string;
  primaryColor: ColorValue;
  labelFontSize?: number;
  size: DimensionValue;
  highlightColor?: string;
  highlightStrokeWidth?: number;
  iconStyle?: object;
  minutes?: number;
  geckoCombinedData?: any;
  onPress: () => void;
  onLongPress?: () => void;
  confirmationRequired?: boolean;
  confirmationTitle?: string;
  confirmationMessage?: string;
  confirmationActionWord?: string;
}

const UserGeckoFooterButton: React.FC<UserGeckoFooterButtonProps> = ({
  label = "Visual",
  primaryColor,
  labelFontSize = 11,
  size = 130,
  highlightColor = "limegreen",
  highlightStrokeWidth = 2,
  iconStyle = { top: 20, left: 10, overflow: "hidden" },
  minutes = 120,
  geckoCombinedData,
  onPress,
  onLongPress,
  confirmationRequired = false,
  confirmationTitle = "",
  confirmationMessage = "Are you sure?",
  confirmationActionWord = "Yes",
}) => {
  const [isHighlighted, setIsHighlighted] = useState(false);

  const {
    userGeckoSessionsTimeRange,
    userSessionTotals,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useUserGeckoSessionsTimeRange({ minutes });

  const geckoTotalSteps = geckoCombinedData?.total_steps || 0;
  const geckoTotalDistance = geckoCombinedData?.total_distance || 0;
  const geckoTotalDuration = geckoCombinedData?.total_duration || 0;
  const formattedTotalDuration = formatDurationFromSeconds(geckoTotalDuration);

  const rangeLabel = formatMinutesLabel(minutes);
  const formattedRangeDuration = formatDurationFromSeconds(
    userSessionTotals?.total_duration_seconds ?? 0
  );

  const handleOnPress = () => {
    if (isHighlighted) {
      setIsHighlighted(false);
      return;
    }

    if (confirmationRequired) {
      Alert.alert(confirmationTitle, confirmationMessage, [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: confirmationActionWord, onPress: () => onPress() },
      ]);
    } else {
      onPress();
    }
  };

  useEffect(() => {
    if (!isHighlighted) return;

    showModalMessageAndList({
      title: `Your gecko stats`,
      body:
        `All time:\n` +
        `  Steps: ${geckoTotalSteps}  •  Distance: ${geckoTotalDistance}\n` +
        `  Duration: ${formattedTotalDuration}\n\n` +
        `Last ${rangeLabel}:\n` +
        `  Steps: ${userSessionTotals?.total_steps ?? 0} (${userSessionTotals?.steps_per_hour ?? 0}/hr)\n` +
        `  Distance: ${userSessionTotals?.total_distance ?? 0} (${userSessionTotals?.distance_per_hour ?? 0}/hr)\n` +
        `  Duration: ${formattedRangeDuration}  •  Sessions: ${userSessionTotals?.session_count ?? 0}`,
      confirmLabel: "Got it!",
      onConfirm: () => setIsHighlighted(false),
      floatingElement: (
        <GeckoMineSvg
          width={size}
          height={size}
          fill={primaryColor}
          stroke={highlightColor}
          strokeWidth={highlightStrokeWidth}
        />
      ),
      listElement: userGeckoSessionsTimeRange?.length ? (
        <InfiniteScrollList
          listData={userGeckoSessionsTimeRange}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          onPress={() => {}}
          triggerScroll={0}
          primaryColor={primaryColor}
        />
      ) : (
        <Text style={{ color: "#6a6a6a", fontSize: 13 }}>
          No sessions in the last {rangeLabel}.
        </Text>
      ),
    });
  }, [isHighlighted, userGeckoSessionsTimeRange, isFetchingNextPage]);

//   const handleLongPress = () => {
//     if (isHighlighted) {
//       setIsHighlighted(false);
//       return;
//     }

//     setIsHighlighted(true);
//     onLongPress?.();
//   };

const handleOnPress = () => {
    if (isHighlighted) {
      setIsHighlighted(false);
      return;
    }

    setIsHighlighted(true);
  };

  return (
    <GlobalPressable
      onLongPress={handleLongPress}
      onPress={handleOnPress}
      style={styles.container}
    >
      <View style={iconStyle}>
        <GeckoMineSvg
          width={size}
          height={size}
          fill={primaryColor}
          stroke={isHighlighted ? highlightColor : "none"}
          strokeWidth={isHighlighted ? highlightStrokeWidth : 0}
        />
      </View>

      <Text
        style={[styles.text, { fontSize: labelFontSize, color: primaryColor }]}
      >
        {label}
      </Text>
    </GlobalPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    flex: 1,
  },
  text: {
    marginTop: 4,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 10,
    fontWeight: "bold",
  },
});

export default UserGeckoFooterButton;