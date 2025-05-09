import React from 'react';
import { View,  StyleSheet } from 'react-native';
import DisplayTextAreaBase from '../appwide/display/DisplayTextAreaBase';

const DisplayHelloNotes = ({ notes, borderColor }) => {

    return (
        <View style={styles.notesContainer }>
        <DisplayTextAreaBase
            containerText='Notes'
            displayText={notes} 
            borderColor={borderColor}
        />
        </View>

    );

};

const styles = StyleSheet.create({
 
    notesContainer: {  
      width: '100%',  
      minHeight: 180, 
    },    
  });
  
  export default DisplayHelloNotes;
  