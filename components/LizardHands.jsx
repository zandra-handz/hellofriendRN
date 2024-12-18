import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

import LizardSvg from "../assets/svgs/lizard.svg";

const LizardHands = ({
  containerWidth = 40,
  triggerMirrored = false,
  isMirrored = false,
  containerStyle,
  height = 100,
  color,
  width = 100,
}) => { 

  return (
    <View style={containerStyle}> 
        <View style={{ transform: [{ rotate: isMirrored? "60deg" : "120deg"}, {scaleY: isMirrored ? 1: -1 }] }}>
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

export default LizardHands;
