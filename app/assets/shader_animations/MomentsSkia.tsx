// import { View, StyleSheet } from "react-native";
// import React, {
//   useEffect,
//   useRef,
//   useCallback,
//   useState,
//   useMemo,
// } from "react";
// import Soul from "./soulClass";
// import SleepWalk0 from "./sleepWalkOneClass";
// import Mover from "./leadPointClass";
// import Gecko from "./geckoClass";
// import Moments from "./momentsClass";
// import { packGeckoOnly, packGeckoOnlyProd } from "./animUtils";
// import PawSetter from "@/app/screens/fidget/PawSetter";
// import { MOMENTS_BG_SKSL_OPT } from "./shaderCode/momentsLGShaderOpt";
// import { GECKO_ONLY_TRANSPARENT_SKSL_OPT } from "./shaderCode/geckoMomentsLGShaderOpt";

// import { BackHandler } from "react-native";
// import { useFocusEffect } from "@react-navigation/native";
// import MomentDotsResetterMini from "./MomentDotsResetterMini";
// import {
//   runOnJS,
//   useSharedValue,
//   useDerivedValue,
// } from "react-native-reanimated";

// import { useWindowDimensions } from "react-native";
// import {
//   hexToVec3,
//   toShaderModel_inPlace,
//   toShaderSpace_inplace,
//   toGeckoSpace_inPlace,
//   toGeckoPointerScaled_inPlace,
//   packVec2Uniform_withRecenter_moments,
// } from "./animUtils";
// import { Gesture, GestureDetector } from "react-native-gesture-handler";
// import {
//   Canvas,
//   useCanvasSize,
//   Shader,
//   Rect,
//   Skia,
// } from "@shopify/react-native-skia";

//   let lastTime = global.performance.now();

// export function beginFrameProfile() {
//   const now = global.performance.now();
//   const delta = now - lastTime;
//   lastTime = now;

//   if (delta > 18) {
//     console.log("⚠️ Frame over budget:", delta.toFixed(2), "ms");
//   }
// }

// let last = global.performance?.now?.() ?? Date.now();
// let worst = 0;
// let over = 0;
// let frames = 0;
// let lastReport = last;

// export function frameBudgetMonitor() {
//   const now = global.performance?.now?.() ?? Date.now();
//   const dt = now - last;
//   last = now;

//   frames++;
//   if (dt > worst) worst = dt;
//   if (dt > 18) over++;

//   if (now - lastReport >= 1000) {
//     console.log(
//       `FPS≈${frames}  over18ms=${over}  worst=${worst.toFixed(1)}ms`
//     );
//     frames = 0;
//     over = 0;
//     worst = 0;
//     lastReport = now;
//   }
// }

// type Props = {
//   color1: string;
//   color2: string;
//   bckgColor1: string;
//   bckgColor2: string;
//   momentsData: [];
//   startingCoord: number[];
//   restPoint: number[];
//   scale: number;
//   reset?: number | null;
// };

// const MomentsSkia = ({
//   handleEditMoment,
//   handleUpdateMomentCoords,
//   handleGetMoment,
//   color1,
//   color2,
//   bckgColor1,
//   bckgColor2,
//   momentsData = [],
//   startingCoord,
//   restPoint,
//   scale = 1,
//   gecko_scale = 1,
//   gecko_size = 1.2,
//   lightDarkTheme,
//   handleRescatterMoments,
//   handleToggleManual,
//   handleRecenterMoments,
//   manualOnly,
//   speedSetting,
//   autoPickUp,
//   randomMomentIds,
//   reset = 0,
// }: Props) => {
//   const { width, height } = useWindowDimensions();
//   const { ref, size } = useCanvasSize();

//   const [aspect, setAspect] = useState<number>(width / height);

//   useEffect(() => {
//     if (size && size.width > 0 && size.height > 0) {
//       const newAspect = size.width / size.height;
//       setAspect(newAspect);
//     }
//   }, [size]);

//   const updateTrigger = useSharedValue(0);
//   const lastRenderRef = useRef(0);
//   const isPausedRef = useRef(false);

//   const TOTAL_GECKO_POINTS = 71;
//   const MAX_MOMENTS = 40;
//   const MAX_HELD = 4;

//   // ============== TRULY PREALLOCATED BUFFERS ==============
//   // These are reused every frame - NO allocations in animate()
//   const workingBuffers = useRef({
//     soul: new Float32Array(2),
//     walk: new Float32Array(2),
//     hint: new Float32Array(2),
//     lead: new Float32Array(2),
//     selected: new Float32Array(2),
//     lastSelected: new Float32Array(2),
//     heldCoords: new Float32Array(MAX_HELD * 2),
//     heldTemp: new Float32Array(2),
//     geckoPoints: new Array(TOTAL_GECKO_POINTS * 2).fill(0),
//     moments: new Array(MAX_MOMENTS * 2).fill(0),
//     stepTargets: [null, null, null, null], // <-- ADD THIS
//   }).current;
//   // Shared values - these will receive NEW arrays only when we update them
//   const leadUniformSV = useSharedValue<number[]>([0, 0]);
//   const soulUniformSV = useSharedValue<number[]>([0, 0]);
//   const walk0UniformSV = useSharedValue<number[]>([0, 0]);
//   const selectedUniformSV = useSharedValue<number[]>([0, 0]);
//   const lastSelectedUniformSV = useSharedValue<number[]>([0, 0]);
//   const hintUniformSV = useSharedValue<number[]>([0, 0]);
//   const momentsUniformSV = useSharedValue<number[]>(
//     Array(MAX_MOMENTS * 2).fill(0),
//   );
//   const heldMomentUniformSV = useSharedValue<number[]>(
//     Array(MAX_HELD * 2).fill(0),
//   );
//   const geckoPointsUniformSV = useSharedValue<number[]>(
//     Array(TOTAL_GECKO_POINTS * 2).fill(0),
//   );
//   const momentsLengthSV = useSharedValue(0);

