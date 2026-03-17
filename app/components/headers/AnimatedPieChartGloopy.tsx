// // AnimatedPieChartGloopy.tsx
// //
// // Each slice = one large circle placed on a ring.
// // At rest they overlap into a solid pie via simple min (sharp union).
// // When a slice is selected, its circle pops outward and a smoothMin
// // bridge forms between it and its neighbors — giving the gloopy stretch.
// // "All" selected = no gloop, just clean circles.

// import React, { useEffect, useMemo, useState, useCallback } from "react";
// import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
// import {
//   Canvas,
//   Rect,
//   Shader,
//   Skia,
// } from "@shopify/react-native-skia";
// import {
//   useSharedValue,
//   useDerivedValue,
//   withTiming,
//   Easing,
// } from "react-native-reanimated";

// // ─── constants ───────────────────────────────────────────────────────────────

// const MAX_SLICES = 20;
// const POP_DISTANCE = 20;
// const POP_DURATION = 350;
// const LABEL_FONT_SIZE = 12;
// const MAX_FONT_SIZE = 34;

// const getDotSize = (pct: number) =>
//   Math.max(6, Math.min(18, 6 + (pct / 100) * 24));

// const hexToRGB = (hex: string): [number, number, number] => {
//   const h = hex.replace("#", "");
//   return [
//     parseInt(h.substring(0, 2), 16) / 255,
//     parseInt(h.substring(2, 4), 16) / 255,
//     parseInt(h.substring(4, 6), 16) / 255,
//   ];
// };

// // ─── SKSL shader ─────────────────────────────────────────────────────────────
// //
// // Each slice is ONE circle. Uniforms per circle:
// //   position (u_cx, u_cy), radius (u_cr), colour (u_cR/G/B),
// //   dim flag (u_cDim), pop amount (u_cPop 0..1), selected flag (u_cSel).
// //
// // Rendering:
// //   1) For all NON-selected circles → hard min (clean union, no gloop)
// //   2) For the SELECTED circle(s) → smoothMin against the base SDF
// //      so only the popping slice gets the stretchy bridge
// //   3) Composite with colour weighting

// const shaderSource = `
// uniform vec2  u_resolution;
// uniform float u_count;
// uniform float u_cx[${MAX_SLICES}];
// uniform float u_cy[${MAX_SLICES}];
// uniform float u_cr[${MAX_SLICES}];
// uniform float u_cR[${MAX_SLICES}];
// uniform float u_cG[${MAX_SLICES}];
// uniform float u_cB[${MAX_SLICES}];
// uniform float u_cDim[${MAX_SLICES}];
// uniform float u_cSel[${MAX_SLICES}];   // 1 = this circle is selected & popping
// uniform float u_smoothK;               // smoothMin k, passed from JS

// float smin(float a, float b, float k) {
//   float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
//   return mix(b, a, h) - k * h * (1.0 - h);
// }

// half4 main(vec2 fragCoord) {
//   vec2 center = 0.5 * u_resolution;
//   vec2 uv = fragCoord - center;
//   int count = int(u_count);

//   float k = u_smoothK;
//   float softEdge = 1.6;

//   // bbox reject
//   float bbox = 0.0;
//   for (int i = 0; i < ${MAX_SLICES}; i++) {
//     if (i >= count) break;
//     float edge = length(vec2(u_cx[i], u_cy[i])) + u_cr[i];
//     bbox = max(bbox, edge);
//   }
//   bbox += 20.0;
//   if (abs(uv.x) > bbox || abs(uv.y) > bbox) return vec4(0.0);

//   // ── pass 1: base SDF from non-selected circles (hard min = clean edges) ──
//   float baseDist = 1e5;
//   float dists[${MAX_SLICES}];

//   for (int i = 0; i < ${MAX_SLICES}; i++) {
//     if (i >= count) break;
//     float d = length(uv - vec2(u_cx[i], u_cy[i])) - u_cr[i];
//     dists[i] = d;
//     if (u_cSel[i] < 0.5) {
//       baseDist = min(baseDist, d);   // hard min — no gloop between base circles
//     }
//   }

//   // ── pass 2: selected circles get smoothMin'd against the base ──
//   float finalDist = baseDist;
//   for (int i = 0; i < ${MAX_SLICES}; i++) {
//     if (i >= count) break;
//     if (u_cSel[i] > 0.5) {
//       finalDist = smin(finalDist, dists[i], k);   // gloopy bridge!
//     }
//   }

//   if (finalDist > softEdge * 2.0) return vec4(0.0);

//   float mask = smoothstep(softEdge, -softEdge * 0.5, finalDist);

//   // ── colour blend ──
//   vec3 col = vec3(0.0);
//   float totalW = 0.0;

//   for (int i = 0; i < ${MAX_SLICES}; i++) {
//     if (i >= count) break;
//     float w = exp(-max(dists[i] - finalDist, 0.0) / max(k * 0.4, 0.001));
//     vec3 c = vec3(u_cR[i], u_cG[i], u_cB[i]);
//     if (u_cDim[i] > 0.5) c *= 0.25;
//     col += c * w;
//     totalW += w;
//   }
//   col /= max(totalW, 0.001);

//   return vec4(col * mask, mask);
// }
// `;

// // ─── compile once ────────────────────────────────────────────────────────────

// let _compiled: ReturnType<typeof Skia.RuntimeEffect.Make> | null = null;
// const getShader = () => {
//   if (!_compiled) {
//     _compiled = Skia.RuntimeEffect.Make(shaderSource);
//     if (!_compiled) console.error("❌ Gloopy pie shader failed to compile");
//   }
//   return _compiled;
// };

// // ─── per-slice pop shared values ─────────────────────────────────────────────

// function useSlicePopValues() {
//   const pops: ReturnType<typeof useSharedValue<number>>[] = [];
//   for (let i = 0; i < MAX_SLICES; i++) {
//     // eslint-disable-next-line react-hooks/rules-of-hooks
//     pops.push(useSharedValue(0));
//   }
//   return pops;
// }

// // ─── component ───────────────────────────────────────────────────────────────

// export default function AnimatedPieChartGloopy({
//   darkerOverlayBackgroundColor,
//   primaryColor,
//   welcomeTextStyle,
//   subWelcomeTextStyle,
//   primaryOverlayColor,
//   data = [],
//   radius = 100,
//   duration = 500,
//   showPercentages = false,
//   showLabels = true,
//   onSectionPress = null,
//   labelsSize = 12,
// }: {
//   darkerOverlayBackgroundColor?: string;
//   primaryColor?: string;
//   welcomeTextStyle?: any;
//   subWelcomeTextStyle?: any;
//   primaryOverlayColor?: string;
//   data?: any[];
//   radius?: number;
//   duration?: number;
//   showPercentages?: boolean;
//   showLabels?: boolean;
//   onSectionPress?: ((id: any, name: any) => void) | null;
//   labelsSize?: number;
// }) {
//   const source = getShader();
//   const progress = useSharedValue(0);
//   const total = data.reduce((sum, d) => sum + d.value, 0);
//   const size = radius * 2 + POP_DISTANCE * 2 + 20;
//   const [selectedId, setSelectedId] = useState<number | string | null>(null);
//   const popValues = useSlicePopValues();

