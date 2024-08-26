import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

import AlertList from '../components/AlertList';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useFriendList } from '../context/FriendListContext';

import { LinearGradient } from 'expo-linear-gradient';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import RowItemFriendSelect from '../components/RowItemFriendSelect';
import ButtonToggleSize from '../components/ButtonToggleSize';

const FriendSelectModalVersion = ({ width = '60%' }) => { // Use destructuring to get props
  const { gradientColors } = useGlobalStyle();
  const globalStyles = useGlobalStyle(); 
  const { darkColor, lightColor } = gradientColors;
  const { selectedFriend, setFriend, friendColorTheme, loadingNewFriend } = useSelectedFriend();
  const { friendList } = useFriendList();
  const [isFriendMenuModalVisible, setIsFriendMenuModalVisible] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false); // State to force re-render
  const [displayName, setDisplayName] = useState(null);
  const [friendLightColor, setFriendLightColor] = useState('white');
  const [friendDarkColor, setFriendDarkColor] = useState('white');
  const [refreshButtonColor, setRefreshButtonColor ] = useState('white');

  const adjustFontSize = (fontSize) => {
    return globalStyles.fontSize === 20 ? fontSize + 2 : fontSize;
  };

  const textStyles = (fontSize, color) => ({
    fontSize: adjustFontSize(fontSize),
    color,
    ...(globalStyles.highContrast && {
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 1,
    }),
  });

  useEffect(() => {
    if (friendColorTheme && friendColorTheme.useFriendColorTheme !== false) {
      if (friendColorTheme.invertGradient) {
        setFriendLightColor(friendColorTheme.darkColor || darkColor);
        setFriendDarkColor(friendColorTheme.lightColor || lightColor);
      } else {
        setFriendLightColor(friendColorTheme.lightColor || darkColor);
        setFriendDarkColor(friendColorTheme.darkColor || lightColor);
      }
    } else {
      setFriendLightColor(lightColor);
      setFriendDarkColor(darkColor);
    }
  }, [friendColorTheme]);

  const friendTotal = (friendList ? friendList.length : 0);

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
    // Find the friend item by id
    const selectedOption = friendList.find(friend => friend.id === itemId);
    const selectedFriend = selectedOption || null;
    setFriend(selectedFriend);
    console.log("Friend selected: ", selectedFriend);
    setForceUpdate(prevState => !prevState); // Toggle forceUpdate to trigger re-render
    toggleModal();
  };

  return (
    <>
      <LinearGradient
        colors={[friendDarkColor, friendLightColor]} // Gradient colors
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }} // Direction of the gradient
        style={[styles.container, { width }]} // Apply width here
      >  
        <View style={styles.displaySelectedContainer}>
          <Text style={[styles.displaySelected, textStyles(18, 'white')]}>
            {displayName}
          </Text>
        </View>
        <View style={styles.selectorButtonContainer}>
          <ButtonToggleSize
            title={''}
            onPress={toggleModal}
            iconName="refresh" 
            backgroundColor={'transparent'}
            color={refreshButtonColor}
            style={{
              width: 70,  
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
        headerContent={<Text style={{ fontFamily: 'Poppins-Bold', fontSize: 18 }}>{displayName}</Text>}
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
    height: 'auto',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 6,
    paddingHorizontal: 10,
    borderRadius: 20, 
  },
  displaySelectedContainer: {
    alignItems: 'left',   
    flex: 1,
  },
  displaySelected: {
    color: 'black',
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    zIndex: 2,
  },
  selectorButtonContainer: {
    alignItems: 'flex-end',
    flex: 0.4, 
  },
  row: {
    padding: 0,
    marginBottom: 0, 
    borderRadius: 5,
  },
});

export default FriendSelectModalVersion;
