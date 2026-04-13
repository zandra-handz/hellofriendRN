import { View, StyleSheet } from "react-native";
import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
  useMemo,
} from "react";
import { workletMonitor } from "./WorkletDebugger";
import Soul from "./soulClass";
import SleepWalk0 from "./sleepWalkOneClass";
import Mover from "./leadPointClass";
import Gecko from "./geckoClass";
import Moments from "./momentsClass";
import {
  // packGeckoOnlyProdCompact40,
  packGeckoOnlyProdCompact_56,
} from "./animUtils";
import PawSetter from "@/app/screens/fidget/PawSetter";
import {
  MOMENTS_BG_SKSL_OPT,
  MOMENTS_BG_SKSL_OPT_BOXED,
} from "./shaderCode/momentsLGShaderOpt";
import {
  GECKO_ONLY_TRANSPARENT_SKSL_OPT_COMPACT_BOX,
  // GECKO_ONLY_TRANSPARENT_SKSL_OPT_COMPACT_NO_FINGERS,
  // GECKO_DEBUG_DOTS_SKSL,
  // GECKO_SKELETON_SKSL,
} from "./shaderCode/geckoMomentsLGShaderOpt_Compact";
import { PEER_DOT_SKSL } from "./shaderCode/peerDotShader";
import { BackHandler } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  runOnJS,
  useSharedValue,
  useDerivedValue,
} from "react-native-reanimated";

import { useWindowDimensions } from "react-native";
import {
  hexToVec3,
  // toShaderSpace_inplace,
  toGeckoSpace_inPlace,
  toGeckoPointerScaled_inPlace,
  packVec2Uniform_withRecenter_moments,
} from "./animUtils";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  Canvas,
  useCanvasSize,
  Shader,
  Rect,
  Skia,
} from "@shopify/react-native-skia";

// ---------------------------------------------------------------------------
// FPS monitor (prints once/sec). Keep while profiling; remove for production.
// ---------------------------------------------------------------------------
let _last = global.performance?.now?.() ?? Date.now();
let _worst = 0;
let _over = 0;
let _frames = 0;
let _lastReport = _last;

export function frameBudgetMonitor() {
  const now = global.performance?.now?.() ?? Date.now();
  const dt = now - _last;
  _last = now;

  _frames++;
  if (dt > _worst) _worst = dt;
  if (dt > 18) _over++;

  if (now - _lastReport >= 1000) {
    console.log(
      `FPS≈${_frames}  over18ms=${_over}  worst=${_worst.toFixed(1)}ms`,
    );
    _frames = 0;
    _over = 0;
    _worst = 0;
    _lastReport = now;
  }
}

type Props = {
  handleUpdateMomentCoords: any;
  handleGetMoment: any;
  color1: string;
  color2: string;
  bckgColor1: string;
  bckgColor2: string;
  momentsData: [];
  startingCoord0: number;
  startingCoord1: number;
  restPoint0: number;
  restPoint1: number;
  scale: number;
  gecko_scale: number;
  gecko_size: number;
  lightDarkTheme: any;
  hasReceivedInitialScoreStateRef: React.MutableRefObject<boolean>;
  initialBackendEnergyUpdatedAtRef: React.MutableRefObject<string | null>;
  latestBackendEnergyUpdatedAtRef: React.MutableRefObject<string | null>;
  // handleRescatterMoments: any;
  // handleRecenterMoments: any;
  manualOnly: any;
  speedSetting: any;
  autoPickUp: any;
  randomMomentIds: any;
  pointsEarnedList: any;
  reset?: number | null;
};

