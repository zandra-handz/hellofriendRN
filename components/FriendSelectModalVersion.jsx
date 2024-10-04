import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

import AlertList from '../components/AlertList';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useFriendList } from '../context/FriendListContext';
import ProfileTwoUsersSvg from '../assets/svgs/profile-two-users.svg';
import LoadingPage from '../components/LoadingPage';
import { LinearGradient } from 'expo-linear-gradient';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import RowItemFriendSelect from '../components/RowItemFriendSelect';
import ButtonToggleSize from '../components/ButtonToggleSize';

const FriendSelectModalVersion = ({ width = '60%' }) => {  
  const { gradientColors } = useGlobalStyle();
  const globalStyles = useGlobalStyle();  
  const { selectedFriend, setFriend, calculatedThemeColors, friendColorTheme, loadingNewFriend } = useSelectedFriend();
  const { friendList } = useFriendList();
  const [isFriendMenuModalVisible, setIsFriendMenuModalVisible] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);  
  const [displayName, setDisplayName] = useState(null); 
  const [refreshButtonColor, setRefreshButtonColor ] = useState('white');

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
    } else {
      if (selectedFriend && selectedFriend.name) {
        setDisplayName(selectedFriend.name);
        
        setRefreshButtonColor('white');
      } else {
        setDisplayName('Select friend');
        setRefreshButtonColor('black');
      }
    }
  }, [selectedFriend, loadingNewFriend]);

  const handleSelectFriend = (itemId) => { 
    const selectedOption = friendList.find(friend => friend.id === itemId);
    const selectedFriend = selectedOption || null;
    setFriend(selectedFriend);
    console.log("Friend selected: ", selectedFriend);
    setForceUpdate(prevState => !prevState);  
    toggleModal();
  };

  return (
    <>
    
      <LinearGradient
        colors={[calculatedThemeColors.darkColor, calculatedThemeColors.lightColor]}  
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}  
        style={[styles.container, { width }]} 
      >  

        <View style={styles.displaySelectedContainer}>
        {loadingNewFriend && (
          <View style={styles.loadingWrapper}>
          <LoadingPage
            loading={loadingNewFriend} 
            spinnnerType='wander'
            spinnerSize={30}
            includeLabel={false} 
          />
          </View>
        )}
        {!loadingNewFriend && ( 
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
            color={calculatedThemeColors.fontColorSecondary}
            style={{
              width: 'auto',  
              height: 35,  
              borderRadius: 20, 
            }}
          />
        </View> 
      </LinearGradient>

      <AlertList
        fixedHeight={true}
        height={700}
        isModalVisible={isFriendMenuModalVisible}
        isFetching={loadingNewFriend}
        useSpinner={true}
        toggleModal={toggleModal}
        headerContent={<Text style={{ fontFamily: 'Poppins-Bold', fontSize: 18 }}>Select friend</Text>}
        content={
          <FlatList
            data={friendList}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity 
                onPress={() => handleSelectFriend(item.id)} 
                style={styles.row}
              >
                <RowItemFriendSelect friend={item} />
              </TouchableOpacity>
            )}
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
    justifyContent: 'flex-end',
    alignItems: 'center', 
    padding: 2,

    borderRadius: 22, 
    borderRadius: 0,
  },
  loadingWrapper: {
    flex: 1,
    paddingRight: 40,
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
  row: { 
    borderRadius: 5,
  },
});

export default FriendSelectModalVersion;
