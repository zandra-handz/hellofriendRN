// 🔥 FULL OPTIMIZED VERSION (allocation-safe)

import { View, StyleSheet, BackHandler, useWindowDimensions } from "react-native";
import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
  useMemo,
} from "react";
import {
  runOnJS,
  useSharedValue,
  useDerivedValue,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  Canvas,
  useCanvasSize,
  Shader,
  Rect,
  Skia,
} from "@shopify/react-native-skia";

import Soul from "./soulClass";
import SleepWalk0 from "./sleepWalkOneClass";
import Mover from "./leadPointClass";
import Gecko from "./geckoClass";
import Moments from "./momentsClass";
import { packGeckoOnly } from "./animUtils";
import PawSetter from "@/app/screens/fidget/PawSetter";
import { MOMENTS_BG_SKSL_OPT } from "./shaderCode/momentsLGShaderOpt";
import { GECKO_ONLY_TRANSPARENT_SKSL_OPT } from "./shaderCode/geckoMomentsLGShaderOpt";
import MomentDotsResetterMini from "./MomentDotsResetterMini";

import {
  hexToVec3,
  toShaderModel_inPlace,
  toShaderSpace_inplace,
  toGeckoSpace_inPlace,
  toGeckoPointerScaled_inPlace,
  packVec2Uniform_withRecenter_moments,
} from "./animUtils";