//   useEffect(() => {
//     progress.value = 0;
//     progress.value = withTiming(1, { duration });
//   }, [data]);

//   // ── slice geometry ─────────────────────────────────────────────────────────

//   const sliceGeo = useMemo(() => {
//     if (!data.length || total === 0) return [];
//     let cum = 0;
//     return data.map((slice) => {
//       const startDeg = cum;
//       const spanDeg = (slice.value / total) * 360;
//       cum += spanDeg;
//       const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180;
//       const midRad = toRad(startDeg + spanDeg / 2);

//       // Circle radius proportional to the slice's arc length
//       const arcLen = (spanDeg / 360) * 2 * Math.PI * radius * 0.6;
//       const circleR = Math.min(
//         Math.max(arcLen * 0.45, radius * 0.06),
//         radius * 0.52,
//       );

//       return {
//         startRad: toRad(startDeg),
//         endRad: toRad(cum),
//         midRad,
//         circleR,
//         rgb: hexToRGB(slice.color),
//         slice,
//         pct: (slice.value / total) * 100,
//       };
//     });
//   }, [data, total, radius]);

//   const isAllSelected = selectedId === "all";
//   const hasSelection = selectedId !== null;

//   // ── animate pop ────────────────────────────────────────────────────────────

//   useEffect(() => {
//     const popConfig = {
//       duration: POP_DURATION,
//       easing: Easing.out(Easing.back(1.6)),
//     };
//     const returnConfig = {
//       duration: POP_DURATION,
//       easing: Easing.inOut(Easing.ease),
//     };
//     for (let i = 0; i < MAX_SLICES; i++) {
//       if (i >= sliceGeo.length) {
//         popValues[i].value = 0;
//         continue;
//       }
//       // "All" selected → no pop (no gloop)
//       const shouldPop =
//         !isAllSelected && selectedId === sliceGeo[i].slice.user_category;
//       popValues[i].value = withTiming(
//         shouldPop ? 1 : 0,
//         shouldPop ? popConfig : returnConfig,
//       );
//     }
//   }, [selectedId, sliceGeo.length]);

//   const handleSectionPress = useCallback(
//     (categoryId: number | string, categoryName: string) => {
//       if (categoryId === selectedId) {
//         setSelectedId(null);
//         onSectionPress?.(null, null);
//       } else {
//         setSelectedId(categoryId);
//         onSectionPress?.(categoryId, categoryName);
//       }
//     },
//     [selectedId, onSectionPress],
//   );

//   // ── uniforms ───────────────────────────────────────────────────────────────

//   const uniforms = useDerivedValue(() => {
//     const count = Math.min(sliceGeo.length, MAX_SLICES);
//     const prog = progress.value;

//     const cx = new Array(MAX_SLICES).fill(0);
//     const cy = new Array(MAX_SLICES).fill(0);
//     const cr = new Array(MAX_SLICES).fill(0);
//     const cR = new Array(MAX_SLICES).fill(0);
//     const cG = new Array(MAX_SLICES).fill(0);
//     const cB = new Array(MAX_SLICES).fill(0);
//     const cDim = new Array(MAX_SLICES).fill(0);
//     const cSel = new Array(MAX_SLICES).fill(0);

//     // Place each slice's circle on a ring at ~60% radius
//     const ringR = radius * 0.48;

//     for (let i = 0; i < count; i++) {
//       const g = sliceGeo[i];
//       // Animate the mid-angle with entrance progress
//       const midAngle = g.midRad * prog;

//       // pop offset
//       const popAmt = popValues[i].value;
//       const popOffX = Math.cos(midAngle) * POP_DISTANCE * popAmt;
//       const popOffY = Math.sin(midAngle) * POP_DISTANCE * popAmt;

//       cx[i] = Math.cos(midAngle) * ringR + popOffX;
//       cy[i] = Math.sin(midAngle) * ringR + popOffY;
//       cr[i] = g.circleR;
//       cR[i] = g.rgb[0];
//       cG[i] = g.rgb[1];
//       cB[i] = g.rgb[2];

//       const isSel =
//         !isAllSelected && selectedId === g.slice.user_category;
//       cSel[i] = popAmt > 0.01 ? 1 : 0;  // use animated value so bridge forms during animation
//       cDim[i] = hasSelection && !isSel && !isAllSelected ? 1 : 0;
//     }

//     return {
//       u_resolution: [size, size] as [number, number],
//       u_count: count,
//       u_cx: cx,
//       u_cy: cy,
//       u_cr: cr,
//       u_cR: cR,
//       u_cG: cG,
//       u_cB: cB,
//       u_cDim: cDim,
//       u_cSel: cSel,
//       u_smoothK: radius * 0.15,  // gloop stretch amount
//     };
//   });

//   // ── touch ──────────────────────────────────────────────────────────────────

//   const handleCanvasPress = useCallback(
//     (evt: { nativeEvent: { locationX: number; locationY: number } }) => {
//       const px = evt.nativeEvent.locationX;
//       const py = evt.nativeEvent.locationY;
//       const cx = size / 2;
//       const cy = size / 2;
//       const dx = px - cx;
//       const dy = py - cy;
//       const dist = Math.sqrt(dx * dx + dy * dy);

//       if (dist < 25) {
//         handleSectionPress("all", "All");
//         return;
//       }
//       if (dist > radius + POP_DISTANCE + 10) return;

//       let angle = Math.atan2(dy, dx);
//       angle = ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

//       for (const g of sliceGeo) {
//         const s =
//           ((g.startRad % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
//         const e =
//           ((g.endRad % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
//         const span =
//           ((e - s) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
//         const rel =
//           ((angle - s) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
//         if (rel <= span) {
//           handleSectionPress(g.slice.user_category, g.slice.name);
//           return;
//         }
//       }
//     },
//     [size, radius, sliceGeo, handleSectionPress],
//   );

//   // ── percentage overlay ─────────────────────────────────────────────────────

//   const percentageOverlays = useMemo(() => {
//     if (!showPercentages || !data.length || total === 0) return [];
//     let cumAngle = 0;
//     return data.map((slice) => {
//       const startAngle = cumAngle;
//       const angle = (slice.value / total) * 360;
//       cumAngle += angle;
//       const midAngle = startAngle + angle / 2;
//       const pct = (slice.value / total) * 100;
//       const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180;
//       const distanceFactor = 0.68;
//       const x =
//         size / 2 + radius * distanceFactor * Math.cos(toRad(midAngle));
//       const y =
//         size / 2 + radius * distanceFactor * Math.sin(toRad(midAngle));
//       return { x, y, pct, slice };
//     });
//   }, [data, total, radius, size, showPercentages]);

