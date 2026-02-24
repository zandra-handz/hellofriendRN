import { StyleSheet, View, Text, Pressable } from "react-native";
import React, { useCallback, useMemo, useEffect } from "react";
import useFriendDash from "@/src/hooks/useFriendDash";
import { useFocusEffect } from "@react-navigation/native";
import manualGradientColors from "@/app/styles/StaticColors";
import SvgIcon from "@/app/styles/SvgIcons";
import Animated, {
  withTiming,
  // withDelay,
  withSequence,
  useAnimatedStyle,
  useSharedValue,
  // useDerivedValue,
  // useAnimatedReaction,
} from "react-native-reanimated";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import { Vibration } from "react-native";
import { useAutoSelector } from "@/src/context/AutoSelectorContext";
import useUpdateSettings from "@/src/hooks/SettingsCalls/useUpdateSettings";
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";
import SuggestedHello from "./SuggestedHello";
import LoadingPage from "../appwide/spinner/LoadingPage";
interface FriendHeaderMessageUIProps {
  borderBottomRightRadius: number;
  borderBottomLeftRadius: number;
  backgroundColor: string;
  // selectedFriendName: string;
  loadingNewFriend: boolean;
  // isKeyboardVisible: boolean; // indirect condition to change message to friend picker
  onPress: () => void; // see WelcomeMessageUI for explanation; this component is the same
}

