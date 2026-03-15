import React from "react";
import { Canvas, Rect, Shader, Skia, useClock } from "@shopify/react-native-skia";
import { Dimensions, View } from "react-native";
import { useDerivedValue, useSharedValue, useAnimatedReaction } from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

const hexToVec3 = (hex) => {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  return `${r.toFixed(4)}, ${g.toFixed(4)}, ${b.toFixed(4)}`;
};

const TWO_PI = 6.28318530718;

const SpinnerThree = ({ color1, color2, speed }) => {
  const clock = useClock();
  const color1Converted = hexToVec3(color1);
  const color2Converted = hexToVec3(color2);

  // angle accumulated up to the last speed change
  const rotationOffset = useSharedValue(0);
  // clock.value (ms) at the last speed change
  const timeAtSpeedChange = useSharedValue(0);

  // whenever speed changes: bake current angle into offset, reset time baseline
  useAnimatedReaction(
    () => speed.value,
    (_newSpeed, _prevSpeed) => {
      if (_prevSpeed === null) return;
      const t = clock.value / 1000;
      const elapsed = t - timeAtSpeedChange.value / 1000;
      rotationOffset.value = (rotationOffset.value + elapsed * _prevSpeed) % TWO_PI;
      timeAtSpeedChange.value = clock.value;
    }
  );

  const source = Skia.RuntimeEffect.Make(`
    uniform float u_time;
    uniform float u_speed;
    uniform float u_rotation_offset;
    uniform float u_time_at_speed_change;
    uniform vec2 u_resolution;

    float TWO_PI = 6.28318530718;

    float makeGear(vec2 st, float rotation, float a, float numProngs, float edgeAdd, float dotP) {
      float shape = smoothstep(0.0, .6, (cos(rotation + a * numProngs * 2.))) * .2 + .2;
      return step(shape, dotP) * (1.0 - step(shape + edgeAdd, dotP));
    }

    half4 main(vec2 fragCoord) {
      vec2 center = 0.5 * u_resolution;
      float boxSize = u_resolution.y * 0.35;
      if (abs(fragCoord.x - center.x) > boxSize || abs(fragCoord.y - center.y) > boxSize) {
        return vec4(0.0);
      }

      vec2 uv = (fragCoord - 0.5 * u_resolution) / u_resolution.y;

      float numProngs = 6. / 2.;
      float elapsed = u_time - u_time_at_speed_change;
      float rotation = mod(u_rotation_offset + elapsed * u_speed, TWO_PI);
      float edgeAdd = 0.05;

      float posH = .11;
      vec2 subOffsetBottom = (uv - vec2(-posH, 0.1)) * 2.0;
      vec2 subOffsetTop    = (uv - vec2( posH, -.14)) * 2.0;

      float dotP    = dot(subOffsetBottom, subOffsetBottom) * 4.;
      float a       = atan(subOffsetBottom.x, subOffsetBottom.y);
      float dotPTwo = dot(subOffsetTop, subOffsetTop) * 4.;
      float aTwo    = atan(subOffsetTop.x, subOffsetTop.y);

      float gearBottom = makeGear(subOffsetBottom,  rotation, a,    numProngs, edgeAdd, dotP);
      float gearTop    = makeGear(subOffsetTop,    -rotation, aTwo, numProngs, edgeAdd, dotPTwo);

      vec3 startColor = vec3(${color1Converted});
      vec3 endColor   = vec3(${color2Converted});
      vec3 gradient   = mix(startColor, endColor, uv.x * uv.y);

      float alpha = clamp(gearBottom + gearTop, 0.0, 1.0);
      return vec4(gradient * alpha, alpha);
    }
  `);

  if (!source) {
    console.error("❌ SpinnerThree shader failed to compile");
    return null;
  }

  const uniforms = useDerivedValue(() => ({
    u_time: clock.value / 1000,
    u_speed: speed.value,
    u_rotation_offset: rotationOffset.value,
    u_time_at_speed_change: timeAtSpeedChange.value / 1000,
    u_resolution: [width, height],
  }));

  return (
    <View style={{ padding: 10, alignItems: "center", justifyContent: "center" }}>
      <Canvas style={{ width, height, backgroundColor: "transparent" }}>
        <Rect x={0} y={0} width={width} height={height}>
          <Shader source={source} uniforms={uniforms} />
        </Rect>
      </Canvas>
    </View>
  );
};

export default SpinnerThree;