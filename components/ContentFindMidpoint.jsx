import React, { useEffect, useRef, useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import ResultsMidpointFinds from '../components/ResultsMidpointFinds';
import ButtonBottomActionBase from '../components/ButtonBottomActionBase';
import CompassCuteSvg from '../assets/svgs/compass-cute.svg'; 
import SelectorAddressBase from '../components/SelectorAddressBase';
import PickerSimpleButtonsBase from '../components/PickerSimpleButtonsBase';
import InputMidpointKeyword from '../components/InputMidpointKeyword';
import  useStartingAddresses from '../hooks/useStartingAddresses';
import ButtonBaseSpecialSave from '../components/ButtonBaseSpecialSave';
import { useGlobalStyle } from '../context/GlobalStyleContext';

import SlideToAdd from '../components/SlideToAdd'; 
import SlideToDelete from '../components/SlideToDelete'; 

const ContentFindMidpoint = () => {  
    const { userAddresses, friendAddresses, createUserAddress, createFriendAddress, removeUserAddress, removeFriendAddress } = useStartingAddresses();
    const { themeStyles } = useGlobalStyle();
    const [selectedUserAddress, setSelectedUserAddress] = useState(null);
    const [selectedFriendAddress, setSelectedFriendAddress] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [radius, setRadius] = useState('5000');
    const [length, setLength] = useState('4');
    const [searchKeyword, setSearchKeyword] = useState('');
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
        <View style={[styles.container, themeStyles.genericTextBackground]}>
            {showResults ? (
                <ResultsMidpointFinds
                    userAddress={selectedUserAddress || { address: 'User Address', lat: '0', lng: '0' }}
                    friendAddress={selectedFriendAddress || { address: 'Friend Address', lat: '0', lng: '0' }}
                    search={searchKeyword}
                    radius={radius}
                    length={length}
                    triggerFetch={triggerFetch}
                />
            ) : (
                <View style={styles.mainContainer}>
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
                        options={[...Array(10).keys()].map(index => index + 1)}
                        onValueChange={(itemValue) => setLength(itemValue)}
                    />
                    <View style={{height: 100}}>
                        <SelectorAddressBase
                            addresses={userAddresses}
                            onAddressSelect={setSelectedUserAddress}
                            currentAddressOption={true}
                            contextTitle="My Address"
                        />
                    </View>
                    {friendAddresses && (
                        <View style={{height: 100}}>
                            <SelectorAddressBase
                                addresses={friendAddresses}
                                onAddressSelect={setSelectedFriendAddress}
                                contextTitle="Friend's starting point"
                            />
                        </View>
                    )}

                    {searchKeyword && selectedUserAddress && selectedFriendAddress && (
                    
                    <ButtonBaseSpecialSave
                        label="CALCULATE "
                        maxHeight={80}
                        onPress={handleCalculate} 
                        isDisabled={!selectedUserAddress || !selectedFriendAddress}
                        fontFamily={'Poppins-Bold'}
                        image={require("../assets/shapes/redheadcoffee.png")}
                    /> 
                     
                )}
                </View>
            )}
            {showResults && <Button title="Back" onPress={handleBack} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent', 
        paddingHorizontal: '1%',
    },
    mainContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },  
});

export default ContentFindMidpoint;
