import React, { useState, useCallback, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

// app state
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useUser } from "@/src/context/UserContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import SearchModal from "./SearchModal";
import SearchHelloesModal from "./SearchHelloesModal";
// app components
import AboutAppModal from "./AboutAppModal";
import UserSettingsModal from "./UserSettingsModal.";
import useFullHelloes from "@/src/hooks/useFullHelloes";

// app display/templates
import FooterButtonIconVersion from "./FooterButtonIconVersion";
import ButtonData from "../buttons/scaffolding/ButtonData";
import { useNavigationState } from "@react-navigation/native";
import SetAddressesModal from "./SetAddressesModal";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import GradientBackground from "../appwide/display/GradientBackground";
import FilterLocationsModal from "./FilterLocationsModal";
import { add } from "date-fns";

const HelloesScreenFooter = ({
  helloesList,
  flattenHelloes,
  onFilterPress,
  addToModalOpenPress,
  onSearchPress,
}) => {
  const navigationState = useNavigationState((state) => state);
  const { onSignOut } = useUser();
  const currentRouteName = navigationState.routes[navigationState.index]?.name;
  const isOnActionPage = currentRouteName === "hellofriend";
  const { themeStyles } = useGlobalStyle();
  const { selectedFriend, deselectFriend } = useSelectedFriend();

  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // these are the only dimensions I foresee potentially changing, hence why they are at top here
  const footerHeight = 90;
  const footerPaddingBottom = 20;
  const footerIconSize = 28;

  useEffect(() => {
    if (flattenHelloes) {
      console.log('flatten helloes in footer!', flattenHelloes);
    }

  }, [flattenHelloes]);
 
 const [ filterOn, setFilterOn ] = useState(false);

const handleOpenSearchModal = () => {
  addToModalOpenPress();
  setSearchModalVisible(true);

}

 const handleToggleFilterOn = () => {
    if (!filterOn) {
        onFilterPress(true);
        setFilterOn(true);
    } else {
        onFilterPress(false);
        setFilterOn(false);
    }

 };
 
 

  //   const RenderDeselectButton = useCallback(
  //     () => (
  //       <FooterButtonIconVersion
  //         confirmationRequired={true}
  //         confirmationTitle={"Just to be sure"}
  //         confirmationMessage={"Deselect friend?"}
  //         // label="Deselect"
  //         label="Home"
  //         icon={
  //           <MaterialCommunityIcons
  //             // name={"keyboard-backspace"}
  //             name={"home-outline"}
  //             size={footerIconSize}
  //             color={themeStyles.footerIcon.color}
  //           />
  //         }
  //         onPress={() => deselectFriend()}
  //       />
  //     ),
  //     [themeStyles]
  //   );

 
   const RenderSearchButton = useCallback(
    () => (
      <FooterButtonIconVersion
        label="Search"
        icon={
          <MaterialCommunityIcons
            name={"database-search"} // might just want to use 'settings' here, not sure what 'settings-suggest' actually means, just looks pretty
            //  name={"app-settings-alt"}
            size={footerIconSize}
            color={themeStyles.footerIcon.color}
          />
        }
        // onPress={() => setSearchModalVisible(true)}
        onPress={handleOpenSearchModal}
      />
    ),
    [themeStyles]
  );

  const RenderFilterButton = useCallback(
    () => (
      <FooterButtonIconVersion
        label={ filterOn? "reset" : "In-person only"}
        icon={
          <MaterialCommunityIcons
            name={"filter"} // might just want to use 'settings' here, not sure what 'settings-suggest' actually means, just looks pretty
            //  name={"app-settings-alt"}
            size={footerIconSize}
            color={themeStyles.footerIcon.color}
          />
        }
        onPress={handleToggleFilterOn}
      />
    ),
    [themeStyles, handleToggleFilterOn]
  );
 
  return (
    <GradientBackground
      useFriendColors={!!selectedFriend}
      additionalStyles={[
        styles.container,
        {
          height: footerHeight,
          paddingBottom: footerPaddingBottom,
          opacity: 0.94,
        },
      ]}
    >
      <View
        style={[
          styles.container,
          {
            height: footerHeight,
            paddingBottom: footerPaddingBottom,
            backgroundColor: themeStyles.overlayBackgroundColor.backgroundColor,
          },
        ]}
      >
        {/* <View style={styles.section}>
          {!selectedFriend ? <RenderSignOutButton /> : <RenderDeselectButton />}
        </View> 

        <View style={[styles.divider, themeStyles.divider]} /> */}
        {/* <>
          <View style={styles.section}>
            <RenderSettingsButton />
          </View>
        </> */}

        {/* <View style={[styles.divider, themeStyles.divider]} /> */}
        <>
          <View style={styles.section}>
            <RenderSearchButton />
          </View>
        </>

        <View style={[styles.divider, themeStyles.divider]} />
        <>
          <View style={styles.section}>
            <RenderFilterButton />
          </View>
        </>

        {/* <View style={[styles.divider, themeStyles.divider]} />
        <>
          <View style={styles.section}>
            <RenderAboutAppButton />
          </View>
        </> */}
      </View>

            {searchModalVisible && (
        <View>
          <SearchHelloesModal
            isVisible={searchModalVisible}
            closeModal={() => setSearchModalVisible(false)}
            onSearchPress={onSearchPress}
            flattenHelloes={flattenHelloes}
          />
        </View>
      )}

 
      {filterModalVisible && (
        <View>
          <FilterLocationsModal
            isVisible={filterModalVisible}
            closeModal={() => setFilterModalVisible(false)}
          />
        </View>
      )}
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    position: "absolute",
    bottom: 0,
    zIndex: 50000,
  },
  section: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    marginVertical: 10,
  },
});

export default HelloesScreenFooter;
