import { View, StyleSheet } from "react-native";
import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
  useMemo,
} from "react";
import Soul from "./soulClass";
import Mover from "./leadPointClass";
import Gecko from "./geckoClass";
import {
  packGeckoOnlyProdCompact_56,
  packVec2Uniform_withRecenter_moments,
} from "./animUtils";
import { GECKO_ONLY_TRANSPARENT_SKSL_OPT_COMPACT_BOX } from "./shaderCode/geckoMomentsLGShaderOpt_Compact";
import { PEER_DOT_SKSL } from "./shaderCode/peerDotShader";
import { BackHandler } from "react-native";
import { MIRROR_MOMENTS_BG_SKSL_OPT_BOXED, MIRROR_MOMENTS_WITH_BG_SKSL_OPT_BOXED } from "./shaderCode/momentsLGShaderOpt";
import { GECKO_FINGERS_ONLY_SKSL } from "./shaderCode/geckoFingersOnlyShader";
import { useFocusEffect } from "@react-navigation/native";
import MirrorMoments from "./momentsMirrorClass";
import {
  SharedValue,
  runOnJS,
  useSharedValue,
  useDerivedValue,
  useAnimatedReaction,
} from "react-native-reanimated";
import { useWindowDimensions } from "react-native";
import { hexToVec3,hexToVec3Int, toGeckoPointerScaled_inPlace } from "./animUtils";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  Canvas,
  useCanvasSize,
  Shader,
  Rect,
  Circle,
  Skia,
} from "@shopify/react-native-skia";

type hostPeerGeckoPosition = {
  from_user: number;
  position: [number, number];
  steps?: [number, number][];
  first_fingers?: [number, number][];
  moments?: any[][];
  moments_len?: number;
  received_at: number;
} | null;

type Props = {
  color1: string;
  color2: string;
  bckgColor1: string;
  bckgColor2: string;
  startingCoord0: number;
  startingCoord1: number;
  restPoint0: number;
  restPoint1: number;
  scale: number;
  gecko_scale?: number;
  gecko_size?: number;
  reset?: number | null;
  hostPeerGeckoPositionSV: SharedValue<hostPeerGeckoPosition>;
  sendGuestGeckoPositionRef?: React.MutableRefObject<
    (position: [number, number], force?: boolean) => void
  > | null;
  dotColor?: string;
  dotRadius?: number;
  playMode: number;
};

