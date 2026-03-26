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
import { showModalMessage, showModalMessageAndList } from "@/src/utils/ShowModalMessage";
import useFriendDash from "@/src/hooks/useFriendDash";
import useFriendGeckoSessions from "@/src/hooks/GeckoCalls/useFriendGeckoSessions";
import InfiniteScrollList from "../helloes/InfiniteScrollList";
import { formatDurationFromSeconds } from "./util_formatDurationFromSeconds";
interface GeckoFooterButtonProps {
  label?: string;
  primaryColor: ColorValue;
  labelFontSize?: number;
  size: DimensionValue;
  highlightColor?: string;
  highlightStrokeWidth?: number;
  iconStyle?: object;
  onPress: () => void;
  onLongPress?: () => void;
  confirmationRequired?: boolean;
  confirmationTitle?: string;
  confirmationMessage?: string;
  confirmationActionWord?: string;
}

const GeckoFooterButton: React.FC<GeckoFooterButtonProps> = ({
  userId,
  friendId,
  friendName,
  label = "Visual",
  primaryColor,
  labelFontSize = 11,
  size = 130,
  highlightColor = "limegreen",
  highlightStrokeWidth = 2,
  iconStyle = { top: 20, left: 10, overflow: "hidden" },
  onPress,
  onLongPress,
  confirmationRequired = false,
  confirmationTitle = "",
  confirmationMessage = "Are you sure?",
  confirmationActionWord = "Yes",
}) => {
  const [isHighlighted, setIsHighlighted] = useState(false);
  const { friendDash } = useFriendDash({ userId, friendId });

  const {
    friendGeckoSessionsFlattened,
    fetchUntilIndex,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useFriendGeckoSessions({ friendId });

  const geckoTotalSteps = friendDash?.gecko_data?.total_steps || 0;
  const geckoTotalDistance = friendDash?.gecko_data?.total_distance || 0;
  const geckoTotalDuration = friendDash?.gecko_data?.total_duration || 0;
const formattedDuration = formatDurationFromSeconds(geckoTotalDuration);


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
    title: `Gecko stats for ${friendName}`,
    body: `Total steps: ${geckoTotalSteps} \nTotal distance: ${geckoTotalDistance}  \nTotal duration: ${formattedDuration} `,
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
    listElement: friendGeckoSessionsFlattened?.length ? (
      <InfiniteScrollList
        listData={friendGeckoSessionsFlattened}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        onPress={() => {}}
        triggerScroll={0}
        primaryColor={primaryColor}
      />
    ) : (
      <Text style={{ color: "#6a6a6a", fontSize: 13 }}>No sessions yet.</Text>
    ),
  });
}, [isHighlighted, friendGeckoSessionsFlattened, isFetchingNextPage]);

  const handleLongPress = () => {
    if (isHighlighted) {
      setIsHighlighted(false);
      return;
    }

    setIsHighlighted(true);
    onLongPress?.();
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

export default GeckoFooterButton;