// import { View, StyleSheet } from "react-native";
// import React, {
//   useEffect,
//   useRef,
//   useCallback,
//   useState,
//   useMemo,
// } from "react";
// import Soul from "./soulClass";
// import Mover from "./leadPointClass";
// import Gecko from "./geckoClass";
// import Moments from "./momentsClass";
// import {
//   MOMENTS_BG_SKSL,
//   // GECKO_ONLY_TRANSPARENT_SKSL,
//   // LIQUID_GLASS_MOMENTS_GECKO_GLSL,
// } from "./shaderCode/geckoMomentsLGShader";
// import { MOMENTS_BG_SKSL_OPT } from "./shaderCode/momentsLGShaderOpt";

// import { GECKO_ONLY_TRANSPARENT_SKSL_OPT } from "./shaderCode/geckoMomentsLGShaderOpt";

// // import { MOMENTS_ONLY_GLSL } from "./shaderCode/geckoMomentsShader.glsl";
// // import { GECKO_MOMENTS_NO_BG_GLSL } from "./shaderCode/transBackground.glsl";
// // import { LIQUID_GLASS_MOMENTS_GLSL } from "./shaderCode/liquidGlassShader.glsl";

// // import { GECKO_MOMENTS_GLSL } from "./shaderCode/geckoMomentsShader.glsl";
// // import { LIQUID_GLASS_GLSL } from "./shaderCode/liquidGlassShader.glsl";
// // import { LIQUID_GLASS_STRIPES_BG } from "./shaderCode/liquidGlassShader.glsl";

// import { BackHandler } from "react-native";
// import { useFocusEffect } from "@react-navigation/native";
// import MomentDotsResetterMini from "./MomentDotsResetterMini"; 
// import { runOnJS, useSharedValue } from "react-native-reanimated";
// import { useWindowDimensions } from "react-native";

// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import {
//   hexToVec3,
//   toShaderModel_inPlace,
//   toShaderSpace_inplace,
//   toShaderModel_arrays_inPlace,
//   packVec2Uniform_withRecenter_moments,
//   screenToGeckoSpace_inPlace,
// } from "./animUtils";
// import { Gesture, GestureDetector } from "react-native-gesture-handler";
// import { 
//   Canvas,
//   useCanvasSize, 
//   Shader,
//   Rect,
//   Skia,
// } from "@shopify/react-native-skia";
// import { Poppins_400Regular } from "@expo-google-fonts/poppins"; 

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

// // LIMIT OF 40 MOMENTS RIGHT NOW
// // TO ALLOW FOR DYNAMIC UPDATING WOULD MEAN TO RESET SHADER EVERY SINGLE TIME WHICH CAN BE EXPENSIVE
// // would do this in shader instead of current setup -->  uniform vec2 u_moments[${moments.length}];
// const MomentsSkia = ({
//   handleEditMoment,
//   handleUpdateMomentCoords,
//   handleGetMoment,
//   color1,
//   color2,
//   bckgColor1,
//   bckgColor2,
//   momentsData = [], //mapped list of capsuleList with just the id and a field combining x and y
//   startingCoord,
//   restPoint,
//   scale = 1,
//   gecko_scale = 1,
//   lightDarkTheme,
//   handleRescatterMoments,
//   handleRecenterMoments,

//   reset = 0,
// }: Props) => {
//   // console.log(momentsData);

//   const { width, height } = useWindowDimensions();
//   const { ref, size } = useCanvasSize(); // size = { width, height }

//   useFocusEffect(
//     useCallback(() => {
//       return () => {
//         // screen is blurred
//         isDragging.value = false;
//       };
//     }, []),
//   );

//   // DONT DELETE
//   const insets = useSafeAreaInsets();
//   useFocusEffect(
//     useCallback(() => {
//       const subscription = BackHandler.addEventListener(
//         "hardwareBackPress",
//         () => {
//           // block system back
//           return true;
//         },
//       );

//       return () => {
//         subscription.remove();
//       };
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
//     }));
//     handleUpdateMomentCoords(formattedData);
//   };

//   const userPointSV = useSharedValue(restPoint);

//   const isDragging = useSharedValue(false); // tracks if screen is being touched

