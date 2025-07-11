import React  from "react";
import { View } from "react-native";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import MomentsList from "@/app/components/moments/MomentsList"; 
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useNavigation } from "@react-navigation/native";
import AddOutlineSvg from "@/app/assets/svgs/add-outline.svg";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SpeedDialDelux from "@/app/components/buttons/speeddial/SpeedDialDelux";
import AddMomentButton from "@/app/components/buttons/moments/AddMomentButton"; 
import Loading from "@/app/components/appwide/display/Loading";
import { useRoute } from "@react-navigation/native";
import usePrefetches from "@/src/hooks/usePrefetches";

const ScreenMoments = () => {
  const route = useRoute();
  const scrollTo = route.params.scrollTo ?? null;
  const { capsuleList } = useCapsuleList();
  const { selectedFriend, loadingNewFriend } = useSelectedFriend();
 
  const { prefetchUserAddresses, prefetchFriendAddresses } = usePrefetches();
 
  const navigation = useNavigation();
    prefetchUserAddresses();
    prefetchFriendAddresses();
 

  const handleRootPressPrefetch = () => {
 
    // prefetchUserAddresses();
    // prefetchFriendAddresses();

  };

  return ( 
       <SafeViewAndGradientBackground  style={{ flex: 1 }}>
      <Loading isLoading={loadingNewFriend} />

      {selectedFriend && !loadingNewFriend && (
        <>
          <View style={{ flex: 1 }}>{capsuleList && <MomentsList scrollTo={scrollTo} />}</View>
        </>
      )}
      {selectedFriend && (
        <SpeedDialDelux
          rootIcon={AddOutlineSvg}
          topIcon={AddOutlineSvg}
          rootOnPressPrefetches={handleRootPressPrefetch}
          topOnPress={() => navigation.navigate("LocationSearch")} // selectedFriend needed for this screen I believe
          midIcon={<MaterialCommunityIcons name="hand-wave-outline" />}
          midOnPress={() => navigation.navigate("Finalize")}
          deluxButton={<AddMomentButton />}
        />
      )}
    </SafeViewAndGradientBackground>
  );
};

export default ScreenMoments;
