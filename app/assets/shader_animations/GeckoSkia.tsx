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
// import { packGeckoOnly } from "./animUtils"; 
// import { GECKO_ONLY_TRANSPARENT_SKSL_OPT } from "./shaderCode/welcomeScreen_geckoOnlyOpt";
// import { BackHandler } from "react-native";
// import { useFocusEffect } from "@react-navigation/native"; 
// import { runOnJS, useSharedValue, useDerivedValue } from "react-native-reanimated";
 
// import { useWindowDimensions } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import {
//   hexToVec3,
//   toShaderModel_inPlace,
//   toShaderSpace_inplace, 
//   toGeckoPointerScaled_inPlace, 
// } from "./animUtils";
// import { Gesture, GestureDetector } from "react-native-gesture-handler";
// import { 
//   Canvas,
//   useCanvasSize, 
//   Shader,
//   Rect,
//   Skia,
// } from "@shopify/react-native-skia";

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

// const GeckoSkia = ({
 
//   color1,
//   color2,
//   bckgColor1,
//   bckgColor2, 
//   startingCoord,
//   restPoint,
//   scale = 1,
//   gecko_scale = 1, 
//   gecko_size = 1.2,
//   reset = 0,
// }: Props) => { 

 
//   const { width, height } = useWindowDimensions();
//   const { ref, size } = useCanvasSize();
//   // const aspect = size.width > 0 ? size.width / size.height : null;

// // initializes with the dimensions aspect first to prevent errors
// const [aspect, setAspect] = useState<number>(width / height); 
 

// useEffect(() => {
//   console.log('set aspect');
  
//   if (size && size.width > 0 && size.height > 0) {
//     const newAspect = size.width / size.height;
//     console.log('Setting aspect to:', newAspect);
//     setAspect(newAspect);
//   } else {
//     console.log(`canvas size is NAN? `, size);
//   }
// }, [size]);

 

//   const updateTrigger = useSharedValue(0);
//   const lastRenderRef = useRef(0);

//   useFocusEffect(
//     useCallback(() => {
//       return () => {
//         isDragging.value = false;
//       };
//     }, []),
//   );

//   // const insets = useSafeAreaInsets();
//   useFocusEffect(
//     useCallback(() => {
//       const subscription = BackHandler.addEventListener(
//         "hardwareBackPress",
//         () => {
//           return true;
//         },
//       );

//       return () => {
//         subscription.remove();
//       };
//     }, []),
//   );

 
 
//   const userPointSV = useSharedValue(restPoint); 
//   const userPoint_geckoSpaceRef = useRef<[number, number]>([0, 0]);
//   const isDragging = useSharedValue(false);

//   const onDoublePress = () => {
//     console.log(`Doublepress tapped!`);
//   }
 
 
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
 
//   const color1Converted = hexToVec3(color1);
//   const color2Converted = hexToVec3(color2);
//   const bckgColor1Converted = hexToVec3(bckgColor1);
//   const bckgColor2Converted = hexToVec3(bckgColor2);

//   // Keep simulation objects as refs (they don't go into uniforms)
//   const soul = useRef(new Soul(restPoint, 0.02));
//   const leadPoint = useRef(new Mover(startingCoord));
//   const gecko = useRef(new Gecko(startingCoord, 0.06)); 
  


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

 

//   if (!source) {
//     console.error("❌ Shader failed to compile");
//     return null;
//   }

//   const start = useRef(Date.now()); 
//   const TOTAL_GECKO_POINTS = 71;
//   const MAX_MOMENTS = 40;

//   // Keep working buffers as refs (intermediate calculations)
//   const hintRef = useRef([0, 0]); 

//   // CONVERT TO SHARED VALUES - these will be read by useDerivedValue
//   // const leadUniformSV = useSharedValue(new Float32Array(2));
//   // const leadScreenSpaceUniformSV = useSharedValue(new Float32Array(2));
//   // const soulUniformSV = useSharedValue(new Float32Array(2));
//   // const selectedUniformSV = useSharedValue(new Float32Array(2));
//   // const lastSelectedUniformSV = useSharedValue(new Float32Array(2));
//   // const hintUniformSV = useSharedValue(new Float32Array(2));
//   // const momentsUniformSV = useSharedValue(new Array(MAX_MOMENTS * 2).fill(0));
//   // const geckoPointsUniformSV = useSharedValue(new Array(TOTAL_GECKO_POINTS * 2).fill(0));
//   // const momentsLengthSV = useSharedValue(0);


