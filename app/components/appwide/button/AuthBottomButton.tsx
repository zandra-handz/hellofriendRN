import { Text, StyleSheet } from "react-native";
import GlobalPressable from "./GlobalPressable";
import manualGradientColors  from "@/app/styles/StaticColors";

type Props = {
  onPress: () => void;
  title: string;
};
const AuthBottomButton = ({ onPress, title }: Props) => {
  return (
    <GlobalPressable
      style={{
        ...styles.buttonContainer,

        borderRadius: 10,
        backgroundColor: manualGradientColors.homeDarkColor,
        overflow: "hidden",
      }}
      onPress={onPress}
    >
      <Text
        style={[styles.buttonText, { color: manualGradientColors.lightColor }]}
      >
        {title}
      </Text>
    </GlobalPressable>
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

export default AuthBottomButton;
