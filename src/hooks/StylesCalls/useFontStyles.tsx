import { View, Text } from "react-native";
import React, { useMemo } from "react";

type Props = {
  appFontStyles: object;
};

const useFontStyles = ({ appFontStyles }: Props) => {
  const fontStyles = useMemo(
    () => ({
      welcome: appFontStyles?.welcomeText ?? {},
      subwelcome: appFontStyles?.subWelcomeText ?? {},
    }),
    [appFontStyles]
  );

  return fontStyles;
};

export default useFontStyles;
