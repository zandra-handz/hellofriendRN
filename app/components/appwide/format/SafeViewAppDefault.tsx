import React, { useMemo } from "react"; 
import CustomStatusBar from "../statusbar/CustomStatusBar";
import GradientBackgroundStatic from "../display/GradientBackgroundStatic";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { screenGradients } from "@/app/styles/GradientDirections";

type Props = {
  children: React.ReactNode;
  style: object;
  useCustomStatus: boolean;
  customStatusIsDarkMode: boolean;
};

export const SafeViewAppDefault = ({
  children,
  style,
  useCustomStatus = true,
  customStatusIsDarkMode = false,
}: Props) => {
  const insets = useSafeAreaInsets();

  // hard coded instead, to set the status bar light-mode even when phone is in dark-mode, because of background
  //   const includeCustomStatusBar = true;

  const top = typeof insets.top === "number" ? insets.top : 0;
  const bottom = typeof insets.bottom === "number" ? insets.bottom : 0;
  const left = typeof insets.left === "number" ? insets.left : 0;
  const right = typeof insets.right === "number" ? insets.right : 0;

  const paddingStyle = useMemo(
    () => ({
      paddingTop: top,
      paddingBottom: bottom,
      paddingLeft: left,
      paddingRight: right,
      //   backgroundColor: backgroundColor
    }),
    [],
  );

  return (
    <GradientBackgroundStatic
      additionalStyles={[paddingStyle, style]}
      direction={screenGradients.default}
    >
      {/* {includeCustomStatusBar && <CustomStatusBar manualDarkMode={false} />} */}
      {useCustomStatus && (
        <CustomStatusBar manualDarkMode={customStatusIsDarkMode} />
      )}

      {children}
    </GradientBackgroundStatic>
  );
};

export default SafeViewAppDefault;
