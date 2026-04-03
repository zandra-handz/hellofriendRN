// import React from "react";
// import { View, StyleSheet } from "react-native";

// import SvgIcon from "@/app/styles/SvgIcons";
// import GlobalPressable from "../../appwide/button/GlobalPressable";
// import useUserPoints from "@/src/hooks/useUserPoints";
// import AnimatedClimber from "@/app/screens/fidget/AnimatedClimber";
// import manualGradientColors from "@/app/styles/StaticColors";
// const CategoryFooterButton = ({ skiaFontLarge, textColor, onPress }) => {
//   const circleSize = 56;

//   const { totalPoints } = useUserPoints();

//   const renderProfileIcon = () => {
//     return (
//       <View
//         style={[
//           styles.outerTreeWrapper,
//           {
//             borderColor: manualGradientColors.lightColor,

//             borderWidth: 2,
//             width: circleSize,
//             height: circleSize,
//             borderRadius: 999,
//           },
//         ]}
//       >
//         <View style={styles.treeWrapper}>
//           {skiaFontLarge && (
//             <AnimatedClimber
//               total={totalPoints}
//               skiaFont={skiaFontLarge}
//               textColor={textColor}
//             />
//           )}
//         </View>
//       </View>
//     );
//     // }
//   };

//   return (
//     <View style={styles.container}>
//       <GlobalPressable onPress={onPress} style={{}}>
//         <View>
//           {renderProfileIcon()}
//           <View style={styles.timerWrapper}></View>
//         </View>
//       </GlobalPressable>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     width: "100%",
//     alignItems: "center",
//     justifyContent: "center",
//     alignContent: "center",
//     flexDirection: "row",
//   },
//   outerTreeWrapper: {
//     alignItems: "center",
//     justifyContent: "center",
//     alignSelf: "center",
//     marginBottom: 18,
//   },
//   treeWrapper: {
//     flex: 1,
//     position: "absolute",
//     right: 0,
//     left: 0,
//     alignItems: "center",
//     justifyContent: "center",
//     flexGrow: 1,
//     top: 0,
//     bottom: 0,
//   },
//   timerWrapper: {
//     position: "absolute",
//     top: -13,
//     right: 13,
//     zIndex: 1000,
//   },
//   loadingFriendProfileButtonWrapper: {
//     flex: 0.4,
//     paddingRight: 0,
//     justifyContent: "flex-start",
//     alignItems: "flex-start",
//     alignContent: "flex-start",
//   },
//   friendProfileButtonText: {
//     fontSize: 17,
//     paddingVertical: 0,
//     alignSelf: "center",
//     fontFamily: "Poppins-Bold",
//     paddingLeft: 0,
//   },
// });

// export default CategoryFooterButton;

import React, { useState, useEffect, useMemo } from "react";
import { Text, StyleSheet } from "react-native";
import SvgIcon from "@/app/styles/SvgIcons";
import GlobalPressable from "../../appwide/button/GlobalPressable";
import useUserGeckoSessionsTimeRange from "@/src/hooks/GeckoCalls/useUserGeckoSessionsTimeRange";
import useFriendListAndUpcoming from "@/src/hooks/usefriendListAndUpcoming";
import { showModalMessageAndList } from "@/src/utils/ShowModalMessage";
import InfiniteScrollList from "../../helloes/InfiniteScrollList";
import { formatDurationFromSeconds } from "../../headers/util_formatDurationFromSeconds";

const formatMinutesLabel = (minutes: number): string => {
  if (minutes < 60) return `${minutes}m`;
  if (minutes < 1440) return `${Math.round(minutes / 60)}h`;
  return `${Math.round(minutes / 1440)}d`;
};

const GeckoHistoryFooterButton = ({
  textColor,
  userId,
  geckoCombinedData,
  minutes = 720, // 12 hours
  highlightColor = "limegreen",
  label = "gecko",
  labelFontSize = 11,
}) => {
  const [isHighlighted, setIsHighlighted] = useState(false);

  const { friendListAndUpcoming } = useFriendListAndUpcoming({
    userId,
    enabled: true,
  });

  const friendNameMap = useMemo(() => {
    const map: Record<number, string> = {};
    if (friendListAndUpcoming?.friends) {
      for (const f of friendListAndUpcoming.friends) {
        map[f.id] = f.name;
      }
    }
    return map;
  }, [friendListAndUpcoming?.friends]);

  const {
    userGeckoSessionsTimeRange,
    userSessionTotals,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useUserGeckoSessionsTimeRange({ minutes });

  const sessionsWithFriendNames = useMemo(() => {
    return userGeckoSessionsTimeRange.map((session) => ({
      ...session,
      friend_name: session.friend ? friendNameMap[session.friend] ?? "Unknown" : null,
    }));
  }, [userGeckoSessionsTimeRange, friendNameMap]);

  const geckoTotalSteps = geckoCombinedData?.total_steps || 0;
  const geckoTotalDistance = geckoCombinedData?.total_distance || 0;
  const geckoTotalDuration = geckoCombinedData?.total_duration || 0;
  const formattedTotalDuration = formatDurationFromSeconds(geckoTotalDuration);

  const rangeLabel = formatMinutesLabel(minutes);
  const formattedRangeDuration = formatDurationFromSeconds(
    userSessionTotals?.total_duration_seconds ?? 0
  );

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
      listElement: sessionsWithFriendNames?.length ? (
        <InfiniteScrollList
          listData={sessionsWithFriendNames}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          onPress={() => {}}
          triggerScroll={0}
          primaryColor={textColor}
        />
      ) : (
        <Text style={{ color: "#6a6a6a", fontSize: 13 }}>
          No sessions in the last {rangeLabel}.
        </Text>
      ),
    });
  }, [isHighlighted, sessionsWithFriendNames, isFetchingNextPage]);

  const handlePress = () => {
    if (isHighlighted) {
      setIsHighlighted(false);
      return;
    }
    setIsHighlighted(true);
  };

  const iconColor = isHighlighted ? highlightColor : textColor;

  return (
    <GlobalPressable onPress={handlePress} onLongPress={() => {}} style={styles.container}>
      <SvgIcon name="sprout_outline" size={28} color={iconColor} />
      <Text style={[styles.text, { fontSize: labelFontSize, color: iconColor }]}>
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

export default GeckoHistoryFooterButton;