const MirrorPlayGecko = ({
  color1,
  color2,
  bckgColor1,
  bckgColor2,
  sharedColorLightSV, 
  sharedColorDarkSV, 
  startingCoord0,
  startingCoord1,
  restPoint0,
  restPoint1,
  scale = 1,
  gecko_scale = 1,
  gecko_size = 1.2,
  reset = 0,
  hostPeerGeckoPositionSV,
  hostCapsulesSV,
  sendGuestGeckoPositionRef: sendGuestGeckoPositionRef = null,
  playMode,
  sendCapsuleProgressRef,
  dotColor = "#7FE629",
  dotRadius = 14,
  
}: Props) => {
  const { width, height } = useWindowDimensions();
  const { ref, size } = useCanvasSize();

  const [aspect, setAspect] = useState<number>(width / height);

  const MAX_MOMENTS = 30;
  //const MAX_HELD = 4; only for other gecko so far

  useEffect(() => {
    if (size && size.width > 0 && size.height > 0) {
      setAspect(size.width / size.height);
    }
  }, [size]);

  const nowMs = () => global.performance?.now?.() ?? Date.now();
  const shaderTimeSV = useSharedValue(0);
  const startMsRef = useRef(nowMs());

  const lastGuestProgressUpdateRef = useRef(Date.now());

  const updateTrigger = useSharedValue(0);
  const lastRenderRef = useRef(0);
  const isPausedRef = useRef(false);

  const TOTAL_GECKO_POINTS_COMPACT = 56;
  const PEER_STEP_COUNT = 4;

  const workingBuffers = useRef({
    geckoPoints: new Float32Array(TOTAL_GECKO_POINTS_COMPACT * 2),
    stepTargets: [
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0],
    ] as [number, number][],
  }).current;

  const peerWorkingBuffers = useRef({
    packedSteps: new Float32Array(PEER_STEP_COUNT * 2), // 8 floats
    packedFirstFingers: new Float32Array(PEER_STEP_COUNT * 2), // 8 floats
    mirrorMoments: new Float32Array(MAX_MOMENTS * 2),
  }).current;

  const mirrorMomentsUniformSV = useSharedValue<number[]>(
    Array(MAX_MOMENTS * 2).fill(0),
  );

  const geckoPointsUniformSV = useSharedValue<number[]>(
    Array(TOTAL_GECKO_POINTS_COMPACT * 2).fill(0),
  );

  const packedPeerStepsSV = useSharedValue<number[]>(
    Array(PEER_STEP_COUNT * 2).fill(-1000),
  );

  const packedPeerfirstFingersSV = useSharedValue<number[]>(
    Array(PEER_STEP_COUNT * 2).fill(0),
  );
  const mirrorMomentsLengthSV = useSharedValue(0);
  const userPointSV = useSharedValue([restPoint0, restPoint1]);
  const userPoint_geckoSpaceRef = useRef<[number, number]>([0, 0]);
  const isDragging = useSharedValue(false);

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

  const onDoublePress = () => {
    // handleGetMoment(-1);
    console.log("double press");
  };

  const wasTapSV = useSharedValue(false);
  const wasDoubleTapSV = useSharedValue(false);


  const newTapSV = useSharedValue(null);

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
        newTapSV.value = performance.now();
       
        setTimeout(() => {
          wasTapSV.value = false;
        }, 10); //100
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




  // const taps = Gesture.Exclusive(doubleTapGesture, singleTapGesture);
  const composedGesture = Gesture.Simultaneous(panGesture, singleTapGesture);

  const color1Converted = hexToVec3(color1);
  const color2Converted = hexToVec3(color2);
  const bckgColor1Converted = hexToVec3(bckgColor1);
  const bckgColor2Converted = hexToVec3(bckgColor2);


 
  const soul = useRef(new Soul(restPoint0, restPoint1, 0.02));
  const leadPoint = useRef(new Mover(startingCoord0, startingCoord1));
  const gecko = useRef(new Gecko(startingCoord0, startingCoord1, 0.06, {}));
