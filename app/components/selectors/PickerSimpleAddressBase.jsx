import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

const PickerSimpleAddressBase = ({
  selectedOption,
  options,
  onValueChange,
  isScrollable = false,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}></Text>
      {isScrollable ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContainer}
        >
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.button,
                selectedOption === option.value && styles.selectedButton,
              ]}
              onPress={() => onValueChange(option.value)}
            >
              <Text
                style={[
                  styles.buttonText,
                  selectedOption === option.value && styles.selectedButtonText,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.buttonsContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.button,
                selectedOption === option.value && styles.selectedButton,
              ]}
              onPress={() => onValueChange(option.value)}
            >
              <Text
                style={[
                  styles.buttonText,
                  selectedOption === option.value && styles.selectedButtonText,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontFamily: "Poppins-Bold",
  },
  buttonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  scrollViewContainer: {
    flexDirection: "row",
  },
  button: {
    backgroundColor: "#ffffff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 6,
    paddingHorizontal: 14,
    margin: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedButton: {
    backgroundColor: "#d4edda",
  },
  buttonText: {
    fontSize: 13,
    color: "black",
    fontFamily: "Poppins-Bold",
  },
  selectedButtonText: {
    color: "green",
    fontFamily: "Poppins-Bold",
  },
});

export default PickerSimpleAddressBase;
