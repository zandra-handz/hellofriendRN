import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useGlobalStyle } from '@/src/context/GlobalStyleContext';

const MessagePage = ({
  message = 'Nothing here',  
  fontSize = 20,
}) => {

  const {themeStyles } = useGlobalStyle();

  return (
    <View style={[styles.container, themeStyles.genericTextBackground]}>
      <View style={[styles.textContainer]}>
        <Text style={[styles.messageText, themeStyles.genericText, { fontSize }]}>
          {message}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    fontFamily: 'Poppins-Bold', 
    textAlign: 'center',
  },
});

export default MessagePage;
