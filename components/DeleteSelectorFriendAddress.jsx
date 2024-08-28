import React from 'react';
import { useAuthUser } from '../context/AuthUserContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import SelectorAddressBase from '../components/SelectorAddressBase';

const SelectorFriendAddress = ({ onAddressSelect }) => {
  const { authUserState } = useAuthUser();
  const { selectedFriend, friendDashboardData } = useSelectedFriend();
  
  return (
    <SelectorAddressBase
      addresses={friendDashboardData[0].friend_addresses}
      onAddressSelect={onAddressSelect}
      contextTitle="Friend's starting point"
    />
  );
};

export default SelectorFriendAddress;
