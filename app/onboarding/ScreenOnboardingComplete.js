import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { updateAppSetup } from "@/src/calls/api";
import ButtonColorHighlight from "@/app/components/buttons/scaffolding/ButtonColorHighlight";

const ScreenOnboardingComplete = ({ resetFinalizingData }) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const goToPageTwo = () => {
    resetFinalizingData();
    navigation.navigate("Two");
  };

  const handleFinish = async () => {
    try {
      setLoading(true);
      await updateAppSetup();
      console.log("App setup updated successfully");
    } catch (error) {
      console.error("Failed to update app setup:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.message}>
        Great job! Your account is now ready to go!
      </Text>

      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <ButtonColorHighlight
            onPress={goToPageTwo}
            title="Add Another Friend"
          />
        </View>
        <View style={styles.buttonWrapper}>
          <ButtonColorHighlight
            onPress={handleFinish}
            title="Finish"
            disabled={loading}
          />
        </View>
      </View>
      {loading && <Text>Loading...</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    marginTop: 20,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  message: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Poppins-Regular",
  },
});

export default ScreenOnboardingComplete;
