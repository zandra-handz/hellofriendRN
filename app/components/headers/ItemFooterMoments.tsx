import React, { useState, useCallback, useMemo } from "react";
import { View, StyleSheet, Text, Alert } from "react-native";
import EscortBarMoments from "../moments/EscortBarMoments";
import { Linking } from "react-native";
import AddPhoneNumber from "../alerts/AddPhoneNumber";
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";
import { useFocusEffect } from "@react-navigation/native";
import usePreAddMoment from "@/src/hooks/CapsuleCalls/usePreAddMoment";
import useUpdateFriend from "@/src/hooks/useUpdateFriend";
import Animated, {
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";

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
  categoryColorsMap: object;
  onRightPress: () => void;
  onRightPressSecondAction: () => void;
  friendNumber: string;
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
  // isPartialData, // if is partial then will add 'loaded' to total item count
  currentIndexValue,
  visibilityValue,
  categoryColorsMap, // in case want category colors
  totalItemCount,
  friendNumber,
  useButtons = true,
  onRightPress = () => {},
  onRightPressSecondAction = () => {}, // when extraData, this will send location item to send direction link text screen. need to get additionalData from cache (if exists) in this screen
}) => {
  const { handlePreAddMoment } = usePreAddMoment({
    userId: userId,
    friendId: friendId,
  });

  const [inputNumberVisible, setInputNumberVisible] = useState(false);
  const [ideaSent, setIdeaSent] = useState(false);

  const saveToHello = useCallback((moment) => {
    if (!friendId || !moment) {
      showFlashMessage(
        `Oops! Missing data required to save idea to hello`,
        true,
        1000
      );
      return;
    }

    try {
      showFlashMessage(`Added to hello!`, false, 1000);
      handlePreAddMoment({
        friendId: friendId,
        capsuleId: moment.id,
        isPreAdded: true,
      });
    } catch (error) {
      showFlashMessage(
        `Oops! Either showFlashMessage or updateCapsule has errored`,
        true,
        1000
      );
      console.error("Error during pre-save:", error);
    }
  }, []);


  useFocusEffect(
    useCallback(() => {
      if (ideaSent && data[currentIndex]) {
        saveToHello(data[currentIndex]);

        setIdeaSent(false);

      }


  }, [

    ideaSent, currentIndex
  ]));

  const handleInputNumberClose = (success) => {
    console.log("handleinputnumberclose");
    setInputNumberVisible(false);
    if (success) {
      handleSendAlert();
    }
  };

  const [currentIndex, setCurrentIndex] = useState(false);

  const totalCount = totalItemCount
    ? totalItemCount
    : data?.length
      ? data.length
      : 0;

  useAnimatedReaction(
    () => currentIndexValue.value,
    (newIndex, prevIndex) => {
      if (newIndex !== prevIndex) {
        runOnJS(setCurrentIndex)(newIndex);
      }
    },
    []
  );

  const handleSend = (friendNumber, truncated) => {
    setIdeaSent(true);

    Linking.openURL(
      `sms:${friendNumber}?body=${encodeURIComponent(truncated)}`
    );
  };

  const handleSendAlert = useCallback(() => {
    console.log(currentIndex);
    const capsule = data[currentIndex].capsule;

    const truncated = `${capsule.slice(0, 30)}${capsule.length > 31 ? `...` : ``}`;

    if (friendNumber) {
      Alert.alert("Send idea", `Send ${truncated}?`, [
        { text: "Go back", style: "cancel" },
        {
          text: "Yes",
          onPress: () => handleSend(friendNumber, truncated),
        },
      ]);
    } else {
      setInputNumberVisible(true);
    }
  }, [currentIndex]);

  const handleScrollToNext = () => {
    console.log(`handle next pressed, currentIndex: `, currentIndex);
    console.log(currentIndex);
    if (currentIndex === undefined) {
      return;
    }

    const next = currentIndex + 1;

    const nextExists = next < totalCount;

    const scrollToIndex = nextExists ? next : 0;

    scrollTo(scrollToIndex);
  };

  const handleScrollToPrev = () => {
    if (currentIndex === undefined) {
      return;
    }

    const prev = currentIndex - 1;
    console.log(totalCount - 1);

    const scrollToIndex = currentIndex <= 0 ? totalCount - 1 : prev;

    scrollTo(scrollToIndex);
    console.log(currentIndex);
  };

  const visibilityStyle = useAnimatedStyle(() => {
    return { opacity: visibilityValue.value };
  });

  const item = useMemo(() => {
    return data[currentIndex];
  }, [currentIndex, data]);

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
          styles.container,
          {
            height: height, //same as escort bar now
            marginBottom: marginBottom,
            // backgroundColor: themeStyles.overlayBackgroundColor.backgroundColor,
          },
          visibilityStyle,
        ]}
      >
        <EscortBarMoments
          primaryColor={primaryColor}
          primaryBackground={primaryBackground}
          categoryColorsMap={categoryColorsMap}
          onLeftPress={handleScrollToPrev}
          onRightPress={handleScrollToNext}
          onSendPress={handleSendAlert}
          includeSendButton={true}
          children={
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={[fontStyle, { color: primaryColor, fontSize: 44 }]}>
                {currentIndex + 1}
                <Text
                  style={[fontStyle, { color: primaryColor, fontSize: 22 }]}
                >
                  {/* /{data.length}{" "} */}/{totalCount}{" "}
                  {/* {isPartialData ? "loaded" : "total"} */}
                </Text>
              </Text>
            </View>
          }
        />
        {/* {useButtons && 
        <View style={[styles.divider, themeStyles.divider]} />} */}
        <></>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    zIndex: 1,
    // backgroundColor: "pink",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  divider: {
    marginVertical: 10,
  },
});

export default ItemFooterMoments;
