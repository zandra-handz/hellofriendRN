import React, {  useState,   useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { useUser } from "@/src/context/UserContext";
import LocationsMapView from "@/app/components/locations/LocationsMapView";
 
import useLocationHelloFunctions from "@/src/hooks/useLocationHelloFunctions";
import useLocationDetailFunctions from "@/src/hooks/useLocationDetailFunctions";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import { useLocations } from "@/src/context/LocationsContext";
import useFriendLocations from "@/src/hooks/FriendLocationCalls/useFriendLocations";
import { useFriendDash } from "@/src/context/FriendDashContext"; 
import AddressesModal from "@/app/components/headers/AddressesModal";
import CarouselItemModal from "@/app/components/appwide/carouselItemModal";
import { useFriendStyle } from "@/src/context/FriendStyleContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useHelloes } from "@/src/context/HelloesContext";
import { useLDTheme } from "@/src/context/LDThemeContext";
// import useCurrentLocation from "@/src/hooks/useCurrentLocation";
import usePastHelloesLocations from "@/src/hooks/FriendLocationCalls/usePastHelloesLocations";
 
const ScreenLocationSearch = () => {
  // const { currentLocationDetails, currentRegion } = useCurrentLocation();
  const { user } = useUser();
  const [itemModalVisible, setItemModalVisible] = useState(false);
  const [modalData, setModalData] = useState({ title: "", data: {} });
  const { themeAheadOfLoading } = useFriendStyle();
  const { lightDarkTheme } = useLDTheme();

  const handleSetModalData = (data) => {
    setModalData(data);
    setItemModalVisible(true);
  };

  const handleCloseItemModal = () => {
    setItemModalVisible(false);
  };

  const { friendDash } = useFriendDash(); 

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

  const { faveLocations, nonFaveLocations } = useFriendLocations({
    inPersonHelloes: inPersonHelloes,
    locationList: locationList,
    friendFaveIds: friendFaveIds,
  });

  const combinedLocationsObject = {
    faveLocations,
    nonFaveLocations,
    combinedLocations: [...(faveLocations || []), ...(nonFaveLocations || [])],
  };
  const { getCurrentDay } = useLocationDetailFunctions();

  const currentDay = getCurrentDay();

  const { pastHelloLocations } = usePastHelloesLocations({
    inPersonHelloes: inPersonHelloes,
    locationList: locationList,
    faveLocations: faveLocations,
    nonFaveLocations: nonFaveLocations,
  });

  const { bermudaCoords } = useLocationHelloFunctions();

  const [addressesModalVisible, setAddressesModalVisible] = useState(false);

  const openModal = () => {
    setAddressesModalVisible(true);
  };

  const closeModal = () => {
    setAddressesModalVisible(false);
  };

  return (
    <SafeViewAndGradientBackground
      friendColorLight={themeAheadOfLoading.lightColor}
      friendColorDark={themeAheadOfLoading.darkColor}
      backgroundOverlayColor={lightDarkTheme.primaryBackground}
      friendId={selectedFriend?.id}
      backgroundOverlayHeight={"10%"}
      addColorChangeDelay={true}
      forceFullOpacity={true}
      useSolidOverlay={false}
      useOverlayFade={false}
      includeBackgroundOverlay={true}
      backgroundTransparentOverlayColor={lightDarkTheme.primaryBackground}
      backgroundOverlayBottomRadius={0}
      style={{ flex: 1 }}
    >
      <>
        <View style={styles.mapContainer}>
          <LocationsMapView
            userId={user?.id}
            friendId={selectedFriend?.id}
            friendName={selectedFriend?.name}
            pastHelloLocations={pastHelloLocations}
            conbinedLocationsObject={combinedLocationsObject}
            combinedLocationsForList={
              combinedLocationsObject?.combinedLocations
            } 
            currentDayDrilledOnce={currentDay}
            bermudaCoordsDrilledOnce={bermudaCoords}
            themeAheadOfLoading={themeAheadOfLoading}
            primaryColor={lightDarkTheme.primaryText}
            overlayColor={lightDarkTheme.overlayBackground}
            darkerOverlay={lightDarkTheme.darkerOverlayBackground}
            primaryBackground={lightDarkTheme.primaryBackground}
            openAddresses={openModal}
            openItems={handleSetModalData}
            closeItems={handleCloseItemModal}
          />
        </View>

        {addressesModalVisible && (
          <View>
            <AddressesModal
              userId={user?.id}
              friendId={selectedFriend?.id}
              friendName={selectedFriend?.name}
              primaryColor={lightDarkTheme.primaryText}
              primaryBackground={lightDarkTheme.primaryBackground}
              overlayColor={lightDarkTheme.overlayBackground}
              isVisible={addressesModalVisible}
              closeModal={closeModal}
            />
          </View>
        )}

        {itemModalVisible && (
          <View>
            <CarouselItemModal
              // item={data[currentIndex]} not syncing right item, removed it from modal; data solely from the user-facing component
              icon={modalData?.icon}
              title={modalData?.title}
              display={modalData?.contentData}
              isVisible={itemModalVisible}
              closeModal={() => setItemModalVisible(false)}
              onPress={modalData?.onPress}
            />
          </View>
        )}
      </>
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
