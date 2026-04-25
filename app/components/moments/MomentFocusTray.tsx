import { Pressable, StyleSheet, View } from "react-native";
import React from "react";
import SvgIcon from "@/app/styles/SvgIcons";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import useFriendDash from "@/src/hooks/useFriendDash";
import LoadingPage from "../appwide/spinner/LoadingPage";

type Props = {
  updateExistingMoment: boolean;
  primaryColor: string;
  userId: number;
  friendId: number;
  themeColors: { darkColor?: string };
};

const MomentFocusTray = ({
  updateExistingMoment,
  primaryColor,
  userId,
  friendId,
  themeColors,
}: Props) => {
  const { navigateToSelectFriend } = useAppNavigations();
  const { loadingDash } = useFriendDash({ userId, friendId });

  const onPress = () => {
    if (updateExistingMoment) return;
    navigateToSelectFriend({ useNavigateBack: true });
  };

  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [
        styles.container,
        { opacity: pressed ? 0.5 : 1 },
      ]}
    >
      {loadingDash ? (
        <View style={styles.spinnerWrap}>
          <LoadingPage
            loading={true}
            color={themeColors?.darkColor ?? primaryColor}
            spinnerType="flow"
            spinnerSize={14}
            includeLabel={false}
          />
        </View>
      ) : (
        <SvgIcon name="account" size={14} color={primaryColor} />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
  },
  spinnerWrap: {
    width: 14,
    height: 14,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default MomentFocusTray;
