 

import { View, StyleSheet, Pressable, Vibration } from "react-native";
import React, {
  useState,
  useRef,
  useMemo,
  useEffect,
  useCallback,
} from "react";

import useAppNavigations from "@/src/hooks/useAppNavigations";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";

import DebugPanel from "../moments/DebugPanel";
import { useLDTheme } from "@/src/context/LDThemeContext";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import useUpdateMomentCoords from "@/src/hooks/CapsuleCalls/useUpdateCoords";
import manualGradientColors from "@/app/styles/StaticColors";
import SvgIcon from "@/app/styles/SvgIcons";
import SpeedButtons from "./SpeedButtons";
import AutoPickUpButton from "./AutoPickUpButton";
import QRCodeButton from "./QRCodeButton";
import useFriendDash from "@/src/hooks/useFriendDash";
import useUser from "@/src/hooks/useUser";
import AnimatedCounter from "./AnimatedCounter";
import NoGradientBackground from "@/app/components/appwide/format/NoGradientBackground";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import GlassPreviewBottom from "./GlassPreviewBottom";
import GlassTopBarLight from "./GlassTopBarLight";
import MomentsSkia from "@/app/assets/shader_animations/MomentsSkia";
 import { LightSensor, DeviceMotion } from "expo-sensors";
import useFriendPickSession from "@/src/hooks/CapsuleCalls/useFriendPickSession";

import {
  activateKeepAwakeAsync,
  deactivateKeepAwake,
} from "expo-keep-awake";
import { useSharedValue } from "react-native-reanimated";

type Props = {
  skiaFontLarge: SkFont;
  skiaFontSmall: SkFont;
};

const ScreenGecko = ({ skiaFontLarge, skiaFontSmall }: Props) => {
  const route = useRoute();
  const selection = route.params?.selection ?? null;
  const autoPick = route.params?.autoPick ?? false;
  const timestamp = route.params?.timestamp ?? null;
  const pollMode = route.params?.pollMode ?? false;
  const sessionId = route.params?.sessionId ?? null;

  const { user } = useUser();
  const { lightDarkTheme } = useLDTheme();
  const { capsuleList } = useCapsuleList();
  const { selectedFriend } = useSelectedFriend();

  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isPollMode, setIsPollMode] = useState(false);


 //////////// NEW!! SENSOR TESTING //////////////////////////////////////////////////////////

// const [debugValues, setDebugValues] = useState({
//   tiltX: 0,
//   tiltY: 0,
//   lux: 0,
//   speed: 0,
// });

// const tiltX = useSharedValue(0);
// const tiltY = useSharedValue(0);
// const speedMultiplier = useSharedValue(1.0);

// DeviceMotion.setUpdateInterval(16);

// useEffect(() => {
//   const motionSub = DeviceMotion.addListener(({ rotation }) => {
//     tiltX.value = rotation.beta;
//     tiltY.value = rotation.gamma;
//     setDebugValues(prev => ({ ...prev, tiltX: rotation.beta, tiltY: rotation.gamma }));
//   });
//   return () => motionSub.remove();
// }, []);

// useEffect(() => {
//   const lightSub = LightSensor.addListener(({ illuminance }) => {
//     const mapped = Math.min(1.0, Math.max(0.2, illuminance / 1000));
//     speedMultiplier.value = mapped;
//     setDebugValues(prev => ({ ...prev, lux: illuminance, speed: mapped }));
//   });
//   return () => lightSub.remove();
// }, []);

const tiltX = useSharedValue(0);
const tiltY = useSharedValue(0);
const speedMultiplier = useSharedValue(1.0);

const luxRef = useRef(0); // track last lux to avoid unnecessary updates

// useEffect(() => {
//   // DeviceMotion.setUpdateInterval(16);
//     DeviceMotion.setUpdateInterval(100);
//   const motionSub = DeviceMotion.addListener(({ rotation }) => {
//     tiltX.value = rotation.beta;
//     tiltY.value = rotation.gamma;
//   });
//   return () => motionSub.remove();
// }, []);

// useEffect(() => {
//   const lightSub = LightSensor.addListener(({ illuminance }) => {
//     const prev = luxRef.current;
//     luxRef.current = illuminance;

