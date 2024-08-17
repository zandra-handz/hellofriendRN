
// import MagGlassSimpleSvg from '../assets/svgs/mag-glass-simple.svg';
// import ScrollOutlineSvg from '../assets/svgs/scroll-outline.svg';
// import BookmarkOutlineSvg from '../assets/svgs/bookmark-outline.svg';


// import RightArrowMotionOutlineSvg from '../assets/svgs/right-arrow-motion-outline.svg';
// import RightArrowMotionSolidSvg from '../assets/svgs/right-arrow-motion-solid.svg';
// import LeftArrowMotionOutlineSvg from '../assets/svgs/left-arrow-motion-outline.svg';
// import LeftArrowMotionSolidSvg from '../assets/svgs/left-arrow-motion-solid.svg';

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
    marginLeft=16,
    backgroundColor='lightgray', 
    topIconSize=30,
    bottomIconSize=30,
    iconColor='black',
    highlightIconColor='red',
    firstPageTopSvg: FirstPageTopSvg, 
    firstPageBottomSvg: FirstPageBottomSvg, 
    secondPageTopSvg: SecondPageTopSvg, 
    secondPageBottomSvg: SecondPageBottomSvg
}) => {

  const negativeMarginLeft = -marginLeft;

  return (
    <View style={[styles.arrowContainer, { marginLeft: negativeMarginLeft, backgroundColor: backgroundColor, borderTopRightRadius: borderRadius, borderBottomRightRadius: borderRadius, height: height }]}>
      {!showSecondButton ? (
        <>
          <TouchableOpacity onPress={navigateToLocationScreen} style={styles.arrowButton}>
            <View style={[styles.svgContainer, {marginLeft: marginLeft}]}>
              {FirstPageTopSvg && <FirstPageTopSvg width={topIconSize} height={topIconSize} color={iconColor} style={styles.SvgFSImage} />}
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNext} style={styles.arrowButton}>
            <View style={styles.svgContainer}>
              {FirstPageBottomSvg && <FirstPageBottomSvg width={bottomIconSize} height={bottomIconSize} color={iconColor} style={styles.SvgImage} />}
            </View>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity onPress={handleFullScreen} style={styles.arrowButton}>
            <View style={[styles.svgContainer, {marginLeft: marginLeft}]}>
              {SecondPageTopSvg && <SecondPageTopSvg width={topIconSize} height={topIconSize} color={iconColor} style={styles.SvgFSImage} />}
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={navigateToFirstPage} style={styles.arrowButton}>
            <View style={[styles.svgContainer, {marginLeft: marginLeft}]}>
              {SecondPageBottomSvg && <SecondPageBottomSvg width={bottomIconSize} height={bottomIconSize} color={highlightIconColor} style={styles.SvgImage} />}
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
    width: 74,
    marginRight: 0, 
    backgroundColor: 'black',
    justifyContent: 'flex-end',
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
