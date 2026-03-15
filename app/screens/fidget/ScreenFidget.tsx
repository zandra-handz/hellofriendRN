import { View, StyleSheet, Pressable, Text, Button } from "react-native";
import React, { useState, useRef } from "react"; 
import { useLDTheme } from "@/src/context/LDThemeContext";
import manualGradientColors from "@/app/styles/StaticColors";
import { AppFontStyles } from "@/app/styles/AppFonts";
import TextHeader from "@/app/components/appwide/format/TextHeader";
import SpinnerThree from "@/app/components/appwide/button/SpinnerThree";
import SpinnerFive from "@/app/components/appwide/button/SpinnerFive";
import SpinnerSix from "@/app/components/appwide/button/SpinnerSix";
import SpinnerSeven from "@/app/components/appwide/button/SpinnerSeven";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSharedValue } from "react-native-reanimated";

type Props = {};

const INITIAL_INTERVAL = 200;
const MIN_INTERVAL = 40;
const ACCELERATION_STEP = 15;

const ScreenFidget = (props: Props) => {
  const { lightDarkTheme } = useLDTheme();
  const backgroundColor = lightDarkTheme.primaryBackground;
  const textColor = lightDarkTheme.primaryText;

  const color1 = manualGradientColors.lightColor;
  const color2 = manualGradientColors.darkColor;

  const mod = (n, m) => ((n % m) + m) % m;
  const [spinnerViewing, setSpinnerViewing] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const speed = useSharedValue(14);

  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentIntervalRef = useRef(INITIAL_INTERVAL);

  const clearPressInterval = () => {
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }
    currentIntervalRef.current = INITIAL_INTERVAL;
  };

  const startRepeating = (delta: number) => {
    const tick = () => {
      speed.value = speed.value + delta;
      currentIntervalRef.current = Math.max(
        MIN_INTERVAL,
        currentIntervalRef.current - ACCELERATION_STEP
      );
      intervalRef.current = setTimeout(tick, currentIntervalRef.current);
    };
    intervalRef.current = setTimeout(tick, INITIAL_INTERVAL);
  };

  const handleNextOption = () => {
    setSpinnerViewing(mod(spinnerViewing + 1, 6));
  };

  const welcomeTextStyle = AppFontStyles.welcomeText;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor, paddingHorizontal: 10 }}>
      <TextHeader
        label={`Spinner ${spinnerViewing}`}
        color={textColor}
        fontStyle={welcomeTextStyle}
        showNext={true}
        nextEnabled={true}
        nextIconName="arrow_right"
        onNext={handleNextOption}
        nextColor={textColor}
        nextBackgroundColor="transparent"
        backgroundColor="transparent"
        zIndex={10}
      />

      <View style={StyleSheet.absoluteFill}>
        {spinnerViewing === 0 && (
          <SpinnerThree
            color1={color1}
            color2={manualGradientColors.homeDarkColor}
            speed={speed}
          />
        )}
        {spinnerViewing === 1 && (
          <SpinnerThree
            color1={color1}
            color2={manualGradientColors.homeDarkColor}
             speed={speed}
          />
        )}
        {spinnerViewing === 2 && (
          <SpinnerThree
            color1={color1}
            color2={manualGradientColors.homeDarkColor}
             speed={speed}
          />
        )}
        {spinnerViewing === 3 && <SpinnerFive color1={color1} color2={color2} />}
        {spinnerViewing === 4 && <SpinnerSix color1={color1} color2={color2} />}
        {spinnerViewing === 5 && <SpinnerSeven color1={color1} color2={color2} />}
      </View>
 
      <Pressable
        style={[styles.hideToggle, { opacity: showControls ? 1 : 0 }]}
        onPress={() => setShowControls(v => !v)}
      >
        <Text style={[styles.speedButtonText, { fontSize: 13 }]}>
          {showControls ? "hide" : "show"}
        </Text>
      </Pressable>
 
      <View style={[styles.upDownButtonsWrapper, { opacity: showControls ? 1 : 0 }]}>
        <Pressable
          style={styles.speedButton}
          onPress={() => { speed.value = speed.value + 1; }}
          onLongPress={() => startRepeating(1)}
          onPressOut={clearPressInterval}
          delayLongPress={300}
        >
          <Text style={styles.speedButtonText}>+</Text>
        </Pressable>

        <Pressable
          style={styles.speedButton}
          onPress={() => { speed.value = speed.value - 1; }}
          onLongPress={() => startRepeating(-1)}
          onPressOut={clearPressInterval}
          delayLongPress={300}
        >
          <Text style={styles.speedButtonText}>−</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  hideToggle: {
    position: "absolute",
    bottom: 160,
    alignSelf: "center",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "#222",
  },
  upDownButtonsWrapper: {
    width: "100%",
    height: 150,
    bottom: 0,
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
  },
  speedButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#222",
    alignItems: "center",
    justifyContent: "center",
  },
  speedButtonText: {
    color: "#a0f143",
    fontSize: 28,
    fontWeight: "bold",
  },
  shaderContainer: {},
});