//     // only update speed if lux crosses a meaningful threshold
//     const crossedThreshold =
//       (prev < 50 && illuminance >= 50) ||
//       (prev >= 50 && illuminance < 50) ||
//       (prev < 500 && illuminance >= 500) ||
//       (prev >= 500 && illuminance < 500);

//     if (crossedThreshold) {
//       const mapped = Math.min(1.0, Math.max(0.2, illuminance / 1000));
//       speedMultiplier.value = mapped;
//     }
//   });
//   return () => lightSub.remove();
// }, []);

useFocusEffect(
  useCallback(() => {
    // Wake up sensors on focus
    DeviceMotion.setUpdateInterval(100);
    
    const motionSub = DeviceMotion.addListener(({ rotation }) => {
      tiltX.value = rotation.beta;
      tiltY.value = rotation.gamma;
    });

    const lightSub = LightSensor.addListener(({ illuminance }) => {
      const prev = luxRef.current;
      luxRef.current = illuminance;

      const crossedThreshold =
        (prev < 50 && illuminance >= 50) ||
        (prev >= 50 && illuminance < 50) ||
        (prev < 500 && illuminance >= 500) ||
        (prev >= 500 && illuminance < 500);

      if (crossedThreshold) {
        const mapped = Math.min(1.0, Math.max(0.2, illuminance / 1000));
        speedMultiplier.value = mapped;
      }
    });

    // Sleep sensors on blur
    return () => {
      motionSub.remove();
      lightSub.remove();
    };
  }, []),
);

