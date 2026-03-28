// import {
//   Text,
//   View,
//   StyleSheet,
//   Alert,
//   ColorValue,
//   DimensionValue,
// } from "react-native";
// import React, { useState, useEffect } from "react";
// import GlobalPressable from "../appwide/button/GlobalPressable";
// import GeckoMineSvg from "@/app/styles/svgs/gecko-mine";
// import { showModalMessage, showModalMessageAndList } from "@/src/utils/ShowModalMessage";
// import useFriendDash from "@/src/hooks/useFriendDash";
// import useFriendGeckoSessions from "@/src/hooks/GeckoCalls/useFriendGeckoSessions";
// import useFriendGeckoSessionsTimeRange from "@/src/hooks/GeckoCalls/useFriendGeckoSessionsTimeRange";
// import InfiniteScrollList from "../helloes/InfiniteScrollList";
// import { formatDurationFromSeconds } from "./util_formatDurationFromSeconds";
// import ScrollList from "../helloes/ScrollList";
// interface GeckoFooterButtonProps {
//   label?: string;
//   primaryColor: ColorValue;
//   labelFontSize?: number;
//   size: DimensionValue;
//   highlightColor?: string;
//   highlightStrokeWidth?: number;
//   iconStyle?: object;
//   onPress: () => void;
//   onLongPress?: () => void;
//   confirmationRequired?: boolean;
//   confirmationTitle?: string;
//   confirmationMessage?: string;
//   confirmationActionWord?: string;
// }

// const GeckoFooterButton: React.FC<GeckoFooterButtonProps> = ({
//   userId,
//   friendId,
//   friendName,
//   label = "Visual",
//   primaryColor,
//   labelFontSize = 11,
//   size = 130,
//   highlightColor = "limegreen",
//   highlightStrokeWidth = 2,
//   iconStyle = { top: 20, left: 10, overflow: "hidden" },
//   onPress,
//   onLongPress,
//   confirmationRequired = false,
//   confirmationTitle = "",
//   confirmationMessage = "Are you sure?",
//   confirmationActionWord = "Yes",
// }) => {
//   const [isHighlighted, setIsHighlighted] = useState(false);
//   const { friendDash } = useFriendDash({ userId, friendId });

//   const {
//     friendGeckoSessionsFlattened,
//     isFetchingNextPage,
//     fetchNextPage,
//     hasNextPage,
//   } = useFriendGeckoSessions({ friendId });


//   const { friendGeckoSessoionsTimeRange } = useFriendGeckoSessionsTimeRange({friendId: friendId, minutes: 120})

//   const geckoTotalSteps = friendDash?.gecko_data?.total_steps || 0;
//   const geckoTotalDistance = friendDash?.gecko_data?.total_distance || 0;
//   const geckoTotalDuration = friendDash?.gecko_data?.total_duration || 0;
// const formattedDuration = formatDurationFromSeconds(geckoTotalDuration);


//   const handleOnPress = () => {
//     if (isHighlighted) {
//       setIsHighlighted(false);
//       return;
//     }

//     if (confirmationRequired) {
//       Alert.alert(confirmationTitle, confirmationMessage, [
//         {
//           text: "Cancel",
//           onPress: () => console.log("Cancel Pressed"),
//           style: "cancel",
//         },
//         { text: confirmationActionWord, onPress: () => onPress() },
//       ]);
//     } else {
//       onPress();
//     }
//   };

// useEffect(() => {
//   if (!isHighlighted) return;

//   showModalMessageAndList({
//     title: `Gecko stats for ${friendName}`,
//     body: `Total steps: ${geckoTotalSteps} \nTotal distance: ${geckoTotalDistance}  \nTotal duration: ${formattedDuration} `,
//     confirmLabel: "Got it!",
//     onConfirm: () => setIsHighlighted(false),
//     floatingElement: (
//       <GeckoMineSvg
//         width={size}
//         height={size}
//         fill={primaryColor}
//         stroke={highlightColor}
//         strokeWidth={highlightStrokeWidth}
//       />
//     ),
//     listElement: friendGeckoSessionsFlattened?.length ? (
//       <InfiniteScrollList
//         listData={friendGeckoSessionsFlattened}
//         isFetchingNextPage={isFetchingNextPage}
//         fetchNextPage={fetchNextPage}
//         hasNextPage={hasNextPage}
//         onPress={() => {}}
//         triggerScroll={0}
//         primaryColor={primaryColor}
//       />
//     ) : (
//       <Text style={{ color: "#6a6a6a", fontSize: 13 }}>No sessions yet.</Text>
//     ),
//   });
// }, [isHighlighted, friendGeckoSessionsFlattened, isFetchingNextPage]);

