import { View, StyleSheet, Pressable, Text, Vibration } from "react-native";
import React, {
  useState,
  useRef,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import useGroqBeta from "@/src/hooks/useGroqBeta";
import useGeckoReadMoments from "@/src/hooks/useGeckoReadMoments";
import { showModalMessage } from "@/src/utils/ShowModalMessage";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import useUpdateGeckoData from "@/src/hooks/useUpdateGeckoData";
import DebugPanel from "../moments/DebugPanel";
import { useLDTheme } from "@/src/context/LDThemeContext";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import useUpdateMomentCoords from "@/src/hooks/CapsuleCalls/useUpdateCoords";
import manualGradientColors from "@/app/styles/StaticColors";
import useGeckoStaticData from "@/src/hooks/useGeckoStaticData";
import useUserPoints from "@/src/hooks/useUserPoints";
import useGeckoSynthesizer from "@/src/hooks/useGeckoSynthesizer";
import useGeckoSynthesizer_WS from "@/src/hooks/useGeckoSynthesizer_WS";
import useUserGeckoCombinedData from "@/src/hooks/useUserGeckoCombinedData";
import useFriendGeckoSessionsTimeRange from "@/src/hooks/GeckoCalls/useFriendGeckoSessionsTimeRange";
import useUserGeckoSessionsTimeRange from "@/src/hooks/GeckoCalls/useUserGeckoSessionsTimeRange";
// import useUserGeckoConfigs from "@/src/hooks/GeckoCalls/useUserGeckoConfigs";
import useGeckoScoreState from "@/src/hooks/useGeckoScoreState";
import useUpdateGeckoScoreState from "@/src/hooks/useUpdateGeckoScoreState";
import SvgIcon from "@/app/styles/SvgIcons";
import SpeedButtons from "./SpeedButtons";
import AutoPickUpButton from "./AutoPickUpButton";
import QRCodeButton from "./QRCodeButton";
import useFriendDash from "@/src/hooks/useFriendDash";
import useUser from "@/src/hooks/useUser";
import AnimatedCounter from "./AnimatedCounter";
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";
import NoGradientBackground from "@/app/components/appwide/format/NoGradientBackground";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import GlassPreviewBottom from "./GlassPreviewBottom";
import GlassTopBarLight from "./GlassTopBarLight";
import MomentsSkia from "@/app/assets/shader_animations/MomentsSkia";
import { LightSensor, DeviceMotion } from "expo-sensors";
import useFriendPickSession from "@/src/hooks/CapsuleCalls/useFriendPickSession";
import { SkFont } from "@shopify/react-native-skia";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { useSharedValue } from "react-native-reanimated";
import { freezeEnabled } from "react-native-screens";
import { useGeckoEnergySocket } from "@/src/hooks/useGeckoEnergySocket";

type Props = {
  skiaFontLarge: SkFont;
  skiaFontSmall: SkFont;
};

// Pure scoring function — add all point rules here, outside the component so it
// never gets recreated and never needs to be passed into handleGetMoment.
// Parameters: the picked moment and whatever state is needed to evaluate the rule.
// Returns the total bonus points earned by this single pickup.
const scorePickup = (moment: any, lastCategory: string | null): number => {
  if (lastCategory !== null && lastCategory === moment.user_category_name) {
    return 1;
  }

  return 0;
};

const ScreenGecko = ({ skiaFontLarge, skiaFontSmall }: Props) => {
  const { totalPoints } = useUserPoints();
  const count = useSharedValue(totalPoints);
  const scoreLabelRef = useRef("");

  const route = useRoute();
  const selection = route.params?.selection ?? null;
  const autoPick = route.params?.autoPick ?? false;
  const timestamp = route.params?.timestamp ?? null;
  // const pollMode = route.params?.pollMode ?? false;
  const sessionId = route.params?.sessionId ?? null;

  const { user } = useUser();
  const { lightDarkTheme } = useLDTheme();
  const { capsuleList } = useCapsuleList();
  const { selectedFriend } = useSelectedFriend();

  const { geckoCombinedData } = useUserGeckoCombinedData();
  const { sessionTotals } = useFriendGeckoSessionsTimeRange({
    friendId: selectedFriend?.id,
    minutes: 720,
  });
  const { userSessionTotals } = useUserGeckoSessionsTimeRange({ minutes: 720 });

  const { geckoScoreState } = useGeckoScoreState();

  const multiplierRef = useRef(1);

  const energyRef = useRef({ energy: 1.0, surplusEnergy: 0.0 });
  // const geckoScoreStateRef = useRef(geckoScoreState);
  // useEffect(() => {

  //   if (geckoScoreState)

  //     {
  //   geckoScoreStateRef.current = geckoScoreState;
  //     }

  // }, [geckoScoreState]);

  useEffect(() => {
    // console.log(`[geckoScoreState changed]`, geckoScoreState);
    if (!geckoScoreState) return;
    const expired =
      !geckoScoreState.expires_at ||
      new Date(geckoScoreState.expires_at).getTime() <= Date.now();
    multiplierRef.current = expired ? 1 : (geckoScoreState.multiplier ?? 1);
  }, [geckoScoreState]);

  const { scoreRules } = useGeckoStaticData();

  const scoreRulesRef = useRef<
    Record<string, { code: number; points: number } | undefined>
  >({});

  useEffect(() => {
    scoreRulesRef.current = {
      GECKO_READ_ALL_NOTES: scoreRules.labels("GECKO_READ_ALL_NOTES"),
      CATEGORY_MATCHES_PREVIOUS: scoreRules.labels("CATEGORY_MATCHES_PREVIOUS"),
    };
  }, [scoreRules]);

  // const {
  //   gecko,
  //   updateReadIds,
  //   getReadIds,
  //   hasReadAll,
  //   hasInitialized,
  //   markInitialized,
  // } = useGeckoSynthesizer({
  //   userId: user?.id,
  //   geckoCombinedData,
  //   geckoConfigs,
  //   geckoScoreState,
  //   sessionTotals,
  //   userSessionTotals,
  //   friendId: selectedFriend?.id,
  //   capsuleCount: capsuleList.length,
  // });

  const {
    socketStatus,
    scoreStateRef,
    liveScoreState,
    getScoreState,
    updateGeckoData,
    flush,
    registerOnScoreState,
    registerOnSync,
    hasReceivedInitialScoreStateRef,
    initialBackendEnergyUpdatedAtRef,
    latestBackendEnergyUpdatedAtRef,
  } = useGeckoEnergySocket(selectedFriend?.id ?? null);

  useEffect(() => {
    if (socketStatus) {
      showFlashMessage(`Socket ${socketStatus}`, false, 1000);
    }
  }, [socketStatus]);
  useEffect(() => {
    registerOnScoreState((data: any) => {
      if (!data) return;
      energyRef.current = {
        energy: data.energy ?? energyRef.current.energy,
        surplusEnergy: data.surplus_energy ?? energyRef.current.surplusEnergy,
      };
    });
  }, [registerOnScoreState]);

  // const {
  //     gecko,
  //     updateReadIds,
  //     getReadIds,
  //     hasReadAll,
  //     hasInitialized,                                                                                                                                                             markInitialized,
  //     isAwake,
  //   } = useGeckoSynthesizer_WS({
  //     userId: user?.id,
  //     geckoCombinedData,
  //     geckoScoreState,
  //     scoreStateRef,
  //     sessionTotals,
  //     userSessionTotals,
  //     friendId: selectedFriend?.id,
  //     capsuleCount: capsuleList.length,
  //   });

  const {
    gecko,
    updateReadIds,
    getReadIds,
    hasReadAll,
    hasInitialized,
    markInitialized,
    isAwake,
  } = useGeckoSynthesizer_WS({
    userId: user?.id,
    geckoCombinedData,
    geckoScoreState,
    liveScoreState,
    sessionTotals,
    userSessionTotals,
    friendId: selectedFriend?.id,
    capsuleCount: capsuleList.length,
    getScoreState,
  });

  const hasShownWelcome = useRef(false);
  const hasShownReadAll = useRef(false);
  const [localHasReadAll, setLocalHasReadAll] = useState(false);

  const HISTORY_SIZE = 20;
  const momentHistoryRef = useRef({
    buffer: new Array(HISTORY_SIZE).fill(null) as ({
      id: string;
      category: string;
      capsule: string;
    } | null)[],
    pointer: 0,
    count: 0,
  });
  const getHistory = () => {
    const { buffer, pointer, count } = momentHistoryRef.current;
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(buffer[(pointer - count + i + HISTORY_SIZE) % HISTORY_SIZE]!);
    }
    return result;
  };

  const effectiveHasReadAll = hasReadAll || localHasReadAll;
  const [freezeForTalking, setFreezeForTalking] = useState(false);

  const handleFreezeForTalking = () => {
    // console.log("handle freeze");
    setFreezeForTalking(true);
  };

  const handleUnfreezeForTalking = () => {
    // console.log("handle unfreeze!");
    setFreezeForTalking(false);
  };

  useEffect(() => {
    if (gecko && !hasShownReadAll.current && effectiveHasReadAll) {
      stopReading();

      hasShownReadAll.current = true;

      handleFreezeForTalking();
      showModalMessage({
        title: "Read em all!",
        body: "Thanks!",
        onClose: handleUnfreezeForTalking,
        autoCloseTime: 1000,
      });
    }
  }, [gecko, effectiveHasReadAll]);

  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isPollMode, setIsPollMode] = useState(false);

  const { fetchGeckoMoments, loading: geckoReadLoading } = useGeckoReadMoments({
    friendId: selectedFriend?.id,
  });

  const textColor = lightDarkTheme.primaryText;
  const darkerOverlayColor = lightDarkTheme.darkerOverlayBackground;

  const [rescatterTrigger, setRescatterTrigger] = useState(0);
  const [recenterTrigger, setRecenterTrigger] = useState(0);
  const [backTrigger, setBackTrigger] = useState(0);

  const triggerRescatter = () => setRescatterTrigger((prev) => prev + 1);
  const triggerRecenter = () => setRecenterTrigger((prev) => prev + 1);
  const triggerBack = () => setBackTrigger((prev) => prev + 1);

  useEffect(() => {
    if (!isAwake) {
      triggerBack();
      // handleNavBack();
    }
  }, [isAwake]);

  const GROQ_MESSAGE_PAUSE_TIME = 10000;
  const { askGroq, onModalCloseRef } = useGroqBeta({
    userId: user?.id,
    friendId: selectedFriend?.id,
    pauseTime: GROQ_MESSAGE_PAUSE_TIME,
  });

  const isAskingRef = useRef(false);

  const handleGeckoReadAndAsk = async () => {
    if (isAskingRef.current) return;
    isAskingRef.current = true;
    try {
      const ids = getHistory()
        .map((m) => `${m.id}`)
        .filter(Boolean);
      if (!ids.length) return;

      const data = await fetchGeckoMoments(ids);
      if (!data?.moments?.length) return;

      const momentsList = data.moments;
      const validIds = momentsList.map((m) => m.id);

      // Step 1: Ask groq to pick one capsule, return ONLY the id
      const pickReply = await askGroq(
        "You are selecting one note to talk about. Look at the following notes and pick the one you find most interesting or curious. Respond with ONLY the id of the note you pick. Nothing else. No quotes, no explanation, no punctuation. Just the id.",
        JSON.stringify(momentsList),
        { silent: true, noHistory: true },
      );

      // console.log(pickReply)

      // Validate the pick — fall back to random if groq returns garbage
      const trimmedPick = pickReply?.trim();
      const pickedId = validIds.includes(trimmedPick)
        ? trimmedPick
        : validIds[Math.floor(Math.random() * validIds.length)];

      manualOnlyRef.current = false; // make sure auto mode if not already
      oneTimeSelectIdRef.current = pickedId;

      const pickedMoment = momentsList.find((m) => m.id === pickedId);

      // Register cleanup for when modal closes
      onModalCloseRef.current = () => {
        oneTimeSelectIdRef.current = null;
        manualOnlyRef.current = false;
      };

      // Step 2: Ask groq to comment on the picked capsule
      const reply = await askGroq(
        `You picked the following note to talk about. In ONE SENTENCE ONLY, with a single word exclamation preceding the sentence to describe how you feel, please ask me one question about this note (by which I mean, the CONTENT OF THE 'CAPSULE' ONLY!!!!). NEVER reveal the name of a field/key in this data. EVER. Your question should be a little more interesting and intelligent than just 'what does this mean' lol. Ask me about it as if you wanna hear a fun story about it! You can add ONE more sentence at the end if you want to, reflecting on the fact that you are not inside a chat and I won't be able to answer you, so you will be left pondering the mystery on your own. If you include this sentence, end it with ... instead of a period`,
        JSON.stringify(pickedMoment),
      );

      //   setTimeout(() => {
      //     showModalMessage({ title: "Gecko says", body: reply });
      //      setTimeout(() => oneTimeSelectIdRef.current = null, GROQ_MESSAGE_PAUSE_TIME);

      // }  , 2000);
    } catch (e: any) {
      showModalMessage({
        title: "Gecko error",
        body: e?.message || "Something went wrong",
        onClose: handleUnfreezeForTalking,
      });
    } finally {
      isAskingRef.current = false;
    }
  };

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

  // DONT DELETE
  // useFocusEffect(
  //   useCallback(() => {
  //     // Wake up sensors on focus
  //     DeviceMotion.setUpdateInterval(100);

  //     const motionSub = DeviceMotion.addListener(({ rotation }) => {
  //       tiltX.value = rotation.beta;
  //       tiltY.value = rotation.gamma;
  //     });

  //     const lightSub = LightSensor.addListener(({ illuminance }) => {
  //       const prev = luxRef.current;
  //       luxRef.current = illuminance;

  //       const crossedThreshold =
  //         (prev < 50 && illuminance >= 50) ||
  //         (prev >= 50 && illuminance < 50) ||
  //         (prev < 500 && illuminance >= 500) ||
  //         (prev >= 500 && illuminance < 500);

  //       if (crossedThreshold) {
  //         const mapped = Math.min(1.0, Math.max(0.2, illuminance / 1000));
  //         speedMultiplier.value = mapped;
  //       }
  //     });

  //     // Sleep sensors on blur
  //     return () => {
  //       motionSub.remove();
  //       lightSub.remove();
  //     };
  //   }, []),
  // );

  //////////////////////////////////////////////////////////////////////////////////////////////

  useFocusEffect(
    useCallback(() => {
      const newSessionId = route.params?.sessionId ?? null;
      const newPollMode = route.params?.pollMode ?? false;

      // console.log("Screen focused, params:", { newSessionId, newPollMode });

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

  // console.log(
  //   `PICK SESSION VALUES: `,
  //   isPressed,
  //   isExpired,
  //   pressedAt,
  //   activeSessionId,
  // );

  const {
    navigateToMomentView,
    navigateToMomentFocus,
    navigateToGeckoSelectSettings,
    navigateToQRCode,
    navigateToFriendHome,
  } = useAppNavigations();

  const handleNavBack = () => {
    navigateToFriendHome({ backdropTimestamp: Date.now() });
  };

  const handleNavigateToMoment = useCallback(
    (m) => {
      navigateToMomentView({ moment: m, index: m.uniqueIndex, momentId: m.id });
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

  const { handleUpdateGeckoData } = useUpdateGeckoData({
    userId: user?.id,
    friendId: selectedFriend?.id,
  });

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

  const capsuleMap = useMemo(() => {
    const m = new Map();
    capsuleList.forEach((c) => m.set(c.id, c));
    return m;
  }, [capsuleList]);

  useEffect(() => {
    if (capsuleMap.size > 0 && readDataRef.current.size < capsuleMap.size) {
      setLocalHasReadAll(false);
      hasShownReadAll.current = false;
      pointsGivenForReadAllRef.current = false;
    }
  }, [capsuleMap]);

  // sort by angle from center
  const momentCoords = useMemo(() => {
    return [...capsuleList]
      .sort((a, b) => {
        const angleA = Math.atan2(a.screen_y - 0.5, a.screen_x - 0.5);
        const angleB = Math.atan2(b.screen_y - 0.5, b.screen_x - 0.5);
        return angleA - angleB;
      })
      .slice(0, MAX_MOMENTS)
      .map((m) => ({
        id: m.id,
        coord: [m.screen_x, m.screen_y],
        stored_index: m.stored_index,
      }));
  }, [capsuleList]);

  const [resetSkia, setResetSkia] = useState<number | null>(null);

  const [manualOnly, setManualOnly] = useState(true);
  const [speedSetting, setSpeedSetting] = useState(2);

  const tickTotalsRef = useRef([120, 85, 50]);

  const speedSettingRef = useRef(tickTotalsRef.current[0]);
  const manualOnlyRef = useRef(true);

  const oneTimeSelectIdRef = useRef(null);

  const randomWakeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const randomSleepTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const randomAutoEnabledRef = useRef(false);
  const isReadyRef = useRef(false);

  const startReading = useCallback(() => {
    manualOnlyRef.current = false;
    setManualOnly(false);
  }, []);

  const stopReading = useCallback(() => {
    manualOnlyRef.current = true;
    setManualOnly(true);
    // handleUnfreezeForTalking(); keep froze because modal opens after this finishes
  }, []);

  useEffect(() => {
    if (!gecko || hasShownWelcome.current || effectiveHasReadAll) return;

    hasShownWelcome.current = true;

    handleFreezeForTalking();
    showModalMessage({
      title: "Hi!",
      body: "I'm going to start reading these, if ya don't mind!",
      autoCloseTime: 1000,
      onClose: () => {
        startReading();
      },
    });
  }, [gecko, effectiveHasReadAll]);

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
    if (hasInitialized) return;
    if (!capsuleList || capsuleList.length === 0) return;

    markInitialized();

    // randomMomentIdsRef drives which moments the animation auto-selects during gameplay.
    // this is separate from what the gecko is "holding" — holding is determined by stored_index on the backend.
    const ids = pickRandomMomentIds(capsuleList, 4);
    randomMomentIdsRef.current = ids;

    // the gecko's held moments are the ones the backend flagged with stored_index 0-3.
    // these are already physically in the gecko's hands when the screen loads,
    // so they count as read immediately — add them to readData without waiting for a pickup.
    const heldMoments = capsuleList.filter(
      (c) =>
        c.stored_index !== null && c.stored_index >= 0 && c.stored_index < 4,
    );

    heldMoments.forEach((found) => {
      const id = `${found.id}`;
      readDataRef.current.set(id, {
        id,
        category: found.user_category_name,
        capsule: found.capsule,
      });
      const h = momentHistoryRef.current;
      h.buffer[h.pointer] = {
        id,
        category: found.user_category_name,
        capsule: found.capsule,
      };
      h.pointer = (h.pointer + 1) % HISTORY_SIZE;
      h.count = Math.min(h.count + 1, HISTORY_SIZE);
    });

    // console.log(`gecko init: holding ${heldMoments.length} moments, readData:`, Array.from(readDataRef.current.values()));
  }, [capsuleList, hasInitialized, markInitialized]);

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

  // const handleChangeSpeed = useCallback((newSpeedFromButton) => {
  //   speedSettingRef.current =
  //     tickTotalsRef.current[newSpeedFromButton] ?? tickTotalsRef.current[1];
  //   setSpeedSetting(newSpeedFromButton);
  // }, []);

  const handleChangeSpeed = useCallback(() => {
    const next = (speedSetting + 1) % 3;
    speedSettingRef.current =
      tickTotalsRef.current[next] ?? tickTotalsRef.current[1];
    setSpeedSetting(next);
  }, [speedSetting]);

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
    // if (freezeForTalking) {
    //   console.log(`not scheduling random`, Date.now(), freezeForTalking);
    // }

    // if (!freezeForTalking) {
    //   console.log(`RESUMING random scheduling`, Date.now(), freezeForTalking);
    // }
    if (!randomAutoEnabledRef.current) return;
    if (!isReadyRef.current) return;

    clearRandomAutoTimeouts();

    const nextDelay = 8000 + Math.random() * 17000;

    randomWakeTimeoutRef.current = setTimeout(() => {
      if (!randomAutoEnabledRef.current) return;

      // console.log("RANDOM AUTO: waking gecko");

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

        // console.log("RANDOM AUTO: putting gecko back to manual");

        manualOnlyRef.current = true;
        setManualOnly(true);

        scheduleRandomWake();
      }, activeDuration);
    }, nextDelay);
  }, [clearRandomAutoTimeouts, freezeForTalking]);

  useFocusEffect(
    useCallback(() => {
      // on focus: re-seed readDataRef from cache so the gecko remembers
      // what it already read in previous sessions on this screen
      const cachedIds = getReadIds();
      cachedIds.forEach((id) => {
        if (!readDataRef.current.has(id)) {
          const found = capsuleList.find((c) => `${c.id}` === id);
          if (found) {
            readDataRef.current.set(id, {
              id,
              category: found.user_category_name,
              capsule: found.capsule,
            });
          }
        }
      });
      // after re-seeding, check if we're already at full read so hasReadAll reflects reality
      if (
        capsuleList.length > 0 &&
        readDataRef.current.size >= capsuleList.length
      ) {
        setLocalHasReadAll(true);
      }

      return () => {
        // on blur: flush readDataRef to cache
        if (readDataRef.current.size > 0) {
          updateReadIds(Array.from(readDataRef.current.keys()));
        }
      };
    }, [updateReadIds, getReadIds, capsuleList]),
  );

  useEffect(() => {
    const ready = !!gecko && hasInitialized && capsuleList.length > 0;
    isReadyRef.current = ready;
    if (ready && randomAutoEnabledRef.current) {
      // data just became ready while screen is focused — start the wake schedule
      scheduleRandomWake();
    }
  }, [gecko, hasInitialized, capsuleList, scheduleRandomWake]);

  useFocusEffect(
    useCallback(() => {
      // console.log("RANDOM AUTO: focus start");

      randomAutoEnabledRef.current = true;
      scheduleRandomWake();

      return () => {
        // console.log("RANDOM AUTO: focus cleanup");

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

  const loopCount = useRef(0);
  const pickupCountInCurrentLoop = useRef(0);
  const lastPickedCategoryRef = useRef<string | null>(null);
  const pointsEarnedListRef = useRef<
    { code: number; label: string; timestamp_earned: string }[]
  >([]);

  const readDataRef = useRef<
    Map<string, { id: string; category: string; capsule: string }>
  >(new Map());

  const pointsGivenForReadAllRef = useRef(false);

  const categoryStreakRef = useRef(0);
  const updateGeckoDataRef = useRef(updateGeckoData);

  useEffect(() => {
    updateGeckoDataRef.current = updateGeckoData;
  }, [updateGeckoData]);

  const handleGetMoment = useCallback(
    (id) => {
      const foundMoment = capsuleMap.get(id);

      if (!foundMoment?.id) {
        setMoment({
          category: null,
          capsule: null,
          uniqueIndex: null,
          id: null,
        });
        return;
      }

      // const prevSize = readDataRef.current.size;
      readDataRef.current.set(`${foundMoment.id}`, {
        id: `${foundMoment.id}`,
        category: foundMoment.user_category_name,
        capsule: foundMoment.capsule,
      });

      if (
        !pointsGivenForReadAllRef.current &&
        readDataRef.current.size >= capsuleMap.size
      ) {
        setLocalHasReadAll(true);
        scoreLabelRef.current = "GECKO_READ_ALL_NOTES";
        pointsGivenForReadAllRef.current = true;
      } else {
        const match = scorePickup(foundMoment, lastPickedCategoryRef.current);
        if (match) {
          scoreLabelRef.current = "CATEGORY_MATCHES_PREVIOUS";
          categoryStreakRef.current += 1;
          if (categoryStreakRef.current >= 5) {
            categoryStreakRef.current = 0;
            setTimeout(
              () =>
                updateGeckoDataRef.current({
                  score_state: { multiplier: 2 },
                }),
              0,
            );
          }
        } else {
          categoryStreakRef.current = 0;
        }
      }
      if (scoreLabelRef && scoreLabelRef.current) {
        pointsEarnedListRef.current.push({
          code: scoreRulesRef.current[scoreLabelRef.current]?.code || 2,
          label: scoreLabelRef.current,
          timestamp_earned: new Date().toISOString(),
        });

        count.value +=
          (scoreRulesRef.current[scoreLabelRef.current]?.points || 0) *
          multiplierRef.current;
        scoreLabelRef.current = "";
      }
      lastPickedCategoryRef.current = foundMoment.user_category_name;
      const h = momentHistoryRef.current;
      h.buffer[h.pointer] = {
        id: `${foundMoment.id}`,
        category: foundMoment.user_category_name,
        capsule: foundMoment.capsule,
      };
      h.pointer = (h.pointer + 1) % HISTORY_SIZE;
      h.count = Math.min(h.count + 1, HISTORY_SIZE);
      // console.log(`history: ${h.count} / ${HISTORY_SIZE}`, h.buffer.slice(0, h.count));

      setMoment({
        category: foundMoment.user_category_name,
        capsule: foundMoment.capsule,
        uniqueIndex: foundMoment.uniqueIndex,
        id: foundMoment.id,
      });

      // const charCount = Number(foundMoment?.charCount) || 0;
      // const isSubtracting = loopCount.current % 2 !== 0;
      // const delta = isSubtracting ? -charCount : charCount;

      // count.value = count.value + delta;

      pickupCountInCurrentLoop.current += 1;
      if (pickupCountInCurrentLoop.current >= capsuleMap.size) {
        loopCount.current += 1;
        pickupCountInCurrentLoop.current = 0;
      }

      Vibration.vibrate(50);
    },
    [capsuleMap, count, setLocalHasReadAll],
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
          updateGeckoData={updateGeckoData}
          liveScoreStateRef={scoreStateRef}
          hasReceivedInitialScoreStateRef={hasReceivedInitialScoreStateRef}
          initialBackendEnergyUpdatedAtRef={initialBackendEnergyUpdatedAtRef}
          latestBackendEnergyUpdatedAtRef={latestBackendEnergyUpdatedAtRef}
          handleUpdateMomentCoords={handleUpdateMomentCoords}
          handleUpdateGeckoData={handleUpdateGeckoData}
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
          oneTimeSelectId={oneTimeSelectIdRef}
          pointsEarnedList={pointsEarnedListRef}
          handleRescatterMomentsInternal={handleRescatterMoments_insideMS}
          handleRecenterMomentsInternal={handleRecenterMoments_insideMS}
          handleNavBack={handleNavBack}
          rescatterTrigger={rescatterTrigger}
          recenterTrigger={recenterTrigger}
          backTrigger={backTrigger}
          geckoScoreState={geckoScoreState}
          energyRef={energyRef}
          liveScoreStateRef={scoreStateRef}
          // geckoScoreStateRef={geckoScoreStateRef}
        />
      </View>
      {/* <DebugPanel /> */}
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
        <Text>{liveScoreState?.energy?.toFixed(2)}</Text>
      </View>

      <GlassPreviewBottom
        readingMode={!manualOnly}
        speedSetting={speedSetting}
        autoPickUp={autoPickUp}
        isPollMode={isPollMode}
        color={textColor}
        highlightColor={selectedFriend.lightColor}
        backgroundColor={darkerOverlayColor}
        borderColor={"transparent"}
        moment={moment.id ? moment : null}
        hasContent={scatteredMoments.length > 0}
        noContentText={BLANK_WINDOW_MESSAGE}
        onPressEdit={handleNavigateToMoment}
        onPressNew={handleNavigateToCreateNew}
        onPress_rescatterMoments={triggerRescatter}
        onPress_recenterMoments={triggerRecenter}
        onPress_saveAndExit={triggerBack}
        onPress_toggleReadMode={handleToggleManual}
        onPress_changeSpeed={handleChangeSpeed}
        onPress_geckoVoice={handleGeckoReadAndAsk}
        onPress_autoPickUpScreen={handleNavToSelect}
        onPress_QRCodeScreen={handleNavToQRCode}
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
