import React, { useEffect, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { useUser } from "@/src/context/UserContext";
import { useRoute } from "@react-navigation/native";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
//import { useFriendDash } from "@/src/context/FriendDashContext";
import useFriendDash from "@/src/hooks/useFriendDash";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import CarouselSliderMoments from "@/app/components/CarouselSliderMoments";
import MomentViewPage from "@/app/components/moments/MomentViewPage";
// import { useCategories } from "@/src/context/CategoriesContext";
// import useCategories from "@/src/hooks/useCategories";
// import useMomentSortingFunctions from "@/src/hooks/useMomentSortingFunctions";
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";
import usePreAddMoment from "@/src/hooks/CapsuleCalls/usePreAddMoment";
import { useLDTheme } from "@/src/context/LDThemeContext";
import GradientBackgroundBreathing from "@/app/fidgets/GradientBackgroundBreathing";
import SvgIcon from "@/app/styles/SvgIcons";
// import { generateGradientColorsMap } from "@/src/hooks/GenerateGradientColorsMapUtil";
import { useCategoryColors } from "@/src/context/CategoryColorsContext";

const ScreenMomentView = () => {
  const route = useRoute();
  const currentIndex = route.params?.index ?? null;

  const { user } = useUser();
  const { selectedFriend } = useSelectedFriend();
  // const { userCategories } = useCategories();
  // const [categoryColorsMap, setCategoryColorsMap] = useState<string[]>([]);
  const { lightDarkTheme } = useLDTheme();
  const { capsuleList } = useCapsuleList();
  const { categoryColors, handleSetCategoryColors} = useCategoryColors();

  const { handlePreAddMoment, preAddMomentMutation } = usePreAddMoment({
    userId: user?.id,
    friendId: selectedFriend?.id,
  });

  
  //   useEffect(() => {
  //   if (preAddMomentMutation.isSuccess) {
  //     console.log('use effect~~~~~~~~~~~~!')
  //     showFlashMessage(`Moment added!`, false, 1000);
  //   }
  // }, [preAddMomentMutation.isSuccess]);

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

  
const categoryColorsMap = useMemo(() => {
  if (!categoryColors || !Array.isArray(categoryColors)) {
    // fallback to empty object if data is not ready
    return {};
  }

  return Object.fromEntries(
    categoryColors.map(({ user_category, color }) => [user_category, color])
  );
}, [categoryColors]);

  




  const saveToHello = ({friendId, capsuleId, isPreAdded}) => {
   showFlashMessage(`Moment added!`, false, 1000);
   handlePreAddMoment({friendId, capsuleId, isPreAdded})


  };



  const TIME_SCORE = 100;

  return (
    <SafeViewAndGradientBackground
      friendColorLight={selectedFriend.lightColor}
      friendColorDark={selectedFriend.darkColor}
      backgroundOverlayColor={lightDarkTheme.primaryBackground}
      friendId={selectedFriend?.id}
      style={{ flex: 1 }}
    >
      <View style={StyleSheet.absoluteFillObject}>
        <GradientBackgroundBreathing
          secondColorSetDark={selectedFriend.lightColor}
          secondColorSetLight={selectedFriend.darkColor}
          firstColorSetDark={selectedFriend.lightColor}
          firstColorSetLight={selectedFriend.darkColor}
          timeScore={TIME_SCORE}
          speed={3000}
          style={styles.gradientBreathingStyle}
          direction={"vertical"}
        ></GradientBackgroundBreathing>
      </View>
      <View style={styles.leafWrapper}>
        <SvgIcon
          name={"leaf"}
          size={1000}
          color={selectedFriend.lightColor}
          style={styles.leaf}
        />
      </View>

      {selectedFriend?.id &&
        !loadingDash &&
        capsuleList?.length &&
        categoryColorsMap && (
          <CarouselSliderMoments
            lightDarkTheme={lightDarkTheme}
            userId={user?.id}
            friendId={selectedFriend?.id}
            initialIndex={currentIndex}
            categoryColorsMap={categoryColorsMap}
            data={capsuleList}
            handlePreAddMoment={saveToHello}
            children={MomentViewPage}
            friendNumber={phoneNumber}
          />
        )}
    </SafeViewAndGradientBackground>
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
    zindex: 4000,
    position: "absolute",
    opacity: 0.6,
  },
  innerContainer: { flexDirection: "column" },
  rowContainer: { flexDirection: "row" },
  labelWrapper: {},
  label: {},
});

export default ScreenMomentView;
