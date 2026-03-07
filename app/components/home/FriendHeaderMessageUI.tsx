import { StyleSheet, View, Text, Pressable } from "react-native";
import React, { useCallback, useMemo, useEffect, useState } from "react";
import useFriendDash from "@/src/hooks/useFriendDash";
import { useFocusEffect } from "@react-navigation/native";
import manualGradientColors from "@/app/styles/StaticColors";
import SvgIcon from "@/app/styles/SvgIcons";
import Animated, {
  withTiming,
  withSequence,
  withSpring,
  withDelay,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import { Vibration } from "react-native";
import useUpdateSettings from "@/src/hooks/SettingsCalls/useUpdateSettings";
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";
import GoOptionsModal from "../headers/GoOptionsModal";
import GeckoGoButton from "./GeckoGoButton";
import { formatDayOfWeekAbbrevMonth } from "@/src/utils/DaysSince"; 
import useUserSettings from "@/src/hooks/useUserSettings";

const PILL_BG = "rgba(0, 0, 0, 0.82)";

const DROP_IN_SPRING = {
  damping: 18,
  stiffness: 300,
  mass: 0.15,
  overshootClamping: false,
};

const FriendHeaderMessageUI: React.FC<any> = ({
  friendId,
  friendName,
  friendNextDate,
  selectedFriendName,
  friendDarkColor,
  userId,
  primaryColor,
  primaryBackground,
  welcomeTextStyle,
  friendChangeTimestamp,
 
}) => {
  const { friendDash } = useFriendDash({ userId, friendId });
  const { navigateToSelectFriend, navigateToFinalize } = useAppNavigations();
  const { updateSettings } = useUpdateSettings({ userId });
const { settings } = useUserSettings();
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [showName, setShowName] = useState(false);

  const isFocused = useSharedValue(false);
  const opacityValue = useSharedValue(0);
  const scaleValue = useSharedValue(0);
  const secondOpacityValue = useSharedValue(0);
  const secondScaleValue = useSharedValue(0);

  const contentTranslateY = useSharedValue(0);
  const contentOpacity = useSharedValue(0);

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: contentTranslateY.value }],
    opacity: contentOpacity.value,
  }));

  const triggerDropIn = () => {
    contentTranslateY.value = withTiming(-200, { duration: 0 });
    contentOpacity.value = withTiming(1, { duration: 0 });
    contentTranslateY.value = withDelay(10, withSpring(0, DROP_IN_SPRING));
  };

  const triggerFadeIn = () => {
    contentTranslateY.value = withTiming(0, { duration: 0 });
    contentOpacity.value = withTiming(1, { duration: 0 });
  };

  useFocusEffect(
    useCallback(() => {
      isFocused.value = true;
      setShowName(true);

      if (friendChangeTimestamp) {
        triggerDropIn();
      } else {
        triggerFadeIn();
      }

      return () => {
        isFocused.value = false;
        contentOpacity.value = withTiming(0, { duration: 100 });
        setTimeout(() => setShowName(false), 120);
      };
    }, [friendChangeTimestamp]),
  );

  useEffect(() => {
    if (!friendChangeTimestamp || !isFocused.value) return;
    triggerDropIn();
  }, [friendChangeTimestamp]);

  const animatedPinStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
    opacity: opacityValue.value,
  }));

  const animatedSecondPinStyle = useAnimatedStyle(() => ({
    transform: [{ scale: secondScaleValue.value }],
    opacity: secondOpacityValue.value,
  }));

  const isLockedOn = useMemo(() =>
    friendId === settings?.pinned_friend,
    [friendId, settings?.pinned_friend],
  );

  const isUpNext = useMemo(() =>
    friendId === settings?.upcoming_friend,
    [friendId, settings?.upcoming_friend],
  );

  useEffect(() => {
    if (isLockedOn) {
      opacityValue.value = withTiming(1, { duration: 100 });
      scaleValue.value = withSequence(
        withTiming(1.3, { duration: 100 }),
        withTiming(1, { duration: 300 }),
      );
    } else {
      scaleValue.value = withSequence(
        withTiming(1.2, { duration: 200 }),
        withTiming(0, { duration: 100 }),
      );
    }
  }, [isLockedOn]);

  useEffect(() => {
    if (isUpNext) {
      secondOpacityValue.value = withTiming(1, { duration: 100 });
      secondScaleValue.value = withSequence(
        withTiming(1.3, { duration: 100 }),
        withTiming(1, { duration: 300 }),
      );
    } else {
      secondScaleValue.value = withSequence(
        withTiming(1.2, { duration: 200 }),
        withTiming(0, { duration: 100 }),
      );
    }
  }, [isUpNext]);

  const toggleLockOnFriend = useCallback(() => {
    if (!friendId) return;
    if (friendId === settings?.pinned_friend) {
      updateSettings({ pinned_friend: null });
      Vibration.vibrate(100);
      showFlashMessage(`${selectedFriendName} unpinned`, false, 1000);
    } else {
      updateSettings({ pinned_friend: friendId });
      Vibration.vibrate(100);
      showFlashMessage(`${selectedFriendName} pinned!`, false, 1000);
    }
  }, [friendId, selectedFriendName, settings?.pinned_friend]);

  const handleOnPress = () => {
    isFocused.value = false;
    navigateToSelectFriend({ useNavigateBack: false });
  };

  const helloDate = useMemo(() =>
    formatDayOfWeekAbbrevMonth(friendDash?.date),
    [friendDash?.date],
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.iconsContainer} pointerEvents="none">
        <Animated.View
          style={[animatedPinStyle, styles.animatedIcon,
            { backgroundColor: manualGradientColors.lightColor }]}
        >
          <SvgIcon name="pin_outline" size={22} color={manualGradientColors.homeDarkColor} />
        </Animated.View>
        <Animated.View
          style={[animatedSecondPinStyle, styles.animatedIcon,
            { backgroundColor: manualGradientColors.lightColor }]}
        >
          <SvgIcon name="calendar_outline" size={22} color={manualGradientColors.homeDarkColor} />
        </Animated.View>
      </View>

      <Pressable
        onPress={handleOnPress}
        onLongPress={toggleLockOnFriend}
        style={[styles.pill, { backgroundColor: PILL_BG }]}
      >
        {showName && (
          <Animated.View style={[contentAnimatedStyle, { overflow: "visible" }]}>
            <Text
              numberOfLines={1}
              style={[styles.friendName, { color: primaryColor }]}
            >
              {friendName ? friendName : selectedFriendName}
            </Text>

            <View style={[styles.divider, { backgroundColor: primaryColor }]} />

            <View style={styles.helloRow}>
              <View style={styles.helloTextContainer}>
                <Text style={[styles.helloLabel, { color: primaryColor }]}>
                  Say hi on
                </Text>
                <Text style={[styles.helloDate, { color: primaryColor }]}>
                  {friendNextDate ? friendNextDate : helloDate}
                </Text>
              </View>

              <GeckoGoButton
                onSinglePress={() => setOptionsModalVisible(true)}
                onDoublePress={navigateToFinalize}
                color={primaryColor}
                backgroundColor={'transparent'}
              />
            </View>
          </Animated.View>
        )}
      </Pressable>

      {optionsModalVisible && (
        <GoOptionsModal
          primaryColor={primaryColor}
          backgroundColor="red"
          modalBackgroundColor={primaryBackground}
          isVisible={optionsModalVisible}
          closeModal={() => setOptionsModalVisible(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    marginTop: 30,
    marginBottom: 10,
    alignItems: "center",
  },
  iconsContainer: {
    position: "absolute",
    right: 10,
    top: 0,
    zIndex: 10,
    flexDirection: "column",
    gap: 6,
    alignItems: "center",
  },
  animatedIcon: {
    padding: 4,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  pill: {
    width: "92%",
    borderRadius: 999,
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    minHeight: 150,
    overflow: "visible",
  },
  friendName: {
    fontFamily: "Poppins_400",
    fontSize: 32,
    textAlign: "center",
    lineHeight: 32,
  },
  divider: {
    width: "40%",
    height: 1,
    alignSelf: "center",
    marginVertical: 8,
    opacity: 0.2,
  },
  helloRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  helloTextContainer: {
    flex: 1,
    alignItems: "center",
  },
  helloLabel: {
    fontFamily: "Poppins_700Bold",
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 20,
  },
  helloDate: {
    fontFamily: "Poppins_400Regular",
    fontSize: 18,
    lineHeight: 28,
    opacity: 0.9,
  },
});

export default React.memo(FriendHeaderMessageUI);