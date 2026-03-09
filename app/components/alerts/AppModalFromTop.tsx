import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Modal,
  Text,
  Pressable,
  Dimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import SvgIcon from "@/app/styles/SvgIcons";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  isVisible: boolean;
  isFullscreen: boolean;
  questionText: string;
  children: React.ReactElement;
  borderRadius?: number;
  primaryColor: string;
  backgroundColor: string;
  contentPadding?: number;
  modalIsTransparent?: boolean;
  useCloseButton?: boolean;
  onClose: () => void;
}

const SCREEN_HEIGHT = Dimensions.get("window").height;

const AppModalFromTop: React.FC<Props> = ({
  isVisible,
  primaryColor,
  backgroundColor,
  questionText,
  children,
  onClose,
  modalIsTransparent = false,
  useCloseButton = false,
  borderRadius = 0,
  contentPadding = 10,
}) => {
  const padding = 20;
  const [shouldRenderModal, setShouldRenderModal] = useState(isVisible);
  const translateY = useSharedValue(-SCREEN_HEIGHT);

  useEffect(() => {
    if (isVisible) {
      setShouldRenderModal(true);
      translateY.value = -SCREEN_HEIGHT;
      translateY.value = withTiming(0, { duration: 280 });
    } else if (shouldRenderModal) {
      translateY.value = withTiming(
        -SCREEN_HEIGHT,
        { duration: 220 },
        (finished) => {
          if (finished) {
            runOnJS(setShouldRenderModal)(false);
          }
        },
      );
    }
  }, [isVisible, shouldRenderModal, translateY]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  if (!shouldRenderModal) {
    return null;
  }

  return (
    <Modal
      transparent={modalIsTransparent}
      statusBarTranslucent={true}
      visible={shouldRenderModal}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={[styles.modalContainer, { backgroundColor }]}>
        <Animated.View
          style={[
            styles.modalContent,
            animatedStyle,
            {
              backgroundColor,
              borderRadius,
              padding,
            },
          ]}
        >
          <SafeAreaView style={styles.safeAreaContent}>
            {!!questionText && (
              <View
                style={[
                  styles.headerContainer,
                  {
                    paddingTop: contentPadding,
                    paddingHorizontal: contentPadding,
                  },
                ]}
              >
                <Text style={[styles.questionText, { color: primaryColor }]}>
                  {questionText}
                </Text>
              </View>
            )}

            <View style={styles.childrenContainer}>{children}</View>

            {useCloseButton && (
              <View style={styles.closeButtonWrapper}>
                <Pressable onPress={onClose} style={styles.closeButton}>
                  <SvgIcon name="close" color={primaryColor} size={24} />
                </Pressable>
              </View>
            )}
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
    width: "100%",
  },
  safeAreaContent: {
    flex: 1,
    width: "100%",
  },
  childrenContainer: {
    flex: 1,
    width: "100%",
  },
  headerContainer: {
    width: "100%",
    minHeight: 50,
    justifyContent: "center",
  },
  questionText: {
    fontSize: 24,
    textAlign: "center",
  },
  closeButtonWrapper: {
    width: "100%",
    height: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButton: {
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    backgroundColor: "red",
  },
});

export default AppModalFromTop;