//////////////////////////////////////////////////////////////////////////////////////////////


  useFocusEffect(
    useCallback(() => {
      const newSessionId = route.params?.sessionId ?? null;
      const newPollMode = route.params?.pollMode ?? false;

      console.log("Screen focused, params:", { newSessionId, newPollMode });

      setActiveSessionId(newSessionId);
      setIsPollMode(newPollMode);
    }, [route.params?.sessionId, route.params?.pollMode]),
  );

  const {
    isPressed,
    isExpired,
    pressedAt,
    pressedMomentId,
    updatePressedMoment,
  } = useFriendPickSession({
    friendId: selectedFriend?.id,
    friendName: selectedFriend?.name,
    sessionId: activeSessionId,
    enabled: isPollMode && !!activeSessionId,
  });

  console.log(
    `PICK SESSION VALUES: `,
    isPressed,
    isExpired,
    pressedAt,
    activeSessionId,
  );

  const {
    navigateToMomentView,
    navigateToMomentFocus,
    navigateToGeckoSelectSettings,
    navigateToQRCode,
  } = useAppNavigations();

  const handleNavigateToMoment = useCallback(
    (m) => {
      navigateToMomentView({ moment: m, index: m.uniqueIndex, momentId: m.id});
    },
    [navigateToMomentView],
  );

  const [moment, setMoment] = useState({
    category: null,
    capsule: null,
    uniqueIndex: null,
    id: null,
  });

  const handleNavigateToCreateNew = useCallback(() => {
    navigateToMomentFocus({ screenCameFrom: 1 });
  }, [navigateToMomentFocus]);

  useEffect(() => {
    if (isExpired) {
      console.log("Session expired");
      setIsPollMode(false);
      setActiveSessionId(null);
    }
  }, [isExpired]);

  useEffect(() => {
    if (isPressed && sessionId) {
      setIsPollMode(false);
      setActiveSessionId(null);

      if (moment && !pressedMomentId) {
        updatePressedMoment(moment?.id);
        handleNavigateToMoment(moment);
      }
    }
  }, [
    isPressed,
    sessionId,
    pressedAt,
    moment,
    pressedMomentId,
    isExpired,
    updatePressedMoment,
    handleNavigateToMoment,
  ]);

  const { friendDash } = useFriendDash({
    userId: user?.id,
    friendId: selectedFriend?.id,
  });

  const AUTO_SELECT_TYPES = [
    "Random",
    "Balanced",
    "Hard mode",
    "Easy mode",
    "Quick shares",
    "Fill the time",
    "Specific",
    "General",
    "Their interests",
    "My interests",
  ];

  const [autoSelectType, setAutoSelectType] = useState(0);
  const [acceptPawClear, setAcceptPawClear] = useState(false);

  function getAutoSelectLabel(type) {
    return AUTO_SELECT_TYPES[type] ?? AUTO_SELECT_TYPES[0];
  }

  useEffect(() => {
    if (autoPick !== undefined && selection !== undefined) {
      setAutoSelectType(selection);
      setAcceptPawClear(autoPick);
    }
  }, [selection, autoPick, timestamp]);

  const [autoPickUp, setAutoPickUp] = useState(false);
  const autoPickUpRef = useRef(false);

  useEffect(() => {
    if (acceptPawClear) {
      setAutoPickUp(true);
      autoPickUpRef.current = true;
      setAcceptPawClear(false);
    }
  }, [acceptPawClear]);

  const { handleUpdateMomentCoords } = useUpdateMomentCoords({
    userId: user?.id,
    friendId: selectedFriend?.id,
  });

  const pickTopScoredMomentIds = (moments, typeIndex, count = 4) => {
    const result = new Array(count).fill(-1);

    if (!moments || moments.length === 0) {
      return result;
    }

    if (typeIndex === 0) {
      const shuffled = [...moments].sort(() => Math.random() - 0.5);
      for (let i = 0; i < Math.min(shuffled.length, count); i++) {
        result[i] = shuffled[i].id;
      }
      return result;
    }

    const scoreFieldMap = {
      1: "generic_score",
      2: "hard_score",
      3: "easy_score",
      4: "quick_score",
      5: "long_score",
      6: "unique_score",
      7: "generic_score",
      8: "relevant_score",
      9: "random_score",
    };

    const scoreKey = scoreFieldMap[typeIndex];

    const withScores = moments.filter(
      (m) => m && typeof m[scoreKey] === "number",
    );

    if (withScores.length === 0) {
      return result;
    }

    const sorted = [...withScores].sort((a, b) => b[scoreKey] - a[scoreKey]);

    for (let i = 0; i < Math.min(sorted.length, count); i++) {
      result[i] = sorted[i].id;
    }

    return result;
  };

  const MAX_MOMENTS = 30;

  const momentCoords = useMemo(() => {
    console.log("momentsCoords recalculated, triggered by capsuleList");
    return capsuleList.slice(0, MAX_MOMENTS).map((m) => ({
      id: m.id,
      coord: [m.screen_x, m.screen_y],
      stored_index: m.stored_index,
    }));
  }, [capsuleList]);

  const [resetSkia, setResetSkia] = useState<number | null>(null);

  const [manualOnly, setManualOnly] = useState(true);
  const [speedSetting, setSpeedSetting] = useState(1);

  const tickTotalsRef = useRef([120, 85, 50]);
  
  const speedSettingRef = useRef(tickTotalsRef.current[0]);
  const manualOnlyRef = useRef(true);

  const randomWakeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const randomSleepTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const randomAutoEnabledRef = useRef(false);

  const clearRandomAutoTimeouts = useCallback(() => {
    if (randomWakeTimeoutRef.current) {
      clearTimeout(randomWakeTimeoutRef.current);
      randomWakeTimeoutRef.current = null;
    }

    if (randomSleepTimeoutRef.current) {
      clearTimeout(randomSleepTimeoutRef.current);
      randomSleepTimeoutRef.current = null;
    }
  }, []);

  const setManualOnlyBoth = useCallback((value: boolean) => {
    manualOnlyRef.current = value;
    setManualOnly(value);
  }, []);

  const pickRandomMomentIds = (moments, count = 4) => {
    const result = new Array(count).fill(-1);

    if (!moments || moments.length === 0) {
      return result;
    }

    const shuffled = [...moments].sort(() => Math.random() - 0.5);

    for (let i = 0; i < Math.min(shuffled.length, count); i++) {
      result[i] = shuffled[i].id;
    }

    return result;
  };

  const randomMomentIdsRef = useRef<any[]>([]);

  useEffect(() => {
    randomMomentIdsRef.current = pickRandomMomentIds(capsuleList, 4);
  }, [capsuleList]);

  useEffect(() => {
    if (autoSelectType === 0) {
      randomMomentIdsRef.current = pickRandomMomentIds(capsuleList, 4);
    } else if (autoSelectType < 8) {
      randomMomentIdsRef.current = pickTopScoredMomentIds(
        capsuleList,
        autoSelectType,
        4,
      );
    }
  }, [autoSelectType, capsuleList]);

  const selectLabel = useMemo(() => {
    return getAutoSelectLabel(autoSelectType);
  }, [autoSelectType]);

  const handleChangeSpeed = useCallback((newSpeedFromButton) => {
    speedSettingRef.current =
      tickTotalsRef.current[newSpeedFromButton] ?? tickTotalsRef.current[1];
    setSpeedSetting(newSpeedFromButton);
  }, []);

  const handleNavToSelect = useCallback(() => {
    if (autoPickUp) {
      setAutoPickUp(false);
      autoPickUpRef.current = false;
    } else {
      navigateToGeckoSelectSettings({ selection: autoSelectType });
    }
  }, [autoPickUp, autoSelectType, navigateToGeckoSelectSettings]);

  const handleNavToQRCode = useCallback(() => {
    navigateToQRCode({
      selection: autoSelectType,
      friendName: selectedFriend.name,
      friendId: selectedFriend.id,
      friendNumber: friendDash?.suggestion_settings.phone_number,
    });
  }, [selectedFriend, autoSelectType, friendDash, navigateToQRCode]);

  useEffect(() => {
    if (!manualOnly) {
      console.log("keep awake!!");
      activateKeepAwakeAsync();
    } else {
      deactivateKeepAwake();
      console.log("sleep");
    }

    return () => {
      deactivateKeepAwake();
    };
  }, [manualOnly]);

  const scheduleRandomWake = useCallback(() => {
    if (!randomAutoEnabledRef.current) return;

    clearRandomAutoTimeouts();

    const nextDelay = 8000 + Math.random() * 17000;

    randomWakeTimeoutRef.current = setTimeout(() => {
      if (!randomAutoEnabledRef.current) return;

      console.log("RANDOM AUTO: waking gecko");

      manualOnlyRef.current = false;
      setManualOnly(false);

      const speeds = tickTotalsRef.current;
      const randomSpeedIndex = Math.floor(Math.random() * speeds.length);
      speedSettingRef.current = speeds[randomSpeedIndex];
      setSpeedSetting(randomSpeedIndex);

      // const activeDuration = 2000 + Math.random() * 4000;

      const activeDuration = 8000 + Math.random() * 12000;

      randomSleepTimeoutRef.current = setTimeout(() => {
        if (!randomAutoEnabledRef.current) return;

        console.log("RANDOM AUTO: putting gecko back to manual");

        manualOnlyRef.current = true;
        setManualOnly(true);

        scheduleRandomWake();
      }, activeDuration);
    }, nextDelay);
  }, [clearRandomAutoTimeouts]);

  useFocusEffect(
    useCallback(() => {
      console.log("RANDOM AUTO: focus start");

      randomAutoEnabledRef.current = true;
      scheduleRandomWake();

      return () => {
        console.log("RANDOM AUTO: focus cleanup");

        randomAutoEnabledRef.current = false;
        clearRandomAutoTimeouts();

        manualOnlyRef.current = true;
        setManualOnly(true);
      };
    }, [scheduleRandomWake, clearRandomAutoTimeouts]),
  );

  const handleToggleManual = useCallback(() => {
    const nextValue = !manualOnlyRef.current;
    manualOnlyRef.current = nextValue;
    setManualOnly(nextValue);
  }, []);

  useEffect(() => {
    setScatteredMoments(momentCoords);
    setResetSkia(Date.now());
  }, [momentCoords]);

  useEffect(() => {
    setMoment({
      category: null,
      capsule: null,
      uniqueIndex: null,
      id: null,
    });
  }, [resetSkia]);

  const [scatteredMoments, setScatteredMoments] = useState(momentCoords);

  const handleRescatterMoments_insideMS = useCallback((newData) => {
    const minY = 0.2;
    const maxY = 0.75;
    const minX = 0.05;
    const maxX = 0.95;

    setScatteredMoments(
      newData.map((m) => {
        if (
          m.stored_index !== null &&
          m.stored_index >= 0 &&
          m.stored_index < 4
        ) {
          return {
            ...m,
            coord: [-100, -100],
          };
        }

        const randomX = Math.random() * (maxX - minX) + minX;
        const randomY = Math.random() * (maxY - minY) + maxY - (maxY - minY);

        return {
          ...m,
          coord: [randomX, randomY],
        };
      }),
    );
  }, []);

  const handleRecenterMoments_insideMS = useCallback((newData) => {
    setScatteredMoments(
      newData.map((m) => {
        if (
          m.stored_index !== null &&
          m.stored_index >= 0 &&
          m.stored_index < 4
        ) {
          return {
            ...m,
            coord: [-100, -100],
          };
        }

        return {
          ...m,
          coord: [0.5, 0.5],
        };
      }),
    );
  }, []);

  const count = useSharedValue(0);

  const loopCount = useRef(0);
  const pickupCountInCurrentLoop = useRef(0);

  const handleGetMoment = useCallback(
    (id) => {
      const foundMoment = capsuleList.find((c) => c.id === id);

      if (!foundMoment?.id) {
        setMoment({
          category: null,
          capsule: null,
          uniqueIndex: null,
          id: null,
        });
        return;
      }

      setMoment({
        category: foundMoment.user_category_name,
        capsule: foundMoment.capsule,
        uniqueIndex: foundMoment.uniqueIndex,
        id: foundMoment.id,
      });

      const charCount = Number(foundMoment?.charCount) || 0;
      const isSubtracting = loopCount.current % 2 !== 0;
      const delta = isSubtracting ? -charCount : charCount;

      count.value = count.value + delta;

      pickupCountInCurrentLoop.current += 1;
      if (pickupCountInCurrentLoop.current >= capsuleList.length) {
        loopCount.current += 1;
        pickupCountInCurrentLoop.current = 0;
      }

      Vibration.vibrate(50);
    },
    [capsuleList, count],
  );

  const BLANK_WINDOW_MESSAGE = useMemo(() => {
    if (!scatteredMoments || scatteredMoments.length < 1) {
      return `No moments to view.`;
    }
    return `Select a moment to view it.`;
  }, [scatteredMoments]);

  const TIME_SCORE = useMemo(() => {
    if (!friendDash || !friendDash?.time_score) {
      return 100;
    }
    return Math.round(100 / friendDash?.time_score);
  }, [friendDash]);

  const DAYS_SINCE = friendDash?.days_since || 0;

  return (
    <NoGradientBackground style={styles.backgroundContainer}>
   
      <View style={[StyleSheet.absoluteFill]}>
        
        
        <MomentsSkia
          handleUpdateMomentCoords={handleUpdateMomentCoords}
          handleGetMoment={handleGetMoment}
          color1={manualGradientColors.lightColor}
          color2={manualGradientColors.homeDarkColor}
          bckgColor1={selectedFriend?.lightColor}
          bckgColor2={selectedFriend?.darkColor}
          momentsData={scatteredMoments}
          startingCoord0={0.1}
          startingCoord1={-0.5}
          restPoint0={0.5}
          restPoint1={0.6}
          scale={1}
          gecko_scale={1}
          gecko_size={1.7}
          lightDarkTheme={lightDarkTheme}
          reset={resetSkia}
          manualOnly={manualOnlyRef}
          speedSetting={speedSettingRef}
          autoPickUp={autoPickUpRef}
          randomMomentIds={randomMomentIdsRef}
          handleRescatterMomentsInternal={handleRescatterMoments_insideMS}
          handleRecenterMomentsInternal={handleRecenterMoments_insideMS}
        />
      </View>
<DebugPanel />
      <GlassTopBarLight
        textColor={lightDarkTheme.primaryText}
        backgroundColor={lightDarkTheme.darkerOverlayBackground}
        friendName={selectedFriend.name}
        TIME_SCORE={TIME_SCORE}
        DAYS_SINCE={DAYS_SINCE}
        highlight={!!isPollMode}
      />
 

      <View style={styles.animatedCounterWrapper}>
        {selectedFriend && count && (
          <AnimatedCounter
            addColor={manualGradientColors.lightColor}
            subtractColor={selectedFriend.darkColor}
            glowCenterColor={manualGradientColors.whiteColor}
            glowEdgeColor={selectedFriend.lightColor}
            countValue={count}
            fontLarge={skiaFontLarge}
            fontSmall={skiaFontSmall}
          />
        )}
      </View>

      <View style={styles.movementSettingsRow}>
        <Pressable
          onPress={handleToggleManual}
          style={[
            styles.manualButton,
            { backgroundColor: lightDarkTheme.darkerOverlayBackground },
          ]}
        >
          <SvgIcon
            name={manualOnly ? `motion_play_outline` : `motion_pause_outline`}
            size={36}
            color={lightDarkTheme.primaryText}
          />
        </Pressable>

        {!manualOnly && (
          <View style={{ marginHorizontal: 10 }}>
            <SpeedButtons
              color={lightDarkTheme.primaryText}
              curSetting={speedSetting}
              buttonDiameter={40}
              buttonPadding={0}
              iconSize={24}
              backgroundColor={lightDarkTheme.primaryBackground}
              onPress={handleChangeSpeed}
            />
          </View>
        )}
      </View>

      <View style={styles.qRCodeWrapper}>
        <QRCodeButton
          color={
            isPollMode ? selectedFriend.lightColor : lightDarkTheme.primaryText
          }
          buttonDiameter={40}
          buttonPadding={0}
          iconSize={24}
          backgroundColor={lightDarkTheme.primaryBackground}
          onPress={handleNavToQRCode}
        />
      </View>

      {!manualOnly && (
        <View style={styles.autoPickUpWrapper}>
          <AutoPickUpButton
            color={
              autoPickUp
                ? selectedFriend.lightColor
                : lightDarkTheme.primaryText
            }
            buttonDiameter={40}
            buttonPadding={0}
            iconSize={24}
            backgroundColor={lightDarkTheme.primaryBackground}
            onPress={handleNavToSelect}
          />
        </View>
      )}

      <GlassPreviewBottom
        color={lightDarkTheme.primaryText}
        backgroundColor={lightDarkTheme.darkerOverlayBackground}
        borderColor={"transparent"}
        moment={moment.id ? moment : null}
        hasContent={scatteredMoments.length > 0}
        noContentText={BLANK_WINDOW_MESSAGE}
        onPressEdit={handleNavigateToMoment}
        onPressNew={handleNavigateToCreateNew}
      />
    </NoGradientBackground>
  );
};

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  statsWrapper: {
    height: 106,
    padding: 20,
    paddingHorizontal: 20,
    top: 60,
    left: 16,
    flex: 1,
    position: "absolute",
    flexDirection: "column",
    borderRadius: 30,
  },
  scoreWrapper: {
    height: 80,
    padding: 20,
    paddingHorizontal: 20,
    top: 150,
    left: 16,
    flex: 1,
    position: "absolute",
    flexDirection: "column",
    borderRadius: 30,
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  statsText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  typeText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  movementSettingsRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%",
    height: 80,
    top: 168,
    left: 0,
    alignItems: "center",
    position: "absolute",
    padding: 20,
  },
  manualButtonWrapper: {
    borderRadius: 30,
  },
  manualButton: {
    paddingVertical: 20,
    borderRadius: 999,
    height: 60,
    width: 60,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  qRCodeWrapper: {
    width: 100,
    left: 0,
    padding: 20,
    bottom: 286,
    position: "absolute",
  },
  autoPickUpWrapper: {
    width: 100,
    left: 0,
    padding: 20,
    bottom: 246,
    position: "absolute",
  },
  noMomentWrapper: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  noMomentText: {
    fontSize: 17,
  },
  previewText: {
    fontSize: 15,
    lineHeight: 22,
  },
  previewHeader: {
    fontSize: 15,
    fontWeight: "bold",
    lineHeight: 22,
  },
  momentViewButton: {
    padding: 20,
    width: "100%",
    height: 50,
    top: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "flex-end",
    zIndex: 9000,
    position: "absolute",
  },
  holdMomentButton: {
    width: "auto",
    maxWidth: 90,
    flexDirection: "row",
    justifyContent: "center",
    padding: 8,
    borderRadius: 999,
    marginBottom: 20,
    alignItems: "center",
  },
  holdMomentText: {
    fontSize: 15,
    fontWeight: "bold",
  },
  animatedCounterWrapper: {
    position: "absolute",
    width: "100%",
    top: 140,
    alignItems: "center",
  },
});

export default ScreenGecko;