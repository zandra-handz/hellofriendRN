import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'; // Import FontAwesome5 for the close button
import ActionPageBase from './ActionPageBase'; // Import the ActionPageBase component

const ActionPageInfo = ({ visible, onClose }) => {
  const sections = [
    {
      title: 'Info',
      content: (
        <View>
          {/* Add your info content here */}
          <Text>Information goes here...</Text>
        </View>
      ),
    },
  ];

  return (
    <ActionPageBase visible={visible} onClose={onClose} sections={sections} showFooter={true} footerContent="© badrainbowz 2024">
      {/* No additional content needed here */}
    </ActionPageBase>
  );
};

export default ActionPageInfo;
