 

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity, 
} from "react-native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

import LocationSavingActions from "./LocationSavingActions";
import LocationNotes from "./LocationNotes";
import LocationParking from "./LocationParking";

import LocationTravelTimes from "./LocationTravelTimes";
import DirectionsLink from "./DirectionsLink";

// import useLocationFunctions from "../hooks/useLocationFunctions";
import { useLocations } from '@/src/context/LocationsContext';

import CallNumberLink from "./CallNumberLink";

import LocationHoursOfOperation from "./LocationHoursOfOperation";
import { useQueryClient } from "@tanstack/react-query";

import useLocationDetailFunctions from "@/src/hooks/useLocationDetailFunctions";

import LocationImages from "./LocationImages";
import LocationCustomerReviews from "./LocationCustomerReviews";

//pulling the data from locationList and using the useEffect gets it to update
//must be better way. for some reason the query client is returning undefined from the cache

const LocationDetailsBody = ({
  locationObject,
  appOnlyLocationObject, //is not stored in cache, is calculated via the useLocationHelloesFunctions in the location search screen
  currentDayDrilledTwice,
}) => {
  const { themeStyles } = useGlobalStyle();
  const {
    locationList,
    loadingAdditionalDetails,
    useFetchAdditionalDetails,
    clearAdditionalDetails,
    deleteLocationMutation,
  } = useLocations();
  const [isFetching, setIsFetching] = useState(false);
  const { checkIfOpen, getCurrentDay } = useLocationDetailFunctions();
    const [locationDetails, setLocationDetails] = useState(null);
    
  const {
    data: additionalDetails,
    isLoading,
    isError,
    error,
  } = useFetchAdditionalDetails(locationObject || locationDetails, isFetching);
  const queryClient = useQueryClient();


  const handleRefresh = () => {
    setIsFetching(true);
  };

  useEffect(() => {
    const updateFromCache = () => {
      //console.log('checking cache for location data');

      if (locationList && locationObject) {
        //console.log('location object', locationObject);
        const matchedLocation = locationList.find(
          (loc) => loc.id === locationObject.id
        );
        if (matchedLocation) {
          setLocationDetails(matchedLocation);

          //      console.log('cached data for location found: ', matchedLocation);
        } else {
          setLocationDetails(locationObject); //back up if nothing in cache
          //      console.log('no data found in cache for this location');
        }
      }
    };

    updateFromCache();
  }, [locationObject, locationList, queryClient]);

  useEffect(() => {
    setIsFetching(false);
    //console.log(currentDayDrilledTwice);
    if (locationObject == true) {
      clearAdditionalDetails();
    }
  }, [locationObject]);

  const renderOpenStatus = (data) => {
    let isOpenNow;
    isOpenNow = checkIfOpen(data);

    return (
      <View
        style={[
          {
            marginRight: "2%",
            borderWidth: 2,
            borderColor: isOpenNow
              ? `lightgreen`
              : isOpenNow === false
                ? `red`
                : "transparent",
            backgroundColor:
              themeStyles.genericTextBackgroundShadeTwo.backgroundColor,
       
            width: "auto",
            paddingHorizontal: "3%",
            paddingVertical: "1%",
            borderRadius: 20,
          },
        ]}
      >
        <Text
          style={[
            themeStyles.genericText,
            {
              fontSize: 12,
              fontWeight: "bold",
            },
          ]}
        >
          {isOpenNow ? `Open` : isOpenNow === false ? `Closed` : ""}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {locationDetails && (
        <>
          <View style={[styles.rowContainer]}>
            {additionalDetails && additionalDetails.hours && (
              <>{renderOpenStatus(additionalDetails.hours)}</>
            )}
            <View style={styles.titleContainer}>
              <Text
                style={[
                  themeStyles.genericText,
                  {
                    fontWeight: "bold",
                    fontSize: 16,
                    textTransform: "uppercase",
                  },
                ]}
              >
                {locationDetails.title || "No title found"}
              </Text>
            </View>
          </View>

          <View style={styles.rowContainer}>
            {locationDetails.address && (
              <DirectionsLink
                address={locationDetails.address}
                fontColor={themeStyles.genericText.color}
              />
            )}
          </View>
          {locationDetails && !additionalDetails && (
            <View style={[styles.rowContainer]}>
              <TouchableOpacity
                onPress={handleRefresh}
                style={themeStyles.genericText}
              >
                <Text style={[themeStyles.genericText, { fontWeight: "bold" }]}>
                  GET MORE INFO
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {additionalDetails && (
            <>
              {additionalDetails.phone && (
                <View style={styles.rowContainer}>
                  <CallNumberLink phoneNumber={additionalDetails.phone} />
                </View>
              )}

              {additionalDetails.hours && (
                <View style={[styles.rowContainer, { paddingRight: "20%" }]}>
                  <LocationHoursOfOperation
                    location={locationObject}
                    data={additionalDetails.hours}
                    currentDayDrilledThrice={currentDayDrilledTwice}
                  />
                </View>
              )}
            </>
          )}

          {appOnlyLocationObject && appOnlyLocationObject.helloCount > 0 && (
            <View style={styles.rowContainer}>
              <Text style={[styles.subtitle, themeStyles.genericText]}>
                Helloes here:{" "}
              </Text>
              <Text style={themeStyles.genericText}>
                {appOnlyLocationObject.helloCount}
              </Text>
            </View>
          )}

          {additionalDetails && (
            <>
              <LocationImages photos={additionalDetails.photos} />
              <LocationCustomerReviews reviews={additionalDetails.reviews} />
            </>
          )}

          {locationDetails && (
            <View
              style={[
                themeStyles.genericTextBackground,
                {
                  position: "absolute",
                  paddingHorizontal: "4%",
                  alignItems: "top",
                  flexDirection: "row",
                  bottom: 0,
                  height: 56,
                  //backgroundColor:
                  //themeStyles.genericTextBackgroundShadeTwo.backgroundColor,
                  width: "100%",
                  left: 0,
                  right: 0,
                },
              ]}
            >
              <View style={{ paddingRight: "7%" }}>
                <LocationSavingActions location={locationDetails} />
              </View>
              {locationDetails.id && (
                <View style={{ paddingRight: "7%" }}>
                  <LocationNotes
                    location={locationDetails && locationDetails}
                  />
                </View>
              )}
              {locationDetails.id && (
                <View style={{ paddingRight: "7%" }}>
                  <LocationParking
                    location={locationDetails && locationDetails}
                  />
                </View>
              )}
              <View style={{ paddingRight: "7%" }}>
                <LocationTravelTimes
                  location={locationDetails && locationDetails}
                />
              </View>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingTop: "5%",
  },
  subtitle: {
    fontWeight: "bold",
    fontSize: 15,
  },
  rowContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",

    paddingVertical: "1%",
    paddingHorizontal: "6%",
  },
  titleContainer: {
    width: "100%",
    flex: 1,
    flexShrink: 1,
    marginRight: "2%",
  },
});

export default LocationDetailsBody;
