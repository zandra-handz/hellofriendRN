import React from 'react';
import { View, Text, StyleSheet } from 'react-native'; 
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useFocusEffect } from '@react-navigation/native';  
import LizardSvg from '../assets/svgs/lizard.svg';
import ButtonInfo from '../components/ButtonInfo';
import ButtonFriendProfileCircle from '../components/ButtonFriendProfileCircle';
 
const HellofriendHeader = () => { 
  const { themeStyles, setNonCustomHeaderPage } = useGlobalStyle();
  const { selectedFriend, friendLoaded } = useSelectedFriend();

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
        {selectedFriend && friendLoaded && (
          <View style={{height: 44, width: 90, overflow: 'hidden', flexDirection: 'column', paddingBottom: 10, justifyContent: 'flex-end'}}>
                <View style={{transform: [{ rotate: '240deg' }] }}>
      
                    <LizardSvg width={74} height={74} color={themeStyles.genericText.color} />
           
                </View>
              </View>
          

        )}
       {(!selectedFriend || !friendLoaded) && ( 

        <Text style={[styles.logoText, themeStyles.headerText]}>HF</Text>
       
      )}
        </View> 

      <View style={styles.rightSection}>
        <View style={styles.userProfile}> 
            <ButtonInfo iconSize={34} />
        </View>
      </View>
    </View>
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

export default HellofriendHeader;
