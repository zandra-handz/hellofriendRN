 

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import TextEditBox from '../components/TextEditBox';
import FlatListChangeChoice from '../components/FlatListChangeChoice';

import { useNavigation, useRoute } from '@react-navigation/native'; 
 
import useLocationFunctions from '../hooks/useLocationFunctions';
 
import ButtonBaseSpecialSave from '../components/ButtonBaseSpecialSave';



const ScreenLocationEdit = () => { 
    const route = useRoute();
    const location = route.params?.location ?? null; 
    const notes = route.params?.notes?? null;
    const parking = route.params?.parking ?? null;

    const navigation = useNavigation();

    const { handleUpdateLocation, updateLocationMutation } = useLocationFunctions();
    
    const {themeStyles} = useGlobalStyle(); 
    const editedTextRef = useRef(null);



    const parkingScores = [
        'location has free parking lot', 
        'free parking lot nearby', 
        'street parking', 
        'fairly stressful or unreliable street parking',
        'no parking whatsoever',
        'unspecified'];


    const updateNoteEditString = (text) => {
        if (editedTextRef && editedTextRef.current) {
            editedTextRef.current.setText(text);
            console.log('in parent', editedTextRef.current.getText());
        }
    };


    const editedParkingScoreRef = useRef(null);

    const updateParkingScore = (text) => {
        if (editedParkingScoreRef && editedParkingScoreRef.current) {
            editedParkingScoreRef.current.setText(text);
            console.log('in parent', editedParkingScoreRef.current.getText());
        }
    };

 //weekdayTextData is coming from LocationHoursOfOperation component
    
 const handleSubmit = () => {
    handleUpdateLocation(location.id, { personal_experience_info: editedTextRef.current.getText(), parking_score: editedParkingScoreRef.current.getText()});

};

useEffect(() => {
    if (updateLocationMutation.isSuccess) {
        navigation.goBack();
    }; 
}, [updateLocationMutation]);
 

    return (
        <View style={[styles.container, themeStyles.container]}> 
                <TextEditBox
                ref={editedTextRef}
                title={'Edit notes'}
                mountingText={notes}
                onTextChange={updateNoteEditString}
                />

                <FlatListChangeChoice
                    horizontal={true}
                    choicesArray={parkingScores}
                    ref={editedParkingScoreRef}
                    title={'Change parking score'}
                    oldChoice={parking}
                    onChoiceChange={updateParkingScore}
                    

                />

            <ButtonBaseSpecialSave
              label="SAVE CHANGES "
              maxHeight={80}
              onPress={handleSubmit} 
              isDisabled={false}
              fontFamily={'Poppins-Bold'}
              image={require("../assets/shapes/redheadcoffee.png")}
            
            />
        </View> 
           
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,  
        width: '100%',
        justifyContent: 'space-between', 
    }, 
});

export default ScreenLocationEdit;