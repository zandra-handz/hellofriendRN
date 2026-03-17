 
import { View, Text, StyleSheet } from "react-native";
import SpinnerFiveMini from "../button/SpinnerFiveMini";
type Props = { backgroundColor: string; color1: string; color2: string };

const AppCustomSpinnerMini = ({ backgroundColor, color1, color2 }: Props) => {
  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor, alignItems: "center", justifyContent: "center" }]}>
      <SpinnerFiveMini color1={color1} color2={color2} />
    </View>
  );
};

export default AppCustomSpinnerMini;
