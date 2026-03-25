// import { Text, View, StyleSheet, Alert, ColorValue, DimensionValue } from "react-native";
// import React, { useState } from "react";
// import GlobalPressable from "../appwide/button/GlobalPressable";
// import GeckoMineSvg from "@/app/styles/svgs/gecko-mine";

// import { showModalMessage } from "@/src/utils/ShowModalMessage";
// import useFriendDash from "@/src/hooks/useFriendDash";


// interface GeckoFooterButtonProps {
//   label?: string;
//   primaryColor: ColorValue;
//   labelFontSize?: number;
//   size: DimensionValue;
//   highlightColor?: string;
//   highlightStrokeWidth?: number;
//   iconStyle?: object;
//   onPress: () => void;
//   onLongPress?: () => void;
//   confirmationRequired?: boolean;
//   confirmationTitle?: string;
//   confirmationMessage?: string;
//   confirmationActionWord?: string;
// }

// const GeckoFooterButton: React.FC<GeckoFooterButtonProps> = ({
//   label = "Visual",
//   primaryColor,
//   labelFontSize = 11,
//   size = 130,
//   highlightColor = "limegreen",
//   highlightStrokeWidth = 2,
//   iconStyle = { top: 20, left: 10, overflow: "hidden" },
//   onPress,
//   onLongPress,
//   confirmationRequired = false,
//   confirmationTitle = "",
//   confirmationMessage = "Are you sure?",
//   confirmationActionWord = "Yes",
// }) => {
//   const [isHighlighted, setIsHighlighted] = useState(false);
// const handleOnPress = () => {
//     if (isHighlighted) {
//       setIsHighlighted(false);
//       return;
//     }

//     if (confirmationRequired) {
//       Alert.alert(confirmationTitle, confirmationMessage, [
//         { text: "Cancel", onPress: () => console.log("Cancel Pressed"), style: "cancel" },
//         { text: confirmationActionWord, onPress: () => onPress() },
//       ]);
//     } else {
//       onPress();
//     }
//   };

// const handleLongPress = () => {
//     if (isHighlighted) {
//       setIsHighlighted(false);
//       return;
//     }

//     setIsHighlighted(true);
//     onLongPress?.();

//     showModalMessage({
//       title: "Gecko Mode",
//       body: "Some info about this feature.",
//       confirmLabel: "Got it!",
//       onConfirm: () => setIsHighlighted(false),
//     });

    
//   };
//   return (
//     <GlobalPressable onLongPress={handleLongPress} onPress={handleOnPress} style={styles.container}>
//       <View style={iconStyle}>
//         <GeckoMineSvg
//           width={size}
//           height={size}
//           fill={primaryColor}
//           stroke={isHighlighted ? highlightColor : "none"}
//           strokeWidth={isHighlighted ? highlightStrokeWidth : 0}
//         />
//       </View>

//       <Text style={[styles.text, { fontSize: labelFontSize, color: primaryColor }]}>
//         {label}
//       </Text>
//     </GlobalPressable>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     height: "100%",
//     flex: 1,
//   },
//   text: {
//     marginTop: 4,
//     paddingHorizontal: 6,
//     paddingVertical: 4,
//     borderRadius: 10,
//     fontWeight: "bold",
//   },
// });

// export default GeckoFooterButton;


import { Text, View, StyleSheet, Alert, ColorValue, DimensionValue } from "react-native";
import React, { useState } from "react";
import GlobalPressable from "../appwide/button/GlobalPressable";
import GeckoMineSvg from "@/app/styles/svgs/gecko-mine";
import { showModalMessage } from "@/src/utils/ShowModalMessage";
import useFriendDash from "@/src/hooks/useFriendDash";

interface GeckoFooterButtonProps {
  label?: string;
  primaryColor: ColorValue;
  labelFontSize?: number;
  size: DimensionValue;
  highlightColor?: string;
  highlightStrokeWidth?: number;
  iconStyle?: object;
  onPress: () => void;
  onLongPress?: () => void;
  confirmationRequired?: boolean;
  confirmationTitle?: string;
  confirmationMessage?: string;
  confirmationActionWord?: string;
}

const GeckoFooterButton: React.FC<GeckoFooterButtonProps> = ({
  userId,
  friendId,
  label = "Visual",
  primaryColor,
  labelFontSize = 11,
  size = 130,
  highlightColor = "limegreen",
  highlightStrokeWidth = 2,
  iconStyle = { top: 20, left: 10, overflow: "hidden" },
  onPress,
  onLongPress,
  confirmationRequired = false,
  confirmationTitle = "",
  confirmationMessage = "Are you sure?",
  confirmationActionWord = "Yes",
}) => {
  const [isHighlighted, setIsHighlighted] = useState(false);
    const { friendDash } = useFriendDash({ userId, friendId });
    console.log(friendDash)

  const handleOnPress = () => {
    if (isHighlighted) {
      setIsHighlighted(false);
      return;
    }

    if (confirmationRequired) {
      Alert.alert(confirmationTitle, confirmationMessage, [
        { text: "Cancel", onPress: () => console.log("Cancel Pressed"), style: "cancel" },
        { text: confirmationActionWord, onPress: () => onPress() },
      ]);
    } else {
      onPress();
    }
  };

  const handleLongPress = () => {
    if (isHighlighted) {
      setIsHighlighted(false);
      return;
    }

    setIsHighlighted(true);
    onLongPress?.();

    showModalMessage({
      title: "Gecko Mode",
      body: "Some info about this feature.",
      confirmLabel: "Got it!",
      onConfirm: () => setIsHighlighted(false),
      floatingElement: (
        <GeckoMineSvg
          width={size}
          height={size}
          fill={primaryColor}
          stroke={highlightColor}
          strokeWidth={highlightStrokeWidth}
        />
      ),
    });
  };

  return (
    <GlobalPressable onLongPress={handleLongPress} onPress={handleOnPress} style={styles.container}>
      <View style={iconStyle}>
        <GeckoMineSvg
          width={size}
          height={size}
          fill={primaryColor}
          stroke={isHighlighted ? highlightColor : "none"}
          strokeWidth={isHighlighted ? highlightStrokeWidth : 0}
        />
      </View>

      <Text style={[styles.text, { fontSize: labelFontSize, color: primaryColor }]}>
        {label}
      </Text>
    </GlobalPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    flex: 1,
  },
  text: {
    marginTop: 4,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 10,
    fontWeight: "bold",
  },
});

export default GeckoFooterButton;