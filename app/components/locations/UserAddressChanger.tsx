import { Alert, View, Text, StyleSheet } from "react-native";
import React, { useEffect, useMemo, useCallback, useState } from "react";

import SelectAddressModal from "./SelectAddressModal";
import useStartingUserAddresses from "@/src/hooks/useStartingUserAddresses";
import useCurrentLocation from "@/src/hooks/useCurrentLocation";
import useCreateUserAddress from "@/src/hooks/useCreateUserAddress";
import useDeleteUserAddress from "@/src/hooks/useDeleteUserAddress";
import useUpdateUserDefaultAddress from "@/src/hooks/useUpdatreUserAddress";

import useUpdateUserAddressCache from "@/src/hooks/useUpdateUserAddressCache";
import GlobalPressable from "../appwide/button/GlobalPressable";
import { findDefaultAddress } from "@/src/hooks/FindDefaultAddress";
import { AppFontStyles } from "@/src/hooks/StaticFonts";
import manualGradientColors  from "@/src/hooks/StaticColors";

type Props = {
  currentLocationSelected: boolean; // ?
  userId: number;
  //   defaultUserAddress: object;
  //   userAddress: object;
  //   selectAddress: () => void;
  primaryColor: string;
  overlayColor: string;
  backgroundColor: string;
};

const UserAddressChanger = ({
  userId,
  primaryColor,
  overlayColor,
  backgroundColor,
}: Props) => {
  const { userAddresses } = useStartingUserAddresses({ userId: userId });
  const { currentLocationDetails } = useCurrentLocation();
  const {
    updateChosenUserAddress,
    // getChosenUserAddress,
    addUserAddressToTemporaryCache,
  } = useUpdateUserAddressCache({ userId: userId });

  const defaultUserAddress = useMemo(() => {
    return findDefaultAddress(userAddresses.saved);
  }, [userAddresses.saved]);

  useEffect(() => {
    if (defaultUserAddress && !userAddresses?.chosen) {
      updateChosenUserAddress(defaultUserAddress);
    }
  }, [defaultUserAddress]);

  const { createUserAddress } = useCreateUserAddress({ userId: userId });
  const { deleteUserAddress } = useDeleteUserAddress({ userId: userId });
  const { updateUserDefaultAddress } = useUpdateUserDefaultAddress({
    userId: userId,
  });

  const chooseAndAddToCache = (address) => {
    console.log("adding to user cache", address);
    addUserAddressToTemporaryCache(address);
    updateChosenUserAddress(address);
  };
  const [modalVisible, setModalVisible] = useState(false);

  const chooseCurrent = () => {
    if (currentLocationDetails) {
      updateChosenUserAddress(currentLocationDetails);
    } else {
      Alert.alert("Current location unknown", "Please set it manually.");
    }
  };

  const unchooseCurrent = () => {};

  return (
    <>
      {modalVisible && (
        <View>
          <SelectAddressModal
            userId={userId}
            friendAddresses={userAddresses.saved}
            isVisible={modalVisible}
            closeModal={() => setModalVisible(false)}
            addressSetter={chooseAndAddToCache}
            primaryColor={primaryColor}
            primaryBackground={backgroundColor}
            welcomeTextStyle={AppFontStyles.welcomeText}
            manualGradientColors={manualGradientColors}
          />
        </View>
      )}
      <View style={styles.container}>
        <Text style={[AppFontStyles.subWelcomeText, { color: primaryColor }]}>
          {userAddresses?.chosen?.address || "No address selected"}
        </Text>

        <View style={styles.tray}>
          {currentLocationDetails && ( //if this causes flickering, remove it, there is already a guard and an alert message in the chooseCurrent function
            <GlobalPressable
              onPress={chooseCurrent}
              style={{
                backgroundColor: "teal",
                flex: 1,
                height: 30,
                width: 40,
              }}
            />
          )}

          <GlobalPressable
            style={{ backgroundColor: "pink", flex: 1, height: 30, width: 40 }}
          />
          <GlobalPressable
            onPress={() => setModalVisible((prev) => !prev)}
            style={{ backgroundColor: "pink", flex: 1, height: 30, width: 40 }}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "auto",
    backgroundColor: "orange",
    borderRadius: 30,
    paddingHorizontal: 30,
    paddingVertical: 20,
    flexWrap: "flex",
  },
  tray: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    backgroundColor: "red",
    height: 40,
    justifyContent: "space-around",
  },
});

export default UserAddressChanger;
