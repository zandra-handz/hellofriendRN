 
// import React, {
//   createContext,
//   useContext,
//   useState,
//   useMemo,
//   ReactNode,
// } from "react";
 
 
// import { Friend, ThemeAheadOfLoading } from "../types/FriendTypes";

// interface FriendStyleContextType {
//   themeAheadOfLoading: ThemeAheadOfLoading;
//   getThemeAheadOfLoading: (friend: Friend) => void;
// }

// //HARD CODE LIGHT DARK COLOR LOCATION:
// //FRIENDTINTPRESSABLE unlikely to be resorted to but does have hard code to get TS to stop yelling at me

// const FriendStyleContext = createContext<FriendStyleContextType>({
 
// });






// export const useFriendStyle = (): FriendStyleContextType =>
//   useContext(FriendStyleContext);

// interface FriendStyleProviderProps {
//   children: ReactNode;
// }


// // I don't think gradient safe view stuff is being used but leaving it in uncommented for a bit
// export const FriendStyleProvider: React.FC<FriendStyleProviderProps> = ({
//   children,
// }) => {  
//   const [themeAheadOfLoading, setThemeAheadOfLoading] = useState({
//     darkColor: "#4caf50",
//     lightColor: "#a0f143",
//     fontColor: "#000000",
//     fontColorSecondary: "#000000",
//   });

//   type handleSetThemeProps = {
//     lightColor: string;
//     darkColor: string;
//     fontColor: string;
//     fontColorSecondary: string;

//   };

 
//   const handleSetTheme = ({
//     lightColor,
//     darkColor,
//     fontColor,
//     fontColorSecondary,
//   }: handleSetThemeProps ) => {
//     setThemeAheadOfLoading({
//       lightColor: lightColor,
//       darkColor: darkColor,
//       fontColor: fontColor,
//       fontColorSecondary: fontColorSecondary,
//     });
//   };

//   const getThemeAheadOfLoading = (loadingFriend: Friend) => {
    
//     handleSetTheme({
//       lightColor: loadingFriend.theme_color_light || "#a0f143",
//       darkColor: loadingFriend.theme_color_dark || "#4caf50",
//       fontColor: loadingFriend.theme_color_font || "#000000",
//       fontColorSecondary: loadingFriend.theme_color_font_secondary || "#000000",
//     });
//   };

//   const resetTheme = () => {
//     handleSetTheme({
//       lightColor: "#a0f143",
//       darkColor: "#4caf50",
//       fontColor: "#000000",
//       fontColorSecondary: "#000000",
//     });
//   };

 
//   const contextValue = useMemo(
//     () => ({
//       themeAheadOfLoading,
//       setThemeAheadOfLoading,
//       getThemeAheadOfLoading,
//       handleSetTheme,
//       resetTheme,  
//     }),
//     [
//       themeAheadOfLoading,
//       getThemeAheadOfLoading,
//       resetTheme,
//       handleSetTheme,  
//     ]
//   );
//   return (
//     <FriendStyleContext.Provider value={contextValue}>
//       {children}
//     </FriendStyleContext.Provider>
//   );
// };

// export default FriendStyleContext;
