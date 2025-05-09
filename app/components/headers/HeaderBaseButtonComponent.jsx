import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
 
import { useGlobalStyle } from '@/src/context/GlobalStyleContext';
import { useFriendList} from '@/src/context/FriendListContext';

import ArrowLeftCircleOutline from '@/app/assets/svgs/arrow-left-circle-outline.svg';

import { useNavigation } from '@react-navigation/native';



const HeaderBaseButtonComponent = ({
    headerTitle='Header title here',
    buttonComponent,
    
}) => {
 
    const { themeStyles } = useGlobalStyle(); 
    const { themeAheadOfLoading } = useFriendList();
    const navigation = useNavigation();

    const handleNavigateBack = () => {
        navigation.goBack(); // This will navigate to the previous screen
      };

  return (
    <View style={[styles.headerContainer, themeStyles.headerContainer, {backgroundColor: themeAheadOfLoading.darkColor}]}>
      <View style={{flexDirection: 'row', width: '60%', justifyContent: 'flex-start', alignContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity onPress={handleNavigateBack}>
        <ArrowLeftCircleOutline height={30} width={30}   color={themeAheadOfLoading.fontColor}/>

        </TouchableOpacity> 
        <Text 
  style={[
    styles.headerText, 
    themeStyles.headerText, 
    {
        color: themeAheadOfLoading.fontColor, 
        paddingLeft: 20, 
    }
  ]}
>
  {headerTitle}
  
</Text> 

      </View> 
      
      {buttonComponent}
         
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    padding: 10,
    paddingTop: 66, //FOR TEST BUILD: 12 For dev: 66
    paddingHorizontal: 10, 
    alignItems: 'center',  
    justifyContent: 'space-between',
    height: 110,//FOR TEST BUILD: 60 (or 56?) //For dev: 110
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
});

export default HeaderBaseButtonComponent;
