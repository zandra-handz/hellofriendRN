 
              //  <TextEditBox
              //  ref={editedTextRef}
              //  title={'Edit notes'}
              //  mountingText={notes}
              //  onTextChange={updateNoteEditString}
              //  />

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import TextEditBox from '../components/TextEditBox';
import { useNavigation, useRoute } from '@react-navigation/native'; 
 import LocationSaveBody from '../components/LocationSaveBody';
 import useLocationFunctions from '../hooks/useLocationFunctions';
 
const ScreenLocationSave = () => { 
    const route = useRoute();
    const location = route.params?.location ?? null;  

    const navigation = useNavigation();

    const {themeStyles} = useGlobalStyle(); 
    const { handleCreateLocation, createLocationMutation } = useLocationFunctions();
    

    const editedTextRef = useRef(null);

    //const updateNoteEditString = (text) => {
      //  if (editedTextRef && editedTextRef.current) {
        //    editedTextRef.current.setText(text);
          //  console.log('in parent', editedTextRef.current.getText());
       // }
//    };

 //weekdayTextData is coming from LocationHoursOfOperation component
    
 

useEffect(() => {
    if (createLocationMutation.isSuccess) {
        navigation.goBack();
    };


}, [createLocationMutation]);
 

    return (
        <View style={[styles.container, themeStyles.container]}> 

            <LocationSaveBody title={location.title} address={location.address} />

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

export default ScreenLocationSave;