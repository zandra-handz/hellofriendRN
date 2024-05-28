// InputFilterByFriend.js
// Uses AlertSmall.js

import React from 'react';
import { View, TextInput, Button } from 'react-native';

const InputFilterByFriend = ({ onClose }) => {
  return (
    <View>
      {/* Add your filter form fields here */}
      <Button title="Apply Filters" onPress={onClose} />
    </View>
  );
};

export default InputFilterByFriend;
