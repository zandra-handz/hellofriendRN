import React, { useState, useEffect, useMemo, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { useUser } from "@/src/context/UserContext";
import LocationsMapView from "@/app/components/locations/LocationsMapView";
import LocationQuickView from "@/app/components/alerts/LocationQuickView";
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

interface Props {}

const ScreenLocationSearch: React.FC<Props> = ({}) => {
  // const { currentLocationDetails, currentRegion } = useCurrentLocation();
  const { user } = useUser();
  const [itemModalVisible, setItemModalVisible] = useState(false);
  const [modalData, setModalData] = useState({ title: "", data: {} });
  const { themeAheadOfLoading } = useFriendStyle();
  const { lightDarkTheme } = useLDTheme();
  const { currentDay } = useLocationDetailFunctions();
  const [quickView, setQuickView] = useState(null);
  const nullQuickView = () => {
    setQuickView(null);
  };

  const selectedDay = useRef({ index: null, day: "" });

  // not sure if so great
  useEffect(() => {
    if (currentDay?.index !== undefined && currentDay?.day !== undefined) {
      selectedDay.current = {
        index: currentDay.index,
        day: currentDay.day,
      };
    }
  }, [currentDay]);

  const handleSelectedDay = (object) => {
    if (object) {
      if (selectedDay.current) {
        selectedDay.current.day = object.day;
        selectedDay.current.index = object.index;
      }
    }
  };

  const handleSetModalData = (data) => {
    setModalData(data);
    setItemModalVisible(true);
  };

  const handleCloseItemModal = () => {
    setItemModalVisible(false);
  };

  //focusedLocation is in LocationsMapView
  const handleViewLocation = (focusedLocation) => {
    console.log("handledViewLocation pressed!!");
    if (focusedLocation != undefined) {
      setQuickView({
        topBarText: `Location: ${focusedLocation.title}   |   ${focusedLocation.address}`,
        view: (
          <LocationQuickView
            userId={user?.id}
            focusedLocation={focusedLocation}
            primaryColor={lightDarkTheme.primaryText}
            primaryBackground={lightDarkTheme.primaryBackground}
            themeAheadOfLoading={themeAheadOfLoading}
            currentDay={currentDay}
            selectedDay={selectedDay}
            handleSelectedDay={handleSelectedDay}
          />
        ),
        message: `hi hi hi`,
        update: false,
      });
    }
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


  
   const [ highlightedCategory, setHighlightedCategory ] = useState(null);
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

// categories list, reactive to combinedLocations changes
const categories = useMemo(() => {
  return Array.from(
    new Set(
      combinedLocationsObject.combinedLocations
        .map((item) => item.category)
        .filter(Boolean) // remove null/undefined
    )
  );
}, [combinedLocationsObject.combinedLocations]);



const handleCategoryPress = (category) => {
  if (!category) return;

  if (category !== highlightedCategory) {
    setHighlightedCategory(category);
  } else {
    setHighlightedCategory(null);
  }
};


const filteredCombinedLocations = useMemo(() => {
  if (!highlightedCategory) return combinedLocationsObject.combinedLocations;
  return combinedLocationsObject.combinedLocations.filter(
    (item) => item.category === highlightedCategory
  );
}, [highlightedCategory, combinedLocationsObject.combinedLocations]);

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
            faveLocations={combinedLocationsObject?.faveLocations}
            conbinedLocationsObject={combinedLocationsObject}
            // combinedLocationsForList={
            //   combinedLocationsObject?.combinedLocations
            // }
                        combinedLocationsForList={
              filteredCombinedLocations
            }
            locationCategories={categories}
            highlightedCategory={highlightedCategory}
            currentDayDrilledOnce={currentDay}
            handleCategoryPress={handleCategoryPress}
            // selectedDay={selectedDay}
            // handleSelectedDay={handleSelectedDay}
            bermudaCoordsDrilledOnce={bermudaCoords}
            themeAheadOfLoading={themeAheadOfLoading}
            primaryColor={lightDarkTheme.primaryText}
            overlayColor={lightDarkTheme.overlayBackground}
            darkerOverlay={lightDarkTheme.darkerOverlayBackground}
            primaryBackground={lightDarkTheme.primaryBackground}
            openAddresses={openModal}
            openItems={handleSetModalData}
            closeItems={handleCloseItemModal}
            handleViewLocation={handleViewLocation}
            quickView={quickView}
            nullQuickView={nullQuickView}
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
