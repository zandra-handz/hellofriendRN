import { View, Pressable, StyleSheet } from "react-native";
import React from "react";
import SvgIcon from "@/app/styles/SvgIcons";
import useAppNavigations from "@/src/hooks/useAppNavigations";

type Props = {
  onPress: () => void;
  onBackPress: () => void;
  onUndoPress: () => void;
  label: string;
  iconName: string;
  forwardFlowOn: boolean;
  primaryColor: string;
  primaryBackground: string;
  borderColor: string;
};

const MomentDotsResetterMini = ({
  onPress,
  onBackPress,
  onCenterPress,
  onUndoPress,
  iconName = "chevron_left",

  primaryColor,
  primaryBackground,
  borderColor,
}: Props) => {
  const { navigateBack } = useAppNavigations();

  const onGoBack = async () => {
    if (onBackPress) {
      await onBackPress();
    }
    navigateBack();
  };

  const iconSize = 24;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: primaryBackground, borderColor: borderColor },
      ]}
      //  entering={SlideInDown} exiting={SlideOutDown}
    >
      <Pressable hitSlop={10} style={styles.buttonContainer} onPress={onGoBack}>
        <SvgIcon name={`${iconName}`} size={iconSize} color={primaryColor} />
      </Pressable>

      <Pressable
        hitSlop={10}
        style={styles.buttonContainer}
        onPress={onCenterPress}
      >
        <SvgIcon name={`image_filter_center_focus`} size={iconSize} color={primaryColor} />
      </Pressable>

      <Pressable hitSlop={10} style={styles.buttonContainer} onPress={onPress}>
        <SvgIcon name={`scatter_plot`} size={iconSize} color={primaryColor} />
      </Pressable>

      <Pressable
        hitSlop={10}
        style={styles.buttonContainer}
        onPress={onUndoPress}
      >
        <SvgIcon name={`refresh`} size={iconSize} color={primaryColor} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "space-between",
    height: 200, //160 for three
    paddingTop: 18,
    paddingBottom: 20,
    width: 52,
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 1,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    // Shadow for Android
    elevation: 8,
  },
  buttonContainer: {
    // height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default MomentDotsResetterMini;
