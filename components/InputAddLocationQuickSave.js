import React from 'react'; 
import FormLocationQuickCreate from '../forms/FormLocationQuickCreate'; // Import the location creation form component

const InputAddLocationQuickSave = ({ onClose, title, address }) => {
  return (
    <FormLocationQuickCreate onLocationCreate={onClose} title={title} address={address} />
  );
};

export default InputAddLocationQuickSave;