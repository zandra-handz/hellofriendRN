import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuthUser } from '../context/AuthUserContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useFocusEffect } from '@react-navigation/native'; 
import UserOutlineSvg from '../assets/svgs/user-outline';
import ButtonFriendProfileCircle from '../components/ButtonFriendProfileCircle';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // Import Font Awesome

const HellofriendHeader = () => {
  const { authUserState } = useAuthUser();
  const { themeStyles, setNonCustomHeaderPage } = useGlobalStyle();
  const { selectedFriend, calculatedThemeColors } = useSelectedFriend();

  useFocusEffect(
    React.useCallback(() => {
      setNonCustomHeaderPage(true);
      return () => {
        setNonCustomHeaderPage(false);
      };
    }, [])
  );

  return (
    <View style={[styles.headerContainer, themeStyles.headerContainer]}>
    
      <View style={styles.leftSection}>
        <View style={styles.userProfile}>
          <ButtonFriendProfileCircle /> 
        </View>
      </View>
  
      <View style={styles.middleSection}>
        <Text style={[styles.logoText, themeStyles.headerText]}>HF</Text>
      </View> 

      <View style={styles.rightSection}>
        <View style={styles.userProfile}>
          <Text style={[styles.usernameText, themeStyles.headerText]}>
            {authUserState.user.username.charAt(-1)}
          </Text>
          <UserOutlineSvg height={22} width={22} color={themeStyles.headerText.color} />
          <FontAwesome name="ellipsis-v" size={18} color={themeStyles.headerText.color} style={styles.moreIcon} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    padding: 10,
    paddingTop: 66, // Adjust as needed
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 100, // Adjust as needed
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  middleSection: {
    flex: 1,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  headerText: {
    fontSize: 20,
    paddingVertical: 2,
    fontFamily: 'Poppins-Regular',
  },
  logoText: {
    fontSize: 22,
    paddingVertical: 2,
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

export default HellofriendHeader;
