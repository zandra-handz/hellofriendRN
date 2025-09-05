import { View, Text, StyleSheet } from "react-native";
import React, { useMemo, useCallback, useState } from "react";

import SelectAddressModal from "./SelectAddressModal";
import useStartingUserAddresses from "@/src/hooks/useStartingUserAddresses";

import useCreateUserAddress from "@/src/hooks/useCreateUserAddress";
import useDeleteUserAddress from "@/src/hooks/useDeleteUserAddress";
import useUpdateUserDefaultAddress from "@/src/hooks/useUpdatreUserAddress";
import OverlayLargeButton from "../appwide/button/OverlayLargeButton";
import GlobalPressable from "../appwide/button/GlobalPressable";
import { findDefaultAddress } from "@/src/hooks/FindDefaultAddress";
import { appFontStyles } from "@/src/hooks/StaticFonts";
import { manualGradientColors } from "@/src/hooks/StaticColors";

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
//   userAddress,
//   selectAddress,
//   defaultUserAddress,
  primaryColor,
  overlayColor,
  backgroundColor,
}: Props) => {

  const { userAddresses } = useStartingUserAddresses({ userId: userId });


      const chosenUserAddress = useMemo(() => {
    return findDefaultAddress(userAddresses);
  }, [userAddresses ]);
 

 
  const { createUserAddress } = useCreateUserAddress({ userId: userId });
  const { deleteUserAddress } = useDeleteUserAddress({ userId: userId });
  const { updateUserDefaultAddress } = useUpdateUserDefaultAddress({
    userId: userId,
  });

  const [modalVisible, setModalVisible] = useState(false);

 

  return (
    <>
      <View style={styles.container}>
    
          
        <Text style={[appFontStyles.subWelcomeText, { color: primaryColor }]}>
          {chosenUserAddress?.address || "No address selected"}
        </Text>
          
         <View style={styles.tray}>
 
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
    flexWrap: 'flex',
  },
    tray: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'red',
    height: 40,
  }
});

export default UserAddressChanger;
