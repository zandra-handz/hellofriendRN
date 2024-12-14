import React, { useEffect, useRef, useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import ResultsMidpointFinds from '../components/ResultsMidpointFinds';

 import { useSelectedFriend } from '../context/SelectedFriendContext';
import AddressSelectorFriend from '../components/AddressSelectorFriend';
import AddressSelectorUser from '../components/AddressSelectorUser';

import PickerSimpleButtonsBase from '../components/PickerSimpleButtonsBase';
import InputMidpointKeyword from '../components/InputMidpointKeyword';
import ButtonBaseSpecialSave from '../components/ButtonBaseSpecialSave';
import { useGlobalStyle } from '../context/GlobalStyleContext';
 
const ContentFindMidpoint = () => { 
    const { selectedFriend } = useSelectedFriend(); 
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

    const handleUserAddressSelect = (address) => { 
        console.log('user address selected');
        setSelectedUserAddress(address); 
    }; 

    const handleFriendAddressSelect = (address) => {
        console.log('friend address selected');
        setSelectedFriendAddress(address);
    
       }

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
                        <AddressSelectorUser
                            setAddressInParent={handleUserAddressSelect}
                            currentLocation={null} //feature not available at this time
                            height={'auto'}
                            titleBottomMargin={'2%'} 
                            contextTitle={`My startpoint`}
                        /> 
                    </View> 

                    <View style={{height: 100}}>
                        <AddressSelectorFriend
                            selectedFriendId={selectedFriend.id || null}
                            setAddressInParent={handleFriendAddressSelect}
                            currentLocation={null} //feature not available at this time
                            height={'auto'}
                            titleBottomMargin={'2%'} 
                            contextTitle={`${selectedFriend.name}'s startpoint`}
                        /> 
                        </View> 

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