//   const gesture = Gesture.Pan()
//     .onTouchesDown((e) => {
//       // Finger just touched: mark dragging and update userPoint immediately
//       isDragging.value = true;
//       const touch = e.changedTouches[0];

//       userPointSV.value = [touch.x / size.width, touch.y / size.height];
//     })
//     .onUpdate((e) => {
//       // Normal drag update
//       userPointSV.value = [e.x / size.width, e.y / size.height];
//     })
//     .onEnd(() => {
//       isDragging.value = false; // finger lifted
//     })
//     .onFinalize(() => {
//       isDragging.value = false; // safety: ensure false if gesture cancelled
//     });

//   const onLongPress = () => {};

//   const onDoublePress = () => {
//     console.log(moments.current.lastSelected);
//     handleGetMoment(moments.current.lastSelected?.id);
//   };

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

//   const doubleTapGesture = Gesture.Tap()
//     .numberOfTaps(2)
//     .onEnd(() => runOnJS(onDoublePress)());

//   const composedGesture = Gesture.Simultaneous(panGesture, doubleTapGesture);

//   // const longPressGesture = Gesture.LongPress()
//   //   .minDuration(350)
//   //   .onStart(() => {
//   //     runOnJS(onLongPress)();
//   //   });

//   const [time, setTime] = useState(0);
//   const color1Converted = hexToVec3(color1);
//   const color2Converted = hexToVec3(color2);

//   const bckgColor1Converted = hexToVec3(bckgColor1);
//   const bckgColor2Converted = hexToVec3(bckgColor2);

//   const soul = useRef(new Soul(restPoint, 0.02));
//   const leadPoint = useRef(new Mover(startingCoord));
//   const gecko = useRef(new Gecko(startingCoord, 0.06));
//   const moments = useRef(new Moments(momentsData, [0.5, 0.5], 0.05));

//   const [aspect, setAspect] = useState<number | null>(null);

//   useEffect(() => {
//     setAspect(size.width / size.height);
//   }, [size]);

//   const SHARED_SKSL_PRELUDE = (
//     c1: string,
//     c2: string,
//     b1: string,
//     b2: string,
//   ) => `
//   vec3 startColor = vec3(${c1});
//   vec3 endColor = vec3(${c2});

//   vec3 backgroundStartColor = vec3(${b1});
//   vec3 backgroundEndColor = vec3(${b2});
// `;

//   const source = useMemo(() => {
//     return Skia.RuntimeEffect.Make(`
//     ${SHARED_SKSL_PRELUDE(
//       color1Converted,
//       color2Converted,
//       bckgColor1Converted,
//       bckgColor2Converted,
//     )}

//     ${GECKO_ONLY_TRANSPARENT_SKSL_OPT}
//   `);
//   }, [
//     color1Converted,
//     color2Converted,
//     bckgColor1Converted,
//     bckgColor2Converted,
//   ]);

//   const sourceTwo = useMemo(() => {
//     return Skia.RuntimeEffect.Make(`
//     ${SHARED_SKSL_PRELUDE(
//       color1Converted,
//       color2Converted,
//       bckgColor1Converted,
//       bckgColor2Converted,
//     )}

//     ${MOMENTS_BG_SKSL_OPT}
//   `);
//   }, [
//     color1Converted,
//     color2Converted,
//     bckgColor1Converted,
//     bckgColor2Converted,
//   ]);

//   //   const source = Skia.RuntimeEffect.Make(`
//   //     vec3 startColor = vec3(${color1Converted});
//   //     vec3 endColor = vec3(${color2Converted});

//   //         vec3 backgroundStartColor = vec3(${bckgColor1Converted});
//   //         vec3 backgroundEndColor = vec3(${bckgColor2Converted});

//   //    ${GECKO_ONLY_TRANSPARENT_SKSL}

//   // `);

//   //   const sourceTwo = Skia.RuntimeEffect.Make(`
//   //     vec3 startColor = vec3(${color1Converted});
//   //     vec3 endColor = vec3(${color2Converted});

//   //         vec3 backgroundStartColor = vec3(${bckgColor1Converted});
//   //         vec3 backgroundEndColor = vec3(${bckgColor2Converted});

