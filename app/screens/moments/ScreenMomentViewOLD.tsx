import React, { useEffect  } from "react";
import { View, StyleSheet } from "react-native";
 
import useUser from "@/src/hooks/useUser";
import { useRoute } from "@react-navigation/native";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import SafeViewFriendHome from "@/app/components/appwide/format/SafeViewFriendHome";
import useFriendDash from "@/src/hooks/useFriendDash";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import CarouselSliderMoments from "@/app/components/CarouselSliderMoments";
import MomentViewPage from "@/app/components/moments/MomentViewPage"; 
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";
import usePreAddMoment from "@/src/hooks/CapsuleCalls/usePreAddMoment";
import { useLDTheme } from "@/src/context/LDThemeContext";
import AnimatedBackdrop from "@/app/components/appwide/format/AnimatedBackdrop";
import { useSharedValue } from "react-native-reanimated";
import EmptyFooter from "@/app/components/headers/EmptyFooter";
import GradientBackgroundBreathing from "@/app/fidgets/GradientBackgroundBreathing";
import SvgIcon from "@/app/styles/SvgIcons";
import SafeViewMomentView from "@/app/components/appwide/format/SafeViewMomentView";
const ScreenMomentView = () => {
  const route = useRoute();
  const currentIndex = route.params?.index ?? null;
  const startWithBackdropTimestamp = route.params?.startWithBackdropTimestamp ?? null;
  const startWithBackdropValue = useSharedValue(!!startWithBackdropTimestamp);

  useEffect(() => {
    if (startWithBackdropTimestamp) {
      startWithBackdropValue.value = false;
    }
  }, [startWithBackdropTimestamp]);

  const { user } = useUser();
  const { selectedFriend } = useSelectedFriend(); 
  const { lightDarkTheme } = useLDTheme();
  const { capsuleList } = useCapsuleList(); 

  const { handlePreAddMoment, preAddMomentMutation } = usePreAddMoment({
    userId: user?.id,
    friendId: selectedFriend?.id,
  });

  useEffect(() => {
    if (preAddMomentMutation.isError) { 
      showFlashMessage(`Could not add moment`, true, 1000);
    }
  }, [preAddMomentMutation.isError]);

  const { friendDash, loadingDash } = useFriendDash({
    userId: user?.id,
    friendId: selectedFriend?.id,
  });

  const phoneNumber = friendDash?.suggestion_settings?.phone_number || null;

  const saveToHello = ({friendId, capsuleId, isPreAdded}) => {
    showFlashMessage(`Moment added!`, false, 1000);
    handlePreAddMoment({friendId, capsuleId, isPreAdded});
  };

  const TIME_SCORE = 100;

  return (
    <SafeViewMomentView
      friendColorLight={selectedFriend.lightColor}
      friendColorDark={selectedFriend.darkColor}
      backgroundOverlayColor={'transparent'}
      friendId={selectedFriend?.id}
    >
{/* 
             <View style={[StyleSheet.absoluteFillObject, {zIndex: 0}]}>
        <GradientBackgroundBreathing
          secondColorSetDark={selectedFriend.lightColor}
          secondColorSetLight={selectedFriend.darkColor}
          firstColorSetDark={selectedFriend.lightColor}
          firstColorSetLight={selectedFriend.darkColor}
          timeScore={TIME_SCORE}
          speed={3000}
          style={styles.gradientBreathingStyle}
          direction={"vertical"}
        />
      </View>    */}


      <AnimatedBackdrop
        color={lightDarkTheme.backdropColor}
        zIndex={5}
        isVisibleValue={startWithBackdropValue}
      />



     {/* <View style={styles.leafWrapper}>
        <SvgIcon
          name={"leaf"}
          size={1000}
          color={selectedFriend.lightColor}
          style={styles.leaf}
        />
      </View> */}

      {selectedFriend?.id && !loadingDash && capsuleList?.length && (
        <CarouselSliderMoments
          lightDarkTheme={lightDarkTheme}
          userId={user?.id}
          friendId={selectedFriend?.id}
          initialIndex={currentIndex} 
          data={capsuleList}
          handlePreAddMoment={saveToHello}
          children={MomentViewPage}
          friendNumber={phoneNumber}
        />
      )}

      <EmptyFooter backgroundColor={lightDarkTheme.darkerOverlayBackground} />
    </SafeViewMomentView>
  );
};

const styles = StyleSheet.create({
  gradientBreathingStyle: {
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  leafWrapper: {
    position: "absolute",
    top: -170,
    left: -300,
  },
  leaf: {
    flexDirection: "row",
    justifyContent: "flex-start",
   // zIndex: 4000,
    position: "absolute",
    opacity: 0.6,
  },
  innerContainer: { flexDirection: "column" },
  rowContainer: { flexDirection: "row" },
  labelWrapper: {zIndex: 0},
  label: {},
});

export default ScreenMomentView;