import React from 'react';
import { View, StyleSheet, Text } from 'react-native'; 

const MessagePage = ({
  message = 'Nothing here',  
  fontSize = 20,
  primaryColor='orange',

}) => {
 

  return (
    <View style={[styles.container]}>
      <View style={[styles.textContainer]}>
        <Text style={[styles.messageText,  { color: primaryColor, fontSize: fontSize }]}>
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
