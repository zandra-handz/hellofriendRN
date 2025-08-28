// import React from "react";
// import { View, Text, StyleSheet } from "react-native";
// import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
// import { useUser } from "@/src/context/UserContext";
// import { useFriendStyle } from "@/src/context/FriendStyleContext";
// import ImageMenuButton from "@/app/components/images/ImageMenuButton";

// import ImagesList from "@/app/components/images/ImagesList";
// import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
// import useImages from "@/src/hooks/ImageCalls/useImages";
// import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

// const ScreenImages = () => {
//   const { user } = useUser();
//   const { selectedFriend } = useSelectedFriend();
//   const { imageList } = useImages({
//     userId: user?.id,
//     friendId: selectedFriend?.id,
//   });
//   const { themeAheadOfLoading } = useFriendStyle();

//   const { themeStyles, manualGradientColors } = useGlobalStyle();

//   return (
//     <SafeViewAndGradientBackground
//       startColor={manualGradientColors.lightColor}
//       endColor={manualGradientColors.darkColor}
//       friendColorLight={themeAheadOfLoading.lightColor}
//       friendColorDark={themeAheadOfLoading.darkColor}
//       backgroundOverlayColor={themeStyles.primaryBackground.backgroundColor}
//       friendId={selectedFriend?.id}
//       style={{ flex: 1 }}
//     >
//       <View style={{ flex: 1 }}>
//         {imageList.length > 0 ? (
//           <>
//             <ImagesList
//               primaryBackground={themeStyles.primaryBackground.backgroundColor}
//               themeAheadOfLoading={themeAheadOfLoading}
//               height={80}
//               width={80}
//               singleLineScroll={false}
//             />
//           </>
//         ) : (
//           <Text></Text>
//         )}
//       </View>
//       <ImageMenuButton />
//     </SafeViewAndGradientBackground>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,

//     width: "100%",
//     justifyContent: "space-between",
//   },
// });

// export default ScreenImages;
