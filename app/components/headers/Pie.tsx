import { View, StyleSheet } from "react-native";
import React from "react"; 

import AnimatedPieChart from "./AnimatedPieChart";

type Props = {
 
  showPercentages: boolean,
  showLabels: boolean;
  widthAndHeight: number;

};

const Pie = ({
   darkerOverlayBackgroundColor,
  primaryColor,
    primaryOverlayColor,
  welcomeTextStyle,
  subWelcomeTextStyle,
  showPercentages = false,
  showLabels = true,
  widthAndHeight = 50,
  labelsSize = 9,
  onSectionPress = null,
 
  seriesData, 
}) => { 
 
 


 
  return (
    <View style={styles.container}>
      <AnimatedPieChart
      duration={400}
        darkerOverlayBackgroundColor={darkerOverlayBackgroundColor}
  primaryColor={primaryColor}
  primaryOverlayColor={primaryOverlayColor}
  welcomeTextStyle={welcomeTextStyle}
  subWelcomeTextStyle={subWelcomeTextStyle}
        data={seriesData}
        showLabels={showLabels}
        showPercentages={showPercentages}
        labelsSize={labelsSize}
        size={widthAndHeight}
        radius={widthAndHeight / 2}
        onSectionPress={onSectionPress ? onSectionPress : null}
 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center" },
  title: { fontSize: 24, margin: 10 },
});

export default Pie;