//   //    ${MOMENTS_BG_SKSL}

//   // `);

//   if (!source) {
//     console.error("❌ Shader failed to compile");
//     return null;
//   }

//   const start = useRef(Date.now());

//   const NUM_SPINE_JOINTS = 15;
//   const NUM_TAIL_JOINTS = 13;
//   const snoutRef = useRef([0, 0]);
//   const headRef = useRef([0, 0]);
//   const hintRef = useRef([0, 0]);
//   const jointsRef = useRef(new Float32Array(NUM_SPINE_JOINTS * 2));
//   const tailJointsRef = useRef(new Float32Array(NUM_TAIL_JOINTS * 2));
//   const stepsRef = useRef(new Float32Array(4 * 2));
//   const elbowsRef = useRef(new Float32Array(4 * 2));
//   const shouldersRef = useRef(new Float32Array(4 * 2));
//   const legMusclesRef = useRef(new Float32Array(8 * 2));
//   const fingersRef = useRef(new Float32Array(20 * 2));

//   const leadUniformRef = useRef(new Float32Array(2));
//   const soulUniformRef = useRef(new Float32Array(2));
//   const selectedUniformRef = useRef(new Float32Array(2));
//   const hintUniformRef = useRef(new Float32Array(2));

//   const snoutUniformRef = useRef(new Float32Array(2));
//   const headUniformRef = useRef(new Float32Array(2));

//   const MAX_MOMENTS = 40;
//   // Preallocate uniform arrays once at top-level inside component
//   const jointsUniform = useRef(new Array(NUM_SPINE_JOINTS * 2).fill(0));
//   const tailUniform = useRef(new Array(NUM_TAIL_JOINTS * 2).fill(0));
//   const stepsUniform = useRef(new Array(4 * 2).fill(0));
//   const elbowsUniform = useRef(new Array(4 * 2).fill(0));
//   const shouldersUniform = useRef(new Array(4 * 2).fill(0));
//   const musclesUniform = useRef(new Array(8 * 2).fill(0));
//   const fingersUniform = useRef(new Array(20 * 2).fill(0));
//   const momentsUniform = useRef(new Array(MAX_MOMENTS * 2).fill(0));

//   const momentsRef = useRef(new Float32Array(MAX_MOMENTS * 2));


//   const geckoPointerRef = useRef<[number, number]>([0, 0]);

//   const [internalReset, setInternalReset] = useState(Date.now());
//   const handleReset = () => {
//     setInternalReset(Date.now());
//   };

//   useEffect(() => {
//     moments.current.updateAllCoords(momentsData);
//   }, [momentsData, internalReset]);

//   useEffect(() => {
//     if (!internalReset && !reset) return;
//     start.current = Date.now();
//     setTime(0);
//     moments.current = new Moments(momentsData, [0.5, 0.5], 0.05);
//     soul.current = new Soul(restPoint, 0.02);
//     leadPoint.current = new Mover(startingCoord);
//     gecko.current = new Gecko(startingCoord, 0.06);

//     momentsRef.current.fill(0);
//     jointsRef.current.fill(0);
//     tailJointsRef.current.fill(0);
//     stepsRef.current.fill(0);
//     elbowsRef.current.fill(0);
//     shouldersRef.current.fill(0);
//     legMusclesRef.current.fill(0);
//     fingersRef.current.fill(0);

//     userPointSV.value = restPoint; // must be set to where entrance animation leaves off
//   }, [reset, internalReset]);








//   //// A N I M A T I O N 
// //   useEffect(() => {
// //     let cancelled = false;
// //     let frame;

// //     const animate = () => {
// //       if (cancelled) return;

// //       if (leadPoint.current.isMoving || isDragging.value) {
// //         const now = (Date.now() - start.current) / 1000;
// //         setTime(now);
// //       }
// //       // const now = (Date.now() - start.current) / 1000;
// //       // setTime(now);

// //       frame = requestAnimationFrame(animate);

// //       // soul.current.update(); // moved this inside if because only using it once
// //       if (soul.current.done && !gecko.current.oneTimeEnterComplete) {
// //         gecko.current.updateEnter(soul.current.done);
// //       } else {
// //         soul.current.update();
// //       }

