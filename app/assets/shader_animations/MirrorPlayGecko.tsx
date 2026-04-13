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
import { packGeckoOnlyProdCompact_56 } from "./animUtils";
import { GECKO_ONLY_TRANSPARENT_SKSL_OPT_COMPACT_BOX } from "./shaderCode/geckoMomentsLGShaderOpt_Compact";
import { BackHandler } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  SharedValue,
  runOnJS,
  useSharedValue,
  useDerivedValue,
} from "react-native-reanimated";
import { useWindowDimensions } from "react-native";
import {
  hexToVec3,
  toGeckoPointerScaled_inPlace,
} from "./animUtils";
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
};

const MirrorPlayGecko = ({
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
  hostPeerGeckoPositionSV,
  sendGuestGeckoPositionRef: sendGuestGeckoPositionRef = null,
  dotColor = "#7FE629",
  dotRadius = 14,
}: Props) => {
  const { width, height } = useWindowDimensions();
  const { ref, size } = useCanvasSize();

  const [aspect, setAspect] = useState<number>(width / height);

  useEffect(() => {
    if (size && size.width > 0 && size.height > 0) {
      setAspect(size.width / size.height);
    }
  }, [size]);

  const nowMs = () => global.performance?.now?.() ?? Date.now();
  const shaderTimeSV = useSharedValue(0);
  const startMsRef = useRef(nowMs());

  const updateTrigger = useSharedValue(0);
  const lastRenderRef = useRef(0);
  const isPausedRef = useRef(false);

  const TOTAL_GECKO_POINTS_COMPACT = 56;

  const workingBuffers = useRef({
    geckoPoints: new Float32Array(TOTAL_GECKO_POINTS_COMPACT * 2),
  }).current;

  const geckoPointsUniformSV = useSharedValue<number[]>(
    Array(TOTAL_GECKO_POINTS_COMPACT * 2).fill(0),
  );

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

  // useFocusEffect(
  //   useCallback(() => {
  //     const subscription = BackHandler.addEventListener(
  //       "hardwareBackPress",
  //       () => true,
  //     );
  //     return () => subscription.remove();
  //   }, []),
  // );

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

  const color1Converted = hexToVec3(color1);
  const color2Converted = hexToVec3(color2);
  const bckgColor1Converted = hexToVec3(bckgColor1);
  const bckgColor2Converted = hexToVec3(bckgColor2);

  const soul = useRef(new Soul(restPoint0, restPoint1, 0.02));
  const leadPoint = useRef(new Mover(startingCoord0, startingCoord1));
  const gecko = useRef(
    new Gecko(startingCoord0, startingCoord1, 0.06, {}),
  );

  const SHARED_SKSL_PRELUDE = (c1, c2, b1, b2) => `
    vec3 startColor = vec3(${c1});
    vec3 endColor = vec3(${c2});
    vec3 backgroundStartColor = vec3(${b1});
    vec3 backgroundEndColor = vec3(${b2});
  `;

  const peerDotSource = useMemo(() => {
    return Skia.RuntimeEffect.Make(`
      uniform float2 u_resolution;
      uniform float  u_time;
      uniform float2 u_heldPx;

      half4 main(float2 fragCoord) {
        float3 color = float3(0.0);

        float d = length(fragCoord - u_heldPx);

        float pulseSpeed  = 2.5;
        float pulseAmount = 0.15;

        float outerPulse  = 1.0 + pulseAmount * sin(u_time * pulseSpeed);
        float middlePulse = 1.0 + pulseAmount * 0.5 * sin(u_time * pulseSpeed + 1.0);
        float corePulse   = 1.0 + pulseAmount * 0.3 * sin(u_time * pulseSpeed + 2.0);

        float outerR  = 21.0 * outerPulse;
        float middleR = 11.0 * middlePulse;
        float coreR   =  8.0 * corePulse;

        float outerGlow  = smoothstep(outerR, 0.0, d) * 0.45;
        float middleRing = smoothstep(middleR, middleR * 0.70, d) * 0.70;
        float coreDot    = smoothstep(coreR, 0.0, d) * 1.00;

        float intensity = outerGlow + middleRing + coreDot;
        return half4(half3(intensity), half(intensity));
      }
    `);
  }, []);

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

  const [internalReset, setInternalReset] = useState(0);

  useEffect(() => {
    if (!internalReset && !reset) return;

    soul.current = new Soul(restPoint0, restPoint1, 0.02);
    leadPoint.current = new Mover(startingCoord0, startingCoord1);
    gecko.current = new Gecko(startingCoord0, startingCoord1, 0.06, {});

    workingBuffers.geckoPoints.fill(0);
    geckoPointsUniformSV.value = Array(TOTAL_GECKO_POINTS_COMPACT * 2).fill(0);
    userPointSV.value = [restPoint0, restPoint1];
    userPoint_geckoSpaceRef.current[0] = startingCoord0;
    userPoint_geckoSpaceRef.current[1] = startingCoord1;

    startMsRef.current = nowMs();
  }, [reset, internalReset]);

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

      const shouldUpdate =
        leadPoint.current.isMoving || isDragging.value;

      // advance time every frame so the peer-dot pulse always animates
      shaderTimeSV.value = (nowMs() - startMsRef.current) / 1000;

      if (shouldUpdate) {

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

     sendGuestGeckoPositionRef?.current?.(leadPoint.current.lead);

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
        u_time: 0,
        u_resolution: [width, height],
        u_aspect: aspect || 1,  
           u_peerDot: hostPeerGeckoPositionSV.value,
      
   
        u_geckoPoints: geckoPointsUniformSV.value,
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
    };
  }, [scale, gecko_scale, aspect, size.width, size.height, width, height]);

  // Peer dot: treat incoming [x, y] as normalized screen coords [0..1].
  // If the sender transmits gecko-space instead, swap this mapping later.
  const dotCx = useDerivedValue(() => {
    const p = hostPeerGeckoPositionSV.value;
    if (!p || !size.width) return -1000;
    return p.position[0] * size.width;
  }, [size.width]);

  const dotCy = useDerivedValue(() => {
    const p = hostPeerGeckoPositionSV.value;
    if (!p || !size.height) return -1000;
    return p.position[1] * size.height;
  }, [size.height]);

  const peerUniforms = useDerivedValue(() => {
    const p = hostPeerGeckoPositionSV.value;
    const hx = p && size.width ? p.position[0] * size.width : -1000;
    const hy = p && size.height ? p.position[1] * size.height : -1000;
    return {
      u_resolution: [size.width || width, size.height || height],
      u_time: shaderTimeSV.value,
      u_heldPx: [hx, hy],
    };
  }, [size.width, size.height, width, height]);

  return (
    <GestureDetector gesture={panGesture}>
      <View style={StyleSheet.absoluteFill}>
        {/* Peer dot canvas (replaces the moments background canvas) */}
        <Canvas ref={ref} style={StyleSheet.absoluteFill}>
          <Rect
            x={0}
            y={0}
            width={size.width}
            height={size.height}
            color="lightblue"
          >
            <Shader source={peerDotSource!} uniforms={peerUniforms} />
          </Rect>
        </Canvas>

        {/* Gecko canvas */}
        <Canvas ref={ref} style={StyleSheet.absoluteFill}>
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
    </GestureDetector>
  );
};

const MemoizedMirrorPlayGecko = React.memo(MirrorPlayGecko);
export default MemoizedMirrorPlayGecko;
