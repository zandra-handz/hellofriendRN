import React, { useEffect, useRef, useState } from "react";
import { Canvas, Rect, Shader } from "@shopify/react-native-skia";
import { Skia } from "@shopify/react-native-skia";
import { Dimensions, View } from "react-native";

const { width, height } = Dimensions.get("window");

const hexToVec3 = (hex) => {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  return `${r.toFixed(4)}, ${g.toFixed(4)}, ${b.toFixed(4)}`;
};

const SpinnerSix = ({ color1, color2 }) => {
  const [time, setTime] = useState(0);
  const color1Converted = hexToVec3(color1);
  const color2Converted = hexToVec3(color2);

  const source = Skia.RuntimeEffect.Make(`
mat2 tzb_rotate2d(float angle){
  return mat2(cos(angle), -sin(angle),
              sin(angle),  cos(angle));
}

mat2 tzb_rotate2dSimple(float speed, float u_time){
  float soul = u_time * speed;
  return mat2(cos(soul), -sin(soul),
              sin(soul),  cos(soul));
}

uniform vec2 u_resolution;
uniform float u_time;

float PI = 3.14159265359;

float circleDF(vec2 uv, float radius){
  return length(uv) - radius;
}

float smoothMin(float a, float b, float k) {
  float h = clamp(.5 - .5*(a-b)/k, 0., 1.);
  return mix(b, a, h) - k*h*(1. - h);
}

half4 main(vec2 fragCoord) {
  vec3 startColor = vec3(${color1Converted});
  vec3 endColor   = vec3(${color2Converted});

  vec2 uv = (fragCoord - 0.5 * u_resolution) / u_resolution.y;

  // for RNSkia
  float scale = 3.0;
  uv *= scale;
  // end RNSkia

  float dP = dot(uv, uv) * 4.;
  float theta = atan(uv.x, uv.y);

  float circleSize = .03;
  float speed = 5.;
  float arcSize = 5. * abs(sin(u_time * 2.0));

  float rotation = mod(u_time * speed, PI * 2.);
  theta = mod(theta - rotation + PI * 2., PI * 2.);
  float radius = 0.1;
  float thickness = 0.03;

  vec2 coordsOne   = uv;
  vec2 coordsTwo   = uv;
  vec2 coordsThree = uv;

  float s = sin(u_time * speed);
  float ds = cos(u_time * speed);
  float motion = (s > 0.0 && ds > 0.0) ? s : 0.0;

  coordsOne.x += (sin(u_time * speed)) * -.5;
  coordsThree.x += (sin(u_time * speed - .8)) * -0.5;

  float circleOne   = circleDF(coordsOne,   circleSize);
  float circleTwo   = circleDF(coordsTwo,   circleSize);
  float circleThree = circleDF(coordsThree, circleSize);

  float circleMerge = smoothMin(smoothMin(circleOne, circleTwo, .05), circleThree, .05);

  float mask = smoothstep(0., 0.002, -circleMerge);

  vec3 finalColor = mix(startColor, endColor, coordsOne.x / scale);

  return vec4(finalColor * mask, mask);
}
`);

  if (!source) {
    console.error("❌ SpinnerSix shader failed to compile");
    return null;
  }

  const start = useRef(Date.now());
  useEffect(() => {
    let frame;
    const animate = () => {
      const now = (Date.now() - start.current) / 1000;
      setTime(now);
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  const uniforms = {
    u_time: time,
    u_resolution: [width, height],
  };

  return (
    <View
      style={{
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {color1Converted && color2Converted && (
        <Canvas style={{ width, height }}>
          <Rect x={0} y={0} width={width} height={height} color="lightblue">
            <Shader source={source} uniforms={uniforms} />
          </Rect>
        </Canvas>
      )}
    </View>
  );
};

export default SpinnerSix;