//   const sortedCallouts = useMemo(() => {
//     if (!data.length || total === 0) return [];
//     return [...data]
//       .map((slice) => ({ slice, pct: (slice.value / total) * 100 }))
//       .sort((a, b) => b.pct - a.pct);
//   }, [data, total]);

//   if (!source) return null;

//   return (
//     <View style={styles.outerContainer}>
//       <View style={[styles.pieContainer, { width: size, height: size }]}>
//         <Canvas style={{ width: size, height: size }}>
//           <Rect x={0} y={0} width={size} height={size}>
//             <Shader source={source} uniforms={uniforms} />
//           </Rect>
//         </Canvas>

//         <Pressable
//           onPress={handleCanvasPress}
//           style={[StyleSheet.absoluteFill, { zIndex: 10 }]}
//         />

//         {showPercentages &&
//           !isAllSelected &&
//           percentageOverlays.map((item, i) => {
//             if (selectedId !== item.slice.user_category) return null;
//             return (
//               <Pressable
//                 key={`pct-${i}`}
//                 onPress={() =>
//                   handleSectionPress(
//                     item.slice.user_category,
//                     item.slice.name,
//                   )
//                 }
//                 style={{
//                   position: "absolute",
//                   top: item.y - 25,
//                   left: item.x - 30,
//                   minWidth: 60,
//                   alignItems: "center",
//                   justifyContent: "center",
//                   zIndex: 15,
//                 }}
//               >
//                 <Text
//                   style={[
//                     welcomeTextStyle,
//                     {
//                       backgroundColor: darkerOverlayBackgroundColor,
//                       paddingHorizontal: 10,
//                       paddingVertical: 10,
//                       borderRadius: 20,
//                       fontSize: MAX_FONT_SIZE,
//                       color: primaryColor,
//                     },
//                   ]}
//                 >
//                   {`${Math.round(item.pct)}%`}
//                 </Text>
//               </Pressable>
//             );
//           })}

//         <Pressable
//           onPress={() => handleSectionPress("all", "All")}
//           style={[
//             styles.centerButton,
//             {
//               top: size / 2 - 30,
//               left: size / 2 - 30,
//               backgroundColor: isAllSelected
//                 ? `${primaryOverlayColor}FF`
//                 : primaryOverlayColor,
//               borderWidth: isAllSelected ? 2 : 0,
//               borderColor: primaryColor,
//             },
//           ]}
//         />
//       </View>

//       {showLabels && (
//         <ScrollView
//           fadingEdgeLength={4}
//           style={[styles.legendScroll, { maxHeight: size }]}
//           contentContainerStyle={styles.legendContent}
//           showsVerticalScrollIndicator={false}
//           nestedScrollEnabled
//         >
//           {sortedCallouts.map((item, i) => {
//             const isSelected =
//               selectedId === item.slice.user_category || isAllSelected;
//             const isDimmed = hasSelection && !isSelected;
//             const dotSize = getDotSize(item.pct);

//             return (
//               <Pressable
//                 key={`label-${item.slice.user_category || i}`}
//                 onPress={() =>
//                   handleSectionPress(
//                     item.slice.user_category,
//                     item.slice.name,
//                   )
//                 }
//                 style={[
//                   styles.legendRow,
//                   {
//                     backgroundColor: isSelected
//                       ? `${primaryOverlayColor}FF`
//                       : "transparent",
//                     opacity: isDimmed ? 0.3 : 1,
//                     borderWidth: isSelected ? 1 : 0,
//                     borderColor: isSelected
//                       ? item.slice.color
//                       : "transparent",
//                   },
//                 ]}
//               >
//                 <View style={styles.dotContainer}>
//                   <View
//                     style={{
//                       width: dotSize,
//                       height: dotSize,
//                       borderRadius: dotSize / 2,
//                       backgroundColor: item.slice.color,
//                     }}
//                   />
//                 </View>
//                 <Text
//                   style={[
//                     subWelcomeTextStyle,
//                     { fontSize: LABEL_FONT_SIZE, color: primaryColor },
//                   ]}
//                   numberOfLines={1}
//                 >
//                   {item.slice.name}
//                 </Text>
//                 {showPercentages && (
//                   <Text
//                     style={[
//                       subWelcomeTextStyle,
//                       {
//                         fontSize: LABEL_FONT_SIZE - 1,
//                         color: primaryColor,
//                         opacity: 0.5,
//                       },
//                     ]}
//                   >
//                     {`${Math.round(item.pct)}%`}
//                   </Text>
//                 )}
//               </Pressable>
//             );
//           })}
//           <View style={{ height: 40 }} />
//         </ScrollView>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   outerContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 12,
//   },
//   pieContainer: {
//     flexShrink: 0,
//   },
//   dotContainer: {
//     width: 18,
//     alignItems: "flex-start",
//     justifyContent: "center",
//   },
//   centerButton: {
//     position: "absolute",
//     width: 60,
//     height: 60,
//     borderRadius: 999,
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 20,
//   },
//   legendScroll: {
//     flex: 1,
//   },
//   legendContent: {
//     gap: 4,
//     paddingVertical: 4,
//   },
//   legendRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     paddingHorizontal: 8,
//     paddingVertical: 6,
//     borderRadius: 8,
//   },
// });




























// AnimatedPieChartGloopy.tsx

// Normal solid pie chart at rest (wedge SDFs, hard min).
// When a slice is selected & pops out:
//   - Its wedge SDF gets corner-rounding (d -= roundR) for bubbly shape
//   - It's composited via smoothMin against the base pie → gloopy stretch bridge
// "All" selected → all pop slightly but no gloop (hard min only).




























// // AnimatedPieChartGloopy.tsx
// //
// // Spinner-inspired pie chart. Each category = a circle/dot.
// // At rest all dots sit near center → smoothMin merges them into one blob (the pie).
// // When selected, a dot pulls outward → smoothMin bridge stretches (gloop).
// // Colour: angular Voronoi — each pixel gets the colour of whichever dot's
// // angle it's closest to. No SDF-based colour blending = no lag/smear.
// //
// // Container sizing matches the original AnimatedPieChartWithCallouts exactly.

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import {
  Canvas,
  Rect,
  Shader,
  Skia,
} from "@shopify/react-native-skia";
import {
  useSharedValue,
  useDerivedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";

// ─── constants ───────────────────────────────────────────────────────────────

const MAX_SLICES = 20;

// POP_DISTANCE matches original — used for container sizing only
const POP_DISTANCE = 12;

// How far the dot actually travels when popping (shader-space pixels)
const POP_TRAVEL = 28;

const POP_DURATION = 350;
const LABEL_FONT_SIZE = 12;
const MAX_FONT_SIZE = 34;

const getDotSize = (pct: number) =>
  Math.max(6, Math.min(18, 6 + (pct / 100) * 24));

const hexToRGB = (hex: string): [number, number, number] => {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0, 2), 16) / 255,
    parseInt(h.substring(2, 4), 16) / 255,
    parseInt(h.substring(4, 6), 16) / 255,
  ];
};

