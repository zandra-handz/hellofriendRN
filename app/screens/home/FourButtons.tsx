import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { Canvas, Rect, Shader, Skia } from "@shopify/react-native-skia";
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import GlobalPressable from "@/app/components/appwide/button/GlobalPressable";
import SvgIcon from "@/app/styles/SvgIcons";
import manualGradientColors from "@/app/styles/StaticColors";

const { width, height } = Dimensions.get("window");

type Props = {
  size?: number;
  /** 1-based: 1=top, 2=right, 3=bottom, 4=left. null = none selected. */
  initialSelectedIndex?: number | null;
  /** Fires with 1-based index (1..4) when a button becomes selected. */
  onSelect?: (index: number) => void;
  /** Fires when the already-selected button is pressed again. */
  onPress1?: () => void;
  onPress2?: () => void;
  onPress3?: () => void;
  onPress4?: () => void;
  labels?: [string, string, string, string];
  headerGap?: number;
  textColor?: string;
  sessionIsActive?: boolean;
};

const DEFAULT_LABELS: [string, string, string, string] = [
  "Resume active session",
  "Category Settings",
  "History",
  "Gecko Settings",
];

const AnimatedGlobalPressable =
  Animated.createAnimatedComponent(GlobalPressable);

const hexToVec3 = (hex: string) => {
  const cleanHex = hex.replace("#", "");

  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  return `${r.toFixed(4)}, ${g.toFixed(4)}, ${b.toFixed(4)}`;
};

const normalizeAngle = (angle: number) => {
  "worklet";

  const twoPi = Math.PI * 2;
  return ((angle % twoPi) + twoPi) % twoPi;
};

const getShortestRotationToTarget = ({
  currentRotation,
  targetRotation,
}: {
  currentRotation: number;
  targetRotation: number;
}) => {
  "worklet";

  const twoPi = Math.PI * 2;

  const current = normalizeAngle(currentRotation);
  const target = normalizeAngle(targetRotation);

  let diff = target - current;

  if (diff > Math.PI) diff -= twoPi;
  if (diff < -Math.PI) diff += twoPi;

  return currentRotation + diff;
};

const createDotAnimatedStyle = ({
  index,
  radius,
  rotation,
  openProgress,
  dotSize,
}: {
  index: number;
  radius: number;
  rotation: SharedValue<number>;
  openProgress: SharedValue<number>;
  dotSize: number;
}) => {
  return useAnimatedStyle(() => {
    const baseAngle = index * Math.PI * 0.5 - Math.PI * 0.5;
    const angle = baseAngle + rotation.value;

    const currentRadius = radius * openProgress.value;

    const x = Math.cos(angle) * currentRadius;
    const y = Math.sin(angle) * currentRadius;

    return {
      width: dotSize,
      height: dotSize,
      borderRadius: dotSize / 2,
      transform: [{ translateX: x }, { translateY: y }],
    };
  });
};

const SHADER_SCALE = 2.0;
const CIRCLE_RADIUS_UV = 0.09; // outer dot size — bump up/down to make the four pressable dots bigger/smaller
const CENTER_CIRCLE_RADIUS_UV = 0.12; // center blob size — bigger center = stays connected to outer dots more
const REGROUP_DISTANCE_UV = 0.2; // how far outer dots sit from center when fully open — smaller = closer/more connected
const SMOOTH_MIN_K = 0.08; // bridge thickness between dots — bigger = chunkier merge / more connected look
const HEADER_ABOVE_CENTER = 0.135 * height;

