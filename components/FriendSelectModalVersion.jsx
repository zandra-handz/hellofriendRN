import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';

import SelectMenu from '../components/SelectMenu';
import Button from '../components/Button'; // Import your Button component
import AlertList from '../components/AlertList';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useFriendList } from '../context/FriendListContext';
import RowItemFriendSelect from '../components/RowItemFriendSelect';
import ButtonToggleSize from '../components/ButtonToggleSize';
import LoadingPage from '../components/LoadingPage';

const FriendSelectModalVersion = () => {
  const { selectedFriend, setFriend, loadingNewFriend } = useSelectedFriend();
  const { friendList } = useFriendList();
  const [isFriendMenuModalVisible, setIsFriendMenuModalVisible] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false); // State to force re-render
  const [displayName, setDisplayName] = useState(null);

  const friendTotal = (friendList ? friendList.length : 0);

  const toggleModal = () => {
    setIsFriendMenuModalVisible(!isFriendMenuModalVisible);
  };

  useEffect(() => {
    if (selectedFriend && selectedFriend.name) {
        setDisplayName(selectedFriend.name);
    } else {
        setDisplayName('No friend selected');
    };
  }, [selectedFriend]);

  const handleSelectFriend = (itemId) => {
    // Find the friend item by id
    const selectedOption = friendList.find(friend => friend.id === itemId);
    const selectedFriend = selectedOption || null;
    setFriend(selectedFriend);
    console.log("Friend selected: ", selectedFriend);
    setForceUpdate(prevState => !prevState); // Toggle forceUpdate to trigger re-render
  };

  return (
    <>
      <ButtonToggleSize
        title={'title'}
        onPress={toggleModal}
        iconName="list" 
        style={{
          backgroundColor: '#e63946',  
          width: 70,  
          height: 35,  
          borderRadius: 20, 
        }}
      />

      <AlertList
        fixedHeight={true}
        height={700}
        isModalVisible={isFriendMenuModalVisible}
        isFetching={loadingNewFriend}
        useSpinner={true}
        toggleModal={toggleModal}
        headerContent={<Text style={{fontFamily: 'Poppins-Bold', fontSize: 18}}>Friends ({friendTotal}/20)</Text>}
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
        cancelText="Done"
      />
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    padding: 0,
    marginBottom: 0, 
    borderRadius: 5,
  },
});

export default FriendSelectModalVersion;
