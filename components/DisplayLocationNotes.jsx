import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { useGlobalStyle } from '../context/GlobalStyleContext';
import ParkingMeterSolidSvg from '../assets/svgs/parking-meter-solid.svg';
import ConversationSvg from '../assets/svgs/conversation.svg';


const DisplayLocationNotes = ({ notes, fontSize = 12, size = 34 }) => {
  
  const { themeStyles } = useGlobalStyle();


  return (
    <View style={styles.container}>
        <View style={styles.iconContainer}>
            <ConversationSvg width={size} height={size} color={themeStyles.genericText.color} />
        </View>
        <View style={styles.textContainer}>
            <Text
                style={[styles.text, themeStyles.genericText, {fontSize: fontSize }]}
                numberOfLines={6}
                ellipsizeMode="tail"
            >
                {notes ? (
                notes
                ) : (
                    // Render something else here if parkingScore is falsy
                    <Text style={[themeStyles.genericText, {fontSize: fontSize, fontFamily: 'Poppins-Regular'}]}>Edit location to add notes!</Text> // Example fallback content
                )}
            </Text>

        </View>
      

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 0,
    width: '100%',
    height: 120,
    borderBottomWidth: .4, 
    borderColor: '#ccc',
  },
  textContainer: {
    flex: 1,
    width: 'auto',

  },
  iconContainer: {  
    paddingRight: 6,
    width: 'auto',

    flexDirection: 'column',
  },
  text: {
    marginLeft: 8,
    fontFamily: 'Poppins-Regular',
    flexShrink: 1, 
  },
});

export default DisplayLocationNotes;
