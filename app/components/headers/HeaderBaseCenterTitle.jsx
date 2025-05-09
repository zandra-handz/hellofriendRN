import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { useGlobalStyle } from '@/src/context/GlobalStyleContext';
import { useSelectedFriend } from '@/src/context/SelectedFriendContext';
import { useFriendList } from '@/src/context/FriendListContext';
import LizardSvg from '@/app/assets/svgs/lizard.svg';
import ArrowLeftCircleOutline from '@/app/assets/svgs/arrow-left-circle-outline.svg';

import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import LoadingPage from '../LoadingPage';

const HeaderBaseCenterTitle = ({
    headerTitle='Header title here',
    rightIcon='info',
    rightIconOnPress,
    navigateTo='Moments',
    strOfSvg,
}) => {
    const { themeStyles } = useGlobalStyle();
    const { themeAheadOfLoading } = useFriendList();
    const { calculatedThemeColors, loadingNewFriend, friendColorTheme } = useSelectedFriend();
    const navigation = useNavigation();

    const handleNavigateBack = () => {
        navigation.goBack();
      };

    const handleNavigate = () => {
        navigation.navigate(navigateTo);
      };

    return (
        <>
          <LinearGradient
            colors={[friendColorTheme?.useFriendColorTheme ? themeAheadOfLoading.darkColor : '#4caf50', friendColorTheme?.useFriendColorTheme  ? themeAheadOfLoading.lightColor : 'rgb(160, 241, 67)']}  
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}  
            style={styles.headerContainer} 
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
              <View style={styles.headerContent}>
                <View style={styles.leftButtonContainer}>
                  <TouchableOpacity onPress={handleNavigateBack}>
                    <ArrowLeftCircleOutline height={30} width={30} color={calculatedThemeColors.fontColor} />
                  </TouchableOpacity>
                </View>
                
                <Text style={[styles.headerText, themeStyles.headerText, { color: calculatedThemeColors.secondaryFontColor }]}>
                  {headerTitle}
                </Text>
                
                <View style={styles.rightIconContainer}>
                  {strOfSvg ? (
                    <TouchableOpacity onPress={handleNavigate}>
                      {React.createElement(strOfSvg, { width: 30, height: 30, color: calculatedThemeColors.fontColor })}
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.defaultIconWrapper}>
                      <LizardSvg width={74} height={74} color={calculatedThemeColors.fontColor} style={styles.defaultIcon} />
                    </View>
                  )}
                </View>
              </View>
            )}
          </LinearGradient>
        </>
    );
};

const styles = StyleSheet.create({
  headerContainer: {
    padding: 10,
    paddingTop: 66,  
    paddingHorizontal: 10, 
    height: 110, 
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftButtonContainer: {
    width: 40,  // Fixed width to keep it from moving
  },
  headerText: {
    flex: 1,  // Takes remaining space
    fontSize: 20,
    paddingVertical: 2, 
    fontFamily: 'Poppins-Regular',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginHorizontal: 10,
  },
  rightIconContainer: {
    width: 40,
    alignItems: 'center',
  },
  defaultIconWrapper: {
    height: 44,
    width: 90,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  defaultIcon: {
    transform: [{ rotate: '240deg' }],
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HeaderBaseCenterTitle;
