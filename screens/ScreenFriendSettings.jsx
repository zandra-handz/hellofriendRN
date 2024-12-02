
//<Text style={[styles.friendNameText, themeStyles.subHeaderText, {color: calculatedThemeColors.fontColor}]}>
//{selectedFriend ? selectedFriend.name : ''}
//</Text>
//   <HelloFriendFooter />   
import React, { useState } from 'react';
import { View, Text,  StyleSheet, TouchableOpacity } from 'react-native';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { LinearGradient } from 'expo-linear-gradient'; 
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { useFriendList } from '../context/FriendListContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import LoadingPage from '../components/LoadingPage';
import { Dimensions } from 'react-native';
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
                    <Text style={[styles.modalSubTitle, themeStyles.genericText]}>SETTINGS</Text>
                </View> 
            </View>

            <View style={[styles.divider, { borderBottomColor: themeStyles.modalText.color}]}></View>
            
            <View style={styles.section}>
                <View style={styles.subTitleRow}> 
                    <Text style={[styles.modalSubTitle, themeStyles.genericText]}>THEME</Text>
                </View> 
                <ModalColorTheme /> 
              </View>
            
            <View style={[styles.divider, { borderBottomColor: themeStyles.modalText.color}]}></View>
           
            <View style={styles.section}>
                <View style={styles.subTitleRow}> 
                    <Text style={[styles.modalSubTitle, themeStyles.modalText]}>ADDRESSES</Text>
                </View>
                <Text style={themeStyles.genericText}></Text>
            </View>

            <View style={[styles.divider, { borderBottomColor: themeStyles.modalText.color}]}></View>
            
            <View style={styles.section}>
                <View style={styles.subTitleRow}> 
                    <Text style={[styles.modalSubTitle, themeStyles.modalText]}>DANGER ZONE: DELETE</Text>
                </View>
                <Text style={themeStyles.genericText}></Text>
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
    paddingHorizontal: '2%',
    paddingVertical: '3%',
},
modalSubTitle: {
    fontSize: 19,
    fontFamily: 'Poppins-Regular',  
  }, 
divider: { 
    borderBottomWidth: .8,  
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
  flex: 1,
  paddingHorizontal: '2%', 
  paddingTop: '10%', 
  width: '101%',
  alignSelf: 'center', 
  flexDirection: 'column',
  justifyContent: 'flex-start',
},  

});
export default ScreenFriendSettings;
