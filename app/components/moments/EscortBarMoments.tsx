import { View, StyleSheet, Pressable } from "react-native";
import React, { ReactElement } from "react";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
import GlobalPressable from "../appwide/button/GlobalPressable";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import SvgIcon from "@/app/styles/SvgIcons";

type Props = {
  primaryColor: string;
  primaryBackground: string;
  children: ReactElement;
  onLeftPress: () => void;
  onRightPress: () => void;
  includeSendButton: boolean;
  onSendPress?: () => void;
};

const EscortBarMoments = ({
  primaryBackground,
  primaryColor,
  onLeftPress,
  onRightPress,
  includeSendButton,
  onSendPress,
  children,
}: Props) => {
  const { navigateBack } = useAppNavigations();

  return (
    <Animated.View
      style={styles.container}
      entering={SlideInDown}
      exiting={SlideOutDown}
    >
      <GlobalPressable
        onPress={() => console.log("nada")}
        style={[
          styles.containerButton,
          { backgroundColor: primaryBackground },
        ]}
      >
        <Pressable
          hitSlop={10}
          style={styles.backButton}
          onPress={navigateBack}
        >
          <SvgIcon name={"chevron_left"} size={20} color={primaryColor} />
        </Pressable>

        <View style={styles.centerRow}>
          <Pressable hitSlop={20} style={styles.prevButton} onPress={onLeftPress}>
            <SvgIcon
              name={"chevron_double_left"}
              size={20}
              style={{ opacity: 0.6 }}
              color={primaryColor}
            />
          </Pressable>

          {children}

          <Pressable hitSlop={20} style={styles.nextButton} onPress={onRightPress}>
            <SvgIcon
              name={"chevron_double_right"}
              size={20}
              style={{ opacity: 0.6 }}
              color={primaryColor}
            />
          </Pressable>
        </View>

        {includeSendButton && (
          <Pressable hitSlop={10} style={styles.sendButton} onPress={onSendPress}>
            <SvgIcon name={"send_circle_outline"} size={20} color={primaryColor} />
          </Pressable>
        )}
      </GlobalPressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
  },
  containerButton: {
    height: 50,
    paddingHorizontal: 10,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
    borderRadius: 999,
    opacity: 0.94,   // matches SelectedFriendFooter
  },
  backButton: {
    height: "100%",
    alignItems: "center",
    width: 20,
    position: "absolute",
    left: 0,
    flexDirection: "row",
  },
  centerRow: {
    alignItems: "center",
    flexDirection: "row",
    width: "auto",
  },
  prevButton: {
    marginHorizontal: 10,
    marginRight: 14,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
  },
  nextButton: {
    marginHorizontal: 10,
    marginLeft: 6,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButton: {
    height: "100%",
    alignItems: "center",
    width: 20,
    position: "absolute",
    right: 0,
    flexDirection: "row",
  },
});

export default EscortBarMoments;