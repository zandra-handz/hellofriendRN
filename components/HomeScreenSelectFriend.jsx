import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
import AlertList from '../components/AlertList'; 
import { FlashList } from '@shopify/flash-list';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useFriendList } from '../context/FriendListContext';
import ProfileTwoUsersSvg from '../assets/svgs/profile-two-users.svg';
import LoadingPage from '../components/LoadingPage'; 
import { useGlobalStyle } from '../context/GlobalStyleContext'; 
import ButtonSelectFriend from '../components/ButtonSelectFriend';
import FriendIcon from '../components/FriendIcon'; // Import ProfileCircleSvg


import { Dimensions } from 'react-native';

const HomeScreenSelectFriend = ({ addToPress, color, addToOpenModal, includeLabel=true, iconSize=26, width = '60%' }) => {  
  
  const { themeStyles } = useGlobalStyle();
  const globalStyles = useGlobalStyle();  
  const { selectedFriend, friendLoaded, setFriend, loadingNewFriend } = useSelectedFriend();
  const { friendList, themeAheadOfLoading, getThemeAheadOfLoading } = useFriendList();
  const [isFriendMenuModalVisible, setIsFriendMenuModalVisible] = useState(false);
  //const [forceUpdate, setForceUpdate] = useState(false);  

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

 

//kind of aggressive that it tries to refocus every time it toggles whether open or closed
// but android is being a butt about opening the keyboard
  const toggleModal = () => {
    if (addToPress) {
      addToPress(); // Cal
      // l it without any arguments if not needed
    }

    setIsFriendMenuModalVisible(false);

  };

  const openModal = () => {
    if (addToOpenModal) {
      console.log('running add to open modal');
      addToOpenModal();
    }
 

    setIsFriendMenuModalVisible(true);
  };

  const handleSelectFriend = (itemId) => { 
    const selectedOption = friendList.find(friend => friend.id === itemId);
    console.log('S ELE ECCTING FRIEND', selectedOption);
    const selectedFriend = selectedOption || null;
    setFriend(selectedFriend);
    getThemeAheadOfLoading(selectedFriend); 
    //if (addToPress && selectedFriend) {
    //  addToPress(); // Call it without any arguments if not needed
   // }
    //setForceUpdate(prevState => !prevState);  
    toggleModal(); 
  
  };
 

  const handleSelectFriendSearch = (item) => { 
    const selectedOption = friendList.find(friend => friend === item);
    const selectedFriend = selectedOption || null;
    setFriend(selectedFriend);
    getThemeAheadOfLoading(selectedFriend); 
    //setForceUpdate(prevState => !prevState);  

    toggleModal();
  };

  return (
    <>
    
      <View
        style={[styles.container, { width }]} 
      >  

        <View style={styles.displaySelectedContainer}>
        {loadingNewFriend && (
          <View style={styles.loadingWrapper}>
          <LoadingPage
            loading={loadingNewFriend} 
            spinnerType='flow'
            spinnerSize={30}
            color={themeAheadOfLoading.darkColor}
            includeLabel={false} 
          />
          </View>
        )}
        {!loadingNewFriend && includeLabel && ( 
       
        <Text
          style={[styles.friendText, themeStyles.genericText]}
          numberOfLines={1}  
          ellipsizeMode='tail'  
        >
          {`For: `}
        </Text> 
        )}
  
          <TouchableOpacity
            onPress={openModal}
            accessible={true}
            accessibilityRole='button'
            accessibilityLabel='Friend selector button'
            >
              <View style={{ paddingHorizontal: '0%'}}>
                <FriendIcon  />
                {/* <ProfileTwoUsersSvg 
                  height={iconSize} 
                  width={iconSize} 
                  color={loadingNewFriend? 'transparent' : color || themeAheadOfLoading.fontColorSecondary}
                  />
             */}

              </View>

          </TouchableOpacity>
          
          </View>
 
        </View>  
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
    flex: 1,
    height: 'auto',
    maxHeight: 40,
    justifyContent: 'flex-end',
    alignItems: 'center', 
    alignContent: 'center',
    padding: 2,
    //backgroundColor: 'pink',
    
    

    borderRadius: 0, 
  },
  loadingWrapper: {  
    paddingRight: '14%',
  },
  displaySelectedContainer: {
    alignItems: 'flex-end', 
    flexDirection: 'row',
    flex: 1,
    width: '100%', 
    backgroundColor: 'orange',  
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
  friendText: {
    fontFamily: 'Poppins-Regular',
  alignSelf: 'center',
    fontSize: 16,

  },
  row: { 
    borderRadius: 5,
  },
  listContent: { 
  },
});

export default HomeScreenSelectFriend;
