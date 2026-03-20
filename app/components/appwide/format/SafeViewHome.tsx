import React, { useMemo } from "react";
import CustomStatusBar from "../statusbar/CustomStatusBar";
 
import { useSafeAreaInsets } from "react-native-safe-area-context";
 
import { SafeAreaView } from "react-native-safe-area-context";
type Props = {
  children: React.ReactNode;
  style: object;
  useCustomStatus: boolean;
  customStatusIsDarkMode: boolean;
  backgroundColor0: string | null;
  backgroundColor1: string | null;
};

export const SafeViewHome = ({
  children,
  style,
  useCustomStatus = true,
  customStatusIsDarkMode = false,
  backgroundColor0 = null,
  backgroundColor1 = null,
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
    <SafeAreaView style={style}>
      {/* {includeCustomStatusBar && <CustomStatusBar manualDarkMode={false} />} */}
      {useCustomStatus && (
        <CustomStatusBar manualDarkMode={customStatusIsDarkMode} />
      )}

      {children}
    </SafeAreaView>
  );
};

export default SafeViewHome;
 