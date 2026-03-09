import SpinnerFive from "../button/SpinnerFive";
import manualGradientColors from "@/app/styles/StaticColors";
import { View, Text, StyleSheet } from "react-native";

type Props = { backgroundColor: string; color1: string; color2: string };

const AppCustomSpinner = ({ backgroundColor, color1, color2 }: Props) => {
  return (
    <View style={[StyleSheet.absoluteFill, {backgroundColor: backgroundColor}]}>
      <SpinnerFive color1={color1} color2={color2} />
    </View>
  );
};

export default AppCustomSpinner;
