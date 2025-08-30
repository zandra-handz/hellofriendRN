import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet } from "react-native";

import LocationsMapView from "@/app/components/locations/LocationsMapView";
import MapScreenFooter from "@/app/components/headers/MapScreenFooter";
import useLocationHelloFunctions from "@/src/hooks/useLocationHelloFunctions";
import useLocationDetailFunctions from "@/src/hooks/useLocationDetailFunctions";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import { useLocations } from "@/src/context/LocationsContext";
import useFriendLocations from "@/src/hooks/FriendLocationCalls/useFriendLocations";
import { useFriendDash } from "@/src/context/FriendDashContext";
import useStartingFriendAddresses from "@/src/hooks/useStartingFriendAddresses";
import useStartingUserAddresses from "@/src/hooks/useStartingUserAddresses";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useFriendStyle } from "@/src/context/FriendStyleContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useHelloes } from "@/src/context/HelloesContext";
import useMenues from "@/src/hooks/useMenues";
import { useLDTheme } from "@/src/context/LDThemeContext";

import usePastHelloesLocations from "@/src/hooks/FriendLocationCalls/usePastHelloesLocations";

const ScreenLocationSearch = () => {
  const { themeAheadOfLoading } = useFriendStyle();
  const { lightDarkTheme } = useLDTheme();
  const { appFontStyles, manualGradientColors } = useGlobalStyle();
  const { getDefaultAddress, getDefaultUserAddress } = useMenues();

  const { friendDash } = useFriendDash();
  const friendFaveIds = friendDash?.friend_faves?.locations;
  const { locationList } = useLocations();

  const { helloesList } = useHelloes();
  const inPersonHelloes = helloesList?.filter(
    (hello) => hello.type === "in person"
  );

  // console.log(`inhperson helloes`, inPersonHelloes);

  // console.log(`fave data`, friendFaveIds);

  const { faveLocations, nonFaveLocations } = useFriendLocations({
    inPersonHelloes: inPersonHelloes,
    locationList: locationList,
    friendFaveIds: friendFaveIds,
  });
  const { getCurrentDay } = useLocationDetailFunctions();

  const { pastHelloLocations } = usePastHelloesLocations({
    inPersonHelloes: inPersonHelloes,
    locationList: locationList,
    faveLocations: faveLocations,
    nonFaveLocations: nonFaveLocations,
  });

  const { bermudaCoords } = useLocationHelloFunctions();
  const { selectedFriend } = useSelectedFriend();
  const { userAddresses } = useStartingUserAddresses();
  const { friendAddresses } = useStartingFriendAddresses();

  const [userAddress, setUserAddress] = useState({
    address: "Loading",
    id: "",
  });

  const [friendAddress, setFriendAddress] = useState({
    address: "Loading",
    id: "",
  });
  useEffect(() => {
    if (userAddresses && userAddresses.length > 0) {
      const defaultUserAddress = getDefaultUserAddress(userAddresses);
      setUserAddress({
        address: defaultUserAddress?.address ?? "No address selected",
        id: defaultUserAddress?.id ?? "",
      });
    } else {
      setUserAddress({
        address: "No address selected",
        id: "",
      });
    }
  }, [userAddresses]);

  // Update when defaultAddress becomes available
  useEffect(() => {
    if (friendAddresses && friendAddresses.length > 0) {
      const defaultFriendAddress = getDefaultAddress(friendAddresses);
      // console.log(`default friend`, defaultFriendAddress);
      setFriendAddress({
        address: defaultFriendAddress?.address ?? "No address selected",
        id: defaultFriendAddress?.id ?? "",
      });
    } else {
      setFriendAddress({
        address: "No address selected",
        id: "",
      });
    }
  }, [friendAddresses]);

  const renderMapScreenFooter = useCallback(() => {
    return (
      <MapScreenFooter
        friendId={selectedFriend?.id}
        userAddress={userAddress}
        setUserAddress={setUserAddress}
        friendAddress={friendAddress}
        setFriendAddress={setFriendAddress}
        themeAheadOfLoading={themeAheadOfLoading}
        manualGradientColors={manualGradientColors}
        overlayColor={lightDarkTheme.overlayBackground}
        primaryBackground={lightDarkTheme.primaryBackground}
        primaryColor={lightDarkTheme.primaryText}
        welcomeTextStyle={appFontStyles.welcomeText}
        dividerStyle={lightDarkTheme.divider}
      />
    );
  }, [
    selectedFriend,
    userAddress,
    setUserAddress,
    friendAddress,
    setFriendAddress,
  ]);

  return (
    // <GestureHandlerRootView style={{flex: 1}}>
    <SafeViewAndGradientBackground
      startColor={manualGradientColors.lightColor}
      endColor={manualGradientColors.darkColor}
      friendColorLight={themeAheadOfLoading.lightColor}
      friendColorDark={themeAheadOfLoading.darkColor}
      backgroundOverlayColor={lightDarkTheme.primaryBackground}
      friendId={selectedFriend?.id}
      includeBackgroundOverlay={true}
      primaryBackground={true}
      style={{ flex: 1 }}
    >
      {pastHelloLocations && (
        <>
          <View style={styles.mapContainer}>
            <LocationsMapView
              userAddress={userAddress}
              friendAddress={friendAddress}
              pastHelloLocations={pastHelloLocations}
              faveLocations={faveLocations}
              nonFaveLocations={nonFaveLocations}
              currentDayDrilledOnce={getCurrentDay()}
              bermudaCoordsDrilledOnce={bermudaCoords}
              themeAheadOfLoading={themeAheadOfLoading}
              primaryColor={lightDarkTheme.primaryText}
              overlayColor={lightDarkTheme.overlayBackground}
              primaryBackground={lightDarkTheme.primaryBackground}
              welcomeTextStyle={appFontStyles.welcomeText}
              subWelcomeTextStyle={appFontStyles.subWelcomeText}
              manualGradientColors={manualGradientColors}
            />
          </View>
        </>
      )}
      {renderMapScreenFooter()}
    </SafeViewAndGradientBackground>
    // </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1, // This ensures it takes up available space
    justifyContent: "flex-start",
  },
});

export default ScreenLocationSearch;
