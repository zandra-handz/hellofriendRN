import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSharedValue, runOnUI, runOnJS } from 'react-native-reanimated';
import { Canvas, Rect, Shader, Skia } from '@shopify/react-native-skia';

const WorkletTest = () => {
  const position = useSharedValue(0);
  const frameCount = useSharedValue(0);

  // JS thread logger
  const logJS = (count) => {
    console.log(`[JS Thread] Frame: ${count}`);
  };

  // Worklet animation loop (runs on UI thread)
  const animate = () => {
    'worklet';
    
    frameCount.value += 1;
    position.value = Math.sin(frameCount.value * 0.05) * 100;

    // Every 60 frames, log to JS thread
    if (frameCount.value % 60 === 0) {
      runOnJS(logJS)(frameCount.value);
    }

    // Schedule next frame on UI thread
    requestAnimationFrame(animate);
  };

  useEffect(() => {
    // Start the UI thread animation
    runOnUI(animate)();
  }, []);

  // Simple shader that uses the position
  const source = Skia.RuntimeEffect.Make(`
    uniform float u_position;
    uniform vec2 u_resolution;
    
    vec4 main(vec2 fragCoord) {
      vec2 uv = fragCoord / u_resolution;
      float dist = distance(uv, vec2(0.5 + u_position / u_resolution.x, 0.5));
      vec3 color = vec3(1.0 - dist * 2.0, 0.5, dist);
      return vec4(color, 1.0);
    }
  `);

  return (
    <View style={StyleSheet.absoluteFill}>
      <Canvas style={StyleSheet.absoluteFill}>
        <Rect x={0} y={0} width={400} height={400}>
          <Shader
            source={source}
            uniforms={{
              u_position: position,
              u_resolution: [400, 400],
            }}
          />
        </Rect>
      </Canvas>
    </View>
  );
};

export default WorkletTest;
 