//   useFocusEffect(
//     useCallback(() => {
//       isPausedRef.current = false;
//       updateTrigger.value += 1;
//       return () => {
//         isPausedRef.current = true;
//         isDragging.value = false;
//       };
//     }, []),
//   );

//   useFocusEffect(
//     useCallback(() => {
//       const subscription = BackHandler.addEventListener(
//         "hardwareBackPress",
//         () => true,
//       );
//       return () => subscription.remove();
//     }, []),
//   );

//   const handleUpdateMomentsState = () => {
//     const newMoments = moments.current.moments;
//     handleUpdateCoords(momentsData, newMoments);
//   };

//   const handleUpdateCoords = (oldMoments, newMoments) => {
//     const formattedData = newMoments.map((moment) => ({
//       id: moment.id,
//       screen_x: moment.coord[0],
//       screen_y: moment.coord[1],
//       stored_index: moment.stored_index,
//     }));
//     handleUpdateMomentCoords(formattedData);
//   };

//   const userPointSV = useSharedValue(restPoint);
//   const userPoint_geckoSpaceRef = useRef<[number, number]>([0, 0]);
//   const isDragging = useSharedValue(false);

//   const onDoublePress = () => {
//     handleGetMoment(-1);
//     console.log("double press");
//   };

//   const wasTapSV = useSharedValue(false);
//   const wasDoubleTapSV = useSharedValue(false);

//   const panGesture = Gesture.Pan()
//     .onTouchesDown((e) => {
//       isDragging.value = true;
//       const touch = e.changedTouches[0];
//       userPointSV.value = [touch.x / size.width, touch.y / size.height];
//     })
//     .onUpdate((e) => {
//       userPointSV.value = [e.x / size.width, e.y / size.height];
//     })
//     .onEnd(() => {
//       isDragging.value = false;
//     })
//     .onFinalize(() => {
//       isDragging.value = false;
//     });

//   const singleTapGesture = Gesture.Tap()
//     .numberOfTaps(1)
//     .onEnd((_event, success) => {
//       if (success) {
//         wasTapSV.value = true;
//         setTimeout(() => {
//           wasTapSV.value = false;
//         }, 100);
//       }
//     });

//   const doubleTapGesture = Gesture.Tap()
//     .numberOfTaps(2)
//     .onEnd((_event, success) => {
//       if (success) {
//         wasDoubleTapSV.value = true;
//         runOnJS(onDoublePress)();
//         setTimeout(() => {
//           wasDoubleTapSV.value = false;
//         }, 100);
//       }
//     });

//   const taps = Gesture.Exclusive(doubleTapGesture, singleTapGesture);
//   const composedGesture = Gesture.Simultaneous(panGesture, taps);

//   const color1Converted = hexToVec3(color1);
//   const color2Converted = hexToVec3(color2);
//   const bckgColor1Converted = hexToVec3(bckgColor1);
//   const bckgColor2Converted = hexToVec3(bckgColor2);

//   const soul = useRef(new Soul(restPoint, 0.02));
//   const leadPoint = useRef(new Mover(startingCoord));
//   const gecko = useRef(new Gecko(startingCoord, 0.06));
//   const sleepWalk0 = useRef(
//     new SleepWalk0(
//       [0.5, 0.3],
//       0.3,
//       gecko_size,
//       manualOnly,
//       speedSetting,
//       autoPickUp,
//       randomMomentIds,
//     ),
//   );
//   const moments = useRef(
//     new Moments(momentsData, gecko_size, sleepWalk0, [0.5, 0.5], 0.05),
//   );

//   const handleGetMomentRef = useRef(handleGetMoment);

//   useEffect(() => {
//     handleGetMomentRef.current = handleGetMoment;
//   }, [handleGetMoment]);

//   useEffect(() => {
//     if (aspect) {
//       moments.current.setAspect(aspect);
//       sleepWalk0.current.setAspect(aspect);
//     }
//   }, [aspect]);

//   const SHARED_SKSL_PRELUDE = (c1, c2, b1, b2) => `
//     vec3 startColor = vec3(${c1});
//     vec3 endColor = vec3(${c2});
//     vec3 backgroundStartColor = vec3(${b1});
//     vec3 backgroundEndColor = vec3(${b2});
//   `;

//   const [geckoColor, setGeckoColor] = useState(color2Converted);

//   const source = useMemo(() => {
//     return Skia.RuntimeEffect.Make(`
//       ${SHARED_SKSL_PRELUDE(color1Converted, geckoColor, bckgColor1Converted, bckgColor2Converted)}
//       ${GECKO_ONLY_TRANSPARENT_SKSL_OPT}
//     `);
//   }, [color1Converted, geckoColor, bckgColor1Converted, bckgColor2Converted]);

//   const sourceTwo = useMemo(() => {
//     return Skia.RuntimeEffect.Make(`
//       ${SHARED_SKSL_PRELUDE(color1Converted, color2Converted, bckgColor1Converted, bckgColor2Converted)}
//       ${MOMENTS_BG_SKSL_OPT}
//     `);
//   }, [
//     color1Converted,
//     color2Converted,
//     bckgColor1Converted,
//     bckgColor2Converted,
//   ]);

//   if (!source) {
//     console.error("❌ Shader failed to compile");
//     return null;
//   }

//   const start = useRef(Date.now());
//   const hintRef = useRef([0, 0]);

//   const [internalReset, setInternalReset] = useState(0);
//   const handleReset = () => setInternalReset(Date.now());

//   useEffect(() => {
//     console.log("resetting");
//     moments.current.updateOrAddMoments(momentsData);
//     moments.current.updateAllCoords(momentsData);
//   }, [momentsData, reset]);

//   useEffect(() => {
//     if (!internalReset || !reset) {
//       console.log("conditions not met for a reset");
//       return;
//     } else {
//       console.log("TRUE RESET");
//     }

