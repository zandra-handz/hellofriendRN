
//<Text style={[styles.friendNameText, themeStyles.subHeaderText, {color: calculatedThemeColors.fontColor}]}>
//{selectedFriend ? selectedFriend.name : ''}
//</Text>
//   <HelloFriendFooter />   
import React, { useEffect, useState } from 'react';
import { View, Text,  StyleSheet } from 'react-native';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { LinearGradient } from 'expo-linear-gradient'; 
import LastHelloBanner from '../components/LastHelloBanner';
import SettingsColorTheme from '../components/SettingsColorTheme';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { useFriendList } from '../context/FriendListContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';
 import LoadingPage from '../components/LoadingPage';
import { Dimensions } from 'react-native';
import HelloFriendFooter from '../components/HelloFriendFooter'; 
 
 
const ScreenFriendSettings = () => {
  const { selectedFriend, friendDashboardData, friendColorTheme, loadingNewFriend } = useSelectedFriend();
  const { friendList, themeAheadOfLoading } = useFriendList();
  const { themeStyles } = useGlobalStyle(); 

  useFocusEffect(
    React.useCallback(() => {
      setIsAnimationPaused(false);
    }, [])
  );




  const navigation = useNavigation();
 
  const buttonMargin = 0; 
 

  const windowHeight = Dimensions.get('window').height;
  const bottomSectionHeight = windowHeight * 0.7; // Fixed 70% for bottom
  const topSectionHeight = windowHeight - bottomSectionHeight; 
  const topSectionPadding = Dimensions.get('window').height * 0.01;
  const bottomSectionPadding = Dimensions.get('window').height * 0.01;


const [isAnimationPaused, setIsAnimationPaused ] = useState(true);
  
  useEffect(() => {
    const handleScreenBlur = () => {
      setIsAnimationPaused(true);
      console.log('paused animation via blur effect');
    };

    const unsubscribeBlur = navigation.addListener('blur', handleScreenBlur);

    return unsubscribeBlur;
  }, [navigation]);


const navigateToMomentsScreen = () => { 
    navigation.navigate('Moments'); 
  };

  const navigateToHelloesScreen = () => { 
    navigation.navigate('Helloes'); 
  };

  
  return (
    <LinearGradient
      colors={['#000002', '#163805']}  
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}  
      style={styles.container} 
    > 
      {loadingNewFriend && themeAheadOfLoading && (
          <View style={[styles.loadingWrapper, {backgroundColor: themeAheadOfLoading.lightColor}]}>
          <LoadingPage
            loading={loadingNewFriend} 
            spinnerType='wander'
            color={themeAheadOfLoading.darkColor}
            includeLabel={true}
            label="Loading"
          />
          </View>
      )}
      {!loadingNewFriend && selectedFriend && (
        <>
        <View style={[styles.backColorContainer, {backgroundColor: 'transparent', borderColor: themeAheadOfLoading.lightColor}]}>
      
            <View style={styles.section}>
                <View style={styles.subTitleRow}> 
                    <Text style={[styles.modalSubTitle, themeStyles.modalText]}>SETTINGS</Text>
                </View>
                <Text style={themeStyles.genericText}>Hi</Text>
                <View style={[styles.divider, { borderBottomColor: themeStyles.modalText.color}]}></View>
            </View>
            <View style={styles.section}>
                <View style={styles.subTitleRow}> 
                    <Text style={[styles.modalSubTitle, themeStyles.modalText]}>THEME</Text>
                </View>
                <Text style={themeStyles.genericText}>Hi</Text>
                <View style={[styles.divider, { borderBottomColor: themeStyles.modalText.color}]}></View>
            </View>
            <View style={styles.section}>
                <View style={styles.subTitleRow}> 
                    <Text style={[styles.modalSubTitle, themeStyles.modalText]}>ADDRESSES</Text>
                </View>
                <Text style={themeStyles.genericText}>Hi</Text>
                <View style={[styles.divider, { borderBottomColor: themeStyles.modalText.color}]}></View>
            </View>
            <View style={styles.section}>
                <View style={styles.subTitleRow}> 
                    <Text style={[styles.modalSubTitle, themeStyles.modalText]}>TITLE</Text>
                </View>
                <Text style={themeStyles.genericText}>Hi</Text>
                <View style={[styles.divider, { borderBottomColor: themeStyles.modalText.color}]}></View>
            </View>
        
        </View>
     
        </>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    paddingVertical: 0,  
    width: '100%',
    alignSelf: 'flex-start', 
  },
  subTitleRow: {
    flexDirection: 'row',
    alignContent: 'center', 
    alignItems: 'center',
    marginBottom: 20, //lowered this from ModalColorTheme
  },
  section: {
    marginBottom: 10,
},
modalSubTitle: {
    fontSize: 19,
    fontFamily: 'Poppins-Regular',  
  }, 
divider: {
    marginVertical: 10,
    borderBottomWidth: 1,  
}, 
  friendNameText: {
    fontSize: 28,
    fontFamily: 'Poppins-Regular',

  },
  headerText: {
    fontSize: 20,
    marginTop: 0,
    fontFamily: 'Poppins-Regular',

  },
  topSectionContainer: {
    width: '100%',  
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start', 
  },
  bottomSectionContainer: {
    width: '100%',   
    flexDirection: 'column',
    justifyContent: 'flex-end',
    flex: 1, 
},
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },  
  buttonContainer: { 
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 0,  
    paddingTop: 0, 
    paddingBottom: 14,
    
  },
 
backColorContainer: {  
  minHeight: '100%', 
  alignContent: 'center',
  paddingHorizontal: '2%',
  paddingTop: '8%',
  paddingBottom: '13%', 
  width: '101%',
  alignSelf: 'center',
  borderWidth: 0,
  borderTopRightRadius: 0,
  borderTopLeftRadius: 0,
  borderRadius: 0,
  flexDirection: 'column',
  justifyContent: 'space-between',
},  

});
export default ScreenFriendSettings;
