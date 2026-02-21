import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Share,
  Linking,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { useLDTheme } from "@/src/context/LDThemeContext";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import { SafeAreaView } from "react-native-safe-area-context";
import SvgIcon from "@/app/styles/SvgIcons";
import QRCode from "react-native-qrcode-skia";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";

import { createFriendPickSession } from "@/src/calls/api";
import { useQueryClient } from "@tanstack/react-query";

type Props = {};

type Session = {
  id: string;
  pressed_at: string | null;
  is_expired: boolean;
  expires_on: string;
  created_on?: string;
  dark_color?: string;
  light_color?: string;
  friend?: number;
  friend_name?: string;
};

const ScreenQRCode = (props: Props) => {
  const route = useRoute();
  const { lightDarkTheme } = useLDTheme();
  const { navigateToGecko } = useAppNavigations();
  const queryClient = useQueryClient();

  const initialSelection = route.params?.selection ?? 0;
  const friendName = route.params?.friendName ?? null;
  const friendId = route.params?.friendId ?? null;
  const friendNumber = route.params?.friendNumber ?? null;

  const [isCreating, setIsCreating] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [qrValue, setQrValue] = useState<string | null>(null);

  const translateY = useSharedValue(1000);
  const opacity = useSharedValue(0);

  // Create session on mount
  useEffect(() => {
    const createSession = async () => {
      if (!friendId || !friendName) return;

      setIsCreating(true);
      try {
        // ✅ IMPORTANT: wipe old session/poll state for this friend before creating a new one
        queryClient.cancelQueries({ queryKey: ["PickSessionPoll"] });
        queryClient.removeQueries({ queryKey: ["PickSessionPoll"] });
        queryClient.setQueryData(["PickSession", friendId], null);

        const session = (await createFriendPickSession({
          friend: friendId,
          friend_name: friendName,
        })) as Session;

        if (session?.id) {
          // ✅ IMPORTANT: push NEW session into cache so Gecko doesn't see old pressed session
          queryClient.setQueryData(["PickSession", friendId], session);

          setSessionId(session.id);
          setQrValue(`https://badrainbowz.com/friends/pick/${session.id}/`);
        }
      } catch (e) {
        console.error("Failed to create session:", e);
      } finally {
        setIsCreating(false);
      }
    };

    createSession();
  }, [friendId, friendName, queryClient]);

  useEffect(() => {
    translateY.value = withSpring(0, { damping: 90, stiffness: 1000 });
    opacity.value = withTiming(1, { duration: 150 });
  }, []);

  useEffect(() => {
    if (qrValue) console.log(qrValue);
  }, [qrValue]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const handleSendLink = async () => {
    if (!qrValue) return;

    const message = `Hey ${friendName}! Tap this link when you're ready to pick: ${qrValue}`;

    if (friendNumber) {
      Linking.openURL(`sms:${friendNumber}?body=${encodeURIComponent(message)}`);
    } else {
      try {
        await Share.share({ message });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    }
  };

  const handleAccept = () => {
    translateY.value = withSpring(-1000, { damping: 20, stiffness: 90 });
    opacity.value = withTiming(0, { duration: 300 });

    setTimeout(() => {
      navigateToGecko({
        selection: initialSelection,
        autoPick: true,
        pollMode: true,
        sessionId: sessionId,
      });
    }, 300);
  };

  const handleCancel = () => {
    opacity.value = withTiming(0, { duration: 300 });
    setTimeout(() => {
      navigateToGecko({ selection: initialSelection });
    }, 300);
  };

  return (
    <SafeAreaView
      style={[
        styles.safeAreaStyle,
        { backgroundColor: lightDarkTheme.primaryBackground },
      ]}
    >
      {friendName && (
        <Animated.View style={[styles.firstContainer, animatedStyle]}>
          <View style={styles.headerWrapper}>
            <Text style={[styles.headerText, { color: lightDarkTheme.primaryText }]}>
              Let {friendName} pick
            </Text>
          </View>

          <View style={styles.qrWrapper}>
            {isCreating ? (
              <ActivityIndicator size="large" color={lightDarkTheme.primaryText} />
            ) : qrValue ? (
              <QRCode color={lightDarkTheme.primaryText} size={150} value={qrValue} />
            ) : null}
          </View>

          <View style={styles.questionWrapper}>
            <Text style={[styles.cancelAcceptText, { color: lightDarkTheme.primaryText }]}>
              Let {friendName} scan the QR code above, or{" "}
              <Text onPress={handleSendLink} style={{ textDecorationLine: "underline" }}>
                send a link instead
              </Text>
              . When you are ready, press the checkmark to start!
            </Text>
          </View>

          <View style={styles.cancelAcceptRow}>
            <Pressable
              onPress={handleCancel}
              style={[
                styles.acceptButton,
                { backgroundColor: lightDarkTheme.lighterOverlayBackground },
              ]}
            >
              <SvgIcon name="close" size={40} color={lightDarkTheme.primaryText} />
            </Pressable>

            <Pressable
              onPress={handleAccept}
              style={[
                styles.acceptButton,
                { backgroundColor: lightDarkTheme.lighterOverlayBackground },
              ]}
              disabled={!sessionId || isCreating}
            >
              <SvgIcon name="check" size={40} color={lightDarkTheme.primaryText} />
            </Pressable>
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  headerWrapper: {
    width: "100%",
    textAlign: "center",
    paddingVertical: 20,
    alignItems: "center",
  },
  firstContainer: {
    width: "100%",
    height: "auto",
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: 20,
  },
  qrWrapper: {
    width: "100%",
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelAcceptRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 30,
  },
  headerText: { fontSize: 34 },
  questionWrapper: {
    height: "auto",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
  },
  cancelAcceptText: {
    fontSize: 18,
    lineHeight: 30,
    textAlign: "center",
  },
  acceptButton: {
    borderRadius: 30,
    borderWidth: 1,
    padding: 10,
    paddingHorizontal: 20,
    textAlign: "center",
  },
});

export default ScreenQRCode;