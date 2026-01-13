import { View, Text, Dimensions, StyleSheet } from "react-native";
import React, { useEffect, useRef, useCallback, useState } from "react";
import Soul from "./soulClass";
import Mover from "./leadPointClass";
import Gecko from "./geckoClass";
import Moments from "./momentsClass";
import { BackHandler } from "react-native";
import Animated, { useAnimatedStyle, useDerivedValue } from "react-native-reanimated";
import { useFocusEffect } from "@react-navigation/native";
import useEditMoment from "@/src/hooks/CapsuleCalls/useEditMoment";
import { runOnJS, useSharedValue } from "react-native-reanimated";
import { useWindowDimensions } from "react-native";

 import { useSafeAreaInsets } from "react-native-safe-area-context";
 

import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  usePathValue,
  Canvas,
  useCanvasSize,
  Path,
  useFont,
  processTransform3d,
  Shader,
  Rect,
  Skia,
  vec,
  useClock,
} from "@shopify/react-native-skia";
import { Poppins_400Regular } from "@expo-google-fonts/poppins";
import { useFrameCallback } from "react-native-reanimated";

  const { width, height } = Dimensions.get("window");

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
 

type Props = {
  color1: string;
  color2: string;
  momentsData: [];
  startingCoord: number[];
  restPoint: number[];
  scale: number;
  reset?: number | null;
};

// steps to painting a Skia canvas!
//

function packVec2Uniform_withRecenter(points, flatArray, num, aspect = 1, scale) {
 
  for (let i = 0; i < num; i++) {
    if (points[i]) {
      const recenteredX = points[i][0] - 0.5;
      const recenteredY = points[i][1] - 0.5;

      flatArray[i * 2 + 0] = recenteredX * aspect; // exactly like shader
      flatArray[i * 2 + 1] = recenteredY ;
    } else {
      flatArray[i * 2 + 0] = 0.0;
      flatArray[i * 2 + 1] = 0.0;
    }
  }
}





function packVec2Uniform_withRecenter_moments(points, flatArray, num, aspect = 1, scale = 1) {
  for (let i = 0; i < num; i++) {
    if (points[i]) {
      const recenteredX = points[i].coord[0] - 0.5;
      const recenteredY = points[i].coord[1] - 0.5;

      flatArray[i * 2 + 0] = recenteredX * aspect ; // x multiplied by aspect and optional scale
      flatArray[i * 2 + 1] = recenteredY  ;          // y multiplied by optional scale only
    } else {
      flatArray[i * 2 + 0] = 0.0;
      flatArray[i * 2 + 1] = 0.0;
    }
  }
}


const hexToVec3 = (hex) => {
  // Remove '#' if present
  const cleanHex = hex.replace("#", "");
  // Parse R, G, B as integers
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  return `${r.toFixed(4)}, ${g.toFixed(4)}, ${b.toFixed(4)}`;
};


// LIMIT OF 64 MOMENTS RIGHT NOW
// TO ALLOW FOR DYNAMIC UPDATING WOULD MEAN TO RESET SHADER EVERY SINGLE TIME WHICH CAN BE EXPENSIVE
// would do this in shader instead of current setup -->  uniform vec2 u_moments[${moments.length}];
const MomentsSkia = ({
 handleEditMoment,
  color1,
  color2,
  momentsData = [], //mapped list of capsuleList with just the id and a field combining x and y 
  startingCoord,
  restPoint,
  scale = 1,
  reset=0,
}: Props) => {
// console.log(momentsData);


const { width, height } = useWindowDimensions();
  const { ref, size } = useCanvasSize(); // size = { width, height }
 
 
const insets = useSafeAreaInsets();
useFocusEffect(
  useCallback(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        // block system back
        return true;
      }
    );

    return () => {
      subscription.remove();
    };
  }, [])
);
const handleUpdateMomentCoords = (oldMoments, newMoments) => {
  const oldMomentsMap = oldMoments.reduce((acc, moment) => {
    acc[moment.id] = moment;
    return acc;
  }, {});

  newMoments.forEach((newMoment) => {
    const oldMoment = oldMomentsMap[newMoment.id];

    // only update if coordinates differ by more than a tiny epsilon
    const epsilon = 1e-5;
    const hasChanged =
      !oldMoment ||
      Math.abs(oldMoment.coord[0] - newMoment.coord[0]) > epsilon ||
      Math.abs(oldMoment.coord[1] - newMoment.coord[1]) > epsilon;

    if (hasChanged) {
      console.log(`Updating pos for moment ${newMoment.id} on backend!`);

      const newCoordData = {
        screen_x: newMoment.coord[0],
        screen_y: newMoment.coord[1],
      };

      handleEditMoment(newMoment.id, newCoordData);
    }
  });
};


