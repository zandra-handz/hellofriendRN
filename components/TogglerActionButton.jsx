import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';

const TogglerActionButton = ({ 
    showSecondButton, 
    handleNext, 
    navigateToFirstPage, 
    handleFullScreen, 
    navigateToLocationScreen,
    transparentBackground=false,
    height=90,
    borderRadius=20,
    justifyContent='center', 
    topIconSize=30,
    bottomIconSize=30, 
    useManualIconColor=false,
    manualIconColor='white',
    highlightIconColor='red',
    oneButtonOnly=false,
    useBottomButtonOnly=false, // New prop to control bottom button only
    firstPageTopSvg: FirstPageTopSvg, 
    firstPageBottomSvg: FirstPageBottomSvg, 
    secondPageTopSvg: SecondPageTopSvg, 
    secondPageBottomSvg: SecondPageBottomSvg
}) => {
  const { themeStyles} = useGlobalStyle();

  const containerStyle = transparentBackground
  ? { backgroundColor: 'transparent' } // If transparent, apply transparent background
  : themeStyles.friendFocusSection; // Otherwise, apply theme style

  const iconStyle = useManualIconColor
  ? { color: manualIconColor } // If transparent, apply transparent background
  : themeStyles.friendFocusSectionIcon; // Otherwise, apply theme style



  return (
    <View style={[
      styles.arrowContainer, 
      { 
        justifyContent: justifyContent, 
        borderTopRightRadius: borderRadius, 
        borderBottomRightRadius: borderRadius, 
        height: height 
      },
      containerStyle
    ]}>
      {!showSecondButton ? (
        <>
          {!useBottomButtonOnly && (
            <TouchableOpacity onPress={navigateToLocationScreen} style={styles.arrowButton}>
              <View style={[styles.svgContainer]}>
                {FirstPageTopSvg && <FirstPageTopSvg width={topIconSize} height={topIconSize} style={[styles.SvgFSImage, iconStyle]} />}
              </View>
            </TouchableOpacity>
          )}
          {!oneButtonOnly && (
            <TouchableOpacity onPress={handleNext} style={styles.arrowButton}>
              <View style={styles.svgContainer}>
                {FirstPageBottomSvg && <FirstPageBottomSvg width={bottomIconSize} height={bottomIconSize}  style={[styles.SvgFSImage, iconStyle]}/>}
              </View>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <>
          {!useBottomButtonOnly && (
            <TouchableOpacity onPress={handleFullScreen} style={styles.arrowButton}>
              <View style={[styles.svgContainer]}>
                {SecondPageTopSvg && <SecondPageTopSvg width={topIconSize} height={topIconSize}  style={[styles.SvgFSImage, iconStyle]} />}
              </View>
            </TouchableOpacity>
          )}
          {!oneButtonOnly && (
            <TouchableOpacity onPress={navigateToFirstPage} style={styles.arrowButton}>
              <View style={[styles.svgContainer]}>
                {SecondPageBottomSvg && <SecondPageBottomSvg width={bottomIconSize} height={bottomIconSize} color={highlightIconColor} style={styles.SvgImage} />}
              </View>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  arrowContainer: {
    flexDirection: 'column', 
    width: 34,
    marginRight: 0, 
    backgroundColor: 'black', 
    alignContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    zIndex: 0,
  },
  arrowButton: {  
  },
  svgContainer: {  
    padding: 3,
    paddingLeft: 10,
    paddingRight: 10,
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
