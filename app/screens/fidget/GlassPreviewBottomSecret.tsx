import React, { useRef } from "react";
import { View, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from "react-native-reanimated";

import FooterButtonRowConditional from "./FooterButtonRowConditional";

type Props = {
  color: string;
  backgroundColor: string;
  borderColor: string;
  onPress_exit: () => void;
  onPress_cancel?: () => void;
};

const GlassPreviewBottomSecret = ({
  color = "red",
  backgroundColor = "orange",
  borderColor = "pink",
  onPress_exit,
  onPress_cancel,
}: Props) => {
  const translateY = useSharedValue(300);
  const hasAnimated = useRef(false);

  useFocusEffect(
    React.useCallback(() => {
      if (!hasAnimated.current) {
        translateY.value = withSpring(100, { damping: 40, stiffness: 500 });
        hasAnimated.current = true;
      }
      return () => {
        translateY.value = 300;
        hasAnimated.current = false;
      };
    }, []),
  );

  const containerAnimationStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[containerAnimationStyle, styles.previewOuter]}>
      <View
        style={[styles.previewWrapper, { backgroundColor, borderColor }]}
      >
        <FooterButtonRowConditional
          backgroundColor="transparent"
          color={color}
          style={{ marginBottom: 0 }}
          iconSize={20}
          showSecondary={false}
          centerButton={{
            iconName: "close",
            label: "Exit",
            onPress: onPress_exit,
          }}
          primaryButtons={[
            {
              iconName: "close",
              label: "Exit",
              onPress: onPress_exit,
            },
            ...(onPress_cancel
              ? [
                  {
                    iconName: "delete",
                    label: "End session",
                    onPress: onPress_cancel,
                  },
                ]
              : []),
          ]}
          secondaryButtons={[]}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  previewOuter: {
    width: "100%",
    paddingHorizontal: 0,
    height: 160,
    paddingBottom: 100,
  },
  previewWrapper: {
    width: "100%",
    height: 100,
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 0,
    justifyContent: "center",
  },
});

export default React.memo(GlassPreviewBottomSecret);
