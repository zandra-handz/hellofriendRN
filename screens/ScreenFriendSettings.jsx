
//<Text style={[styles.friendNameText, themeStyles.subHeaderText, {color: calculatedThemeColors.fontColor}]}>
//{selectedFriend ? selectedFriend.name : ''}
//</Text>
//   <HelloFriendFooter />   
import React, { useEffect, useState } from 'react';
import { View, Text,  StyleSheet, TouchableOpacity } from 'react-native';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { LinearGradient } from 'expo-linear-gradient'; 
import { useNavigation, useFocusEffect } from '@react-navigation/native';


import { useMessage } from "../context/MessageContext";

import useFriendFunctions from '../hooks/useFriendFunctions';

import { useFriendList } from '../context/FriendListContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import LoadingPage from '../components/LoadingPage';
import { Dimensions } from 'react-native';
import ModalColorTheme from '../components/ModalColorTheme';
import ModalEffortAndPriority from '../components/ModalEffortAndPriority';

import DoubleChecker from "../components/DoubleChecker";
import { useUpcomingHelloes } from "../context/UpcomingHelloesContext";

 
const ScreenFriendSettings = () => {
  const { selectedFriend, setFriend, loadingNewFriend, friendDashboardData } = useSelectedFriend();
  const { handleDeleteFriend, deleteFriendMutation } = useFriendFunctions();
  const { themeAheadOfLoading } = useFriendList(); 
   const [isDoubleCheckerVisible, setIsDoubleCheckerVisible] = useState(false);
   const { showMessage } = useMessage();
  const { themeStyles, gradientColorsHome } = useGlobalStyle();
  const { darkColor, lightColor } = gradientColorsHome;

  const { updateTrigger, setUpdateTrigger } = useUpcomingHelloes();
  

  const openDoubleChecker = () => {
    setIsDoubleCheckerVisible(true);
  };

  const toggleDoubleChecker = () => {
    setIsDoubleCheckerVisible((prev) => !prev);
  };

  useFocusEffect(
    React.useCallback(() => {
      setIsAnimationPaused(false);
    }, [])
  );


  useEffect(() => {
    if (friendDashboardData) {
      console.log(friendDashboardData[0].suggestion_settings);
    }

  }, [friendDashboardData]);



  const navigation = useNavigation();

  const friendName = selectedFriend?.name || 'friend';
  
 

  const windowHeight = Dimensions.get('window').height; 

const [isAnimationPaused, setIsAnimationPaused ] = useState(true);

const handleDelete = async () => {
  try {
    if (selectedFriend) { 
      await handleDeleteFriend(selectedFriend.id);
    }
  } catch (error) {
    console.log("Could not delete friend: ", error);
  }
};
 

const navigateToMainScreen = () => {
  navigation.navigate("hellofriend");
};
  useEffect(() => {
    if (deleteFriendMutation.isSuccess) {
      showMessage(true, null, ` ${friendName} has been deleted.`);
      //setUpdateTrigger((prev) => !prev);
      setFriend(null);
      navigateToMainScreen();
    }
  }, [deleteFriendMutation.isSuccess]);

  
  return (
    <LinearGradient
      colors={[darkColor, lightColor]}  
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}  
      style={styles.container} 
    > 
      {loadingNewFriend && themeAheadOfLoading && (
          <View style={[styles.loadingWrapper, {backgroundColor: themeAheadOfLoading.lightColor}]}>
          <LoadingPage
            loading={loadingNewFriend} 
            spinnerType='wander'
            color={themeAheadOfLoading.darkColor}
            includeLabel={true}
            label="Loading"
          />
          </View>
      )}
      {!loadingNewFriend && selectedFriend && (
        <>
        <View style={[styles.backColorContainer, {borderColor: themeAheadOfLoading.lightColor}]}>

            <View style={styles.section}>
                <View style={styles.subTitleRow}> 
                    <Text style={[styles.modalSubTitle, themeStyles.genericText]}>SETTINGS</Text>
                </View> 
                <ModalEffortAndPriority mountingSettings={friendDashboardData[0].suggestion_settings} />
            </View>

            <View style={[styles.divider, { borderBottomColor: themeStyles.modalText.color}]}></View>
            
            <View style={styles.section}>
                <View style={styles.subTitleRow}> 
                    <Text style={[styles.modalSubTitle, themeStyles.genericText]}>THEME</Text>
                </View> 
                <ModalColorTheme /> 
              </View>
            
            <View style={[styles.divider, { borderBottomColor: themeStyles.modalText.color}]}></View>
           
            <View style={styles.section}>
                <View style={styles.subTitleRow}> 
                    <Text style={[styles.modalSubTitle, themeStyles.modalText]}>ADDRESSES</Text>
                </View>
                <Text style={themeStyles.genericText}></Text>
            </View>

            <View style={[styles.divider, { borderBottomColor: themeStyles.modalText.color}]}></View>
            
            <View style={styles.section}>
                <View style={styles.subTitleRow}> 
                    <Text style={[styles.modalSubTitle, themeStyles.dangerZoneText]}>DANGER ZONE</Text>
                </View>

                <TouchableOpacity onPress={openDoubleChecker}>
                <Text style={[styles.rowText, themeStyles.dangerZoneText]}>Delete</Text>
                </TouchableOpacity>
            </View>

        </View>

        {isDoubleCheckerVisible && (
          <DoubleChecker
            isVisible={isDoubleCheckerVisible}
            toggleVisible={toggleDoubleChecker}
            singleQuestionText={`Delete ${friendName}?`}
            onPress={() => handleDelete()}
          />
        )}
     
        </>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,    
    width: '100%', 
  },
  subTitleRow: {
    flexDirection: 'row',  
    marginBottom: 20,  
  },
  section: { 
    flex: 1,
     
    width: '100%', 
    justifyContent: 'flex-start',
    paddingHorizontal: '2%',
    paddingVertical: '3%',
},
rowText: {
  fontWeight: 'bold',
  fontSize: 16,
  lineHeight: 21,
},
modalSubTitle: {
    fontSize: 19,
    fontFamily: 'Poppins-Regular',  
  }, 
divider: { 
    borderBottomWidth: .8,  
}, 
  friendNameText: {
    fontSize: 28,
    fontFamily: 'Poppins-Regular',

  },
  headerText: {
    fontSize: 20,
    marginTop: 0,
    fontFamily: 'Poppins-Regular',

  }, 
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },  
  buttonContainer: { 
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 0,  
    paddingTop: 0, 
    paddingBottom: 14,
    
  },
 
backColorContainer: {  
  flex: 1,
  paddingHorizontal: '2%', 
  paddingTop: '10%', 
  width: '101%',
  alignSelf: 'center', 
  flexDirection: 'column',
  justifyContent: 'flex-start',
},  

});
export default ScreenFriendSettings;
