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

import useFriendPickSession from "@/src/hooks/CapsuleCalls/useFriendPickSession";

// import PreAuthSafeViewAndGradientBackground from "@/app/components/appwide/format/PreAuthSafeViewAndGradBackground";

import {
  // useKeepAwake,
  // activateKeepAwake,
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
      navigateToMomentView({ moment: m, index: m.uniqueIndex });
    },
    [navigateToMomentView], // optional, if this function comes from props/context
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
      // isPressed still isn't resetting properly, but sessionId will stop it from jumping if coming from a different screen
      // console.log(
      //   "Friend pressed the button! Timestamp:",
      //   pressedAt,
      //   Date.now(),
      // );

      // Clear the poll mode to stop polling
      setIsPollMode(false);
      setActiveSessionId(null);
      if (moment && !pressedMomentId) {
        updatePressedMoment(moment?.id);
        handleNavigateToMoment(moment);
      }

      // Do whatever you want with pressedAt timestamp here
    }
  }, [isPressed, sessionId, pressedAt, moment, pressedMomentId, isExpired]);

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
    // console.log(`AUTOPICK`, autoPick);
    // console.log(``, selection);
    if (autoPick !== undefined && selection !== undefined) {
      // console.log("setting acceptPawClear to", autoPick);
      // console.log("setting autoselecttype to", selection);

      setAutoSelectType(selection);
      setAcceptPawClear(autoPick);
    }
  }, [selection, autoPick, timestamp]);

  // useFocusEffect(
  //   useCallback(() => {
  //     console.log('=== SCREEN FOCUSED ===');
  //     console.log('route.params?.autoPick:', route.params?.autoPick);
  //     console.log('route.params?.selection:', route.params?.selection);
  //     console.log('route.params?.timestamp:', route.params?.timestamp);
  //     console.log('current autoSelectType:', autoSelectType);
  //     console.log('current autoPickUp:', autoPickUp);
  //     console.log('=====================');
  //   }, [route.params, autoSelectType, autoPickUp])
  // );

  useEffect(() => {
    if (acceptPawClear) {
      setAutoPickUp(true);
      autoPickUpRef.current = true;
      setAcceptPawClear(false);
    }

    // else {
    //   console.log('acceptPawClear not true. value: ', acceptPawClear)
    // }
  }, [acceptPawClear]);

  //const currentLabel = getAutoSelectLabel(autoSelectType);

  // updates on backend
  const { handleUpdateMomentCoords, updateMomentCoordsMutation } =
    useUpdateMomentCoords({
      userId: user?.id,
      friendId: selectedFriend?.id,
    });

 

  const pickTopScoredMomentIds = (moments, typeIndex, count = 4) => {
    const result = new Array(count).fill(-1);

    if (!moments || moments.length === 0) {
      return result;
    }

    // Handle RANDOM separately (index 0)
    if (typeIndex === 0) {
      const shuffled = [...moments].sort(() => Math.random() - 0.5);
      for (let i = 0; i < Math.min(shuffled.length, count); i++) {
        result[i] = shuffled[i].id;
      }
      return result;
    }

    // Map type index to the corresponding score field
    const scoreFieldMap = {
      1: "generic_score", // BALANCED
      2: "hard_score", // HARD MODE
      3: "easy_score", // EASY MODE
      4: "quick_score", // QUICK SHARES
      5: "long_score", // FILL THE TIME
      6: "unique_score", // MORE SPECIFIC TO FRIEND
      7: "generic_score", // MORE GENERAL
      8: "relevant_score", // RELEVANT TO THEIR INTERESTS
      9: "random_score", // RANDOM MY INTERESTS
    };

    const scoreKey = scoreFieldMap[typeIndex];

    // Filter moments that have a valid score for this key
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

  const [resetSkia, setResetSkia] = useState(null);

  const [manualOnly, setManualOnly] = useState(true);
  const [speedSetting, setSpeedSetting] = useState(1);

  const [autoPickUp, setAutoPickUp] = useState(false);

  const autoPickUpRef = useRef(false);

  const tickTotals = [300, 150, 50];

  const speedSettingRef = useRef(tickTotals[0]);
  const manualOnlyRef = useRef(true);

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

  const randomMomentIdsRef = useRef<string[]>([]);

  useEffect(() => {
    randomMomentIdsRef.current = pickRandomMomentIds(capsuleList, 4);
  }, [capsuleList]);

  useEffect(() => {
    // console.log('autoselect !!!')
    if (autoSelectType === 0) {
      randomMomentIdsRef.current = pickRandomMomentIds(capsuleList, 4);
    } else if (autoSelectType < 8) {
      randomMomentIdsRef.current = pickTopScoredMomentIds(
        capsuleList,
        autoSelectType,
        4,
      );
    }
  }, [autoSelectType]);

  const selectLabel = useMemo(() => {
    return getAutoSelectLabel(autoSelectType);
  }, [autoSelectType]);

  // const regenerateRandomMoments = () => {
  //   if (!capsuleList || capsuleList.length < 4) return;

  //   randomMomentIdsRef.current = pickRandomMomentIds(capsuleList, 4);

  //   console.log("🔄 regenerated random ids:", randomMomentIdsRef.current);
  // };

  const handleChangeSpeed = (newSpeedFromButton) => {
    speedSettingRef.current = tickTotals[newSpeedFromButton] || 150;
    setSpeedSetting(newSpeedFromButton);
  };

  const handleNavToSelect = useCallback(() => {
    if (autoPickUp) {
      setAutoPickUp(false);
      autoPickUpRef.current = false;
    } else {
      // Reset autoSelectType before navigating so it will always trigger when coming back
      // setAutoSelectType(-1); // or any value that's not in your normal range
      navigateToGeckoSelectSettings({ selection: autoSelectType });
    }
  }, [autoPickUp, autoSelectType]);

  const handleNavToQRCode = useCallback(() => {
    // Reset autoSelectType before navigating so it will always trigger when coming back
    // setAutoSelectType(-1); // or any value that's not in your normal range
    navigateToQRCode({
      selection: autoSelectType,
      friendName: selectedFriend.name,
      friendId: selectedFriend.id,
      friendNumber: friendDash?.suggestion_settings.phone_number,
    });
  }, [selectedFriend]);

  useEffect(() => {
    if (!manualOnly) {
      console.log("keep awake!!");
      activateKeepAwakeAsync();
    } else {
      deactivateKeepAwake();
      console.log("sleep");
    }

    return () => deactivateKeepAwake(); // safety cleanup
  }, [manualOnly]);

  const handleToggleManual = () => {
    setManualOnly((prev) => !prev);
    manualOnlyRef.current = !manualOnlyRef.current;
  };
  useEffect(() => {
    // console.log(momentCoords);
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

 

  // this one resets the parent state with data from momentsClass
  // this prevents mismatches when moments are picked up or dropped
  const handleRescatterMoments_insideMS = (newData) => {
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
        const randomY = Math.random() * (maxY - minY) + minY;

        return {
          ...m,
          coord: [randomX, randomY],
        };
      }),
    );
  };

  // DON'T DELETE JUST YET
  // const handleRecenterMoments = () => {
  //   setScatteredMoments((prev) =>
  //     prev.map((m) => {
  //       // If moment is held, keep it offscreen
  //       if (m.stored_index !== null && m.stored_index >= 0 && m.stored_index < 4) {
  //         return {
  //           ...m,
  //           coord: [-100, -100],
  //         };
  //       }

  //       return {
  //         ...m,
  //         coord: [0.5, 0.5],
  //       };
  //     }),
  //   );
  // };

  const handleRecenterMoments_insideMS = (newData) => {
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
  };
  //  const [count, setCount] = useState(0);

  const count = useSharedValue(0);

  const loopCount = useRef(0);
  const pickupCountInCurrentLoop = useRef(0);

  const handleGetMoment = useCallback(
    (id) => {
      const moment = capsuleList.find((c) => c.id === id);

      if (!moment?.id) {
        setMoment({
          category: null,
          capsule: null,
          uniqueIndex: null,
          id: null,
        });
        return;
      }

      setMoment({
        category: moment.user_category_name,
        capsule: moment.capsule,
        uniqueIndex: moment.uniqueIndex,
        id: moment.id,
      });

      const charCount = Number(moment?.charCount) || 0;
      const isSubtracting = loopCount.current % 2 !== 0;
      const delta = isSubtracting ? -charCount : charCount;

      // Direct assignment is safer than runOnUI for simple operations
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
    <NoGradientBackground
      style={styles.backgroundContainer}
    >
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
          // handleRescatterMoments={handleRescatterMoments}
          // handleRecenterMoments={handleRecenterMoments}
          manualOnly={manualOnlyRef}
          speedSetting={speedSettingRef}
          autoPickUp={autoPickUpRef}
          randomMomentIds={randomMomentIdsRef}
          handleRescatterMomentsInternal={handleRescatterMoments_insideMS}
          handleRecenterMomentsInternal={handleRecenterMoments_insideMS}
        />
      </View>

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
          ></SvgIcon>
        </Pressable>

        {!manualOnly && (
          <View style={{ marginHorizontal: 10 }}>
            <SpeedButtons
              // color={lightDarkTheme.primaryBackground}
              color={lightDarkTheme.primaryText}
              curSetting={speedSetting}
              buttonDiameter={40}
              buttonPadding={0}
              iconSize={24}
              // backgroundColor={lightDarkTheme.lighterOverlayBackground}
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
          // backgroundColor={lightDarkTheme.lighterOverlayBackground}
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
            // backgroundColor={lightDarkTheme.lighterOverlayBackground}
            backgroundColor={lightDarkTheme.primaryBackground}
            onPress={handleNavToSelect}
          />
        </View>
      )}

      <GlassPreviewBottom
        color={lightDarkTheme.primaryText}
        backgroundColor={lightDarkTheme.darkerOverlayBackground}
        // borderColor={selectedFriend.darkColor}
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
    // width: "100%",
    height: 106,
    padding: 20,
    paddingHorizontal: 20,
    top: 60,
    left: 16, //same as pawsetter
    flex: 1,
    // width: 170,
    position: "absolute",
    flexDirection: "column",
    //  alignItems: "center",
    borderRadius: 30,
    //   borderWidth: 1,
    //   shadowColor: "#000",
    //  shadowOffset: { width: 0, height: 4 },
    //   shadowOpacity: 0.3,
    //   shadowRadius: 4.65,
    //  elevation: 8,
  },

  scoreWrapper: {
    // width: "100%",
    height: 80,
    padding: 20,
    paddingHorizontal: 20,
    top: 150,
    left: 16, //same as pawsetter
    flex: 1,
    // width: 170,
    position: "absolute",
    flexDirection: "column",
    //  alignItems: "center",
    borderRadius: 30,
    //   borderWidth: 1,
    //   shadowColor: "#000",
    //  shadowOffset: { width: 0, height: 4 },
    //   shadowOpacity: 0.3,
    //   shadowRadius: 4.65,
    //  elevation: 8,
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
    //  alignItems: "center",
    // borderRadius: 999,
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
    //   shadowColor: "#000",
    //  shadowOffset: { width: 0, height: 4 },
    //   shadowOpacity: 0.3,
    //   shadowRadius: 4.65,
    //  elevation: 1,
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
    //fontWeight: "bold",
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
    // backgroundColor: 'teal',
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
