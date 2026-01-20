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
import Moments from "./momentsClass";
import {
  MOMENTS_BG_SKSL,
  // GECKO_ONLY_TRANSPARENT_SKSL,
  // LIQUID_GLASS_MOMENTS_GECKO_GLSL,
} from "./shaderCode/geckoMomentsLGShader";
import { MOMENTS_BG_SKSL_OPT } from "./shaderCode/momentsLGShaderOpt";

import { GECKO_ONLY_TRANSPARENT_SKSL_OPT } from "./shaderCode/geckoMomentsLGShaderOpt";

// import { MOMENTS_ONLY_GLSL } from "./shaderCode/geckoMomentsShader.glsl";
// import { GECKO_MOMENTS_NO_BG_GLSL } from "./shaderCode/transBackground.glsl";
// import { LIQUID_GLASS_MOMENTS_GLSL } from "./shaderCode/liquidGlassShader.glsl";

// import { GECKO_MOMENTS_GLSL } from "./shaderCode/geckoMomentsShader.glsl";
// import { LIQUID_GLASS_GLSL } from "./shaderCode/liquidGlassShader.glsl";
// import { LIQUID_GLASS_STRIPES_BG } from "./shaderCode/liquidGlassShader.glsl";

import { BackHandler } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import MomentDotsResetterMini from "./MomentDotsResetterMini"; 
import { runOnJS, useSharedValue } from "react-native-reanimated";
import { useWindowDimensions } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  hexToVec3,
  toShaderModel_inPlace,
  toShaderSpace_inplace,
  toGeckoPointer_inPlace,
  toShaderModel_arrays_inPlace,
  packVec2Uniform_withRecenter_moments,
  screenToGeckoSpace_inPlace,
} from "./animUtils";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { 
  Canvas,
  useCanvasSize, 
  Shader,
  Rect,
  Skia,
} from "@shopify/react-native-skia";
import { Poppins_400Regular } from "@expo-google-fonts/poppins"; 

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

// LIMIT OF 40 MOMENTS RIGHT NOW
// TO ALLOW FOR DYNAMIC UPDATING WOULD MEAN TO RESET SHADER EVERY SINGLE TIME WHICH CAN BE EXPENSIVE
// would do this in shader instead of current setup -->  uniform vec2 u_moments[${moments.length}];
const MomentsSkia = ({
  handleEditMoment,
  handleUpdateMomentCoords,
  handleGetMoment,
  color1,
  color2,
  bckgColor1,
  bckgColor2,
  momentsData = [], //mapped list of capsuleList with just the id and a field combining x and y
  startingCoord,
  restPoint,
  scale = 1,
  gecko_scale = 1,
  lightDarkTheme,
  handleRescatterMoments,
  handleRecenterMoments,

  reset = 0,
}: Props) => {
  // console.log(momentsData);

  const { width, height } = useWindowDimensions();
  const { ref, size } = useCanvasSize(); // size = { width, height }

  useFocusEffect(
    useCallback(() => {
      return () => {
        // screen is blurred
        isDragging.value = false;
      };
    }, []),
  );

  // DONT DELETE
  const insets = useSafeAreaInsets();
  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          // block system back
          return true;
        },
      );

      return () => {
        subscription.remove();
      };
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
    }));
    handleUpdateMomentCoords(formattedData);
  };

  const userPointSV = useSharedValue(restPoint);
const userPoint_geckoSpaceSV = useSharedValue([0, 0]); 
 