// const leadUniformSV = useSharedValue(new Float32Array([0., 0.]));
// const leadScreenSpaceUniformSV = useSharedValue(new Float32Array([0., 0.]));
// const soulUniformSV = useSharedValue(new Float32Array([0., 0.]));
// const selectedUniformSV = useSharedValue(new Float32Array([0., 0.]));
// const lastSelectedUniformSV = useSharedValue(new Float32Array([0., 0.]));


// const hintUniformSV = useSharedValue(new Float32Array([0., 0.])); 
// const geckoPointsUniformSV = useSharedValue(Array(TOTAL_GECKO_POINTS * 2).fill(0));
 
 

//   const [internalReset, setInternalReset] = useState(0); // initialize to null or else will just immediately reset every time nav to this screen
//   const handleReset = () => {
//     setInternalReset(Date.now());
//   };

 

//   useEffect(() => {

//     console.log('RESET EFFECT RAN !!!');
//     if (!internalReset && !reset) {
//       console.log('conditions not met for a reset');
//       return;
//     } else {
//       console.log('TRUE RESET');
//     }

//     start.current = Date.now();
//     // setTime(0);
 
//     soul.current = new Soul(restPoint, 0.02);
//     leadPoint.current = new Mover(startingCoord);
//     gecko.current = new Gecko(startingCoord, 0.06);

 


//     leadUniformSV.value = (new Float32Array([0, 0]));
// leadScreenSpaceUniformSV.value = (new Float32Array([0, 0]));
//  soulUniformSV.value = (new Float32Array([0, 0]));
//  selectedUniformSV.value = (new Float32Array([0, 0]));
//  lastSelectedUniformSV.value = (new Float32Array([0, 0]));
//  hintUniformSV.value = (new Float32Array([0, 0])); 
//  geckoPointsUniformSV.value = (Array(TOTAL_GECKO_POINTS * 2).fill(0));
 

//     userPointSV.value = restPoint;
//     userPoint_geckoSpaceRef.current[0] = startingCoord[0];
//     userPoint_geckoSpaceRef.current[1] = startingCoord[1];
//   }, [reset, internalReset]);

//   useEffect(() => {
//     let cancelled = false;
//     let frame;

//     const animate = () => {
//       if (cancelled) return;

// if (aspect == null || isNaN(aspect)) {
//   console.log('aspect is null or NaN! QUITTING the animation', aspect);
//   frame = requestAnimationFrame(animate);

//   return;
// } 
// // else {
//     // console.log('aspect exists in animation -- continuing', aspect)
// // }

//       // Update gecko pointer position
//       toGeckoPointerScaled_inPlace(
//         userPointSV.value,
//         aspect,
//         scale,
//         gecko_size,
//         userPoint_geckoSpaceRef.current, 
//         0
//       );

//       // SOUL AND GECKO ENTER ANIMATION
//       if (soul.current.done && !gecko.current.oneTimeEnterComplete) {
//         gecko.current.updateEnter(soul.current.done);
//       } else {
//         soul.current.update();
//       }
      
//       // LEAD POINT
//       if (gecko.current.oneTimeEnterComplete) {
//         leadPoint.current.update(userPoint_geckoSpaceRef.current);
//       } else {
//         leadPoint.current.update(soul.current.soul);
//       }

//       // BODY AND LEGS
//       gecko.current.update(
//         leadPoint.current.lead,
//         leadPoint.current.leadDistanceTraveled,
//         leadPoint.current.isMoving
//       );

//       const spine = gecko.current.body.spine; 
//       hintRef.current = spine.hintJoint || [0, 0];
   
  
//       const newSoul = new Float32Array(2);
//       toShaderSpace_inplace(soul.current.soul, aspect, gecko_scale, newSoul, 0);
//       soulUniformSV.value = newSoul;

//       const newHint = new Float32Array(2);
//       toShaderSpace_inplace(hintRef.current, aspect, gecko_scale, newHint, 0);
//       hintUniformSV.value = newHint;

//       const newLead = new Float32Array(2);
//       toShaderModel_inPlace(leadPoint.current.lead, aspect, gecko_scale, newLead, 0);
//       leadUniformSV.value = newLead;

//       const newLeadScreenSpace = new Float32Array(2);
//       toShaderSpace_inplace(leadPoint.current.lead, aspect, scale, newLeadScreenSpace, 0);
//       leadScreenSpaceUniformSV.value = newLeadScreenSpace;