const hasInitialLoadedMirrorMomentsRef = useRef(false);
  const mirrorMoments = useRef(
    new MirrorMoments([], playMode, gecko_size, [0.5, 0.5], 0.05),
  );

  const mirrorMomentsBuffer = useRef(
    Array.from({ length: MAX_MOMENTS }, (_, i) => ({
      id: -1,
      coord: new Float32Array(2),
      stored_index: i,
    })),
  ).current;
  const mirrorMomentsLenRef = useRef(0);

  const SHARED_SKSL_PRELUDE = (c1, c2, b1, b2) => `
    vec3 startColor = vec3(${c1});
    vec3 endColor = vec3(${c2});
    vec3 backgroundStartColor = vec3(${b1});
    vec3 backgroundEndColor = vec3(${b2});
  `;

  const peerDotSource = useMemo(() => {
    return Skia.RuntimeEffect.Make(PEER_DOT_SKSL);
  }, []);

  const sourceTwo = useMemo(() => {
    return Skia.RuntimeEffect.Make(`
        ${SHARED_SKSL_PRELUDE(color1Converted, color2Converted, bckgColor1Converted, bckgColor2Converted)}
        ${MIRROR_MOMENTS_WITH_BG_SKSL_OPT_BOXED}
      `);
  }, [
    color1Converted,
    color2Converted,
    bckgColor1Converted,
    bckgColor2Converted,
  ]);

  const stepDotsSource = useMemo(() => {
    return Skia.RuntimeEffect.Make(`
    ${SHARED_SKSL_PRELUDE(
      color1Converted,
      color2Converted,
      bckgColor1Converted,
      bckgColor2Converted,
    )}
    ${GECKO_FINGERS_ONLY_SKSL}
  `);
  }, [
    color1Converted,
    color2Converted,
    bckgColor1Converted,
    bckgColor2Converted,
  ]);
  const source = useMemo(() => {
    return Skia.RuntimeEffect.Make(`
      ${SHARED_SKSL_PRELUDE(
        color1Converted,
        color2Converted,
        bckgColor1Converted,
        bckgColor2Converted,
      )}
      ${GECKO_ONLY_TRANSPARENT_SKSL_OPT_COMPACT_BOX}
    `);
  }, [
    color1Converted,
    color2Converted,
    bckgColor1Converted,
    bckgColor2Converted,
  ]);

  if (!source) {
    console.error("❌ Shader failed to compile");
    return null;
  }

  useEffect(() => {
    if (aspect) {
      mirrorMoments.current.setAspect(aspect); 
    }
  }, [aspect]);

  const [internalReset, setInternalReset] = useState(0);

  useEffect(() => {
    if (!internalReset && !reset) return;

    soul.current = new Soul(restPoint0, restPoint1, 0.02);
    leadPoint.current = new Mover(startingCoord0, startingCoord1);
    gecko.current = new Gecko(startingCoord0, startingCoord1, 0.06, {});

    workingBuffers.geckoPoints.fill(0);
    geckoPointsUniformSV.value = Array(TOTAL_GECKO_POINTS_COMPACT * 2).fill(0);

    peerWorkingBuffers.packedSteps.fill(-1000);
    peerWorkingBuffers.packedFirstFingers.fill(0);
    packedPeerStepsSV.value = Array(PEER_STEP_COUNT * 2).fill(-1000);
    packedPeerfirstFingersSV.value = Array(PEER_STEP_COUNT * 2).fill(0);

    // to add
    // peerWorkingBuffers.mirrorMoments.fill(0)
    // mirrorMomentsUniformSV.value = Array(MAX_MOMENTS * 2).fill(0)

    momentsMapRef.current.clear();

    userPointSV.value = [restPoint0, restPoint1];
    userPoint_geckoSpaceRef.current[0] = startingCoord0;
    userPoint_geckoSpaceRef.current[1] = startingCoord1;

    startMsRef.current = nowMs();
  }, [reset, internalReset]);



  useAnimatedReaction(
    () => hostPeerGeckoPositionSV.value === null,
    (isNull, prev) => {
      if (isNull && prev === false) {
        runOnJS(clearMomentDots)();
      }
    },
    [],
  );



  const clearMomentDots = useCallback(() => {
    momentsMapRef.current.clear();
    mirrorMomentsLenRef.current = 0;
    mirrorMoments.current.reset([], [0.5, 0.5], 0.05);
    peerWorkingBuffers.mirrorMoments.fill(0);
    mirrorMomentsUniformSV.value = Array(MAX_MOMENTS * 2).fill(0);
    mirrorMomentsLengthSV.value = 0;
    updateTrigger.value += 1;
  }, []);

  useEffect(() => {
    let cancelled = false;
    let frame: number | undefined;

    const animate = () => {
      if (cancelled) return;

      if (isPausedRef.current) {
        frame = requestAnimationFrame(animate);
        return;
      }

      if (aspect == null || isNaN(aspect) || !size.width || !size.height) {
        frame = requestAnimationFrame(animate);
        return;
      }

      if (!soul.current || !leadPoint.current || !gecko.current) return;

      toGeckoPointerScaled_inPlace(
        userPointSV.value,
        aspect,
        scale,
        gecko_size,
        userPoint_geckoSpaceRef.current,
        0,
      );

      if (soul.current.done && !gecko.current.oneTimeEnterComplete) {
        gecko.current.updateEnter(soul.current.done);
      } else {
        soul.current.update();
      }

      if (gecko.current.oneTimeEnterComplete) {
        leadPoint.current.update(userPoint_geckoSpaceRef.current);
      } else {
        leadPoint.current.update(soul.current.soul);
      }

      gecko.current.update(
        leadPoint.current.lead,
        leadPoint.current.angles,
        leadPoint.current.leadDistanceTraveled,
        leadPoint.current.isMoving,
      );

      const shouldUpdate = leadPoint.current.isMoving || isDragging.value || wasTapSV.value;

      shaderTimeSV.value = (nowMs() - startMsRef.current) / 1000;

      if (shouldUpdate) {
        workingBuffers.geckoPoints.fill(0);
        packGeckoOnlyProdCompact_56(
          gecko.current,
          workingBuffers.geckoPoints,
          gecko_scale,
        );

        workingBuffers.stepTargets[0] =
          gecko.current.legs.frontLegs.stepTargets[0];
        workingBuffers.stepTargets[1] =
          gecko.current.legs.frontLegs.stepTargets[1];
        workingBuffers.stepTargets[2] =
          gecko.current.legs.backLegs.stepTargets[0];
        workingBuffers.stepTargets[3] =
          gecko.current.legs.backLegs.stepTargets[1];




        mirrorMoments.current.update(
        userPointSV.value,
        // false, //just set isdragging to always false for rn
        newTapSV.value,
        // wasDoubleTapSV.value,
        leadPoint.current.lead,
 
      );


      if (mirrorMoments.current.trigger_update_host_with_guest_progress) {
        if (mirrorMoments.current.trigger_update_host_with_guest_progress != lastGuestProgressUpdateRef.current) {
          console.log('update guests progress data', mirrorMoments.current.newProgress, mirrorMoments.current.selected.id);
         
          sendCapsuleProgressRef?.current?.({
            capsule_id: mirrorMoments.current.selected.id,
            new_progress: mirrorMoments.current.trigger_update_host_with_guest_progress
          })
           lastGuestProgressUpdateRef.current = mirrorMoments.current.trigger_update_host_with_guest_progress;
        }
      }

        geckoPointsUniformSV.value = Array.from(workingBuffers.geckoPoints);

        const now = Date.now();
        if (now - lastRenderRef.current > 16) {
          lastRenderRef.current = now;
          updateTrigger.value += 1;
        }
      }

      sendGuestGeckoPositionRef?.current?.(
        leadPoint.current.lead,
        workingBuffers.stepTargets,
      );

      frame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelled = true;
      if (frame) cancelAnimationFrame(frame);
    };
  }, [aspect, gecko_scale, gecko_size, scale, size.width, size.height]);

  useAnimatedReaction(
    () => {
      const v = hostPeerGeckoPositionSV.value;
      return {
        steps: v?.steps ?? null,
        first_fingers: v?.first_fingers ?? null,
        received_at: v?.received_at ?? 0,
      };
    },
    (next) => {
      const steps = next.steps;
      const firstFingers = next.first_fingers;

      const packedSteps = peerWorkingBuffers.packedSteps;
      const packedFirstFingers = peerWorkingBuffers.packedFirstFingers;

      const mirrorMoments = peerWorkingBuffers.mirrorMoments;

      // const mirrorMoments

      packedSteps[0] = -1000;
      packedSteps[1] = -1000;
      packedSteps[2] = -1000;
      packedSteps[3] = -1000;
      packedSteps[4] = -1000;
      packedSteps[5] = -1000;
      packedSteps[6] = -1000;
      packedSteps[7] = -1000;

      packedFirstFingers[0] = 0;
      packedFirstFingers[1] = 0;
      packedFirstFingers[2] = 0;
      packedFirstFingers[3] = 0;
      packedFirstFingers[4] = 0;
      packedFirstFingers[5] = 0;
      packedFirstFingers[6] = 0;
      packedFirstFingers[7] = 0;

      if (steps?.[0]) {
        packedSteps[0] = (steps[0][0] - 0.5) / gecko_scale;
        packedSteps[1] = (steps[0][1] - 0.5) / gecko_scale;
      }
      if (steps?.[1]) {
        packedSteps[2] = (steps[1][0] - 0.5) / gecko_scale;
        packedSteps[3] = (steps[1][1] - 0.5) / gecko_scale;
      }
      if (steps?.[2]) {
        packedSteps[4] = (steps[2][0] - 0.5) / gecko_scale;
        packedSteps[5] = (steps[2][1] - 0.5) / gecko_scale;
      }
      if (steps?.[3]) {
        packedSteps[6] = (steps[3][0] - 0.5) / gecko_scale;
        packedSteps[7] = (steps[3][1] - 0.5) / gecko_scale;
      }

      if (firstFingers?.[0]) {
        packedFirstFingers[0] = (firstFingers[0][0] - 0.5) / gecko_scale;
        packedFirstFingers[1] = (firstFingers[0][1] - 0.5) / gecko_scale;
      }
      if (firstFingers?.[1]) {
        packedFirstFingers[2] = (firstFingers[1][0] - 0.5) / gecko_scale;
        packedFirstFingers[3] = (firstFingers[1][1] - 0.5) / gecko_scale;
      }
      if (firstFingers?.[2]) {
        packedFirstFingers[4] = (firstFingers[2][0] - 0.5) / gecko_scale;
        packedFirstFingers[5] = (firstFingers[2][1] - 0.5) / gecko_scale;
      }
      if (firstFingers?.[3]) {
        packedFirstFingers[6] = (firstFingers[3][0] - 0.5) / gecko_scale;
        packedFirstFingers[7] = (firstFingers[3][1] - 0.5) / gecko_scale;
      }

      packedPeerStepsSV.value = Array.from(packedSteps);
      packedPeerfirstFingersSV.value = Array.from(packedFirstFingers);
    },
    [gecko_scale],
  );
  const uniforms = useDerivedValue(() => {
    updateTrigger.value;

    if (!size.width || !size.height) {
      return {
        u_scale: scale,
        u_gecko_scale: gecko_scale,
        u_gecko_size: gecko_size,
        u_time: 0,
        u_resolution: [width, height],
        u_aspect: aspect || 1,
        u_peerDot: hostPeerGeckoPositionSV.value,
        u_geckoPoints: geckoPointsUniformSV.value,
        u_mirrorMoments: mirrorMomentsUniformSV.value,
        u_mirrorMomentsLength: mirrorMomentsLengthSV.value,
        u_selected: [0.5, 5],
        u_lastSelected: [0.5, 0.5],
      };
    }

    return {
      u_scale: scale,
      u_gecko_scale: gecko_scale,
      u_gecko_size: gecko_size,
      u_time: shaderTimeSV.value,
      u_resolution: [size.width, size.height],
      u_aspect: aspect || 1,
      u_peerDot: hostPeerGeckoPositionSV.value,
      u_geckoPoints: geckoPointsUniformSV.value,
      u_mirrorMoments: mirrorMomentsUniformSV.value,
      u_mirrorMomentsLength: mirrorMomentsLengthSV.value,
      u_selected: [0.5, 5],
      u_lastSelected: [0.5, 0.5],
    };
  }, [
    scale,
    gecko_scale,
    aspect,
    size.width,
    size.height,
    width,
    height,
  ]);
 


