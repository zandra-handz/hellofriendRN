import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet,  TouchableOpacity } from 'react-native'; 
import AlertList from '../components/AlertList'; 
import { FlashList } from '@shopify/flash-list';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useFriendList } from '../context/FriendListContext';
import ProfileTwoUsersSvg from '../assets/svgs/profile-two-users.svg';
import LoadingPage from '../components/LoadingPage';
import { LinearGradient } from 'expo-linear-gradient';
import { useGlobalStyle } from '../context/GlobalStyleContext'; 
import ButtonSelectFriend from '../components/ButtonSelectFriend';
import ButtonToggleSize from '../components/ButtonToggleSize';

import { Dimensions } from 'react-native';

const FriendSelectModalVersion = ({ includeLabel=true, includeBackground=true, width = '60%' }) => {  
  const { themeStyles, gradientColors } = useGlobalStyle();
  const globalStyles = useGlobalStyle();  
  const { selectedFriend, setFriend, calculatedThemeColors, friendColorTheme, loadingNewFriend } = useSelectedFriend();
  const { friendList, getThemeAheadOfLoading, themeAheadOfLoading } = useFriendList();
  const [isFriendMenuModalVisible, setIsFriendMenuModalVisible] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);  
  const [displayName, setDisplayName] = useState(null); 
  const [refreshButtonColor, setRefreshButtonColor ] = useState('white');
  const [gradientColorOne, setGradientColorOne ] = useState(calculatedThemeColors.darkColor);
  const [gradientColorTwo, setGradientColorTwo ] = useState(calculatedThemeColors.lightColor);
  

  const adjustFontSize = (fontSize) => {
    return globalStyles.fontSize === 20 ? fontSize + 2 : fontSize;
  };

  const textStyles = (fontSize, color) => ({
    fontSize: adjustFontSize(fontSize),
    color,
    ...(globalStyles.highContrast && {
      textShadowColor: 'rgba(0, 0, 0, 0.0)',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 0,
    }),
  });

 


  const toggleModal = () => {
    setIsFriendMenuModalVisible(!isFriendMenuModalVisible);
  };

  useEffect(() => {
    if (loadingNewFriend) {
      setDisplayName('Loading friend...');
      
      setRefreshButtonColor('white');
      setGradientColorOne(themeAheadOfLoading.darkColor);
      setGradientColorTwo(themeAheadOfLoading.lightColor);

    } else {
      if (selectedFriend && selectedFriend.name) {
        setDisplayName(selectedFriend.name);
        
        setRefreshButtonColor('white');
      } else {
        setDisplayName('Select friend');
        setRefreshButtonColor('black');
      }
      setGradientColorOne(calculatedThemeColors.darkColor);
      setGradientColorTwo(calculatedThemeColors.lightColor);
    }
  }, [selectedFriend, loadingNewFriend]);

  const handleSelectFriend = (itemId) => { 
    const selectedOption = friendList.find(friend => friend.id === itemId);
    const selectedFriend = selectedOption || null;
    setFriend(selectedFriend);
    getThemeAheadOfLoading(selectedFriend);
    console.log("Friend selected: ", selectedFriend);
    setForceUpdate(prevState => !prevState);  
    toggleModal();
  };

  const handleSelectFriendSearch = (item) => { 
    const selectedOption = friendList.find(friend => friend === item);
    const selectedFriend = selectedOption || null;
    setFriend(selectedFriend);
    getThemeAheadOfLoading(selectedFriend);
    console.log("Friend selected: ", selectedFriend);
    setForceUpdate(prevState => !prevState);  
    toggleModal();
  };
  return (
    <>
    
      <LinearGradient
        colors={[gradientColorOne, gradientColorTwo]}  
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}  
        style={[styles.container, { width }]} 
      >  

        <View style={styles.displaySelectedContainer}>
        {loadingNewFriend && (
          <View style={styles.loadingWrapper}>
          <LoadingPage
            loading={loadingNewFriend} 
            spinnerType='flow'
            spinnerSize={30}
            color={gradientColorOne}
            includeLabel={false} 
          />
          </View>
        )}
 
        {!loadingNewFriend && includeLabel && ( 
        <Text
          style={[styles.displaySelected, textStyles(17, calculatedThemeColors.fontColorSecondary)]}
          numberOfLines={1}  
          ellipsizeMode='tail'  
        >
          {displayName}
        </Text>
        )}

        </View>
       
           
        <View style={styles.selectorButtonContainer}> 
          <ButtonToggleSize
            title={''}
            onPress={toggleModal}
            iconName="user" 
            useSvg={true}
            Svg={ProfileTwoUsersSvg}
            backgroundColor={'transparent'}
            color={loadingNewFriend? 'transparent' : calculatedThemeColors.fontColorSecondary}
            style={{
              width: 'auto',  
              height: 35,  
              borderRadius: 20, 
            }}
          /> 
        </View>  
      </LinearGradient>

      <AlertList 
        includeBottomButtons={false}
        isModalVisible={isFriendMenuModalVisible}
        isFetching={loadingNewFriend}
        useSpinner={true}
        questionText={'Switch friend'}
        toggleModal={toggleModal}
        headerContent={<ProfileTwoUsersSvg width={42} height={42} color={themeStyles.modalIconColor.color} />}
        includeSearch={true}
        searchData={friendList}
        searchField={['name']}
        searchOnPress={handleSelectFriendSearch}
        content={ 
          <FlashList
          data={friendList}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity 
              onPress={() => handleSelectFriend(item.id)} 
              style={styles.friendContainer}  // Adjust styles accordingly
            >
              <ButtonSelectFriend friend={item} />
            </TouchableOpacity>
          )}
          numColumns={3} 
          estimatedItemSize={100}  
          contentContainerStyle={styles.listContent}  
          showsVerticalScrollIndicator={false} 
          // Optional: Add styling for the content container
        /> 
        
        }
        onCancel={toggleModal}
        confirmText="Reset All"
        cancelText="Back"
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', 
    height: 40,
    minHeight: 40,
    maxHeight: 40,
    justifyContent: 'flex-end',
    alignItems: 'center', 
    padding: 2,

    borderRadius: 0, 
  },
  loadingWrapper: {
    flex: 1,  
    justifyContent: 'center',
    alignItems: 'center',
  },
  displaySelectedContainer: {
    alignItems: 'flex-end',
    width: '100%',   
    flex: 1,
  },
  displaySelected: {
    color: 'black',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    zIndex: 2,
  },
  selectorButtonContainer: {
    alignItems: 'flex-end',  
     
  },
  friendContainer: {
    flex: 1,  // Make sure it takes up the full available space per column
    margin: 4,  // Optional: Adjust margin to control space around each item
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: Dimensions.get('window').width / 3 - 20,  // Divide by 3 to spread items evenly
  },
  row: { 
    borderRadius: 5,
  },
  listContent: { 
  },
});

export default FriendSelectModalVersion;
