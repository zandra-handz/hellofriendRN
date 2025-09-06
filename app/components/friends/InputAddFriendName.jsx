import React, { useRef } from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import Animated, { SlideInUp, SlideOutUp, FadeInUp } from "react-native-reanimated";
const InputAddFriendName = ({
  friendName,
  setFriendName,
  isFriendNameUnique,
  setIsFriendNameUnique,
  setRevealRest,
  friendList,
  autoFocus,
  primaryColor = "orange",
}) => {
  const friendNameRef = useRef(null);

  const handleFriendNameChange = (text) => {
    setFriendName(text);

    const isUnique = !friendList.some(
      (friend) => friend.name.toLowerCase() === text.toLowerCase()
    );

    if (isUnique && text.length) {
      setIsFriendNameUnique(true);
    } else {
      setIsFriendNameUnique(false);
      setRevealRest(false);
    }
  };

  const setVisibility = () => {
    if (isFriendNameUnique) {
      setRevealRest(true);
    }
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        ref={friendNameRef}
        autoFocus={autoFocus}
        style={[
          styles.textInput,
          styles.input,
          !isFriendNameUnique && friendName.length > 0 && styles.errorInput,
        ]}
        value={friendName}
        placeholder="Name"
        onChangeText={handleFriendNameChange}
        onSubmitEditing={setVisibility}
      />
      {!isFriendNameUnique && friendName.length > 0 && (
        <Animated.View entering={SlideInUp} exiting={SlideOutUp} style={{overflow: 'hidden'}}>
          <Text style={styles.errorText}>
            This name is already in your friend list. Please choose another
            name.
          </Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: "Poppins-Bold",
  },
  inputContainer: {
    justifyContent: "center",
    width: "100%",
    marginVertical: 10,
  },
  input: {
    fontFamily: "Poppins-Regular",

    height: "auto",
    borderWidth: 2.6,
    padding: 10,
    paddingTop: 10,
    borderRadius: 10,
    alignContent: "center",
    justifyContent: "center",
    borderColor: "black",
    fontSize: 15,
  },

  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
    fontFamily: "Poppins-Regular",
  },
});

export default InputAddFriendName;