//     start.current = Date.now();
//     soul.current = new Soul(restPoint, 0.02);
//     leadPoint.current = new Mover(startingCoord);
//     gecko.current = new Gecko(startingCoord, 0.06);

//     // Reset buffers
//     workingBuffers.soul.fill(0);
//     workingBuffers.walk.fill(0);
//     workingBuffers.hint.fill(0);
//     workingBuffers.lead.fill(0);
//     workingBuffers.selected.fill(0);
//     workingBuffers.lastSelected.fill(0);
//     workingBuffers.heldCoords.fill(0);
//     workingBuffers.geckoPoints.fill(0);
//     workingBuffers.moments.fill(0);

//     leadUniformSV.value = [0, 0];
//     soulUniformSV.value = [0, 0];
//     walk0UniformSV.value = [0, 0];
//     selectedUniformSV.value = [0, 0];
//     lastSelectedUniformSV.value = [0, 0];
//     hintUniformSV.value = [0, 0];
//     momentsUniformSV.value = Array(MAX_MOMENTS * 2).fill(0);
//     heldMomentUniformSV.value = Array(MAX_HELD * 2).fill(0);
//     geckoPointsUniformSV.value = Array(TOTAL_GECKO_POINTS * 2).fill(0);
//     momentsLengthSV.value = 0;

//     userPointSV.value = restPoint;
//     userPoint_geckoSpaceRef.current[0] = startingCoord[0];
//     userPoint_geckoSpaceRef.current[1] = startingCoord[1];
//   }, [reset, internalReset]);

//   const frameCountRef = useRef(0);
//   const lastTriggeredIdRef = useRef(-1);
//   const lastPawsClearedRef = useRef(false);
//   const clearAllPawsInUIRef = useRef(() => {});
//   const syncPawsInUIRef = useRef<() => void>(() => {});

//   useEffect(() => {
//     let cancelled = false;
//     let frame;
//     const sleepWalkAfter = 100;

//     frameCountRef.current = 0;

//     const animate = () => {
//       if (cancelled || isPausedRef.current) {
//         frame = requestAnimationFrame(animate);
//         return;
//       }

//       if (aspect == null || isNaN(aspect)) {
//         console.log("aspect is null or NaN! QUITTING the animation", aspect);
//         frame = requestAnimationFrame(animate);
//         return;
//       }
// frameBudgetMonitor();
//       const shouldClearPaws = moments.current.trigger_remote;
//       if (shouldClearPaws && !lastPawsClearedRef.current) {
//         lastPawsClearedRef.current = true;
//         clearAllPawsInUIRef.current();
//       } else if (!shouldClearPaws && lastPawsClearedRef.current) {
//         lastPawsClearedRef.current = false;
//       }

//       const currentId = moments.current.lastSelected?.id ?? -1;
//       if (currentId !== -1 && currentId !== lastTriggeredIdRef.current) {
//         lastTriggeredIdRef.current = currentId;
//         handleGetMomentRef.current(currentId);
//       }

//       if (leadPoint.current.isMoving && !gecko.current.sleepWalkMode) {
//         frameCountRef.current = 0;
//       }

//       if (isDragging.value && gecko.current.sleepWalkMode) {
//         frameCountRef.current = 0;
//         gecko.current.updateSleepWalkMode(false);
//       }

//       if (frameCountRef.current < sleepWalkAfter) {
//         frameCountRef.current += 1;
//       } else if (
//         frameCountRef.current === sleepWalkAfter &&
//         !gecko.current.sleepWalkMode
//       ) {
//         gecko.current.updateSleepWalkMode(true);
//       }

//       toGeckoPointerScaled_inPlace(
//         userPointSV.value,
//         aspect,
//         scale,
//         gecko_size,
//         userPoint_geckoSpaceRef.current,
//         0,
//       );

//       if (soul.current.done && !gecko.current.oneTimeEnterComplete) {
//         gecko.current.updateEnter(soul.current.done);
//       } else {
//         soul.current.update();
//       }

//       if (gecko.current.oneTimeEnterComplete && !gecko.current.sleepWalkMode) {
//         leadPoint.current.update(userPoint_geckoSpaceRef.current);
//       } else if (!gecko.current.sleepWalkMode) {
//         leadPoint.current.update(soul.current.soul);
//       } else if (gecko.current.sleepWalkMode) {
//         sleepWalk0.current.update(moments);
//         leadPoint.current.update(sleepWalk0.current.walk);
//       }

//       gecko.current.update(
//         leadPoint.current.lead,
//         leadPoint.current.leadDistanceTraveled,
//         leadPoint.current.isMoving,
//       );

//       const spine = gecko.current.body.spine;
//       hintRef.current = spine.hintJoint || [0, 0];

//       workingBuffers.stepTargets[0] =
//         gecko.current.legs.frontLegs.stepTargets[0];
//       workingBuffers.stepTargets[1] =
//         gecko.current.legs.frontLegs.stepTargets[1];
//       workingBuffers.stepTargets[2] =
//         gecko.current.legs.backLegs.stepTargets[0];
//       workingBuffers.stepTargets[3] =
//         gecko.current.legs.backLegs.stepTargets[1];

//       moments.current.update(
//         userPointSV.value,
//         isDragging.value,
//         wasTapSV.value,
//         wasDoubleTapSV.value,
//         leadPoint.current.lead,
//         workingBuffers.stepTargets, // <-- Reused array, no allocation!
//       );

//       if (
//         sleepWalk0.current.pickUpNextId !== -1 &&
//         sleepWalk0.current.pickUpNextId !== lastTriggeredIdRef.current
//       ) {
//         syncPawsInUIRef.current();
//       }

//       // ============== ZERO-ALLOCATION BUFFER UPDATES ==============
//       // Write to preallocated buffers - NO new allocations here

