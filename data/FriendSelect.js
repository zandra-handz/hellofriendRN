import React, { useState } from 'react';
import SelectMenu from '../components/SelectMenu';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useFriendList } from '../context/FriendListContext';

const FriendSelect = () => {
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

  return <SelectMenu key={forceUpdate} options={options} onSelect={handleSelectFriend} text={selectedFriend ? selectedFriend.name : "Select a friend"} />;
};

export default FriendSelect;
