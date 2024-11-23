import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useMessage } from '../context/MessageContext';
import { useLocationFunctions } from '../hooks/useLocationFunctions';

//simple temporary popup message to let user know if action was successful
//does not affect flow of app
//I'm not super in love with this approach but it will be useful
//and speed along development

//...except then i threw it in a context which i'm also not sure of/might change
// now this is just a UI for the message context, nothing gets passed into this
//BUT it is responsible for nulling out the message after the animation finishes


const ResultMessage = ({   
  delay = 0,  
  resultsDisplayDuration = 1000, // Duration to show results message (default 3 seconds)
  messageDelay = 0, // Delay before the message appears (2 seconds)
}) => { 
  const [showResultsMessage, setShowResultsMessage] = useState(false); // State for showing results message
  const { messageData, hideMessage } = useMessage();
  const { themeStyles } = useGlobalStyle();
 


  // Create animated values for the container's opacity
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let timeout;
    let resultsTimeout;

    timeout = setTimeout(() => { 
      if (messageData.result) { 
        setShowResultsMessage(true);

        // Fade in the container after the delay
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();

        resultsTimeout = setTimeout(() => { 
          // Fade out the container after the message display duration
          Animated.timing(opacity, {
            toValue: 0,
            duration: 700,
            useNativeDriver: true,
          }).start(() => endAnimation()); // Hide the message after animation
        }, resultsDisplayDuration);
      }
    }, messageDelay); // Wait for the specified delay before showing the message

    return () => {
      clearTimeout(timeout);
      clearTimeout(resultsTimeout);
    };
  }, [messageDelay, delay, messageData, resultsDisplayDuration, opacity]);

  const endAnimation = () => {
    setShowResultsMessage(false);
    hideMessage();
  };

  if (!showResultsMessage) return null; 

  return (
    <View style={styles.container}> 
      {showResultsMessage && (
        <Animated.View
          style={[ 
            styles.textContainer, themeStyles.genericTextBackgroundShadeTwo,
            {
              opacity: opacity,   // Animate opacity of the container
            },
          ]}
        >
          <Text style={[styles.loadingTextBold, themeStyles.genericText]}>
            {messageData.resultsMessage}
          </Text>
        </Animated.View>
      )} 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40, // Centers vertically
    left: 0, // Centers horizontally
    //transform: [{ translateX: '-50%' }, { translateY: '-50%' }], // Offsets by 50% of the element's width/height
    zIndex: 10,
    width: '100%', // Adjust width as needed
    padding: 10,
    height: 'auto',
    minHeight: '10%',
    maxHeight: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  textContainer: { 
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
    height: '100%',
    alignContent: 'center',
    borderRadius: 20,
  }, 
  loadingTextBold: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    paddingBottom: 0,
  },
});

export default ResultMessage;