// ─── SKSL shader ─────────────────────────────────────────────────────────────

const shaderSource = `
uniform vec2  u_resolution;
uniform float u_radius;
uniform float u_smoothK;

uniform float u_count;
uniform float u_cx[${MAX_SLICES}];
uniform float u_cy[${MAX_SLICES}];
uniform float u_cr[${MAX_SLICES}];
uniform float u_cR[${MAX_SLICES}];
uniform float u_cG[${MAX_SLICES}];
uniform float u_cB[${MAX_SLICES}];
uniform float u_pop[${MAX_SLICES}];
uniform float u_dimmed[${MAX_SLICES}];

// angular ranges for colour lookup (start/end in radians)
uniform float u_angStart[${MAX_SLICES}];
uniform float u_angEnd[${MAX_SLICES}];

const float TAU = 6.28318530;

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

half4 main(vec2 fragCoord) {
  vec2 center = 0.5 * u_resolution;
  vec2 uv = fragCoord - center;
  int count = int(u_count);
  float k = u_smoothK;

  float bbox = u_radius + 50.0;
  if (abs(uv.x) > bbox || abs(uv.y) > bbox) return vec4(0.0);

  // clip circle for the base pie
  float clipDist = length(uv) - u_radius;

  // ── two-pass shape: base (clipped) + popping dots (unclipped, gloop bridged) ──
  float baseDist = 1e5;
  float popDist = 1e5;
  for (int i = 0; i < ${MAX_SLICES}; i++) {
    if (i >= count) break;
    float d = length(uv - vec2(u_cx[i], u_cy[i])) - u_cr[i];
    if (u_pop[i] < 0.01) {
      baseDist = smin(baseDist, d, k);
    } else {
      popDist = smin(popDist, d, k);
    }
  }
  baseDist = max(baseDist, clipDist);  // clip the base to a circle

  float finalDist;
  if (popDist > 900.0) {
    // nothing popping — just the clipped base
    finalDist = baseDist;
  } else {
    // gloop bridge between clipped base and the popping dot
    finalDist = smin(baseDist, popDist, k);
  }

  // mask like the spinner
  float mask = smoothstep(0.0, -1.5, finalDist);
  if (mask < 0.001) return vec4(0.0);

  // ── colour: angular Voronoi ──
  float angle = mod(atan(uv.y, uv.x), TAU);

  vec3 col = vec3(0.5);
  float dimVal = 0.0;

  for (int i = 0; i < ${MAX_SLICES}; i++) {
    if (i >= count) break;
    float s = u_angStart[i];
    float e = u_angEnd[i];
    float span = mod(e - s, TAU);
    float rel = mod(angle - s, TAU);
    if (rel <= span) {
      col = vec3(u_cR[i], u_cG[i], u_cB[i]);
      dimVal = u_dimmed[i];
      break;
    }
  }

  if (dimVal > 0.5) col *= 0.25;

  return vec4(col * mask, mask);
}
`;

// ─── compile once ────────────────────────────────────────────────────────────

let _compiled: ReturnType<typeof Skia.RuntimeEffect.Make> | null = null;
const getShader = () => {
  if (!_compiled) {
    _compiled = Skia.RuntimeEffect.Make(shaderSource);
    if (!_compiled) console.error("❌ Gloopy pie shader failed to compile");
  }
  return _compiled;
};

// ─── per-slice pop shared values ─────────────────────────────────────────────

function useSlicePopValues() {
  const pops: ReturnType<typeof useSharedValue<number>>[] = [];
  for (let i = 0; i < MAX_SLICES; i++) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    pops.push(useSharedValue(0));
  }
  return pops;
}

// ─── component ───────────────────────────────────────────────────────────────