const MomentsSkia = ({
  updateGeckoData,
  sendGeckoPositionRef,
  sendHostGeckoPositionRef,
  peerGeckoPositionSV,
  handleUpdateMomentCoords,
  handleUpdateGeckoData,
  handleGetMoment,
  color1,
  color2,
  bckgColor1,
  bckgColor2,
  momentsData = [],
  startingCoord0,
  startingCoord1,
  restPoint0,
  restPoint1,
  scale = 1,
  gecko_scale = 1,
  gecko_size = 1.2,
  lightDarkTheme,
  // handleRescatterMoments,
  // handleRecenterMoments,
  manualOnly,
  speedSetting,
  autoPickUp,
  randomMomentIds,
  oneTimeSelectId,
  pointsEarnedList,
  reset = 0,
  handleRescatterMomentsInternal,
  handleRecenterMomentsInternal,
  handleNavBack,
  rescatterTrigger,
  recenterTrigger,
  backTrigger,
  geckoScoreState,
 
  liveScoreStateRef, 
  hasReceivedInitialScoreStateRef,
  initialBackendEnergyUpdatedAtRef,
  latestBackendEnergyUpdatedAtRef,
}: Props) => {
  const { width, height } = useWindowDimensions();
  const { ref, size } = useCanvasSize();

  const [aspect, setAspect] = useState<number>(width / height);

  const sessionStartRef = useRef<number>(Date.now());
  const sessionEndRef = useRef<number>(Date.now());

  // For interval saving while staying on screen

  // Offset so we can keep the original list

  const prevPointsLengthRef = useRef<number>(0);

  const stepsRef = useRef<number>(0);
  const distanceRef = useRef<number>(0);

  useEffect(() => {
    if (size && size.width > 0 && size.height > 0) {
      const newAspect = size.width / size.height;
      setAspect(newAspect);
    }
  }, [size]);

  const nowMs = () => global.performance?.now?.() ?? Date.now();

  const shaderTimeSV = useSharedValue(0);
  const startMsRef = useRef(nowMs());
  // const lastFrameMsRef = useRef(startMsRef.current);

  const updateTrigger = useSharedValue(0);
  const lastRenderRef = useRef(0);
  const isPausedRef = useRef(false);
  const lastAutoPickupIdRef = useRef(-1);
  // const geckoStepsRef = useRef(0);
  // const geckoDistanceRef = useRef(0);

  const didInitSessionWindowRef = useRef(false);

useEffect(() => {
  if (didInitSessionWindowRef.current) return;
  if (!hasReceivedInitialScoreStateRef.current) return;

  const iso = initialBackendEnergyUpdatedAtRef.current;
  if (!iso) return;

  const ms = new Date(iso).getTime();
  if (!Number.isFinite(ms)) return;

  sessionStartRef.current = ms;
  sessionEndRef.current = ms;
  didInitSessionWindowRef.current = true;

  console.log("[FRONTEND WINDOW INIT FROM SOCKET]", {
    initialBackendEnergyUpdatedAt: iso,
    sessionStartIso: new Date(sessionStartRef.current).toISOString(),
    sessionEndIso: new Date(sessionEndRef.current).toISOString(),
  });
}, [
  hasReceivedInitialScoreStateRef,
  initialBackendEnergyUpdatedAtRef,
]);

  const handleRescatterMoments_useMomentClass = () => {
    handleRescatterMomentsInternal(moments.current.moments);
  };

  useEffect(() => {
    if (rescatterTrigger) {
      handleRescatterMoments_useMomentClass();
    }
  }, [rescatterTrigger]);

  const handleRecenterMoments_useMomentClass = () => {
    handleRecenterMomentsInternal(moments.current.moments);
  };

  useEffect(() => {
    if (rescatterTrigger) {
      handleRescatterMomentsInternal(moments.current.moments);
    }
  }, [rescatterTrigger]);

  useEffect(() => {
    if (recenterTrigger) {
      handleRecenterMomentsInternal(moments.current.moments);
    }
  }, [recenterTrigger]);

const applyLiveScoreStateToGait = useCallback(() => {
  const live = liveScoreStateRef?.current;
  if (!live || !gecko.current) return;

  gecko.current.gait.energy = live.energy ?? gecko.current.gait.energy;
  gecko.current.gait.surplusEnergy =
    live.surplus_energy ?? gecko.current.gait.surplusEnergy;
  gecko.current.gait.expiresAt = live.expires_at
    ? new Date(live.expires_at).getTime()
    : 0;
  gecko.current.gait.multiplier = live.multiplier ?? 1;
  gecko.current.gait.baseMultiplier = live.base_multiplier ?? 1;
  gecko.current.gait.stepFatiguePerStep =
    live.step_fatigue_per_step ?? gecko.current.gait.stepFatiguePerStep;
  gecko.current.gait.rechargePerSecond =
    live.recharge_per_second ?? gecko.current.gait.rechargePerSecond;
  gecko.current.gait.streakFatigueMultiplier =
    live.streak_fatigue_multiplier ??
    gecko.current.gait.streakFatigueMultiplier;
  gecko.current.gait.streakRechargePerSecond =
    live.streak_recharge_per_second ??
    gecko.current.gait.streakRechargePerSecond;
  gecko.current.gait.surplusCap =
    live.surplus_cap ?? gecko.current.gait.surplusCap;
  gecko.current.gait.stamina =
    live.stamina ?? gecko.current.gait.stamina;

  // Re-anchor gait's local timing to the latest backend truth
  gecko.current.gait.lastUpdateTime =
    global.performance?.now?.() ?? Date.now();

  // One-time session window init from backend
  if (!didInitSessionWindowRef.current && live.energy_updated_at) {
    const ms = new Date(live.energy_updated_at).getTime();

    if (Number.isFinite(ms)) {
      sessionStartRef.current = ms;
      sessionEndRef.current = ms;
      didInitSessionWindowRef.current = true;

      console.log("[FRONTEND WINDOW INIT FROM SOCKET]", {
        backendEnergyUpdatedAt: live.energy_updated_at,
        sessionStartIso: new Date(sessionStartRef.current).toISOString(),
        sessionEndIso: new Date(sessionEndRef.current).toISOString(),
      });
    }
  }
}, [liveScoreStateRef]);

  useEffect(() => {
    applyLiveScoreStateToGait();
  }, [applyLiveScoreStateToGait]);

  // const handleUpdateGeckoDataState = async () => {
  //   sessionStartRef.current = sessionEndRef.current;
  //   sessionEndRef.current = Date.now();

  //   const startPointsIndex = prevPointsLengthRef.current;
  //   const endPointsIndex = pointsEarnedList.current.length;

  //   const handleUpdateGeckoDataState = async () => {
  //     sessionStartRef.current = sessionEndRef.current;
  //     sessionEndRef.current = Date.now();

  //     const startPointsIndex = prevPointsLengthRef.current;
  //     const endPointsIndex = pointsEarnedList.current.length;

  //     const success = await handleUpdateGeckoData({
  //       steps: gecko.current.gait.stepCount - stepsRef.current,
  //       distance: leadPoint.current.leadDistanceTraveled - distanceRef.current,
  //       startedOn: new Date(sessionStartRef.current).toISOString(),
  //       endedOn: new Date(sessionEndRef.current).toISOString(),
  //       pointsEarnedList: pointsEarnedList.current.slice(
  //         startPointsIndex,
  //         endPointsIndex,
  //       ),
  //     });

  //     if (!success)
  //       {

  //         return;
  //       }

  //     // {1}, {2}, {3}, {4}, {5} // saved as 5, .length is the index of the next one
  //     // {1}, {2}, {3}, {4}, {5}, {6}, {7}, {8}

  //     stepsRef.current = gecko.current.gait.stepCount;
  //     distanceRef.current = leadPoint.current.leadDistanceTraveled;
  //     prevPointsLengthRef.current = endPointsIndex;
  //   };
  // };

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~can yo

  const handleUpdateGeckoDataState = async () => {

    if (!didInitSessionWindowRef.current) {
  const iso = initialBackendEnergyUpdatedAtRef.current ?? liveScoreStateRef?.current?.energy_updated_at;

  if (iso) {
    const ms = new Date(iso).getTime();
    if (Number.isFinite(ms)) {
      sessionStartRef.current = ms;
      sessionEndRef.current = ms;
      didInitSessionWindowRef.current = true;

      console.log("[FRONTEND WINDOW INIT FROM SOCKET - FORCED IN SEND]", {
        backendEnergyUpdatedAt: iso,
        sessionStartIso: new Date(sessionStartRef.current).toISOString(),
        sessionEndIso: new Date(sessionEndRef.current).toISOString(),
      });
    }
  }
}
    sessionStartRef.current = sessionEndRef.current;
    sessionEndRef.current = Date.now();


    console.log("[FRONTEND VS BACKEND START]", {
      frontend_started_on: new Date(sessionStartRef.current).toISOString(),
      frontend_ended_on: new Date(sessionEndRef.current).toISOString(),
      initial_backend_energy_updated_at: initialBackendEnergyUpdatedAtRef.current,
      latest_backend_energy_updated_at: latestBackendEnergyUpdatedAtRef.current,
      didInitSessionWindow: didInitSessionWindowRef.current,
    });


    const startPointsIndex = prevPointsLengthRef.current;
    const endPointsIndex = pointsEarnedList.current.length;

    const newPoints = pointsEarnedList.current.slice(
      startPointsIndex,
      endPointsIndex,
    );

    //  const latest = geckoScoreStateRef.current;
    // if (latest) {
    //     gecko.current.gait.energy = latest.energy;
    //     gecko.current.gait.surplusEnergy = latest.surplus_energy;
    // }

 

    console.log("[FRONTEND BATCH SNAPSHOT]", {
      startedOn: new Date(sessionStartRef.current).toISOString(),
      endedOn: new Date(sessionEndRef.current).toISOString(),
      durationSec: (sessionEndRef.current - sessionStartRef.current) / 1000,
      stepsDelta: gecko.current.gait.stepCount - stepsRef.current,
      distanceDelta:
        leadPoint.current.leadDistanceTraveled - distanceRef.current,
      frontendEnergy: gecko.current.gait.energy,
      frontendSurplusEnergy: gecko.current.gait.surplusEnergy,
      frontendMultiplier: gecko.current.gait.multiplier,
      frontendBaseMultiplier: gecko.current.gait.baseMultiplier,
      frontendExpiresAt: gecko.current.gait.expiresAt ?? null,
      pointsCount: newPoints.length,
    });

    // const success = await handleUpdateGeckoData({
    //   steps: gecko.current.gait.stepCount - stepsRef.current,
    //   distance:
    //     leadPoint.current.leadDistanceTraveled - distanceRef.current,
    //   startedOn: new Date(sessionStartRef.current).toISOString(),
    //   endedOn: new Date(sessionEndRef.current).toISOString(),
    //   pointsEarnedList: newPoints,
    // });

  const { fatigue: client_fatigue, recharge: client_recharge } =                                                                                                                                                                                         gecko.current.gait.consumeWindowTotals();                                                                                                                                                                                                        
                                                                                                                                                                                                                                                     
  const payload = {
    steps: gecko.current.gait.stepCount - stepsRef.current,
    distance: leadPoint.current.leadDistanceTraveled - distanceRef.current,
    started_on: new Date(sessionStartRef.current).toISOString(),
    ended_on: new Date(sessionEndRef.current).toISOString(),
    points_earned: newPoints,
    //NEW FOR ANALYZING SYNC VIA BACKEND
    client_energy: gecko.current.gait.energy,
    client_surplus_energy: gecko.current.gait.surplusEnergy,
    client_multiplier: gecko.current.gait.multiplier,
    client_computed_at: new Date().toISOString(),
    client_fatigue,
    client_recharge,
  };


    console.log("[FRONTEND SEND PAYLOAD]", payload);

    updateGeckoData?.(payload);

    // updateGeckoData?.({
    //   steps: gecko.current.gait.stepCount - stepsRef.current,
    //   distance: leadPoint.current.leadDistanceTraveled - distanceRef.current,
    //   started_on: new Date(sessionStartRef.current).toISOString(),
    //   ended_on: new Date(sessionEndRef.current).toISOString(),
    //   points_earned: newPoints,
    // });

    // if (!success) {
    //   return;
    // }
    // commit
    stepsRef.current = gecko.current.gait.stepCount;
    distanceRef.current = leadPoint.current.leadDistanceTraveled;
    prevPointsLengthRef.current = endPointsIndex;
  };

  ///~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  //  useEffect(() => {
  // if (geckoScoreState && gecko.current) {
  //         gecko.current.gait.energy = geckoScoreState.energy;
  //         gecko.current.gait.surplusEnergy = geckoScoreState.surplus_energy;
  //     }
  // }, [geckoScoreState]);

  //   useEffect(() => {
  //     if (geckoScoreState && gecko.current) {
  //         gecko.current.gait.energy = geckoScoreState.energy;
  //         gecko.current.gait.surplusEnergy = geckoScoreState.surplus_energy;
  //         gecko.current.gait.expiresAt = geckoScoreState.expires_at
  //             ? new Date(geckoScoreState.expires_at).getTime()
  //             : 0;
  //         gecko.current.gait.multiplier = geckoScoreState.multiplier ?? 1;
  //         gecko.current.gait.baseMultiplier = geckoScoreState.base_multiplier ?? 1;
  //     }
  // }, [geckoScoreState]);

  useEffect(() => {
    const oneMinute = 60000;
    const id = setInterval(handleUpdateGeckoDataState, oneMinute);

    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (backTrigger) {
      const run = async () => {
        await handleUpdateMomentsState();
        await handleUpdateGeckoDataState();
        handleNavBack();
      };
      run();
    }
  }, [backTrigger]);

  // const TOTAL_GECKO_POINTS = 71;
  const MAX_MOMENTS = 30;
  const MAX_HELD = 4;

  const TOTAL_GECKO_POINTS_COMPACT = 56;

  // ============== TRULY PREALLOCATED BUFFERS ==============
  const workingBuffers = useRef({
    soul: new Float32Array(2),
    // walk: new Float32Array(2),
    // hint: new Float32Array(2),
    lead: new Float32Array(2),
    selected: new Float32Array(2),
    lastSelected: new Float32Array(2),

    heldCoords: new Float32Array(MAX_HELD * 2),
    heldTemp: new Float32Array(2),

    geckoPoints: new Float32Array(TOTAL_GECKO_POINTS_COMPACT * 2),
    moments: new Float32Array(MAX_MOMENTS * 2),

    stepTargets: [null, null, null, null] as any[],
  }).current;

  // Shared values (simple arrays, created fresh when needed)
  // const walk0UniformSV = useSharedValue<number[]>([0, 0]);
  // const hintUniformSV = useSharedValue<number[]>([0, 0]);
  const selectedUniformSV = useSharedValue<number[]>([0, 0]);
  const lastSelectedUniformSV = useSharedValue<number[]>([0, 0]);

  // Big uniforms (still SharedValues, but we will only update them when needed)
  const momentsUniformSV = useSharedValue<number[]>(
    Array(MAX_MOMENTS * 2).fill(0),
  );
  const heldMomentUniformSV = useSharedValue<number[]>(
    Array(MAX_HELD * 2).fill(0),
  );
  const geckoPointsUniformSV = useSharedValue<number[]>(
    Array(TOTAL_GECKO_POINTS_COMPACT * 2).fill(0),
  );
  const momentsLengthSV = useSharedValue(0);

  useFocusEffect(
    useCallback(() => {
      isPausedRef.current = false;
      updateTrigger.value += 1;
      return () => {
        isPausedRef.current = true;
        isDragging.value = false;
      };
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => true,
      );
      return () => subscription.remove();
    }, []),
  );

  // only need to do this one when leaving screen
  // this one just ensures permanence when moments are moved around and picked up or dropped
  const handleUpdateMomentsState = async () => {
    const newMoments = moments.current.moments;
    const formattedData = newMoments.map((moment) => ({
      id: moment.id,
      screen_x: moment.coord[0],
      screen_y: moment.coord[1],
      stored_index: moment.stored_index,
    }));
    await handleUpdateMomentCoords(formattedData);
  };
  // const userPointSV = useSharedValue(restPoint);
  const userPointSV = useSharedValue([restPoint0, restPoint1]);
  const userPoint_geckoSpaceRef = useRef<[number, number]>([0, 0]);
  const isDragging = useSharedValue(false);

  const onDoublePress = () => {
    handleGetMoment(-1);
    console.log("double press");
  };

  const wasTapSV = useSharedValue(false);
  const wasDoubleTapSV = useSharedValue(false);

  const panGesture = Gesture.Pan()
    .onTouchesDown((e) => {
      isDragging.value = true;
      const touch = e.changedTouches[0];
      userPointSV.value = [touch.x / size.width, touch.y / size.height];
    })
    .onUpdate((e) => {
      userPointSV.value = [e.x / size.width, e.y / size.height];
    })
    .onEnd(() => {
      isDragging.value = false;
    })
    .onFinalize(() => {
      isDragging.value = false;
    });

  const singleTapGesture = Gesture.Tap()
    .numberOfTaps(1)
    .onEnd((_event, success) => {
      if (success) {
        wasTapSV.value = true;
        setTimeout(() => {
          wasTapSV.value = false;
        }, 100);
      }
    });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd((_event, success) => {
      if (success) {
        wasDoubleTapSV.value = true;
        runOnJS(onDoublePress)();
        setTimeout(() => {
          wasDoubleTapSV.value = false;
        }, 100);
      }
    });

  const taps = Gesture.Exclusive(doubleTapGesture, singleTapGesture);
  const composedGesture = Gesture.Simultaneous(panGesture, taps);

  const color1Converted = hexToVec3(color1);
  const color2Converted = hexToVec3(color2);
  const bckgColor1Converted = hexToVec3(bckgColor1);
  const bckgColor2Converted = hexToVec3(bckgColor2);
 
  const soul = useRef(new Soul(restPoint0, restPoint1, 0.02));
  const leadPoint = useRef(new Mover(startingCoord0, startingCoord1)); 
  const gecko = useRef(
    new Gecko(
      startingCoord0,
      startingCoord1,
      0.06,
      liveScoreStateRef?.current ?? geckoScoreState ?? {},
    ),
  );
  const sleepWalk0 = useRef(
    new SleepWalk0(
      [0.5, 0.3],
      0.3,
      gecko_size,
      manualOnly,
      speedSetting,
      autoPickUp,
      randomMomentIds,
      oneTimeSelectId,
    ),
  );
  const moments = useRef(
    new Moments(momentsData, gecko_size, sleepWalk0, [0.5, 0.5], 0.05),
  );

  const handleGetMomentRef = useRef(handleGetMoment);
  useEffect(() => {
    handleGetMomentRef.current = handleGetMoment;
    // console.log(
    //   `handleGetMoment triggered handleGetMomentRef`,
    //   handleGetMomentRef.current,
    // );
  }, [handleGetMoment]);

  useEffect(() => {
    if (aspect) {
      moments.current.setAspect(aspect);
      sleepWalk0.current.setAspect(aspect);
    }
  }, [aspect]);

  const SHARED_SKSL_PRELUDE = (c1, c2, b1, b2) => `
    vec3 startColor = vec3(${c1});
    vec3 endColor = vec3(${c2});
    vec3 backgroundStartColor = vec3(${b1});
    vec3 backgroundEndColor = vec3(${b2});
  `;

  // const [geckoColor, setGeckoColor] = useState(color2Converted);

  const source = useMemo(() => {
    return Skia.RuntimeEffect.Make(`
      ${SHARED_SKSL_PRELUDE(color1Converted, color2Converted, bckgColor1Converted, bckgColor2Converted)}
      ${GECKO_ONLY_TRANSPARENT_SKSL_OPT_COMPACT_BOX}
    `);
  }, [
    color1Converted,
    color2Converted,
    bckgColor1Converted,
    bckgColor2Converted,
  ]);

  const sourceTwo = useMemo(() => {
    return Skia.RuntimeEffect.Make(`
      ${SHARED_SKSL_PRELUDE(color1Converted, color2Converted, bckgColor1Converted, bckgColor2Converted)}
      ${MOMENTS_BG_SKSL_OPT_BOXED}
    `);
  }, [
    color1Converted,
    color2Converted,
    bckgColor1Converted,
    bckgColor2Converted,
  ]);

  const peerDotSource = useMemo(() => {
    return Skia.RuntimeEffect.Make(PEER_DOT_SKSL);
  }, []);

  const peerDotUniforms = useDerivedValue(() => {
    const p = peerGeckoPositionSV?.value;
    const point = p?.position ?? [-1000, -1000];
    return {
      u_resolution: [size.width || width, size.height || height],
      u_aspect: aspect || 1,
      u_gecko_scale: gecko_scale,
      u_gecko_size: gecko_size,
      u_time: shaderTimeSV.value,
      u_peerPoint: point,
    };
  }, [size.width, size.height, width, height, aspect, gecko_scale, gecko_size]);

  if (!source) {
    console.error("❌ Shader failed to compile");
    return null;
  }

  const hintRef = useRef([0, 0]);

  const [internalReset, setInternalReset] = useState(0);
  const handleReset = () => setInternalReset(Date.now());

  // useEffect(() => {
  //   console.log("resetting");
  //   moments.current.updateOrAddMoments(momentsData);
  //   moments.current.updateAllCoords(momentsData);
  //   updateTrigger.value += 1; // need this to update the moments
  // }, [momentsData, reset]);

  // THIS WAS GIVEN TO ME BY CHATGPT TO ENSURE MOMENT RESCATTERING UPDATES OUTSIDE OF ANIMATION LOOP (WHEN GECKO IS STILL)
  useEffect(() => {
    // console.log("resetting");

    moments.current.updateOrAddMoments(momentsData);
    moments.current.updateAllCoords(momentsData);

    //  PACK + COPY the moments uniform RIGHT NOW
    if (aspect && size.width && size.height) {
      workingBuffers.moments.fill(0);

      packVec2Uniform_withRecenter_moments(
        moments.current.moments, // <-- IMPORTANT: pack from the class
        workingBuffers.moments as any,
        moments.current.momentsLength,
        aspect,
        scale,
      );

      momentsUniformSV.value = Array.from(workingBuffers.moments);
      momentsLengthSV.value = moments.current.momentsLength;
    }

    updateTrigger.value += 1;
  }, [momentsData, reset, aspect, scale, size.width, size.height]);

  useEffect(() => {
    if (!internalReset || !reset) {
      console.log("conditions not met for a reset");
      return;
    }  

    soul.current = new Soul(restPoint0, restPoint1, 0.02);
    leadPoint.current = new Mover(startingCoord0, startingCoord1);
 
    gecko.current = new Gecko(
      startingCoord0,
      startingCoord1,
      0.06,
      liveScoreStateRef?.current ?? geckoScoreState ?? {},
    );
 
    workingBuffers.soul.fill(0); 
    workingBuffers.selected.fill(0);
    workingBuffers.lastSelected.fill(0);
    workingBuffers.heldCoords.fill(0);
    workingBuffers.geckoPoints.fill(0);
    workingBuffers.moments.fill(0);
 
    selectedUniformSV.value = [0, 0];
    lastSelectedUniformSV.value = [0, 0];

    momentsUniformSV.value = Array(MAX_MOMENTS * 2).fill(0);
    heldMomentUniformSV.value = Array(MAX_HELD * 2).fill(0);
    geckoPointsUniformSV.value = Array(TOTAL_GECKO_POINTS_COMPACT * 2).fill(0);
    momentsLengthSV.value = 0;

    userPointSV.value = [restPoint0, restPoint1];

    userPoint_geckoSpaceRef.current[0] = startingCoord0;
    userPoint_geckoSpaceRef.current[1] = startingCoord1;
  }, [reset, internalReset]);

  const frameCountRef = useRef(0);
  const lastTriggeredIdRef = useRef(-1);
  const lastPawsClearedRef = useRef(false);
  const clearAllPawsInUIRef = useRef(() => {});
  const syncPawsInUIRef = useRef<() => void>(() => {});
 
  const lastHoldingsVersionRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    let frame;
    const sleepWalkAfter = 100;

    frameCountRef.current = 0;

    const animate = () => {
      if (cancelled) return;

      // keep rAF alive but avoid doing work while paused
      if (isPausedRef.current) {
        frame = requestAnimationFrame(animate);
        return;
      }

      if (aspect == null || isNaN(aspect) || !size.width || !size.height) {
        frame = requestAnimationFrame(animate);
        return;
      }

      // DON'T DELETE
      // frameBudgetMonitor();

      // DON'T DELETE
      // workletMonitor();

      //  only compute dt/time AFTER we know we're running
      // const now = nowMs();

      // // dt in seconds
      // let dt = (now - lastFrameMsRef.current) / 1000;
      // if (dt > 0.05) dt = 0.05; // clamp resume spike
      // if (dt < 0) dt = 0;

      // lastFrameMsRef.current = now;

      // // advance shader time ONLY when running
      // timeSV.value = (now - startMsRef.current) / 1000;

      // ---- UI / side-effects (unchanged) ----
      if (moments.current.trigger_remote && !lastPawsClearedRef.current) {
        lastPawsClearedRef.current = true;
        clearAllPawsInUIRef.current();
      } else if (
        !moments.current.trigger_remote &&
        lastPawsClearedRef.current
      ) {
        lastPawsClearedRef.current = false;
      }

      const currentId = moments.current.lastSelected?.id ?? -1;
      // console.log(`CURRENT ID`, currentId);
      if (currentId !== -1 && currentId !== lastTriggeredIdRef.current) {
        lastTriggeredIdRef.current = currentId;
        handleGetMomentRef.current(currentId);
      }

      if (leadPoint.current.isMoving && !gecko.current.sleepWalkMode) {
        frameCountRef.current = 0;
      }

      if (isDragging.value && gecko.current.sleepWalkMode) {
        frameCountRef.current = 0;
        gecko.current.updateSleepWalkMode(false);
      }

      // if (frameCountRef.current < sleepWalkAfter) {
      //   frameCountRef.current += 1;
      // } else if (
      //   frameCountRef.current === sleepWalkAfter &&
      //   !gecko.current.sleepWalkMode
      // ) {
      //   gecko.current.updateSleepWalkMode(true);
      // }

      if (frameCountRef.current < sleepWalkAfter) {
        frameCountRef.current += 1;
      } else if (
        frameCountRef.current === sleepWalkAfter &&
        !gecko.current.sleepWalkMode
      ) {
        sleepWalk0.current.initFromPosition(userPoint_geckoSpaceRef.current);
        gecko.current.updateSleepWalkMode(true);
      }

      // ---- pointer transform ----
      toGeckoPointerScaled_inPlace(
        userPointSV.value,
        aspect,
        scale,
        gecko_size,
        userPoint_geckoSpaceRef.current,
        0,
      );

      // ---- drive leadpoint ----
      if (soul.current.done && !gecko.current.oneTimeEnterComplete) {
        gecko.current.updateEnter(soul.current.done);
      } else {
        soul.current.update();
      }

      if (!gecko.current.oneTimeEnterComplete && !gecko.current.sleepWalkMode) {
        leadPoint.current.update(soul.current.soul);
      } else if (
        gecko.current.oneTimeEnterComplete &&
        !gecko.current.sleepWalkMode
      ) {
        leadPoint.current.update(userPoint_geckoSpaceRef.current); //, dt, now);
      } else {
        sleepWalk0.current.update(moments);
        leadPoint.current.update(sleepWalk0.current.walk); //, dt, now);
      }

      // ---- sim update ----
      gecko.current.update(
        leadPoint.current.lead,
        leadPoint.current.angles,
        leadPoint.current.leadDistanceTraveled,
        leadPoint.current.isMoving,
      );

   

      //       geckoStepsRef.current = gecko.current.legs.frontLegs.stepCount;
      // geckoDistanceRef.current = leadPoint.current.leadDistanceTraveled;

      const spine = gecko.current.body.spine;
      hintRef.current = spine.hintJoint || [0, 0];

      // step targets (no alloc)
      workingBuffers.stepTargets[0] =
        gecko.current.legs.frontLegs.stepTargets[0];
      workingBuffers.stepTargets[1] =
        gecko.current.legs.frontLegs.stepTargets[1];
      workingBuffers.stepTargets[2] =
        gecko.current.legs.backLegs.stepTargets[0];
      workingBuffers.stepTargets[3] =
        gecko.current.legs.backLegs.stepTargets[1];

      moments.current.update(
        userPointSV.value,
        isDragging.value,
        wasTapSV.value,
        wasDoubleTapSV.value,
        leadPoint.current.lead,
        workingBuffers.stepTargets,
      );

      if (
        sleepWalk0.current.pickUpNextId !== -1 &&
        sleepWalk0.current.pickUpNextId !== lastAutoPickupIdRef.current
      ) {
        lastAutoPickupIdRef.current = sleepWalk0.current.pickUpNextId;
        syncPawsInUIRef.current();
      }

      // ---------------------------------------------------------------------
      // Calculate transforms into buffers (always do this, cheap)
      // ---------------------------------------------------------------------
      // toShaderSpace_inplace(
      //   soul.current.soul,
      //   aspect,
      //   gecko_scale,
      //   workingBuffers.soul,
      //   0,
      // );
      // toShaderSpace_inplace(
      //   sleepWalk0.current.walk,
      //   aspect,
      //   gecko_scale,
      //   workingBuffers.walk,
      //   0,
      // );
      // toShaderSpace_inplace(
      //   hintRef.current,
      //   aspect,
      //   gecko_scale,
      //   workingBuffers.hint,
      //   0,
      // );

      workingBuffers.selected[0] = moments.current.selected.coord[0];
      workingBuffers.selected[1] = moments.current.selected.coord[1];

      for (let i = 0; i < MAX_HELD; i++) {
        toGeckoSpace_inPlace(
          moments.current.holdings[i].coord,
          gecko_scale,
          workingBuffers.heldTemp,
        );
        workingBuffers.heldCoords[i * 2] = workingBuffers.heldTemp[0];
        workingBuffers.heldCoords[i * 2 + 1] = workingBuffers.heldTemp[1];
      }

      toGeckoSpace_inPlace(
        moments.current.lastSelected.coord,
        gecko_scale,
        workingBuffers.lastSelected,
      );

      // ---------------------------------------------------------------------
      // Gate ALL uniform updates (small AND big) when gecko is moving
      // ---------------------------------------------------------------------

      const holdingsVersion = moments.current.holdingsVersion;

      const shouldUpdateBigUniforms =
        leadPoint.current.isMoving ||
        isDragging.value ||
        wasTapSV.value ||
        wasDoubleTapSV.value ||
        moments.current.trigger_remote ||
        holdingsVersion !== lastHoldingsVersionRef.current;

      if (shouldUpdateBigUniforms) {
        lastHoldingsVersionRef.current = holdingsVersion;
        shaderTimeSV.value = (nowMs() - startMsRef.current) / 1000;

        // .
        // Update small uniforms (creates new arrays, but only when moving)
        // walk0UniformSV.value = [workingBuffers.walk[0], workingBuffers.walk[1]];
        // hintUniformSV.value = [workingBuffers.hint[0], workingBuffers.hint[1]];
        selectedUniformSV.value = [
          workingBuffers.selected[0],
          workingBuffers.selected[1],
        ];
        lastSelectedUniformSV.value = [
          workingBuffers.lastSelected[0],
          workingBuffers.lastSelected[1],
        ];

        // Pack big uniforms
        workingBuffers.geckoPoints.fill(0);
        packGeckoOnlyProdCompact_56(
          gecko.current,
          workingBuffers.geckoPoints,
          gecko_scale,
        );

        workingBuffers.moments.fill(0);
        packVec2Uniform_withRecenter_moments(
          moments.current.moments,
          workingBuffers.moments as any,
          moments.current.momentsLength,
          aspect,
          scale,
        );

        // Copy big uniforms
        heldMomentUniformSV.value = Array.from(workingBuffers.heldCoords);
        geckoPointsUniformSV.value = Array.from(workingBuffers.geckoPoints);
        momentsUniformSV.value = Array.from(workingBuffers.moments);
        momentsLengthSV.value = moments.current.momentsLength;

        // Trigger shader update (throttle a bit)
        const now = Date.now();
        if (now - lastRenderRef.current > 16) {
          lastRenderRef.current = now;
          updateTrigger.value += 1;
        }
      }
         sendGeckoPositionRef.current(leadPoint.current.lead);
         sendHostGeckoPositionRef.current(leadPoint.current.lead);

      frame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelled = true;
      if (frame) cancelAnimationFrame(frame);
    };
  }, [aspect, gecko_scale, gecko_size, scale, size.width, size.height]);

  const uniforms = useDerivedValue(() => {
    // Reanimated dependency gate
    updateTrigger.value;

    if (!size.width || !size.height) {
      return {
        u_scale: scale,
        u_gecko_scale: gecko_scale,
        u_gecko_size: gecko_size,
        u_time: 0,
        u_resolution: [width, height],
        u_aspect: aspect || 1,
        // u_walk0: [-100, -100],
        u_selected: [-100, -100],
        u_lastSelected: [-100, -100],
        // u_hint: [-100, -100],
        u_momentsLength: 0,
        u_moments: momentsUniformSV.value,
        u_heldMoments: heldMomentUniformSV.value,
        u_geckoPoints: geckoPointsUniformSV.value,
      };
    }

    return {
      u_scale: scale,
      u_gecko_scale: gecko_scale,
      u_gecko_size: gecko_size,
      //    u_time: (Date.now() - start.current) / 1000,
      u_time: shaderTimeSV.value,
      u_resolution: [size.width, size.height],
      u_aspect: aspect || 1,
      // u_walk0: walk0UniformSV.value,
      u_selected: selectedUniformSV.value,
      u_lastSelected: lastSelectedUniformSV.value,
      // u_hint: hintUniformSV.value,
      u_momentsLength: momentsLengthSV.value,
      u_moments: momentsUniformSV.value,
      u_heldMoments: heldMomentUniformSV.value,
      u_geckoPoints: geckoPointsUniformSV.value,
    };
  }, [scale, gecko_scale, aspect, size.width, size.height, width, height]);

  return (
    <>
      <GestureDetector gesture={composedGesture}>
        <View style={StyleSheet.absoluteFill}>
          <Canvas ref={ref} style={[StyleSheet.absoluteFill]}>
            <Rect
              x={0}
              y={0}
              width={size.width}
              height={size.height}
              color="lightblue"
            >
              <Shader
                style={{ backgroundColor: "transparent" }}
                source={sourceTwo}
                uniforms={uniforms}
              />
            </Rect>
          </Canvas>

          <Canvas ref={ref} style={[StyleSheet.absoluteFill]}>
            <Rect
              x={0}
              y={0}
              width={size.width}
              height={size.height}
              color="lightblue"
            >
              <Shader
                style={{ backgroundColor: "transparent" }}
                source={source}
                uniforms={uniforms}
              />
            </Rect>
          </Canvas>

          {peerDotSource && (
            <Canvas style={[StyleSheet.absoluteFill]} pointerEvents="none">
              <Rect x={0} y={0} width={size.width} height={size.height}>
                <Shader source={peerDotSource} uniforms={peerDotUniforms} />
              </Rect>
            </Canvas>
          )}
        </View>
      </GestureDetector>

      <View style={styles.pawSetterContainer}>
        <PawSetter
          color={lightDarkTheme.primaryText}
          backgroundColor={lightDarkTheme.darkerOverlayBackground}
          borderColor={lightDarkTheme.lighterOverlayBackground}
          momentsData={moments.current.moments}
          lastSelected={moments.current.lastSelected}
          updatePaw={(moment, holdIndex) =>
            moments.current.updateHold(moment, holdIndex)
          }
          clearPaw={(holdIndex) => moments.current.clearHolding(holdIndex)}
          autoUpdatePaw={(holdIndex) =>
            moments.current.updateHold(moment, holdIndex)
          }
          updateSelected={(holdIndex) =>
            moments.current.updateSelected(holdIndex)
          }
          registerClearAll={(fn) => {
            clearAllPawsInUIRef.current = fn;
          }}
          registerSyncPaws={(fn) => {
            syncPawsInUIRef.current = fn;
          }}
          clearAllPaws={() => moments.current.clearAllHoldings()}
          handleGetMoment={handleGetMoment}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  pawSetterContainer: { position: "absolute", bottom: 270, left: 16 },
});

const MemoizedMomentsSkia = React.memo(MomentsSkia);
export default MemoizedMomentsSkia;
