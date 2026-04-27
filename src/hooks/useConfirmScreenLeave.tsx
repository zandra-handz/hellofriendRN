import { useEffect } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

const useConfirmBeforeLeave = (enabled = true) => {
  const navigation = useNavigation();

  useEffect(() => {
    if (!enabled) return;

    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();

      Alert.alert(
        "Leave screen?",
        "Are you sure you want to go back?",
        [
          { text: "Stay", style: "cancel" },
          {
            text: "Leave",
            style: "destructive",
            onPress: () => navigation.dispatch(e.data.action),
          },
        ]
      );
    });

    return unsubscribe;
  }, [navigation, enabled]);
};

export default useConfirmBeforeLeave;