const FriendHeaderMessageUI: React.FC<FriendHeaderMessageUIProps> = ({
  friendId,
  selectedFriendName,
  friendDarkColor,
  height,
  userId,
  primaryColor,
  primaryBackground,
  darkGlassBackground,
  darkerGlassBackground,
  backgroundColor,
  welcomeTextStyle,
}) => {
  const { autoSelectFriend } = useAutoSelector();
  const { friendDash, loadingDash } = useFriendDash({
    userId: userId,
    friendId: friendId,
  });

  const isFocused = useSharedValue(false);

  const opacityValue = useSharedValue(0);
  const scaleValue = useSharedValue(0);

  const secondOpacityValue = useSharedValue(0);
  const secondScaleValue = useSharedValue(0);

  useFocusEffect(
    useCallback(() => {
      isFocused.value = true;
      return () => {
        isFocused.value = false;
      };
    }, []),
  );

  const animatedPinStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleValue.value }],
      opacity: opacityValue.value,
    };
  });

  const animatedSecondPinStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: secondScaleValue.value }],
      opacity: secondOpacityValue.value,
    };
  });

  const isLockedOn = useMemo(() => {
    // console.log("use memoooooooooooooooooooooo");
    return friendId === autoSelectFriend?.customFriend?.id;
  }, [friendId, autoSelectFriend?.customFriend?.id]);

  const isUpNext = useMemo(() => {
    // console.log("use memoooooooooooooooooooooo");
    return friendId === autoSelectFriend?.nextFriend?.id;
  }, [friendId, autoSelectFriend?.nextFriend?.id]);

  useEffect(() => {
    if (isLockedOn) {
      opacityValue.value = withTiming(1, { duration: 100 });
      scaleValue.value = withSequence(
        withTiming(1.3, { duration: 100 }),
        withTiming(1, { duration: 300 }),
      );
    } else {
      scaleValue.value = withSequence(
        withTiming(1.2, { duration: 200 }),
        withTiming(0, { duration: 100 }),
      );
    }
  }, [isLockedOn]);

  useEffect(() => {
    if (isUpNext) {
      secondOpacityValue.value = withTiming(1, { duration: 100 });
      secondScaleValue.value = withSequence(
        withTiming(1.3, { duration: 100 }),
        withTiming(1, { duration: 300 }),
      );
    } else {
      secondScaleValue.value = withSequence(
        withTiming(1.2, { duration: 200 }),
        withTiming(0, { duration: 100 }),
      );
    }
  }, [isUpNext]);

  const { updateSettings } = useUpdateSettings({ userId });

  const { navigateToSelectFriend } = useAppNavigations();

  const handleNavigateToSelectFriend = () => {
    navigateToSelectFriend({ useNavigateBack: false });
  };

  const toggleLockOnFriend = useCallback(() => {
    if (!friendId) {
      return;
    }
    if (friendId === autoSelectFriend?.customFriend?.id) {
      updateSettings({ lock_in_custom_string: null });
      Vibration.vibrate(100);
      showFlashMessage(`${selectedFriendName} unpinned`, false, 1000);
    } else {
      updateSettings({ lock_in_custom_string: friendId });
      Vibration.vibrate(100);
      showFlashMessage(`${selectedFriendName} pinned!`, false, 1000);
    }
  }, [friendId, selectedFriendName, autoSelectFriend?.customFriend?.id]);

  const handleOnPress = () => {
 
    isFocused.value = false;
    handleNavigateToSelectFriend();
  };

  const SELECTED_FRIEND_CARD_PADDING = 20;

  return (
    <>
      <View style={[{ height: 220 }]}>
        <Pressable
          onPress={handleOnPress}
          onLongPress={toggleLockOnFriend}
          style={styles.container}
        >
          <View style={styles.innerContainer}>
            <Animated.View
              style={[
                animatedPinStyle,
                {
                  backgroundColor: manualGradientColors.lightColor,
                },
                styles.animatedContainer,
              ]}
            >
              <SvgIcon
                name={"pin_outline"}
                size={22}
                color={manualGradientColors.homeDarkColor}
              />
            </Animated.View>

            <Animated.View
              style={[
                animatedSecondPinStyle,
                {
                  backgroundColor: manualGradientColors.lightColor,
                },
                styles.animatedContainer,
              ]}
            >
              <SvgIcon
                name={"calendar_outline"}
                size={22}
                color={manualGradientColors.homeDarkColor}
              />
            </Animated.View>
          </View>

          <View style={[styles.topContainer]}>
            <View
              style={[
                styles.labelContainer,
                { backgroundColor: backgroundColor },
              ]}
            >
              {loadingDash && (
                <LoadingPage
                  loading={true}
                  color={friendDarkColor}
                  spinnerType="flow"
                  spinnerSize={30}
                  includeLabel={false}
                />
              )}
              {!loadingDash && (
                <Text
                  numberOfLines={2}
                  style={[
                    welcomeTextStyle,
                    {
                      color: primaryColor,
                    },
                    styles.label,
                  ]}
                >
                  {friendId && !loadingDash && selectedFriendName}
                </Text>
              )}
            </View>
          </View>
        </Pressable>

        {/* <Animated.View style={animatedOpacityStyle}> */}
        <SuggestedHello
          loadingDash={loadingDash}
          futureDate={friendDash?.date}
          darkerGlassBackground={darkerGlassBackground}
          primaryColor={primaryColor}
          primaryBackground={primaryBackground}
          padding={SELECTED_FRIEND_CARD_PADDING}
        />
        {/* </Animated.View> */}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignText: "center",
    flexWrap: "wrap",
    width: "100%",
    marginBottom: 2,
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "flex-start",
    backgroundColor: "transparent",
    marginBottom: 10,
    zIndex: 30000,
  },
  innerContainer: {
    position: "absolute",
    right: 0,
    height: "100%",
    width: "auto",
    padding: 20,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  animatedContainer: {
    padding: 4,
    borderRadius: 999,
    zIndex: 9000,
    alignItems: "center",
    justifyContent: "center",
    // marginBottom: 10,
    overflow: "hidden",
  },
  topContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
 
    marginTop: 30,
    marginBottom: 4,
  },
  labelContainer: { 
   // flexWrap: "wrap",
    minWidth:80,
flexDirection: 'row',
    width: "auto",
    maxWidth: "70%",
    flexShrink: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
     padding: 20,
    // paddingHorizontal: 10,
    // paddingVertical: 14,
    borderRadius: 50,
    minHeight: 76,
 
  },

  labelBackground: {},

  label: {
    width: "100%",
    fontSize: 28,

    lineHeight: 30,

    textAlign: "center",
  },
  loadingWrapper: {
    flex: 0.4,
    paddingRight: 0,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    alignContent: "flex-start",
    minHeight: 76,
  },
});

export default React.memo(FriendHeaderMessageUI);
