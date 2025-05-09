import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

import { useGlobalStyle } from '@/src/context/GlobalStyleContext';

import LizardSvg from '@/app/assets/svgs/lizard.svg';

const Logo = () => {
  const { themeStyles, manualGradientColors } = useGlobalStyle(); 
 
  const svgSize = 140;
 
  const svgPositionRight = -10;
  const svgPositionTop = -10;

  const titlePadding = '16%';
 
  const fontStyle = {
    //fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
    fontSize: 58,
  };

  //any styling unique to border
  const borderStyle = {
    position: 'absolute',
    opacity: .5,
  };

  return (
    <View style={[styles.container, {paddingRight: titlePadding}]}>

      <View style={{position: 'absolute', right: svgPositionRight,  top: svgPositionTop }}>
          <LizardSvg
              height={svgSize}
              width={svgSize}
              color={themeStyles.genericTextBackground.backgroundColor}
              style={styles.lizardTransform}
            />
            </View>
      <View style={[styles.titleContainer]}>
        <Text style={[fontStyle, borderStyle,   styles.titleOutlineTopLeft, themeStyles.genericText]}>hellofriend</Text>
        <Text style={[fontStyle, borderStyle,   styles.titleOutlineTopRight, themeStyles.genericText]}>hellofriend</Text>
        <Text style={[fontStyle, borderStyle,  styles.titleOutlineBottomLeft, themeStyles.genericText]}>hellofriend</Text>
        <Text style={[fontStyle, borderStyle,  styles.titleOutlineBottomRight, themeStyles.genericText]}>hellofriend</Text>

          <Text style={[fontStyle, styles.title, themeStyles.genericTextBackground.backgroundColor]}>
            hellofriend
          </Text> 
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
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

export default Logo;
