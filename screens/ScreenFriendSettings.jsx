
//<Text style={[styles.friendNameText, themeStyles.subHeaderText, {color: calculatedThemeColors.fontColor}]}>
//{selectedFriend ? selectedFriend.name : ''}
//</Text>
//   <HelloFriendFooter />   
import React, { useEffect, useState } from 'react';
import { View, Text,  StyleSheet } from 'react-native';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { LinearGradient } from 'expo-linear-gradient'; 
import { useNavigation, useFocusEffect } from '@react-navigation/native';
 
import { useFriendList } from '../context/FriendListContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';
 import LoadingPage from '../components/LoadingPage';
import { Dimensions } from 'react-native';
import HelloFriendFooter from '../components/HelloFriendFooter'; 
import ModalColorTheme from '../components/ModalColorTheme';
 
const ScreenFriendSettings = () => {
  const { selectedFriend, friendDashboardData, friendColorTheme, loadingNewFriend } = useSelectedFriend();
  const { themeAheadOfLoading } = useFriendList(); 
  const { themeStyles, gradientColorsHome } = useGlobalStyle();
  const { darkColor, lightColor } = gradientColorsHome;

  useFocusEffect(
    React.useCallback(() => {
      setIsAnimationPaused(false);
    }, [])
  );




  const navigation = useNavigation();
  
 

  const windowHeight = Dimensions.get('window').height; 

const [isAnimationPaused, setIsAnimationPaused ] = useState(true);
  
  useEffect(() => {
    const handleScreenBlur = () => {
      setIsAnimationPaused(true);
      console.log('paused animation via blur effect');
    };

    const unsubscribeBlur = navigation.addListener('blur', handleScreenBlur);

    return unsubscribeBlur;
  }, [navigation]);

 

  const navigateToHelloesScreen = () => { 
    navigation.navigate('Helloes'); 
  };

  
  return (
    <LinearGradient
      colors={[darkColor, lightColor]}  
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
        <View style={[styles.backColorContainer, {borderColor: themeAheadOfLoading.lightColor}]}>
      
            <View style={styles.section}>
                <View style={styles.subTitleRow}> 
                    <Text style={[styles.modalSubTitle]}>SETTINGS</Text>
                </View>
                <Text style={themeStyles.genericText}>Hi</Text>
                <View style={[styles.divider, { borderBottomColor: themeStyles.modalText.color}]}></View>
            </View>
            <View style={styles.section}>
                <View style={styles.subTitleRow}> 
                    <Text style={[styles.modalSubTitle, themeStyles.modalText]}>THEME</Text>
                </View>
                <ModalColorTheme />
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
    width: '100%', 
  },
  subTitleRow: {
    flexDirection: 'row',  
    marginBottom: 20,  
  },
  section: { 
    flex: 1,
     
    width: '100%', 
    justifyContent: 'flex-start',
},
modalSubTitle: {
    fontSize: 19,
    fontFamily: 'Poppins-Regular',  
  }, 
divider: { 
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
  paddingHorizontal: '2%',
  paddingTop: '8%',
  paddingBottom: '13%', 
  width: '101%',
  alignSelf: 'center', 
  flexDirection: 'column',
  justifyContent: 'space-between',
},  

});
export default ScreenFriendSettings;