const FourButtons = ({
  size = 360,
  initialSelectedIndex = null,
  onSelect,
  onPress1,
  onPress2,
  onPress3,
  onPress4,
  labels = DEFAULT_LABELS,
  headerGap = 24,
  textColor = manualGradientColors.lightColor,
  sessionIsActive,
}: Props) => {
  const dotColor = manualGradientColors.lightColor;
  const centerColor = manualGradientColors.lightColor;
  const iconColor = manualGradientColors.homeDarkColor;

  const dotSize = (CIRCLE_RADIUS_UV / SHADER_SCALE) * height * 2;
  const iconSize = dotSize * 0.55;
  const radius = (REGROUP_DISTANCE_UV / SHADER_SCALE) * height;

  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    initialSelectedIndex
  );

  const initialInternalIndex =
    initialSelectedIndex != null ? initialSelectedIndex - 1 : 0;
  const initialFinalRotation = -initialInternalIndex * Math.PI * 0.5;

  const rotation = useSharedValue(initialFinalRotation - Math.PI);
  const openProgress = useSharedValue(0);
  const selectedIndexRef = useRef(initialInternalIndex);

  const OPEN_DURATION = 500;
  const SWITCH_DURATION = 700;

  useEffect(() => {
    rotation.value = withTiming(initialFinalRotation, {
      duration: OPEN_DURATION,
      easing: Easing.out(Easing.cubic),
    });
    openProgress.value = withTiming(1, {
      duration: OPEN_DURATION,
      easing: Easing.sin,
    });
  }, [openProgress, rotation, initialFinalRotation]);

  const buttonIcons = useMemo(
    () => ["scatter_plot", "wrench", "pie_chart", "pulse"],
    []
  );

  const pressHandlers = [onPress1, onPress2, onPress3, onPress4];

  const color1Converted = hexToVec3(centerColor);
  const color2Converted = hexToVec3(dotColor);

  const source = useMemo(() => {
    return Skia.RuntimeEffect.Make(`
uniform vec2 u_resolution;
uniform float u_open;
uniform float u_angle;

float distFCircle(vec2 uv, float radius) {
  return length(uv) - radius;
}

float smoothMin(float a, float b, float k) {
  float h = clamp(0.5 + (0.5 * (b - a) / k), 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

mat2 rotate2d(float angle) {
  return mat2(
    cos(angle), -sin(angle),
    sin(angle), cos(angle)
  );
}

half4 main(vec2 fragCoord) {
  vec3 centerColor = vec3(${color1Converted});
  vec3 dotColor = vec3(${color2Converted});

  vec2 center = 0.5 * u_resolution;
  float boxSize = ${size.toFixed(1)} * 0.56;

  if (
    abs(fragCoord.x - center.x) > boxSize ||
    abs(fragCoord.y - center.y) > boxSize
  ) {
    return vec4(0.0);
  }

  vec2 uv = (fragCoord - 0.5 * u_resolution) / u_resolution.y;

  uv = rotate2d(u_angle) * uv;

  float scale = ${SHADER_SCALE.toFixed(1)};
  uv *= scale;

  float circleSize = ${CIRCLE_RADIUS_UV.toFixed(3)};
  float centerCircleSize = ${CENTER_CIRCLE_RADIUS_UV.toFixed(3)};
  float regroupDistance = ${REGROUP_DISTANCE_UV.toFixed(3)} * u_open;

  vec2 centerCoords = uv;

  vec2 topCoords = uv;
  vec2 rightCoords = uv;
  vec2 bottomCoords = uv;
  vec2 leftCoords = uv;

  topCoords.y += regroupDistance;
  rightCoords.x -= regroupDistance;
  bottomCoords.y -= regroupDistance;
  leftCoords.x += regroupDistance;

  float centerCircle = distFCircle(centerCoords, centerCircleSize);
  float topCircle = distFCircle(topCoords, circleSize);
  float rightCircle = distFCircle(rightCoords, circleSize);
  float bottomCircle = distFCircle(bottomCoords, circleSize);
  float leftCircle = distFCircle(leftCoords, circleSize);

  float merged = smoothMin(centerCircle, topCircle, ${SMOOTH_MIN_K.toFixed(3)});
  merged = smoothMin(merged, rightCircle, ${SMOOTH_MIN_K.toFixed(3)});
  merged = smoothMin(merged, bottomCircle, ${SMOOTH_MIN_K.toFixed(3)});
  merged = smoothMin(merged, leftCircle, ${SMOOTH_MIN_K.toFixed(3)});

  float mask = smoothstep(0.002, 0.0, merged);

  vec3 finalColor = mix(centerColor, dotColor, smoothstep(-0.1, 0.25, uv.x));

  return vec4(finalColor * mask, mask);
}
`);
  }, [color1Converted, color2Converted, size]);

  const uniforms = useDerivedValue(() => {
    return {
      u_resolution: [width, height],
      u_open: openProgress.value,
      u_angle: rotation.value,
    };
  });

  const spinButtonToTop = useCallback(
    (internalIndex: number) => {
      if (selectedIndexRef.current === internalIndex) return;
      selectedIndexRef.current = internalIndex;

      const baseAngle = internalIndex * Math.PI * 0.5 - Math.PI * 0.5;
      const targetRotation = -Math.PI * 0.5 - baseAngle;

      const aligned = getShortestRotationToTarget({
        currentRotation: rotation.value,
        targetRotation,
      });

      rotation.value = withTiming(aligned + Math.PI * 2, {
        duration: SWITCH_DURATION,
        easing: Easing.inOut(Easing.cubic),
      });

      openProgress.value = withSequence(
        withTiming(0, {
          duration: SWITCH_DURATION / 2,
          easing: Easing.in(Easing.sin),
        }),
        withTiming(1, {
          duration: SWITCH_DURATION / 2,
          easing: Easing.sin,
        })
      );
    },
    [openProgress, rotation]
  );

  const buttonStyle0 = createDotAnimatedStyle({
    index: 0,
    radius,
    rotation,
    openProgress,
    dotSize,
  });

  const buttonStyle1 = createDotAnimatedStyle({
    index: 1,
    radius,
    rotation,
    openProgress,
    dotSize,
  });

  const buttonStyle2 = createDotAnimatedStyle({
    index: 2,
    radius,
    rotation,
    openProgress,
    dotSize,
  });

  const buttonStyle3 = createDotAnimatedStyle({
    index: 3,
    radius,
    rotation,
    openProgress,
    dotSize,
  });

  const buttonStyles = [buttonStyle0, buttonStyle1, buttonStyle2, buttonStyle3];

  if (!source) {
    console.error("FourButtons shader failed to compile");
    return null;
  }

  const buttonLayerSize = (radius + dotSize / 2) * 2;
  const buttonLayerOffset = (height - buttonLayerSize) / 2;
  const headerLabel =
    selectedIndex != null ? labels[selectedIndex - 1] : null;
  const headerBottom = height / 2 + HEADER_ABOVE_CENTER + headerGap;

  return (
    <>
      <Canvas
        pointerEvents="none"
        style={[styles.canvas, { pointerEvents: "none" }]}
      >
        <Rect x={0} y={0} width={width} height={height}>
          <Shader source={source} uniforms={uniforms} />
        </Rect>
      </Canvas>

      {headerLabel != null && (
        <View
          pointerEvents="none"
          style={[
            styles.headerWrap,
            { bottom: headerBottom, pointerEvents: "none" },
          ]}
        >
          <Text style={[styles.headerText, { color: textColor }]}>
            {headerLabel}
          </Text>
        </View>
      )}

      <View
        pointerEvents="box-none"
        style={[
          styles.buttonLayer,
          {
            width: buttonLayerSize,
            height: buttonLayerSize,
            top: buttonLayerOffset,
            left: (width - buttonLayerSize) / 2,
            pointerEvents: "box-none",
          },
        ]}
      >
        {buttonIcons.map((iconName, index) => {
          return (
            <AnimatedGlobalPressable
              key={`${iconName}-${index}`}
              onPress={() => {
                if (selectedIndexRef.current === index) {
                  pressHandlers[index]?.();
                  return;
                }
                spinButtonToTop(index);
                setSelectedIndex(index + 1);
                onSelect?.(index + 1);
              }}
              style={[styles.dotButton, buttonStyles[index]]}
            >
              <SvgIcon name={iconName} color={iconColor} size={iconSize} />
            </AnimatedGlobalPressable>
          );
        })}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  canvas: {
    position: "absolute",
    width,
    height,
  },
  buttonLayer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  dotButton: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    zIndex: 5,
  },
  headerWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default React.memo(FourButtons);
