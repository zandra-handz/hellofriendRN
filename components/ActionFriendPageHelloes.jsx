import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import BaseFriendViewHelloes from './BaseFriendViewHelloes';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useNavigation } from '@react-navigation/native';

import { fetchPastHelloes } from '../api';

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
  bottomIconSize=30,
  daysText='',

 }) => {
  
  const navigation = useNavigation();
  
  const { selectedFriend, friendDashboardData, friendColorTheme } = useSelectedFriend(); 
  const [helloesList, setHelloesList] = useState([]); 
  const [ lightColor, setLightColor ] = useState(null);
  const [ darkColor, setDarkColor ] = useState(null);
  const [ iconBackgroundColor ] = useState(null);

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
  let satelliteHelloes = [];
  let satellitesFirstPage = 1;
  let additionalSatelliteCount = null;
  let additionalHelloes = []; 

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
 

  const navigateToFirstPage = () => {
    setShowSecondButton(false); 
  };

  const handleNext = () => {
    setShowSecondButton(true); 
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

      <View style={{ flex: 1 }}>
          <BaseFriendViewHelloes
            buttonHeight={buttonHeight}
            onPress={() => {}}
            navigateToFirstPage={navigateToFirstPage} 
            allItems={helloesList ? helloesList : 'Loading...'}
            additionalText={
              friendDashboardData.length > 0 && friendDashboardData[0].days_since_words
                ? `${friendDashboardData[0].days_since_words}`
                : ''
            }
            typeIcon={friendDashboardData.length > 0 ? <IconDynamicHelloType selectedChoice={friendDashboardData[0].previous_meet_type} svgHeight={40} svgWidth={40} /> : null}
            fontMargin={3}   
            showGradient={true}
            lightColor={lightColor}
            darkColor={darkColor} 
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
      </View>

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
