import React, { useCallback } from "react";
import { View } from "react-native";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import MomentsList from "@/app/components/moments/MomentsList";
import GlobalAppHeader from "@/app/components/headers/GlobalAppHeader";
import LeavesTwoFallingOutlineThickerSvg from "@/app/assets/svgs/leaves-two-falling-outline-thicker.svg";
import LeafSingleOutlineThickerSvg from "@/app/assets/svgs/leaf-single-outline-thicker.svg";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useNavigation } from "@react-navigation/native";
import AddOutlineSvg from "@/app/assets/svgs/add-outline.svg";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SpeedDialDelux from "@/app/components/buttons/speeddial/SpeedDialDelux";
import AddMomentButton from "@/app/components/buttons/moments/AddMomentButton";
import { useFriendList } from "@/src/context/FriendListContext";
import GlobalAppHeaderIconVersion from "@/app/components/headers/GlobalAppHeaderIconVersion";
import { MaterialIcons } from "@expo/vector-icons";
import Loading from "@/app/components/appwide/display/Loading";

import usePrefetches from "@/src/hooks/usePrefetches";

const ScreenMoments = () => {
  const { capsuleList } = useCapsuleList();
  const { selectedFriend, loadingNewFriend } = useSelectedFriend();
 
  const { prefetchUserAddresses, prefetchFriendAddresses } = usePrefetches();
 
  const navigation = useNavigation();

  // const renderHeader = useCallback(
  //   () => ( 
  //     <GlobalAppHeaderIconVersion
  //       title={""}
  //       navigateTo={"Moments"}
  //       icon={
  //         <MaterialIcons
  //           // name="tips-and-updates"
  //           name="person-pin"
  //           size={30}
  //           color={themeAheadOfLoading.fontColorSecondary}
  //         />
  //       }
  //       altView={false}
  //       altViewIcon={
  //         <MaterialIcons
  //           // name="tips-and-updates"
  //           name="person-pin"
  //           size={30}
  //           color={themeAheadOfLoading.fontColorSecondary}
  //         />
  //       }
  //     />
  //   ),
  //   [selectedFriend, loadingNewFriend, themeAheadOfLoading]
  // );

  const handleRootPressPrefetch = () => {
 
    prefetchUserAddresses();
    prefetchFriendAddresses();

  };

  return (
    // <SafeViewAndGradientBackground header={renderHeader} style={{ flex: 1 }}>
       <SafeViewAndGradientBackground  style={{ flex: 1 }}>
      <Loading isLoading={loadingNewFriend} />

      {selectedFriend && !loadingNewFriend && (
        <>
          <View style={{ flex: 1 }}>{capsuleList && <MomentsList />}</View>
        </>
      )}
      {selectedFriend && (
        <SpeedDialDelux
          rootIcon={AddOutlineSvg}
          topIcon={AddOutlineSvg}
          rootOnPressPrefetches={handleRootPressPrefetch}
          topOnPress={() => navigation.navigate("LocationNav")} // selectedFriend needed for this screen I believe
          midIcon={<MaterialCommunityIcons name="hand-wave-outline" />}
          midOnPress={() => navigation.navigate("Finalize")}
          deluxButton={<AddMomentButton />}
        />
      )}
    </SafeViewAndGradientBackground>
  );
};

export default ScreenMoments;
