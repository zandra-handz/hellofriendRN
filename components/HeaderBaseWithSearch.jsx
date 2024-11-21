import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
 
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useFriendList } from '../context/FriendListContext';

import ArrowLeftCircleOutline from '../assets/svgs/arrow-left-circle-outline.svg';

import { useNavigation } from '@react-navigation/native';
import SearchBar from '../components/SearchBar';



const HeaderBaseWithSearch = ({
    headerTitle='Header title here',
    componentData,
    onPress,
    dataFieldToSearch, 
}) => {
 
    const { themeStyles } = useGlobalStyle();
    const { themeAheadOfLoading } = useFriendList();
    const navigation = useNavigation();

    const handleNavigateBack = () => {
        navigation.goBack(); // This will navigate to the previous screen
      };

  return (
    <View style={[styles.headerContainer, themeStyles.headerContainerNoBorder, {backgroundColor: themeAheadOfLoading.darkColor}]}>
      <View style={{flexDirection: 'row', width: '60%', justifyContent: 'flex-start', alignContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity onPress={handleNavigateBack}>
            <ArrowLeftCircleOutline height={30} width={30} color={themeAheadOfLoading.fontColor}/>
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
      <View style={{width: '40%', zIndex: 10, flexDirection: 'row', alignContent: 'center', alignItems: 'center', height: 'auto' }}>
      
      <SearchBar data={componentData ? componentData : []} onPress={onPress} searchKeys={dataFieldToSearch} />
      </View> 
      
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: { 
    flexDirection: 'row', 
    overflow: 'visible',
    padding: 10,
    paddingTop: 66, //FOR TEST BUILD: 12 For dev: 66
    paddingHorizontal: 10, 
    alignItems: 'center',  
    justifyContent: 'space-between',
    height: 110,//FOR TEST BUILD: 60 (or 56?) //For dev: 110
    zIndex: 10,

  },
  headerText: {
    fontSize: 18,
    paddingVertical: 2, 
    fontFamily: 'Poppins-Bold',
  },  
});

export default HeaderBaseWithSearch;
