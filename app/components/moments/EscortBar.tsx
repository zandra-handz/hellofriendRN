import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
import { AppFontStyles } from "@/app/styles/AppFonts";
import GlobalPressable from "../appwide/button/GlobalPressable";
import ToNextButton from "./ToNextButton";
import ActionAndBack from "./ActionAndBack";
import useAppNavigations from "@/src/hooks/useAppNavigations";

import SvgIcon from "@/app/styles/SvgIcons";

type Props = {
  onPress: () => void;
  label: string;
  iconName: string;
  forwardFlowOn: boolean;
};

const EscortBar = ({
  onPress,
  label = "Save and Continue",
  iconName = "chevron_left",
  forwardFlowOn = true, 
  primaryColor,
  primaryBackground,
}: Props) => {
  const { navigateBack } = useAppNavigations();

  const [ready, setReady] = React.useState(false);

React.useEffect(() => {
  const timeout = setTimeout(() => setReady(true), 0); // next frame after layout
  return () => clearTimeout(timeout);
}, []);

  return (
   <Animated.View
  entering={ready ? SlideInDown : undefined}
  exiting={SlideOutDown}
>
      <GlobalPressable
        onPress={onPress}
        style={[
          styles.container,
          {
            backgroundColor: primaryBackground,
          },
        ]}
      >
        <View style={styles.innerContainer}>
          <Pressable
            hitSlop={10}
            style={styles.pressable}
            onPress={navigateBack}
          >
            <SvgIcon name={`${iconName}`} size={20} color={primaryColor} />
          </Pressable>

          <View style={styles.labelWrapper}>
            <Text
              style={[
                AppFontStyles?.subWelcomeText,
                styles.label,
                { color: primaryColor },
              ]}
            >
              {label}
            </Text>

            {forwardFlowOn && <ToNextButton onPress={onPress} />}
            {!forwardFlowOn && <ActionAndBack onPress={onPress} />}
          </View>
        </View>
      </GlobalPressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    paddingHorizontal: 5,
    flexDirection: "row",
    backgroundColor: "orange", 
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 999,
  },
  innerContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
    justifyContent: "space-between",
  },
  pressable: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  labelWrapper: { alignItems: "center", flexDirection: "row" },
  label: { fontSize: 13, marginRight: 12 },
});

export default EscortBar;
