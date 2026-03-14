import React, { useRef } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import manualGradientColors from "@/app/styles/StaticColors";

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

  const hasError = !isFriendNameUnique && friendName.length > 0;

  return (
    <View style={styles.inputContainer}>
      <TextInput
        ref={friendNameRef}
        autoFocus={autoFocus}
        style={[
          styles.input,
          {
            color: primaryColor,
            borderColor: hasError ? manualGradientColors.dangerColor : primaryColor,
          },
        ]}
        value={friendName}
        placeholder="Name"
        placeholderTextColor={primaryColor}
        onChangeText={handleFriendNameChange}
        onSubmitEditing={setVisibility}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    justifyContent: "center",
    width: "100%",
    // marginVertical: 0,
  },
  input: {
    fontFamily: "Poppins-Regular",
    height: "auto",
    borderWidth: 1.5,
    padding: 10,
    paddingTop: 10,
    borderRadius: 10,
    alignContent: "center",
    justifyContent: "center",
    fontSize: 15,
  },
});

export default InputAddFriendName;