export default function AnimatedPieChartGloopy({
  darkerOverlayBackgroundColor,
  primaryColor,
  welcomeTextStyle,
  subWelcomeTextStyle,
  primaryOverlayColor,
  data = [],
  radius = 100,
  duration = 500,
  showPercentages = false,
  showLabels = true,
  onSectionPress = null,
  labelsSize = 12,
}: {
  darkerOverlayBackgroundColor?: string;
  primaryColor?: string;
  welcomeTextStyle?: any;
  subWelcomeTextStyle?: any;
  primaryOverlayColor?: string;
  data?: any[];
  radius?: number;
  duration?: number;
  showPercentages?: boolean;
  showLabels?: boolean;
  onSectionPress?: ((id: any, name: any) => void) | null;
  labelsSize?: number;
}) {
  const source = getShader();
  const progress = useSharedValue(0);
  const total = data.reduce((sum, d) => sum + d.value, 0);

  // *** Matches original exactly ***
  const size = radius * 2 + POP_DISTANCE * 2;

  const [selectedId, setSelectedId] = useState<number | string | null>(null);
  const popValues = useSlicePopValues();

  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(1, { duration });
  }, [data]);

  // ── slice geometry ─────────────────────────────────────────────────────────

  const sliceGeo = useMemo(() => {
    if (!data.length || total === 0) return [];
    let cum = 0;
    return data.map((slice) => {
      const startDeg = cum;
      const spanDeg = (slice.value / total) * 360;
      cum += spanDeg;
      const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180;
      const midRad = toRad(startDeg + spanDeg / 2);

      const dotR = Math.max(
        radius * 0.55,
        radius * 0.45 + (spanDeg / 360) * radius * 0.55,
      );

      return {
        startRad: toRad(startDeg),
        endRad: toRad(cum),
        midRad,
        dotR,
        rgb: hexToRGB(slice.color),
        slice,
        pct: (slice.value / total) * 100,
      };
    });
  }, [data, total, radius]);

  const isAllSelected = selectedId === "all";
  const hasSelection = selectedId !== null;

  // ── animate pop ────────────────────────────────────────────────────────────

  useEffect(() => {
    const popConfig = {
      duration: POP_DURATION,
      easing: Easing.out(Easing.back(1.4)),
    };
    const returnConfig = {
      duration: POP_DURATION,
      easing: Easing.inOut(Easing.ease),
    };
    for (let i = 0; i < MAX_SLICES; i++) {
      if (i >= sliceGeo.length) {
        popValues[i].value = 0;
        continue;
      }
      const shouldPop =
        !isAllSelected && selectedId === sliceGeo[i].slice.user_category;
      popValues[i].value = withTiming(
        shouldPop ? 1 : 0,
        shouldPop ? popConfig : returnConfig,
      );
    }
  }, [selectedId, sliceGeo.length]);

  const handleSectionPress = useCallback(
    (categoryId: number | string, categoryName: string) => {
      if (categoryId === selectedId) {
        setSelectedId(null);
        onSectionPress?.(null, null);
      } else {
        setSelectedId(categoryId);
        onSectionPress?.(categoryId, categoryName);
      }
    },
    [selectedId, onSectionPress],
  );

  // ── uniforms ───────────────────────────────────────────────────────────────

  const uniforms = useDerivedValue(() => {
    const count = Math.min(sliceGeo.length, MAX_SLICES);
    const prog = progress.value;

    const cx = new Array(MAX_SLICES).fill(0);
    const cy = new Array(MAX_SLICES).fill(0);
    const cr = new Array(MAX_SLICES).fill(0);
    const cR = new Array(MAX_SLICES).fill(0);
    const cG = new Array(MAX_SLICES).fill(0);
    const cB = new Array(MAX_SLICES).fill(0);
    const pop = new Array(MAX_SLICES).fill(0);
    const dimmed = new Array(MAX_SLICES).fill(0);
    const angStart = new Array(MAX_SLICES).fill(0);
    const angEnd = new Array(MAX_SLICES).fill(0);

    const restOffset = radius * 0.15;

    for (let i = 0; i < count; i++) {
      const g = sliceGeo[i];
      const midAngle = g.midRad * prog;
      const popAmt = popValues[i].value;

      // POP_TRAVEL for actual animation distance (independent of container sizing)
      const dist = restOffset + POP_TRAVEL * popAmt;
      cx[i] = Math.cos(midAngle) * dist;
      cy[i] = Math.sin(midAngle) * dist;
      cr[i] = g.dotR;
      cR[i] = g.rgb[0];
      cG[i] = g.rgb[1];
      cB[i] = g.rgb[2];
      pop[i] = popAmt;

      angStart[i] = ((g.startRad % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      angEnd[i] = ((g.endRad % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

      const isSel = isAllSelected || selectedId === g.slice.user_category;
      dimmed[i] = hasSelection && !isSel ? 1 : 0;
    }

    return {
      u_resolution: [size, size] as [number, number],
      u_radius: radius,
      u_smoothK: radius * 0.08,
      u_count: count,
      u_cx: cx,
      u_cy: cy,
      u_cr: cr,
      u_cR: cR,
      u_cG: cG,
      u_cB: cB,
      u_pop: pop,
      u_dimmed: dimmed,
      u_angStart: angStart,
      u_angEnd: angEnd,
    };
  });

  // ── touch ──────────────────────────────────────────────────────────────────

  const handleCanvasPress = useCallback(
    (evt: { nativeEvent: { locationX: number; locationY: number } }) => {
      const px = evt.nativeEvent.locationX;
      const py = evt.nativeEvent.locationY;
      const cxc = size / 2;
      const cyc = size / 2;
      const dx = px - cxc;
      const dy = py - cyc;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 25) {
        handleSectionPress("all", "All");
        return;
      }
      if (dist > radius + POP_DISTANCE + 10) return;

      let angle = Math.atan2(dy, dx);
      angle = ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

      for (const g of sliceGeo) {
        const s =
          ((g.startRad % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        const e =
          ((g.endRad % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        const span =
          ((e - s) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        const rel =
          ((angle - s) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        if (rel <= span) {
          handleSectionPress(g.slice.user_category, g.slice.name);
          return;
        }
      }
    },
    [size, radius, sliceGeo, handleSectionPress],
  );

  // ── percentage overlay ─────────────────────────────────────────────────────

  const percentageOverlays = useMemo(() => {
    if (!showPercentages || !data.length || total === 0) return [];
    let cumAngle = 0;
    return data.map((slice) => {
      const startAngle = cumAngle;
      const angle = (slice.value / total) * 360;
      cumAngle += angle;
      const midAngle = startAngle + angle / 2;
      const pct = (slice.value / total) * 100;
      const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180;
      const distanceFactor = 0.68;
      const x =
        size / 2 + radius * distanceFactor * Math.cos(toRad(midAngle));
      const y =
        size / 2 + radius * distanceFactor * Math.sin(toRad(midAngle));
      return { x, y, pct, slice };
    });
  }, [data, total, radius, size, showPercentages]);

  const sortedCallouts = useMemo(() => {
    if (!data.length || total === 0) return [];
    return [...data]
      .map((slice) => ({ slice, pct: (slice.value / total) * 100 }))
      .sort((a, b) => b.pct - a.pct);
  }, [data, total]);

  if (!source) return null;

  // ── render — layout matches original exactly ──────────────────────────────

  return (
    <View style={styles.outerContainer}>
      <View style={[styles.pieContainer, { width: size, height: size }]}>
        <Canvas style={{ width: size, height: size }}>
          <Rect x={0} y={0} width={size} height={size}>
            <Shader source={source} uniforms={uniforms} />
          </Rect>
        </Canvas>

        <Pressable
          onPress={handleCanvasPress}
          style={[StyleSheet.absoluteFill, { zIndex: 10 }]}
        />

        {showPercentages &&
          !isAllSelected &&
          percentageOverlays.map((item, i) => {
            if (selectedId !== item.slice.user_category) return null;
            return (
              <Pressable
                key={`pct-${i}`}
                onPress={() =>
                  handleSectionPress(
                    item.slice.user_category,
                    item.slice.name,
                  )
                }
                style={{
                  position: "absolute",
                  top: item.y - 25,
                  left: item.x - 30,
                  minWidth: 60,
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 15,
                }}
              >
                <Text
                  style={[
                    welcomeTextStyle,
                    {
                      backgroundColor: darkerOverlayBackgroundColor,
                      paddingHorizontal: 10,
                      paddingVertical: 10,
                      borderRadius: 20,
                      fontSize: MAX_FONT_SIZE,
                      color: primaryColor,
                    },
                  ]}
                >
                  {`${Math.round(item.pct)}%`}
                </Text>
              </Pressable>
            );
          })}

        <Pressable
          onPress={() => handleSectionPress("all", "All")}
          style={[
            styles.centerButton,
            {
              top: size / 2 - 30,
              left: size / 2 - 30,
              backgroundColor: isAllSelected
                ? `${primaryOverlayColor}FF`
                : primaryOverlayColor,
              borderWidth: isAllSelected ? 2 : 0,
              borderColor: primaryColor,
            },
          ]}
        />
      </View>

      {showLabels && (
        <ScrollView
          fadingEdgeLength={4}
          style={[styles.legendScroll, { maxHeight: size }]}
          contentContainerStyle={styles.legendContent}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        >
          {sortedCallouts.map((item, i) => {
            const isSelected =
              selectedId === item.slice.user_category || isAllSelected;
            const isDimmed = hasSelection && !isSelected;
            const dotSize = getDotSize(item.pct);

            return (
              <Pressable
                key={`label-${item.slice.user_category || i}`}
                onPress={() =>
                  handleSectionPress(
                    item.slice.user_category,
                    item.slice.name,
                  )
                }
                style={[
                  styles.legendRow,
                  {
                    backgroundColor: isSelected
                      ? `${primaryOverlayColor}FF`
                      : "transparent",
                    opacity: isDimmed ? 0.3 : 1,
                    borderWidth: isSelected ? 1 : 0,
                    borderColor: isSelected
                      ? item.slice.color
                      : "transparent",
                  },
                ]}
              >
                <View style={styles.dotContainer}>
                  <View
                    style={{
                      width: dotSize,
                      height: dotSize,
                      borderRadius: dotSize / 2,
                      backgroundColor: item.slice.color,
                    }}
                  />
                </View>
                <Text
                  style={[
                    subWelcomeTextStyle,
                    { fontSize: LABEL_FONT_SIZE, color: primaryColor },
                  ]}
                  numberOfLines={1}
                >
                  {item.slice.name}
                </Text>
                {showPercentages && (
                  <Text
                    style={[
                      subWelcomeTextStyle,
                      {
                        fontSize: LABEL_FONT_SIZE - 1,
                        color: primaryColor,
                        opacity: 0.5,
                      },
                    ]}
                  >
                    {`${Math.round(item.pct)}%`}
                  </Text>
                )}
              </Pressable>
            );
          })}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );
}

// ─── styles — matches original exactly ───────────────────────────────────────

const styles = StyleSheet.create({
  outerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  pieContainer: {
    flexShrink: 0,
  },
  dotContainer: {
    width: 18,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  centerButton: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },
  legendScroll: {
    flex: 1,
  },
  legendContent: {
    gap: 4,
    paddingVertical: 4,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
});






















// // AnimatedPieChartGloopy.tsx
// //
// // Spinner-inspired pie chart. Each category = a dot.
// // At rest: all dots at center → smoothMin merges into one smooth blob.
// // No slice lines. Colours blend smoothly via exponential proximity weighting.
// // When selected: that dot pulls away with gloopy bridge.
// // Base blob shrinks via animated clip radius (area-proportional).
// //
// // Container sizing matches the original AnimatedPieChartWithCallouts exactly.

// import React, { useEffect, useMemo, useState, useCallback } from "react";
// import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
// import {
//   Canvas,
//   Rect,
//   Shader,
//   Skia,
// } from "@shopify/react-native-skia";
// import {
//   useSharedValue,
//   useDerivedValue,
//   withTiming,
//   Easing,
// } from "react-native-reanimated";

// // ─── constants ───────────────────────────────────────────────────────────────

// const MAX_SLICES = 20;
// const POP_DISTANCE = 12;
// const POP_DURATION = 350;
// const LABEL_FONT_SIZE = 12;
// const MAX_FONT_SIZE = 34;

// const getDotSize = (pct: number) =>
//   Math.max(6, Math.min(18, 6 + (pct / 100) * 24));

// const hexToRGB = (hex: string): [number, number, number] => {
//   const h = hex.replace("#", "");
//   return [
//     parseInt(h.substring(0, 2), 16) / 255,
//     parseInt(h.substring(2, 4), 16) / 255,
//     parseInt(h.substring(4, 6), 16) / 255,
//   ];
// };

// // ─── SKSL shader ─────────────────────────────────────────────────────────────
// //
// // Per-dot circles, all smoothMin'd. No angular Voronoi — colours blend
// // naturally via exponential proximity weighting (like the spinner).
// // Base blob clipped to u_clipR which shrinks when a dot pops.
// // Popping dot is NOT clipped — it escapes with a gloopy bridge.

// const shaderSource = `
// uniform vec2  u_resolution;
// uniform float u_smoothK;

// uniform float u_count;
// uniform float u_cx[${MAX_SLICES}];
// uniform float u_cy[${MAX_SLICES}];
// uniform float u_cr[${MAX_SLICES}];
// uniform float u_cR[${MAX_SLICES}];
// uniform float u_cG[${MAX_SLICES}];
// uniform float u_cB[${MAX_SLICES}];
// uniform float u_pop[${MAX_SLICES}];
// uniform float u_dimmed[${MAX_SLICES}];

// float smin(float a, float b, float k) {
//   float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
//   return mix(b, a, h) - k * h * (1.0 - h);
// }

// half4 main(vec2 fragCoord) {
//   vec2 center = 0.5 * u_resolution;
//   vec2 uv = fragCoord - center;
//   int count = int(u_count);
//   float k = u_smoothK;

//   float bbox = 250.0;
//   if (abs(uv.x) > bbox || abs(uv.y) > bbox) return vec4(0.0);

//   // all dots, smoothMin'd together — this IS the shape
//   float dists[${MAX_SLICES}];
//   float merged = 1e5;
//   for (int i = 0; i < ${MAX_SLICES}; i++) {
//     if (i >= count) break;
//     dists[i] = length(uv - vec2(u_cx[i], u_cy[i])) - u_cr[i];
//     merged = smin(merged, dists[i], k);
//   }

//   float mask = smoothstep(0.0, -1.5, merged);
//   if (mask < 0.001) return vec4(0.0);

//   // colour: exponential proximity blend
//   float colK = k * 1.5;
//   vec3 col = vec3(0.0);
//   float totalW = 0.0;

//   for (int i = 0; i < ${MAX_SLICES}; i++) {
//     if (i >= count) break;
//     float w = exp(-max(dists[i] - merged, 0.0) / max(colK, 0.001));
//     vec3 c = vec3(u_cR[i], u_cG[i], u_cB[i]);
//     if (u_dimmed[i] > 0.5) c *= 0.25;
//     col += c * w;
//     totalW += w;
//   }
//   col /= max(totalW, 0.001);

//   return vec4(col * mask, mask);
// }
// `;

// // ─── compile once ────────────────────────────────────────────────────────────

// let _compiled: ReturnType<typeof Skia.RuntimeEffect.Make> | null = null;
// const getShader = () => {
//   if (!_compiled) {
//     _compiled = Skia.RuntimeEffect.Make(shaderSource);
//     if (!_compiled) console.error("❌ Gloopy pie shader failed to compile");
//   }
//   return _compiled;
// };

// // ─── per-slice pop shared values ─────────────────────────────────────────────

// function useSlicePopValues() {
//   const pops: ReturnType<typeof useSharedValue<number>>[] = [];
//   for (let i = 0; i < MAX_SLICES; i++) {
//     // eslint-disable-next-line react-hooks/rules-of-hooks
//     pops.push(useSharedValue(0));
//   }
//   return pops;
// }

// // ─── component ───────────────────────────────────────────────────────────────

// export default function AnimatedPieChartGloopy({
//   darkerOverlayBackgroundColor,
//   primaryColor,
//   welcomeTextStyle,
//   subWelcomeTextStyle,
//   primaryOverlayColor,
//   data = [],
//   radius = 100,
//   duration = 500,
//   showPercentages = false,
//   showLabels = true,
//   onSectionPress = null,
//   labelsSize = 12,
// }: {
//   darkerOverlayBackgroundColor?: string;
//   primaryColor?: string;
//   welcomeTextStyle?: any;
//   subWelcomeTextStyle?: any;
//   primaryOverlayColor?: string;
//   data?: any[];
//   radius?: number;
//   duration?: number;
//   showPercentages?: boolean;
//   showLabels?: boolean;
//   onSectionPress?: ((id: any, name: any) => void) | null;
//   labelsSize?: number;
// }) {
//   const source = getShader();
//   const progress = useSharedValue(0);
//   const total = data.reduce((sum, d) => sum + d.value, 0);
//   const size = radius * 2 + POP_DISTANCE * 2;
//   const [selectedId, setSelectedId] = useState<number | string | null>(null);
//   const popValues = useSlicePopValues();

//   useEffect(() => {
//     progress.value = 0;
//     progress.value = withTiming(1, { duration });
//   }, [data]);

//   // ── slice geometry ─────────────────────────────────────────────────────────

//   const sliceGeo = useMemo(() => {
//     if (!data.length || total === 0) return [];
//     let cum = 0;
//     return data.map((slice) => {
//       const startDeg = cum;
//       const spanDeg = (slice.value / total) * 360;
//       cum += spanDeg;
//       const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180;
//       const midRad = toRad(startDeg + spanDeg / 2);
//       const pct = (slice.value / total) * 100;

//       // Dot radius = its percentage of the pie radius
//       // A 60% slice has dotR = 0.6 * radius
//       // When all stacked at center, the biggest dot defines the blob size
//       // When it leaves, the blob shrinks to the next biggest
//       const dotR = radius * (pct / 100);

//       return {
//         startRad: toRad(startDeg),
//         endRad: toRad(cum),
//         midRad,
//         dotR,
//         rgb: hexToRGB(slice.color),
//         slice,
//         pct,
//       };
//     });
//   }, [data, total, radius]);

//   const isAllSelected = selectedId === "all";
//   const hasSelection = selectedId !== null;

//   // ── animate pop ────────────────────────────────────────────────────────────

//   useEffect(() => {
//     const popConfig = {
//       duration: POP_DURATION,
//       easing: Easing.out(Easing.back(1.4)),
//     };
//     const returnConfig = {
//       duration: POP_DURATION,
//       easing: Easing.inOut(Easing.ease),
//     };
//     for (let i = 0; i < MAX_SLICES; i++) {
//       if (i >= sliceGeo.length) {
//         popValues[i].value = 0;
//         continue;
//       }
//       const shouldPop =
//         !isAllSelected && selectedId === sliceGeo[i].slice.user_category;
//       popValues[i].value = withTiming(
//         shouldPop ? 1 : 0,
//         shouldPop ? popConfig : returnConfig,
//       );
//     }
//   }, [selectedId, sliceGeo.length]);

//   // ── two-step selection ─────────────────────────────────────────────────────

//   const pendingSelectionRef = React.useRef<{
//     id: number | string;
//     name: string;
//   } | null>(null);

//   const handleSectionPress = useCallback(
//     (categoryId: number | string, categoryName: string) => {
//       if (categoryId === selectedId) {
//         pendingSelectionRef.current = null;
//         setSelectedId(null);
//         onSectionPress?.(null, null);
//       } else if (selectedId !== null && selectedId !== "all") {
//         pendingSelectionRef.current = { id: categoryId, name: categoryName };
//         setSelectedId(null);
//         onSectionPress?.(null, null);
//         setTimeout(() => {
//           const pending = pendingSelectionRef.current;
//           if (pending) {
//             pendingSelectionRef.current = null;
//             setSelectedId(pending.id);
//             onSectionPress?.(pending.id, pending.name);
//           }
//         }, POP_DURATION + 30);
//       } else {
//         pendingSelectionRef.current = null;
//         setSelectedId(categoryId);
//         onSectionPress?.(categoryId, categoryName);
//       }
//     },
//     [selectedId, onSectionPress],
//   );

//   // ── uniforms ───────────────────────────────────────────────────────────────

//   const uniforms = useDerivedValue(() => {
//     const count = Math.min(sliceGeo.length, MAX_SLICES);
//     const prog = progress.value;

//     const cx = new Array(MAX_SLICES).fill(0);
//     const cy = new Array(MAX_SLICES).fill(0);
//     const cr = new Array(MAX_SLICES).fill(0);
//     const cR = new Array(MAX_SLICES).fill(0);
//     const cG = new Array(MAX_SLICES).fill(0);
//     const cB = new Array(MAX_SLICES).fill(0);
//     const pop = new Array(MAX_SLICES).fill(0);
//     const dimmed = new Array(MAX_SLICES).fill(0);

//     // First find which dot is popping and by how much
//     let poppingIdx = -1;
//     let poppingAmt = 0;
//     let poppingPct = 0;
//     for (let i = 0; i < count; i++) {
//       const pv = popValues[i].value;
//       if (pv > 0.01) {
//         poppingIdx = i;
//         poppingAmt = pv;
//         poppingPct = sliceGeo[i].pct;
//         break;
//       }
//     }

//     // When a dot with X% is popping out, the center blob should be
//     // (100 - X)% of the original size. Scale ALL remaining dots' radii
//     // so the biggest remaining dot = radius * (100 - X*popAmt) / 100
//     const shrinkScale = 1 - (poppingPct / 100) * poppingAmt;

//     for (let i = 0; i < count; i++) {
//       const g = sliceGeo[i];
//       const midAngle = g.midRad * prog;
//       const popAmt = popValues[i].value;

//       if (popAmt > 0.01) {
//         // This dot is popping out
//         const remainingBlobR = radius * (1 - g.pct / 100);
//         const travelDist = remainingBlobR + g.dotR + radius * 0.08;
//         const dist = travelDist * popAmt;
//         cx[i] = Math.cos(midAngle) * dist;
//         cy[i] = Math.sin(midAngle) * dist;
//         // Keep its own size
//         cr[i] = g.dotR;
//       } else {
//         // At center — scale down as the popping dot leaves
//         cx[i] = 0;
//         cy[i] = 0;
//         cr[i] = g.dotR * shrinkScale;
//       }
//       cR[i] = g.rgb[0];
//       cG[i] = g.rgb[1];
//       cB[i] = g.rgb[2];
//       pop[i] = popAmt;

//       const isSel = isAllSelected || selectedId === g.slice.user_category;
//       dimmed[i] = hasSelection && !isSel ? 1 : 0;
//     }

//     return {
//       u_resolution: [size, size] as [number, number],
//       u_smoothK: radius * 0.045,
//       u_count: count,
//       u_cx: cx,
//       u_cy: cy,
//       u_cr: cr,
//       u_cR: cR,
//       u_cG: cG,
//       u_cB: cB,
//       u_pop: pop,
//       u_dimmed: dimmed,
//     };
//   });

//   // ── touch ──────────────────────────────────────────────────────────────────

//   const handleCanvasPress = useCallback(
//     (evt: { nativeEvent: { locationX: number; locationY: number } }) => {
//       const px = evt.nativeEvent.locationX;
//       const py = evt.nativeEvent.locationY;
//       const cxc = size / 2;
//       const cyc = size / 2;
//       const dx = px - cxc;
//       const dy = py - cyc;
//       const dist = Math.sqrt(dx * dx + dy * dy);

//       if (dist < 25) {
//         handleSectionPress("all", "All");
//         return;
//       }
//       if (dist > radius + POP_DISTANCE + 10) return;

//       let angle = Math.atan2(dy, dx);
//       angle = ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

//       for (const g of sliceGeo) {
//         const s =
//           ((g.startRad % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
//         const e =
//           ((g.endRad % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
//         const span =
//           ((e - s) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
//         const rel =
//           ((angle - s) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
//         if (rel <= span) {
//           handleSectionPress(g.slice.user_category, g.slice.name);
//           return;
//         }
//       }
//     },
//     [size, radius, sliceGeo, handleSectionPress],
//   );

//   // ── percentage overlay ─────────────────────────────────────────────────────

//   const percentageOverlays = useMemo(() => {
//     if (!showPercentages || !data.length || total === 0) return [];
//     let cumAngle = 0;
//     return data.map((slice) => {
//       const startAngle = cumAngle;
//       const angle = (slice.value / total) * 360;
//       cumAngle += angle;
//       const midAngle = startAngle + angle / 2;
//       const pct = (slice.value / total) * 100;
//       const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180;
//       const distanceFactor = 0.68;
//       const x =
//         size / 2 + radius * distanceFactor * Math.cos(toRad(midAngle));
//       const y =
//         size / 2 + radius * distanceFactor * Math.sin(toRad(midAngle));
//       return { x, y, pct, slice };
//     });
//   }, [data, total, radius, size, showPercentages]);

//   const sortedCallouts = useMemo(() => {
//     if (!data.length || total === 0) return [];
//     return [...data]
//       .map((slice) => ({ slice, pct: (slice.value / total) * 100 }))
//       .sort((a, b) => b.pct - a.pct);
//   }, [data, total]);

//   if (!source) return null;

//   return (
//     <View style={styles.outerContainer}>
//       <View style={[styles.pieContainer, { width: size, height: size }]}>
//         <Canvas style={{ width: size, height: size }}>
//           <Rect x={0} y={0} width={size} height={size}>
//             <Shader source={source} uniforms={uniforms} />
//           </Rect>
//         </Canvas>

//         <Pressable
//           onPress={handleCanvasPress}
//           style={[StyleSheet.absoluteFill, { zIndex: 10 }]}
//         />

//         {showPercentages &&
//           !isAllSelected &&
//           percentageOverlays.map((item, i) => {
//             if (selectedId !== item.slice.user_category) return null;
//             return (
//               <Pressable
//                 key={`pct-${i}`}
//                 onPress={() =>
//                   handleSectionPress(
//                     item.slice.user_category,
//                     item.slice.name,
//                   )
//                 }
//                 style={{
//                   position: "absolute",
//                   top: item.y - 25,
//                   left: item.x - 30,
//                   minWidth: 60,
//                   alignItems: "center",
//                   justifyContent: "center",
//                   zIndex: 15,
//                 }}
//               >
//                 <Text
//                   style={[
//                     welcomeTextStyle,
//                     {
//                       backgroundColor: darkerOverlayBackgroundColor,
//                       paddingHorizontal: 10,
//                       paddingVertical: 10,
//                       borderRadius: 20,
//                       fontSize: MAX_FONT_SIZE,
//                       color: primaryColor,
//                     },
//                   ]}
//                 >
//                   {`${Math.round(item.pct)}%`}
//                 </Text>
//               </Pressable>
//             );
//           })}

//         <Pressable
//           onPress={() => handleSectionPress("all", "All")}
//           style={[
//             styles.centerButton,
//             {
//               top: size / 2 - 30,
//               left: size / 2 - 30,
//               backgroundColor: isAllSelected
//                 ? `${primaryOverlayColor}FF`
//                 : primaryOverlayColor,
//               borderWidth: isAllSelected ? 2 : 0,
//               borderColor: primaryColor,
//             },
//           ]}
//         />
//       </View>

//       {showLabels && (
//         <ScrollView
//           fadingEdgeLength={4}
//           style={[styles.legendScroll, { maxHeight: size }]}
//           contentContainerStyle={styles.legendContent}
//           showsVerticalScrollIndicator={false}
//           nestedScrollEnabled
//         >
//           {sortedCallouts.map((item, i) => {
//             const isSelected =
//               selectedId === item.slice.user_category || isAllSelected;
//             const isDimmed = hasSelection && !isSelected;
//             const dotSize = getDotSize(item.pct);

//             return (
//               <Pressable
//                 key={`label-${item.slice.user_category || i}`}
//                 onPress={() =>
//                   handleSectionPress(
//                     item.slice.user_category,
//                     item.slice.name,
//                   )
//                 }
//                 style={[
//                   styles.legendRow,
//                   {
//                     backgroundColor: isSelected
//                       ? `${primaryOverlayColor}FF`
//                       : "transparent",
//                     opacity: isDimmed ? 0.3 : 1,
//                     borderWidth: isSelected ? 1 : 0,
//                     borderColor: isSelected
//                       ? item.slice.color
//                       : "transparent",
//                   },
//                 ]}
//               >
//                 <View style={styles.dotContainer}>
//                   <View
//                     style={{
//                       width: dotSize,
//                       height: dotSize,
//                       borderRadius: dotSize / 2,
//                       backgroundColor: item.slice.color,
//                     }}
//                   />
//                 </View>
//                 <Text
//                   style={[
//                     subWelcomeTextStyle,
//                     { fontSize: LABEL_FONT_SIZE, color: primaryColor },
//                   ]}
//                   numberOfLines={1}
//                 >
//                   {item.slice.name}
//                 </Text>
//                 {showPercentages && (
//                   <Text
//                     style={[
//                       subWelcomeTextStyle,
//                       {
//                         fontSize: LABEL_FONT_SIZE - 1,
//                         color: primaryColor,
//                         opacity: 0.5,
//                       },
//                     ]}
//                   >
//                     {`${Math.round(item.pct)}%`}
//                   </Text>
//                 )}
//               </Pressable>
//             );
//           })}
//           <View style={{ height: 40 }} />
//         </ScrollView>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   outerContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 12,
//   },
//   pieContainer: {
//     flexShrink: 0,
//   },
//   dotContainer: {
//     width: 18,
//     alignItems: "flex-start",
//     justifyContent: "center",
//   },
//   centerButton: {
//     position: "absolute",
//     width: 60,
//     height: 60,
//     borderRadius: 999,
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 20,
//   },
//   legendScroll: {
//     flex: 1,
//   },
//   legendContent: {
//     gap: 4,
//     paddingVertical: 4,
//   },
//   legendRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     paddingHorizontal: 8,
//     paddingVertical: 6,
//     borderRadius: 8,
//   },
// });