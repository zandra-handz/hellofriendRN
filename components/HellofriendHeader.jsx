import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuthUser } from '../context/AuthUserContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';

const HellofriendHeader = () => {

    const { authUserState } = useAuthUser();
    const { themeStyles } = useGlobalStyle();

  return (
    <View style={[styles.headerContainer, themeStyles.headerContainer]}>
      <Text style={[styles.headerText, themeStyles.headerText]}>Hellofriend</Text>
      <Text style={[styles.usernameText, themeStyles.headerText]}>logged in: {authUserState.user.username}</Text>
    
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    padding: 12,
    paddingTop: 66, //FOR TEST BUILD: 0 For dev: 66
    paddingHorizontal: 10, 
    alignItems: 'center',  
    justifyContent: 'space-between',
    height: 110,//FOR TEST BUILD: 60 (or 56?) //For dev: 110
  },
  headerText: {
    fontSize: 20,
    paddingVertical: 2, 
    fontFamily: 'Poppins-Regular',
  },
  usernameText: {
    fontSize: 14,
    paddingVertical: 2, 
    fontFamily: 'Poppins-Bold',
  },
});

export default HellofriendHeader;
