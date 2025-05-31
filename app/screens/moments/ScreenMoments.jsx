import React from "react";
import { View } from "react-native";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import SafeView from "@/app/components/appwide/format/SafeView";
import MomentsList from "@/app/components/moments/MomentsList";
import GlobalAppHeader from "@/app/components/headers/GlobalAppHeader";
import LeavesTwoFallingOutlineThickerSvg from "@/app/assets/svgs/leaves-two-falling-outline-thicker.svg";
import LeafSingleOutlineThickerSvg from "@/app/assets/svgs/leaf-single-outline-thicker.svg";
import GradientBackground from "@/app/components/appwide/display/GradientBackground";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import LoadingPage from "@/app/components/appwide/spinner/LoadingPage";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useNavigation } from "@react-navigation/native";
import AddOutlineSvg from "@/app/assets/svgs/add-outline.svg";
 import { MaterialCommunityIcons } from "@expo/vector-icons";
import SpeedDialDelux from "@/app/components/buttons/speeddial/SpeedDialDelux"; 
import AddMomentButton from "@/app/components/buttons/moments/AddMomentButton";

const ScreenMoments = () => {
  const { capsuleList } = useCapsuleList();
  const { selectedFriend, loadingNewFriend } = useSelectedFriend();
  const { themeStyles } = useGlobalStyle();
  const navigation = useNavigation();

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
          title={""}
          navigateTo={"Moments"}
          icon={LeavesTwoFallingOutlineThickerSvg}
          altView={false}
          altViewIcon={LeafSingleOutlineThickerSvg}
        />
        <View style={{ flex: 1 }}>{capsuleList && <MomentsList />}</View>
        
          </>
        )}
        {selectedFriend && (
          
        <SpeedDialDelux
            rootIcon={AddOutlineSvg}
            topIcon={AddOutlineSvg}
            topOnPress={() => navigation.navigate('LocationSearch')} // selectedFriend needed for this screen I believe
            midIcon={<MaterialCommunityIcons
                      name="hand-wave-outline"/>}
            midOnPress={() =>  navigation.navigate('AddHello')}
           deluxButton={<AddMomentButton/>} 
              />
              
        )}

      </GradientBackground>
    </SafeView>
  );
};

export default ScreenMoments;