// //       // if (gecko.current.oneTimeEnterComplete) {
// //       //   leadPoint.current.update(userPointSV.value);
// //       // } else {
// //       //   leadPoint.current.update(soul.current.soul);
// //       // }


// //       if (gecko.current.oneTimeEnterComplete) {
// // screenToGeckoSpace_inPlace(userPointSV.value, aspect, gecko_scale, geckoPointerRef.current);


// //   leadPoint.current.update(geckoPointerRef.current);
// // } else {
// //   leadPoint.current.update(soul.current.soul);
// // }

// //       // if (leadPoint.current.lastMovingTime) {
// //       //   // console.log('creature is in Still mode')
// //       //   return;
// //       // } else {
// //       //   // console.log('weeeee creature is moving!')
// //       // }


// //       gecko.current.update(
// //         leadPoint.current.lead,
// //         leadPoint.current.leadDistanceTraveled,
// //         leadPoint.current.isMoving,
// //       );

// //       // pack spine joints into Float32Array for shader
// //       const spine = gecko.current.body.spine;
// //       const tail = gecko.current.body.tail;

// //       const f_steps = gecko.current.legs.frontLegs.stepTargets;
// //       const b_steps = gecko.current.legs.backLegs.stepTargets;

// //       const f_elbows = gecko.current.legs.frontLegs.elbows;
// //       const b_elbows = gecko.current.legs.backLegs.elbows;

// //       const f_shoulders = [
// //         gecko.current.legs.frontLegs.rotatorJoint0,
// //         gecko.current.legs.frontLegs.rotatorJoint1,
// //       ];
// //       const b_shoulders = [
// //         gecko.current.legs.backLegs.rotatorJoint0,
// //         gecko.current.legs.backLegs.rotatorJoint1,
// //       ];

// //       const f_muscles = gecko.current.legs.frontLegs.muscles;
// //       const b_muscles = gecko.current.legs.backLegs.muscles;

// //       snoutRef.current = spine.unchainedJoints[0] || [0, 0];
// //       headRef.current = spine.unchainedJoints[1] || [0, 0];
// //       hintRef.current = spine.hintJoint || [0, 0];


      
// //       moments.current.update(userPointSV.value, isDragging.value, leadPoint.current.isMoving, f_steps[0]);

// //       // Pack in-place
// //       packVec2Uniform_withRecenter(
// //         spine.joints,
// //         jointsRef.current,
// //         NUM_SPINE_JOINTS,
// //         aspect,
// //         gecko_scale,
// //       );
// //       for (let i = 0; i < jointsUniform.current.length; i++)
// //         jointsUniform.current[i] = jointsRef.current[i];

// //       packVec2Uniform_withRecenter(
// //         tail.joints,
// //         tailJointsRef.current,
// //         NUM_TAIL_JOINTS,
// //         aspect,
// //         gecko_scale,
// //       );
// //       for (let i = 0; i < tailUniform.current.length; i++)
// //         tailUniform.current[i] = tailJointsRef.current[i];

// //       const allSteps = [...f_steps, ...b_steps];
// //       packVec2Uniform_withRecenter(
// //         allSteps,
// //         stepsRef.current,
// //         4,
// //         aspect,
// //         gecko_scale,
// //       );
// //       for (let i = 0; i < stepsUniform.current.length; i++)
// //         stepsUniform.current[i] = stepsRef.current[i];

// //       const allElbows = [...f_elbows, ...b_elbows];
// //       packVec2Uniform_withRecenter(
// //         allElbows,
// //         elbowsRef.current,
// //         4,
// //         aspect,
// //         gecko_scale,
// //       );
// //       for (let i = 0; i < elbowsUniform.current.length; i++)
// //         elbowsUniform.current[i] = elbowsRef.current[i];

// //       const allShoulders = [...f_shoulders, ...b_shoulders];
// //       packVec2Uniform_withRecenter(
// //         allShoulders,
// //         shouldersRef.current,
// //         4,
// //         aspect,
// //         gecko_scale,
// //       );
// //       for (let i = 0; i < shouldersUniform.current.length; i++)
// //         shouldersUniform.current[i] = shouldersRef.current[i];

