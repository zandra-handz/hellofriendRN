import { View, Text } from "react-native";
import React, { useMemo } from "react";

type Props = {
  themeStyles: object;
}; 


const useThemeStyles = ({ themeStyles }: Props) => {

  console.log('themeSttlessss');
  const backgroundColorStyles = useMemo(
    () => ({
      primary: themeStyles?.primaryBackground?.backgroundColor ?? "white",
      overlay: themeStyles?.overlayBackgroundColor?.backgroundColor ?? "lightgray",
      darkerOverlay: themeStyles?.darkerOverlayBackgroundColor?.backgroundColor ?? "gray",
      lighterOverlay: themeStyles?.lighterOverlayBackgroundColor?.backgroundColor ?? "whitesmoke",
    }),
    [themeStyles]
  );

  return backgroundColorStyles;
};
export default useThemeStyles;
