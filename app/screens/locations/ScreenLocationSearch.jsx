import React, { useEffect, useState, useCallback, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { useUser } from "@/src/context/UserContext";
import LocationsMapView from "@/app/components/locations/LocationsMapView";
import MapScreenFooter from "@/app/components/headers/MapScreenFooter";
import useLocationHelloFunctions from "@/src/hooks/useLocationHelloFunctions";
import useLocationDetailFunctions from "@/src/hooks/useLocationDetailFunctions";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import { useLocations } from "@/src/context/LocationsContext";
import useFriendLocations from "@/src/hooks/FriendLocationCalls/useFriendLocations";
import { useFriendDash } from "@/src/context/FriendDashContext";
// import useStartingFriendAddresses from "@/src/hooks/useStartingFriendAddresses";
// import useStartingUserAddresses from "@/src/hooks/useStartingUserAddresses";
import AddressesModal from "@/app/components/headers/AddressesModal";
import manualGradientColors from "@/src/hooks/StaticColors";
import { AppFontStyles } from "@/src/hooks/StaticFonts";
import { useFriendStyle } from "@/src/context/FriendStyleContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useHelloes } from "@/src/context/HelloesContext";

import { useLDTheme } from "@/src/context/LDThemeContext";
import useCurrentLocation from "@/src/hooks/useCurrentLocation";
import usePastHelloesLocations from "@/src/hooks/FriendLocationCalls/usePastHelloesLocations";
import { findDefaultAddress } from "@/src/hooks/FindDefaultAddress";
const ScreenLocationSearch = () => {
  const { currentLocationDetails, currentRegion } = useCurrentLocation();
  const { user } = useUser();
  const { themeAheadOfLoading } = useFriendStyle();
  const { lightDarkTheme } = useLDTheme();

  const { friendDash } = useFriendDash();
  // const friendFaveIds = friendDash?.friend_faves?.locations;

  const friendFaveIds = useMemo(
    () => friendDash?.friend_faves?.locations,
    [friendDash]
  );

  const { locationList } = useLocations();

  const { helloesList } = useHelloes();

  const inPersonHelloes = useMemo(() => {
    return helloesList?.filter((hello) => hello.type === "in person") || [];
  }, [helloesList]);

  const { selectedFriend } = useSelectedFriend();

  // console.log(`inhperson helloes`, inPersonHelloes);

  const [selectCurrentLocation, setSelectCurrentLocation] = useState(true);

  //   const { userAddresses } = useStartingUserAddresses({ userId: user?.id });
  // const { friendAddresses } = useStartingFriendAddresses({
  //   userId: user?.id,
  //   friendId: selectedFriend?.id,
  // });

  //   const [userAddress, setUserAddress] = useState({
  //   address: 'loading',
  //   id:  "",
  // });

  const [friendAddress, setFriendAddress] = useState({
    address: "Loading",
    id: "",
  });

  const handleDeselectCurrent = () => {
    setSelectCurrentLocation(false);
  };

  const handleselectCurrent = () => {
    setSelectCurrentLocation(true);
  };

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

  useEffect(() => {
    if (pastHelloLocations?.length > 0) {
      console.log('yayayyayayayyayayayayuayayyayayayayayayayyayayayayyayayayayyayayayayua')
      console.log(pastHelloLocations[0]);
    }

  }, [pastHelloLocations]);

  const { bermudaCoords } = useLocationHelloFunctions();

  const [addressesModalVisible, setAddressesModalVisible] = useState(false);

  const openModal = () => {
    setAddressesModalVisible(true);
  };

  const closeModal = () => {
    setAddressesModalVisible(false);
  };

  const [userAddress, setUserAddress] = useState(null);

  const renderMapScreenFooter = useCallback(() => {
    return (
      <MapScreenFooter
        userId={user?.id}
        friendId={selectedFriend?.id}
        // friendName={selectedFriend?.name}

        themeAheadOfLoading={themeAheadOfLoading}
        overlayColor={lightDarkTheme.overlayBackground}
        primaryBackground={lightDarkTheme.primaryBackground}
        primaryColor={lightDarkTheme.primaryText}
        welcomeTextStyle={AppFontStyles.welcomeText}
        dividerStyle={lightDarkTheme.divider}
        openAddresses={openModal}
      />
    );
  }, [selectedFriend, userAddress, friendAddress]);

  return (
    // <GestureHandlerRootView style={{flex: 1}}>
    <SafeViewAndGradientBackground
      friendColorLight={themeAheadOfLoading.lightColor}
      friendColorDark={themeAheadOfLoading.darkColor}
            friendColorLight={lightDarkTheme.primaryBackground}
      friendColorDark={lightDarkTheme.primaryBackground}
      backgroundOverlayColor={lightDarkTheme.primaryBackground}
      friendId={selectedFriend?.id}
      // friendId={false}
      backgroundOverlayHeight={"100%"}
      useSolidOverlay={true}
      useOverlayFade={true}
      includeBackgroundOverlay={true}
      backgroundTransparentOverlayColor={lightDarkTheme.primaryBackground}
      backgroundOverlayBottomRadius={0}
      style={{ flex: 1 }}
    >
      {pastHelloLocations && (
        <>
          <View style={styles.mapContainer}>
            <LocationsMapView
              currentLocationDetails={currentLocationDetails}
              currentRegion={currentRegion}
              useCurrentLocation={selectCurrentLocation}
              userId={user?.id}
              friendId={selectedFriend?.id}
              // userAddress={userAddress}
              // friendAddress={friendAddress}
              pastHelloLocations={pastHelloLocations}
              faveLocations={faveLocations}
              nonFaveLocations={nonFaveLocations}
              currentDayDrilledOnce={getCurrentDay()}
              bermudaCoordsDrilledOnce={bermudaCoords}
              themeAheadOfLoading={themeAheadOfLoading}
              primaryColor={lightDarkTheme.primaryText}
              overlayColor={lightDarkTheme.overlayBackground}
              primaryBackground={lightDarkTheme.primaryBackground}
              welcomeTextStyle={AppFontStyles.welcomeText}
              subWelcomeTextStyle={AppFontStyles.subWelcomeText}
              manualGradientColors={manualGradientColors}
            />
          </View>

          {addressesModalVisible && (
            <View>
              <AddressesModal
                currentLocationSelected={selectCurrentLocation}
                handleDeselectCurrent={handleDeselectCurrent}
                handleselectCurrent={handleDeselectCurrent}
                // handleSelectUserAddress={}
                // handleSelectFriendAddress={}
                userId={user?.id}
                friendId={selectedFriend?.id}
                friendName={selectedFriend?.name}
                primaryColor={lightDarkTheme.primaryText}
                primaryBackground={lightDarkTheme.primaryBackground}
                overlayColor={lightDarkTheme.overlayBackground}
                userAddress={userAddress}
                friendAddress={friendAddress}
                isVisible={addressesModalVisible}
                closeModal={closeModal}
              />
            </View>
          )}
        </>
      )}
      {renderMapScreenFooter()}
    </SafeViewAndGradientBackground>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1, // This ensures it takes up available space
    justifyContent: "flex-start",
    
    
  },
});

export default ScreenLocationSearch;
