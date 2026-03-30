 

import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import * as Location from "expo-location";
import Geocoder from "react-native-geocoding";
import { GOOGLE_API_KEY } from "@env";

Geocoder.init(GOOGLE_API_KEY);

interface DeviceLocation {
  deviceAddress: string | null;
  deviceLatitude: number | null;
  deviceLongitude: number | null;
  deviceRegion: string | null;
}

interface DeviceLocationData {
  deviceLocation: DeviceLocation | undefined;
  deviceRegion: any;
  triggerNewPermissionRequest: () => void;
}

const DeviceLocationContext = createContext<DeviceLocationData | undefined>(
  undefined
);

export const useDeviceLocationContext = () => {
  const context = useContext(DeviceLocationContext);
  if (!context) {
    throw new Error(
      "useDeviceLocationContext must be used within a DeviceLocationProvider"
    );
  }
  return context;
};

export const DeviceLocationProvider: React.FC = ({ children }) => {
  const queryClient = useQueryClient();
  const [deviceRegion, setDeviceRegion] = useState(null);
  const [deviceLocation, setDeviceLocation] = useState<
    DeviceLocation | undefined
  >(undefined);

  const [newPermissionRequest, setNewPermissionRequest] = useState<number>(0);

  const MAX_STARTUP_RETRIES = 3;
  const RETRY_DELAY_MS = 2000;
  const generateTemporaryId = () => `temp_${Date.now()}`;

  const updateLocationData = (
    latitude: number,
    longitude: number,
    address: string
  ) => {
    const formattedData = {
      id: generateTemporaryId(),
      address,
      latitude,
      longitude,
      timestamp: new Date().toISOString(),
      title: address,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };

    const regionData = {
      latitude,
      longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };

    setDeviceLocation(formattedData);
    setDeviceRegion(regionData);

    queryClient.setQueryData(["deviceLocation"], formattedData);
  };

  const startWatching = async () => {
    let hasAlerted = false;

    await Location.watchPositionAsync(
      {
        // accuracy: Location.Accuracy.High,
         accuracy: Location.Accuracy.Balanced,
        timeInterval: 5000,
        // distanceInterval: 10,
           distanceInterval: 20,
      },
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await Geocoder.from(latitude, longitude);
          const address =
            response.results[0]?.formatted_address || "Unknown Address";
          updateLocationData(latitude, longitude, address);
        } catch (watchError) {
          if (!hasAlerted) {
            hasAlerted = true;
            Alert.alert(
              "Error fetching address",
              "We couldn't update your location address."
            );
            setTimeout(() => {
              hasAlerted = false;
            }, 60000); // reset after 1 min
          }

          console.warn("Geocode error during watch:", watchError);
        }
      }
    );
  };

  // useEffect(() => {
  //   let retries = 0;
  //   let hasAlerted = false;

  //   const tryGetLocation = async () => {
  //     try {
  //       const { status } = await Location.requestForegroundPermissionsAsync();
  //       if (status !== "granted") {
  //         throw new Error("Permission to access location was denied");
  //       }

  //       const position = await Location.getCurrentPositionAsync({
  //         accuracy: Location.Accuracy.High,
  //       });

  //       const { latitude, longitude } = position.coords;
  //       const response = await Geocoder.from(latitude, longitude);
  //       const address =
  //         response.results[0]?.formatted_address || "Unknown Address";

  //       updateLocationData(latitude, longitude, address);

  //       // Start watching after first success
  //       startWatching();
  //     } catch (err) {
  //       retries++;
  //       if (retries < MAX_STARTUP_RETRIES) {
  //         setTimeout(tryGetLocation, RETRY_DELAY_MS);
  //       } else {
  //         if (!hasAlerted) {
  //           hasAlerted = true;
  //           Alert.alert(
  //             "Error fetching address",
  //             "We couldn't get your address. Location may be unavailable."
  //           );
  //         }
  //         // Start watching anyway so it can recover later
  //         startWatching();
  //       }
  //     }
  //   };

  //   tryGetLocation();
  // }, [queryClient, newPermissionRequest]);


  useEffect(() => {
  let retries = 0;
  let hasAlerted = false;
  let retryTimer: ReturnType<typeof setTimeout> | undefined;

  const tryGetLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Permission to access location was denied");
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = position.coords;
      const response = await Geocoder.from(latitude, longitude);
      const address =
        response.results[0]?.formatted_address || "Unknown Address";

      updateLocationData(latitude, longitude, address);
      startWatching();
    } catch (err) {
      retries++;
      if (retries < MAX_STARTUP_RETRIES) {
        retryTimer = setTimeout(tryGetLocation, RETRY_DELAY_MS);
      } else {
        if (!hasAlerted) {
          hasAlerted = true;
          Alert.alert(
            "Error fetching address",
            "We couldn't get your address. Location may be unavailable."
          );
        }
        startWatching();
      }
    }
  };

  const timer = setTimeout(() => {
    tryGetLocation();
  }, 500);

  return () => {
    clearTimeout(timer);
    if (retryTimer) clearTimeout(retryTimer);
  };
}, [queryClient, newPermissionRequest]);

  const triggerNewPermissionRequest = () => {
    setNewPermissionRequest(Date.now());
  };

  return (
    <DeviceLocationContext.Provider
      value={{
        deviceLocation,
        deviceRegion,
        triggerNewPermissionRequest,
      }}
    >
      {children}
    </DeviceLocationContext.Provider>
  );
};
