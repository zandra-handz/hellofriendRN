import React, { useCallback, useRef, useMemo } from 'react';
import { Pressable, View, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import SvgIcon from '@/app/styles/SvgIcons';
import { formatDayOfWeekAbbrevMonth } from '@/src/utils/DaysSince';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface Friend {
  id: number;
  name: string;
  theme_color_dark?: string;
  theme_color_light?: string;
}

interface SoonRowProps {
  date: string;
  friendName: string;
  friendId: number;
  capsuleCount?: number;
  friendList: Friend[];
  textColor?: string;
  /** Background color for the readability overlay on press — use darkerOverlayColor */
  readabilityColor?: string;
  showDivider?: boolean;
  /** single press navigates to friend dashboard */
  onPress: () => void;
  /** double press navigates straight to Moments */
  onDoublePress: () => void;
  style?: ViewStyle;
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const DOUBLE_PRESS_DELAY = 300;
const FALLBACK_COLORS: [string, string] = ['#4caf50', '#a0f143'];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

type DateLabel = 'today' | 'tomorrow' | 'future';

function classifyDate(dateStr: string): DateLabel {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);

  if (target.getTime() === today.getTime()) return 'today';
  if (target.getTime() === tomorrow.getTime()) return 'tomorrow';
  return 'future';
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────

const SoonRow: React.FC<SoonRowProps> = ({
  date,
  friendName,
  friendId,
  capsuleCount,
  friendList,
  textColor = '#ffffff',
  readabilityColor = 'rgba(0, 0, 0, 0.82)',
  showDivider = true,
  onPress,
  onDoublePress,
  style,
}) => {
  // ── friend theme colours ──────────────────────────────────────────────────
  const highlightColors = useMemo<[string, string]>(() => {
    const friend = friendList?.find((f) => Number(f.id) === Number(friendId));
    if (friend?.theme_color_dark && friend?.theme_color_light) {
      return [friend.theme_color_dark, friend.theme_color_light];
    }
    return FALLBACK_COLORS;
  }, [friendList, friendId]);

  // ── date label logic ──────────────────────────────────────────────────────
  const dateLabel = useMemo(() => classifyDate(date), [date]);
  const formattedDate = useMemo(() => formatDayOfWeekAbbrevMonth(date), [date]);

  const staticDateText = useMemo(() => {
    if (dateLabel === 'today') return 'Today';
    if (dateLabel === 'tomorrow') return 'Tomorrow';
    return null;
  }, [dateLabel]);

  // ── double-press logic ────────────────────────────────────────────────────
  const lastPress = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePress = useCallback(() => {
    const now = Date.now();
    if (now - lastPress.current < DOUBLE_PRESS_DELAY) {
      timeoutRef.current && clearTimeout(timeoutRef.current);
      onDoublePress();
    } else {
      timeoutRef.current && clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(onPress, DOUBLE_PRESS_DELAY - 10);
    }
    lastPress.current = now;
  }, [onPress, onDoublePress]);

  // ── animations ────────────────────────────────────────────────────────────
  const scale = useSharedValue(1);
  const gradientOpacity = useSharedValue(0);
  const gradientScale = useSharedValue(0);
  const pressOpacity = useSharedValue(0);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.97, { duration: 100 });
    gradientOpacity.value = withTiming(1, { duration: 80 });
    gradientScale.value = withTiming(1.4, { duration: 80 });
    pressOpacity.value = withTiming(1, { duration: 80 });
  }, []);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1);
    gradientOpacity.value = withTiming(0, { duration: 200 });
    gradientScale.value = withTiming(0, { duration: 200 });
    pressOpacity.value = withTiming(0, { duration: 200 });
  }, []);

  const animatedRow = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedGradient = useAnimatedStyle(() => ({
    opacity: gradientOpacity.value,
    transform: [{ scale: gradientScale.value }],
  }));

  const animatedReadabilityBg = useAnimatedStyle(() => ({
    opacity: pressOpacity.value,
  }));

  const animatedFutureDate = useAnimatedStyle(() => ({
    opacity: pressOpacity.value,
  }));

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.pressable, style]}
    >
      {/* Friend colour gradient — full bleed */}
      <AnimatedLinearGradient
        colors={highlightColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[StyleSheet.absoluteFill, styles.gradientFill, animatedGradient]}
      />

      {/* Readability overlay — inset so gradient peeks around edges */}
      <Animated.View
        style={[
          styles.readabilityBg,
          { backgroundColor: readabilityColor },
          animatedReadabilityBg,
        ]}
      />

      {showDivider && <View style={styles.divider} />}

      <Animated.View style={[styles.row, animatedRow]}>
        {/* Left: name + date stacked */}
        <View style={styles.left}>
          <Text style={[styles.nameText, { color: textColor }]} numberOfLines={1}>
            {friendName}
          </Text>

          {/* Today / Tomorrow — always visible */}
          {staticDateText !== null && (
            <Text style={styles.dateText}>{staticDateText}</Text>
          )}

          {/* Future date — fades in on press */}
          {staticDateText === null && (
            <Animated.Text style={[styles.dateText, animatedFutureDate]}>
              {formattedDate}
            </Animated.Text>
          )}
        </View>

        {/* Right: icon + count */}
        <View style={styles.right}>
          <SvgIcon name="chart_bubble" color={textColor} size={22} style={styles.icon} />
          {capsuleCount !== undefined && (
            <Text style={[styles.countText, { color: textColor }]}>
              {capsuleCount}
            </Text>
          )}
        </View>
      </Animated.View>
    </Pressable>
  );
};

// ─── STYLES ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  pressable: {
    overflow: 'hidden',
    borderRadius: 12,
  },
  gradientFill: {
    borderRadius: 12,
  },
  readabilityBg: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 10,
    top: 3,
    bottom: 3,
    left: 3,
    right: 3,
  },
  divider: {
    height: 1,
    backgroundColor: '#1c1c1c',
    marginHorizontal: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    paddingHorizontal: 12,
  },
  left: {
    flex: 1,
    flexDirection: 'column',
    gap: 2,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },
  nameText: {
    fontFamily: 'SpaceGrotesk-SemiBold',
    fontSize: 13,
  },
  dateText: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 11,
    color: '#555555',
  },
  icon: {
    opacity: 0.5,
  },
  countText: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 12,
  },
});

export default SoonRow;