export default ScreenFidget;









// import { View, StyleSheet, Pressable, Text } from "react-native";
// import React, { useState, useRef, useEffect } from "react";
// import { useLDTheme } from "@/src/context/LDThemeContext";
// import manualGradientColors from "@/app/styles/StaticColors";
// import { AppFontStyles } from "@/app/styles/AppFonts";
// import TextHeader from "@/app/components/appwide/format/TextHeader";
// import SpinnerThree from "@/app/components/appwide/button/SpinnerThree";
// import SpinnerFive from "@/app/components/appwide/button/SpinnerFive";
// import SpinnerSix from "@/app/components/appwide/button/SpinnerSix";
// import SpinnerSeven from "@/app/components/appwide/button/SpinnerSeven";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useSharedValue } from "react-native-reanimated";

// type Props = {};

// const INITIAL_INTERVAL = 200;
// const MIN_INTERVAL = 40;
// const ACCELERATION_STEP = 15;

// const PEAK_SPEED = 50;
// const AUTO_TICK_MS = 30;

// const RAMP_UP_MS = 4000;
// const WIND_DOWN_MS = 1200;
// const HALF_CYCLE_MS = RAMP_UP_MS + WIND_DOWN_MS;

// const ScreenFidget = (props: Props) => {
//   const { lightDarkTheme } = useLDTheme();
//   const backgroundColor = lightDarkTheme.primaryBackground;
//   const textColor = lightDarkTheme.primaryText;

//   const color1 = manualGradientColors.lightColor;
//   const color2 = manualGradientColors.darkColor;

//   const mod = (n: number, m: number) => ((n % m) + m) % m;
//   const [spinnerViewing, setSpinnerViewing] = useState(0);
//   const [showControls, setShowControls] = useState(true);
//   const speed = useSharedValue(0);

//   const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
//   const currentIntervalRef = useRef(INITIAL_INTERVAL);
//   const isManualRef = useRef(false);

//   const autoTickRef = useRef<ReturnType<typeof setInterval> | null>(null);

//   const stopAutoAnimation = () => {
//     if (autoTickRef.current) {
//       clearInterval(autoTickRef.current);
//       autoTickRef.current = null;
//     }
//   };

//   const startAutoAnimation = () => {
//     stopAutoAnimation();
//     const startTime = Date.now();

//     autoTickRef.current = setInterval(() => {
//       const elapsed = Date.now() - startTime;
//       const fullCycle = HALF_CYCLE_MS * 2;
//       const cyclePos = elapsed % fullCycle;

//       const inFirstHalf = cyclePos < HALF_CYCLE_MS;
//       const direction = inFirstHalf ? 1 : -1;
//       const halfElapsed = inFirstHalf ? cyclePos : cyclePos - HALF_CYCLE_MS;

//       let magnitude: number;

//       if (halfElapsed < RAMP_UP_MS) {
//         const t = halfElapsed / RAMP_UP_MS;
//         magnitude = t * t * PEAK_SPEED;
//       } else {
//         const t = (halfElapsed - RAMP_UP_MS) / WIND_DOWN_MS;
//         magnitude = (1 - t) * (1 - t) * PEAK_SPEED;
//       }

//       speed.value = direction * magnitude;
//     }, AUTO_TICK_MS);
//   };

//   useEffect(() => {
//     startAutoAnimation();
//     return stopAutoAnimation;
//   }, []);

//   const clearPressInterval = () => {
//     if (intervalRef.current) {
//       clearTimeout(intervalRef.current);
//       intervalRef.current = null;
//     }
//     currentIntervalRef.current = INITIAL_INTERVAL;
//     isManualRef.current = false;
//     startAutoAnimation();
//   };

