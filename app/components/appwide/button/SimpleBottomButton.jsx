import { TouchableOpacity, Text, StyleSheet, Image } from "react-native";
 
const SimpleBottomButton = ({ onPress, title }) => {
 

  return (
    <TouchableOpacity
      style={{
        ...styles.buttonContainer,
        backgroundColor: "black",
        overflow: "hidden", 
      }}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.buttonText, { color: "white" }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 30,
    paddingVertical: "3%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row", // Ensure alignment with image if present
    backgroundColor: "orange",
  },
  buttonText: {
    fontFamily: "Poppins-Bold",
    fontSize: 14,
  },
});

export default SimpleBottomButton;
