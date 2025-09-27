import { Pressable, View } from "react-native";
import React, { useCallback, useMemo, useEffect } from "react";
import GlobalPressable from "../appwide/button/GlobalPressable";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import manualGradientColors from "@/src/hooks/StaticColors";
import Animated, {
  withTiming,
  withSequence,
  FadeOut,
  SlideInDown,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import { Vibration } from "react-native";
import { useAutoSelector } from "@/src/context/AutoSelectorContext";
import useUpdateSettings from "@/src/hooks/SettingsCalls/useUpdateSettings";
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";

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
  userId,
  friendId,
  primaryColor,
  welcomeTextStyle,
  backgroundColor = "red",
  selectedFriendName = "",
  loadingNewFriend = false,
  cardBackgroundColor,

  // onPress,
}) => {
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
  const { autoSelectFriend } = useAutoSelector();

  const opacityValue = useSharedValue(0);
  const scaleValue = useSharedValue(0);

    const secondOpacityValue = useSharedValue(0);
  const secondScaleValue = useSharedValue(0);

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
    console.log("use memoooooooooooooooooooooo");
    return friendId === autoSelectFriend?.customFriend?.id;
  }, [friendId, autoSelectFriend]);

  const isUpNext = useMemo(() => {
    console.log("use memoooooooooooooooooooooo");
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
    navigateToSelectFriend();
  };

  const message = `${selectedFriendName}`;

  return (
    <GlobalPressable
      onPress={handleOnPress}
      onLongPress={toggleLockOnFriend}
      entering={SlideInDown}
      exiting={FadeOut}
      style={[
        {
          backgroundColor: backgroundColor,
          alignText: "center",
          flexWrap: "flex",
          width: "100%",

          marginBottom: 2,
          borderRadius: 4,
          paddingTop: 0, // same as friend message
          paddingBottom: 0, // same as friend message
          flexDirection: "row",
          justifyContent: "flex-start",
          backgroundColor: "transparent",

          minHeight: 150,
          height: "auto",
        },
      ]}
    >
      <View
        style={{
          position: "absolute",
          right: 0,
         height: "100%",
          width: "auto",
          padding: 20,
          flexDirection: "column", 
          justifyContent: 'space-between',
          alignItems: 'center',
    
          
        }}
      >
        <Animated.View
          style={[
            animatedPinStyle,
            {
               padding: 4,
              backgroundColor: manualGradientColors.lightColor,
              borderRadius: 999,
              zIndex: 9000,
              alignItems: "center",
              justifyContent: "center",
              // marginBottom: 10,
              overflow: 'hidden',
              
             
            },
          ]}
        >
          <MaterialCommunityIcons
            name={"pin-outline"}
            size={22}
            color={manualGradientColors.homeDarkColor}
          />
        </Animated.View>
        {/* )} */}

      
          <Animated.View
            style={[
              animatedSecondPinStyle,
              {
                padding: 4,
                backgroundColor: manualGradientColors.lightColor,
                borderRadius: 999,
                zIndex: 9000,
                alignItems: "center",
                justifyContent: "center",
              
              },
            ]}
          >
            <MaterialCommunityIcons
              name={"calendar-outline"}
              size={22}
              color={manualGradientColors.homeDarkColor}
            />
          </Animated.View>
     
      </View>
      <View
        style={{
          paddingTop: 50,
          paddingBottom: 30,
          width: "100%",
          height: "100%",
          flexWrap: "flex",
          borderRadius: 10,
          paddingHorizontal: 8,
          justifyContent: "center",
          paddingHorizontal: 20,
          backgroundColor: cardBackgroundColor, // semi-transparent background
        }}
      >
        <Animated.Text
          numberOfLines={2}
          style={[
            welcomeTextStyle,
            {
              color: primaryColor,
              width: "100%",
              //  color: backgroundColor,
              fontSize: 40,
              lineHeight: 48,
            },
          ]}
        >
          {selectedFriendName && !loadingNewFriend && message}
        </Animated.Text>
      </View>
    </GlobalPressable>
  );
};

export default FriendHeaderMessageUI;
