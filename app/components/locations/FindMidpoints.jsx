import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import ResultsMidpointFinds from '../ResultsMidpointFinds';
import ButtonLottieAnimationSvg from '../components/ButtonLottieAnimationSvg';
import CompassCuteSvg from '@/app/assets/svgs/compass-cute.svg';
import { useAuthUser } from '@/src/context/AuthUserContext'; 
import { useSelectedFriend } from '@/src/context/SelectedFriendContext';
import SelectorAddressBase from '../SelectorAddressBase';
import { Picker} from '@react-native-picker/picker';

const FindMidpoints = () => { 
    const { authUserState } = useAuthUser();
    const { friendDashboardData } = useSelectedFriend();
    const [selectedUserAddress, setSelectedUserAddress] = useState(null);
    const [selectedFriendAddress, setSelectedFriendAddress] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [radius, setRadius] = useState('500');
    const [length, setLength] = useState('1');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [triggerFetch, setTriggerFetch] = useState(false);

    useEffect(() => {
        // Reset triggerFetch when addresses or search parameters change
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
                    <Text style={styles.inputLabel}>Radius (meters)</Text>
                    <Picker
                        selectedValue={radius}
                        style={styles.picker}
                        onValueChange={(itemValue) => setRadius(itemValue)}
                    >
                        <Picker.Item label="500" value="500" />
                        <Picker.Item label="1000" value="1000" />
                        <Picker.Item label="1500" value="1500" />
                        <Picker.Item label="2000" value="2000" />
                        <Picker.Item label="3000" value="3000" />
                        <Picker.Item label="5000" value="5000" />
                        <Picker.Item label="10000" value="10000" />
                    </Picker>

                    <Text style={styles.inputLabel}>Length (1-10)</Text>
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
                        animationSource={require("../../assets/anims/heartinglobe.json")}
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
        padding: 10,
        justifyContent: 'center',
    },
    mainContainer: {
        flex: 1,
    },
    inputLabel: {
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        marginVertical: 10,
    },
    textInput: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        fontFamily: 'Poppins-Regular',
        height: 40,
        marginBottom: 10,
    },
    picker: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
    },
});

export default FindMidpoints;
