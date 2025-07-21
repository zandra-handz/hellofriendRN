import React, { useEffect, useRef, useState } from "react";
import { View, Button, StyleSheet } from "react-native";
import ResultsMidpointFinds from "./ResultsMidpointFinds";
 

import PickerSimpleButtonsBase from "../selectors/PickerSimpleButtonsBase";
import InputMidpointKeyword from "./InputMidpointKeyword";
import ButtonBaseSpecialSave from "../buttons/scaffolding/ButtonBaseSpecialSave";
import { LinearGradient } from "expo-linear-gradient";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useFriendList } from "@/src/context/FriendListContext";

import BodyStyling from "../scaffolding/BodyStyling";

const ContentFindMidpoint = ({ userAddress, friendAddress }) => {
  
  const { themeAheadOfLoading } = useFriendList();
  const { themeStyles } = useGlobalStyle();
  const [showResults, setShowResults] = useState(false);
  const [radius, setRadius] = useState("5000");
  const [length, setLength] = useState("4");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [triggerFetch, setTriggerFetch] = useState(false);

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
    <LinearGradient
      colors={[themeAheadOfLoading.darkColor, themeAheadOfLoading.lightColor]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.container, { flex: 1 }]}
    >
      <View
        style={{
          width: "100%",
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <View
          style={[styles.selectFriendContainer, { marginBottom: "2%" }]}
        ></View>

        <BodyStyling
          minHeight={"100%"}
          paddingTop={"4%"}
          children={
            <>
              {showResults ? (
                <ResultsMidpointFinds
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
                      labelStyle={themeStyles.genericText}
                      searchKeyword={searchKeyword}
                      setSearchKeyword={setSearchKeyword}
                      ref={inputRef}
                    />
                    <PickerSimpleButtonsBase
                      name="radius (meters)"
                      isScrollable={true}
                      defaultOption={5000}
                      selectedOption={radius}
                      options={[1000, 1500, 2000, 3000, 5000, 10000]}
                      onValueChange={(itemValue) => setRadius(itemValue)}
                    />
                    <PickerSimpleButtonsBase
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
            </>
          }
        />
      </View>
      <ButtonBaseSpecialSave
        label="CALCULATE "
        maxHeight={80}
        onPress={handleCalculate}
        isDisabled={!searchKeyword}
        fontFamily={"Poppins-Bold"}
        image={require("@/app/assets/shapes/redheadcoffee.png")}
      />
    </LinearGradient>
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
