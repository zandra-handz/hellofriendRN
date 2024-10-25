import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import ArrowLeftCircleOutline from '../assets/svgs/arrow-left-circle-outline.svg';
import InfoOutlineSvg from '../assets/svgs/info-outline.svg';
import { useNavigation } from '@react-navigation/native';
import LoadingPage from '../components/LoadingPage';
import { useFriendList } from '../context/FriendListContext';
import { LinearGradient } from 'expo-linear-gradient';
import ThoughtBubbleOutlineSvg from '../assets/svgs/thought-bubble-outline.svg'; // Import the SVG


 

const HeaderWriteMoment = () => {
    const { themeStyles } = useGlobalStyle();
    const { calculatedThemeColors, loadingNewFriend, friendColorTheme } = useSelectedFriend();
    const { themeAheadOfLoading } = useFriendList();
    const navigation = useNavigation();

    const handleNavigateBack = () => {
        navigation.goBack();  
      };

  return (
    <> 
    
    <LinearGradient
        colors={[friendColorTheme?.useFriendColorTheme ? themeAheadOfLoading.darkColor : '#4caf50', friendColorTheme?.useFriendColorTheme  ? themeAheadOfLoading.lightColor : 'rgb(160, 241, 67)']}  
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}  
        style={[styles.headerContainer]} 
      >  
      {loadingNewFriend && themeAheadOfLoading && (
          <View style={[styles.loadingWrapper, {backgroundColor: themeAheadOfLoading.darkColor}]}>
          <LoadingPage 
            loading={loadingNewFriend} 
            spinnerType='flow'
            color={themeAheadOfLoading.lightColor}
            includeLabel={false} 
          />
          </View>
      )}
      {!loadingNewFriend && (
      <>
      <View style={{flexDirection: 'row', width: '50%', justifyContent: 'flex-start', alignContent: 'center', alignItems: 'center'}}>
        
        <>
        <TouchableOpacity onPress={handleNavigateBack}>
          <ArrowLeftCircleOutline height={30} width={30} color={calculatedThemeColors.fontColor}/>

        </TouchableOpacity> 
       
      </>
       
      </View> 
      <Text style={[styles.headerText, themeStyles.headerText, {color: calculatedThemeColors.secondaryFontColor, paddingRight: 0}]}>ADD MOMENT</Text>
       <View>
       <TouchableOpacity onPress={() => {}}>
       <ThoughtBubbleOutlineSvg height={30} width={30} fill={calculatedThemeColors.secondaryFontColor}/>
       </TouchableOpacity> 

       </View> 
      </>
      )}
    </LinearGradient> 
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    padding: 10,
    paddingTop: 66,  
    paddingHorizontal: 10, 
    alignItems: 'center',  
    justifyContent: 'space-between',
    height: 110, 
    
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
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HeaderWriteMoment;
