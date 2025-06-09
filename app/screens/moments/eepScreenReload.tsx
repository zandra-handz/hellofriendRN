import React, { useCallback } from "react";
import { View } from "react-native";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import GlobalAppHeader from "@/app/components/headers/GlobalAppHeader";
import LeavesTwoFallingOutlineThickerSvg from "@/app/assets/svgs/leaves-two-falling-outline-thicker.svg";
import LeafSingleOutlineThickerSvg from "@/app/assets/svgs/leaf-single-outline-thicker.svg";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import LoadingPage from "@/app/components/appwide/spinner/LoadingPage";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useNavigation } from "@react-navigation/native";
import PreAddedList from "@/app/components/moments/PreAddedList";
import ReloadList from "@/app/components/helloes/ReloadList";
import { useFriendList } from "@/src/context/FriendListContext";
import { useHelloes } from "@/src/context/HelloesContext";
import { useRoute } from "@react-navigation/native";

const eeScreenReload = () => {
  const route = useRoute();

  const items = route.params?.items ?? false;
  console.log(`items in screen reload`, items);
  const { capsuleList, preAdded } = useCapsuleList();
  const { selectedFriend, loadingNewFriend } = useSelectedFriend();
  const { themeAheadOfLoading } = useFriendList();
  const { themeStyles } = useGlobalStyle();

  const navigation = useNavigation();

  const useDimAppBackground = true;

  const renderHeader = useCallback(
    () => (
      <GlobalAppHeader
        //title={"MOMENTS: "}
        title={""}
        navigateTo={"Reload Moments"}
        icon={LeavesTwoFallingOutlineThickerSvg}
        altView={false}
        altViewIcon={LeafSingleOutlineThickerSvg}
        // transparentBackground={useDimAppBackground}
        transparentBackground={false}
      />
    ),
    [selectedFriend, loadingNewFriend, themeAheadOfLoading]
  );

  return (
    <SafeViewAndGradientBackground
      header={renderHeader}
      includeBackgroundOverlay={useDimAppBackground}
      style={{ flex: 1 }}
    >
      {loadingNewFriend && (
        <View style={{ flex: 1, width: "100%" }}>
          <LoadingPage
            loading={true}
            spinnerSize={30}
            spinnerType={"flow"}
            color={themeStyles.primaryBackground.backgroundColor}
          />
        </View>
      )}
      {selectedFriend && !loadingNewFriend && (
        <View style={{ flex: 1 }}>{ <ReloadList items={items} />}</View>
      )}
    </SafeViewAndGradientBackground>
  );
};

export default eeScreenReload;
