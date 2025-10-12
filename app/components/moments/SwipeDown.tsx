import { View, Text } from "react-native";
import React, { useState } from "react";  
import SvgIcon from "@/app/styles/SvgIcons";
import Animated, {
 
  SharedValue,
  useAnimatedReaction,
  runOnJS,
} from "react-native-reanimated";

type Props = {
  label: string;
  flipLabel: string;
  visibilityValue: SharedValue<number>;
};

const SwipeDown = ({
  primaryColor = "red",
  primaryOverlayColor = "orange",
  label = "label",
  flipLabel = "flip label",
  visibilityValue,
}: Props) => {
  const [hide, setHide] = useState(false); 

  useAnimatedReaction(
    () => visibilityValue.value,
    (newVal, oldVal) => {
      if (newVal !== oldVal) {
        runOnJS(setHide)(!!newVal);
      }
    }
  );
  return (
    <>
      <Animated.View
        style={{
          flexDirection: "column",
          justifyContent: "center",
          alignContent: "center",
          borderRadius: 10,
          backgroundColor: primaryOverlayColor,
          padding: 4,
          opacity: 0.6,
        }}
      >
        <Text
          style={[
            {
              color: primaryColor,
              fontSize: 12,
              fontWeight: "bold",
              lineHeight: 22,
            },
          ]}
        >
          {hide ? label : flipLabel}
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <SvgIcon
            name={"gesture_swipe_vertical"}
            size={20}
            color={primaryColor}
          />
        </View>
      </Animated.View>
    </>
  );
};

export default SwipeDown;
