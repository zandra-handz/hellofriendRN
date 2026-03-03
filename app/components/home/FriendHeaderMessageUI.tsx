// FriendHeaderMessageUI.tsx
import { StyleSheet, View, Text, Pressable } from "react-native";
import React, { useCallback, useMemo, useEffect } from "react";
import useFriendDash from "@/src/hooks/useFriendDash";
import { useFocusEffect } from "@react-navigation/native";
import manualGradientColors from "@/app/styles/StaticColors";
import SvgIcon from "@/app/styles/SvgIcons";
import Animated, {
  withTiming,
  withSequence,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import { Vibration } from "react-native";
import { useAutoSelector } from "@/src/context/AutoSelectorContext";
import useUpdateSettings from "@/src/hooks/SettingsCalls/useUpdateSettings";
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";
import LoadingPage from "../appwide/spinner/LoadingPage";
import GoOptionsModal from "../headers/GoOptionsModal";
import GeckoGoButton from "./GeckoGoButton";
import { useState } from "react";
import { formatDayOfWeekAbbrevMonth } from "@/src/utils/DaysSince";

// Hardcoded for testing — swap to lightDarkTheme values later
const PILL_BG = "rgba(0, 0, 0, 0.82)";

const FriendHeaderMessageUI: React.FC<any> = ({
  friendId,
  selectedFriendName,
  friendDarkColor,
  userId,
  primaryColor,
  primaryBackground,
  welcomeTextStyle,
}) => {
  const { autoSelectFriend } = useAutoSelector();
  const { friendDash, loadingDash } = useFriendDash({ userId, friendId });
  const { navigateToSelectFriend, navigateToFinalize } = useAppNavigations();
  const { updateSettings } = useUpdateSettings({ userId });

  const [optionsModalVisible, setOptionsModalVisible] = useState(false);

  const isFocused = useSharedValue(false);
  const opacityValue = useSharedValue(0);
  const scaleValue = useSharedValue(0);
  const secondOpacityValue = useSharedValue(0);
  const secondScaleValue = useSharedValue(0);

  useFocusEffect(
    useCallback(() => {
      isFocused.value = true;
      return () => { isFocused.value = false; };
    }, []),
  );

  const animatedPinStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
    opacity: opacityValue.value,
  }));

  const animatedSecondPinStyle = useAnimatedStyle(() => ({
    transform: [{ scale: secondScaleValue.value }],
    opacity: secondOpacityValue.value,
  }));

  const isLockedOn = useMemo(() =>
    friendId === autoSelectFriend?.customFriend?.id,
    [friendId, autoSelectFriend?.customFriend?.id],
  );

  const isUpNext = useMemo(() =>
    friendId === autoSelectFriend?.nextFriend?.id,
    [friendId, autoSelectFriend?.nextFriend?.id],
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
    if (friendId === autoSelectFriend?.customFriend?.id) {
      updateSettings({ lock_in_custom_string: null });
      Vibration.vibrate(100);
      showFlashMessage(`${selectedFriendName} unpinned`, false, 1000);
    } else {
      updateSettings({ lock_in_custom_string: friendId });
      Vibration.vibrate(100);
      showFlashMessage(`${selectedFriendName} pinned!`, false, 1000);
    }
  }, [friendId, selectedFriendName, autoSelectFriend?.customFriend?.id]);

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
      {/* Animated pin icons — absolutely positioned top right */}
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

      {/* Single combined pill */}
      <Pressable
        onPress={handleOnPress}
        onLongPress={toggleLockOnFriend}
        style={[styles.pill, { backgroundColor: PILL_BG }]}
      >
        {loadingDash ? (
          <LoadingPage
            loading={true}
            color={friendDarkColor}
            spinnerType="flow"
            spinnerSize={30}
            includeLabel={false}
          />
        ) : (
          <>
            {/* Friend name */}
            <Text
              numberOfLines={1}
              style={[styles.friendName, { color: primaryColor }]}
            >
              {selectedFriendName}
            </Text>

            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: primaryColor }]} />

            {/* Say hi row */}
            <View style={styles.helloRow}>
              <View style={styles.helloTextContainer}>
                <Text style={[styles.helloLabel, { color: primaryColor }]}>
                  {helloDate ? "Say hi on" : "No date set"}
                </Text>
                <Text style={[styles.helloDate, { color: primaryColor }]}>
                  {helloDate}
                </Text>
              </View>

              <GeckoGoButton
                onSinglePress={() => setOptionsModalVisible(true)}
                onDoublePress={navigateToFinalize}
                color={primaryColor}
                backgroundColor={'transparent'}
              />
            </View>
          </>
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