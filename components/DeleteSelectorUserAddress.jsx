import React from 'react';
import { useAuthUser } from '../context/AuthUserContext';
import SelectorAddressBase from '../components/SelectorAddressBase';

const SelectorUserAddress = ({ onAddressSelect }) => {
  const { authUserState } = useAuthUser();
  
  return (
    <SelectorAddressBase
      addresses={authUserState.user.addresses}
      onAddressSelect={onAddressSelect}
      contextTitle="My Address"
    />
  );
};

export default SelectorUserAddress;
