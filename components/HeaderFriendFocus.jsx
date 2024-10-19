import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { useAuthUser } from '../context/AuthUserContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';

import FriendSelectModalVersionButtonOnly from './FriendSelectModalVersionButtonOnly';


import ArrowLeftCircleOutline from '../assets/svgs/arrow-left-circle-outline.svg';
import InfoOutline from '../assets/svgs/info-outline.svg';
import { useNavigation } from '@react-navigation/native';
// {`View profile: ${selectedFriend ? selectedFriend.name : ''}`}



const HeaderFriendFocus = () => {

    const { authUserState } = useAuthUser();
    const { themeStyles } = useGlobalStyle();
    const { selectedFriend, calculatedThemeColors, loadingNewFriend } = useSelectedFriend();
    const navigation = useNavigation();

    const handleNavigateBack = () => {
        navigation.goBack(); // This will navigate to the previous screen
      };

  return (
    <>
    {!loadingNewFriend && ( 
    <View style={[styles.headerContainer, themeStyles.headerContainer, {backgroundColor: calculatedThemeColors.darkColor}]}>
      <View style={{flexDirection: 'row', width: '60%', justifyContent: 'flex-start', alignContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity onPress={handleNavigateBack}>
        <ArrowLeftCircleOutline height={30} width={30}   color={calculatedThemeColors.fontColor}/>

        </TouchableOpacity> 
        <Text 
  style={[
    styles.headerText, 
    themeStyles.headerText, 
    {
        color: calculatedThemeColors.fontColor, 
        paddingLeft: 20, 
    }
  ]}
>
  {`View items`}

</Text>


      </View> 
      <FriendSelectModalVersionButtonOnly width='20%' iconSize={40} includeLabel={false} />
   
    </View>
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
    fontSize: 18,
    paddingVertical: 2, 
    fontFamily: 'Poppins-Bold',
  },
  usernameText: {
    fontSize: 14,
    paddingVertical: 2, 
    fontFamily: 'Poppins-Bold',
  },
});

export default HeaderFriendFocus;
