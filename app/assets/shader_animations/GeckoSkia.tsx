 

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
import { packGeckoOnlyProdCompact40 } from "./animUtils"; 
import { GECKO_ONLY_TRANSPARENT_SKSL_OPT } from "./shaderCode/welcomeScreen_geckoOnlyOpt";
// import { BackHandler } from "react-native";
import { useFocusEffect } from "@react-navigation/native"; 
import { runOnJS, useSharedValue, useDerivedValue } from "react-native-reanimated";
 import RippleHint from "./RippleHint";
import { useWindowDimensions } from "react-native"; 
import {
  hexToVec3,
  // toShaderModel_inPlace,
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

  const TOTAL_GECKO_POINTS_COMPACT = 40;

  // ============== OPTIMIZED: PREALLOCATED TYPED BUFFERS ==============
  // These are reused every frame - NO allocations in animate()
  const workingBuffers = useRef({
    // soul: new Float32Array(2),
    hint: new Float32Array(2),
    // lead: new Float32Array(2),
    // leadScreenSpace: new Float32Array(2),
    // selected: new Float32Array(2),
    // lastSelected: new Float32Array(2),
    
    // Big buffer as Float32Array
    geckoPoints: new Float32Array(TOTAL_GECKO_POINTS_COMPACT * 2),
  }).current;

  useFocusEffect(
    useCallback(() => {
      return () => {
        isDragging.value = false;
      };
    }, []),
  );

  // useFocusEffect(
  //   useCallback(() => {
  //     const subscription = BackHandler.addEventListener(
  //       "hardwareBackPress",
  //       () => {
  //         return true;
  //       },
  //     );

  //     return () => {
  //       subscription.remove();
  //     };
  //   }, []),
  // );

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
  const hintRef = useRef([0, 0]); 

  // Small SharedValues - updated every frame (cheap)
  // const leadUniformSV = useSharedValue<number[]>([0, 0]);
  // const leadScreenSpaceUniformSV = useSharedValue<number[]>([0, 0]);
  // const soulUniformSV = useSharedValue<number[]>([0, 0]);
  // const selectedUniformSV = useSharedValue<number[]>([0, 0]);
  // const lastSelectedUniformSV = useSharedValue<number[]>([0, 0]);
  const hintUniformSV = useSharedValue<number[]>([0, 0]); 
  
  // Big SharedValue - only updated when needed
  const geckoPointsUniformSV = useSharedValue<number[]>(
    Array(TOTAL_GECKO_POINTS_COMPACT * 2).fill(0)
  );

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

    // Reset buffers
    // workingBuffers.soul.fill(0);
    workingBuffers.hint.fill(0);
    // workingBuffers.lead.fill(0);
    // workingBuffers.leadScreenSpace.fill(0);
    // workingBuffers.selected.fill(0);
    // workingBuffers.lastSelected.fill(0);
    workingBuffers.geckoPoints.fill(0);

    // Reset SharedValues
    // leadUniformSV.value = [0, 0];
    // leadScreenSpaceUniformSV.value = [0, 0];
    // soulUniformSV.value = [0, 0];
    // selectedUniformSV.value = [0, 0];
    // lastSelectedUniformSV.value = [0, 0];
    hintUniformSV.value = [0, 0]; 
    geckoPointsUniformSV.value = Array(TOTAL_GECKO_POINTS_COMPACT * 2).fill(0);

    userPointSV.value = restPoint;
    userPoint_geckoSpaceRef.current[0] = startingCoord[0];
    userPoint_geckoSpaceRef.current[1] = startingCoord[1];
  }, [reset, internalReset]);

  // Cleanup effect for refs
  useEffect(() => {
    return () => {
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
  
      // ============== ZERO-ALLOCATION BUFFER UPDATES ==============
      // Write to preallocated buffers - NO new allocations here
      
      // toShaderSpace_inplace(
      //   soul.current.soul, 
      //   aspect, 
      //   gecko_scale, 
      //   workingBuffers.soul, 
      //   0
      // );

      toShaderSpace_inplace(
        hintRef.current, 
        aspect, 
        gecko_scale, 
        workingBuffers.hint, 
        0
      );

      // toShaderModel_inPlace(
      //   leadPoint.current.lead, 
      //   aspect, 
      //   gecko_scale, 
      //   workingBuffers.lead, 
      //   0
      // );

      // toShaderSpace_inplace(
      //   leadPoint.current.lead, 
      //   aspect, 
      //   scale, 
      //   workingBuffers.leadScreenSpace, 
      //   0
      // );

      // ============== SMALL UNIFORM UPDATES (ALWAYS) ==============
      // These are cheap - update every frame
      
      // soulUniformSV.value = [workingBuffers.soul[0], workingBuffers.soul[1]];
      hintUniformSV.value = [workingBuffers.hint[0], workingBuffers.hint[1]];
      // leadUniformSV.value = [workingBuffers.lead[0], workingBuffers.lead[1]];
      // leadScreenSpaceUniformSV.value = [
      //   workingBuffers.leadScreenSpace[0], 
      //   workingBuffers.leadScreenSpace[1]
      // ];

      // ============== BIG UNIFORM UPDATES (CONDITIONAL) ==============
      // Only update when gecko is actually moving
      
      const shouldUpdateBigUniforms = 
        leadPoint.current.isMoving || 
        isDragging.value;

      if (shouldUpdateBigUniforms) {
        // Reuse the same typed array, just refill it
        workingBuffers.geckoPoints.fill(0);
        packGeckoOnlyProdCompact40(
          gecko.current, 
          workingBuffers.geckoPoints, 
          gecko_scale
        );

        // Only create new array when we need to update the SharedValue
        geckoPointsUniformSV.value = Array.from(workingBuffers.geckoPoints);

        // Trigger shader update (throttled)
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
        // u_lead: [-100, -100],
        // u_lead_screen_space: [-100, -100],
        // u_soul: [-100, -100],
        // u_selected: [-100, -100],
        // u_lastSelected: [-100, -100],
        u_hint: [-100, -100], 
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
      // u_lead: leadUniformSV.value,
      // u_lead_screen_space: leadScreenSpaceUniformSV.value,
      // u_soul: soulUniformSV.value,
      // u_selected: selectedUniformSV.value,
      // u_lastSelected: lastSelectedUniformSV.value,
      u_hint: hintUniformSV.value, 
      u_geckoPoints: geckoPointsUniformSV.value,
    };
  }, [scale, gecko_scale, gecko_size, aspect, size.width, size.height, width, height]);

  return (
    <>
      <GestureDetector gesture={panGesture}>
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
                  {/* <RippleHint
            x={hintUniformSV.value[0]}
            y={hintUniformSV.value[1]}
            width={size.width}
            height={size.height}
            color="#4A90E2" // Customize color as needed
          /> */}

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
