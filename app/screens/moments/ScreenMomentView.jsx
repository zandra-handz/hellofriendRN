import React, { useEffect, useState, useCallback } from "react";

import { useRoute } from "@react-navigation/native";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import GlobalAppHeader from "@/app/components/headers/GlobalAppHeader";
import LeavesTwoFallingOutlineThickerSvg from "@/app/assets/svgs/leaves-two-falling-outline-thicker.svg";
import { useFocusEffect } from "@react-navigation/native";
import CarouselSlider from "@/app/components/appwide/CarouselSlider";
import MomentViewPage from "@/app/components/moments/MomentViewPage";
import { useFriendList } from "@/src/context/FriendListContext";

const ScreenMomentView = () => {
  const route = useRoute();
  const moment = route.params?.moment ?? null;
  const currentIndex = route.params?.index ?? null;

  const {
    capsuleList,
    capsuleCount,
    deleteMomentRQuery,
    deleteMomentMutation,
    updateCapsuleMutation,
    updateCacheWithNewPreAdded,
  } = useCapsuleList();
  // const [currentIndex, setCurrentIndex] = useState(0);
  const { selectedFriend, loadingNewFriend } = useSelectedFriend();
  const { themeAheadOfLoading } = useFriendList();

  // const renderHeader = useCallback(
  //   () => (
  //     <GlobalAppHeader
  //       title={"MOMENTS: "}
  //       navigateTo={"Moments"}
  //       icon={LeavesTwoFallingOutlineThickerSvg}
  //       altView={false}
  //     />
  //   ),
  //   [selectedFriend, loadingNewFriend, themeAheadOfLoading]
  // );

 

  //Updates if one is edited

  // useFocusEffect(
  //   useCallback(() => {
  //     if (capsuleList) {
  //       const matchingMoment = capsuleList.find((mom) => mom.id === moment.id);
  //       const index = capsuleList.findIndex((mom) => mom.id === moment.id);
  //       setCurrentIndex(index);
  //       setMomentInView(matchingMoment);
  //     }
  //   }, [capsuleList, moment.id]) // dependencies for the useCallback
  // );

  //manually closing this for right now because I give up
  // DONT THINK WE NEED THIS WITH THE NEW CAROUSEL COMPONENT
  // useEffect(() => {
  //   if (deleteMomentMutation.isSuccess) {
  //     if (capsuleList?.length < 1) {
  //       // closeModal();
  //     }

  //     let lastIndex = capsuleList.length - 1;
  //     console.log(
  //       `lastIndex value: ${lastIndex}, currentIndex value: ${currentIndex}, capsuleCount: ${capsuleCount}`
  //     );
  //     if (currentIndex != lastIndex) {
  //       if (currentIndex < lastIndex) {
  //         goToPreviousMoment();
  //       } else {
  //         goToNextMomentAfterRemovedPrev();
  //       }
  //     } else {
  //       goToFirstMoment();
  //     }
  //   }
  // }, [deleteMomentMutation.isSuccess]);

  useEffect(() => {
    //This runs before capsule list length updates
    if (updateCapsuleMutation.isSuccess) {
      updateCacheWithNewPreAdded(); //The animation in the screen itself triggers this too but after a delay, not sure if I need this here
      //  console.log(`capsule list length after update: ${capsuleList?.length}`);
    }
  }, [updateCapsuleMutation.isSuccess]);

  const handleDelete = (item) => {
    // console.log("handle delete moment in navigator triggered: ", item);
    try {
      const momentData = {
        friend: selectedFriend.id,
        id: item.id,
      };

      deleteMomentRQuery(momentData);
    } catch (error) {
      console.error("Error deleting moment:", error);
    }
  };

  //manually close if no more moments, since there is a delay in the update pre-add cache getting updated causing the modal to stay open
  // and continue to display the last moment after it is added to pre-add
  // useEffect(() => {
  //   if (capsuleList) {
  //     if (capsuleCount < 1) {
  //       console.log(
  //         `currentIndex: ${currentIndex}, capsuleCount: ${capsuleCount}, total moments length: ${capsuleList?.length || "0"}`
  //       );

  //       closeModal();
  //     }
  //   }
  // }, [currentIndex, capsuleList]);

  return (
    <SafeViewAndGradientBackground  style={{ flex: 1 }}>
      <CarouselSlider
        initialIndex={currentIndex}
        data={capsuleList}
        children={MomentViewPage}
      />
 
    </SafeViewAndGradientBackground>
  );
};

export default ScreenMomentView;
