import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text  } from 'react-native';

import BaseFriendViewImages from '../components/BaseFriendViewImages';

import PhotoSolidSvg from '../assets/svgs/photo-solid.svg';
import TogglerActionButton from '../components/TogglerActionButton';
import GridViewOutlineSvg from '../assets/svgs/grid-view-outline.svg';

import { useImageList } from '../context/ImageListContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useNavigation } from '@react-navigation/native';


const ComposerFriendImages = ({ 
  onPress, 
  includeHeader=true, 
  headerText='IMAGES',
  headerTextColor='white',
  headerFontFamily='Poppins-Bold',
  headerTextSize=15, 
  headerInside=false,
  buttonHeight=70,
  buttonRadius=20,
  headerHeight=30,
  justifyIconContent='center',
  inactiveIconColor='white',
  topIconSize=30,
  bottomIconSize=30

}) => { 

  const navigation = useNavigation();
  const { imageList } = useImageList(); 
  const { friendColorTheme, calculatedThemeColors } = useSelectedFriend(); 

  const calculatedButtonHeight = headerInside ? buttonHeight + headerHeight : buttonHeight;
  const calculatedBackgroundColor = headerInside ? calculatedThemeColors.lightColor : 'transparent';

  const navigateToImagesScreen = () => {
    navigation.navigate('Images'); 
    if (onPress) onPress(); 
}; 
  
  return (
    <View style={[styles.container, {backgroundColor: calculatedBackgroundColor, borderRadius: buttonRadius }]}>
      <View style={[styles.containerInner, {borderRadius: buttonRadius}]}>
      {includeHeader && !headerInside && (
        <View style={[styles.headerContainer, { height: headerHeight}]}>
          <Text style={[styles.headerText, { color: headerTextColor, fontFamily: headerFontFamily, fontSize: headerTextSize }]}>
            {headerText}
          </Text>
        </View>
      )}
      <View style={styles.containerInnerRow}> 
        <View style={[styles.containerHeaderInside, { backgroundColor: calculatedThemeColors.lightColor, borderTopRightRadius: buttonRadius }]}>
          {includeHeader && headerInside && (
            <View style={[styles.headerContainer, { backgroundColor: calculatedThemeColors.lightColor, borderTopRightRadius: buttonRadius, height: headerHeight}]}>
                      <Text style={[styles.headerText, { color: headerTextColor, fontFamily: headerFontFamily, fontSize: headerTextSize }]}>
              {headerText}
            </Text>
          </View>
          )}

      <View style={{ flex: 1 }}>
          <BaseFriendViewImages 
            buttonHeight={buttonHeight}
            buttonRadius={buttonRadius}
            headerSvg={<PhotoSolidSvg width={28} height={28} color="white" />}
            allItems={imageList ? imageList : `No images`}
            fontMargin={3}  
            showGradient={true}
            lightColor={calculatedThemeColors.lightColor}
            darkColor={calculatedThemeColors.darkColor}  
          /> 
      </View>
      </View>
      
      <TogglerActionButton  
        navigateToLocationScreen={navigateToImagesScreen}
        height={calculatedButtonHeight}
        borderRadius={buttonRadius}
        justifyContent={justifyIconContent}
        marginLeft={16} 
        backgroundColor={friendColorTheme.darkColor}
        topIconSize={topIconSize}
        bottomIconSize={bottomIconSize}
        iconColor={inactiveIconColor}
        highlightIconColor={friendColorTheme.lightColor}
        oneButtonOnly={true}
        firstPageTopSvg={GridViewOutlineSvg} 
      />
    </View> 
  </View>

  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',  
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerInner: {
    flexDirection: 'column',
    width: '100%',  
    backgroundColor: 'transparent',
  },
  containerHeaderInside: { 
    flexDirection: 'column',  
    marginBottom: 20,
    flex: 1,
    zIndex: 1,

    },
 
  containerInnerRow: {
    flexDirection: 'row',
    width: '100%',  
    backgroundColor: 'transparent',
  },
  headerContainer: { 
    textAlign: 'left', 
    justifyContent: 'center',
    paddingLeft: 0,  
  
  },
  headerText: { 
    marginLeft: 10,
  },
});

export default ComposerFriendImages;