const userPoint_geckoSpaceRef = useRef<[number, number]>([0, 0]);

  const isDragging = useSharedValue(false); // tracks if screen is being touched

  const gesture = Gesture.Pan()
    .onTouchesDown((e) => {
      // Finger just touched: mark dragging and update userPoint immediately
      isDragging.value = true;
      const touch = e.changedTouches[0];

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

  const onLongPress = () => {};

  const onDoublePress = () => {
    console.log(moments.current.lastSelected);
    handleGetMoment(moments.current.lastSelected?.id);
  };

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

  // const longPressGesture = Gesture.LongPress()
  //   .minDuration(350)
  //   .onStart(() => {
  //     runOnJS(onLongPress)();
  //   });

  const [time, setTime] = useState(0);
  const color1Converted = hexToVec3(color1);
  const color2Converted = hexToVec3(color2);

  const bckgColor1Converted = hexToVec3(bckgColor1);
  const bckgColor2Converted = hexToVec3(bckgColor2);

  const soul = useRef(new Soul(restPoint, 0.02));
  const leadPoint = useRef(new Mover(startingCoord));
  const gecko = useRef(new Gecko(startingCoord, 0.06));
  const moments = useRef(new Moments(momentsData, [0.5, 0.5], 0.05));

  const [aspect, setAspect] = useState<number | null>(null);

  useEffect(() => {
    setAspect(size.width / size.height);
  }, [size]);

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

  const sourceTwo = useMemo(() => {
    return Skia.RuntimeEffect.Make(`
    ${SHARED_SKSL_PRELUDE(
      color1Converted,
      color2Converted,
      bckgColor1Converted,
      bckgColor2Converted,
    )}

    ${MOMENTS_BG_SKSL_OPT}
  `);
  }, [
    color1Converted,
    color2Converted,
    bckgColor1Converted,
    bckgColor2Converted,
  ]);

  //   const source = Skia.RuntimeEffect.Make(`
  //     vec3 startColor = vec3(${color1Converted});
  //     vec3 endColor = vec3(${color2Converted});

  //         vec3 backgroundStartColor = vec3(${bckgColor1Converted});
  //         vec3 backgroundEndColor = vec3(${bckgColor2Converted});

  //    ${GECKO_ONLY_TRANSPARENT_SKSL}

  // `);

  //   const sourceTwo = Skia.RuntimeEffect.Make(`
  //     vec3 startColor = vec3(${color1Converted});
  //     vec3 endColor = vec3(${color2Converted});

  //         vec3 backgroundStartColor = vec3(${bckgColor1Converted});
  //         vec3 backgroundEndColor = vec3(${bckgColor2Converted});

  //    ${MOMENTS_BG_SKSL}

  // `);

  if (!source) {
    console.error("❌ Shader failed to compile");
    return null;
  }

  const start = useRef(Date.now());

  const NUM_SPINE_JOINTS = 15;
  const NUM_TAIL_JOINTS = 13;
  const snoutRef = useRef([0, 0]);
  const headRef = useRef([0, 0]);
  const hintRef = useRef([0, 0]); 

  const leadUniformRef = useRef(new Float32Array(2));
  const leadScreenSpaceUniformRef = useRef(new Float32Array(2));
  const soulUniformRef = useRef(new Float32Array(2));
  const selectedUniformRef = useRef(new Float32Array(2));
  const lastSelectedUniformRef = useRef(new Float32Array(2));
  const hintUniformRef = useRef(new Float32Array(2));

  const snoutUniformRef = useRef(new Float32Array(2));
  const headUniformRef = useRef(new Float32Array(2));

  const MAX_MOMENTS = 40;
  // Preallocate uniform arrays once at top-level inside component
  const jointsUniform = useRef(new Array(NUM_SPINE_JOINTS * 2).fill(0));
  const tailUniform = useRef(new Array(NUM_TAIL_JOINTS * 2).fill(0));
  const stepsUniform = useRef(new Array(4 * 2).fill(0));
  const elbowsUniform = useRef(new Array(4 * 2).fill(0));
  const shouldersUniform = useRef(new Array(4 * 2).fill(0));
  const musclesUniform = useRef(new Array(8 * 2).fill(0));
  const fingersUniform = useRef(new Array(20 * 2).fill(0));
  const momentsUniform = useRef(new Array(MAX_MOMENTS * 2).fill(0));


  const clearUniformArray = (arr: number[]) => {
  arr.fill(0);
};

const clearVec2 = (v: Float32Array | number[]) => {
  v[0] = 0;
  v[1] = 0;
};
 

  const [internalReset, setInternalReset] = useState(Date.now());
  const handleReset = () => {
    setInternalReset(Date.now());
  };

  useEffect(() => {
    moments.current.updateAllCoords(momentsData);
  }, [momentsData, internalReset]);

useEffect(() => {
  if (!internalReset && !reset) return;

  // reset time
  start.current = Date.now();
  setTime(0);

  // recreate simulation objects
  moments.current = new Moments(momentsData, [0.5, 0.5], 0.05);
  soul.current = new Soul(restPoint, 0.02);
  leadPoint.current = new Mover(startingCoord);
  gecko.current = new Gecko(startingCoord, 0.06);

  // clear ALL shader-backed arrays (CRITICAL)
  clearUniformArray(jointsUniform.current);
  clearUniformArray(tailUniform.current);
  clearUniformArray(stepsUniform.current);
  clearUniformArray(elbowsUniform.current);
  clearUniformArray(shouldersUniform.current);
  clearUniformArray(musclesUniform.current);
  clearUniformArray(fingersUniform.current);
  clearUniformArray(momentsUniform.current);

  // clear vec2 uniforms
  clearVec2(leadUniformRef.current);
  clearVec2(leadScreenSpaceUniformRef.current);
  clearVec2(soulUniformRef.current);
  clearVec2(selectedUniformRef.current);
  clearVec2(lastSelectedUniformRef.current);
  clearVec2(hintUniformRef.current);
  clearVec2(snoutUniformRef.current);
  clearVec2(headUniformRef.current);

  // reset input state
  userPointSV.value = restPoint;
  userPoint_geckoSpaceRef.current[0] = startingCoord[0];
  userPoint_geckoSpaceRef.current[1] = startingCoord[1];

  // reset uniforms metadata
  uniformsRef.current.u_time = 0;
  uniformsRef.current.u_momentsLength = 0;

}, [reset, internalReset]);

 
useEffect(() => {
  let cancelled = false;
  let frame;

  const animate = () => {
    if (cancelled) return;

    if (aspect == null) {
  frame = requestAnimationFrame(animate);
  return;
}




    

    // UPDATE TIME IF MOVING
    if (leadPoint.current.isMoving || isDragging.value) {
      const now = (Date.now() - start.current) / 1000;
      setTime(now);
      uniformsRef.current.u_time = now;
    }
         toGeckoPointer_inPlace(
    userPointSV.value,
    aspect,
    scale,
  userPoint_geckoSpaceRef.current,
   // userPoint_geckoSpaceSV.value,
    0
  );
    frame = requestAnimationFrame(animate);

    // SOUL AND GECKO ENTER ANIMATION
    if (soul.current.done && !gecko.current.oneTimeEnterComplete) {
      gecko.current.updateEnter(soul.current.done);
    } else {
      soul.current.update();
    }
    
    // LEAD POINT
    if (gecko.current.oneTimeEnterComplete) {
 

  
      //  screenToGeckoSpace_inPlace(userPointSV.value, aspect, gecko_scale, geckoPointerRef.current);
     
      
  //leadPoint.current.update(userPointSV.value);
  leadPoint.current.update(   userPoint_geckoSpaceRef.current);
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
    const tail = gecko.current.body.tail;  
 
    snoutRef.current = spine.unchainedJoints[0] || [0, 0];
    headRef.current = spine.unchainedJoints[1] || [0, 0];
    hintRef.current = spine.hintJoint || [0, 0];
 
    moments.current.update(userPointSV.value, isDragging.value, leadPoint.current.isMoving, gecko.current.legs.frontLegs.stepTargets[0]);
 
    // In place packers

    // SPINE AND TAILS
    toShaderModel_arrays_inPlace(spine.joints, jointsUniform.current, NUM_SPINE_JOINTS, aspect, gecko_scale);
    toShaderModel_arrays_inPlace(tail.joints, tailUniform.current, NUM_TAIL_JOINTS, aspect, gecko_scale);

    // STEPS
    toShaderModel_arrays_inPlace(gecko.current.legs.frontLegs.stepTargets, stepsUniform.current, 2, aspect, gecko_scale, 0);
    toShaderModel_arrays_inPlace(gecko.current.legs.backLegs.stepTargets, stepsUniform.current, 2, aspect, gecko_scale, 2);

    // ELBOWS
    toShaderModel_arrays_inPlace(gecko.current.legs.frontLegs.elbows, elbowsUniform.current, 2, aspect, gecko_scale, 0);
    toShaderModel_arrays_inPlace(gecko.current.legs.backLegs.elbows, elbowsUniform.current, 2, aspect, gecko_scale, 2);
 
     // SHOULDERS (doing individually... should I make a different function for these?)
    toShaderModel_arrays_inPlace(  gecko.current.legs.frontLegs.rotatorJoint0, shouldersUniform.current, 1, aspect, gecko_scale, 0);
    toShaderModel_arrays_inPlace(  gecko.current.legs.frontLegs.rotatorJoint1, shouldersUniform.current, 1, aspect, gecko_scale, 1);
    toShaderModel_arrays_inPlace(  gecko.current.legs.backLegs.rotatorJoint0, shouldersUniform.current, 1, aspect, gecko_scale, 2);
    toShaderModel_arrays_inPlace(  gecko.current.legs.backLegs.rotatorJoint0, shouldersUniform.current, 1, aspect, gecko_scale, 3);

    toShaderModel_arrays_inPlace(  gecko.current.legs.frontLegs.muscles,  musclesUniform.current, 4, aspect, gecko_scale, 0);
    toShaderModel_arrays_inPlace(  gecko.current.legs.backLegs.muscles,  musclesUniform.current, 4, aspect, gecko_scale, 4); 
   
    toShaderModel_arrays_inPlace(gecko.current.legs.frontLegs.fingers[0], fingersUniform.current, 5, aspect, gecko_scale, 0);
    toShaderModel_arrays_inPlace(gecko.current.legs.frontLegs.fingers[1], fingersUniform.current, 5, aspect, gecko_scale, 5);
    toShaderModel_arrays_inPlace(gecko.current.legs.backLegs.fingers[0], fingersUniform.current, 5, aspect, gecko_scale, 10);
    toShaderModel_arrays_inPlace(gecko.current.legs.backLegs.fingers[1], fingersUniform.current, 5, aspect, gecko_scale, 15);

    // lead point is in pixel space/will map to user pointer
    // toShaderSpace_inplace(leadPoint.current.lead, aspect, scale, leadUniformRef.current, 0);
    toShaderSpace_inplace(soul.current.soul, aspect, gecko_scale, soulUniformRef.current, 0);
    toShaderSpace_inplace(hintRef.current, aspect, gecko_scale, hintUniformRef.current, 0);

    // gecko in internal space 
    toShaderModel_inPlace(leadPoint.current.lead, aspect, gecko_scale, leadUniformRef.current, 0);
    toShaderSpace_inplace(leadPoint.current.lead, aspect, scale, leadScreenSpaceUniformRef.current, 0);
    
    toShaderModel_inPlace(snoutRef.current, aspect, gecko_scale, snoutUniformRef.current, 0);
    toShaderModel_inPlace(headRef.current, aspect, gecko_scale, headUniformRef.current, 0);

    toShaderSpace_inplace(moments.current.selected.coord, aspect, scale, selectedUniformRef.current, 0);
    toShaderSpace_inplace(moments.current.lastSelected.coord, aspect, scale, lastSelectedUniformRef.current, 0);

    packVec2Uniform_withRecenter_moments(moments.current.moments, momentsUniform.current, moments.current.momentsLength, aspect, scale);

    //uniformsRef.current.u_lead = leadPoint.current.lead;
    uniformsRef.current.u_scale = scale;
    uniformsRef.current.u_gecko_scale = gecko_scale;
    uniformsRef.current.u_aspect = aspect;
    uniformsRef.current.u_resolution[0] = size.width;
    uniformsRef.current.u_resolution[1] = size.height;
    //     uniformsRef.current.u_resolution[0] = width;
    // uniformsRef.current.u_resolution[1] = height;
    uniformsRef.current.u_momentsLength = moments.current.momentsLength;

    uniformsRef.current.u_lastSelected = moments.current.lastSelected.coord;
 
  };



  animate();

  return () => {
    cancelled = true;
    if (frame) cancelAnimationFrame(frame);
  };
}, [aspect, gecko_scale, scale, size.width, size.height]);


  const uniformsRef = useRef({
  u_scale: 1,
  u_gecko_scale: 1,
  u_time: 0,
  u_resolution: [1, 1],
  u_aspect: 1,

  u_lead: leadUniformRef.current,
  u_lead_screen_space: leadScreenSpaceUniformRef.current,
  u_soul: soulUniformRef.current,
  u_selected: selectedUniformRef.current,
  // u_lastSelected: moments.current.lastSelected.coord,
  u_lastSelected: lastSelectedUniformRef.current,

  u_snout: snoutUniformRef.current,
  u_head: headUniformRef.current,
  u_hint: hintUniformRef.current,
  u_momentsLength: 0,

  u_joints: jointsUniform.current,
  u_tail: tailUniform.current,
  u_steps: stepsUniform.current,
  u_elbows: elbowsUniform.current,
  u_shoulders: shouldersUniform.current,
  u_muscles: musclesUniform.current,
  u_fingers: fingersUniform.current,
  u_moments: momentsUniform.current,
});


  return (
    <>
      <GestureDetector gesture={composedGesture}>
        <View style={StyleSheet.absoluteFill}>
          <Canvas
            ref={ref}
            style={[
              StyleSheet.absoluteFill,
            ]}
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
                source={sourceTwo}
                uniforms={uniformsRef.current}
              ></Shader>
            </Rect>
          </Canvas>

          <Canvas
            ref={ref}
            style={[
              StyleSheet.absoluteFill,
            ]}
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
                uniforms={uniformsRef.current}
              ></Shader>
            </Rect>
          </Canvas>
        </View>
      </GestureDetector>
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
  resetterContainer: { position: "absolute", bottom: 200, right: 16 },
 
});

// export default MomentsSkia;

const MemoizedMomentsSkia = React.memo(MomentsSkia);
export default MemoizedMomentsSkia;
