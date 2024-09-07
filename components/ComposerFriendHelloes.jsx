import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { fetchPastHelloes } from '../api';

import BaseFriendViewHelloes from './BaseFriendViewHelloes';
import IconDynamicHelloType from '../components/IconDynamicHelloType';
import TogglerActionButton from '../components/TogglerActionButton';
import ScrollOutlineSvg from '../assets/svgs/scroll-outline.svg';
import GridViewOutlineSvg from '../assets/svgs/grid-view-outline.svg';

import { useSelectedFriend } from '../context/SelectedFriendContext';

import { useNavigation } from '@react-navigation/native';

const ComposerFriendHelloes = ({ 
  onPress,
  includeHeader=true, 
  headerText='HELLOES',
  headerTextColor='white',
  headerFontFamily='Poppins-Regular',
  headerTextSize=15, 
  headerInside=false,
  buttonHeight=70,
  buttonRadius=20,
  headerHeight=30,
  justifyIconContent='center',
  inactiveIconColor='white',
  topIconSize=30,
  bottomIconSize=30, 
  oneBackgroundColor='black', //#2B2B2B

 }) => {
  
  const navigation = useNavigation();
  
  const { selectedFriend, friendDashboardData, friendColorTheme, calculatedThemeColors } = useSelectedFriend(); 
  const [helloesList, setHelloesList] = useState([]);  
  const [isFetchingHelloes, setFetchingHelloes] = useState(false);
  const [ iconBackgroundColor ] = useState(null);
  const calculatedButtonHeight = headerInside ? buttonHeight + headerHeight : buttonHeight;
  const calculatedBackgroundColor = headerInside ? oneBackgroundColor : 'transparent';

  useEffect(() => {
    const fetchData = async () => {
        setFetchingHelloes(true);
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
        } finally {
          setFetchingHelloes(false);
        }
    };
    fetchData();
}, [selectedFriend]);

  const navigateToHelloesScreen = () => {
    navigation.navigate('Helloes'); 
    if (onPress) onPress(); 
  };

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
        <View style={[styles.containerHeaderInside, { backgroundColor: oneBackgroundColor, borderTopRightRadius: buttonRadius }]}>
          
          {includeHeader && headerInside && (
            <View style={[styles.headerContainer, { backgroundColor: oneBackgroundColor, borderTopRightRadius: buttonRadius, height: headerHeight}]}>
                      <Text style={[styles.headerText, { color: headerTextColor, fontFamily: headerFontFamily, fontSize: headerTextSize }]}>
              {headerText}
            </Text>
          </View>
          )}

      <View style={{ flex: 1 }}>
          <BaseFriendViewHelloes
            buttonHeight={buttonHeight}
            buttonRadius={buttonRadius} 
            isFetching={isFetchingHelloes}
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
            lightColor={oneBackgroundColor}
            darkColor={oneBackgroundColor} 
            satellites={!showSecondButton} 
            satelliteSectionBackgroundColor={iconBackgroundColor} 
            additionalPages={showSecondButton}  
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
        backgroundColor={oneBackgroundColor}
        topIconSize={topIconSize}
        bottomIconSize={bottomIconSize}
        iconColor={inactiveIconColor}
        highlightIconColor={calculatedThemeColors.darkColor}
        useBottomButtonOnly={true}
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

export default ComposerFriendHelloes;
