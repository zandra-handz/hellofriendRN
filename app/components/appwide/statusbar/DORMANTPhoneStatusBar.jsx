// import React, { useEffect, useState } from "react";
// import { StatusBar } from "react-native";

// import tinycolor from "tinycolor2";
// const PhoneStatusBar = ({
//   friendId,
//   themeAheadOfLoading,
//   theme,
//   nonCustomHeaderPage,
// }) => {
//   const [color, setColor] = useState("");

//   useEffect(() => {
//     if (!nonCustomHeaderPage) {
//       const backgroundColor = themeAheadOfLoading.darkColor;

//       const whiteContrast = tinycolor.readability(backgroundColor, "white");
//       const blackContrast = tinycolor.readability(backgroundColor, "black");

//       const readableColor = whiteContrast > blackContrast ? null : "black";

//       setColor(readableColor);
//     } else {
//       const readableColor = theme == "dark" ? null : "black";
//       setColor(readableColor);
//     }
//   }, [theme, nonCustomHeaderPage, themeAheadOfLoading, friendId]);

//   return (
//     <StatusBar
//       barStyle={color ? "dark-content" : "light-content"}
//       translucent={true}
//     />
//   );
// };

// export default PhoneStatusBar;
