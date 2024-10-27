import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'; 
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useFocusEffect } from '@react-navigation/native';  
import LizardSvg from '../assets/svgs/lizard.svg';
import { useFriendList } from '../context/FriendListContext';

import ButtonInfo from '../components/ButtonInfo';
import ArrowLeftCircleOutline from '../assets/svgs/arrow-left-circle-outline.svg';
import { LinearGradient } from 'expo-linear-gradient';
 
import { useNavigation } from '@react-navigation/native';

const HeaderBaseMainTheme = ({ headerTitle='TITLE HERE'}) => {
  const navigation = useNavigation();
  const { themeAheadOfLoading } = useFriendList();
  const { themeStyles, setNonCustomHeaderPage } = useGlobalStyle();
  const { selectedFriend, friendColorTheme, calculatedThemeColors } = useSelectedFriend();

  const handleNavigateBack = () => {
    navigation.goBack();
  };

  useFocusEffect(
    React.useCallback(() => {
      setNonCustomHeaderPage(true);
      return () => {
        setNonCustomHeaderPage(false);
      };
    }, [])
  );

  return (
    <LinearGradient
    colors={[friendColorTheme?.useFriendColorTheme ? themeAheadOfLoading.darkColor : '#4caf50', friendColorTheme?.useFriendColorTheme  ? themeAheadOfLoading.lightColor : 'rgb(160, 241, 67)']}  
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}  
    style={[styles.headerContainer]} 
  > 
    
      <View style={styles.leftSection}>
        <View style={styles.userProfile}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <ArrowLeftCircleOutline height={30} width={30} color={themeStyles.genericText.color}/>
        </TouchableOpacity> 
        </View>
      </View>
  
      <View style={styles.middleSection}>
        {selectedFriend && (
          <View style={{height: 44, width: 90, overflow: 'hidden', flexDirection: 'column', paddingBottom: 10, justifyContent: 'flex-end'}}>
                <View style={{transform: [{ rotate: '240deg' }] }}>
      
                    <LizardSvg width={74} height={74} color={themeStyles.genericText.color} />
           
                </View>
              </View>
          

        )}
       {!selectedFriend && ( 

        <Text style={[styles.logoText, themeStyles.headerText]}>HF</Text>
       
      )}
        </View> 

      <View style={styles.rightSection}>
        <Text style={[styles.headerText, themeStyles.headerText, { paddingRight: 0}]}>{headerTitle}</Text>
       
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    padding: 10,
    paddingTop: 46, // Adjust as needed
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 100, // Adjust as needed
  },
  leftSection: {
    
    flex: 1,
    alignItems: 'flex-start',
    top: 0,
  },
  middleSection: {
    flex: 1,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center'
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
    top:0,
  },
  headerText: {
    fontSize: 20,
    paddingVertical: 2,
    fontFamily: 'Poppins-Regular',
    textTransform: 'uppercase',
  }, 
  logoText: {
    fontSize: 22, 
    fontFamily: 'Poppins-Regular',
    
  },
  usernameText: {
    fontSize: 18, 
    paddingVertical: 2,
    fontFamily: 'Poppins-Regular',
    paddingRight: 6,
    paddingBottom: 6,
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreIcon: {
    marginLeft: 10, // Adjust spacing between user icon and three dots
  },
});

export default HeaderBaseMainTheme;
