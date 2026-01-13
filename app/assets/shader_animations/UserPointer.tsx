import React, { useRef, useEffect } from "react";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Canvas, Skia, useCanvasSize, Rect, Shader } from "@shopify/react-native-skia";
import { useSharedValue } from "react-native-reanimated";
import Mover from "./leadPointClass";

export default function LeadPointPointer() {
  const { ref, size } = useCanvasSize();

  const userPointSV = useSharedValue([0.5, 0.5]);
  const leadRef = useRef(new Mover([0.5, 0.5]));

  const gesture = Gesture.Pan()
    .onTouchesDown((e) => {
      const touch = e.changedTouches[0];
      if (size.width && size.height) {
        userPointSV.value = [touch.x / size.width, touch.y / size.height];
      }
    })
    .onUpdate((e) => {
      if (size.width && size.height) {
        userPointSV.value = [e.x / size.width, e.y / size.height];
      }
    });

const source = Skia.RuntimeEffect.Make(`
uniform vec2 u_lead;       // normalized [0,1]
uniform vec2 u_resolution;

float circleSDF(vec2 uv, vec2 center, float radius) {
    // uv is already centered & scaled in main
    // so just compute difference
    vec2 diff = uv - center;
    return length(diff) - radius;
}

half4 main(vec2 fragCoord) {
    vec2 uv = fragCoord / u_resolution;

    // center UV around 0.5,0.5
    uv -= vec2(0.5);

    // scale X by aspect ratio
    float aspect = u_resolution.x / u_resolution.y;
    uv.x *= aspect;

    // now all your points should also be centered around 0.5 and scaled
    vec2 leadUV = u_lead - vec2(0.5);
    leadUV.x *= aspect;

    float mask = step(circleSDF(uv, leadUV, 0.02), 0.0);
    return vec4(mask, 0.0, 0.0, 1.0);
}

`);

  if (!source) return null;

  const [, setTick] = React.useState(0);
  useEffect(() => {
    let animationFrame;
    const tick = () => {
      leadRef.current.update(userPointSV.value);
      setTick((t) => t + 1);
      animationFrame = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <GestureDetector gesture={gesture}>
      <View style={{ flex: 1 }}>
        <Canvas ref={ref} style={{ flex: 1 }}>
          <Rect x={0} y={0} width={size.width} height={size.height}>
            <Shader
              source={source}
              uniforms={{
                u_lead: leadRef.current.lead,
                u_resolution: [size.width, size.height],
              }}
            />
          </Rect>
        </Canvas>
      </View>
    </GestureDetector>
  );
}
