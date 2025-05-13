import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native";
import { useFriendList } from "@/src/context/FriendListContext";
import { useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
 import SafeView from "@/app/components/appwide/format/SafeView";
import HeaderMoment from "@/app/components/headers/HeaderMoment";
import ContentMomentView from "@/app/components/moments/ContentMomentView";
import NavigationArrows from "@/app/components/appwide/button/NavigationArrows";

const ScreenMomentView = () => {
  const route = useRoute();
  const moment = route.params?.moment ?? null;
  const { themeAheadOfLoading   } = useFriendList();

 

  const {
    capsuleList,
    capsuleCount,
    deleteMomentRQuery,
    deleteMomentMutation, 
    updateCapsuleMutation,
    updateCacheWithNewPreAdded,
  } = useCapsuleList();
  const [currentIndex, setCurrentIndex] = useState(0); 
  const { selectedFriend } = useSelectedFriend();
  const [momentInView, setMomentInView] = useState(moment || null);

  useEffect(() => {
    if (moment) {
        const matchingMoment = capsuleList.find((mom) => mom.id === moment.id);
      const index = capsuleList.findIndex((mom) => mom.id === moment.id);
      setCurrentIndex(index);
      setMomentInView(matchingMoment);
    }
  }, [moment]);


//Updates if one is edited
  useEffect(() => {
    if (capsuleList) {
        const matchingMoment = capsuleList.find((mom) => mom.id === moment.id);
      const index = capsuleList.findIndex((mom) => mom.id === moment.id);
      setCurrentIndex(index);
      setMomentInView(matchingMoment);
    }
  }, [capsuleList]);


  

  //manually closing this for right now because I give up
  useEffect(() => {
    if (deleteMomentMutation.isSuccess) {
      if (capsuleList?.length < 1) {
        closeModal();
      }

      let lastIndex = capsuleList.length - 1;
      console.log(
        `lastIndex value: ${lastIndex}, currentIndex value: ${currentIndex}, capsuleCount: ${capsuleCount}`
      );
      if (currentIndex != lastIndex) {
        if (currentIndex < lastIndex) {
          goToPreviousMoment();
        } else {
          goToNextMomentAfterRemovedPrev();
        }
      } else {
        goToFirstMoment();
      }
    }
  }, [deleteMomentMutation.isSuccess]);

  useEffect(() => {
    //This runs before capsule list length updates
    if (updateCapsuleMutation.isSuccess) {
      updateCacheWithNewPreAdded(); //The animation in the screen itself triggers this too but after a delay, not sure if I need this here
      console.log(`capsule list length after update: ${capsuleList?.length}`);

      if (capsuleList?.length < 1) {
        closeModal();
      }

      let lastIndex = capsuleList.length - 1;
      console.log(
        `lastIndex value: ${lastIndex}, currentIndex value: ${currentIndex}, capsuleCount: ${capsuleCount}`
      );
      if (currentIndex != lastIndex) {
        if (currentIndex < lastIndex) {
          goToNextMomentAfterRemovedPrev();
        } else {
          goToPreviousMoment();
        }
      } else {
        goToFirstMoment();
      }
    }
  }, [updateCapsuleMutation.isSuccess]);

  const closeModal = () => {
    onClose();
  };

  const goToPreviousMoment = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
      console.log(capsuleList[currentIndex - 1]);
      setMomentInView(capsuleList[currentIndex - 1]);
    }
  };

  const goToNextMoment = () => {
    if (currentIndex < capsuleList.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      console.log(capsuleList[currentIndex + 1]);
      setMomentInView(capsuleList[currentIndex + 1]);
    }
  };

  const goToNextMomentAfterRemovedPrev = () => {
    if (currentIndex < capsuleList.length - 1) {
      //setCurrentIndex(prevIndex => prevIndex + 1);
      //console.log(capsuleList[currentIndex + 1]);
      setMomentInView(capsuleList[currentIndex + 1]);
    }
  };

  const goToFirstMoment = () => {
    if (capsuleList.length > 0) {
      setCurrentIndex((prevIndex) => prevIndex * 0);
      //console.log(capsuleList[currentIndex + 1]);
      setMomentInView(capsuleList[0]);
    } else {
      closeModal();
    }
  };

  const handleDelete = (item) => {
    console.log("handle delete moment in navigator triggered: ", item);
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
  useEffect(() => {
    if (capsuleList) {
      if (capsuleCount < 1) {
        console.log(
          `currentIndex: ${currentIndex}, capsuleCount: ${capsuleCount}, total moments length: ${capsuleList?.length || "0"}`
        );

        closeModal();
      }
    }
  }, [currentIndex, capsuleList]);

  return (
    <SafeView style={{flex: 1}}>
    <LinearGradient
      colors={[themeAheadOfLoading.darkColor, themeAheadOfLoading.lightColor]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{    flex: 1,
    width: "100%",
    justifyContent: "space-between"}}
    >
      <HeaderMoment writeView={false} />
      <ContentMomentView
        onSliderPull={handleDelete}
        momentCategory={
          capsuleList[currentIndex]
            ? capsuleList[currentIndex].typedCategory
            : "No category"
        }
        momentText={
          capsuleList[currentIndex]
            ? capsuleList[currentIndex].capsule
            : "No moment"
        }
        momentData={momentInView || null}
      />
      {momentInView && (
        <>
          {momentInView.typedCategory && (
    
              <NavigationArrows
                currentIndex={currentIndex}
                imageListLength={capsuleList.length}
                onPrevPress={goToPreviousMoment}
                onNextPress={goToNextMoment}
              /> 
          )}
        </>
      )}
    </LinearGradient>
    
      
    </SafeView>
  );
};
 
export default ScreenMomentView;
