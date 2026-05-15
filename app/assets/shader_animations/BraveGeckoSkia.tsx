import { View, StyleSheet } from "react-native";
import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
  useMemo,
} from "react";
import DarkSoul from "./darkSoulClass";
import Mover from "./leadPointClass";
import Gecko from "./geckoClass";
import { packGeckoOnlyProdCompact_56 } from "./animUtils";
import { GECKO_ONLY_TRANSPARENT_SKSL_OPT_COMPACT_BOX } from "./shaderCode/geckoMomentsLGShaderOpt_Compact";
import { GECKO_STEPS_FINGERS_ONLY_SKSL } from "./shaderCode/geckoStepsFingersOnlyShader";
import { useFocusEffect } from "@react-navigation/native";
import { useSharedValue, useDerivedValue } from "react-native-reanimated";

import { useWindowDimensions } from "react-native";
import { hexToVec3 } from "./animUtils";
import {
  Canvas,
  useCanvasSize,
  Shader,
  Rect,
  Skia,
} from "@shopify/react-native-skia";

type Props = {
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
  gecko_scale?: number;
  gecko_size?: number;
  reset?: number | null;
};

const BraveGeckoSkia = ({
  color1,
  color2,
  bckgColor1,
  bckgColor2,
  startingCoord0,
  startingCoord1,
  restPoint0,
  restPoint1,
  scale = 1,
  gecko_scale = 1,
  gecko_size = 1.2,
  reset = 0,
}: Props) => {
  const { width, height } = useWindowDimensions();
  const { ref, size } = useCanvasSize();

  const [aspect, setAspect] = useState<number>(width / height);

  useEffect(() => {
    if (size && size.width > 0 && size.height > 0) {
      setAspect(size.width / size.height);
    }
  }, [size]);

  const updateTrigger = useSharedValue(0);
  const lastRenderRef = useRef(0);
  const isPausedRef = useRef(false);

  const TOTAL_GECKO_POINTS_COMPACT = 56;

  // ============== TRULY PREALLOCATED BUFFERS ==============
  const workingBuffers = useRef({
    geckoPoints: new Float32Array(TOTAL_GECKO_POINTS_COMPACT * 2),
  }).current;

  const geckoPointsUniformSV = useSharedValue<number[]>(
    Array(TOTAL_GECKO_POINTS_COMPACT * 2).fill(0),
  );

  useFocusEffect(
    useCallback(() => {
      isPausedRef.current = false;
      updateTrigger.value += 1;
      return () => {
        isPausedRef.current = true;
      };
    }, []),
  );

  const color1Converted = hexToVec3(color1);
  const color2Converted = hexToVec3(color2);
  const bckgColor1Converted = hexToVec3(bckgColor1);
  const bckgColor2Converted = hexToVec3(bckgColor2);

  // Off-screen entry/exit; new entry = previous exit (continuity), so the gecko keeps moving in alternating directions.
  const OFF_SCREEN = 1.5;
  const VERTICAL_MIN = 0.15;
  const VERTICAL_MAX = 0.85;
  const DART_FRAMES = 140;
  const HIDDEN_FRAMES = 300;

  // We pick the VISIBLE-edge Y values (where the dart crosses x=0 and x=1) and extrapolate
  // the off-screen endpoints from there, so the diagonal angle is what's seen on screen
  // regardless of OFF_SCREEN padding.
  // Snap to vertical extremes so the dart goes corner-to-corner (e.g. top-left → bottom-right).
  const farVisibleY = (fromY: number) => {
    const mid = (VERTICAL_MIN + VERTICAL_MAX) * 0.5;
    return fromY < mid ? VERTICAL_MAX : VERTICAL_MIN;
  };

  // Write off-screen entry/exit into positions, given visible-edge Y values.
  // fromLeft=true → dart traverses x: -OFF_SCREEN → 1+OFF_SCREEN, crossing edges x=0 (yIn) and x=1 (yOut).
  const writeDartLine = (
    positions: [number, number][],
    fromLeft: boolean,
    yIn: number,
    yOut: number,
  ) => {
    const entryEdgeX = fromLeft ? 0 : 1;
    const exitEdgeX = fromLeft ? 1 : 0;
    const entryFullX = fromLeft ? -OFF_SCREEN : 1 + OFF_SCREEN;
    const exitFullX = fromLeft ? 1 + OFF_SCREEN : -OFF_SCREEN;
    const slope = (yOut - yIn) / (exitEdgeX - entryEdgeX);
    positions[0][0] = entryFullX;
    positions[0][1] = yIn + slope * (entryFullX - entryEdgeX);
    positions[1][0] = exitFullX;
    positions[1][1] = yOut + slope * (exitFullX - exitEdgeX);
  };

  // Continue dart from previous exit: visible-edge continuity (new entry Y at the exit edge =
  // previous exit Y at that same edge), then pick a new exit Y on the opposite side with min delta.
  const advanceDart = (positions: [number, number][]) => {
    const oldExitEdgeX = positions[1][0] > 0.5 ? 1 : 0;
    const newFromLeft = oldExitEdgeX === 0;
    // Pick (yIn, yOut) as a paired choice so the path is ALWAYS one of the two diagonals.
    const topToBottom = Math.random() < 0.5;
    const newYIn = topToBottom ? VERTICAL_MIN : VERTICAL_MAX;
    const newYOut = topToBottom ? VERTICAL_MAX : VERTICAL_MIN;
    writeDartLine(positions, newFromLeft, newYIn, newYOut);
  };

  const seedDart = (positions: [number, number][]) => {
    const fromLeft = Math.random() < 0.5;
    const topToBottom = Math.random() < 0.5;
    const yIn = topToBottom ? VERTICAL_MIN : VERTICAL_MAX;
    const yOut = topToBottom ? VERTICAL_MAX : VERTICAL_MIN;
    writeDartLine(positions, fromLeft, yIn, yOut);
  };

  const darkSoulPositions = useRef<[number, number][] | null>(null);
  if (darkSoulPositions.current === null) {
    const arr: [number, number][] = [[0, 0], [0, 0]];
    seedDart(arr);
    darkSoulPositions.current = arr;
  }

  // Sequence: dart from entry to exit (visible), then dwell hidden at exit for ~5s.
  // On wrap, advanceDart sets entry = previous exit so there's no positional jump.
  const DARK_SOUL_DWELL_TIMES = [1, HIDDEN_FRAMES];
  const DARK_SOUL_TRAVEL_DURATION = [DART_FRAMES, 0];

  const soul = useRef(
    new DarkSoul(
      darkSoulPositions.current!,
      DARK_SOUL_DWELL_TIMES,
      DARK_SOUL_TRAVEL_DURATION,
      0.02,
      (s) => advanceDart(s.positions),
    ),
  );
  const leadPoint = useRef(new Mover(startingCoord0, startingCoord1));
  const gecko = useRef(new Gecko(startingCoord0, startingCoord1, 0.06));

  const SHARED_SKSL_PRELUDE = (c1, c2, b1, b2) => `
    vec3 startColor = vec3(${c1});
    vec3 endColor = vec3(${c2});
    vec3 backgroundStartColor = vec3(${b1});
    vec3 backgroundEndColor = vec3(${b2});
  `;

  const source = useMemo(() => {
    return Skia.RuntimeEffect.Make(`
      ${SHARED_SKSL_PRELUDE(color1Converted, color2Converted, bckgColor1Converted, bckgColor2Converted)}
      ${GECKO_STEPS_FINGERS_ONLY_SKSL}
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

  const [internalReset, setInternalReset] = useState(0);

  useEffect(() => {
    if (!internalReset && !reset) return;

    seedDart(darkSoulPositions.current!);
    soul.current = new DarkSoul(
      darkSoulPositions.current!,
      DARK_SOUL_DWELL_TIMES,
      DARK_SOUL_TRAVEL_DURATION,
      0.02,
      (s) => advanceDart(s.positions),
    );
    leadPoint.current = new Mover(startingCoord0, startingCoord1);
    gecko.current = new Gecko(startingCoord0, startingCoord1, 0.06);

    workingBuffers.geckoPoints.fill(0);
    geckoPointsUniformSV.value = Array(TOTAL_GECKO_POINTS_COMPACT * 2).fill(0);
  }, [reset, internalReset]);

  useEffect(() => {
    return () => {
      soul.current = null;
      gecko.current = null;
      leadPoint.current = null;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    let frame;

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

      if (!soul.current || !leadPoint.current || !gecko.current) {
        return;
      }

      soul.current.update();
      leadPoint.current.update(soul.current.soul);

      gecko.current.update(
        leadPoint.current.lead,
        leadPoint.current.angles,
        leadPoint.current.leadDistanceTraveled,
        leadPoint.current.isMoving,
      );

      if (leadPoint.current.isMoving) {
        workingBuffers.geckoPoints.fill(0);
        packGeckoOnlyProdCompact_56(
          gecko.current,
          workingBuffers.geckoPoints,
          gecko_scale,
        );
        geckoPointsUniformSV.value = Array.from(workingBuffers.geckoPoints);

        const now = Date.now();
        if (now - lastRenderRef.current > 16) {
          lastRenderRef.current = now;
          updateTrigger.value += 1;
        }
      }

      frame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelled = true;
      if (frame) cancelAnimationFrame(frame);
    };
  }, [aspect, gecko_scale, gecko_size, scale, size.width, size.height]);

  const uniforms = useDerivedValue(() => {
    updateTrigger.value;

    if (!size.width || !size.height) {
      return {
        u_scale: scale,
        u_gecko_scale: gecko_scale,
        u_gecko_size: gecko_size,
        u_resolution: [width, height],
        u_aspect: aspect || 1,
        u_geckoPoints: geckoPointsUniformSV.value,
      };
    }

    return {
      u_scale: scale,
      u_gecko_scale: gecko_scale,
      u_gecko_size: gecko_size,
      u_resolution: [size.width, size.height],
      u_aspect: aspect || 1,
      u_geckoPoints: geckoPointsUniformSV.value,
    };
  }, [scale, gecko_scale, gecko_size, aspect, size.width, size.height, width, height]);

  return (
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
            source={source}
            uniforms={uniforms}
          />
        </Rect>
      </Canvas>
    </View>
  );
};

const MemoizedBraveGeckoSkia = React.memo(BraveGeckoSkia);
export default MemoizedBraveGeckoSkia;
