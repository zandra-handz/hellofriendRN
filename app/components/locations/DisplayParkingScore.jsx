import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { useGlobalStyle } from '@/src/context/GlobalStyleContext';
import ParkingMeterSolidSvg from '@/app/assets/svgs/parking-meter-solid.svg';

const DisplayParkingScore = ({ parkingScore, fontSize = 16, size = 14 }) => {
  
  const { themeStyles } = useGlobalStyle();


  return (
    <View style={styles.container}>
      <ParkingMeterSolidSvg width={size} height={size} color={themeStyles.genericText.color} />
      <Text
        style={[styles.address, {fontSize: fontSize, color: themeStyles.genericText.color}]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {parkingScore ? (
        parkingScore
        ) : (
            // Render something else here if parkingScore is falsy
            <Text style={[themeStyles.genericText, {fontSize: fontSize, fontFamily: 'Poppins-Regular'}]}>Edit location to add parking score!</Text> // Example fallback content
        )}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: .4,
    borderColor: '#ccc',
    padding: 0,
    width: '100%',
  },
  address: {
    marginLeft: 8,
    fontFamily: 'Poppins-Regular',
    flexShrink: 1, 
  },
});

export default DisplayParkingScore;
