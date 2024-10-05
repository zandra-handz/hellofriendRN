import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProfileCircleSvg from '../assets/svgs/ProfileCircleSvg'; // Import ProfileCircleSvg
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import LoadingPage from '../components/LoadingPage';

const ButtonFriendProfileCircle = ({ screenSide = 'left' }) => {
  const { selectedFriend, friendDashboardData, setFriend, calculatedThemeColors, loadingNewFriend } = useSelectedFriend();
  const { themeStyles } = useGlobalStyle();
  const [profileIconColor, setProfileIconColor] = useState();
  const navigation = useNavigation();

  useEffect(() => {
    setProfileIconColor([calculatedThemeColors.lightColor, calculatedThemeColors.darkColor]);
    renderProfileIcon();
  }, [selectedFriend, calculatedThemeColors]);

  const navigateToFriendFocus = () => {
    if (selectedFriend) {
      navigation.navigate('FriendFocus');
    }
  };
 

  const handleLongPress = () => {
    // Show an alert asking if they want to deselect the friend
    Alert.alert(
      'Deselect Friend',
      'Do you want to deselect your friend?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes', onPress: () => setFriend(null) }, // Deselect friend function
      ],
      { cancelable: true }
    );
  };
//to restore gradient: [1] - [0]
  const renderProfileIcon = () => {
    if (selectedFriend) {
      if (Array.isArray(profileIconColor) && profileIconColor.length === 2) {
        return (
          <View style={{ flexDirection: 'row' }}>
            
            <ProfileCircleSvg width={32} height={32} startColor={profileIconColor[0]} endColor={profileIconColor[0]} />
            <Text style={[styles.friendText, { color: calculatedThemeColors.lightColor }]}>
              {selectedFriend && selectedFriend.name.charAt(0)}
            </Text>
          </View>
        );
      }
    } else {
      return <ProfileCircleSvg width={32} height={32} color={themeStyles.genericText.color} />;
    }
  };

  return (
    <View style={{ flexDirection: 'row' }}>
    {loadingNewFriend && (
        <View style={styles.loadingWrapper}>
        <LoadingPage
        loading={loadingNewFriend} 
        spinnnerType='wander'
        spinnerSize={30}
        includeLabel={false} 
        />
        </View>
    )}
    
    {!loadingNewFriend && (
      <TouchableOpacity
        onPress={navigateToFriendFocus} // Regular tap navigates to friend focus screen
        onLongPress={handleLongPress} // Long press triggers the alert
        style={styles.arrowButton}
      >
        <View style={styles.svgContainer}>
          {renderProfileIcon()}
        </View>
      </TouchableOpacity>
       )}
    </View>
  );
};

const styles = StyleSheet.create({
  arrowButton: {},
  svgContainer: {},
  SvgImage: {
    color: 'black',
  },
  loadingWrapper: {
    flex: .4,
    paddingRight: 0,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
  },
  friendText: {
    fontSize: 18,
    paddingVertical: 2,
    fontFamily: 'Poppins-Regular',
    paddingLeft: 6,
  },
});

export default ButtonFriendProfileCircle;