// //       const allMuscles = [...f_muscles, ...b_muscles];
// //       packVec2Uniform_withRecenter(
// //         allMuscles,
// //         legMusclesRef.current,
// //         8,
// //         aspect,
// //         gecko_scale,
// //       );
// //       for (let i = 0; i < musclesUniform.current.length; i++)
// //         musclesUniform.current[i] = legMusclesRef.current[i];

// //       packVec2Uniform_withRecenter(
// //         gecko.current.legs.frontLegs.fingers[0],
// //         fingersRef.current,
// //         5,
// //         aspect,
// //         gecko_scale,
// //         0,
// //       );
// //       packVec2Uniform_withRecenter(
// //         gecko.current.legs.frontLegs.fingers[1],
// //         fingersRef.current,
// //         5,
// //         aspect,
// //         gecko_scale,
// //         5,
// //       );
// //       packVec2Uniform_withRecenter(
// //         gecko.current.legs.backLegs.fingers[0],
// //         fingersRef.current,
// //         5,
// //         aspect,
// //         gecko_scale,
// //         10,
// //       );
// //       packVec2Uniform_withRecenter(
// //         gecko.current.legs.backLegs.fingers[1],
// //         fingersRef.current,
// //         5,
// //         aspect,
// //         gecko_scale,
// //         15,
// //       );
// //       for (let i = 0; i < fingersUniform.current.length; i++)
// //         fingersUniform.current[i] = fingersRef.current[i];

// //       packVec2Uniform_withRecenter_moments(
// //         moments.current.moments,
// //         momentsRef.current,
// //         moments.current.momentsLength,
// //         aspect,
// //         scale,
// //       );
      
// //       for (let i = 0; i < momentsUniform.current.length; i++)
// //         momentsUniform.current[i] = momentsRef.current[i];

// //       toShaderSpace_inplace(
// //         leadPoint.current.lead,
// //         aspect,
// //         scale,
// //         leadUniformRef.current,
// //         0,
// //       );

// //       toShaderSpace_inplace(
// //         soul.current.soul,
// //         aspect,
// //         gecko_scale,
// //         soulUniformRef.current,
// //         0,
// //       );

// //       toShaderSpace_inplace(
// //         moments.current.selected.coord,
// //         aspect,
// //         scale,
// //         selectedUniformRef.current,
// //         0,
// //       );

// //       toShaderSpace_inplace(
// //         hintRef.current,
// //         aspect,
// //         gecko_scale,
// //         hintUniformRef.current,
// //         0,
// //       );

// //       toShaderModel_inplace(
// //         snoutRef.current,
// //         gecko_scale,
// //         snoutUniformRef.current,
// //         0,
// //       );

// //       toShaderModel_inplace(
// //         headRef.current,
// //         gecko_scale,
// //         headUniformRef.current,
// //         0,
// //       );
// //     };
// //     animate();
// //     return () => {
// //       cancelled = true;
// //       if (frame) cancelAnimationFrame(frame);
// //     };
// //   }, [aspect]);

// useEffect(() => {
//   let cancelled = false;
//   let frame;

//   const animate = () => {
//     if (cancelled) return;

//     // Update time if moving
//     if (leadPoint.current.isMoving || isDragging.value) {
//       const now = (Date.now() - start.current) / 1000;
//       setTime(now);
//       uniformsRef.current.u_time = now;
//     }

//     frame = requestAnimationFrame(animate);

//     // 🔹 Update soul & gecko enter state
//     if (soul.current.done && !gecko.current.oneTimeEnterComplete) {
//       gecko.current.updateEnter(soul.current.done);
//     } else {
//       soul.current.update();
//     }

//     // 🔹 Update lead point
//     if (gecko.current.oneTimeEnterComplete) {
//       screenToGeckoSpace_inPlace(userPointSV.value, aspect, gecko_scale, geckoPointerRef.current);
//       leadPoint.current.update(geckoPointerRef.current);
//     } else {
//       leadPoint.current.update(soul.current.soul);
//     }

//     // 🔹 Update gecko body & legs
//     gecko.current.update(
//       leadPoint.current.lead,
//       leadPoint.current.leadDistanceTraveled,
//       leadPoint.current.isMoving
//     );

