import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProfileCircleSvg from '../assets/svgs/ProfileCircleSvg'; // Import ProfileCircleSvg

import { useFriendList } from '../context/FriendListContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import LoadingPage from '../components/LoadingPage';

const ButtonFriendProfileCircle = ({ screenSide = 'left' }) => {
  const { selectedFriend, friendColorTheme, friendDashboardData, setFriend, calculatedThemeColors, loadingNewFriend } = useSelectedFriend();
  const { themeStyles } = useGlobalStyle();
  const { themeAheadOfLoading } = useFriendList();
  const [profileIconColor, setProfileIconColor] = useState();
  const navigation = useNavigation();

  useEffect(() => {
    if (selectedFriend && calculatedThemeColors.lightColor !== themeStyles.genericTextBackground.backgroundColor) {

    setProfileIconColor([friendColorTheme?.useFriendColorTheme ? themeAheadOfLoading.darkColor : '#4caf50', friendColorTheme?.useFriendColorTheme  ? themeAheadOfLoading.lightColor : 'rgb(160, 241, 67)'] );
     
    } else {
      console.log(themeStyles.genericTextBackground.backgroundColor);
      console.log(calculatedThemeColors.lightColor);
      setProfileIconColor([themeStyles.genericText.color, themeStyles.genericText.color]);
    }
    renderProfileIcon();

  }, [selectedFriend, themeStyles, calculatedThemeColors]);

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
    if (Array.isArray(profileIconColor) && profileIconColor.length === 2) {
        return (
          <View style={{ flexDirection: 'row' }}>
            
            <ProfileCircleSvg width={32} height={32} startColor={profileIconColor[0]} endColor={profileIconColor[0]} />
            
            <View style={{
              backgroundColor: profileIconColor[1],  // Circle color
              borderRadius: 16,  // Half of width/height to make it circular
              width: 32,  // Circle diameter
              height: 32,
              alignItems: 'center', 
              justifyContent: 'center',
              marginLeft: 4,  // Adjust spacing between circle and ProfileCircleSvg if needed
          }}>
              <Text style={[styles.friendText, { color: friendColorTheme?.useFriendColorTheme ? calculatedThemeColors.fontColorSecondary : '#4caf50' }]}>
                  {selectedFriend && selectedFriend.name.charAt(0)}
              </Text>
          </View>
          </View>
        );
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
    fontSize: 20,
    paddingVertical: 0,
    alignSelf: 'center',
    fontFamily: 'Poppins-Bold',
    paddingLeft: 0,
  },
});

export default ButtonFriendProfileCircle;
