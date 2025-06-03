import React, { useCallback, useState } from "react";
import { View } from "react-native";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import SafeView from "@/app/components/appwide/format/SafeView"; 
import GlobalAppHeader from "@/app/components/headers/GlobalAppHeader";
import LeavesTwoFallingOutlineThickerSvg from "@/app/assets/svgs/leaves-two-falling-outline-thicker.svg";
import LeafSingleOutlineThickerSvg from "@/app/assets/svgs/leaf-single-outline-thicker.svg";
import GradientBackground from "@/app/components/appwide/display/GradientBackground";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import LoadingPage from "@/app/components/appwide/spinner/LoadingPage";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useNavigation } from "@react-navigation/native"; 
import PreAddedList from "@/app/components/moments/PreAddedList";
import FinalizeList from "@/app/components/moments/FinalizeList";
import AddHelloButton from "@/app/components/buttons/helloes/AddHelloButton";
import { useFocusEffect } from "@react-navigation/native";
import { Moment } from "@/src/types/MomentContextTypes";
const ScreenFinalize = () => {
  const {  allCapsulesList, capsuleList, preAdded  } = useCapsuleList();
  
  const { selectedFriend, loadingNewFriend, FriendDashboardData } = useSelectedFriend();
  const { themeStyles } = useGlobalStyle();
  const [ uniqueCategories, setUniqueCategories ] = useState<string[]>([]);
  const navigation = useNavigation();

useFocusEffect(
  useCallback(() => {
    const categories: string[] = [
      ...new Set(
        allCapsulesList.map((moment: Moment) => moment.typedCategory)
      ),
    ];
    setUniqueCategories(categories);
    return () => {
        setUniqueCategories([]);
    };
  }, [allCapsulesList])
);

  return (
    <SafeView style={{ flex: 1 }}>
      <GradientBackground useFriendColors={true}>
        {loadingNewFriend && (
        <View style={{flex: 1, width: '100%'}}>
        <LoadingPage loading={true} spinnerSize={30} spinnerType={'flow'} color={themeStyles.primaryBackground.backgroundColor}/>
  
        
          
        </View>
              
        )}
        {selectedFriend && !loadingNewFriend && (
          <>
        <GlobalAppHeader
          //title={"MOMENTS: "}
          title={"Add to hello for "}
          navigateTo={"Helloes"}
          icon={LeavesTwoFallingOutlineThickerSvg}
          altView={false}
          altViewIcon={LeafSingleOutlineThickerSvg}
        />


        <View style={{ flex: 1 }}>{preAdded && uniqueCategories?.length > 0 && <FinalizeList data={allCapsulesList} preSelected={preAdded} categories={uniqueCategories}/>}</View>
        
          </>
        )}  

      </GradientBackground>
    </SafeView>
  );
};

export default ScreenFinalize;
