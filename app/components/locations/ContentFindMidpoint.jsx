import React, { useEffect, useRef, useState } from "react";
import { View, Button, StyleSheet } from "react-native";
import ResultsMidpointFinds from "./ResultsMidpointFinds";

import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import AddressSelectorFriend from "../selectors/AddressSelectorFriend";
import AddressSelectorUser from "../selectors/AddressSelectorUser";

import PickerSimpleButtonsBase from "../selectors/PickerSimpleButtonsBase";
import InputMidpointKeyword from "./InputMidpointKeyword";
import ButtonBaseSpecialSave from "../buttons/scaffolding/ButtonBaseSpecialSave";
import { LinearGradient } from 'expo-linear-gradient';
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useFriendList } from '@/src/context/FriendListContext'; 

import BodyStyling from "../scaffolding/BodyStyling"; 

const ContentFindMidpoint = () => {
  const { selectedFriend } = useSelectedFriend();
    const { themeAheadOfLoading } = useFriendList(); 
  const { themeStyles } = useGlobalStyle();
  const [selectedUserAddress, setSelectedUserAddress] = useState(null);
  const [selectedFriendAddress, setSelectedFriendAddress] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [radius, setRadius] = useState("5000");
  const [length, setLength] = useState("4");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [triggerFetch, setTriggerFetch] = useState(false);

  const [friendAddressIsSelected, setFriendAddressIsSelected] = useState(false);
  const [userAddressIsSelected, setUserAddressIsSelected] = useState(false);

  const selectedUserAddressRef = useRef(null);
  const selectedFriendAddressRef = useRef(null);

  const detectFriendAddress = (address) => { 
    if (address) {
      setFriendAddressIsSelected(true);
    } else {
      setFriendAddressIsSelected(false);
    }
  };
 

  const detectUserAddress = (address) => { 
    if (address) {
      setUserAddressIsSelected(true);
    } else { 
      setUserAddressIsSelected(false);
    }
  };

  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleFriendAddressSelect = (address) => {
    console.log("friend address selected");
    detectFriendAddress(address);

    //setSelectedFriendAddress(address);  this causes component to rerender every time
    selectedFriendAddressRef.current = address;
  };

  const handleUserAddressSelect = (address) => {
    console.log("user address selected");
    detectUserAddress(address);

    //setSelectedUserAddress(address); this causes component to rerender every time
    selectedUserAddressRef.current = address;
  };

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
              style={[styles.container, {flex: 1}]} 
            >  
            <       View style={{width: '100%', flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}> 
              
        <View style={[styles.selectFriendContainer, {marginBottom: '2%'}]}>  
        </View> 

                     <BodyStyling 
                     minHeight={'100%'}
                     paddingTop={'4%'}
                     children={
                      <>
                      
      {showResults ? (
        <ResultsMidpointFinds
          userAddress={
            selectedUserAddress || {
              address: "User Address",
              lat: "0",
              lng: "0",
            }
          }
          friendAddress={
            selectedFriendAddress || {
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
          <View
            style={{
              flexDirection: "column",
              maxHeight: 120,
              height: "30%",
              justifyContent: "center",
              marginVertical: "4%",
              width: "100%",
            }}
          >
            <View style={{ marginBottom: "1%" }}>
              <AddressSelectorUser
                setAddressInParent={handleUserAddressSelect}
                tellParentIfExistsOnMount={detectUserAddress}
                currentLocation={null} //feature not available at this time
                height={"auto"}
                titleBottomMargin={"2%"}
                contextTitle={`My startpoint`}
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: "column",
              maxHeight: 120,
              height: "30%",
              justifyContent: "center",
              marginVertical: "4%",
              width: "100%",
            }}
          >
            <View style={{ marginBottom: "1%" }}>
              <AddressSelectorFriend
                selectedFriendId={selectedFriend.id || null}
                setAddressInParent={handleFriendAddressSelect}
                tellParentIfExistsOnMount={detectFriendAddress}
                currentLocation={null} //feature not available at this time
                height={"auto"}
                titleBottomMargin={"2%"}
                contextTitle={`${selectedFriend.name}'s startpoint`}
              />
            </View>
          </View>
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
              isDisabled={( !userAddressIsSelected || !friendAddressIsSelected || !searchKeyword)}
              fontFamily={"Poppins-Bold"}
              image={require("@/app/assets/shapes/redheadcoffee.png")}
            /> 
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    width: '100%',
    justifyContent: 'space-between',
  },
  mainContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  selectFriendContainer: {   
    width: '100%',   
    justifyContent: 'center',
    minHeight: 30, 
    maxHeight: 30,
    height: 30,
  }, 
  paddingExludingSaveButton: {
    paddingHorizontal: '3%',

  },
});

export default ContentFindMidpoint;
