// import React from "react";
// import { View } from "react-native";
// import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
// import { useUser } from "@/src/context/UserContext";
// import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
// import { useFriendDash } from "@/src/context/FriendDashContext";
// import LoadingPage from "@/app/components/appwide/spinner/LoadingPage";
// import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
// import { useFriendStyle } from "@/src/context/FriendStyleContext";
// import ReloadList from "@/app/components/helloes/ReloadList";
// import { useRoute } from "@react-navigation/native";
// import { useCapsuleList } from "@/src/context/CapsuleListContext";
// import useCreateMoment from "@/src/hooks/CapsuleCalls/useCreateMoment";

// const eeScreenReload = () => {
//   const route = useRoute();
// const { user} = useUser();
//   const items = route.params?.items ?? false;
//   console.log(`items in screen reload`, items);
//   const { selectedFriend } = useSelectedFriend();
//   const { themeAheadOfLoading } = useFriendStyle();
//   const { loadingDash } = useFriendDash();
//   const { capsuleList } = useCapsuleList(); // also need to update cache
// const { handleCreateMoment} = useCreateMoment({userId: user?.id, friendId: selectedFriend?.id});
//   const { themeStyles, manualGradientColors } = useGlobalStyle();

//   const useDimAppBackground = true;

//   return (
//     <SafeViewAndGradientBackground
//       startColor={manualGradientColors.lightColor}
//       endColor={manualGradientColors.darkColor}
//       friendColorLight={themeAheadOfLoading.lightColor}
//       friendColorDark={themeAheadOfLoading.darkColor}
//       backgroundOverlayColor={themeStyles.primaryBackground.backgroundColor}
//       friendId={selectedFriend?.id}
//       includeBackgroundOverlay={useDimAppBackground}
//       style={{ flex: 1 }}
//     >
//       {loadingDash && (
//         <View style={{ flex: 1, width: "100%" }}>
//           <LoadingPage
//             loading={true}
//             spinnerSize={30}
//             spinnerType={"flow"}
//             color={themeStyles.primaryBackground.backgroundColor}
//           />
//         </View>
//       )}
//       {selectedFriend && !loadingDash && (
//         <View style={{ flex: 1 }}>{<ReloadList capsuleList={capsuleList} handleCreateMoment={handleCreateMoment} items={items} />}</View>
//       )}
//     </SafeViewAndGradientBackground>
//   );
// };

// export default eeScreenReload;
