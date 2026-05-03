// import { View, StyleSheet } from "react-native";
// import React from "react";
// import GlobalPressable from "../appwide/button/GlobalPressable";
// import SvgIcon from "@/app/styles/SvgIcons";
// import FadeDisappear from "../moments/FadeDisappear";


// type Props = {
//   onPress: () => void;
//   iconName: string;
//   backgroundColor: string;
//   iconColor: string;
//   spaceFromBottom?: number;
//   hidden?: boolean;
//   hideTiming?: number;
// };

// const TopLayerButton = ({
//   onPress,
//   iconName=`draw_pen`,
//   backgroundColor = "orange",
//   iconColor,
//   spaceFromBottom = 80,
//   hidden = false,
//   hideTiming = 200,
// }: Props) => {
//   return (
//     <FadeDisappear value={hidden} containerStyle={styles.fadeWrapper} timing={hideTiming}>
//       <View style={[styles.wrapper, { bottom: spaceFromBottom }]}>
//         <GlobalPressable
//           onPress={onPress}
//           style={[styles.container, { backgroundColor }]}
//         >
//           <SvgIcon name={iconName} color={iconColor} size={40} />
//         </GlobalPressable>
//       </View>
//     </FadeDisappear>
//   );
// };

// const styles = StyleSheet.create({
//   wrapper: {
//     position: "absolute",
//     right: 12,
//     zIndex: 99999,
//     elevation: 99999,
//   },
//   fadeWrapper: {
//     zIndex: 9

//   },
//   container: {
//     height: 60,
//     width: 60,
//     borderRadius: 999,
//     alignItems: "center",
//     justifyContent: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 5,
//     elevation: 8,
//     zIndex: 5000,
//   },
// });

// export default React.memo(TopLayerButton);

import { View, StyleSheet } from "react-native";
import React from "react";
import GlobalPressable from "../appwide/button/GlobalPressable";
import SvgIcon from "@/app/styles/SvgIcons";
import FadeDisappear from "../moments/FadeDisappear";
import manualGradientColors from "@/app/styles/StaticColors";

/* =========================
   HELPERS
========================= */

const ICON_OUTLINE_COLOR = "rgba(0,0,0,0.95)";
const ICON_OUTLINE_R = 1;

const getLuminance = (hex: string) => {
  const c = hex.replace("#", "");

  const rgb = [
    parseInt(c.substring(0, 2), 16),
    parseInt(c.substring(2, 4), 16),
    parseInt(c.substring(4, 6), 16),
  ].map((v) => {
    const s = v / 255;

    return s <= 0.03928
      ? s / 12.92
      : Math.pow((s + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
};

const getContrastRatio = (colorA: string, colorB: string) => {
  const lumA = getLuminance(colorA);
  const lumB = getLuminance(colorB);

  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);

  return (lighter + 0.05) / (darker + 0.05);
};

const pickReadableColor = ({
  background,
  lightColor,
  darkColor,
}: {
  background: string;
  lightColor: string;
  darkColor: string;
}) => {
  const lightContrast = getContrastRatio(background, lightColor);
  const darkContrast = getContrastRatio(background, darkColor);

  return lightContrast >= darkContrast ? lightColor : darkColor;
};

const OutlinedSvgIcon = ({
  name,
  color,
  size,
}: {
  name: string;
  color: string;
  size: number;
}) => {
  return (
    <View style={{ width: size, height: size }}>
      <View style={[styles.iconOutlineLayer, { left: -ICON_OUTLINE_R }]}>
        <SvgIcon name={name} color={ICON_OUTLINE_COLOR} size={size} />
      </View>

      <View style={[styles.iconOutlineLayer, { left: ICON_OUTLINE_R }]}>
        <SvgIcon name={name} color={ICON_OUTLINE_COLOR} size={size} />
      </View>

      <View style={[styles.iconOutlineLayer, { top: -ICON_OUTLINE_R }]}>
        <SvgIcon name={name} color={ICON_OUTLINE_COLOR} size={size} />
      </View>

      <View style={[styles.iconOutlineLayer, { top: ICON_OUTLINE_R }]}>
        <SvgIcon name={name} color={ICON_OUTLINE_COLOR} size={size} />
      </View>

      <SvgIcon name={name} color={color} size={size} />
    </View>
  );
};

/* =========================
   COMPONENT
========================= */

type Props = {
  onPress: () => void;
  iconName: string;
  backgroundColor: string;
  spaceFromBottom?: number;
  hidden?: boolean;
  hideTiming?: number;
};

const TopLayerButton = ({
  onPress,
  iconName = `draw_pen`,
  backgroundColor = "#FFA500",
  spaceFromBottom = 80,
  hidden = false,
  hideTiming = 200,
}: Props) => {
  const lightIconColor = manualGradientColors.manualLightTextColor;
  const darkIconColor = manualGradientColors.manualDarkTextColor;

  const resolvedIconColor = pickReadableColor({
    background: backgroundColor,
    lightColor: lightIconColor,
    darkColor: darkIconColor,
  });

  const shouldUseIconOutline = resolvedIconColor === lightIconColor;

  return (
    <FadeDisappear
      value={hidden}
      containerStyle={styles.fadeWrapper}
      timing={hideTiming}
    >
      <View style={[styles.wrapper, { bottom: spaceFromBottom }]}>
        <GlobalPressable
          onPress={onPress}
          style={[styles.container, { backgroundColor }]}
        >
          {shouldUseIconOutline ? (
            <OutlinedSvgIcon
              name={iconName}
              color={resolvedIconColor}
              size={40}
            />
          ) : (
            <SvgIcon name={iconName} color={resolvedIconColor} size={40} />
          )}
        </GlobalPressable>
      </View>
    </FadeDisappear>
  );
};

/* =========================
   STYLES
========================= */

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    right: 12,
    zIndex: 99999,
    elevation: 99999,
  },
  fadeWrapper: {
    zIndex: 9,
  },
  container: {
    height: 60,
    width: 60,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    zIndex: 5000,
  },
  iconOutlineLayer: {
    position: "absolute",
  },
});

export default React.memo(TopLayerButton);