//   const handleLongPress = () => {
//     if (isHighlighted) {
//       setIsHighlighted(false);
//       return;
//     }

//     setIsHighlighted(true);
//     onLongPress?.();
//   };

//   return (
//     <GlobalPressable
//       onLongPress={handleLongPress}
//       onPress={handleOnPress}
//       style={styles.container}
//     >
//       <View style={iconStyle}>
//         <GeckoMineSvg
//           width={size}
//           height={size}
//           fill={primaryColor}
//           stroke={isHighlighted ? highlightColor : "none"}
//           strokeWidth={isHighlighted ? highlightStrokeWidth : 0}
//         />
//       </View>

//       <Text
//         style={[styles.text, { fontSize: labelFontSize, color: primaryColor }]}
//       >
//         {label}
//       </Text>
//     </GlobalPressable>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     height: "100%",
//     flex: 1,
//   },
//   text: {
//     marginTop: 4,
//     paddingHorizontal: 6,
//     paddingVertical: 4,
//     borderRadius: 10,
//     fontWeight: "bold",
//   },
// });

// export default GeckoFooterButton;


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
import useFriendDash from "@/src/hooks/useFriendDash";
import useFriendGeckoSessionsTimeRange from "@/src/hooks/GeckoCalls/useFriendGeckoSessionsTimeRange";
import ScrollList from "../helloes/ScrollList";
import { formatDurationFromSeconds } from "./util_formatDurationFromSeconds";

const formatMinutesLabel = (minutes: number): string => {
  if (minutes < 60) return `${minutes}m`;
  if (minutes < 1440) return `${Math.round(minutes / 60)}h`;
  return `${Math.round(minutes / 1440)}d`;
};

interface GeckoFooterButtonProps {
  userId: number;
  friendId: number;
  friendName: string;
  label?: string;
  primaryColor: ColorValue;
  labelFontSize?: number;
  size: DimensionValue;
  highlightColor?: string;
  highlightStrokeWidth?: number;
  iconStyle?: object;
  minutes?: number;
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
  minutes = 120,
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
    friendGeckoSessionsTimeRange,
    sessionTotals,
  } = useFriendGeckoSessionsTimeRange({ friendId, minutes });

  // Overall totals from backend
  const geckoTotalSteps = friendDash?.gecko_data?.total_steps || 0;
  const geckoTotalDistance = friendDash?.gecko_data?.total_distance || 0;
  const geckoTotalDuration = friendDash?.gecko_data?.total_duration || 0;
  const formattedTotalDuration = formatDurationFromSeconds(geckoTotalDuration);

  // Time range totals
  const rangeLabel = formatMinutesLabel(minutes);
  const formattedRangeDuration = formatDurationFromSeconds(sessionTotals.totalDurationSeconds);

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
      body:
        `All time:\n` +
        `  Steps: ${geckoTotalSteps}  •  Distance: ${geckoTotalDistance}\n` +
        `  Duration: ${formattedTotalDuration}\n\n` +
        `Last ${rangeLabel}:\n` +
        `  Steps: ${sessionTotals.totalSteps} (${sessionTotals.stepsPerHour}/hr)\n` +
        `  Distance: ${sessionTotals.totalDistance} (${sessionTotals.distancePerHour}/hr)\n` +
        `  Duration: ${formattedRangeDuration}  •  Sessions: ${sessionTotals.sessionCount}`,
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
      listElement: friendGeckoSessionsTimeRange?.length ? (
        <ScrollList
          listData={friendGeckoSessionsTimeRange}
          primaryColor={primaryColor}
          triggerScroll={0}
        />
      ) : (
        <Text style={{ color: "#6a6a6a", fontSize: 13 }}>
          No sessions in the last {rangeLabel}.
        </Text>
      ),
    });
  }, [isHighlighted, friendGeckoSessionsTimeRange]);

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