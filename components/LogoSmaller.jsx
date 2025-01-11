import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

import { useGlobalStyle } from '../context/GlobalStyleContext';

import LizardSvg from '../assets/svgs/lizard.svg';

const LogoSmaller = () => {
  const { themeStyles, manualGradientColors } = useGlobalStyle(); 
 
  const svgSize = 130;
 
//   const svgPositionRight = -10;
//   const svgPositionTop = -10;

  const svgPositionRight = -10;
  const svgPositionTop = -240;

  const titlePadding = '16%';
 
  const fontStyle = {
    //fontWeight: 'bold',
    fontFamily: 'Poppins-Regular',
    fontSize: 27,
    lineHeight: 40,
  };

  //any styling unique to border
  const borderStyle = {
    position: 'absolute',
    opacity: .2,
  };

  return (
    <View style={[styles.container]}>
        

<View style={{position: 'absolute', opacity: .3, right: svgPositionRight,  top: svgPositionTop }}>
           <LizardSvg
              height={400}
              width={400}
              color={themeStyles.genericTextBackground.backgroundColor}
              style={styles.lizardTransform}
            />
            </View>

      <View style={{ }}>
          <LizardSvg
              height={svgSize}
              width={svgSize}
              color={themeStyles.genericTextBackground.backgroundColor}
              style={styles.lizardTransform}
            />
            </View>
      <View style={[styles.titleContainer, {marginTop: '14%'}]}>
      
          <Text style={[fontStyle, styles.title, themeStyles.genericTextBackground.backgroundColor]}>
            Welcome to the hellofriend app!
          </Text> 
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center', 
   
    height: 'auto', 
  }, 
  lizardTransform: { 
    transform: [
      { rotate: "260deg" },
      // Flip horizontally (mirror image)
    ],
    opacity: .98,
  },
  titleContainer: { 
    paddingHorizontal: '10%',
  },
  title: { 
    textAlign: 'center',
    backgroundColor: 'transparent', // Transparent background
    padding: .4, // Adjust padding as needed to fit the text
  }, 
  titleOutlineTopLeft: {
    left: -1,
    top: -1,
  },
  titleOutlineTopRight: {
    right: -1,
    top: -1,
  },
  titleOutlineBottomLeft: {
    left: -1,
    bottom: -1,
  },
  titleOutlineBottomRight: {
    right: -1,
    bottom: -1,
  },
  gradientTextContainer: {
    // Ensure container has the same size as the text
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientText: {
    // Apply necessary styles here if needed
    backgroundColor: 'transparent', // Ensure no background
  },
});

export default LogoSmaller;
