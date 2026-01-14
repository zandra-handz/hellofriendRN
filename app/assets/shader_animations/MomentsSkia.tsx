import { View, Text, Dimensions, StyleSheet, Pressable } from "react-native";
import React, { useEffect, useRef, useCallback, useState } from "react";
import Soul from "./soulClass";
import Mover from "./leadPointClass";
import Gecko from "./geckoClass";
import Moments from "./momentsClass";
import { BackHandler } from "react-native";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import { useFocusEffect } from "@react-navigation/native";
import useEditMoment from "@/src/hooks/CapsuleCalls/useEditMoment";
import { runOnJS, useSharedValue } from "react-native-reanimated";
import { useWindowDimensions } from "react-native";
import { GECKO_MOMENTS_GLSL } from "./shaderCode/geckoMomentsShader.glsl";
import EscortBarFidgetScreen from "@/app/components/moments/EscortBarFidgetScreen";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { runOnUI } from "react-native-reanimated";
import {
  hexToVec3,
  toShaderSpace,
  toShaderModel,
  packVec2Uniform_withRecenter,
  packVec2Uniform_withRecenter_moments,
} from "./animUtils";
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

type Props = {
  color1: string;
  color2: string;
  momentsData: [];
  startingCoord: number[];
  restPoint: number[];
  scale: number;
  reset?: number | null;
};

