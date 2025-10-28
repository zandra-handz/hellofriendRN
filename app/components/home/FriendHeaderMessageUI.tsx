import { StyleSheet, View, Pressable } from "react-native";
import React, { useCallback, useMemo, useEffect } from "react";
import { useFriendDash } from "@/src/context/FriendDashContext";
import { useFocusEffect } from "@react-navigation/native";
import manualGradientColors from "@/app/styles/StaticColors";
import SvgIcon from "@/app/styles/SvgIcons";
import Animated, {
  withTiming,
  withDelay,
  withSequence,
  useAnimatedStyle,
  useSharedValue,
  useDerivedValue,
  useAnimatedReaction,
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
  welcomeTextStyle,
}) => {
  const { autoSelectFriend } = useAutoSelector();
  const { friendDash, loadingDash } = useFriendDash();

 
  // const { capsuleList } = useCapsuleList();

  // const capsuleListLength = capsuleList?.length;


  const loadingNewFriend = loadingDash;
  const isFocused = useSharedValue(false);

  const opacityValue = useSharedValue(0);
  const scaleValue = useSharedValue(0);

  const secondOpacityValue = useSharedValue(0);
  const secondScaleValue = useSharedValue(0);

  // const verticalValue = useSharedValue(0);
  // ✅ useFocusEffect updates shared value
  useFocusEffect(
    useCallback(() => {
      isFocused.value = true;
      return () => {
        isFocused.value = false;
      };
    }, [])
  );

  // ✅ useDerivedValue declared at top level
  // useDerivedValue(() => {
  //   if (isFocused.value) {
  //     // Runs every time screen focuses
  //     verticalValue.value = withSpring(0, {
  //       stiffness: 400, // default ~100
  //       damping: 10, // default ~10
  //       mass: 0.5, // default 1
  //     });
  //   }
  // });

  // const animatedVerticalStyle = useAnimatedStyle(() => {
  //   return {
  //     transform: [{ translateY: verticalValue.value }],
  //     // opacity: opacityValue.value,
  //   };
  // });

//   const opacity = useSharedValue(0);
//   const scale = useSharedValue(0);
// useAnimatedReaction(
//   () => isFocused.value, // watch shared value
//   (focused, prevFocused) => {
//     if (focused && !loadingDash) {
//       // fade + scale in with delay
//       opacity.value = withDelay(capsuleListLength * 80, withTiming(1, { duration: 1000 }));
//       scale.value = withDelay(capsuleListLength * 80, withTiming(1, { duration: 400 }));
//     } else {
//       // fade + scale out
//       opacity.value = withTiming(0, { duration: 2000 });
//       scale.value = withTiming(0, { duration: 1000 });
//     }
//   },
//   [loadingDash] // this is JS state, so it goes in deps
// );

  // const animatedOpacityStyle = useAnimatedStyle(() => {
  //   return {
  //      transform: [{ scale: scale.value }],
  //   //  opacity: opacity.value,
  //   };
  // });

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
        withTiming(1, { duration: 300 })
      );
    } else {
      scaleValue.value = withSequence(
        withTiming(1.2, { duration: 200 }),
        withTiming(0, { duration: 100 })
      );
    }
  }, [isLockedOn]);

  useEffect(() => {
    if (isUpNext) {
      secondOpacityValue.value = withTiming(1, { duration: 100 });
      secondScaleValue.value = withSequence(
        withTiming(1.3, { duration: 100 }),
        withTiming(1, { duration: 300 })
      );
    } else {
      secondScaleValue.value = withSequence(
        withTiming(1.2, { duration: 200 }),
        withTiming(0, { duration: 100 })
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
  }, [
    friendId,
    selectedFriendName,
    autoSelectFriend?.customFriend?.id,
  ]);

  const handleOnPress = () => {
    // verticalValue.value = withSpring(-370, {
    //   stiffness: 100,
    //   damping: 2,
    //   mass: 0.3,
    // });
    isFocused.value = false;
    handleNavigateToSelectFriend();
  };

  const SELECTED_FRIEND_CARD_HEIGHT = 120;
  const SELECTED_FRIEND_CARD_PADDING = 20;
  const CARD_BACKGROUND = "rgba(0,0,0,0.83)";

  return (
    <>
      <View style={[{ height: height }]}>
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
          <View
            style={[
              styles.labelContainer,
              {
                // backgroundColor: cardBackgroundColor, // semi-transparent background

                alignItems: "center",
                alignContent: "center",
              },
            ]}
          >
            {loadingDash && (
              <View style={styles.loadingWrapper}>
                <LoadingPage
                  loading={true}
                  color={friendDarkColor}
                  spinnerType="flow"
                  spinnerSize={30}
                  includeLabel={false}
                />
              </View>
            )}

            {!loadingDash && (
              <Animated.Text
                numberOfLines={2}
                style={[
                  welcomeTextStyle,
                  {
                    color: primaryColor,
                
                  },
                  styles.label,
                ]}
              >
                {friendId &&
                  !loadingNewFriend &&
                  selectedFriendName}
              </Animated.Text>
            )}
          </View>
        </Pressable>

        {/* <Animated.View style={animatedOpacityStyle}> */}
          <SuggestedHello
            friendDash={friendDash}
            loadingDash={loadingDash}
            futureDateInWords={friendDash?.future_date_in_words}
            futureDate={friendDash?.date}
            primaryOverlayColor={CARD_BACKGROUND}
            primaryColor={primaryColor}
            padding={SELECTED_FRIEND_CARD_PADDING}
            height={SELECTED_FRIEND_CARD_HEIGHT}
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
    marginBottom: 24,
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
  labelContainer: {
    paddingVertical: 0,
    paddingTop: 20,
    width: "100%",
    height: "100%",
    flexWrap: "wrap",
    borderRadius: 10,
    justifyContent: "center",
    paddingHorizontal: 20,
    // backgroundColor: "pink",
    flexDirection: "column",
    justifyContent: "flex-end",
    height: 100,
  },

  label: {
    width: "100%",
    fontSize: 37,
    
    lineHeight: 38,

    textAlign: "center",
  },
  loadingWrapper: {
    flex: 0.4,
    paddingRight: 0,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    alignContent: "flex-start",
  },
});

export default React.memo(FriendHeaderMessageUI);
