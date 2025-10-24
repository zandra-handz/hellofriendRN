import React, { useEffect, useRef, useState } from "react";
import { View, Button, StyleSheet } from "react-native";
import ResultsMidpointFinds from "./ResultsMidpointFinds";

import PickerSimpleButtonsBase from "../selectors/PickerSimpleButtonsBase";
import InputMidpointKeyword from "./InputMidpointKeyword"; 
import EscortBar from "../moments/EscortBar";

 
const ContentFindMidpoint = ({
  userId,
  lightDarkTheme, 
  manualGradientColors,
  subWelcomeTextStyle, 
  userAddress,
  friendAddress,
}) => {
  const [showResults, setShowResults] = useState(false);
  const [radius, setRadius] = useState("5000");
  const [length, setLength] = useState("4");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [triggerFetch, setTriggerFetch] = useState(false);

  const primaryBackground = lightDarkTheme.primaryBackground;
  const primaryColor = lightDarkTheme.primaryText;

  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleCalculate = () => {
    setTriggerFetch(true);
    setShowResults(true);
  };

  const handleBack = () => {
    setShowResults(false);
  };

  return (
    <View style={{ flex: 1 }}>
      {showResults ? (
        <ResultsMidpointFinds
        userId={userId}
          lightDarkTheme={lightDarkTheme}
          userAddress={
            userAddress || {
              address: "User Address",
              lat: "0",
              lng: "0",
            }
          }
          friendAddress={
            friendAddress || {
              address: "Friend Address",
              lat: "0",
              lng: "0",
            }
          }
          search={searchKeyword}
          radius={radius}
          length={length}
          triggerFetch={triggerFetch}
        />
      ) : (
        <View style={styles.mainContainer}>
          <View style={styles.paddingExludingSaveButton}>
            <InputMidpointKeyword
              primaryColor={lightDarkTheme.primaryText} 
              searchKeyword={searchKeyword}
              setSearchKeyword={setSearchKeyword}
              ref={inputRef}
            />
            <PickerSimpleButtonsBase
              primaryColor={lightDarkTheme.primaryText}
              name="radius (meters)"
              isScrollable={true}
              defaultOption={5000}
              selectedOption={radius}
              options={[1000, 1500, 2000, 3000, 5000, 10000]}
              onValueChange={(itemValue) => setRadius(itemValue)}
            />
            <PickerSimpleButtonsBase
              primaryColor={lightDarkTheme.primaryText}
              name="# of search results"
              isScrollable={true}
              defaultOption={4}
              selectedOption={length}
              options={[...Array(10).keys()].map((index) => index + 1)}
              onValueChange={(itemValue) => setLength(itemValue)}
            />
          </View>
        </View>
      )}
      {showResults && <Button title="Back" onPress={handleBack} />}

      {searchKeyword && !showResults && (
        <EscortBar
          manualGradientColors={manualGradientColors}
          subWelcomeTextStyle={subWelcomeTextStyle}
          primaryColor={primaryColor}
          primaryBackground={primaryBackground}
          forwardFlowOn={false}
          label={"Search"}
          onPress={handleCalculate}
        />
      )} 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "space-between",
  },
  mainContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  selectFriendContainer: {
    width: "100%",
    justifyContent: "center",
    minHeight: 30,
    maxHeight: 30,
    height: 30,
  },
  paddingExludingSaveButton: {
    paddingHorizontal: "3%",
  },
});

export default ContentFindMidpoint;