// LIMIT OF 64 MOMENTS RIGHT NOW
// TO ALLOW FOR DYNAMIC UPDATING WOULD MEAN TO RESET SHADER EVERY SINGLE TIME WHICH CAN BE EXPENSIVE
// would do this in shader instead of current setup -->  uniform vec2 u_moments[${moments.length}];
const MomentsSkia = ({
  handleEditMoment,
  handleUpdateMomentCoords,
  color1,
  color2,
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

  const [momentsState, setMomentsState] = useState(momentsData);

  const handleUpdateMomentsState = () => {
    const newMoments = moments.current.moments; // grab current ref
    // console.log('current', newMoments);

    setMomentsState(newMoments); // update state for rendering if needed

    handleUpdateCoords(momentsData, newMoments);
  };

  const handleUpdateCoords = (oldMoments, newMoments) => {
    // console.log('Updating all moment coords!');

    // Reformat all moments for backend in one go
    const formattedData = newMoments.map((moment) => ({
      id: moment.id,
      screen_x: moment.coord[0],
      screen_y: moment.coord[1],
    }));
    handleUpdateMomentCoords(formattedData);
  };


  useFocusEffect(
    useCallback(() => {
      return () => {
        // This runs once when the screen loses focus
        // momentsData is your stale baseline
        // moments.current.moments must be a JS object, not a shared value
        // handleUpdateCoords(momentsData, momentsState);
      };
    }, [momentsState])
  );
  const userPointSV = useSharedValue(restPoint);

  const momentsLength = momentsData.length;

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

  const onLongPress = () => {
    console.log("onLongPress works!");
    console.log(moments.current.selected);
    console.log(moments.current.lastSelected);
  };

  const onDoublePress = () => {
    console.log("onDoublePress works!");
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

const composedGesture = Gesture.Simultaneous(
  panGesture,
  doubleTapGesture
);

  // const doubleTapGesture = Gesture.Tap()
  //   .numberOfTaps(2)
  //   .onEnd(() => {
  //     runOnJS(onDoublePress)();
  //   });

  const longPressGesture = Gesture.LongPress()
    .minDuration(350)
    .onStart(() => {
      runOnJS(onLongPress)();
    });

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

  const soul = useRef(new Soul(restPoint, 0.02));
  const leadPoint = useRef(new Mover(startingCoord));
  const gecko = useRef(new Gecko(startingCoord, 0.06));
  const moments = useRef(new Moments(momentsData, [0.5, 0.5], 0.05));

  const [aspect, setAspect] = useState<number | null>(null);

  useEffect(() => {
    setAspect(size.width / size.height);
  }, [size]);

  const source = Skia.RuntimeEffect.Make(`
    vec3 startColor = vec3(${color1Converted});
    vec3 endColor = vec3(${color2Converted});

    ${GECKO_MOMENTS_GLSL}
`);

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
  const jointsRef = useRef(new Float32Array(NUM_SPINE_JOINTS * 2));
  const tailJointsRef = useRef(new Float32Array(NUM_TAIL_JOINTS * 2));
  const stepsRef = useRef(new Float32Array(4 * 2));
  const elbowsRef = useRef(new Float32Array(4 * 2));
  const shouldersRef = useRef(new Float32Array(4 * 2));
  const legMusclesRef = useRef(new Float32Array(8 * 2));
  const fingersRef = useRef(new Float32Array(20 * 2));

  const MAX_MOMENTS = 64;
  const momentsRef = useRef(new Float32Array(MAX_MOMENTS * 2));

  useEffect(() => {
    console.log("moments data triggered new moments!");
    moments.current = new Moments(momentsData);
  }, [momentsData]);

  useEffect(() => {
    if (!reset) return; 
    start.current = Date.now();
    setTime(0); 

    soul.current = new Soul(restPoint, 0.02);
    leadPoint.current = new Mover(startingCoord);
    gecko.current = new Gecko(startingCoord, 0.06);

    // Optional (?)
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
        gecko_scale
      );
      packVec2Uniform_withRecenter(
        tail.joints,
        tailJointsRef.current,
        NUM_TAIL_JOINTS,
        aspect,
        gecko_scale
      );
      const allSteps = [...f_steps, ...b_steps];
      packVec2Uniform_withRecenter(
        allSteps,
        stepsRef.current,
        4,
        aspect,
        gecko_scale
      );

      const allElbows = [...f_elbows, ...b_elbows];
      packVec2Uniform_withRecenter(
        allElbows,
        elbowsRef.current,
        4,
        aspect,
        gecko_scale
      );

      const allShoulders = [...f_shoulders, ...b_shoulders];
      packVec2Uniform_withRecenter(
        allShoulders,
        shouldersRef.current,
        4,
        aspect,
        gecko_scale
      );

      const allMuscles = [...f_muscles, ...b_muscles];
      packVec2Uniform_withRecenter(
        allMuscles,
        legMusclesRef.current,
        8,
        aspect,
        gecko_scale
      );

      const allFingers = allFingersNested.flat(); // flattens to 20 [x,y] pairs

      packVec2Uniform_withRecenter(
        allFingers,
        fingersRef.current,
        20,
        aspect,
        gecko_scale
      );

      packVec2Uniform_withRecenter_moments(
        moments.current.moments,
        momentsRef.current,
        moments.current.momentsLength,
        aspect,
        scale
      );
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, [aspect]);

  const uniforms = {
    u_scale: scale,
    u_gecko_scale: gecko_scale,
    u_time: time,
    u_resolution: [width, height],
    u_aspect: aspect,

    u_lead: toShaderSpace(leadPoint.current.lead, aspect, scale),
    u_soul: toShaderSpace(soul.current.soul, aspect, gecko_scale),
    u_selected: toShaderSpace(moments.current.selected.coord, aspect, scale),
    u_lastSelected: toShaderSpace(
      moments.current.lastSelected.coord,
      aspect,
      scale
    ),

    u_snout: toShaderModel(snoutRef.current, gecko_scale),
    u_head: toShaderModel(headRef.current, gecko_scale),
    u_hint: toShaderSpace(hintRef.current, aspect, gecko_scale),
    u_momentsLength: moments.current.momentsLength,

    u_joints: Array.from(jointsRef.current),
    u_tail: Array.from(tailJointsRef.current),

    u_steps: Array.from(stepsRef.current),
    u_elbows: Array.from(elbowsRef.current),
    u_shoulders: Array.from(shouldersRef.current),
    u_muscles: Array.from(legMusclesRef.current),
    u_fingers: Array.from(fingersRef.current),

    u_moments: Array.from(momentsRef.current),
  };

  return (
    <>
      <GestureDetector gesture={composedGesture}>
        <Canvas
          ref={ref}
          style={[
            StyleSheet.absoluteFill,
            {
              alignItems: "center",
            },
          ]}
        >
          <Rect
            x={0}
            y={0}
            width={size.width}
            height={size.height}
            color="lightblue"
          >
            <Shader source={source} uniforms={uniforms} />
          </Rect>
        </Canvas>
        {/* </View> */}
      </GestureDetector>
      <View style={styles.escortBarContainer}>
        <EscortBarFidgetScreen
          onBackPress={handleUpdateMomentsState}
          onCenterPress={handleRecenterMoments}
          style={{ paddingHorizontal: 10 }}
          primaryColor={lightDarkTheme.primaryText}
          primaryBackground={lightDarkTheme.primaryBackground}
          onPress={handleRescatterMoments}
          label={"Rescatter"}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  escortBarContainer: { position: "absolute", bottom: 50, width: "100%" },
  innerContainer: { flexDirection: "column" },
  rowContainer: { flexDirection: "row" },
  labelWrapper: {},
  label: {},
});

export default MomentsSkia;
