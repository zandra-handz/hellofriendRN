import React, {
  useCallback,
  useState,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { View, Text, StyleSheet } from "react-native";
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
 
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useHelloes } from "@/src/context/HelloesContext";
import { useLDTheme } from "@/src/context/LDThemeContext";
// import useCurrentLocation from "@/src/hooks/useCurrentLocation";
import usePastHelloesLocations from "@/src/hooks/FriendLocationCalls/usePastHelloesLocations";
 
import useAppNavigations from "@/src/hooks/useAppNavigations";
import DescriptionView from "@/app/components/alerts/DescriptionView"; 
interface Props {}

const ScreenLocationSearch: React.FC<Props> = ({}) => {
  // const { currentLocationDetails, currentRegion } = useCurrentLocation();
  const { user } = useUser();  
  const { navigateToLocationEdit } = useAppNavigations();
  const { lightDarkTheme } = useLDTheme();
  const { currentDay } = useLocationDetailFunctions();
  const [quickView, setQuickView] = useState(null);
  const nullQuickView = () => {
    setQuickView(null);
  };

  const [descriptionView, setDescriptionView] = useState(null);
  const nullDescriptionView = () => {
    setDescriptionView(null);
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
 
  const handleNavigateToLocationEdit = (data) => {
    if (data == undefined) {
      return;
    }

    navigateToLocationEdit({ location: data.location, focusOn: data.focusOn });
    nullDescriptionView();
  };

  const handleViewItemDescription = (data) => {
    if (data != undefined) {
      setDescriptionView({
        topBarText: `Location: ${data.title}`,
        view: (
          <View
            style={{
              backgroundColor: lightDarkTheme.primaryBackground,
              flex: 1,
            }}
          >
            <Text style={{ color: lightDarkTheme.primaryText }}>
              {data?.contentData}
            </Text>
          </View>
        ),
        message: `hi hi hi`,
        bottom: 120, // space from bottom of screen
        height: 200,
        update: false,
        onRightPress: () => handleNavigateToLocationEdit(data),
      });
    }
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
                        themeColors={{
              lightColor: selectedFriend.lightColor,
              darkColor: selectedFriend.darkColor,
              fontColor: selectedFriend.fontColor,
              fontColorSecondary: selectedFriend.fontColorSecondary,
            }} 
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

  const handleRenderDescriptionView = useCallback(() => {
    return (
      <>
        {descriptionView && (
          <DescriptionView
            topBarText={descriptionView.topBarText}
            isInsideModal={false}
            message={descriptionView.message}
            view={descriptionView.view}
            onClose={nullDescriptionView}
            onRightPress={descriptionView.onRightPress}
            bottom={descriptionView.bottom}
            height={descriptionView.height}
          />
        )}
      </>
    );
  }, [descriptionView, nullDescriptionView]);

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

  const [highlightedCategory, setHighlightedCategory] = useState(null);
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
      friendColorLight={selectedFriend.lightColor}
      friendColorDark={selectedFriend.darkColor}
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
      {handleRenderDescriptionView()}
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
            combinedLocationsForList={filteredCombinedLocations}
            locationCategories={categories}
            highlightedCategory={highlightedCategory}
            currentDayDrilledOnce={currentDay}
            handleCategoryPress={handleCategoryPress}
            // selectedDay={selectedDay}
            // handleSelectedDay={handleSelectedDay}
            bermudaCoordsDrilledOnce={bermudaCoords}
                        themeColors={{
              lightColor: selectedFriend.lightColor,
              darkColor: selectedFriend.darkColor,
              fontColor: selectedFriend.fontColor,
              fontColorSecondary: selectedFriend.fontColorSecondary,
            }}  
            primaryColor={lightDarkTheme.primaryText}
            overlayColor={lightDarkTheme.overlayBackground}
            darkerOverlay={lightDarkTheme.darkerOverlayBackground}
            primaryBackground={lightDarkTheme.primaryBackground}
            openAddresses={openModal}
            // openItems={handleSetModalData}
            openItems={handleViewItemDescription}
            // closeItems={handleCloseItemModal}
            closeItems={nullDescriptionView}
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
