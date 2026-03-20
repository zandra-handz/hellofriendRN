import React, { useState, useCallback, useEffect } from "react";
import { View, StyleSheet, Text, Alert, Pressable } from "react-native";
import { Linking } from "react-native";
import AddPhoneNumber from "../alerts/AddPhoneNumber";
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";
import { useFocusEffect } from "@react-navigation/native";
import usePreAddMoment from "@/src/hooks/CapsuleCalls/usePreAddMoment";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import Animated, {
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  runOnJS,
  SlideInDown,
  SlideOutDown,
} from "react-native-reanimated";
import { AppFontStyles } from "@/app/styles/AppFonts";
import SvgIcon from "@/app/styles/SvgIcons";

interface Props {
  userId: number;
  friendId: number;
  data: object[];
  scrollTo: (index: number) => void;
  totalItemCount?: number;
  primaryColor: string;
  darkerOverlayColor: string;
  visibilityValue: SharedValue<number>;
  currentIndexValue: SharedValue<number>;
  friendNumber: string;
  height?: number;       // used on container in original
  marginBottom?: number;
  // accepted but not used — kept so callers don't break
  primaryBackground?: string;
  fontStyle?: object;
  useButtons?: boolean;
  onRightPress?: () => void;
  onRightPressSecondAction?: () => void;
}

const MomentFooter: React.FC<Props> = ({
  userId,
  friendId,
  data,
  scrollTo,
  totalItemCount,
  primaryColor,
  darkerOverlayColor,
  visibilityValue,
  currentIndexValue,
  friendNumber,
  height = 90,
  marginBottom = 10,
}) => {
  const { handlePreAddMoment } = usePreAddMoment({ userId, friendId });
  const { navigateBack } = useAppNavigations();

  const totalCount = totalItemCount ?? data?.length ?? 0;

  useEffect(() => {
    if (totalCount === 0) navigateBack();
  }, [totalCount]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputNumberVisible, setInputNumberVisible] = useState(false);
  const [ideaSent, setIdeaSent] = useState(false);

  const saveToHello = useCallback((moment) => {
    if (!friendId || !moment) {
      showFlashMessage(`Oops! Missing data required to save idea to hello`, true, 1000);
      return;
    }
    try {
      showFlashMessage(`Added to hello!`, false, 1000);
      handlePreAddMoment({ friendId, capsuleId: moment.id, isPreAdded: true });
    } catch (error) {
      showFlashMessage(`Oops! Error saving moment`, true, 1000);
      console.error("Error during pre-save:", error);
    }
  }, [friendId]);

  useFocusEffect(
    useCallback(() => {
      if (ideaSent && data[currentIndex]) {
        saveToHello(data[currentIndex]);
        setIdeaSent(false);
      }
    }, [ideaSent, currentIndex]),
  );

  useAnimatedReaction(
    () => currentIndexValue.value,
    (newIndex, prevIndex) => {
      if (newIndex !== prevIndex) runOnJS(setCurrentIndex)(newIndex);
    },
    [],
  );

  const handleSend = (fn: string, truncated: string) => {
    setIdeaSent(true);
    Linking.openURL(`sms:${fn}?body=${encodeURIComponent(truncated)}`);
  };

  const handleSendAlert = useCallback(() => {
    const capsule = data[currentIndex]?.capsule;
    if (!capsule) return;
    const truncated = `${capsule.slice(0, 30)}${capsule.length > 31 ? `...` : ``}`;
    if (friendNumber) {
      Alert.alert("Send idea", `Send ${truncated}?`, [
        { text: "Go back", style: "cancel" },
        { text: "Yes", onPress: () => handleSend(friendNumber, truncated) },
      ]);
    } else {
      setInputNumberVisible(true);
    }
  }, [currentIndex, friendNumber]);

  const handleScrollToNext = () => {
    if (currentIndex === undefined || totalCount === 0) return;
    const next = currentIndex + 1;
    scrollTo(next < totalCount ? next : 0);
  };

  const handleScrollToPrev = () => {
    if (currentIndex === undefined || totalCount === 0) return;
    scrollTo(currentIndex <= 0 ? totalCount - 1 : currentIndex - 1);
  };

  const visibilityStyle = useAnimatedStyle(() => ({
    opacity: visibilityValue.value,
  }));

  const dimColor = `${primaryColor}55`;

  return (
    <>
      <AddPhoneNumber
        userId={userId}
        friendId={friendId}
        isVisible={inputNumberVisible}
        onClose={(success) => {
          setInputNumberVisible(false);
          if (success) handleSendAlert();
        }}
      />

      <Animated.View
        entering={SlideInDown}
        exiting={SlideOutDown}
        style={[
          styles.pill,
          { backgroundColor: darkerOverlayColor, height, marginBottom },
          visibilityStyle,
        ]}
      >
        <View style={styles.section}>
          <Pressable hitSlop={10} onPress={navigateBack}>
            <SvgIcon name={"chevron_left"} size={24} color={primaryColor} />
          </Pressable>
        </View>

        <View style={styles.section}>
          <Pressable hitSlop={20} onPress={handleScrollToPrev}>
            <SvgIcon
              name={"chevron_double_left"}
              size={24}
              color={primaryColor}
              style={{ opacity: 0.6 }}
            />
          </Pressable>
        </View>

        <View style={styles.section}>
          <View style={styles.countContainer}>
            <Text style={[AppFontStyles.welcomeText, styles.countCurrent, { color: primaryColor }]}>
              {currentIndex + 1}
            </Text>
            <Text style={[AppFontStyles.welcomeText, styles.countSeparator, { color: dimColor }]}>
              {" "}/{" "}
            </Text>
            <Text style={[AppFontStyles.welcomeText, styles.countTotal, { color: dimColor }]}>
              {totalCount}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Pressable hitSlop={20} onPress={handleScrollToNext}>
            <SvgIcon
              name={"chevron_double_right"}
              size={24}
              color={primaryColor}
              style={{ opacity: 0.6 }}
            />
          </Pressable>
        </View>

        <View style={styles.section}>
          <Pressable hitSlop={10} onPress={handleSendAlert}>
            <SvgIcon name={"send_circle_outline"} size={24} color={primaryColor} />
          </Pressable>
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    width: "100%",
    position: "absolute",
    bottom: 0,
    borderRadius: 999,
    paddingBottom: 12,
    paddingHorizontal: 6,
    opacity: 0.94,
    zIndex: 10,
    alignItems: "center",
  },
  section: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  countContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  countCurrent: {
    fontSize: 40,
    fontWeight: "700",
    letterSpacing: -1,
    lineHeight: 46,
  },
  countSeparator: {
    fontSize: 20,
    lineHeight: 46,
  },
  countTotal: {
    fontSize: 20,
    lineHeight: 46,
  },
});

export default MomentFooter;