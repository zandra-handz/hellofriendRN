import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Text, Button, Image } from 'react-native';
import ButtonLottieAnimationSatellitesImages from './ButtonLottieAnimationSatellitesImages';
import { useImageList } from '../context/ImageListContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useNavigation } from '@react-navigation/native';
import PushPinSolidSvg from '../assets/svgs/push-pin-solid.svg';  
import PhotoSolidSvg from '../assets/svgs/photo-solid.svg';
import TogglerActionButton from '../components/TogglerActionButton';

import ScrollOutlineSvg from '../assets/svgs/scroll-outline.svg';
import GridViewOutlineSvg from '../assets/svgs/grid-view-outline.svg';



const ActionFriendPageImages = ({ 
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
  
  const { selectedFriend, friendColorTheme, friendDashboardData } = useSelectedFriend();
  const { imageList, setImageList } = useImageList();
  const [showSecondButton, setShowSecondButton] = useState(false);
  const opacityAnim = new Animated.Value(1);

  const [ lightColor, setLightColor ] = useState(null);
  const [ darkColor, setDarkColor ] = useState(null);
 
 
  const calculatedButtonHeight = headerInside ? buttonHeight + headerHeight : buttonHeight;
  const calculatedBackgroundColor = headerInside ? lightColor : 'transparent';


  useEffect(() => {
    if (friendColorTheme && friendColorTheme.useFriendColorTheme !== false) {
      if(friendColorTheme.invertGradient) {
        setLightColor(friendColorTheme.darkColor || 'gray');
        setDarkColor(friendColorTheme.lightColor || 'white');
      } else {
        setLightColor(friendColorTheme.lightColor || 'white');
        setDarkColor(friendColorTheme.darkColor || 'gray');
      };
    }
    if (friendColorTheme && friendColorTheme.useFriendColorTheme == false) {
      setLightColor('white');
      setDarkColor('gray');
    }
  }, [friendColorTheme]);

  let mainImage = null;
  let satelliteImages = [];
  let satellitesFirstPage = 1;
  let additionalSatelliteCount = null;
  let additionalImages = [];

  let overrideView = true;

  const navigateToImagesScreen = () => {
    navigation.navigate('Images'); 
    if (onPress) onPress(); 
};

  if (imageList.length > 0) { 
    mainImage = imageList[0];
    satelliteImages = imageList.slice(1);
    additionalSatelliteCount = satelliteImages.length - satellitesFirstPage;
    
    if (additionalSatelliteCount > 0) {
      additionalImages = imageList.slice(satellitesFirstPage + 1);
    } else {
      additionalImages = null;
    }
  }

  

  const navigateToFirstPage = () => {
    setShowSecondButton(false);
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };


  const handleNext = () => {
    setShowSecondButton(true);
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
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



        <View style={[styles.containerHeaderInside, { backgroundColor: lightColor, borderTopRightRadius: buttonRadius }]}>
          
          {includeHeader && headerInside && (
            <View style={[styles.headerContainer, { backgroundColor: lightColor, borderTopRightRadius: buttonRadius, height: headerHeight}]}>
                      <Text style={[styles.headerText, { color: headerTextColor, fontFamily: headerFontFamily, fontSize: headerTextSize }]}>
              {headerText}
            </Text>
          </View>
          )}

      

      <Animated.View style={{ opacity: opacityAnim, flex: 1 }}>
        {additionalSatelliteCount > 0 || overrideView ? (
          <ButtonLottieAnimationSatellitesImages
            onPress={() => {}}
            buttonHeight={buttonHeight}
            buttonRadius={buttonRadius}
            headerSvg={<PhotoSolidSvg width={28} height={28} color="white" />}
            
            navigateToFirstPage={() => setShowSecondButton(false)}
            firstItem={mainImage ? mainImage : 'Loading...'}
            allItems={imageList ? imageList : `Can't get all data`}
            additionalText={mainImage ? mainImage.title : 'Loading...'}
            fontMargin={3}
            animationSource={require('../assets/anims/heartinglobe.json')}
            rightSideAnimation={false}
            labelFontSize={16}
            labelColor="white"
            animationWidth={234}
            animationHeight={234}
            showGradient={true}
            lightColor={lightColor}
            darkColor={darkColor}
            labelContainerMarginHorizontal={4}
            animationMargin={-64}
            showShape={false}
            showIcon={false}
            satellites={!showSecondButton}
            satelliteSectionPosition="right"
            satelliteCount={satellitesFirstPage}
            satelliteHellos={satelliteImages}
            satellitesOrientation="horizontal"
            satelliteHeight="100%"
            additionalPages={showSecondButton}
            additionalSatellites={imageList}
            satelliteOnPress={(image) => handlePress(image)} 
          /> 
        ) : (
          <ButtonLottieAnimationSatellitesImages
            onPress={() => {}}
            buttonHeight={buttonHeight}
            buttonRadius={buttonRadius}
            navigateToFirstPage={() => setShowSecondButton(false)}
            firstItem={mainImage ? mainImage : 'Loading...'}
            allItems={imageList ? imageList : `Can't get all data`}
            fontMargin={3}
            animationSource={require('../assets/anims/heartinglobe.json')}
            rightSideAnimation={false}
            labelFontSize={16}
            labelColor="white"
            animationWidth={234}
            animationHeight={234}
            lightColor="black"
            labelContainerMarginHorizontal={4}
            animationMargin={-64}
            showShape={false}
            shapePosition="right"
            shapeSource={require('../assets/shapes/funkycoloredpattern.png')}
            shapeWidth={340}
            shapeHeight={340}
            shapePositionValue={-154}
            showIcon={false}
            satellites={!showSecondButton}
            satelliteSectionPosition="right"
            satelliteCount={satellitesFirstPage}
            satelliteHellos={satelliteImages}
            satellitesOrientation="horizontal"
            satelliteHeight="60%"
            additionalPages={false}
            satelliteOnPress={(image) => handlePress(image)} 
          />
        )}
      </Animated.View>

      </View>
      

      <TogglerActionButton
        showSecondButton={showSecondButton}
        handleNext={handleNext}
        navigateToFirstPage={navigateToFirstPage}
        handleFullScreen={navigateToImagesScreen}
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
        firstPageBottomSvg={ScrollOutlineSvg}
        secondPageTopSvg={GridViewOutlineSvg}
        secondPageBottomSvg={ScrollOutlineSvg}
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

export default ActionFriendPageImages;
