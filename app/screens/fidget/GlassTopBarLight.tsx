import { View, Text, StyleSheet } from "react-native";
import React, { useRef } from "react";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from "react-native-reanimated";
import { useFocusEffect } from "@react-navigation/native";
import useGeckoScoreState from "@/src/hooks/useGeckoScoreState";
import useCurrentLiveSesh from "@/src/hooks/LiveSeshCalls/useCurrentLiveSesh";
import useUser from "@/src/hooks/useUser";
type Props = {
  textColor: string;
  backgroundColor: string;

  selectedFriend: { name: string };
  TIME_SCORE: number;
  DAYS_SINCE: number;
  highlight: boolean;
};

const GlassTopBarLight = ({
  textColor,
  backgroundColor,
  friendName,
  TIME_SCORE,
  DAYS_SINCE,
  highlight,
}: Props) => {
  const translateY = useSharedValue(-300); // Start off-screen above
  const hasAnimated = useRef(false);

  const { geckoScoreState } = useGeckoScoreState();
  const { user } = useUser();
  const { currentLiveSesh } = useCurrentLiveSesh({
    userId: user?.id ?? 0,
    enabled: !!user?.id,
  });

  const isHostingLiveSesh =
    !!currentLiveSesh?.is_host &&
    !!currentLiveSesh?.expires_at &&
    new Date(currentLiveSesh.expires_at).getTime() > Date.now();

  useFocusEffect(
    React.useCallback(() => {
      if (!hasAnimated.current) {
        translateY.value = withSpring(0, {
          damping: 40,
          stiffness: 500,
        });
        hasAnimated.current = true;
      }

      return () => {
        translateY.value = -300;
        hasAnimated.current = false;
      };
    }, []),
  );

  const containerAnimationStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        containerAnimationStyle,
        styles.statsWrapper,
        {
          backgroundColor: backgroundColor,
          borderWidth: highlight ? 2 : 0,
          borderColor: textColor,
        },
      ]}
    >
      <Text style={[styles.friendText, { color: textColor }]}>
        {friendName}
      </Text>

      <Text style={[styles.statsText, { color: textColor }]}>
        Health: {TIME_SCORE}%{"     "}
        <Text style={[styles.statsText, { color: textColor }]}>
          Days since: {DAYS_SINCE} 
        </Text>
        
      </Text>
        {isHostingLiveSesh ? (
          <View style={styles.liveSeshRow}>
            <View style={styles.liveDot} />
            <Text style={[styles.statsText, { color: textColor }]}>
              Hosting live sesh with {currentLiveSesh?.other_user_username}
            </Text>
          </View>
        ) : (
          <Text style={[styles.statsText, { color: textColor }]}>
            DEBUG Energy: {geckoScoreState?.energy}
          </Text>
        )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  //   statsWrapper: {
  //     height: 106,
  //     padding: 20,
  //     paddingHorizontal: 20,
  //     top: 60,
  //     left: 16,
  //     flex: 1,
  //     position: "absolute",
  //     flexDirection: "column",
  //     borderRadius: 30,
  //   },
  statsWrapper: {
    // height: 110,
    padding: 20,
    paddingHorizontal: 40,
    paddingTop: 20,
    width: "90%",
    alignSelf: "center",
    alignItems: "center",
    top: 60,
    // left: 16,
    flex: 1,
    position: "absolute",
    flexDirection: "column",
    borderRadius: 70,
  },
  statsText: {
    // fontWeight: "bold",
    fontSize: 16,
    lineHeight: 22,
  },
  liveSeshRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#7FE629",
  },
  friendText: {
    fontWeight: "bold",
    fontSize: 18,
    lineHeight: 32,
  },
});

export default GlassTopBarLight;