//     const spine = gecko.current.body.spine;
//     const tail = gecko.current.body.tail; 
  
//     const f_muscles = gecko.current.legs.frontLegs.muscles;
//     const b_muscles = gecko.current.legs.backLegs.muscles;
 
//     snoutRef.current = spine.unchainedJoints[0] || [0, 0];
//     headRef.current = spine.unchainedJoints[1] || [0, 0];
//     hintRef.current = spine.hintJoint || [0, 0];
 
//     moments.current.update(userPointSV.value, isDragging.value, leadPoint.current.isMoving, gecko.current.legs.frontLegs.stepTargets[0]);
 
//     // In place packer
//     toShaderModel_arrays_inPlace(spine.joints, jointsUniform.current, NUM_SPINE_JOINTS, aspect, gecko_scale);
//     toShaderModel_arrays_inPlace(tail.joints, tailUniform.current, NUM_TAIL_JOINTS, aspect, gecko_scale);

//     // STEPS
//     toShaderModel_arrays_inPlace(gecko.current.legs.frontLegs.stepTargets, stepsUniform.current, 2, aspect, gecko_scale, 0);
//     toShaderModel_arrays_inPlace(gecko.current.legs.backLegs.stepTargets, stepsUniform.current, 2, aspect, gecko_scale, 2);

//     // ELBOWS
//      toShaderModel_arrays_inPlace(gecko.current.legs.frontLegs.elbows, elbowsUniform.current, 2, aspect, gecko_scale, 0);
//      toShaderModel_arrays_inPlace(gecko.current.legs.backLegs.elbows, elbowsUniform.current, 2, aspect, gecko_scale, 2);
 
//      // SHOULDERS (doing individually... should I make a different function for these?)
//      toShaderModel_arrays_inPlace(  gecko.current.legs.frontLegs.rotatorJoint0, shouldersUniform.current, 1, aspect, gecko_scale, 0);
//      toShaderModel_arrays_inPlace(  gecko.current.legs.frontLegs.rotatorJoint1, shouldersUniform.current, 1, aspect, gecko_scale, 1);
//      toShaderModel_arrays_inPlace(  gecko.current.legs.backLegs.rotatorJoint0, shouldersUniform.current, 1, aspect, gecko_scale, 2);
//      toShaderModel_arrays_inPlace(  gecko.current.legs.backLegs.rotatorJoint0, shouldersUniform.current, 1, aspect, gecko_scale, 3);

   
//     // const allMuscles = [...f_muscles, ...b_muscles];
//     // toShaderModel_arrays_inPlace(allMuscles, legMusclesRef.current, 8, aspect, gecko_scale);
//     // // copy to uniform for shader
//     // for (let i = 0; i < musclesUniform.current.length; i++) {
//     //   musclesUniform.current[i] = legMusclesRef.current[i];
//     // }

//      toShaderModel_arrays_inPlace(  gecko.current.legs.frontLegs.muscles,  musclesUniform.current, 4, aspect, gecko_scale, 0);
//      toShaderModel_arrays_inPlace(  gecko.current.legs.backLegs.muscles,  musclesUniform.current, 4, aspect, gecko_scale, 4); 
   


//     toShaderModel_arrays_inPlace(gecko.current.legs.frontLegs.fingers[0], fingersUniform.current, 5, aspect, gecko_scale, 0);
//     toShaderModel_arrays_inPlace(gecko.current.legs.frontLegs.fingers[1], fingersUniform.current, 5, aspect, gecko_scale, 5);
//     toShaderModel_arrays_inPlace(gecko.current.legs.backLegs.fingers[0], fingersUniform.current, 5, aspect, gecko_scale, 10);
//     toShaderModel_arrays_inPlace(gecko.current.legs.backLegs.fingers[1], fingersUniform.current, 5, aspect, gecko_scale, 15);