//       const newSelected = new Float32Array(2);

   

//       // Create new arrays for gecko points and moments
//       const newGeckoPoints = new Array(TOTAL_GECKO_POINTS * 2).fill(0);
//       packGeckoOnly(gecko.current, newGeckoPoints, gecko_scale);
//       geckoPointsUniformSV.value = newGeckoPoints;

 

//       // Trigger shader update only when moving
//       if (leadPoint.current.isMoving || isDragging.value) {
//         const now = Date.now();
//        if (now - lastRenderRef.current > 16) { // ~60fps
   
//           lastRenderRef.current = now;
//           updateTrigger.value += 1;
//       }
//       }

//       frame = requestAnimationFrame(animate);
//     };

//     animate();

//     return () => {
//       cancelled = true;
//       if (frame) cancelAnimationFrame(frame);
//     };
//   }, [aspect, gecko_scale, scale, size.width, size.height]);
 
 

//   const uniforms = useDerivedValue(() => {
//   updateTrigger.value;
   
//   if (!size.width || !size.height) {
//     return {
//       u_scale: scale,
//       u_gecko_scale: gecko_scale,
//       u_time: 0,
//       u_resolution: [width, height], // Use window dimensions as fallback
//       u_aspect: aspect || 1,
//       u_lead: [-100, -100],
//       u_lead_screen_space: [-100, -100],
//       u_soul: [-100, -100],
//       u_selected: [-100, -100],
//       u_lastSelected: [-100, -100],
//       u_hint: [-100, -100], 
//       u_geckoPoints: Array(TOTAL_GECKO_POINTS * 2).fill(0),
//     };
//   }
  
//   return {
//     u_scale: scale,
//     u_gecko_scale: gecko_scale,
//     u_gecko_size: gecko_size,
//     u_time: (Date.now() - start.current) / 1000,
//     u_resolution: [size.width, size.height],
//     u_aspect: aspect || 1,
//     u_lead: Array.from(leadUniformSV.value),
//     u_lead_screen_space: Array.from(leadScreenSpaceUniformSV.value),
//     u_soul: Array.from(soulUniformSV.value),
//     u_selected: Array.from(selectedUniformSV.value),
//     u_lastSelected: Array.from(lastSelectedUniformSV.value),
//     u_hint: Array.from(hintUniformSV.value), 
//     u_geckoPoints: [...geckoPointsUniformSV.value],
//   };
// }, [scale, gecko_scale, aspect, size.width, size.height, width, height]);

//   return (
//     <>
//       <GestureDetector gesture={composedGesture}>
//          <View style={StyleSheet.absoluteFill}>
       
      

//           <Canvas
//             ref={ref}
//             style={[StyleSheet.absoluteFill]}
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
//                 uniforms={uniforms}
//               />
//             </Rect>
//           </Canvas>
//         </View>
//       </GestureDetector>
      
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   resetterContainer: { position: "absolute", bottom: 200, right: 16 },
// });

// const MemoizedGeckoSkia = React.memo(GeckoSkia);
// export default MemoizedGeckoSkia;


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
import { packGeckoOnly } from "./animUtils"; 
import { GECKO_ONLY_TRANSPARENT_SKSL_OPT } from "./shaderCode/welcomeScreen_geckoOnlyOpt";
import { BackHandler } from "react-native";
import { useFocusEffect } from "@react-navigation/native"; 
import { runOnJS, useSharedValue, useDerivedValue } from "react-native-reanimated";
 
import { useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  hexToVec3,
  toShaderModel_inPlace,
  toShaderSpace_inplace, 
  toGeckoPointerScaled_inPlace, 
} from "./animUtils";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
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
  startingCoord: number[];
  restPoint: number[];
  scale: number;
  reset?: number | null;
};