//   const startRepeating = (delta: number) => {
//     stopAutoAnimation();
//     isManualRef.current = true;
//     const tick = () => {
//       speed.value = speed.value + delta;
//       currentIntervalRef.current = Math.max(
//         MIN_INTERVAL,
//         currentIntervalRef.current - ACCELERATION_STEP
//       );
//       intervalRef.current = setTimeout(tick, currentIntervalRef.current);
//     };
//     intervalRef.current = setTimeout(tick, INITIAL_INTERVAL);
//   };

//   const handleManualPress = (delta: number) => {
//     stopAutoAnimation();
//     speed.value = speed.value + delta;
//     setTimeout(startAutoAnimation, 800);
//   };

//   const handleNextOption = () => {
//     setSpinnerViewing(mod(spinnerViewing + 1, 6));
//   };

//   const welcomeTextStyle = AppFontStyles.welcomeText;

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor, paddingHorizontal: 10 }}>
//       <TextHeader
//         label={`Spinner ${spinnerViewing}`}
//         color={textColor}
//         fontStyle={welcomeTextStyle}
//         showNext={true}
//         nextEnabled={true}
//         nextIconName="arrow_right"
//         onNext={handleNextOption}
//         nextColor={textColor}
//         nextBackgroundColor="transparent"
//         backgroundColor="transparent"
//         zIndex={10}
//       />

//       <View style={StyleSheet.absoluteFill}>
//         {spinnerViewing === 0 && (
//           <SpinnerThree
//             color1={color1}
//             color2={manualGradientColors.homeDarkColor}
//             speed={speed}
//           />
//         )}
//         {spinnerViewing === 1 && (
//           <SpinnerThree
//             color1={color1}
//             color2={manualGradientColors.homeDarkColor}
//             speed={14}
//           />
//         )}
//         {spinnerViewing === 2 && (
//           <SpinnerThree
//             color1={color1}
//             color2={manualGradientColors.homeDarkColor}
//             speed={24}
//           />
//         )}
//         {spinnerViewing === 3 && (
//           <SpinnerFive color1={color1} color2={color2} />
//         )}
//         {spinnerViewing === 4 && (
//           <SpinnerSix color1={color1} color2={color2} />
//         )}
//         {spinnerViewing === 5 && (
//           <SpinnerSeven color1={color1} color2={color2} />
//         )}
//       </View>

//       <Pressable
//         style={[styles.hideToggle, { opacity: showControls ? 1 : 0 }]}
//         onPress={() => setShowControls((v) => !v)}
//       >
//         <Text style={[styles.speedButtonText, { fontSize: 13 }]}>hide</Text>
//       </Pressable>

//       <View
//         style={[
//           styles.upDownButtonsWrapper,
//           { opacity: showControls ? 1 : 0 },
//         ]}
//       >
//         <Pressable
//           style={styles.speedButton}
//           onPress={() => handleManualPress(1)}
//           onLongPress={() => startRepeating(1)}
//           onPressOut={clearPressInterval}
//           delayLongPress={300}
//         >
//           <Text style={styles.speedButtonText}>+</Text>
//         </Pressable>

//         <Pressable
//           style={styles.speedButton}
//           onPress={() => handleManualPress(-1)}
//           onLongPress={() => startRepeating(-1)}
//           onPressOut={clearPressInterval}
//           delayLongPress={300}
//         >
//           <Text style={styles.speedButtonText}>−</Text>
//         </Pressable>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   hideToggle: {
//     position: "absolute",
//     bottom: 160,
//     alignSelf: "center",
//     paddingHorizontal: 14,
//     paddingVertical: 6,
//     borderRadius: 12,
//     backgroundColor: "#222",
//   },
//   upDownButtonsWrapper: {
//     width: "100%",
//     height: 150,
//     bottom: 0,
//     position: "absolute",
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     gap: 24,
//   },
//   speedButton: {
//     width: 64,
//     height: 64,
//     borderRadius: 32,
//     backgroundColor: "#222",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   speedButtonText: {
//     color: "#a0f143",
//     fontSize: 28,
//     fontWeight: "bold",
//   },
//   shaderContainer: {},
// });

// export default ScreenFidget;