import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useFriendList } from '../context/FriendListContext';
import { useSelectedFriend } from '../context/SelectedFriendContext'; 
import FriendSelectModalVersionButtonOnly from './FriendSelectModalVersionButtonOnly';
import ArrowLeftCircleOutline from '../assets/svgs/arrow-left-circle-outline.svg';
import { useNavigation } from '@react-navigation/native';
// {`View profile: ${selectedFriend ? selectedFriend.name : ''}`}

import { LinearGradient } from 'expo-linear-gradient';




const HeaderFriendFocus = () => {
 
    const { themeStyles } = useGlobalStyle();
    const { themeAheadOfLoading } = useFriendList();
    const { selectedFriend, calculatedThemeColors, friendColorTheme, loadingNewFriend } = useSelectedFriend();
    const navigation = useNavigation();

    const handleNavigateBack = () => {
        navigation.goBack();  
      };

  return (
    <>
    {!loadingNewFriend && ( 
          <LinearGradient
          colors={[
              friendColorTheme?.useFriendColorTheme ? themeAheadOfLoading.darkColor : '#4caf50',
              friendColorTheme?.useFriendColorTheme ? themeAheadOfLoading.lightColor : 'rgb(160, 241, 67)',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerContainer}
      > 
      <View style={{flexDirection: 'row', width: '60%', justifyContent: 'flex-start', alignContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity onPress={handleNavigateBack}>
        <ArrowLeftCircleOutline height={30} width={30}   color={calculatedThemeColors.fontColor}/>

        </TouchableOpacity> 
        <Text
        numberOfLines={1} 
          style={[
            styles.headerText, 
            themeStyles.headerText, 
            
            {
                color: calculatedThemeColors.fontColor, 
                paddingLeft: 20, 
            }
          ]}
>
{`${selectedFriend ? selectedFriend.name : ''}`}

</Text>


      </View> 
      <FriendSelectModalVersionButtonOnly width='20%' iconSize={40} includeLabel={false} />
   
    </LinearGradient>
    
  )}
  </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    padding: 10,
    paddingTop: 56, //FOR TEST BUILD: 12 For dev: 66
    paddingHorizontal: 10, 
    alignItems: 'center',  
    justifyContent: 'space-between',
    height: 100,//FOR TEST BUILD: 60 (or 56?) //For dev: 110
  },
  headerText: {
    position: 'absolute', 
    right: 0,  // Maintain a fixed distance from the right icon
    fontSize: 24,
    fontFamily: 'Poppins-Regular',
    textTransform: 'uppercase',
    width: '90%',  // Adjust width to prevent overlapping
    textAlign: 'left',  // Keep the text aligned to the right
  },
  usernameText: {
    fontSize: 14,
    paddingVertical: 2, 
    fontFamily: 'Poppins-Bold',
  },
});

export default HeaderFriendFocus;