//       toShaderSpace_inplace(
//         soul.current.soul,
//         aspect,
//         gecko_scale,
//         workingBuffers.soul,
//         0,
//       );
//       toShaderSpace_inplace(
//         sleepWalk0.current.walk,
//         aspect,
//         gecko_scale,
//         workingBuffers.walk,
//         0,
//       );
//       toShaderSpace_inplace(
//         hintRef.current,
//         aspect,
//         gecko_scale,
//         workingBuffers.hint,
//         0,
//       );
//       toShaderModel_inPlace(
//         leadPoint.current.lead,
//         aspect,
//         gecko_scale,
//         workingBuffers.lead,
//         0,
//       );

//       workingBuffers.selected[0] = moments.current.selected.coord[0];
//       workingBuffers.selected[1] = moments.current.selected.coord[1];

//       // Held moments - reuse heldTemp buffer instead of creating new Float32Array each iteration
//       for (let i = 0; i < MAX_HELD; i++) {
//         toGeckoSpace_inPlace(
//           moments.current.holdings[i].coord,
//           gecko_scale,
//           workingBuffers.heldTemp,
//         );
//         workingBuffers.heldCoords[i * 2] = workingBuffers.heldTemp[0];
//         workingBuffers.heldCoords[i * 2 + 1] = workingBuffers.heldTemp[1];
//       }

//       toGeckoSpace_inPlace(
//         moments.current.lastSelected.coord,
//         gecko_scale,
//         workingBuffers.lastSelected,
//       );

//       // Gecko points - reuse the same array, just refill it
//       workingBuffers.geckoPoints.fill(0);
//       packGeckoOnlyProd(gecko.current, workingBuffers.geckoPoints, gecko_scale);

//       // Moments - reuse the same array
//       workingBuffers.moments.fill(0);
//       packVec2Uniform_withRecenter_moments(
//         moments.current.moments,
//         workingBuffers.moments,
//         moments.current.momentsLength,
//         aspect,
//         scale,
//       );

//       // ============== SHARED VALUE UPDATES ==============
//       // These are the ONLY allocations - creating small arrays for SharedValues
//       // Total: 9 allocations per frame (down from 23)

//       soulUniformSV.value = [workingBuffers.soul[0], workingBuffers.soul[1]];
//       walk0UniformSV.value = [workingBuffers.walk[0], workingBuffers.walk[1]];
//       hintUniformSV.value = [workingBuffers.hint[0], workingBuffers.hint[1]];
//       leadUniformSV.value = [workingBuffers.lead[0], workingBuffers.lead[1]];
//       selectedUniformSV.value = [
//         workingBuffers.selected[0],
//         workingBuffers.selected[1],
//       ];
//       lastSelectedUniformSV.value = [
//         workingBuffers.lastSelected[0],
//         workingBuffers.lastSelected[1],
//       ];

//       // For larger arrays, we must create new arrays (Reanimated requirement)
//       heldMomentUniformSV.value = Array.from(workingBuffers.heldCoords);
//       geckoPointsUniformSV.value = [...workingBuffers.geckoPoints];
//       momentsUniformSV.value = [...workingBuffers.moments];

//       momentsLengthSV.value = moments.current.momentsLength;

//       // Trigger shader update only when moving
//       if (leadPoint.current.isMoving || isDragging.value) {
//         const now = Date.now();
//         if (now - lastRenderRef.current > 16) {
//           lastRenderRef.current = now;
//           updateTrigger.value += 1;
//         }
//       }

//       frame = requestAnimationFrame(animate);
//     };

//     animate();

//     return () => {
//       cancelled = true;
//       if (frame) cancelAnimationFrame(frame);
//     };
//   }, [aspect, gecko_scale, gecko_size, scale, size.width, size.height]);

//   // ============== OPTIMIZED UNIFORMS ==============
//   // No Array.from() or spread operators - just pass the values directly
//   const uniforms = useDerivedValue(() => {
//     updateTrigger.value;

//     if (!size.width || !size.height) {
//       return {
//         u_scale: scale,
//         u_gecko_scale: gecko_scale,
//         u_gecko_size: gecko_size,
//         u_time: 0,
//         u_resolution: [width, height],
//         u_aspect: aspect || 1,
//         u_lead: [-100, -100],
//         u_soul: [-100, -100],
//         u_walk0: [-100, -100],
//         u_selected: [-100, -100],
//         u_lastSelected: [-100, -100],
//         u_hint: [-100, -100],
//         u_momentsLength: 0,
//         u_moments: momentsUniformSV.value,
//         u_heldMoments: heldMomentUniformSV.value,
//         u_geckoPoints: geckoPointsUniformSV.value,
//       };
//     }

//     // Pass shared values directly - no copying!
//     return {
//       u_scale: scale,
//       u_gecko_scale: gecko_scale,
//       u_gecko_size: gecko_size,
//       u_time: (Date.now() - start.current) / 1000,
//       u_resolution: [size.width, size.height],
//       u_aspect: aspect || 1,
//       u_lead: leadUniformSV.value,
//       u_soul: soulUniformSV.value,
//       u_walk0: walk0UniformSV.value,
//       u_selected: selectedUniformSV.value,
//       u_lastSelected: lastSelectedUniformSV.value,
//       u_hint: hintUniformSV.value,
//       u_momentsLength: momentsLengthSV.value,
//       u_moments: momentsUniformSV.value,
//       u_heldMoments: heldMomentUniformSV.value,
//       u_geckoPoints: geckoPointsUniformSV.value,
//     };
//   }, [scale, gecko_scale, aspect, size.width, size.height, width, height]);

//   return (
//     <>
//       <GestureDetector gesture={composedGesture}>
//         <View style={StyleSheet.absoluteFill}>
//           <Canvas ref={ref} style={[StyleSheet.absoluteFill]}>
//             <Rect
//               x={0}
//               y={0}
//               width={size.width}
//               height={size.height}
//               color="lightblue"
//             >
//               <Shader
//                 style={{ backgroundColor: "transparent" }}
//                 source={sourceTwo}
//                 uniforms={uniforms}
//               />
//             </Rect>
//           </Canvas>

