import React, { useState, useCallback, useEffect } from "react";
import { View, StyleSheet } from "react-native";
 
import manualGradientColors  from "@/src/hooks/StaticColors";

import SearchHelloesModal from "./SearchHelloesModal";
// app components

// app display/templates
import FooterButtonIconVersion from "./FooterButtonIconVersion";
import ButtonData from "../buttons/scaffolding/ButtonData";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import GradientBackground from "../appwide/display/GradientBackground";

const HelloesScreenFooter = ({
  friendId,
  primaryColor,
  overlayColor,
  dividerStyle,
  helloesList,
  flattenHelloes,
  onFilterPress,
  addToModalOpenPress,
  onSearchPress,
  themeAheadOfLoading, 
}) => { 

  const [searchModalVisible, setSearchModalVisible] = useState(false);

  // these are the only dimensions I foresee potentially changing, hence why they are at top here
  const footerHeight = 90;
  const footerPaddingBottom = 20;
  const footerIconSize = 28;

  const [filterOn, setFilterOn] = useState(false);

  const handleOpenSearchModal = () => {
    addToModalOpenPress();
    setSearchModalVisible(true);
  };

  const handleToggleFilterOn = () => {
    if (!filterOn) {
      onFilterPress(true);
      setFilterOn(true);
    } else {
      onFilterPress(false);
      setFilterOn(false);
    }
  };
 

  const RenderSearchButton = useCallback(
    () => (
      <FooterButtonIconVersion
        primaryColor={primaryColor}
        label="Search"
        icon={
          <MaterialCommunityIcons
            name={"database-search"} // might just want to use 'settings' here, not sure what 'settings-suggest' actually means, just looks pretty
            //  name={"app-settings-alt"}
            size={footerIconSize}
            color={primaryColor}
          />
        } 
        onPress={handleOpenSearchModal}
      />
    ),
    [primaryColor]
  );

  const RenderFilterButton = useCallback(
    () => (
      <FooterButtonIconVersion
        label={filterOn ? "reset" : "In-person only"}
        primaryColor={primaryColor}
        icon={
          <MaterialCommunityIcons
            name={"filter"} // might just want to use 'settings' here, not sure what 'settings-suggest' actually means, just looks pretty
 
            size={footerIconSize}
            color={primaryColor}
          />
        }
        onPress={handleToggleFilterOn}
      />
    ),
    [primaryColor, handleToggleFilterOn]
  );

  return (
    <GradientBackground
      useFriendColors={!!friendId}
      startColor={manualGradientColors.lightColor}
      endColor={manualGradientColors.darkColor}
      friendColorDark={themeAheadOfLoading.darkColor}
      friendColorLight={themeAheadOfLoading.lightColor}
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
            backgroundColor: overlayColor,
          },
        ]}
      > 
        <>
          <View style={styles.section}>
            <RenderSearchButton />
          </View>
        </>

        <View style={[styles.divider, dividerStyle]} />
        <>
          <View style={styles.section}>
            <RenderFilterButton />
          </View>
        </>
 
      </View>

      {searchModalVisible && (
        <View>
          <SearchHelloesModal
            isVisible={searchModalVisible}
            closeModal={() => setSearchModalVisible(false)}
            onSearchPress={onSearchPress}
            flattenHelloes={flattenHelloes}
            primaryColor={primaryColor}
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
