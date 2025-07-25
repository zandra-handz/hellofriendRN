import {   Pressable, Text, StyleSheet, Image } from "react-native";
 
const SimpleBottomButton = ({ onPress, title, borderRadius=10, backgroundColor='black', labelColor='white' }) => {
 

  return (
    <Pressable
      style={{
        ...styles.buttonContainer,
        
        borderRadius: borderRadius,
        backgroundColor: backgroundColor,
        overflow: "hidden", 
      }}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.buttonText, { color: labelColor }]}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  buttonContainer: { 
    paddingVertical: 10,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row", 
  },
  buttonText: {
    fontFamily: "Poppins-Bold",
    fontSize: 14,
  },
});

export default SimpleBottomButton;