const MomentsSkia = (props: any) => {
  const {
    handleGetMoment,
    handleUpdateMomentCoords,
    handleRecenterMoments,
    handleRescatterMoments,
    color1,
    color2,
    bckgColor1,
    bckgColor2,
    momentsData = [],
    startingCoord,
    restPoint,
    scale = 1,
    gecko_scale = 1,
    gecko_size = 1.2,
    lightDarkTheme,
    manualOnly,
    speedSetting,
    autoPickUp,
    randomMomentIds,
    reset = 0,
  } = props;

  const { width, height } = useWindowDimensions();
  const { ref, size } = useCanvasSize();

  const [aspect, setAspect] = useState(width / height);

  useEffect(() => {
    if (size?.width > 0 && size?.height > 0) {
      setAspect(size.width / size.height);
    }
  }, [size]);

  const TOTAL_GECKO_POINTS = 71;
  const MAX_MOMENTS = 40;
  const MAX_HELD = 4;

  // ==========================================================
  // 🔥 INTERNAL WORKING BUFFERS (ALLOCATED ONCE)
  // ==========================================================

  const soulBufferRef = useRef(new Float32Array(2));
  const walkBufferRef = useRef(new Float32Array(2));
  const hintBufferRef = useRef(new Float32Array(2));
  const leadBufferRef = useRef(new Float32Array(2));
  const selectedBufferRef = useRef(new Float32Array(2));
  const lastSelectedBufferRef = useRef(new Float32Array(2));

  const heldBufferRef = useRef(new Float32Array(MAX_HELD * 2));
  const geckoPointsBufferRef = useRef(
    new Float32Array(TOTAL_GECKO_POINTS * 2)
  );
  const momentsBufferRef = useRef(
    new Float32Array(MAX_MOMENTS * 2)
  );

  // ==========================================================
  // 🔥 SHARED VALUES
  // ==========================================================

  const leadUniformSV = useSharedValue([0, 0]);
  const soulUniformSV = useSharedValue([0, 0]);
  const walk0UniformSV = useSharedValue([0, 0]);
  const selectedUniformSV = useSharedValue([0, 0]);
  const lastSelectedUniformSV = useSharedValue([0, 0]);
  const hintUniformSV = useSharedValue([0, 0]);

  const momentsUniformSV = useSharedValue(
    Array(MAX_MOMENTS * 2).fill(0)
  );
  const heldMomentUniformSV = useSharedValue(
    Array(MAX_HELD * 2).fill(0)
  );
  const geckoPointsUniformSV = useSharedValue(
    Array(TOTAL_GECKO_POINTS * 2).fill(0)
  );
  const momentsLengthSV = useSharedValue(0);

  const updateTrigger = useSharedValue(0);
  const start = useRef(Date.now());

  // ==========================================================
  // 🔥 SIM OBJECTS
  // ==========================================================

  const soul = useRef(new Soul(restPoint, 0.02));
  const leadPoint = useRef(new Mover(startingCoord));
  const gecko = useRef(new Gecko(startingCoord, 0.06));
  const sleepWalk0 = useRef(
    new SleepWalk0(
      [0.5, 0.3],
      0.3,
      gecko_size,
      manualOnly,
      speedSetting,
      autoPickUp,
      randomMomentIds
    )
  );
  const moments = useRef(
    new Moments(momentsData, gecko_size, sleepWalk0, [0.5, 0.5], 0.05)
  );

  // ==========================================================
  // 🔥 ANIMATION LOOP (NO ALLOCATIONS)
  // ==========================================================

  useEffect(() => {
    let cancelled = false;
    let frame: any;

    const animate = () => {
      if (cancelled) {
        frame = requestAnimationFrame(animate);
        return;
      }

      // --- SIM UPDATES ---
      soul.current.update();
      leadPoint.current.update(soul.current.soul);
      gecko.current.update(
        leadPoint.current.lead,
        leadPoint.current.leadDistanceTraveled,
        leadPoint.current.isMoving
      );

      const spine = gecko.current.body.spine;
      const hint = spine.hintJoint || [0, 0];

      // ======================================================
      // 🔥 WRITE INTO INTERNAL BUFFERS
      // ======================================================

      const soulBuf = soulBufferRef.current;
      toShaderSpace_inplace(
        soul.current.soul,
        aspect,
        gecko_scale,
        soulBuf,
        0
      );
      soulUniformSV.value = [soulBuf[0], soulBuf[1]];

      const walkBuf = walkBufferRef.current;
      toShaderSpace_inplace(
        sleepWalk0.current.walk,
        aspect,
        gecko_scale,
        walkBuf,
        0
      );
      walk0UniformSV.value = [walkBuf[0], walkBuf[1]];

      const hintBuf = hintBufferRef.current;
      toShaderSpace_inplace(
        hint,
        aspect,
        gecko_scale,
        hintBuf,
        0
      );
      hintUniformSV.value = [hintBuf[0], hintBuf[1]];

      const leadBuf = leadBufferRef.current;
      toShaderModel_inPlace(
        leadPoint.current.lead,
        aspect,
        gecko_scale,
        leadBuf,
        0
      );
      leadUniformSV.value = [leadBuf[0], leadBuf[1]];

      const selectedBuf = selectedBufferRef.current;
      selectedBuf[0] = moments.current.selected.coord[0];
      selectedBuf[1] = moments.current.selected.coord[1];
      selectedUniformSV.value = [selectedBuf[0], selectedBuf[1]];

      const lastSelectedBuf = lastSelectedBufferRef.current;
      toGeckoSpace_inPlace(
        moments.current.lastSelected.coord,
        gecko_scale,
        lastSelectedBuf
      );
      lastSelectedUniformSV.value = [
        lastSelectedBuf[0],
        lastSelectedBuf[1],
      ];

      const heldBuf = heldBufferRef.current;
      for (let i = 0; i < MAX_HELD; i++) {
        toGeckoSpace_inPlace(
          moments.current.holdings[i].coord,
          gecko_scale,
          heldBuf,
          i * 2
        );
      }
      heldMomentUniformSV.value = Array.from(heldBuf);

      const geckoBuf = geckoPointsBufferRef.current;
      packGeckoOnly(gecko.current, geckoBuf, gecko_scale);
      geckoPointsUniformSV.value = Array.from(geckoBuf);

      const momentsBuf = momentsBufferRef.current;
      packVec2Uniform_withRecenter_moments(
        moments.current.moments,
        momentsBuf,
        moments.current.momentsLength,
        aspect,
        scale
      );
      momentsUniformSV.value = Array.from(momentsBuf);
      momentsLengthSV.value = moments.current.momentsLength;

      updateTrigger.value += 1;

      frame = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      cancelled = true;
      if (frame) cancelAnimationFrame(frame);
    };
  }, [aspect, gecko_scale, gecko_size, scale]);

  // ==========================================================
  // 🔥 DERIVED UNIFORMS (NO CLONING)
  // ==========================================================

  const uniforms = useDerivedValue(() => {
    updateTrigger.value;

    return {
      u_scale: scale,
      u_gecko_scale: gecko_scale,
      u_gecko_size: gecko_size,
      u_time: (Date.now() - start.current) / 1000,
      u_resolution: [size.width || width, size.height || height],
      u_aspect: aspect || 1,
      u_lead: leadUniformSV.value,
      u_soul: soulUniformSV.value,
      u_walk0: walk0UniformSV.value,
      u_selected: selectedUniformSV.value,
      u_lastSelected: lastSelectedUniformSV.value,
      u_hint: hintUniformSV.value,
      u_momentsLength: momentsLengthSV.value,
      u_moments: momentsUniformSV.value,
      u_heldMoments: heldMomentUniformSV.value,
      u_geckoPoints: geckoPointsUniformSV.value,
    };
  });

  // ==========================================================
  // 🔥 RENDER
  // ==========================================================

  return (
    <Canvas ref={ref} style={StyleSheet.absoluteFill}>
      <Rect
        x={0}
        y={0}
        width={size.width}
        height={size.height}
      >
        <Shader
          source={Skia.RuntimeEffect.Make(
            GECKO_ONLY_TRANSPARENT_SKSL_OPT
          )}
          uniforms={uniforms}
        />
      </Rect>
    </Canvas>
  );
};

export default React.memo(MomentsSkia);
