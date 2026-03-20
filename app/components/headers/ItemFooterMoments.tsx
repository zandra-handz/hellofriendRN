import React, { useState, useCallback, useEffect } from "react";
import { View, StyleSheet, Text, Alert } from "react-native";
import EscortBarMoments from "../moments/EscortBarMoments";
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
} from "react-native-reanimated";
import { AppFontStyles } from "@/app/styles/AppFonts";

interface Props {
  data: object;
  height: number;
  marginBottom: number;
  isPartialData?: boolean;
  visibilityValue: SharedValue;
  currentIndexValue: SharedValue;
  scrollTo: () => void;
  totalItemCount?: number;
  useButtons: boolean;
  onRightPress: () => void;
  onRightPressSecondAction: () => void;
  friendNumber: string;
  darkerOverlayColor: string; // ← added to match SelectedFriendFooter's background
}

const ItemFooterMoments: React.FC<Props> = ({
  userId,
  friendId,
  data,
  height,
  scrollTo,
  marginBottom,
  fontStyle,
  primaryColor,
  primaryBackground,
  currentIndexValue,
  visibilityValue,
  totalItemCount,
  friendNumber,
  darkerOverlayColor,
}) => {
  const { handlePreAddMoment } = usePreAddMoment({
    userId: userId,
    friendId: friendId,
  });

  const totalCount = totalItemCount ?? data?.length ?? 0;

  useEffect(() => {
    if (totalCount === 0) navigateBack();
  }, [totalCount]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputNumberVisible, setInputNumberVisible] = useState(false);
  const [ideaSent, setIdeaSent] = useState(false);

  const { navigateBack } = useAppNavigations();

  const saveToHello = useCallback(
    (moment) => {
      if (!friendId || !moment) {
        showFlashMessage(`Oops! Missing data required to save idea to hello`, true, 1000);
        return;
      }
      try {
        showFlashMessage(`Added to hello!`, false, 1000);
        handlePreAddMoment({ friendId, capsuleId: moment.id, isPreAdded: true });
      } catch (error) {
        showFlashMessage(`Oops! Either showFlashMessage or updateCapsule has errored`, true, 1000);
        console.error("Error during pre-save:", error);
      }
    },
    [friendId],
  );

  useFocusEffect(
    useCallback(() => {
      if (ideaSent && data[currentIndex]) {
        saveToHello(data[currentIndex]);
        setIdeaSent(false);
      }
    }, [ideaSent, currentIndex]),
  );

  const handleInputNumberClose = (success) => {
    setInputNumberVisible(false);
    if (success) handleSendAlert();
  };

  useAnimatedReaction(
    () => currentIndexValue.value,
    (newIndex, prevIndex) => {
      if (newIndex !== prevIndex) runOnJS(setCurrentIndex)(newIndex);
    },
    [],
  );

  const handleSend = (friendNumber, truncated) => {
    setIdeaSent(true);
    Linking.openURL(`sms:${friendNumber}?body=${encodeURIComponent(truncated)}`);
  };

  const handleSendAlert = useCallback(() => {
    const capsule = data[currentIndex].capsule;
    const truncated = `${capsule.slice(0, 30)}${capsule.length > 31 ? `...` : ``}`;
    if (friendNumber) {
      Alert.alert("Send idea", `Send ${truncated}?`, [
        { text: "Go back", style: "cancel" },
        { text: "Yes", onPress: () => handleSend(friendNumber, truncated) },
      ]);
    } else {
      setInputNumberVisible(true);
    }
  }, [currentIndex]);

  const handleScrollToNext = () => {
    if (currentIndex === undefined || totalCount === 0) return;
    scrollTo(currentIndex + 1 < totalCount ? currentIndex + 1 : 0);
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
        onClose={handleInputNumberClose}
      />

      <Animated.View
        style={[
          styles.outerContainer,
          { height, marginBottom },
          visibilityStyle,
        ]}
      >
        {/* Pill shell — matches SelectedFriendFooter shape + color */}
        <View
          style={[
            styles.pill,
            {
              backgroundColor: darkerOverlayColor,
              height: height,
            },
          ]}
        >
          <EscortBarMoments
            primaryColor={primaryColor}
            primaryBackground={primaryBackground}
            onLeftPress={handleScrollToPrev}
            onRightPress={handleScrollToNext}
            onSendPress={handleSendAlert}
            includeSendButton={true}
            children={
              <View style={styles.countContainer}>
                <Text
                  style={[
                    AppFontStyles.welcomeText,
                    styles.countCurrent,
                    { color: primaryColor },
                  ]}
                >
                  {currentIndex + 1}
                </Text>
                <Text
                  style={[
                    AppFontStyles.welcomeText,
                    styles.countSeparator,
                    { color: dimColor },
                  ]}
                >
                  {" "}/{" "}
                </Text>
                <Text
                  style={[
                    AppFontStyles.welcomeText,
                    styles.countTotal,
                    { color: dimColor },
                  ]}
                >
                  {totalCount}
                </Text>
              </View>
            }
          />
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    width: "100%",
    zIndex: 1,
    paddingHorizontal: 6,
    marginBottom: 10,
  },
  // Pill — mirrors SelectedFriendFooter's container
  pill: {
    width: "100%",
    borderRadius: 999,
    opacity: 0.94,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
  },
  // Count
  countContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
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

export default ItemFooterMoments;