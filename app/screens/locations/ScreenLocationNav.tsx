import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import OverlayLargeButton from "@/app/components/appwide/button/OverlayLargeButton";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useNavigation } from "@react-navigation/native"; 
import { useFriendList } from "@/src/context/FriendListContext";
import GlobalAppHeaderIconVersion from "@/app/components/headers/GlobalAppHeaderIconVersion";
import { MaterialCommunityIcons, SimpleLineIcons } from "@expo/vector-icons";
import Loading from "@/app/components/appwide/display/Loading"; 

import ActiveAddresses from "@/app/components/locations/ActiveAddresses";
const ScreenLocationNav = () => {
  const { selectedFriend, loadingNewFriend } = useSelectedFriend(); 
  const { themeAheadOfLoading } = useFriendList();

  const [userAddress, setUserAddress] = useState({
    address: `No address selected`,
    id: "",
  });
  const [friendAddress, setFriendAddress] = useState({
    address: `No address selected`,
    id: "",
  });

  const navigation = useNavigation();

  const handleGoToMapSearch = () => {
    if (!friendAddress?.id || !userAddress?.id) {
      Alert.alert(
        "Warning!",
        `Some features will not be available to you unless both addresses are set.`,
        [
          {
            text: "Go back",
            onPress: () => {},
            style: "cancel",
          },
          {
            text: "Proceed anyway",
            onPress: () =>
              navigation.navigate("LocationSearch", {
                userAddress: userAddress,
                friendAddress: friendAddress,
              }),
          },
        ]
      );
    }
    if (friendAddress?.id && userAddress?.id) {
      navigation.navigate("LocationSearch", {
        userAddress: userAddress,
        friendAddress: friendAddress,
      });
    }
  };

  const renderHeader = useCallback(
    () => (
      <GlobalAppHeaderIconVersion
        title={"Send location to"}
        navigateTo={"Locations"}
        icon={
          <SimpleLineIcons
            // name="tips-and-updates"
            name="directions"
            size={30}
            color={themeAheadOfLoading.fontColorSecondary}
          />
        }
        altView={false}
        altViewIcon={
          <MaterialCommunityIcons
            // name="tips-and-updates"
            name="map-marker-radius-outline"
            size={30}
            color={themeAheadOfLoading.fontColorSecondary}
          />
        }
      />
    ),
    [selectedFriend, loadingNewFriend, themeAheadOfLoading]
  );

  return (
    <SafeViewAndGradientBackground header={renderHeader} style={{ flex: 1 }}>
      <Loading isLoading={loadingNewFriend} />

      {selectedFriend && !loadingNewFriend && (
        <>
          <View
            style={[
              //REMOVE IF USING momentsAdded code
              //appContainerStyles.screenContainer,
              { flexDirection: "column", justifyContent: "center" },
            ]}
          >
            <View
              style={{
                width: "100%",
                height: "auto",
                padding: 10,

                // START of code from momentsAdded to alter height
                top: 100,
                bottom: 200,
                right: 0,
                left: 0,
                height: 300,
                // END
              }}
            >

              {/* <OverlayLargeButton
                label={"Saved Locations"}
                onPress={() => navigation.navigate("Locations")}
              /> */}
              {userAddress && friendAddress && (
                <ActiveAddresses
                  userAddress={userAddress}
                  setUserAddress={setUserAddress}
                  friendAddress={friendAddress}
                  setFriendAddress={setFriendAddress}
                />
              )}
                            <OverlayLargeButton
                label={"Map Search"}
                onPress={handleGoToMapSearch}
              />
            </View>
          </View>
        </>
      )}
    </SafeViewAndGradientBackground>
  );
};

export default ScreenLocationNav;
