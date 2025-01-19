import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProfileCircleSvg from '../assets/svgs/ProfileCircleSvg'; // Import ProfileCircleSvg

import { useFriendList } from '../context/FriendListContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import LoadingPage from '../components/LoadingPage'; 

import GearsTwoBiggerCircleSvg from '../assets/svgs/gears-two-bigger-circle.svg';
 


const ButtonFriendProfileCircle = () => {
  const { selectedFriend, friendLoaded, friendDashboardData, setFriend, loadingNewFriend, deselectFriend } = useSelectedFriend();
  const { themeStyles, manualGradientColors } = useGlobalStyle();
  const { themeAheadOfLoading, setThemeAheadOfLoading } = useFriendList();
  const [profileIconColor, setProfileIconColor] = useState();
  const navigation = useNavigation();


  // const handleDeselect = () => {
  //   deselectFriend();

  // };

  const ICON_SIZE = 28;


  useEffect(() => {
    if (themeAheadOfLoading.lightColor !== themeStyles.genericTextBackground.backgroundColor) {
    setProfileIconColor([themeAheadOfLoading.darkColor || '#4caf50', themeAheadOfLoading.lightColor || 'rgb(160, 241, 67)'] );
     
    } else { 
      setProfileIconColor([themeStyles.genericText.color, themeStyles.genericText.color]);
    }
    renderProfileIcon();

  }, [selectedFriend, themeStyles]);

  const navigateToFriendFocus = () => {
    if (selectedFriend) {
      navigation.navigate('FriendFocus');
    }
  };
 

  // const handleLongPress = () => {
  //   // Show an alert asking if they want to deselect the friend
  //   Alert.alert(
  //     'Deselect Friend',
  //     'Do you want to deselect your friend?',
  //     [
  //       { text: 'Cancel', style: 'cancel' },
  //       { text: 'Yes', onPress: handleDeselect()}, // Deselect friend function
  //     ],
  //     { cancelable: true }
  //   );
  // };
//to restore gradient: [1] - [0]
  const renderProfileIcon = () => {
    if (Array.isArray(profileIconColor) && profileIconColor.length === 2) {
        return (
          <View style={{ flexDirection: 'row' }}>
            
            {/* <ProfileCircleSvg width={ICON_SIZE} height={ICON_SIZE} startColor={themeAheadOfLoading.lightColor} endColor={themeAheadOfLoading.darkColor} />
             */}
            <View style={{
              backgroundColor: themeAheadOfLoading.lightColor,  // Circle color
              borderRadius: 16,  // Half of width/height to make it circular
              width: ICON_SIZE - 1,  // Circle diameter
              height: ICON_SIZE - 1,
              alignItems: 'center', 
              justifyContent: 'center',
              marginLeft: 4,  // Adjust spacing between circle and ProfileCircleSvg if needed
          }}>
              <Text style={[styles.friendText, { color: friendLoaded && friendDashboardData && selectedFriend ? themeAheadOfLoading.fontColorSecondary : 'black' }]}>
                  {selectedFriend && friendLoaded && selectedFriend.name.charAt(0)}
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
        color={themeAheadOfLoading.darkColor}
        spinnerType='flow'
        spinnerSize={30}
        includeLabel={false} 
        />
        </View>
    )}
    
    {!loadingNewFriend && (
      <TouchableOpacity
        onPress={navigateToFriendFocus} // Regular tap navigates to friend focus screen
       // onLongPress={handleLongPress} // Long press triggers the alert
        style={styles.arrowButton}
      >
        <View style={styles.svgContainer}>
          {renderProfileIcon()}
          <View style={{
            position: 'absolute',
            top: -2,
            left: 34,
            zIndex: 1000,
          }}>
            
           <GearsTwoBiggerCircleSvg width={26} height={26} color={themeAheadOfLoading.darkColor}   />
                
          </View>
        </View>

      </TouchableOpacity>
       )}
    </View>
  );
};

const styles = StyleSheet.create({
  arrowButton: {
    flex: 1,
  },
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
    fontSize: 17,
    paddingVertical: 0,
    alignSelf: 'center',
    fontFamily: 'Poppins-Bold',
    paddingLeft: 0,
  },
});

export default ButtonFriendProfileCircle;
