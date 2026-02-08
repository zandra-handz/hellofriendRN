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
import { packGeckoOnly, transformSelected } from "./animUtils";
import PawSetter from "@/app/screens/fidget/PawSetter";
import { MOMENTS_BG_SKSL_OPT } from "./shaderCode/momentsLGShaderOpt";
import { GECKO_ONLY_TRANSPARENT_SKSL_OPT } from "./shaderCode/geckoMomentsLGShaderOpt";

import { BackHandler, AppState } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import MomentDotsResetterMini from "./MomentDotsResetterMini";
import {
  runOnJS,
  useSharedValue,
  useDerivedValue,
} from "react-native-reanimated";

import { useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  hexToVec3,
  toShader,
  toShaderModel_inPlace,
  toShaderSpace_inplace,
  toGeckoSpace_inPlace,
  toGeckoPointer_inPlace,
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
  reset = 0,
  // setScatteredMoments,
}: Props) => {
  const { width, height } = useWindowDimensions();
  const { ref, size } = useCanvasSize();

  // const aspect = size.width > 0 ? size.width / size.height : null;

  // initializes with the dimensions aspect first to prevent errors
  const [aspect, setAspect] = useState<number>(width / height);
  // console.log(`ASPECT:`, aspect);

  useEffect(() => {
    // console.log('set aspect');

    if (size && size.width > 0 && size.height > 0) {
      const newAspect = size.width / size.height;
      //console.log("Setting aspect to:", newAspect);
      setAspect(newAspect);
    } else {
      // console.log(`canvas size is NAN? `, size);
    }
  }, [size]);

  const updateTrigger = useSharedValue(0);
  const lastRenderRef = useRef(0);

  const isPausedRef = useRef(false);

//    useEffect(() => {
//   if (global.gc) {
//     // Force GC every 5 seconds to see the pattern
//     const interval = setInterval(() => {
//       console.log('Forcing GC...');
//       global.gc();
//     }, 5000);
//     return () => clearInterval(interval);
//   }
// }, []);

  // useFocusEffect(
  //   useCallback(() => {
  //     return () => {
  //       isDragging.value = false;
  //     };
  //   }, []),
  // );


  useFocusEffect(
  useCallback(() => {
    isPausedRef.current = false; // Resume when focused
    
    return () => {
      isPausedRef.current = true; // Pause when unfocused
      isDragging.value = false;
    };
  }, []),
);

  const insets = useSafeAreaInsets();
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

  // useEffect(() => {
  //   console.log(momentsData);

  // }, [momentsData]);

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

 

  const onSinglePress = () => { 
    // console.log("single presss");
handleGetMoment(moments.current.lastSelected?.id);
 
  };

  const onDoublePress = () => { 

    handleGetMoment(-1);
    console.log("double press");
 
  };
 
  
  const wasTapSV = useSharedValue(false);
  const wasDoubleTapSV = useSharedValue(false);
 

  // Pan gesture for dragging
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



  // Single tap (lower priority - waits for double tap to fail)
  const singleTapGesture = Gesture.Tap()
    .numberOfTaps(1)
    .onEnd((_event, success) => {
      if (success) {
        wasTapSV.value = true;
        // runOnJS(onSinglePress)();
        setTimeout(() => {
          wasTapSV.value = false;
        }, 100);
      }
    });
      // Double tap (higher priority)
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

  // Exclusive: double tap gets priority, single tap waits
  const taps = Gesture.Exclusive(doubleTapGesture, singleTapGesture);

  // Combine with pan
  const composedGesture = Gesture.Simultaneous(panGesture, taps);
 

  const color1Converted = hexToVec3(color1);
  const color2Converted = hexToVec3(color2);
  const bckgColor1Converted = hexToVec3(bckgColor1);
  const bckgColor2Converted = hexToVec3(bckgColor2);

  // Keep simulation objects as refs (they don't go into uniforms)
  const soul = useRef(new Soul(restPoint, 0.02)); 
  const leadPoint = useRef(new Mover(startingCoord));
  const gecko = useRef(new Gecko(startingCoord, 0.06));
  const moments = useRef(
    new Moments(momentsData, gecko_size, [0.5, 0.5], 0.05),
  );


  // In your component, create a ref for the callback
const onMomentReachedRef = useRef(null);

// Set the callback

// 1️⃣ Create a ref
const handleGetMomentRef = useRef(handleGetMoment);

// 2️⃣ Keep it updated whenever handleGetMoment changes
useEffect(() => {
  handleGetMomentRef.current = handleGetMoment;
}, [handleGetMoment]);

useEffect(() => {
  onMomentReachedRef.current = (momentId) => {
    handleGetMoment(momentId);
  };
}, [handleGetMoment]);

  const sleepWalk0 = useRef(new SleepWalk0([.5,.3], 0.3,   gecko_size));

  useEffect(() => {
    if (aspect) {
      moments.current.setAspect(aspect);
      sleepWalk0.current.setAspect(aspect);
    }
  }, [aspect]);

  useEffect(() => {
    sleepWalk0.current.updatePauseMode(manualOnly);
  }, [manualOnly])

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

const [ geckoColor, setGeckoColor ] = useState(color2Converted);

  const source = useMemo(() => {
    return Skia.RuntimeEffect.Make(`
    ${SHARED_SKSL_PRELUDE(
      color1Converted,
      geckoColor,
      bckgColor1Converted,
      bckgColor2Converted,
    )}
    ${GECKO_ONLY_TRANSPARENT_SKSL_OPT}
  `);
  }, [
    color1Converted,
    // color2Converted,
    geckoColor,
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

  if (!source) {
    console.error("❌ Shader failed to compile");
    return null;
  }

  const start = useRef(Date.now());
  const TOTAL_GECKO_POINTS = 71;
  const MAX_MOMENTS = 40;
  const MAX_HELD = 4;
  // Keep working buffers as refs (intermediate calculations)
  const hintRef = useRef([0, 0]);

  const leadUniformSV = useSharedValue(new Float32Array([0, 0]));
  // const leadScreenSpaceUniformSV = useSharedValue(new Float32Array([0, 0]));
  const soulUniformSV = useSharedValue(new Float32Array([0, 0]));
  const walk0UniformSV = useSharedValue(new Float32Array([0, 0]));
  const selectedUniformSV = useSharedValue(new Float32Array([0, 0]));
  const lastSelectedUniformSV = useSharedValue(new Float32Array([0, 0]));
  // const holding0UniformSV = useSharedValue(new Float32Array([0, 0]));

  const hintUniformSV = useSharedValue(new Float32Array([0, 0]));
  const momentsUniformSV = useSharedValue(Array(MAX_MOMENTS * 2).fill(0));
  const heldMomentUniformSV = useSharedValue(Array(MAX_HELD * 2).fill(0));
  const geckoPointsUniformSV = useSharedValue(
    Array(TOTAL_GECKO_POINTS * 2).fill(0),
  );
  const momentsLengthSV = useSharedValue(0);

  const [internalReset, setInternalReset] = useState(0); // initialize to null or else will just immediately reset every time nav to this screen
  const handleReset = () => {
    setInternalReset(Date.now());
  };

  useEffect(() => {
    // console.log('reset in capsule list triggered', momentsData.length)
    //  moments.current = new Moments(momentsData, [0.5, 0.5], 0.05);

    moments.current.reset(momentsData, [0.5, 0.5], 0.05);
    moments.current.updateAllCoords(momentsData);
  }, [momentsData, reset]);

  // reset isn't working
  useEffect(() => {
    // console.log(
    //   "useeffect in SKIA triggered by momentsData or reset",
    //   momentsData,
    //   momentsData.length,
    // );
    if (moments && moments.current) {
      // moments.current.reset(momentsData, [0.5, 0.5], 0.05);
      moments.current.updateAllCoords(momentsData);
    }
  }, [momentsData, internalReset]);

  useEffect(() => {
   // console.log("RESET EFFECT RAN !!!");
    if (!internalReset && !reset) {
      console.log("conditions not met for a reset");
      return;
    } else {
      console.log("TRUE RESET");
    }

    start.current = Date.now();

    moments.current = new Moments(momentsData, gecko_size, [0.5, 0.5], 0.05);
    soul.current = new Soul(restPoint, 0.02);
    leadPoint.current = new Mover(startingCoord);
    gecko.current = new Gecko(startingCoord, 0.06);

    leadUniformSV.value = new Float32Array([0, 0]);
    // leadScreenSpaceUniformSV.value = new Float32Array([0, 0]);
    soulUniformSV.value = new Float32Array([0, 0]);
    walk0UniformSV.value = new Float32Array([0, 0]);
    selectedUniformSV.value = new Float32Array([0, 0]);
    lastSelectedUniformSV.value = new Float32Array([0, 0]);
    // holding0UniformSV.value = new Float32Array([0, 0]);
    hintUniformSV.value = new Float32Array([0, 0]);
    momentsUniformSV.value = Array(MAX_MOMENTS * 2).fill(0);
    heldMomentUniformSV.value = Array(MAX_HELD * 2).fill(0);
    geckoPointsUniformSV.value = Array(TOTAL_GECKO_POINTS * 2).fill(0);
    momentsLengthSV.value = 0;

    userPointSV.value = restPoint;
    userPoint_geckoSpaceRef.current[0] = startingCoord[0];
    userPoint_geckoSpaceRef.current[1] = startingCoord[1];
  }, [reset, internalReset]);

  const frameCountRef = useRef(0); // At component level with your other refs


 const lastTriggeredIdRef = useRef(-1);


  useEffect(() => {
    let cancelled = false;
    let frame;



    let sleepWalkAfter = 100;

    frameCountRef.current = 0; // Reset when effect runs

    const animate = () => {
      if (cancelled || isPausedRef.current) {
    frame = requestAnimationFrame(animate);
    return;
  }
          // const frameStart = performance.now();

      if (aspect == null || isNaN(aspect)) {
        console.log("aspect is null or NaN! QUITTING the animation", aspect);
        frame = requestAnimationFrame(animate);

        return;
      }

      const currentId = moments.current.lastSelected?.id ?? -1;
      // console.log(currentId);

// if (currentId !== -1 && currentId !== lastTriggeredIdRef.current) {
//   // console.log('handle moment triggered by animation loop')
//   lastTriggeredIdRef.current = currentId;
//   onSinglePress();
// }
// 3️⃣ Inside your animation loop, call the ref instead of the function directly
if (currentId !== -1 && currentId !== lastTriggeredIdRef.current) {
  lastTriggeredIdRef.current = currentId;
 
  handleGetMomentRef.current(currentId);
}
      if (leadPoint.current.isMoving && !gecko.current.sleepWalkMode) {
        frameCountRef.current = 0;
      }

      // break out of sleep mode
      if (isDragging.value && gecko.current.sleepWalkMode) {
          frameCountRef.current = 0;
          gecko.current.updateSleepWalkMode(false);
        //  setGeckoColor(color2Converted);

      }

      if (frameCountRef.current < sleepWalkAfter) {
        frameCountRef.current += 1; // Just increment each frame
      } else if ((frameCountRef.current === sleepWalkAfter) && !gecko.current.sleepWalkMode) {
        gecko.current.updateSleepWalkMode(true);
        // setGeckoColor(color1Converted);

      }



      // console.log(frameCountRef.current)
      // Update gecko pointer position
      toGeckoPointerScaled_inPlace(
        userPointSV.value,
        aspect,
        scale,
        gecko_size,
        userPoint_geckoSpaceRef.current,
        0,
      );

      // SOUL AND GECKO ENTER ANIMATION
      if (soul.current.done && !gecko.current.oneTimeEnterComplete) {
        gecko.current.updateEnter(soul.current.done);
      } else {
        soul.current.update();
      }

      // LEAD POINT
      if (gecko.current.oneTimeEnterComplete && !gecko.current.sleepWalkMode) {
        leadPoint.current.update(userPoint_geckoSpaceRef.current);
      } else if (!gecko.current.sleepWalkMode) {
        leadPoint.current.update(soul.current.soul);
      } 
      
      else if (gecko.current.sleepWalkMode) {
        sleepWalk0.current.update(moments);
       leadPoint.current.update(sleepWalk0.current.walk);
      }

      // BODY AND LEGS
      gecko.current.update(
        leadPoint.current.lead,
        leadPoint.current.leadDistanceTraveled,
        leadPoint.current.isMoving,
      );

      const spine = gecko.current.body.spine;
      hintRef.current = spine.hintJoint || [0, 0];

      // console.log(tapState)


      // console.log(sleepWalk0);

      moments.current.update(
        userPointSV.value,
        isDragging.value,
        leadPoint.current.isMoving,
        wasTapSV.value,
        sleepWalk0,
        wasDoubleTapSV.value,
        leadPoint.current.lead,
        [
          gecko.current.legs.frontLegs.stepTargets[0],
          gecko.current.legs.frontLegs.stepTargets[1],
          gecko.current.legs.backLegs.stepTargets[0],
          gecko.current.legs.backLegs.stepTargets[1],
        ],
      );

      const newSoul = new Float32Array(2);
      toShaderSpace_inplace(soul.current.soul, aspect, gecko_scale, newSoul, 0);
      soulUniformSV.value = newSoul;


      const newWalk = new Float32Array(2);
      toShaderSpace_inplace(sleepWalk0.current.walk, aspect, gecko_scale, newWalk, 0);
      walk0UniformSV.value = newWalk;

      const newHint = new Float32Array(2);
      toShaderSpace_inplace(hintRef.current, aspect, gecko_scale, newHint, 0);
      hintUniformSV.value = newHint;

      const newLead = new Float32Array(2);
      toShaderModel_inPlace(
        leadPoint.current.lead,
        aspect,
        gecko_scale,
        newLead,
        0,
      );
      leadUniformSV.value = newLead;

      // const newLeadScreenSpace = new Float32Array(2);
      // toShaderSpace_inplace(
      //   leadPoint.current.lead,
      //   aspect,
      //   scale,
      //   newLeadScreenSpace,
      //   0,
      // );
      // leadScreenSpaceUniformSV.value = newLeadScreenSpace;

      const newSelected = new Float32Array(2);
      //transformSelected(moments.current.selected.coord,  gecko_scale,   newSelected, 0);
      newSelected[0] = moments.current.selected.coord[0];
      newSelected[1] = moments.current.selected.coord[1];

      // toShaderSpace_inplace(moments.current.selected.coord, aspect, scale, newSelected, 0);
      selectedUniformSV.value = newSelected;

      // const newHolding0 = new Float32Array(2);
      // toGeckoSpace_inPlace(
      //   moments.current.holding0.coord,
      //   gecko_scale,
      //   newHolding0,
      // );
      // holding0UniformSV.value = newHolding0;

      const heldCoords = new Float32Array(MAX_HELD * 2);

      for (let i = 0; i < 4; i++) {
        const newHolding = new Float32Array(2);
        toGeckoSpace_inPlace(
          moments.current.holdings[i].coord,
          gecko_scale,
          newHolding,
        );
        heldCoords[i * 2] = newHolding[0];
        heldCoords[i * 2 + 1] = newHolding[1];
      }

      heldMomentUniformSV.value = heldCoords;

      const newLastSelected = new Float32Array(2);
      // toGeckoPointerScaled_inPlace(moments.current.lastSelected.coord, aspect, scale, gecko_size, newLastSelected, 0);

      // newLastSelected[0] = moments.current.lastSelected.coord[0];
      // newLastSelected[1] = moments.current.lastSelected.coord[1];
      // // console.log(Number(newLastSelected[0]) === Number(newSelected[0]))

      // lastSelectedUniformSV.value = newLastSelected;

      // Apply the SAME transform as packGeckoOnly does

      toGeckoSpace_inPlace(
        moments.current.lastSelected.coord,
        gecko_scale,
        newLastSelected,
      );
      // const x = (moments.current.lastSelected.coord[0] - 0.5) / gecko_scale;
      // const y = (moments.current.lastSelected.coord[1] - 0.5) / gecko_scale;

      // newLastSelected[0] = x;
      // newLastSelected[1] = y;

      lastSelectedUniformSV.value = newLastSelected;

      // Create new arrays for gecko points and moments
      const newGeckoPoints = new Array(TOTAL_GECKO_POINTS * 2).fill(0);
      packGeckoOnly(gecko.current, newGeckoPoints, gecko_scale);
      geckoPointsUniformSV.value = newGeckoPoints;

      const newMomentsUniform = new Array(MAX_MOMENTS * 2).fill(0);
      packVec2Uniform_withRecenter_moments(
        moments.current.moments,
        newMomentsUniform,
        moments.current.momentsLength,
        aspect,
        scale,
      );
      momentsUniformSV.value = newMomentsUniform;
      momentsLengthSV.value = moments.current.momentsLength;

      // Trigger shader update only when moving
      if (leadPoint.current.isMoving || isDragging.value) {
        const now = Date.now();
        if (now - lastRenderRef.current > 16) {
          // ~60fps
          //setTime(now);
          lastRenderRef.current = now;
          updateTrigger.value += 1;
        }
      }

          
    // const frameEnd = performance.now();
    // const frameTime = frameEnd - frameStart;  // ← This is the actual frame time
    
    // if (frameTime > 16) {
    //     console.log(`Slow frame: ${frameTime.toFixed(2)}ms`);
    
    // }
    

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

    // Guard against invalid size
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
        u_walk0: [-100, -100],
        u_selected: [-100, -100],
        u_lastSelected: [-100, -100],
        // u_holding0: [-100, -100],
        u_hint: [-100, -100],
        u_momentsLength: 0,
        u_moments: Array(MAX_MOMENTS * 2).fill(0),
        u_heldMoments: Array(MAX_HELD * 2).fill(0),
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
      // u_lead_screen_space: Array.from(leadScreenSpaceUniformSV.value),
      u_soul: Array.from(soulUniformSV.value),
      u_walk0: Array.from(walk0UniformSV.value),
      u_selected: Array.from(selectedUniformSV.value),
      u_lastSelected: Array.from(lastSelectedUniformSV.value),
      // u_holding0: Array.from(holding0UniformSV.value),
      u_hint: Array.from(hintUniformSV.value),
      u_momentsLength: momentsLengthSV.value,
      u_moments: [...momentsUniformSV.value],
      u_heldMoments: [...heldMomentUniformSV.value],
      u_geckoPoints: [...geckoPointsUniformSV.value],
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
          // momentsData={momentsData}
          momentsData={moments.current.moments}
          lastSelected={moments.current.lastSelected}
          updatePaw={(moment, holdIndex) =>
            moments.current.updateHold(moment, holdIndex)
          }
          clearPaw={(holdIndex) => moments.current.clearHolding(holdIndex)}
          updateSelected={(holdIndex) =>
            moments.current.updateSelected(holdIndex)
          }
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
