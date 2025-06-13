import React, { useEffect, useCallback } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useLocations } from "@/src/context/LocationsContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import ContentAddLocation from "@/app/components/locations/ContentAddLocation";
import GlobalAppHeader from "@/app/components/headers/GlobalAppHeader";
import { useFriendList } from "@/src/context/FriendListContext";

const ScreenLocationCreate = () => {
  const route = useRoute();
  const location = route.params?.location ?? null;

  const { selectedFriend, loadingNewFriend } = useSelectedFriend();
  const { themeAheadOfLoading } = useFriendList();

  const navigation = useNavigation();

  const renderHeader = useCallback(
    () => (
      <GlobalAppHeader
        title={"NEW LOCATION"}
        navigateTo={"Locations"}
        icon={null}
        altView={false}
      />
    ),
    [selectedFriend, loadingNewFriend, themeAheadOfLoading]
  );

  const { createLocationMutation } = useLocations();

  useEffect(() => {
    if (createLocationMutation.isSuccess) {
      navigation.goBack();
    }
  }, [createLocationMutation]);

  return (
    <SafeViewAndGradientBackground header={renderHeader} style={{ flex: 1 }}>
      <ContentAddLocation title={location.title} address={location.address} />
    </SafeViewAndGradientBackground>
  );
};

export default ScreenLocationCreate;
