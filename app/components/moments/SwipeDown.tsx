import { View, Text } from "react-native";
import React, { useState } from "react";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, { SlideInUp, SlideOutUp, FadeOut, SharedValue, useAnimatedReaction, runOnJS } from "react-native-reanimated";

type Props = {
  label: string;
  flipLabel: string;
   visibilityValue: SharedValue<number>;
};

const SwipeDown = ({ label = "label" , flipLabel = 'flip label', visibilityValue}: Props) => {
  const [hide, setHide ] = useState(false);
  const { themeStyles } = useGlobalStyle();

  useAnimatedReaction(
    () => visibilityValue.value,
    (newVal, oldVal) => {
      if (newVal !== oldVal) {
        runOnJS(setHide)(!!newVal);
      }
    }
  )
  return (
    <> 
    <Animated.View
    // entering={SlideInUp}
    // // exiting={SlideOutUp.duration(0)}
    // exiting={FadeOut}
      style={{
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
        borderRadius: 10,
        backgroundColor: themeStyles.overlayBackgroundColor.backgroundColor,
        padding: 4,
        opacity: 0.6,
      }}
    > 
      <Text
        style={[
          themeStyles.primaryText,
          { fontSize: 12, fontWeight: "bold", lineHeight: 22 },
        ]}
      >
        {hide ? label : flipLabel}
      </Text>
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <MaterialIcons
          name={hide? "swipe-down" : "swipe-up"}
          size={20}
          color={themeStyles.primaryText.color}
        />
      </View>
    </Animated.View>
     
    </>
  );
};

export default SwipeDown;
