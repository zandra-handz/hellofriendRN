// import { View, Text, StyleSheet } from "react-native";
// import React from "react";
// import GlobalPressable from "../appwide/button/GlobalPressable";
// import manualGradientColors from "@/app/styles/StaticColors";
// import GeckoSolidSvg from "@/app/assets/svgs/gecko-solid.svg";
// import { Vibration } from "react-native";

// type Props = {
//   onSinglePress: () => void;
//   onDoublePress: () => void;
// };

// const GeckoGoButton = ({ onSinglePress, onDoublePress }: Props) => {
//   const onLongPressVibrate = () => {
//     Vibration.vibrate(100);
//     onDoublePress();
//   };

//   return (
//     <GlobalPressable
//       onLongPress={onLongPressVibrate}
//       onPress={onSinglePress}
//       style={[
//         styles.container,
//         {
//           backgroundColor: manualGradientColors.lightColor,
//         },
//       ]}
//     >
//       <View style={styles.geckoRotateContainer}>
//         <GeckoSolidSvg
//           width={158}
//           height={158}
//           color={manualGradientColors.homeDarkColor}
//           style={{ opacity: 1 }}
//         />
//       </View>
//       <View style={styles.geckoLabelContainer}>
//         <Text
//           style={{
//             color: manualGradientColors.homeDarkColor,
//             fontSize: 22,
//             fontWeight: "bold",
//           }}
//         >
//           GO{" "}
//         </Text>
//       </View>
//     </GlobalPressable>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     justifyContent: "center",
//     borderRadius: 999,
//     width: 70,
//     height: 68,
//     overflow: "hidden",
//   },
//   geckoRotateContainer: {
//     position: "absolute",
//     opacity: 0.9,
//     top: -68,
//     right: 10,
//     transform: [{ rotate: "90deg" }],
//   },
//   geckoLabelContainer: {
//     bottom: 3,
//     position: "absolute",
//     alignItems: "center",
//     flexDirection: "row",
//     width: "100%",
//     left: 20,
//   },
// });

// export default GeckoGoButton;


import { View, Text, StyleSheet } from "react-native";
import React from "react";
import GlobalPressable from "../appwide/button/GlobalPressable";
import SvgIcon from "@/app/styles/SvgIcons";
import manualGradientColors from "@/app/styles/StaticColors";
// import GeckoSolidSvg from "@/app/assets/svgs/gecko-solid.svg";
import { Vibration } from "react-native";

type Props = {
  onSinglePress: () => void;
  onDoublePress: () => void;
  color: string;
  backgroundColor: string;
};

const GeckoGoButton = ({ onSinglePress, onDoublePress, color, backgroundColor }: Props) => {
  const onLongPressVibrate = () => {
    Vibration.vibrate(100);
    onDoublePress();
  };

  return (
    <GlobalPressable
      onLongPress={onLongPressVibrate}
      onPress={onSinglePress}
      style={[
        styles.container,
        {
          borderColor: color,
          backgroundColor: backgroundColor,
        },
      ]}
    >
     <SvgIcon name={`chevron_double_right`} size={30} color={color}/>
    </GlobalPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    borderRadius: 999,
    width: 70,
    height: 68,
    overflow: "hidden",
     alignItems: "center",
     opacity: .7,
   
    borderWidth: 0,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    // Shadow for Android
    elevation: 8,

  },
  geckoRotateContainer: {
    position: "absolute",
    opacity: 0.9,
    top: -68,
    right: 10,
    transform: [{ rotate: "90deg" }],
  },
  geckoLabelContainer: {
    bottom: 3,
    position: "absolute",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    left: 20,
  },
});

export default GeckoGoButton;