useFocusEffect(
  useCallback(() => {
    // This runs when the screen comes into focus
    // console.log("Screen is focused", moments.current.moments[0]);

    return () => {


      // This runs when the screen loses focus
      handleUpdateMomentCoords(momentsData, moments.current.moments);
    //   console.log("Screen is unfocused or navigated away", moments.current.moments);
      // You can reset state, stop animations, or disengage drags here
    };
  }, [])
);

 

  const userPointSV = useSharedValue(restPoint); 
 

  const momentsLength = momentsData.length; 

const isDragging = useSharedValue(false); // tracks if screen is being touched
  

const gesture = Gesture.Pan()
  .onTouchesDown((e) => {
    // Finger just touched: mark dragging and update userPoint immediately
    isDragging.value = true;
    const touch = e.changedTouches[0];
 console.log('touchdown');
    userPointSV.value = [touch.x / size.width, touch.y / size.height];

  })
  .onUpdate((e) => {
    // Normal drag update
    userPointSV.value = [e.x / size.width, e.y / size.height];
    
   
    
  })
  .onEnd(() => {
    isDragging.value = false; // finger lifted
  })
  .onFinalize(() => {
    isDragging.value = false; // safety: ensure false if gesture cancelled
  });


const onLongPress = () => {
    console.log('onLongPress works!')
    console.log(moments.current.selected)
        console.log(moments.current.lastSelected)
    

};

const onDoublePress = () => {
    console.log('onDoublePress works!')

    
    

};

// const panGesture = Gesture.Pan()
//   .onTouchesDown((e) => {
//     isDragging.value = true;
//     const t = e.changedTouches[0];
//     userPointSV.value = [t.x / width, t.y / height];
//   })
//   .onUpdate((e) => {
//     userPointSV.value = [e.x / width, e.y / height];
//   })
//   .onEnd(() => {
//     isDragging.value = false;
//   })
//   .onFinalize(() => {
//     isDragging.value = false;
//   });

// const doubleTapGesture = Gesture.Tap()
//   .numberOfTaps(2)
//   .onEnd(() => {
//     runOnJS(onDoublePress)();
//   });

// const longPressGesture = Gesture.LongPress()
//   .minDuration(350)
//   .onStart(() => {
//     runOnJS(onLongPress)();
//   });


//   const composedGesture = Gesture.Simultaneous(
//   panGesture,
//   Gesture.Exclusive(
//     doubleTapGesture,
//     // longPressGesture
//   )
// );

  const [time, setTime] = useState(0);
  const color1Converted = hexToVec3(color1);
  const color2Converted = hexToVec3(color2); 

  const soul = useRef(new Soul(restPoint, .02));
  const leadPoint = useRef(new Mover(startingCoord));
  const gecko = useRef(new Gecko(startingCoord, 0.06));
  const moments = useRef(new Moments(momentsData, [.5,.5], .05));


//  const aspect = size.width / size.height;


 const [aspect, setAspect] = useState<number | null>(null);

useEffect(() => {
  
  setAspect(size.width / size.height);
}, [size]);


