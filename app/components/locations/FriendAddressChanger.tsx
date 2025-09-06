import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useMemo, useCallback, useState } from "react";
import OverlayLargeButton from "../appwide/button/OverlayLargeButton";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import SelectFriendAddressModal from "./SelectFriendAddressModal";
import GlobalPressable from "../appwide/button/GlobalPressable";
import useStartingFriendAddresses from "@/src/hooks/useStartingFriendAddresses";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useCreateFriendAddress from "@/src/hooks/useCreateFriendAddress";
import useDeleteFriendAddress from "@/src/hooks/useDeleteFriendAddress";
import useUpdateFriendDefaultAddress from "@/src/hooks/useUpdateFriendDefaultAddress";
import { findDefaultAddress } from "@/src/hooks/FindDefaultAddress";
import { appFontStyles } from "@/src/hooks/StaticFonts";
import { manualGradientColors } from "@/src/hooks/StaticColors";
import useUpdateFriendAddressCache from "@/src/hooks/useUpdateFriendAddressCache";
type Props = {
  userId: number;
  friendId: number;
  friendName: number;
  defaultFriendAddress: EventListenerOrEventListenerObject;
  friendAddress: object;
  selectAddress: () => void;
  primaryColor: string;
  overlayColor: string;
  backgroundColor: string;
};

const FriendAddressChanger = ({
  userId,
  friendId,
  primaryColor,
  overlayColor,
  backgroundColor,
}: Props) => {
  const { friendAddresses } = useStartingFriendAddresses({
    userId: userId,
    friendId: friendId,
  });

  // const queryClient = useQueryClient();
  const {
    updateChosenFriendAddress,
    getChosenFriendAddress,
    addFriendAddressToTemporaryCache,
  } = useUpdateFriendAddressCache({ userId: userId, friendId: friendId });

  
  const defaultFriendAddress = useMemo(() => {
    return findDefaultAddress(friendAddresses.saved);
  }, [friendAddresses.saved]);

  useEffect(() => {
    if (defaultFriendAddress && !friendAddresses?.chosen) {
      updateChosenFriendAddress(defaultFriendAddress);
    }
  }, [defaultFriendAddress]);

  //   const chosenAddress = getChosenAddress();

  //  console.log(chosenAddress);

  const { createFriendAddress } = useCreateFriendAddress({
    userId: userId,
    friendId: friendId,
  });

  const { deleteFriendAddress } = useDeleteFriendAddress({
    userId: userId,
    friendId: friendId,
  });

  const { updateFriendDefaultAddress } = useUpdateFriendDefaultAddress({
    userId: userId,
    friendId: friendId,
  });

  const chooseAndAddToCache = (address) => {
    console.log("adding to cache: ", address);
    addFriendAddressToTemporaryCache(address);
    updateChosenFriendAddress(address);
    console.log(friendAddresses);
    //     queryClient.setQueryData(
    //   ["friendAddresses", userId, friendId, "chosen"],
    //   () => address
    // );
  };

  // useEffect(() => {
  //   console.log(friendAddresses);

  // }, [friendAddresses]);

  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      {modalVisible && (
        <View>
          <SelectFriendAddressModal
            userId={userId}
            friendId={friendId}
            friendAddresses={friendAddresses.saved}
            isVisible={modalVisible}
            closeModal={() => setModalVisible(false)}
            addressSetter={chooseAndAddToCache}
            primaryColor={primaryColor}
            primaryBackground={backgroundColor}
            welcomeTextStyle={appFontStyles.welcomeText}
            manualGradientColors={manualGradientColors}
          />
        </View>
      )}

      <View
        style={[
          styles.container,
          //  {backgroundColor: overlayColor}
        ]}
      >
        <Text style={[appFontStyles.subWelcomeText, { color: primaryColor }]}>
          {friendAddresses?.chosen?.address ||
            defaultFriendAddress?.address ||
            "No address selected"}
        </Text>
        <View style={styles.tray}>
          <GlobalPressable
            style={{ backgroundColor: "pink", flex: 1, height: 30, width: 40 }}
          />
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

export default FriendAddressChanger;
