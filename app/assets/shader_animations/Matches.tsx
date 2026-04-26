import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import Animated, {
  SharedValue,
  useAnimatedReaction,
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming,
  runOnJS,
  Easing,
} from "react-native-reanimated";
import SvgIcon from "@/app/styles/SvgIcons";

type Match = {
  gecko_game_type: number;
  guest_capsule_ids: string[];
  host_capsule_ids: string[];
};

type Props = {
  matchesSV: SharedValue<Match[]>;
  onSelect: (gameType: number) => void;
  color: string;
  backgroundColor?: string;
  borderColor?: string;
};

const CARD_SIZE = 50;
const CARD_GAP = 10;
const ICON_SIZE = 34;

const VISIBLE_CARDS = 2.5;
const SCROLL_WIDTH = VISIBLE_CARDS * CARD_SIZE + Math.floor(VISIBLE_CARDS) * CARD_GAP;

const STAGGER_MS = 140;

const USE_DUMMY_DATA = false;
const DUMMY_MATCHES: Match[] = [
  { gecko_game_type: 1, guest_capsule_ids: ["g1"], host_capsule_ids: ["h1"] },
  { gecko_game_type: 2, guest_capsule_ids: ["g2"], host_capsule_ids: ["h2"] },
  { gecko_game_type: 3, guest_capsule_ids: ["g3"], host_capsule_ids: ["h3"] },
  { gecko_game_type: 4, guest_capsule_ids: ["g4"], host_capsule_ids: ["h4"] },
];

const CardButton = ({
  match,
  index,
  color,
  backgroundColor,
  onSelect,
}: {
  match: Match;
  index: number;
  color: string;
  backgroundColor?: string;
  onSelect: (gameType: number) => void;
}) => {
  const progress = useSharedValue(0);
  const pressScale = useSharedValue(1);

  useEffect(() => {
    progress.value = withDelay(
      index * STAGGER_MS,
      withSpring(1, { damping: 14, stiffness: 140, mass: 0.9 }),
    );
  }, [index, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const p = progress.value;
    return {
      opacity: p,
      transform: [
        { translateY: (1 - p) * 24 },
        { scale: p * pressScale.value },
      ],
    };
  });

  const onPressIn = () => {
    pressScale.value = withTiming(0.85, {
      duration: 90,
      easing: Easing.out(Easing.quad),
    });
  };
  const onPressOut = () => {
    pressScale.value = withSpring(1, { damping: 12, stiffness: 220 });
  };
  const onPress = () => 
    {
        console.log(match)
        onSelect(match.gecko_game_type)
    };

  return (
    <Animated.View
      style={[
        styles.card,
        { backgroundColor: backgroundColor ?? "transparent" },
        animatedStyle,
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={styles.cardInner}
        hitSlop={6}
      >
        <SvgIcon name={"cards_playing_spade"} color={color} size={ICON_SIZE} />
      </Pressable>
    </Animated.View>
  );
};

const ScrollHintArrow = ({ color, visible }: { color: string; visible: boolean }) => {
  if (!visible) return null;
  return (
    <View style={styles.arrow} pointerEvents="none">
      <SvgIcon name={"chevron_right"} color={color} size={20} />
    </View>
  );
};

const Matches = ({
  matchesSV,
  onSelect,
  color,
  backgroundColor,
  borderColor,
}: Props) => {
  const [matches, setMatches] = useState<Match[]>(
    USE_DUMMY_DATA ? DUMMY_MATCHES : [],
  );
  const [canScrollRight, setCanScrollRight] = useState(false);

  const contentWidthRef = useRef(0);
  const containerWidthRef = useRef(0);

  useAnimatedReaction(
    () => matchesSV.value,
    (current, previous) => {
      if (current === previous) return;
      if (USE_DUMMY_DATA) return;
      runOnJS(setMatches)(current ?? []);
    },
    [],
  );

  const recomputeOverflow = (offsetX = 0) => {
    const remaining =
      contentWidthRef.current - containerWidthRef.current - offsetX;
    setCanScrollRight(remaining > 1);
  };

  const onContentSizeChange = (w: number) => {
    contentWidthRef.current = w;
    recomputeOverflow();
  };

  const onLayout = (w: number) => {
    containerWidthRef.current = w;
    recomputeOverflow();
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    recomputeOverflow(e.nativeEvent.contentOffset.x);
  };

  if (matches.length === 0) return null;

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <View style={styles.scrollWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ width: SCROLL_WIDTH }}
          contentContainerStyle={styles.row}
          onContentSizeChange={onContentSizeChange}
          onLayout={(e) => onLayout(e.nativeEvent.layout.width)}
          onScroll={onScroll}
          scrollEventThrottle={16}
        >
          {matches.map((m, i) => (
            <CardButton
              key={`${m.gecko_game_type}-${i}`}
              match={m}
              index={i}
              color={color}
              backgroundColor={backgroundColor}
              onSelect={onSelect}
            />
          ))}
        </ScrollView>
        <ScrollHintArrow color={color} visible={canScrollRight} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: CARD_SIZE + 4,
    flexDirection: "column",
    alignItems: "flex-start",
  },
  scrollWrap: {
    position: "relative",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: CARD_GAP,
    paddingBottom: 4,
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: 16,
  },
  cardInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  arrow: {
    position: "absolute",
    right: -4,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Matches;
