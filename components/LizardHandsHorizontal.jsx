import React from "react";
import { View, StyleSheet } from "react-native";

import LizardSvg from "../assets/svgs/lizard.svg";

const LizardHandsHorizontal = ({ 
  isMirrored = false,
  containerStyle,
  height = 70,
  color,
  width = 70,
}) => { 

  return (
    <View style={[containerStyle]}> 
        <View style={{ transform: [{ rotate: isMirrored? "150deg" : "210deg"}, {scaleY: isMirrored ? 1: -1 }] }}>
          <LizardSvg height={height} width={width} color={color} />
        </View>  
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 50,
    flex: 1,
  },
});

export default LizardHandsHorizontal;