function toShaderSpace([x, y], aspect, scale) {
  let sx = x - 0.5;
  let sy = y - 0.5;

  sx *= aspect;
  sx /= scale;
  sy /= scale;

  return [sx, sy];
}


  const source = Skia.RuntimeEffect.Make(`
    vec3 startColor = vec3(${color1Converted});
    vec3 endColor = vec3(${color2Converted});

 
    uniform vec2 u_moments[64]; // HARD CODED MAX
    uniform int u_momentsLength;
    uniform vec2 u_selected;
    uniform vec2 u_lastSelected;


    uniform float u_scale;
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform float u_aspect;
    uniform vec2 u_soul;
    uniform vec2 u_lead;
    uniform vec2 u_joints[15];
    uniform vec2 u_head;
    uniform vec2 u_snout;
    uniform vec2 u_hint;
    uniform vec2 u_tail[13];
 
    uniform vec2 u_steps[4];
    uniform vec2 u_elbows[4];
    uniform vec2 u_shoulders[4];
    uniform vec2 u_muscles[8];
    uniform vec2 u_fingers[20];

  
    float TWO_PI = 6.28318530718;
    
    float distFCircle(vec2 uv, vec2 center, float radius) {
      return length(uv - center) - radius;
    }

 
float smoothMin(float a, float b, float k) {
  //clamp --> x, minVal, maxVal
    float h = clamp(0.5 + 0.5*(b - a)/k, 0.0, 1.0);
    return mix(b, a, h) - k*h*(1.0 - h);
}

float lineSegmentSDF(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp(dot(pa, ba)/dot(ba,ba), 0.0, 1.0);
    return length(pa - ba*h);
}


half4 main(vec2 fragCoord) {
    // vec2 uv = (fragCoord - 0.5 * u_resolution) / u_resolution.y;
    //  uv /= u_scale;
   
      vec2 uv = fragCoord / u_resolution; 
      
      uv -= vec2(0.5); 
      uv.x *= u_aspect;
     uv /= u_scale; // scale everything
 
 
    // vec2 soulUV = u_soul - vec2(0.5);
    // vec2 leadUV = u_lead - vec2(0.5);
    // vec2 hintUV = u_hint - vec2(.5);
    // vec2 snoutUV = u_snout - vec2(0.5);
    // vec2 headUV = u_head - vec2(0.5);

    // vec2 selectedUV = u_selected - vec2(.5);
    // vec2 lastSelectedUV = u_lastSelected - vec2(.5);

vec2 soulUV        = u_soul;// - vec2(0.5); soulUV.x *= u_aspect;
vec2 leadUV        = u_lead;// - vec2(0.5); leadUV.x *= u_aspect;
vec2 hintUV        = u_hint - vec2(0.5); hintUV.x *= u_aspect;
vec2 snoutUV       = u_snout - vec2(0.5); //snoutUV.x *= u_aspect;
vec2 headUV        = u_head - vec2(0.5); //headUV.x *= u_aspect;

vec2 selectedUV     = u_selected;//- vec2(0.5); selectedUV.x *= u_aspect;
vec2 lastSelectedUV = u_lastSelected;// - vec2(0.5); lastSelectedUV.x *= u_aspect;
 

    vec3 color = vec3(0.0);
    float alpha = 0.0;

    // Lead dot
    float leadMask = step(distance(uv, leadUV), 0.04);
    color += vec3(1.0, 0.0, 0.0) * leadMask;
    alpha = max(alpha, leadMask);

    // Soul dot
    float soulMask = step(distance(uv, soulUV), 0.008);
    color += vec3(0.0, 1.0, 0.0) * soulMask;
    alpha = max(alpha, soulMask);

 
vec3 moments = vec3(0.0); // start with zero

for (int i = 0; i < 64; i++) {
    if (i >= u_momentsLength) continue; // skip extra moments
    float momentsMask = step(distance(uv, u_moments[i]), 0.008);
    moments += startColor * momentsMask; // accumulate
}


    vec3 selected = vec3(0.);
    float selectedMask = step(distance(uv, selectedUV), .03);
    selected += startColor * selectedMask;


    
    vec3 lastSelected = vec3(0.);
    float lastSelectedMask = step(distance(uv, lastSelectedUV), .02);
    lastSelected += startColor * lastSelectedMask;




 
    float circleSizeDiv = .8; // adjust if needed



    float hintMask = step(distance(uv, hintUV), .008);
    vec3 hintDot = startColor * hintMask;
  


    float armThickness = 0.005; 
    float backArmThickness = .007;
    float fingerThickness = 0.0025; 
    
    // in tail
    float blendAmt = 0.054;

    float spineBlend = .054;
    float spineTailBlend = 0.0003;
    float shoulderBlend = 0.01;
    float stepBlend = 0.003;
    float fingerBlend = 0.01;
    float fingerLineBlend = .0025;   
    float muscleBlend = 0.024;   

    float fingerRadius = 0.0015;  
    float stepRadius = .007; 
    float lowerMuscleRadius = .001;
    float upperMuscleRadius = 0.005; // or whatever radius you want
    float backMuscleBlend = .03; // ultimate controller of how much of back upper leg muscle to add
    float backUpperMuscleRadius = .86;
  


    float circle0 = distFCircle(uv, snoutUV, 0.003 / circleSizeDiv);
    float circle1 = distFCircle(uv, headUV, 0.019 / circleSizeDiv);
    float circle1b = distFCircle(uv, u_joints[1], 0.0 / circleSizeDiv);
    float circle2 = distFCircle(uv, u_joints[2], 0.001 / circleSizeDiv);
    float circle3 = distFCircle(uv, u_joints[3], 0.004 / circleSizeDiv);
    float circle4 = distFCircle(uv, u_joints[4], 0.004 / circleSizeDiv);
    float circle5 = distFCircle(uv, u_joints[5], 0.004 / circleSizeDiv);
    float circle6 = distFCircle(uv, u_joints[6], 0.004 / circleSizeDiv);
    float circle7 = distFCircle(uv, u_joints[7], 0.003 / circleSizeDiv);
    float circle8 = distFCircle(uv, u_joints[8], 0.003 / circleSizeDiv);
    float circle9 = distFCircle(uv, u_joints[9], 0.003 / circleSizeDiv);
    float circle10 = distFCircle(uv, u_joints[10], 0.003 / circleSizeDiv);
    float circle11 = distFCircle(uv, u_joints[11], 0.003 / circleSizeDiv);
    float circle12 = distFCircle(uv, u_joints[12], 0.002 / circleSizeDiv);
    float circle13 = distFCircle(uv, u_joints[13], 0.002 / circleSizeDiv);
    float circle14 = distFCircle(uv, u_joints[14], 0.0004 / circleSizeDiv);

    float circleMerge = smoothMin(
        smoothMin(circle0, circle1, 0.03),
        smoothMin(circle1b, circle2, 0.05),
        0.005
    );

    circleMerge = smoothMin(circleMerge, circle3, spineBlend);
    circleMerge = smoothMin(circleMerge, circle4, spineBlend);
    circleMerge = smoothMin(circleMerge, circle5, spineBlend);
    circleMerge = smoothMin(circleMerge, circle6, spineBlend);
    circleMerge = smoothMin(circleMerge, circle7, spineBlend);
    circleMerge = smoothMin(circleMerge, circle8, spineBlend);
    circleMerge = smoothMin(circleMerge, circle9, spineBlend);
   // circleMerge = smoothMin(circleMerge, circle10, spineBlend);
    // circleMerge = smoothMin(circleMerge, circle11, spineBlend);
    //circleMerge = smoothMin(circleMerge, circle12, spineBlend);
   circleMerge = smoothMin(circleMerge, circle13, spineBlend);
   // circleMerge = smoothMin(circleMerge, circle14, spineBlend);


     
    float tailCircle0  = distFCircle(uv, u_tail[0],  0.002 / circleSizeDiv);
    float tailCircle1  = distFCircle(uv, u_tail[1],  0.005 / circleSizeDiv);
    float tailCircle2  = distFCircle(uv, u_tail[2],  0.004 / circleSizeDiv);
    float tailCircle3  = distFCircle(uv, u_tail[3],  0.0042 / circleSizeDiv);
    float tailCircle4  = distFCircle(uv, u_tail[4],  0.005 / circleSizeDiv);
    float tailCircle5  = distFCircle(uv, u_tail[5],  0.005 / circleSizeDiv);
    float tailCircle6  = distFCircle(uv, u_tail[6],  0.005 / circleSizeDiv);
    float tailCircle7  = distFCircle(uv, u_tail[7],  0.004 / circleSizeDiv);
    float tailCircle8  = distFCircle(uv, u_tail[8],  0.0027 / circleSizeDiv);
    float tailCircle9  = distFCircle(uv, u_tail[9],  0.002 / circleSizeDiv);
    float tailCircle10 = distFCircle(uv, u_tail[10], 0.001 / circleSizeDiv);
    float tailCircle11 = distFCircle(uv, u_tail[11], 0.0001 / circleSizeDiv);
    float tailCircle12 = distFCircle(uv, u_tail[12], 0.0001 / circleSizeDiv);

    float tailCircleMerge = smoothMin(
        smoothMin(tailCircle0, tailCircle1, 0.03),
        smoothMin(tailCircle2, tailCircle3, 0.05),
        0.005
    );

    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle4, blendAmt +.04);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle5, blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle6, blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle7, blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle8, blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle9, blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle10, blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle11, blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle12, blendAmt);


    float bodySDF = smoothMin(circleMerge, tailCircleMerge, spineTailBlend);


    // ARMS /////////////////////////////////////////////////////////////////////////////////

    float arm0Upper = lineSegmentSDF(uv, u_joints[2], u_elbows[0]);   
    float arm0Lower = lineSegmentSDF(uv, u_elbows[0], u_steps[0]); 
    float arm1Upper = lineSegmentSDF(uv, u_joints[2], u_elbows[1]);   
    float arm1Lower = lineSegmentSDF(uv, u_elbows[1], u_steps[1]); 
    float arm2Upper = lineSegmentSDF(uv, u_joints[13], u_elbows[2]);   
    float arm2Lower = lineSegmentSDF(uv, u_elbows[2], u_steps[2]); 
    float arm3Upper = lineSegmentSDF(uv, u_joints[13], u_elbows[3]);   
    float arm3Lower = lineSegmentSDF(uv, u_elbows[3], u_steps[3]); 


    float arm0SDF = min(arm0Upper, arm0Lower) - armThickness;
    float arm1SDF = min(arm1Upper, arm1Lower) - armThickness;
    float arm2SDF = min(arm2Upper, arm2Lower) - backArmThickness;
    float arm3SDF = min(arm3Upper, arm3Lower) - backArmThickness;

    bodySDF = smoothMin(bodySDF, arm0SDF, shoulderBlend);
    bodySDF = smoothMin(bodySDF, arm1SDF, shoulderBlend);
    bodySDF = smoothMin(bodySDF, arm2SDF, shoulderBlend);
    bodySDF = smoothMin(bodySDF, arm3SDF, shoulderBlend);

    // FRONT MUSCLES
    float musclesSDF0 = distFCircle(uv, u_muscles[0], lowerMuscleRadius);
    float musclesSDF1  = distFCircle(uv, u_muscles[1], upperMuscleRadius );
    float musclesSDF2 = distFCircle(uv, u_muscles[2], lowerMuscleRadius);
    float musclesSDF3  = distFCircle(uv, u_muscles[3], upperMuscleRadius );

    // not using these two
   // bodySDF = smoothMin(bodySDF, musclesSDF0 , muscleBlend );
    // bodySDF = smoothMin(bodySDF, musclesSDF2 , muscleBlend );

    bodySDF = smoothMin(bodySDF, musclesSDF1 , muscleBlend ); 
    bodySDF = smoothMin(bodySDF, musclesSDF3 , muscleBlend ); 

    // BACK MUSCLES
    float musclesSDF4 = distFCircle(uv, u_muscles[4], lowerMuscleRadius);
    float musclesSDF5  = distFCircle(uv, u_muscles[5], upperMuscleRadius );
    float musclesSDF6 = distFCircle(uv, u_muscles[6], lowerMuscleRadius);
    float musclesSDF7  = distFCircle(uv, u_muscles[7], upperMuscleRadius );

    // not using these two
    // bodySDF = smoothMin(bodySDF, musclesSDF4 , muscleBlend );
    // bodySDF = smoothMin(bodySDF, musclesSDF6 , muscleBlend );

    bodySDF = smoothMin(bodySDF, musclesSDF5 , backMuscleBlend);
    bodySDF = smoothMin(bodySDF, musclesSDF7 , backMuscleBlend); 



    // STEPS ///////////////////////////////////////////////////////////////////////

    float stepSDF0 = distFCircle(uv, u_steps[0], stepRadius);
    float stepSDF1 = distFCircle(uv, u_steps[1], stepRadius);
    float stepSDF2 = distFCircle(uv, u_steps[2], stepRadius);
    float stepSDF3 = distFCircle(uv, u_steps[3], stepRadius);

    bodySDF = smoothMin(bodySDF, stepSDF0, stepBlend);
    bodySDF = smoothMin(bodySDF, stepSDF1, stepBlend);
    bodySDF = smoothMin(bodySDF, stepSDF2, stepBlend);
    bodySDF = smoothMin(bodySDF, stepSDF3, stepBlend);

    // FINGERS ////////////////////////////////////////////////////////////////////////////

    float fingerLine0 = lineSegmentSDF(uv, u_fingers[0], u_steps[0]) - fingerThickness;
    float fingerLine1 = lineSegmentSDF(uv, u_fingers[1], u_steps[0]) - fingerThickness;
    float fingerLine2 = lineSegmentSDF(uv, u_fingers[2], u_steps[0]) - fingerThickness;
    float fingerLine3 = lineSegmentSDF(uv, u_fingers[3], u_steps[0]) - fingerThickness;
    float fingerLine4 = lineSegmentSDF(uv, u_fingers[4], u_steps[0]) - fingerThickness;

    float fingerLine5 = lineSegmentSDF(uv, u_fingers[5], u_steps[1]) - fingerThickness;
    float fingerLine6 = lineSegmentSDF(uv, u_fingers[6], u_steps[1]) - fingerThickness;
    float fingerLine7 = lineSegmentSDF(uv, u_fingers[7], u_steps[1]) - fingerThickness;
    float fingerLine8 = lineSegmentSDF(uv, u_fingers[8], u_steps[1]) - fingerThickness;
    float fingerLine9 = lineSegmentSDF(uv, u_fingers[9], u_steps[1]) - fingerThickness;

    float fingerLine10 = lineSegmentSDF(uv, u_fingers[10], u_steps[2]) - fingerThickness;
    float fingerLine11 = lineSegmentSDF(uv, u_fingers[11], u_steps[2]) - fingerThickness;
    float fingerLine12 = lineSegmentSDF(uv, u_fingers[12], u_steps[2]) - fingerThickness;
    float fingerLine13 = lineSegmentSDF(uv, u_fingers[13], u_steps[2]) - fingerThickness;
    float fingerLine14 = lineSegmentSDF(uv, u_fingers[14], u_steps[2]) - fingerThickness;

    float fingerLine15 = lineSegmentSDF(uv, u_fingers[15], u_steps[3]) - fingerThickness;
    float fingerLine16 = lineSegmentSDF(uv, u_fingers[16], u_steps[3]) - fingerThickness;
    float fingerLine17 = lineSegmentSDF(uv, u_fingers[17], u_steps[3]) - fingerThickness;
    float fingerLine18 = lineSegmentSDF(uv, u_fingers[18], u_steps[3]) - fingerThickness;
    float fingerLine19 = lineSegmentSDF(uv, u_fingers[19], u_steps[3]) - fingerThickness;

    bodySDF = smoothMin(bodySDF, fingerLine0, fingerLineBlend );
    bodySDF = smoothMin(bodySDF, fingerLine1,fingerLineBlend );
    bodySDF = smoothMin(bodySDF, fingerLine2, fingerLineBlend );
    bodySDF = smoothMin(bodySDF, fingerLine3, fingerLineBlend );
    bodySDF = smoothMin(bodySDF, fingerLine4, fingerLineBlend);
    
    bodySDF = smoothMin(bodySDF, fingerLine5, fingerLineBlend );
    bodySDF = smoothMin(bodySDF, fingerLine6, fingerLineBlend );
    bodySDF = smoothMin(bodySDF, fingerLine7, fingerLineBlend );
    bodySDF = smoothMin(bodySDF, fingerLine8, fingerLineBlend );
    bodySDF = smoothMin(bodySDF, fingerLine9, fingerLineBlend);
    
    bodySDF = smoothMin(bodySDF, fingerLine10, fingerLineBlend );
    bodySDF = smoothMin(bodySDF, fingerLine11, fingerLineBlend );
    bodySDF = smoothMin(bodySDF, fingerLine12, fingerLineBlend );
    bodySDF = smoothMin(bodySDF, fingerLine13, fingerLineBlend );
    bodySDF = smoothMin(bodySDF, fingerLine14, fingerLineBlend);
    
    bodySDF = smoothMin(bodySDF, fingerLine15, fingerLineBlend );
    bodySDF = smoothMin(bodySDF, fingerLine16, fingerLineBlend );
    bodySDF = smoothMin(bodySDF, fingerLine17, fingerLineBlend );
    bodySDF = smoothMin(bodySDF, fingerLine18, fingerLineBlend );
    bodySDF = smoothMin(bodySDF, fingerLine19, fingerLineBlend);


      // F LEFT
      float fingerSDF0 = distFCircle(uv, u_fingers[0], fingerRadius);
      float fingerSDF1 = distFCircle(uv, u_fingers[1], fingerRadius);
      float fingerSDF2 = distFCircle(uv, u_fingers[2], fingerRadius);
      float fingerSDF3 = distFCircle(uv, u_fingers[3], fingerRadius);
      float fingerSDF4 = distFCircle(uv, u_fingers[4], fingerRadius); 
      // F RIGHT
      float fingerSDF5 = distFCircle(uv, u_fingers[5], fingerRadius);
      float fingerSDF6 = distFCircle(uv, u_fingers[6], fingerRadius);
      float fingerSDF7 = distFCircle(uv, u_fingers[7], fingerRadius);
      float fingerSDF8 = distFCircle(uv, u_fingers[8], fingerRadius);
      float fingerSDF9 = distFCircle(uv, u_fingers[9], fingerRadius); 
      // B LEFT
      float fingerSDF10 = distFCircle(uv, u_fingers[10], fingerRadius);
      float fingerSDF11 = distFCircle(uv, u_fingers[11], fingerRadius);
      float fingerSDF12 = distFCircle(uv, u_fingers[12], fingerRadius);
      float fingerSDF13 = distFCircle(uv, u_fingers[13], fingerRadius);
      float fingerSDF14 = distFCircle(uv, u_fingers[14], fingerRadius);
      // BACK r
      float fingerSDF15 = distFCircle(uv, u_fingers[15], fingerRadius);
      float fingerSDF16 = distFCircle(uv, u_fingers[16], fingerRadius);
      float fingerSDF17 = distFCircle(uv, u_fingers[17], fingerRadius);
      float fingerSDF18 = distFCircle(uv, u_fingers[18], fingerRadius);
      float fingerSDF19 = distFCircle(uv, u_fingers[19], fingerRadius);

      bodySDF = smoothMin(bodySDF, fingerSDF0, fingerBlend);
      bodySDF = smoothMin(bodySDF, fingerSDF1, fingerBlend);
       bodySDF = smoothMin(bodySDF, fingerSDF2, fingerBlend);
      bodySDF = smoothMin(bodySDF, fingerSDF3, fingerBlend);
       bodySDF = smoothMin(bodySDF, fingerSDF4, fingerBlend);

      bodySDF = smoothMin(bodySDF, fingerSDF5, fingerBlend);
      bodySDF = smoothMin(bodySDF, fingerSDF6, fingerBlend);
      bodySDF = smoothMin(bodySDF, fingerSDF7, fingerBlend);
      bodySDF = smoothMin(bodySDF, fingerSDF8, fingerBlend);
      bodySDF = smoothMin(bodySDF, fingerSDF9, fingerBlend);

      bodySDF = smoothMin(bodySDF, fingerSDF10, fingerBlend);
      bodySDF = smoothMin(bodySDF, fingerSDF11, fingerBlend);
      bodySDF = smoothMin(bodySDF, fingerSDF12, fingerBlend);
      bodySDF = smoothMin(bodySDF, fingerSDF13, fingerBlend);
      bodySDF = smoothMin(bodySDF, fingerSDF14, fingerBlend);

      bodySDF = smoothMin(bodySDF, fingerSDF15, fingerBlend);
      bodySDF = smoothMin(bodySDF, fingerSDF16, fingerBlend);
      bodySDF = smoothMin(bodySDF, fingerSDF17, fingerBlend);
      bodySDF = smoothMin(bodySDF, fingerSDF18, fingerBlend);
      bodySDF = smoothMin(bodySDF, fingerSDF19, fingerBlend); 

    ///////////////////////////////////////////////////////////////////////////////////////

    float bodyMask = smoothstep(0.0, 0.002, -bodySDF);
    vec3 body = endColor * bodyMask;
 

    //////////////////////////////////////////////////
 
    color += vec3(0.0, 0.0, 1.0) * bodyMask;
    alpha = max(alpha, bodyMask); 
  
    return vec4( body + hintDot + moments + selected + lastSelected, bodyMask); //bodyMask
} 
`);

  if (!source) {
    console.error("❌ Shader failed to compile");
    return null;
  }

  // const buttonStyle = useAnimatedStyle(() => {
  //   const [u, v] = userPointSV.value;
  //   console.log(userPointSV.value);

  //   return {
  //     zIndex: 9999,
  //     position: "absolute",
  //     left: u * width,
  //     top: v * height,
  //     transform: [{ translateX: -12 }, { translateY: -12 }],
  //   };
  // });

  const start = useRef(Date.now());

  const NUM_SPINE_JOINTS = 15;
  const NUM_TAIL_JOINTS = 13;
  const snoutRef = useRef([0, 0]);
  const headRef = useRef([0, 0]);
  const hintRef = useRef([0, 0]);
  const jointsRef = useRef(new Float32Array(NUM_SPINE_JOINTS * 2));
  const tailJointsRef = useRef(new Float32Array(NUM_TAIL_JOINTS * 2));
  const stepsRef = useRef(new Float32Array(4 * 2));
  const elbowsRef = useRef(new Float32Array(4 * 2));
  const shouldersRef = useRef(new Float32Array(4 * 2));
  const legMusclesRef = useRef(new Float32Array(8 * 2));
  const fingersRef = useRef(new Float32Array(20 * 2));
 

  const MAX_MOMENTS = 64; 
  const momentsRef = useRef(new Float32Array(MAX_MOMENTS * 2));
  const momentsLengthRef = useRef(momentsLength); // good if this dynamically changes (if adding or deleting moments is allowed in this screen)



  useEffect(() => {

    moments.current = new Moments(momentsData);

  }, [momentsData]);

  useEffect(() => {
    if (!reset) return;

    // console.log("🟢 Resetting animation...");

    // Reset time
    start.current = Date.now();
    setTime(0);

    // Reset soul
    soul.current = new Soul(restPoint, 0.02);
    leadPoint.current = new Mover(startingCoord);
    gecko.current = new Gecko(startingCoord, 0.06);
 

    // Optional: clear all joints arrays
    jointsRef.current.fill(0);
    tailJointsRef.current.fill(0);
    stepsRef.current.fill(0);
    elbowsRef.current.fill(0);
    shouldersRef.current.fill(0);
    legMusclesRef.current.fill(0);
    fingersRef.current.fill(0);

    userPointSV.value = restPoint; // must be set to where entrance animation leaves off
  }, [reset]);

  useEffect(() => {

     
    let frame;
    const animate = () => {
      const now = (Date.now() - start.current) / 1000;
      setTime(now); 
      frame = requestAnimationFrame(animate);
         moments.current.update(userPointSV.value, isDragging.value);
      
      soul.current.update();
  

      if (soul.current.done && !gecko.current.oneTimeEnterComplete) {
        gecko.current.updateEnter(soul.current.done);
      }

      if (gecko.current.oneTimeEnterComplete) {
        leadPoint.current.update(userPointSV.value);
      } else {
        leadPoint.current.update(soul.current.soul);
      }
      // leadPoint.current.update(soul.current.soul);
      // leadPoint.current.update(userPointSV.value);

      gecko.current.update(
        leadPoint.current.lead,
        leadPoint.current.leadDistanceTraveled,
        leadPoint.current.isMoving
      );

      // pack spine joints into Float32Array for shader
      const spine = gecko.current.body.spine;
      const tail = gecko.current.body.tail;

      const f_steps = gecko.current.legs.frontLegs.stepTargets;
      const b_steps = gecko.current.legs.backLegs.stepTargets;

      const f_elbows = gecko.current.legs.frontLegs.elbows;
      const b_elbows = gecko.current.legs.backLegs.elbows;

      const f_shoulders = [
        gecko.current.legs.frontLegs.rotatorJoint0,
        gecko.current.legs.frontLegs.rotatorJoint1,
      ];
      const b_shoulders = [
        gecko.current.legs.backLegs.rotatorJoint0,
        gecko.current.legs.backLegs.rotatorJoint1,
      ];

      const f_muscles = gecko.current.legs.frontLegs.muscles;
      const b_muscles = gecko.current.legs.backLegs.muscles;

      const allFingersNested = [
        ...gecko.current.legs.frontLegs.fingers,
        ...gecko.current.legs.backLegs.fingers,
      ];

      snoutRef.current = spine.unchainedJoints[0] || [0, 0];
      headRef.current = spine.unchainedJoints[1] || [0, 0];
      hintRef.current = spine.hintJoint || [0, 0];

      packVec2Uniform_withRecenter(
        spine.joints,
        jointsRef.current,
        NUM_SPINE_JOINTS,
        aspect, 
        scale
      );
      packVec2Uniform_withRecenter(
        tail.joints,
        tailJointsRef.current,
        NUM_TAIL_JOINTS,
        aspect,
        scale
      );
      const allSteps = [...f_steps, ...b_steps];
      packVec2Uniform_withRecenter(allSteps, stepsRef.current, 4, aspect, scale);

      const allElbows = [...f_elbows, ...b_elbows];
      packVec2Uniform_withRecenter(allElbows, elbowsRef.current, 4, aspect, scale);

      const allShoulders = [...f_shoulders, ...b_shoulders];
      packVec2Uniform_withRecenter(allShoulders, shouldersRef.current, 4, aspect, scale);

      const allMuscles = [...f_muscles, ...b_muscles];
      packVec2Uniform_withRecenter(allMuscles, legMusclesRef.current, 8, aspect, scale);

      const allFingers = allFingersNested.flat(); // flattens to 20 [x,y] pairs

      packVec2Uniform_withRecenter(allFingers, fingersRef.current, 20, aspect, scale);


      packVec2Uniform_withRecenter_moments(moments.current.moments, momentsRef.current, moments.current.momentsLength, aspect, scale);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, [aspect]);

  // const snout = gecko.current.body.spine?.unchainedJoints[0];
  // const head = gecko.current.body.spine?.unchainedJoints[1];
  // const hint = gecko.current.body.spine?.hintJoint;

  

  const uniforms = {
    u_scale: scale,
    u_time: time,
    u_resolution: [width, height],
    u_aspect: aspect,


    
    //u_soul: soul.current.soul, // [x, y] position
    //u_lead: leadPoint.current.lead,

u_lead: toShaderSpace(leadPoint.current.lead, aspect, scale),
u_soul: toShaderSpace(soul.current.soul, aspect, scale),
u_selected: toShaderSpace(moments.current.selected.coord, aspect, scale),
u_lastSelected: toShaderSpace(moments.current.lastSelected.coord, aspect, scale),

    

    u_joints: Array.from(jointsRef.current),
    u_tail: Array.from(tailJointsRef.current),

    u_snout: snoutRef.current,
    u_head: headRef.current,
    u_hint: hintRef.current,
 
    u_steps: Array.from(stepsRef.current),
    u_elbows: Array.from(elbowsRef.current),
    u_shoulders: Array.from(shouldersRef.current),
    u_muscles: Array.from(legMusclesRef.current),
    u_fingers: Array.from(fingersRef.current),


    u_moments: Array.from(momentsRef.current),
    u_momentsLength: moments.current.momentsLength,
    //u_selected: moments.current.selected.coord,
    //u_lastSelected: moments.current.lastSelected.coord
  };

  return (
    <GestureDetector  gesture={gesture}>
        <Canvas ref={ref}
          style={[StyleSheet.absoluteFill, { 
            alignItems: 'center',
            
           
          //  width: width,
          //  height: height,
          
 
          }]}
        >
  
            <Rect x={0} y={0} width={size.width} height={size.height} color="lightblue">
            <Shader source={source} uniforms={uniforms} />
          </Rect>
        </Canvas>
      {/* </View> */}
    </GestureDetector>
  );
};

// const styles = StyleSheet.create({
//   container: { width: 300, height: 300, backgroundColor: "hotpink" },
//   innerContainer: { flexDirection: "column" },
//   rowContainer: { flexDirection: "row" },
//   labelWrapper: {},
//   label: {},
// });

export default MomentsSkia;
