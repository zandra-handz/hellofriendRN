import React from "react";
import { View } from "react-native";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";

import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import LoadingPage from "@/app/components/appwide/spinner/LoadingPage";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

import ReloadList from "@/app/components/helloes/ReloadList"; 
import { useRoute } from "@react-navigation/native";

const eeScreenReload = () => {
  const route = useRoute();

  const items = route.params?.items ?? false;
  console.log(`items in screen reload`, items);
  const { selectedFriend, loadingNewFriend } = useSelectedFriend();

  const { themeStyles } = useGlobalStyle();

  const useDimAppBackground = true;

  return (
    <SafeViewAndGradientBackground
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
        <View style={{ flex: 1 }}>{<ReloadList items={items} />}</View>
      )}
    </SafeViewAndGradientBackground>
  );
};

export default eeScreenReload;
