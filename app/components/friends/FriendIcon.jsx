import React, { useEffect, useState } from 'react';
import { View,  Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProfileCircleSvg from '@/app/assets/svgs/ProfileCircleSvg'; // Import ProfileCircleSvg

import { useFriendList } from '@/src/context/FriendListContext';
import { useGlobalStyle } from '@/src/context/GlobalStyleContext';
import { useSelectedFriend } from '@/src/context/SelectedFriendContext';
 


const FriendIcon = () => {
  const { selectedFriend, friendLoaded, friendDashboardData, setFriend, loadingNewFriend } = useSelectedFriend();
  const { themeStyles } = useGlobalStyle();
  const { themeAheadOfLoading, setThemeAheadOfLoading } = useFriendList();
  const [profileIconColor, setProfileIconColor] = useState();
  const navigation = useNavigation();


  const handleDeselect = () => {
    setFriend(null);
    setThemeAheadOfLoading({lightColor: '#a0f143', darkColor: '#4caf50', fontColor: '#000000', fontColorSecondary: '#000000'});
  


  };

  const ICON_SIZE = 28;


  useEffect(() => {
    if (selectedFriend && friendLoaded && themeAheadOfLoading.lightColor !== themeStyles.genericTextBackground.backgroundColor) {
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
 

  const handleLongPress = () => {
    // Show an alert asking if they want to deselect the friend
    Alert.alert(
      'Deselect Friend',
      'Do you want to deselect your friend?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes', onPress: handleDeselect()}, // Deselect friend function
      ],
      { cancelable: true }
    );
  };
//to restore gradient: [1] - [0]
  const renderProfileIcon = () => {
    if (Array.isArray(profileIconColor) && profileIconColor.length === 2) {
        return ( 
            <ProfileCircleSvg width={ICON_SIZE} height={ICON_SIZE} startColor={themeAheadOfLoading.lightColor} endColor={themeAheadOfLoading.darkColor} />
             
        );
      } 
  };

  return (
    <View style={{  }}>
    {loadingNewFriend && (
        <View style={styles.loadingWrapper}>
        {/* <LoadingPage
        loading={loadingNewFriend} 
        color={themeAheadOfLoading.darkColor}
        spinnerType='flow'
        spinnerSize={30}
        includeLabel={false} 
        /> */}
        </View>
    )}
    
    {!loadingNewFriend && ( <>
    
        {renderProfileIcon()} 
    
    </>
         
       )}
    </View>
  );
};

const styles = StyleSheet.create({ 
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

export default FriendIcon;
