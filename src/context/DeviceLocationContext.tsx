import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import * as Location from "expo-location";
import Geocoder from "react-native-geocoding";
import Constants from "expo-constants"; 

// const API_KEY = Constants.expoConfig?.extra?.GOOGLE_API_KEY;

// Geocoder.init(API_KEY);

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
  const queryClient = useQueryClient(); //for saving location to cache
  const [deviceRegion, setDeviceRegion] = useState(null);
  const [deviceLocation, setDeviceLocation] = useState<
    DeviceLocation | undefined
  >(undefined);


  console.log('DEVICE LOCATION RERENDERED');

  const [newPermissionRequest, setNewPermissionRequest] = useState<number>(0);

  const generateTemporaryId = () => `temp_${Date.now()}`;

  useEffect(() => {
    const watchLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          throw new Error("Permission to access location was denied");
        }

        const watchId = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,

            // SET LATER
            // Below is an exmple: only trigger if user moves 10 meters or 5 seconds have passed
            timeInterval: 5000, // in ms
            distanceInterval: 10, // in meters
          },
          async (position) => {
            const { latitude, longitude } = position.coords;

            try {
              const response = await Geocoder.from(latitude, longitude);

              const address =
                response.results[0]?.formatted_address || "Unknown Address";
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

              queryClient.setQueryData(
                ["deviceLocation"],
                formattedData
              );
            } catch (geocoderError) {
              Alert.alert(
                "Error fetching address for location:",
                `${geocoderError}`
              );
            }
          }
        );

        return () => {
          watchId.remove();
        };
      } catch (error) {
        Alert.alert("Error fetching address for location:", `${error}`);
      }
    };

    watchLocation();
  }, [queryClient, newPermissionRequest]); //, newPermissionRequest]);

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
