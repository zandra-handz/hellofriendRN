import React, { useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";

import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useNavigation } from "@react-navigation/native";
import SpeedDialDelux from "@/app/components/buttons/speeddial/SpeedDialDelux";
import AddMomentButton from "@/app/components/buttons/moments/AddMomentButton";
import { useFriendList } from "@/src/context/FriendListContext";
import GlobalAppHeaderIconVersion from "@/app/components/headers/GlobalAppHeaderIconVersion";
import { MaterialCommunityIcons, SimpleLineIcons } from "@expo/vector-icons";
import Loading from "@/app/components/appwide/display/Loading";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
const ScreenLocationNav = () => {
  const { selectedFriend, loadingNewFriend } = useSelectedFriend();
  const { themeStyles, appContainerStyles, appFontStyles } = useGlobalStyle();
  const { themeAheadOfLoading } = useFriendList();

  const navigation = useNavigation();

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
              <TouchableOpacity
                style={[
                  themeStyles.overlayBackgroundColor,
                  {
                    marginVertical: 2,
                    padding: 20,
                    width: "100%",
                    height: "auto",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 10,
                    textAlign: "center",
                    flexWrap: "wrap",
                  },
                ]}
                onPress={() => navigation.navigate("LocationSearch")}
              >
                <Text
                  style={[themeStyles.primaryText, appFontStyles.welcomeText]}
                >
                  Map Search
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  themeStyles.overlayBackgroundColor,
                  {
                    marginVertical: 2,
                    padding: 20,
                    width: "100%",
                    height: "auto",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 10,
                    textAlign: "center",
                    flexWrap: "wrap",
                  },
                ]}
                onPress={() => navigation.navigate("Locations")}
              >
                <Text
                  style={[themeStyles.primaryText, appFontStyles.welcomeText]}
                >
                  Saved Locations
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </SafeViewAndGradientBackground>
  );
};

export default ScreenLocationNav;
