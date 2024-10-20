import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
 
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useFriendList } from '../context/FriendListContext';
import ArrowLeftCircleOutline from '../assets/svgs/arrow-left-circle-outline.svg';
import InfoOutline from '../assets/svgs/info-outline.svg';
import LoadingPage from '../components/LoadingPage';

//onBackPress function instead of stack navigation, to use with modals

const HeaderBaseItemView = ({
    onBackPress,
    headerTitle='Header title here',
    
    rightIcon='info',
    rightIconOnPress,
}) => {

    const { themeAheadOfLoading } = useFriendList();
 
    const { themeStyles } = useGlobalStyle();
    const { calculatedThemeColors, loadingNewFriend } = useSelectedFriend();


   

  return (
    <> 
        <View style={[styles.headerContainer, themeStyles.headerContainer, {backgroundColor: loadingNewFriend ? themeAheadOfLoading.darkColor : calculatedThemeColors.darkColor}]}>
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
      <View style={{flexDirection: 'row', width: '60%', justifyContent: 'flex-start', alignContent: 'center', alignItems: 'center'}}>
        
        
        <TouchableOpacity onPress={onBackPress}>
          <ArrowLeftCircleOutline height={30} width={30}   color={calculatedThemeColors.fontColor}/>
        </TouchableOpacity> 
        <Text style={[
          styles.headerText, themeStyles.headerText, { color: calculatedThemeColors.fontColor, paddingLeft: 20}
          ]}> 
            {headerTitle}
        </Text> 
      </View> 
        <InfoOutline height={30} width={30} color={calculatedThemeColors.fontColor}/>
    </>
    )}
    </View> 
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
    fontSize: 18,
    paddingVertical: 2, 
    fontFamily: 'Poppins-Bold',
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

export default HeaderBaseItemView;
