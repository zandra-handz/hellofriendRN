// ScreenMidpointLocationSearch.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import ResultsMidpointFinds from '../components/ResultsMidpointFinds';
import ButtonLottieAnimationSvg from '../components/ButtonLottieAnimationSvg';
import CompassCuteSvg from '../assets/svgs/compass-cute.svg';
import { useAuthUser } from '../context/AuthUserContext';
import { useLocationList } from '../context/LocationListContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import SelectorAddressBase from '../components/SelectorAddressBase';
import { Picker } from '@react-native-picker/picker';

const ScreenMidpointLocationSearch = () => {
    const { selectedLocation } = useLocationList();
    const { authUserState } = useAuthUser();
    const { friendDashboardData } = useSelectedFriend();
    const [selectedUserAddress, setSelectedUserAddress] = useState(null);
    const [selectedFriendAddress, setSelectedFriendAddress] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [radius, setRadius] = useState('5000');
    const [length, setLength] = useState('4');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [triggerFetch, setTriggerFetch] = useState(false);

    useEffect(() => {
        setTriggerFetch(false);
    }, [selectedUserAddress, selectedFriendAddress, searchKeyword, radius, length]);

    const handleCalculate = () => {
        setTriggerFetch(true);
        setShowResults(true);
    };

    const handleBack = () => {
        setShowResults(false);
    };

    return (
        <View style={styles.container}>
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
                    <Text style={styles.inputLabel}>Search radius (meters)</Text>
                    <Picker
                        selectedValue={radius}
                        style={styles.picker}
                        onValueChange={(itemValue) => setRadius(itemValue)}
                    >
                        {[500, 1000, 1500, 2000, 3000, 5000, 10000].map(value => (
                            <Picker.Item key={value} label={`${value}`} value={`${value}`} />
                        ))}
                    </Picker>

                    <Text style={styles.inputLabel}># of search results</Text>
                    <Picker
                        selectedValue={length}
                        style={styles.picker}
                        onValueChange={(itemValue) => setLength(itemValue)}
                    >
                        {[...Array(10)].map((_, index) => (
                            <Picker.Item key={index + 1} label={`${index + 1}`} value={`${index + 1}`} />
                        ))}
                    </Picker>

                    <Text style={styles.inputLabel}>Search Keyword</Text>
                    <TextInput
                        style={styles.textInput}
                        value={searchKeyword}
                        onChangeText={setSearchKeyword}
                    />

                    <SelectorAddressBase
                        addresses={authUserState.user.addresses}
                        onAddressSelect={setSelectedUserAddress}
                        contextTitle="My Address"
                    />

                    {friendDashboardData && Array.isArray(friendDashboardData[0]?.friend_addresses) && (
                        <SelectorAddressBase
                            addresses={friendDashboardData[0].friend_addresses}
                            onAddressSelect={setSelectedFriendAddress}
                            contextTitle="Friend's starting point"
                        />
                    )}

                    <ButtonLottieAnimationSvg
                        onPress={handleCalculate}
                        preLabel=''
                        label={`Find midpoints`}
                        height={54}
                        radius={16}
                        fontMargin={3}
                        animationSource={require("../assets/anims/heartinglobe.json")}
                        rightSideAnimation={false}
                        labelFontSize={22}
                        labelColor="white"
                        animationWidth={234}
                        animationHeight={234}
                        labelContainerMarginHorizontal={4}
                        animationMargin={-64}
                        showGradient={true}
                        showShape={true}
                        shapePosition="right"
                        shapeSource={CompassCuteSvg}
                        shapeWidth={100}
                        shapeHeight={100}
                        shapePositionValue={-14}
                        shapePositionValueVertical={-10}
                        showIcon={false}
                    />
                </View>
            )}
            {showResults && <Button title="Back" onPress={handleBack} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
    },
    mainContainer: {
        flex: 1,
    },
    inputLabel: {
        color: 'black',
        fontFamily: 'Poppins-Bold',
        fontSize: 16,
        marginVertical: 10,
    },
    textInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        fontFamily: 'Poppins-Regular',
        color: 'black',
        paddingHorizontal: 10,
    },
    picker: {
        height: 50,
        width: '100%',
        color: 'black',
    },
});

export default ScreenMidpointLocationSearch;