const GeckoSkia = ({
  color1,
  color2,
  bckgColor1,
  bckgColor2, 
  startingCoord,
  restPoint,
  scale = 1,
  gecko_scale = 1, 
  gecko_size = 1.2,
  reset = 0,
}: Props) => { 
  const { width, height } = useWindowDimensions();
  const { ref, size } = useCanvasSize();

  // initializes with the dimensions aspect first to prevent errors
  const [aspect, setAspect] = useState<number>(width / height); 

  useEffect(() => {
    console.log('set aspect');
    
    if (size && size.width > 0 && size.height > 0) {
      const newAspect = size.width / size.height;
      console.log('Setting aspect to:', newAspect);
      setAspect(newAspect);
    } else {
      console.log(`canvas size is NAN? `, size);
    }
  }, [size]);

  const updateTrigger = useSharedValue(0);
  const lastRenderRef = useRef(0);

  useFocusEffect(
    useCallback(() => {
      return () => {
        isDragging.value = false;
      };
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          return true;
        },
      );

      return () => {
        subscription.remove();
      };
    }, []),
  );

  const userPointSV = useSharedValue(restPoint); 
  const userPoint_geckoSpaceRef = useRef<[number, number]>([0, 0]);
  const isDragging = useSharedValue(false);

  const onDoublePress = () => {
    console.log(`Doublepress tapped!`);
  }
 
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

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => runOnJS(onDoublePress)());

  const composedGesture = Gesture.Simultaneous(panGesture, doubleTapGesture);
 
  const color1Converted = hexToVec3(color1);
  const color2Converted = hexToVec3(color2);
  const bckgColor1Converted = hexToVec3(bckgColor1);
  const bckgColor2Converted = hexToVec3(bckgColor2);

  // Keep simulation objects as refs (they don't go into uniforms)
  const soul = useRef(new Soul(restPoint, 0.02));
  const leadPoint = useRef(new Mover(startingCoord));
  const gecko = useRef(new Gecko(startingCoord, 0.06)); 

  const SHARED_SKSL_PRELUDE = (
    c1: string,
    c2: string,
    b1: string,
    b2: string,
  ) => `
  vec3 startColor = vec3(${c1});
  vec3 endColor = vec3(${c2});
  vec3 backgroundStartColor = vec3(${b1});
  vec3 backgroundEndColor = vec3(${b2});
`;

  const source = useMemo(() => {
    return Skia.RuntimeEffect.Make(`
    ${SHARED_SKSL_PRELUDE(
      color1Converted,
      color2Converted,
      bckgColor1Converted,
      bckgColor2Converted,
    )}
    ${GECKO_ONLY_TRANSPARENT_SKSL_OPT}
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
  const TOTAL_GECKO_POINTS = 71;
  const MAX_MOMENTS = 40;

  // Keep working buffers as refs (intermediate calculations)
  const hintRef = useRef([0, 0]); 

  const leadUniformSV = useSharedValue(new Float32Array([0., 0.]));
  const leadScreenSpaceUniformSV = useSharedValue(new Float32Array([0., 0.]));
  const soulUniformSV = useSharedValue(new Float32Array([0., 0.]));
  const selectedUniformSV = useSharedValue(new Float32Array([0., 0.]));
  const lastSelectedUniformSV = useSharedValue(new Float32Array([0., 0.]));
  const hintUniformSV = useSharedValue(new Float32Array([0., 0.])); 
  const geckoPointsUniformSV = useSharedValue(Array(TOTAL_GECKO_POINTS * 2).fill(0));

  const [internalReset, setInternalReset] = useState(0);
  const handleReset = () => {
    setInternalReset(Date.now());
  };

  useEffect(() => {
    console.log('RESET EFFECT RAN !!!');
    if (!internalReset && !reset) {
      console.log('conditions not met for a reset');
      return;
    } else {
      console.log('TRUE RESET');
    }

    start.current = Date.now();
 
    soul.current = new Soul(restPoint, 0.02);
    leadPoint.current = new Mover(startingCoord);
    gecko.current = new Gecko(startingCoord, 0.06);

    leadUniformSV.value = (new Float32Array([0, 0]));
    leadScreenSpaceUniformSV.value = (new Float32Array([0, 0]));
    soulUniformSV.value = (new Float32Array([0, 0]));
    selectedUniformSV.value = (new Float32Array([0, 0]));
    lastSelectedUniformSV.value = (new Float32Array([0, 0]));
    hintUniformSV.value = (new Float32Array([0, 0])); 
    geckoPointsUniformSV.value = (Array(TOTAL_GECKO_POINTS * 2).fill(0));

    userPointSV.value = restPoint;
    userPoint_geckoSpaceRef.current[0] = startingCoord[0];
    userPoint_geckoSpaceRef.current[1] = startingCoord[1];
  }, [reset, internalReset]);

  // Cleanup effect for refs
  useEffect(() => {
    return () => {
      console.log('Cleaning up GeckoSkia refs');
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

      if (aspect == null || isNaN(aspect)) {
        console.log('aspect is null or NaN! QUITTING the animation', aspect);
        frame = requestAnimationFrame(animate);
        return;
      }

      // Add safety checks for refs
      if (!soul.current || !leadPoint.current || !gecko.current) {
        console.log('Refs are null, stopping animation');
        return; // Don't schedule next frame if refs are gone
      }

      // Update gecko pointer position
      toGeckoPointerScaled_inPlace(
        userPointSV.value,
        aspect,
        scale,
        gecko_size,
        userPoint_geckoSpaceRef.current, 
        0
      );

      // SOUL AND GECKO ENTER ANIMATION
      if (soul.current.done && !gecko.current.oneTimeEnterComplete) {
        gecko.current.updateEnter(soul.current.done);
      } else {
        soul.current.update();
      }
      
      // LEAD POINT
      if (gecko.current.oneTimeEnterComplete) {
        leadPoint.current.update(userPoint_geckoSpaceRef.current);
      } else {
        leadPoint.current.update(soul.current.soul);
      }

      // BODY AND LEGS
      gecko.current.update(
        leadPoint.current.lead,
        leadPoint.current.leadDistanceTraveled,
        leadPoint.current.isMoving
      );

      const spine = gecko.current.body.spine; 
      hintRef.current = spine.hintJoint || [0, 0];
  
      const newSoul = new Float32Array(2);
      toShaderSpace_inplace(soul.current.soul, aspect, gecko_scale, newSoul, 0);
      soulUniformSV.value = newSoul;

      const newHint = new Float32Array(2);
      toShaderSpace_inplace(hintRef.current, aspect, gecko_scale, newHint, 0);
      hintUniformSV.value = newHint;

      const newLead = new Float32Array(2);
      toShaderModel_inPlace(leadPoint.current.lead, aspect, gecko_scale, newLead, 0);
      leadUniformSV.value = newLead;

      const newLeadScreenSpace = new Float32Array(2);
      toShaderSpace_inplace(leadPoint.current.lead, aspect, scale, newLeadScreenSpace, 0);
      leadScreenSpaceUniformSV.value = newLeadScreenSpace;

      // Create new arrays for gecko points
      const newGeckoPoints = new Array(TOTAL_GECKO_POINTS * 2).fill(0);
      packGeckoOnly(gecko.current, newGeckoPoints, gecko_scale);
      geckoPointsUniformSV.value = newGeckoPoints;

      // Trigger shader update only when moving
      if (leadPoint.current.isMoving || isDragging.value) {
        const now = Date.now();
        if (now - lastRenderRef.current > 16) { // ~60fps
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
        u_time: 0,
        u_resolution: [width, height], // Use window dimensions as fallback
        u_aspect: aspect || 1,
        u_lead: [-100, -100],
        u_lead_screen_space: [-100, -100],
        u_soul: [-100, -100],
        u_selected: [-100, -100],
        u_lastSelected: [-100, -100],
        u_hint: [-100, -100], 
        u_geckoPoints: Array(TOTAL_GECKO_POINTS * 2).fill(0),
      };
    }
    
    return {
      u_scale: scale,
      u_gecko_scale: gecko_scale,
      u_gecko_size: gecko_size,
      u_time: (Date.now() - start.current) / 1000,
      u_resolution: [size.width, size.height],
      u_aspect: aspect || 1,
      u_lead: Array.from(leadUniformSV.value),
      u_lead_screen_space: Array.from(leadScreenSpaceUniformSV.value),
      u_soul: Array.from(soulUniformSV.value),
      u_selected: Array.from(selectedUniformSV.value),
      u_lastSelected: Array.from(lastSelectedUniformSV.value),
      u_hint: Array.from(hintUniformSV.value), 
      u_geckoPoints: [...geckoPointsUniformSV.value],
    };
  }, [scale, gecko_scale, gecko_size, aspect, size.width, size.height, width, height]);

  return (
    <>
      <GestureDetector gesture={composedGesture}>
        <View style={StyleSheet.absoluteFill}>
          <Canvas
            ref={ref}
            style={[StyleSheet.absoluteFill]}
          >
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
    </>
  );
};

const styles = StyleSheet.create({
  resetterContainer: { position: "absolute", bottom: 200, right: 16 },
});

const MemoizedGeckoSkia = React.memo(GeckoSkia);
export default MemoizedGeckoSkia;