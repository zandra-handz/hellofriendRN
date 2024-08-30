import React from 'react';
import { View, Text  } from 'react-native';
 
import ActionPageBase from './ActionPageBase';  

const ActionPageInfo = ({ visible, onClose }) => {
  const sections = [
    {
      title: 'Info',
      content: (
        <View> 
          <Text>Coming soon</Text>
        </View>
      ),
    },
  ];

  return (
    <ActionPageBase visible={visible} onClose={onClose} sections={sections} showFooter={true} footerContent="© badrainbowz 2024">
    
    </ActionPageBase>
  );
};

export default ActionPageInfo;
