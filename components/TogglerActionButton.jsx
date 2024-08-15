// ArrowContainer.js
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import ArrowRightCircleOutlineSvg from '../assets/svgs/arrow-right-circle-outline.svg';
import ArrowLeftCircleOutlineSvg from '../assets/svgs/arrow-left-circle-outline.svg';
import ArrowFullScreenOutlineSvg from '../assets/svgs/arrow-full-screen-outline.svg';
import MagGlassSimpleSvg from '../assets/svgs/mag-glass-simple.svg';

const TogglerActionButton = ({ 
    showSecondButton, 
    handleNext, 
    navigateToFirstPage, 
    handleFullScreen, 
    navigateToLocationScreen,
    height=90,
    borderRadius=20,
    marginLeft=16,
    backgroundColor='lightgray', 
    topIconSize=30,
    bottomIconSize=30,
    iconColor='black',

    

}) => {

  const negativeMarginLeft = -marginLeft;

  return (
    <View style={[styles.arrowContainer, { marginLeft: negativeMarginLeft, backgroundColor: backgroundColor, borderTopRightRadius: borderRadius, borderBottomRightRadius: borderRadius, height: height }]}>
      {!showSecondButton ? (
        <>
          <TouchableOpacity onPress={navigateToLocationScreen} style={styles.arrowButton}>
          <View style={[styles.svgContainer, {marginLeft: marginLeft}]}>
              <MagGlassSimpleSvg width={topIconSize} height={topIconSize} color={iconColor} style={styles.SvgFSImage} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNext} style={styles.arrowButton}>
            <View style={styles.svgContainer}>
                <MagGlassSimpleSvg width={bottomIconSize} height={bottomIconSize} color={iconColor} style={styles.SvgImage} />
            </View>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity onPress={handleFullScreen} style={styles.arrowButton}>
          <View style={[styles.svgContainer, {marginLeft: marginLeft}]}>
            <MagGlassSimpleSvg width={topIconSize} height={topIconSize} color={iconColor} style={styles.SvgFSImage} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={navigateToFirstPage} style={styles.arrowButton}>
            <View style={[styles.svgContainer, {marginLeft: marginLeft}]}>
                <MagGlassSimpleSvg width={bottomIconSize} height={bottomIconSize} color={iconColor} style={styles.SvgImage} />
            </View>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  arrowContainer: {
    flexDirection: 'column', 
    width: 64,
    marginRight: 0, 
    backgroundColor: 'black',
    justifyContent: 'space-around',
    alignContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    zIndex: 0,
  },
  arrowButton: {  
  },
  svgContainer: { 
    marginLeft: 16,
    width: '100%',
    alignItems: 'center', 
    overflow: 'hidden',
  },
  SvgImage: { 
    padding: 6, 
  }, 
  SvgFSImage: { 
  },
});

export default TogglerActionButton;
