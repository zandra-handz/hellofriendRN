// import React from "react";
// import { View, StyleSheet } from "react-native";
// import manualGradientColors from "@/app/styles/StaticColors";
// import LoadingPage from "./LoadingPage";
// import SpinnerFive from "../button/SpinnerFive";

// import { useLDTheme } from "@/src/context/LDThemeContext";

// type Props = {
//   loading: boolean;
//   label?: string;
//   backgroundColor: string;
// };

// const LocalSolidSpinner = ({ loading, label, backgroundColor}: Props) => {


 


//   return (
//     <>
//       {loading && (
//         <View style={styles.container}>
//           <View style={[StyleSheet.absoluteFillObject, { backgroundColor: backgroundColor }]}>
//             <SpinnerFive
//               backgroundColor={backgroundColor} 
//               color1={manualGradientColors.lightColor}
//                    color2={manualGradientColors.darkColor}
           
//             />
//           </View>
//         </View>
//       )}
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     zIndex: 100000,
//     elevation: 100000,
//     position: "absolute",
//     width: "100%",
//     height: "100%",
//     flex: 1,
//     top: 0,
//     bottom: 0,
//     right: 0,
//     left: 0,
//   },
// });

// export default LocalSolidSpinner;


// LocalSolidSpinner.tsx
import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import manualGradientColors from "@/app/styles/StaticColors";
import SpinnerFive from "../button/SpinnerFive";

export type SpinnerHandle = {
  show: (backgroundColor: string) => void;
  hide: () => void;
};

const LocalSolidSpinner = forwardRef<SpinnerHandle>((_, ref) => {
  const [visible, setVisible] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("#000000");

  useImperativeHandle(ref, () => ({
    show: (bg: string) => {
      setBackgroundColor(bg);
      setVisible(true);
    },
    hide: () => {
      setVisible(false);
    },
  }));

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor }]}>
        <SpinnerFive
          backgroundColor={backgroundColor}
          color1={manualGradientColors.lightColor}
          color2={manualGradientColors.darkColor}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    zIndex: 100000,
    elevation: 100000,
    position: "absolute",
    width: "100%",
    height: "100%",
    flex: 1,
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
});

export default LocalSolidSpinner;