//           <Canvas ref={ref} style={[StyleSheet.absoluteFill]}>
//             <Rect
//               x={0}
//               y={0}
//               width={size.width}
//               height={size.height}
//               color="lightblue"
//             >
//               <Shader
//                 style={{ backgroundColor: "transparent" }}
//                 source={source}
//                 uniforms={uniforms}
//               />
//             </Rect>
//           </Canvas>
//         </View>
//       </GestureDetector>

//       <View style={styles.pawSetterContainer}>
//         <PawSetter
//           color={lightDarkTheme.primaryText}
//           backgroundColor={lightDarkTheme.primaryBackground}
//           borderColor={lightDarkTheme.lighterOverlayBackground}
//           momentsData={moments.current.moments}
//           lastSelected={moments.current.lastSelected}
//           updatePaw={(moment, holdIndex) =>
//             moments.current.updateHold(moment, holdIndex)
//           }
//           clearPaw={(holdIndex) => moments.current.clearHolding(holdIndex)}
//           autoUpdatePaw={(holdIndex) =>
//             moments.current.updateHold(moment, holdIndex)
//           }
//           updateSelected={(holdIndex) =>
//             moments.current.updateSelected(holdIndex)
//           }
//           registerClearAll={(fn) => {
//             clearAllPawsInUIRef.current = fn;
//           }}
//           registerSyncPaws={(fn) => {
//             syncPawsInUIRef.current = fn;
//           }}
//           clearAllPaws={() => moments.current.clearAllHoldings()}
//           handleGetMoment={handleGetMoment}
//         />
//       </View>

//       <View style={styles.resetterContainer}>
//         <MomentDotsResetterMini
//           onBackPress={handleUpdateMomentsState}
//           onCenterPress={handleRecenterMoments}
//           onUndoPress={handleReset}
//           primaryColor={lightDarkTheme.primaryText}
//           borderColor={lightDarkTheme.lighterOverlayBackground}
//           primaryBackground={lightDarkTheme.primaryBackground}
//           onPress={handleRescatterMoments}
//         />
//       </View>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   pawSetterContainer: { position: "absolute", bottom: 200, left: 16 },
//   resetterContainer: { position: "absolute", bottom: 200, right: 16 },
// });

// const MemoizedMomentsSkia = React.memo(MomentsSkia);
// export default MemoizedMomentsSkia;

import { View, StyleSheet } from "react-native";
import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
  useMemo,
} from "react";
import Soul from "./soulClass";
import SleepWalk0 from "./sleepWalkOneClass";
import Mover from "./leadPointClass";
import Gecko from "./geckoClass";
import Moments from "./momentsClass";
import { packGeckoOnlyProd, packGeckoOnlyProdCompact56 } from "./animUtils";
import PawSetter from "@/app/screens/fidget/PawSetter";
import { MOMENTS_BG_SKSL_OPT } from "./shaderCode/momentsLGShaderOpt";
import { GECKO_ONLY_TRANSPARENT_SKSL_OPT } from "./shaderCode/geckoMomentsLGShaderOpt";
import { GECKO_ONLY_TRANSPARENT_SKSL_OPT_COMPACT } from "./shaderCode/geckoMomentsLGShaderOpt_Compact";
import { BackHandler } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import MomentDotsResetterMini from "./MomentDotsResetterMini";
import {
  runOnJS,
  useSharedValue,
  useDerivedValue,
} from "react-native-reanimated";

import { useWindowDimensions } from "react-native";
import {
  hexToVec3,
  toShaderModel_inPlace,
  toShaderSpace_inplace,
  toGeckoSpace_inPlace,
  toGeckoPointerScaled_inPlace,
  packVec2Uniform_withRecenter_moments,
} from "./animUtils";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  Canvas,
  useCanvasSize,
  Shader,
  Rect,
  Skia,
} from "@shopify/react-native-skia";

// ---------------------------------------------------------------------------
// FPS monitor (prints once/sec). Keep while profiling; remove for production.
// ---------------------------------------------------------------------------
let _last = global.performance?.now?.() ?? Date.now();
let _worst = 0;
let _over = 0;
let _frames = 0;
let _lastReport = _last;

export function frameBudgetMonitor() {
  const now = global.performance?.now?.() ?? Date.now();
  const dt = now - _last;
  _last = now;

  _frames++;
  if (dt > _worst) _worst = dt;
  if (dt > 18) _over++;

  if (now - _lastReport >= 1000) {
    console.log(
      `FPS≈${_frames}  over18ms=${_over}  worst=${_worst.toFixed(1)}ms`,
    );
    _frames = 0;
    _over = 0;
    _worst = 0;
    _lastReport = now;
  }
}

type Props = {
  color1: string;
  color2: string;
  bckgColor1: string;
  bckgColor2: string;
  momentsData: [];
  startingCoord: number[];
  restPoint: number[];
  scale: number;
  reset?: number | null;
};

