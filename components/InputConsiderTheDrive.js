// InputConsiderTheDrive.js
// Uses AlertSmall.js

import React from 'react';
import { View, TextInput, Button } from 'react-native';

const InputConsiderTheDrive = ({ onClose }) => {
  return (
    <View>
      {/* Add your route form fields here */}
      <Button title="Get Route" onPress={onClose} />
    </View>
  );
};

export default InputConsiderTheDrive;
