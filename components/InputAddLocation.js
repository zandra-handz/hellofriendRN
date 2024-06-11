import React from 'react';
import FormLocationCreate from '../forms/FormLocationCreate'; // Import the location creation form component

const InputAddLocation = ({ onClose }) => {
  return (
    <FormLocationCreate onLocationCreate={onClose} />
  );
};

export default InputAddLocation;