const MomentsSkia = ({
  handleEditMoment,
  handleUpdateMomentCoords,
  handleGetMoment,
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
  handleRescatterMoments,
  handleToggleManual,
  handleRecenterMoments,
  manualOnly,
  speedSetting,
  autoPickUp,
  randomMomentIds,
  reset = 0,
}: Props) => {
  const { width, height } = useWindowDimensions();
  const { ref, size } = useCanvasSize();

  const [aspect, setAspect] = useState<number>(width / height);

  useEffect(() => {
    if (size && size.width > 0 && size.height > 0) {
      const newAspect = size.width / size.height;
      setAspect(newAspect);
    }
  }, [size]);

  const updateTrigger = useSharedValue(0);
  const lastRenderRef = useRef(0);
  const isPausedRef = useRef(false);

  const TOTAL_GECKO_POINTS = 71;
  const MAX_MOMENTS = 40;
  const MAX_HELD = 4;

  const TOTAL_GECKO_POINTS_COMPACT = 56;

  // ============== TRULY PREALLOCATED BUFFERS ==============
  // ✅ CHANGE #1: make big buffers typed arrays (no JS array objects)
  const workingBuffers = useRef({
    soul: new Float32Array(2),
    walk: new Float32Array(2),
    hint: new Float32Array(2),
    lead: new Float32Array(2),
    selected: new Float32Array(2),
    lastSelected: new Float32Array(2),

    heldCoords: new Float32Array(MAX_HELD * 2),
    heldTemp: new Float32Array(2),

    // ✅ BIG BUFFERS as Float32Array
    // geckoPoints: new Float32Array(TOTAL_GECKO_POINTS * 2),

    geckoPoints: new Float32Array(TOTAL_GECKO_POINTS_COMPACT * 2),
    moments: new Float32Array(MAX_MOMENTS * 2),

    // pass step target refs to moments.update without allocating
    stepTargets: [null, null, null, null] as any[],
  }).current;

  // Shared values (small ones as JS arrays)
  const leadUniformSV = useSharedValue<number[]>([0, 0]);
  const soulUniformSV = useSharedValue<number[]>([0, 0]);
  const walk0UniformSV = useSharedValue<number[]>([0, 0]);
  const selectedUniformSV = useSharedValue<number[]>([0, 0]);
  const lastSelectedUniformSV = useSharedValue<number[]>([0, 0]);
  const hintUniformSV = useSharedValue<number[]>([0, 0]);

  // Big uniforms (still SharedValues, but we will only update them when needed)
  const momentsUniformSV = useSharedValue<number[]>(
    Array(MAX_MOMENTS * 2).fill(0),
  );
  const heldMomentUniformSV = useSharedValue<number[]>(
    Array(MAX_HELD * 2).fill(0),
  );
  const geckoPointsUniformSV = useSharedValue<number[]>(
    Array(TOTAL_GECKO_POINTS * 2).fill(0),
  );
  const momentsLengthSV = useSharedValue(0);

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

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => true,
      );
      return () => subscription.remove();
    }, []),
  );

  const handleUpdateMomentsState = () => {
    const newMoments = moments.current.moments;
    handleUpdateCoords(momentsData, newMoments);
  };

  const handleUpdateCoords = (oldMoments, newMoments) => {
    const formattedData = newMoments.map((moment) => ({
      id: moment.id,
      screen_x: moment.coord[0],
      screen_y: moment.coord[1],
      stored_index: moment.stored_index,
    }));
    handleUpdateMomentCoords(formattedData);
  };

  const userPointSV = useSharedValue(restPoint);
  const userPoint_geckoSpaceRef = useRef<[number, number]>([0, 0]);
  const isDragging = useSharedValue(false);

  const onDoublePress = () => {
    handleGetMoment(-1);
    console.log("double press");
  };

  const wasTapSV = useSharedValue(false);
  const wasDoubleTapSV = useSharedValue(false);

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
        setTimeout(() => {
          wasTapSV.value = false;
        }, 100);
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

  const taps = Gesture.Exclusive(doubleTapGesture, singleTapGesture);
  const composedGesture = Gesture.Simultaneous(panGesture, taps);

  const color1Converted = hexToVec3(color1);
  const color2Converted = hexToVec3(color2);
  const bckgColor1Converted = hexToVec3(bckgColor1);
  const bckgColor2Converted = hexToVec3(bckgColor2);

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
      randomMomentIds,
    ),
  );
  const moments = useRef(
    new Moments(momentsData, gecko_size, sleepWalk0, [0.5, 0.5], 0.05),
  );

  const handleGetMomentRef = useRef(handleGetMoment);
  useEffect(() => {
    handleGetMomentRef.current = handleGetMoment;
  }, [handleGetMoment]);

  useEffect(() => {
    if (aspect) {
      moments.current.setAspect(aspect);
      sleepWalk0.current.setAspect(aspect);
    }
  }, [aspect]);

  const SHARED_SKSL_PRELUDE = (c1, c2, b1, b2) => `
    vec3 startColor = vec3(${c1});
    vec3 endColor = vec3(${c2});
    vec3 backgroundStartColor = vec3(${b1});
    vec3 backgroundEndColor = vec3(${b2});
  `;

  const [geckoColor, setGeckoColor] = useState(color2Converted);

  const source = useMemo(() => {
    return Skia.RuntimeEffect.Make(`
      ${SHARED_SKSL_PRELUDE(color1Converted, geckoColor, bckgColor1Converted, bckgColor2Converted)}
      ${GECKO_ONLY_TRANSPARENT_SKSL_OPT_COMPACT}
    `);
  }, [color1Converted, geckoColor, bckgColor1Converted, bckgColor2Converted]);

  const sourceTwo = useMemo(() => {
    return Skia.RuntimeEffect.Make(`
      ${SHARED_SKSL_PRELUDE(color1Converted, color2Converted, bckgColor1Converted, bckgColor2Converted)}
      ${MOMENTS_BG_SKSL_OPT}
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

  const start = useRef(Date.now());
  const hintRef = useRef([0, 0]);

  const [internalReset, setInternalReset] = useState(0);
  const handleReset = () => setInternalReset(Date.now());

  useEffect(() => {
    console.log("resetting");
    moments.current.updateOrAddMoments(momentsData);
    moments.current.updateAllCoords(momentsData);
  }, [momentsData, reset]);

  useEffect(() => {
    if (!internalReset || !reset) {
      console.log("conditions not met for a reset");
      return;
    } else {
      console.log("TRUE RESET");
    }

    start.current = Date.now();
    soul.current = new Soul(restPoint, 0.02);
    leadPoint.current = new Mover(startingCoord);
    gecko.current = new Gecko(startingCoord, 0.06);

    // Reset buffers
    workingBuffers.soul.fill(0);
    workingBuffers.walk.fill(0);
    workingBuffers.hint.fill(0);
    workingBuffers.lead.fill(0);
    workingBuffers.selected.fill(0);
    workingBuffers.lastSelected.fill(0);
    workingBuffers.heldCoords.fill(0);
    workingBuffers.geckoPoints.fill(0);
    workingBuffers.moments.fill(0);

    // Reset SVs
    leadUniformSV.value = [0, 0];
    soulUniformSV.value = [0, 0];
    walk0UniformSV.value = [0, 0];
    selectedUniformSV.value = [0, 0];
    lastSelectedUniformSV.value = [0, 0];
    hintUniformSV.value = [0, 0];

    momentsUniformSV.value = Array(MAX_MOMENTS * 2).fill(0);
    heldMomentUniformSV.value = Array(MAX_HELD * 2).fill(0);
    geckoPointsUniformSV.value = Array(TOTAL_GECKO_POINTS_COMPACT * 2).fill(0);
    momentsLengthSV.value = 0;

    userPointSV.value = restPoint;
    userPoint_geckoSpaceRef.current[0] = startingCoord[0];
    userPoint_geckoSpaceRef.current[1] = startingCoord[1];
  }, [reset, internalReset]);

  const frameCountRef = useRef(0);
  const lastTriggeredIdRef = useRef(-1);
  const lastPawsClearedRef = useRef(false);
  const clearAllPawsInUIRef = useRef(() => {});
  const syncPawsInUIRef = useRef<() => void>(() => {});

  useEffect(() => {
    let cancelled = false;
    let frame;
    const sleepWalkAfter = 100;

    frameCountRef.current = 0;

    const animate = () => {
      if (cancelled) return;

      // keep rAF alive but avoid doing work while paused
      if (isPausedRef.current) {
        frame = requestAnimationFrame(animate);
        return;
      }

      if (aspect == null || isNaN(aspect) || !size.width || !size.height) {
        frame = requestAnimationFrame(animate);
        return;
      }

      frameBudgetMonitor();

      // ---- UI / side-effects (unchanged) ----
      const shouldClearPaws = moments.current.trigger_remote;
      if (shouldClearPaws && !lastPawsClearedRef.current) {
        lastPawsClearedRef.current = true;
        clearAllPawsInUIRef.current();
      } else if (!shouldClearPaws && lastPawsClearedRef.current) {
        lastPawsClearedRef.current = false;
      }

      const currentId = moments.current.lastSelected?.id ?? -1;
      if (currentId !== -1 && currentId !== lastTriggeredIdRef.current) {
        lastTriggeredIdRef.current = currentId;
        handleGetMomentRef.current(currentId);
      }

      if (leadPoint.current.isMoving && !gecko.current.sleepWalkMode) {
        frameCountRef.current = 0;
      }

      if (isDragging.value && gecko.current.sleepWalkMode) {
        frameCountRef.current = 0;
        gecko.current.updateSleepWalkMode(false);
      }

      if (frameCountRef.current < sleepWalkAfter) {
        frameCountRef.current += 1;
      } else if (
        frameCountRef.current === sleepWalkAfter &&
        !gecko.current.sleepWalkMode
      ) {
        gecko.current.updateSleepWalkMode(true);
      }

      // ---- pointer transform ----
      toGeckoPointerScaled_inPlace(
        userPointSV.value,
        aspect,
        scale,
        gecko_size,
        userPoint_geckoSpaceRef.current,
        0,
      );

      // ---- drive leadpoint ----
      if (soul.current.done && !gecko.current.oneTimeEnterComplete) {
        gecko.current.updateEnter(soul.current.done);
      } else {
        soul.current.update();
      }

      if (gecko.current.oneTimeEnterComplete && !gecko.current.sleepWalkMode) {
        leadPoint.current.update(userPoint_geckoSpaceRef.current);
      } else if (!gecko.current.sleepWalkMode) {
        leadPoint.current.update(soul.current.soul);
      } else {
        sleepWalk0.current.update(moments);
        leadPoint.current.update(sleepWalk0.current.walk);
      }

      // ---- sim update ----
      gecko.current.update(
        leadPoint.current.lead,
        leadPoint.current.leadDistanceTraveled,
        leadPoint.current.isMoving,
      );

      const spine = gecko.current.body.spine;
      hintRef.current = spine.hintJoint || [0, 0];

      // step targets (no alloc)
      workingBuffers.stepTargets[0] =
        gecko.current.legs.frontLegs.stepTargets[0];
      workingBuffers.stepTargets[1] =
        gecko.current.legs.frontLegs.stepTargets[1];
      workingBuffers.stepTargets[2] =
        gecko.current.legs.backLegs.stepTargets[0];
      workingBuffers.stepTargets[3] =
        gecko.current.legs.backLegs.stepTargets[1];

      moments.current.update(
        userPointSV.value,
        isDragging.value,
        wasTapSV.value,
        wasDoubleTapSV.value,
        leadPoint.current.lead,
        workingBuffers.stepTargets,
      );

      if (
        sleepWalk0.current.pickUpNextId !== -1 &&
        sleepWalk0.current.pickUpNextId !== lastTriggeredIdRef.current
      ) {
        syncPawsInUIRef.current();
      }

      // ---------------------------------------------------------------------
      // ✅ CHANGE #2: ALWAYS update the SMALL uniforms (cheap)
      // ---------------------------------------------------------------------
      toShaderSpace_inplace(
        soul.current.soul,
        aspect,
        gecko_scale,
        workingBuffers.soul,
        0,
      );
      toShaderSpace_inplace(
        sleepWalk0.current.walk,
        aspect,
        gecko_scale,
        workingBuffers.walk,
        0,
      );
      toShaderSpace_inplace(
        hintRef.current,
        aspect,
        gecko_scale,
        workingBuffers.hint,
        0,
      );
      toShaderModel_inPlace(
        leadPoint.current.lead,
        aspect,
        gecko_scale,
        workingBuffers.lead,
        0,
      );

      workingBuffers.selected[0] = moments.current.selected.coord[0];
      workingBuffers.selected[1] = moments.current.selected.coord[1];

      for (let i = 0; i < MAX_HELD; i++) {
        toGeckoSpace_inPlace(
          moments.current.holdings[i].coord,
          gecko_scale,
          workingBuffers.heldTemp,
        );
        workingBuffers.heldCoords[i * 2] = workingBuffers.heldTemp[0];
        workingBuffers.heldCoords[i * 2 + 1] = workingBuffers.heldTemp[1];
      }

      toGeckoSpace_inPlace(
        moments.current.lastSelected.coord,
        gecko_scale,
        workingBuffers.lastSelected,
      );

      // Update the small SharedValues every frame (tiny allocs, acceptable)
      soulUniformSV.value = [workingBuffers.soul[0], workingBuffers.soul[1]];
      walk0UniformSV.value = [workingBuffers.walk[0], workingBuffers.walk[1]];
      hintUniformSV.value = [workingBuffers.hint[0], workingBuffers.hint[1]];
      leadUniformSV.value = [workingBuffers.lead[0], workingBuffers.lead[1]];
      selectedUniformSV.value = [
        workingBuffers.selected[0],
        workingBuffers.selected[1],
      ];
      lastSelectedUniformSV.value = [
        workingBuffers.lastSelected[0],
        workingBuffers.lastSelected[1],
      ];

      // ---------------------------------------------------------------------
      // ✅ CHANGE #3: Gate BIG uniform packing + copying
      // ---------------------------------------------------------------------
      const shouldUpdateBigUniforms =
        leadPoint.current.isMoving ||
        isDragging.value ||
        wasTapSV.value ||
        wasDoubleTapSV.value ||
        moments.current.trigger_remote; // any “moments changed” flag

      if (shouldUpdateBigUniforms) {
        // pack into typed arrays (fast, low GC)
        // workingBuffers.geckoPoints.fill(0);
        // packGeckoOnlyProd(gecko.current, workingBuffers.geckoPoints as any, gecko_scale);

        workingBuffers.geckoPoints.fill(0);
        packGeckoOnlyProdCompact56(
          gecko.current,
          workingBuffers.geckoPoints,
          gecko_scale,
        );

        workingBuffers.moments.fill(0);
        packVec2Uniform_withRecenter_moments(
          moments.current.moments,
          workingBuffers.moments as any,
          moments.current.momentsLength,
          aspect,
          scale,
        );

        // COPY ONLY WHEN NEEDED (this is where your GC spikes were coming from)

        heldMomentUniformSV.value = Array.from(workingBuffers.heldCoords);

        // COPY ONLY WHEN NEEDED (your existing shouldUpdateBigUniforms gate)

        geckoPointsUniformSV.value = Array.from(workingBuffers.geckoPoints);
        momentsUniformSV.value = Array.from(workingBuffers.moments);

        momentsLengthSV.value = moments.current.momentsLength;

        // Trigger shader update (throttle a bit)
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
    // Reanimated dependency gate
    updateTrigger.value;

    if (!size.width || !size.height) {
      return {
        u_scale: scale,
        u_gecko_scale: gecko_scale,
        u_gecko_size: gecko_size,
        u_time: 0,
        u_resolution: [width, height],
        u_aspect: aspect || 1,
        u_lead: [-100, -100],
        u_soul: [-100, -100],
        u_walk0: [-100, -100],
        u_selected: [-100, -100],
        u_lastSelected: [-100, -100],
        u_hint: [-100, -100],
        u_momentsLength: 0,
        u_moments: momentsUniformSV.value,
        u_heldMoments: heldMomentUniformSV.value,
        u_geckoPoints: geckoPointsUniformSV.value,
      };
    }

    return {
      u_scale: scale,
      u_gecko_scale: gecko_scale,
      u_gecko_size: gecko_size,
      u_time: (Date.now() - start.current) / 1000,
      u_resolution: [size.width, size.height],
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
  }, [scale, gecko_scale, aspect, size.width, size.height, width, height]);

  return (
    <>
      <GestureDetector gesture={composedGesture}>
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
                source={sourceTwo}
                uniforms={uniforms}
              />
            </Rect>
          </Canvas>

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
      </GestureDetector>

      <View style={styles.pawSetterContainer}>
        <PawSetter
          color={lightDarkTheme.primaryText}
          backgroundColor={lightDarkTheme.primaryBackground}
          borderColor={lightDarkTheme.lighterOverlayBackground}
          momentsData={moments.current.moments}
          lastSelected={moments.current.lastSelected}
          updatePaw={(moment, holdIndex) =>
            moments.current.updateHold(moment, holdIndex)
          }
          clearPaw={(holdIndex) => moments.current.clearHolding(holdIndex)}
          autoUpdatePaw={(holdIndex) =>
            moments.current.updateHold(moment, holdIndex)
          }
          updateSelected={(holdIndex) =>
            moments.current.updateSelected(holdIndex)
          }
          registerClearAll={(fn) => {
            clearAllPawsInUIRef.current = fn;
          }}
          registerSyncPaws={(fn) => {
            syncPawsInUIRef.current = fn;
          }}
          clearAllPaws={() => moments.current.clearAllHoldings()}
          handleGetMoment={handleGetMoment}
        />
      </View>

      <View style={styles.resetterContainer}>
        <MomentDotsResetterMini
          onBackPress={handleUpdateMomentsState}
          onCenterPress={handleRecenterMoments}
          onUndoPress={handleReset}
          primaryColor={lightDarkTheme.primaryText}
          borderColor={lightDarkTheme.lighterOverlayBackground}
          primaryBackground={lightDarkTheme.primaryBackground}
          onPress={handleRescatterMoments}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  pawSetterContainer: { position: "absolute", bottom: 200, left: 16 },
  resetterContainer: { position: "absolute", bottom: 200, right: 16 },
});

const MemoizedMomentsSkia = React.memo(MomentsSkia);
export default MemoizedMomentsSkia;
