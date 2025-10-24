import { StyleSheet, View, Pressable } from "react-native";
import React, { useCallback, useMemo, useEffect } from "react"; 
import { useFriendDash } from "@/src/context/FriendDashContext";
import { useFocusEffect } from "@react-navigation/native";
import manualGradientColors from "@/app/styles/StaticColors";
import SvgIcon from "@/app/styles/SvgIcons";
import Animated, {
  withTiming,
  withSequence,
  useAnimatedStyle,
  useSharedValue,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import { Vibration } from "react-native";
import { useAutoSelector } from "@/src/context/AutoSelectorContext";
import useUpdateSettings from "@/src/hooks/SettingsCalls/useUpdateSettings";
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";
import SuggestedHello from "./SuggestedHello";
interface FriendHeaderMessageUIProps {
  borderBottomRightRadius: number;
  borderBottomLeftRadius: number;
  backgroundColor: string;
  selectedFriendName: string;
  loadingNewFriend: boolean;
  // isKeyboardVisible: boolean; // indirect condition to change message to friend picker
  onPress: () => void; // see WelcomeMessageUI for explanation; this component is the same
}

const FriendHeaderMessageUI: React.FC<FriendHeaderMessageUIProps> = ({
  height,
  userId,
  friendId,
  primaryColor,
  welcomeTextStyle,
  selectedFriendName = "",
  cardBackgroundColor,
}) => {
  const { autoSelectFriend } = useAutoSelector();
  const { loadingDash } = useFriendDash();
  const loadingNewFriend = loadingDash;
  const isFocused = useSharedValue(false);

  const opacityValue = useSharedValue(0);
  const scaleValue = useSharedValue(0);

  const secondOpacityValue = useSharedValue(0);
  const secondScaleValue = useSharedValue(0);

  const verticalValue = useSharedValue(0);
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
  useDerivedValue(() => {
    if (isFocused.value) {
      // Runs every time screen focuses
      verticalValue.value = withSpring(0, {
        stiffness: 400, // default ~100
        damping: 10, // default ~10
        mass: 0.5, // default 1
      });
    }
  });

  const animatedVerticalStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: verticalValue.value }],
      // opacity: opacityValue.value,
    };
  });

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
  }, [friendId, autoSelectFriend]);

  const isUpNext = useMemo(() => {
    // console.log("use memoooooooooooooooooooooo");
    return friendId === autoSelectFriend?.nextFriend?.id;
  }, [friendId, autoSelectFriend]);

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
    if (!friendId || !autoSelectFriend) {
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
  }, [friendId, autoSelectFriend]);

  const handleOnPress = () => {
    verticalValue.value = withSpring(-370, {
      stiffness: 100,
      damping: 2,
      mass: 0.3,
    });
    isFocused.value = false;
    handleNavigateToSelectFriend();
  };

  const message = `${selectedFriendName}`;

  const SELECTED_FRIEND_CARD_HEIGHT = 120;
  const SELECTED_FRIEND_CARD_PADDING = 20;
  const CARD_BACKGROUND = "rgba(0,0,0,0.8)";

  return (
    <Animated.View style={[animatedVerticalStyle, { height: height}]}>
      
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
              backgroundColor: cardBackgroundColor, // semi-transparent background
              alignText: 'center',
              alignItems: 'center',
              alignContent: 'center'
            },
          ]}
        >
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
            {selectedFriendName && !loadingNewFriend && message}
          </Animated.Text>
        </View>
      </Pressable>

      <SuggestedHello
        friendId={friendId}
        primaryOverlayColor={CARD_BACKGROUND}
        primaryColor={primaryColor} 
        padding={SELECTED_FRIEND_CARD_PADDING}
        height={SELECTED_FRIEND_CARD_HEIGHT}
      />
    </Animated.View>
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
    minHeight: 130,
    height: "auto",
    maxHeight: 170,
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
    paddingVertical: 10,
    paddingTop: 20,
    width: "100%",
    height: "100%",
    flexWrap: "wrap",
    borderRadius: 10,
    justifyContent: "center",
    paddingHorizontal: 20,
 
    
  },
  label: {
 width: "100%",
    fontSize: 40,
    lineHeight: 48, 
 
  textAlign: 'center'
  },
});

export default FriendHeaderMessageUI;
