import React, { useState } from 'react';
import SelectMenu from '../components/SelectMenu';
import Button from '../components/Button'; // Import your Button component
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useFriendList } from '../context/FriendListContext';

const FriendSelect = ({ interfaceType = 'dropdown' }) => {
  const { selectedFriend, setFriend } = useSelectedFriend();
  const { friendList } = useFriendList(); 
  const [forceUpdate, setForceUpdate] = useState(false); // State to force re-render

  const options = [{ id: null, name: "View All" }, ...friendList];

  const handleSelectFriend = (selectedOption) => {
    const selectedFriend = selectedOption.id === null ? null : selectedOption;
    setFriend(selectedFriend);
    console.log("Friend selected: ", selectedFriend);
    setForceUpdate(prevState => !prevState); // Toggle forceUpdate to trigger re-render
  };

  return (
    <>
      {interfaceType === 'dropdown' ? (
        <SelectMenu key={forceUpdate} options={options} onSelect={handleSelectFriend} text={selectedFriend ? selectedFriend.name : "Select a friend"} />
      ) : (
        <Button onPress={() => console.log('Change Friend button pressed!')}>
          Change Friend
        </Button>
      )}
    </>
  );
};

export default FriendSelect;