const mirrorBgUniforms = useDerivedValue(() => {
  updateTrigger.value;

  return {
    u_resolution: [size.width || width, size.height || height],
    u_aspect: aspect || 1,
    u_scale: scale,
    u_time: shaderTimeSV.value,
    u_gecko_scale: gecko_scale,
    u_gecko_size: gecko_size,
    u_mirrorMoments: mirrorMomentsUniformSV.value,
    u_mirrorMomentsLength: mirrorMomentsLengthSV.value,
    u_heldMoments: [0, 0, 0, 0, 0, 0, 0, 0],
    u_selected: [0.5, 0.5],
    u_lastSelected: [0.5, 0.5],
    u_sharedColorLight: hexToVec3Int(sharedColorLightSV.value),
    u_sharedColorDark: hexToVec3Int(sharedColorDarkSV.value),
  };
}, [
  size.width,
  size.height,
  width,
  height,
  aspect,
  scale,
  gecko_scale,
  gecko_size,
]);

useAnimatedReaction(
  () => `${sharedColorLightSV.value}|${sharedColorDarkSV.value}`,
  () => {
    updateTrigger.value += 1;
  },
  [],
);
  const stepDotsUniforms = useDerivedValue(() => {
    return {
      u_resolution: [size.width || width, size.height || height],
      u_aspect: aspect || 1,
      u_scale: scale,
      u_gecko_scale: gecko_scale,
      u_gecko_size: gecko_size,
      u_steps: packedPeerStepsSV.value,
      u_first_fingers: packedPeerfirstFingersSV.value,
    };
  }, [
    size.width,
    size.height,
    width,
    height,
    aspect,
    scale,
    gecko_scale,
    gecko_size,
  ]);

  const peerUniforms = useDerivedValue(() => {
    const p = hostPeerGeckoPositionSV.value;
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

const momentsMapRef = useRef<
  Map<string | number, { x: number; y: number; stored_index: number | null; guest_progress: number }>
>(new Map());
  const packCtxRef = useRef({ aspect, scale, w: size.width, h: size.height });
  packCtxRef.current.aspect = aspect;
  packCtxRef.current.scale = scale;
  packCtxRef.current.w = size.width;
  packCtxRef.current.h = size.height;

//   const applyMirrorMomentsDelta = useCallback((delta: number[][]) => {
//     const map = momentsMapRef.current;
//     for (const [id, x, y] of delta) {
//       map.set(id, { x, y });
//     }

//     let i = 0;
//     for (const [id, pt] of map) {
//       if (i >= MAX_MOMENTS) break;
//       mirrorMomentsBuffer[i].id = id;
//       mirrorMomentsBuffer[i].coord[0] = pt.x;
//       mirrorMomentsBuffer[i].coord[1] = pt.y;
//       mirrorMomentsBuffer[i].stored_index = i;
//       i++;
//     }
//     mirrorMomentsLenRef.current = i;

//     const slice = mirrorMomentsBuffer.slice(0, i);

 

// if (!hasInitialLoadedMirrorMomentsRef.current) {
//   mirrorMoments.current.initialLoad(slice);
//   hasInitialLoadedMirrorMomentsRef.current = true;
// } else {
//   mirrorMoments.current.updateOrAddMoments(slice);
//   mirrorMoments.current.updateAllCoords(slice);
// }
//    // mirrorMoments.current._markAllDirty?.();

//     const { aspect: a, scale: s, w, h } = packCtxRef.current;
//     if (a && w && h) {
//       peerWorkingBuffers.mirrorMoments.fill(0);
//       packVec2Uniform_withRecenter_moments(
//         mirrorMoments.current.moments,
//         peerWorkingBuffers.mirrorMoments as any,
//         mirrorMoments.current.momentsLength,
//         a,
//         s,
//       );
//       mirrorMomentsUniformSV.value = Array.from(
//         peerWorkingBuffers.mirrorMoments,
//       );
//       mirrorMomentsLengthSV.value = mirrorMoments.current.momentsLength;
//     }

//     updateTrigger.value += 1;
//   }, []);

const applyMirrorMomentsDelta = useCallback((delta: any[][]) => {
  const map = momentsMapRef.current;

  for (const [id, x, y, storedIndex, incomingProgress] of delta) {
    if (id == null) continue;

    const existing = map.get(id);

    map.set(id, {
      x,
      y,
      stored_index:
        storedIndex !== undefined && storedIndex !== null
          ? storedIndex
          : existing?.stored_index ?? -1,
      guest_progress:
        incomingProgress !== undefined && incomingProgress !== null
          ? incomingProgress
          : existing?.guest_progress ?? 0,
    });
  }

  let i = 0;

  for (const [id, pt] of map) {
    if (i >= MAX_MOMENTS) break;

    mirrorMomentsBuffer[i].id = id;
    mirrorMomentsBuffer[i].coord[0] = pt.x;
    mirrorMomentsBuffer[i].coord[1] = pt.y;
    mirrorMomentsBuffer[i].stored_index = pt.stored_index ?? -1;
    mirrorMomentsBuffer[i].guest_progress = pt.guest_progress ?? 0;

    i++;
  }

  mirrorMomentsLenRef.current = i;

  const slice = mirrorMomentsBuffer.slice(0, i);

  if (!hasInitialLoadedMirrorMomentsRef.current) {
    mirrorMoments.current.initialLoad(slice);
    hasInitialLoadedMirrorMomentsRef.current = true;
  } else {
    mirrorMoments.current.updateOrAddMoments(slice);
    mirrorMoments.current.updateAllCoords(slice);
  }

  const { aspect: a, scale: s, w, h } = packCtxRef.current;

  if (a && w && h) {
    peerWorkingBuffers.mirrorMoments.fill(0);

    packVec2Uniform_withRecenter_moments(
      mirrorMoments.current.moments,
      peerWorkingBuffers.mirrorMoments as any,
      mirrorMoments.current.momentsLength,
      a,
      s,
    );

    mirrorMomentsUniformSV.value = Array.from(
      peerWorkingBuffers.mirrorMoments,
    );

    mirrorMomentsLengthSV.value = mirrorMoments.current.momentsLength;
  }

  updateTrigger.value += 1;
}, []);

    useAnimatedReaction(
  () => {
    const v = hostCapsulesSV.value;
    if (!v?.moments) return null;

    const len = v.moments_len ?? v.moments.length;
    const out: number[][] = [];

    for (let i = 0; i < len; i++) {
      const m = v.moments[i];
      if (!m) continue;

      out.push([
        m[0], // id
        m[1], // x
        m[2], // y
        m[3], // stored_index
        m[4], // guest_progress
      ]);
    }

    return out;
  },
  (next) => {
    if (!next || next.length === 0) return;
    runOnJS(applyMirrorMomentsDelta)(next);
  },
  [],
);

  // 2. THEN the reactions that reference them
  useAnimatedReaction(
    () => hostPeerGeckoPositionSV.value === null,
    (isNull, prev) => {
      if (isNull && prev === false) {
        runOnJS(clearMomentDots)();
      }
    },
    [],
  );

 
 



  useAnimatedReaction(
    () => {
      const v = hostPeerGeckoPositionSV.value;
      if (!v?.moments) return null;
      const len = v.moments_len ?? v.moments.length;
      const out: number[][] = [];
      for (let i = 0; i < len; i++) {
        const m = v.moments[i];
        if (!m) continue;
       out.push([m[0], m[1], m[2], m[3], m[4]]);
      }
      return out;
    },
    (next) => {
      if (!next || next.length === 0) return;
      runOnJS(applyMirrorMomentsDelta)(next);
    },
    [],
  );

  return (
    // <GestureDetector gesture={panGesture}>
    <GestureDetector gesture={composedGesture}>
      <View style={StyleSheet.absoluteFill}>
        <Canvas style={StyleSheet.absoluteFill}>
          <Rect
            x={0}
            y={0}
            width={size.width}
            height={size.height}
           color="white"
          >
            <Shader
             // style={{ backgroundColor: "transparent" }}
              source={sourceTwo!}
              uniforms={mirrorBgUniforms}
            />
          </Rect>
        </Canvas>

        <Canvas ref={ref} style={StyleSheet.absoluteFill}>
          <Rect
            x={0}
            y={0}
            width={size.width}
            height={size.height}
            color="white"
          >
            <Shader source={peerDotSource!} uniforms={peerUniforms} />
          </Rect>
        </Canvas>

        <Canvas style={StyleSheet.absoluteFill}>
          <Rect
            x={0}
            y={0}
            width={size.width}
            height={size.height}
            color="lightblue"
          >
            <Shader source={stepDotsSource!} uniforms={stepDotsUniforms} />
          </Rect>
        </Canvas>

        {/*
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
        </Canvas> */}

        <Canvas ref={ref} style={StyleSheet.absoluteFill}>
          <Rect
            x={0}
            y={0}
            width={size.width}
            height={size.height}
            color="white"
          >
            <Shader
              style={{ backgroundColor: "transparent" }}
              source={source}
              uniforms={uniforms}
            />
          </Rect>
        </Canvas>
      </View>
    </GestureDetector>
  );
};

const MemoizedMirrorPlayGecko = React.memo(MirrorPlayGecko);
export default MemoizedMirrorPlayGecko;