//     toShaderSpace_inplace(leadPoint.current.lead, aspect, scale, leadUniformRef.current, 0);
//     toShaderSpace_inplace(soul.current.soul, aspect, gecko_scale, soulUniformRef.current, 0);
//     toShaderSpace_inplace(moments.current.selected.coord, aspect, scale, selectedUniformRef.current, 0);
//     toShaderSpace_inplace(hintRef.current, aspect, gecko_scale, hintUniformRef.current, 0);
//     toShaderModel_inPlace(snoutRef.current, gecko_scale, snoutUniformRef.current, 0);
//     toShaderModel_inPlace(headRef.current, gecko_scale, headUniformRef.current, 0);

//     packVec2Uniform_withRecenter_moments(moments.current.moments, momentsUniform.current, moments.current.momentsLength, aspect, scale);


//     // 🔹 Scalars (can be read in shaders)
//     uniformsRef.current.u_scale = scale;
//     uniformsRef.current.u_gecko_scale = gecko_scale;
//     uniformsRef.current.u_aspect = aspect;
//     uniformsRef.current.u_resolution[0] = size.width;
//     uniformsRef.current.u_resolution[1] = size.height;
//     uniformsRef.current.u_momentsLength = moments.current.momentsLength;
//   };

//   animate();

//   return () => {
//     cancelled = true;
//     if (frame) cancelAnimationFrame(frame);
//   };
// }, [aspect, gecko_scale, scale, size.width, size.height]);



//   // const uniforms = {
//   //   u_scale: scale,
//   //   u_gecko_scale: gecko_scale,
//   //   u_time: time,
//   //   u_resolution: [width, height],
//   //   u_aspect: aspect,

//   //   u_lead: leadUniformRef.current,
//   //   u_soul: soulUniformRef.current,
//   //   u_selected: selectedUniformRef.current,
//   //   u_lastSelected: moments.current.lastSelected.coord,

//   //   u_snout: snoutUniformRef.current,
//   //   u_head: headUniformRef.current,
//   //   u_hint: hintUniformRef.current,
//   //   u_momentsLength: moments.current.momentsLength, 

//   //   u_joints: jointsUniform.current,
//   //   u_tail: tailUniform.current,
//   //   u_steps: stepsUniform.current,
//   //   u_elbows: elbowsUniform.current,
//   //   u_shoulders: shouldersUniform.current,
//   //   u_muscles: musclesUniform.current,
//   //   u_fingers: fingersUniform.current,
//   //   u_moments: momentsUniform.current,
//   // };

//   const uniformsRef = useRef({
//   u_scale: 1,
//   u_gecko_scale: 1,
//   u_time: 0,
//   u_resolution: [1, 1],
//   u_aspect: 1,

//   u_lead: leadUniformRef.current,
//   u_soul: soulUniformRef.current,
//   u_selected: selectedUniformRef.current,
//   u_lastSelected: moments.current.lastSelected.coord,

//   u_snout: snoutUniformRef.current,
//   u_head: headUniformRef.current,
//   u_hint: hintUniformRef.current,
//   u_momentsLength: 0,

//   u_joints: jointsUniform.current,
//   u_tail: tailUniform.current,
//   u_steps: stepsUniform.current,
//   u_elbows: elbowsUniform.current,
//   u_shoulders: shouldersUniform.current,
//   u_muscles: musclesUniform.current,
//   u_fingers: fingersUniform.current,
//   u_moments: momentsUniform.current,
// });


//   return (
//     <>
//       <GestureDetector gesture={composedGesture}>
//         <View style={StyleSheet.absoluteFill}>
//           <Canvas
//             ref={ref}
//             style={[
//               StyleSheet.absoluteFill,
//               {
//                 alignItems: "center",
//               },
//             ]}
//           >
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
//                 uniforms={uniformsRef.current}
//               ></Shader>
//             </Rect>
//           </Canvas>

//           <Canvas
//             ref={ref}
//             style={[
//               StyleSheet.absoluteFill,
//               {
//                 alignItems: "center",
//               },
//             ]}
//           >
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
//                 uniforms={uniformsRef.current}
//               ></Shader>
//             </Rect>
//           </Canvas>
//         </View>
//       </GestureDetector>
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
//   resetterContainer: { position: "absolute", bottom: 200, right: 16 },
 
// });

// // export default MomentsSkia;

// const MemoizedMomentsSkia = React.memo(MomentsSkia);
// export default MemoizedMomentsSkia;
