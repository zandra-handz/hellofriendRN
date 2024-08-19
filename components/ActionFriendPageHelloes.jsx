import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Text } from 'react-native';
import ButtonLottieAnimationSatellitesHelloes from './ButtonLottieAnimationSatellitesHelloes';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useNavigation } from '@react-navigation/native';

import { fetchPastHelloes } from '../api';

import ActionFriendPageAllHelloes from '../components/ActionFriendPageAllHelloes';
import IconDynamicHelloType from '../components/IconDynamicHelloType';

import TogglerActionButton from '../components/TogglerActionButton';

import ScrollOutlineSvg from '../assets/svgs/scroll-outline.svg';
import GridViewOutlineSvg from '../assets/svgs/grid-view-outline.svg';


const ActionFriendPageHelloes = ({ 
  onPress,
  includeHeader=true, 
  headerText='HELLOES',
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
  
  const { selectedFriend, setFriend, friendDashboardData, friendColorTheme } = useSelectedFriend(); 
  const [helloesList, setHelloesList] = useState([]);
  const [isFSModalVisible, setIsFSModalVisible] = useState(false);
  const [ lightColor, setLightColor ] = useState(null);
  const [ darkColor, setDarkColor ] = useState(null);
  const [ iconBackgroundColor, setIconBackgroundColor ] = useState(null);

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


  useEffect(() => {
    const fetchData = async () => {
        try {
            if (selectedFriend) {
                const helloes = await fetchPastHelloes(selectedFriend.id);
                
                setHelloesList(helloes);  
                console.log("fetchData Helloes List: ", helloes);
            } else { 
                setHelloesList(helloes || []);
            }
        } catch (error) {
            console.error('Error fetching helloes list:', error);
        }
    };

    fetchData();
}, [selectedFriend]);



  const navigateToHelloesScreen = () => {
    navigation.navigate('Helloes'); 
    if (onPress) onPress(); 
  };



  
  let mainHello = null;
  let mainHelloType = null;
  let mainHelloDetails = [];
  let satelliteHelloes = [];
  let satellitesFirstPage = 1;
  let additionalSatelliteCount = null;
  let additionalHelloes = [];

  let overrideView = true;

  if (helloesList.length > 0) {
    mainHello = helloesList[0];
    mainHelloType = helloesList[0].type;
    
    satelliteHelloes = helloesList.slice(1);
    additionalSatelliteCount = satelliteHelloes.length - satellitesFirstPage;

    if (additionalSatelliteCount > 0) {
      additionalHelloes = helloesList.slice(satellitesFirstPage + 1);
    } else {
      additionalHelloes = null;
    }
  }

  const [showSecondButton, setShowSecondButton] = useState(false);
  const opacityAnim = new Animated.Value(1);

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
      toValue: 0,
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
          <ButtonLottieAnimationSatellitesHelloes
            onPress={() => handlePress(mainHello)} 
            navigateToFirstPage={navigateToFirstPage}
            firstItem={mainHello ? mainHello : 'Loading...'}
            allItems={helloesList ? helloesList : 'Loading...'}
            subHeaderText={mainHello ? mainHello.locationName : 'Loading...'}
            
            additionalText={
              mainHello && friendDashboardData.length > 0 && friendDashboardData[0].days_since_words !== undefined
                ? `${friendDashboardData[0].days_since_words}`
                : ''
            }
            typeIcon={mainHello ? <IconDynamicHelloType selectedChoice={mainHello.type} svgHeight={70} svgWidth={70} /> : null}
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
            showGradient={true}
            lightColor={lightColor}
            darkColor={darkColor}
            shapePosition="right"
            shapeSource={require('../assets/shapes/greenfloral.png')}
            shapeWidth={340}
            shapeHeight={340}
            shapePositionValue={-154}
            showIcon={false}
            satellites={!showSecondButton}
            satelliteSectionPosition="right"
            satelliteSectionBackgroundColor={iconBackgroundColor}
            satelliteCount={satellitesFirstPage}
            satelliteHellos={satelliteHelloes}
            satellitesOrientation="horizontal"
            satelliteHeight="60%"
            additionalPages={showSecondButton}
            additionalSatellites={helloesList}
            satelliteOnPress={(hello) => handlePress(hello)} 
          />
        ) : (
          <ButtonLottieAnimationSatellitesHelloes
            onPress={() => handlePress(mainHello)}
            navigateToFirstPage={navigateToFirstPage}
            firstItem={mainHello ? mainHello.date : 'Loading...'}
            allItems={helloesList ? helloesList : 'Loading...'}
            subHeaderText={mainHello ? mainHello.locationName: 'Loading...'}
            
            additionalText={
              mainHello && friendDashboardData.length > 0 && friendDashboardData[0].days_since !== undefined
                ? friendDashboardData[0].days_since === 1
                  ? `${friendDashboardData[0].days_since} day ago`
                  : `${friendDashboardData[0].days_since} days ago`
                : ''
            }
            typeIcon={mainHello ? <IconDynamicHelloType selectedChoice={mainHello.type} /> : null}
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
            shapePosition="right"
            shapeSource={require('../assets/shapes/funkycoloredpattern.png')}
            shapeWidth={340}
            shapeHeight={340}
            shapePositionValue={-154}
            showIcon={false}
            satellites={!showSecondButton}
            satelliteSectionPosition="right"
            satelliteSectionBackgroundColor={iconBackgroundColor}
            satelliteCount={satellitesFirstPage}
            satelliteHellos={satelliteHelloes}
            satellitesOrientation="horizontal"
            satelliteHeight="60%"
            additionalPages={false}
            satelliteOnPress={(hello) => handlePress(hello)} 
          />
        )}
      </Animated.View>

      </View>

      <TogglerActionButton
        showSecondButton={showSecondButton}
        handleNext={handleNext}
        navigateToFirstPage={navigateToFirstPage}
        handleFullScreen={navigateToHelloesScreen}
        navigateToLocationScreen={navigateToHelloesScreen}
        height={calculatedButtonHeight}
        borderRadius={buttonRadius}
        justifyContent={justifyIconContent}
        marginLeft={16} 
        backgroundColor={friendColorTheme.darkColor}
        topIconSize={topIconSize}
        bottomIconSize={bottomIconSize}
        iconColor={inactiveIconColor}
        highlightIconColor={friendColorTheme.lightColor}
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

export default ActionFriendPageHelloes;
