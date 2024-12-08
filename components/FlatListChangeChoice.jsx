import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useFriendList } from '../context/FriendListContext';

// Forwarding ref to the parent to expose the TextInput value
const FlatListChangeChoice = forwardRef(({ title = 'title', horizontal = true, choicesArray, oldChoice = '', onChoiceChange }, ref) => {
  const { themeStyles } = useGlobalStyle();
  const { themeAheadOfLoading } = useFriendList();
  const [newChoice, setNewChoice] = useState(oldChoice); // Use the starting text passed as prop
  const choiceRef = useRef();


  useEffect(() => { 
    if (choiceRef.current) {
      choiceRef.current.setNativeProps({ text: oldChoice });
      setNewChoice(oldChoice);
    }
  }, []);

  // Expose the current value of the TextInput via the ref
  useImperativeHandle(ref, () => ({
    setText: (text) => {
      if (choiceRef.current) {
        choiceRef.current.setNativeProps({ text });
        setNewChoice(text); 
      }
    }, 
    clearText: () => {
      if (choiceRef.current) {
        choiceRef.current.clear();
        setNewChoice(''); 
      }
    },
    getText: () => newChoice,
  }));
 

  useEffect(() => {
    setNewChoice(oldChoice); // Reset to starting text if it changes
  }, [oldChoice]);


  const handleChoiceChange = (text) => {
    console.log(text);
    setNewChoice(text);
    onChoiceChange(text);
  }

  return ( 
      <View style={styles.previewContainer}>
        <Text style={[styles.previewTitle, themeStyles.genericText]}>{title}</Text>
        {choicesArray && (
          <FlatList
            data={choicesArray}
            ref={choiceRef}
            horizontal={horizontal}
            keyExtractor={(item, index) => `choice-${index}`}
            renderItem={({ item, index }) => (

              <TouchableOpacity onPress={() => (handleChoiceChange(item))} style={[ styles.itemBox, themeStyles.genericTextBackground, {width: 160, borderWidth: 1, borderColor: item === newChoice ? themeAheadOfLoading.darkColor : themeStyles.genericTextBackground.backgroundColor}]}>
                <Text style={[themeStyles.genericText]}>{item}</Text>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
            scrollIndicatorInsets={{ right: 1 }}
            initialScrollIndex={0}
            decelerationRate="fast"
 
            />
            

        )}

      </View> 
  );
});

const styles = StyleSheet.create({
  previewContainer: {
    padding: 20,
  },
  previewTitle: {
    fontSize: 16,
    marginBottom: '4%',
  },
  itemBox: {
    textAlign: 'top',
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    height: 100,
  },
});

export default FlatListChangeChoice;
