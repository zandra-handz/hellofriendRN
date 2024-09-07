import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

const TogglerActionButton = ({ 
    showSecondButton, 
    handleNext, 
    navigateToFirstPage, 
    handleFullScreen, 
    navigateToLocationScreen,
    height=90,
    borderRadius=20,
    justifyContent='center',
    marginLeft=16,
    backgroundColor='lightgray', 
    topIconSize=30,
    bottomIconSize=30,
    iconColor='black',
    highlightIconColor='red',
    oneButtonOnly=false,
    useBottomButtonOnly=false, // New prop to control bottom button only
    firstPageTopSvg: FirstPageTopSvg, 
    firstPageBottomSvg: FirstPageBottomSvg, 
    secondPageTopSvg: SecondPageTopSvg, 
    secondPageBottomSvg: SecondPageBottomSvg
}) => {
  const negativeMarginLeft = -marginLeft;

  return (
    <View style={[styles.arrowContainer, { justifyContent: justifyContent, marginLeft: negativeMarginLeft, backgroundColor: backgroundColor, borderTopRightRadius: borderRadius, borderBottomRightRadius: borderRadius, height: height }]}>
      {!showSecondButton ? (
        <>
          {!useBottomButtonOnly && (
            <TouchableOpacity onPress={navigateToLocationScreen} style={styles.arrowButton}>
              <View style={[styles.svgContainer, {marginLeft: marginLeft}]}>
                {FirstPageTopSvg && <FirstPageTopSvg width={topIconSize} height={topIconSize} color={iconColor} style={styles.SvgFSImage} />}
              </View>
            </TouchableOpacity>
          )}
          {!oneButtonOnly && (
            <TouchableOpacity onPress={handleNext} style={styles.arrowButton}>
              <View style={styles.svgContainer}>
                {FirstPageBottomSvg && <FirstPageBottomSvg width={bottomIconSize} height={bottomIconSize} color={iconColor} style={styles.SvgImage} />}
              </View>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <>
          {!useBottomButtonOnly && (
            <TouchableOpacity onPress={handleFullScreen} style={styles.arrowButton}>
              <View style={[styles.svgContainer, {marginLeft: marginLeft}]}>
                {SecondPageTopSvg && <SecondPageTopSvg width={topIconSize} height={topIconSize} color={iconColor} style={styles.SvgFSImage} />}
              </View>
            </TouchableOpacity>
          )}
          {!oneButtonOnly && (
            <TouchableOpacity onPress={navigateToFirstPage} style={styles.arrowButton}>
              <View style={[styles.svgContainer, {marginLeft: marginLeft}]}>
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
    width: 74,
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
    marginLeft: 16,
    padding: 3,
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
