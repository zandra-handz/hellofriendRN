import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import ResultsMidpointFinds from '../components/ResultsMidpointFinds';
import ButtonLottieAnimationSvg from '../components/ButtonLottieAnimationSvg';
import CompassCuteSvg from '../assets/svgs/compass-cute.svg';
import { useAuthUser } from '../context/AuthUserContext'; 
import { useSelectedFriend } from '../context/SelectedFriendContext';
import SelectorAddressBase from '../components/SelectorAddressBase';
import PickerSimpleButtonsBase from '../components/PickerSimpleButtonsBase';
import InputMidpointKeyword  from '../components/InputMidpointKeyword';


const ContentFindMidpoint = () => { 
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

                    <InputMidpointKeyword
                        searchKeyword={searchKeyword}
                        setSearchKeyword={setSearchKeyword}
                    />
                  
                    <PickerSimpleButtonsBase
                        name="radius (meters)"
                        selectedOption={radius}
                        options={[500, 1000, 1500, 2000, 3000, 5000, 10000]}
                        onValueChange={(itemValue) => setRadius(itemValue)}
                    /> 
                    <PickerSimpleButtonsBase
                        name="# of search results"
                        selectedOption={length}
                        options={[...Array(10).keys()].map(index => index + 1)}
                        onValueChange={(itemValue) => setLength(itemValue)}
                    />

                    <View style={{height: 100}}>
                    <SelectorAddressBase
                        addresses={authUserState.user.addresses}
                        onAddressSelect={setSelectedUserAddress}
                        currentAddressOption={true}
                        contextTitle="My Address"
                    />
                    </View>

                    {friendDashboardData && Array.isArray(friendDashboardData[0]?.friend_addresses) && (
                        <View style={{height: 100}}>
                        <SelectorAddressBase
                            addresses={friendDashboardData[0].friend_addresses}
                            onAddressSelect={setSelectedFriendAddress}
                            contextTitle="Friend's starting point"
                        />
                        </View>
                    )}

                    <ButtonLottieAnimationSvg
                        onPress={handleCalculate}
                        preLabel=''
                        label={`Find midpoints`}
                        height={54}
                        radius={16}
                        fontMargin={3}  
                        labelFontSize={22}
                        labelColor="white" 
                        labelContainerMarginHorizontal={4} 
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
        backgroundColor: 'transparent', 
    },
    mainContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
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
});

export default ContentFindMidpoint;
