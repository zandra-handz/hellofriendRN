 import { View, StyleSheet, LayoutChangeEvent, Pressable, Text } from "react-native";                                                                                                                                                           
  import React, { useEffect, useMemo, useRef, useState } from "react";                                                                                                                                                                                
  import Animated, {
    useAnimatedStyle,
    withSpring,
    useSharedValue,
    useAnimatedReaction,
    runOnJS,
    SharedValue,
  } from "react-native-reanimated";
  import { useFocusEffect } from "@react-navigation/native";
  import type { SkFont } from "@shopify/react-native-skia";
  import SocketStatusLight from "@/app/components/liveSesh/SocketStatusLight";
  import BoolSocketStatusLight from "@/app/components/liveSesh/BoolSocketStatusLight";
  import PlayModeLabel from "@/app/components/liveSesh/PlayModeLabel";
  import ChatBubblesSkia from "@/app/components/liveSesh/ChatBubblesSkia";
  import ChatBubblesSkiaTopScroll from "@/app/components/liveSesh/ChatBubblesSkiaTopScroll";
  import SvgIcon from "@/app/styles/SvgIcons";
  import useUser from "@/src/hooks/useUser";

  type GeckoMessage = {
    from_user: number;
    message: string | null;
    received_at: number;
  } | null;

  type LiveSeshPartner = {
    userId: number;
    username: string | null;
    friendId: number | null;
    friendName: string | null;
  } | null;

  type Props = {
    socketStatusSV: SharedValue;
    peerJoinedStatusSV: SharedValue;
    geckoMessageSV: SharedValue<GeckoMessage>;
    textColor: string;
    backgroundColor: string;
    liveSeshPartner: LiveSeshPartner;
    highlight: boolean;
    fontSmall?: SkFont;
    requestPresenceStatus: () => boolean;
  };

  const CHAT_HEIGHT = 58;
  const STATUS_COL_WIDTH = 90;
  const CHAT_ICON_SPACE = 28;

  const GlassTopBarLight = ({
    socketStatusSV,
    peerJoinedStatusSV,
    geckoMessageSV,
    playModeLabel,
    textColor,
    backgroundColor,
    liveSeshPartner,
    highlight,
    fontSmall,
    requestPresenceStatus,
  }: Props) => {
    const translateY = useSharedValue(-300);
    const hasAnimated = useRef(false);

    const { user } = useUser();



    const peerLabel = useMemo(() => {
      if (!liveSeshPartner) return "";
      if (liveSeshPartner.friendName) return liveSeshPartner.friendName;
      if (liveSeshPartner.username) return `User: ${liveSeshPartner.username}`;
      return "";
    }, [liveSeshPartner]);

    useFocusEffect(
      React.useCallback(() => {
        if (!hasAnimated.current) {
          translateY.value = withSpring(0, { damping: 40, stiffness: 500 });
          hasAnimated.current = true;
        }

        return () => {
          translateY.value = -300;
          hasAnimated.current = false;
        };
      }, []),
    );

    const containerAnimationStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: translateY.value }],
    }));

    // JS mirror of the peer's socket connection (the SV lives on the UI
    // thread). Initialized to false — do NOT read the SV during render;
    // useAnimatedReaction runs on mount and sets the real value.
    const [peerConnected, setPeerConnected] = useState(false);
    useAnimatedReaction(
      () => !!peerJoinedStatusSV?.value,
      (cur, prev) => {
        if (cur !== prev) runOnJS(setPeerConnected)(cur);
      },
    );

    const [bubblesWidth, setBubblesWidth] = useState(0);
    const onBubblesLayout = (e: LayoutChangeEvent) => {
      const w = Math.floor(e.nativeEvent.layout.width);
      if (w !== bubblesWidth) setBubblesWidth(w);
    };

    return (
      <Animated.View style={[containerAnimationStyle, styles.outerWrapper]}>
        {/* PILL */}
        <View style={[styles.pill, { backgroundColor }]}>
          <View style={styles.row}>
            <View
              style={[styles.bubblesWrapper, { height: CHAT_HEIGHT }]}
              onLayout={onBubblesLayout}
            >
              {bubblesWidth > 0 && fontSmall && (
                <ChatBubblesSkiaTopScroll
                  geckoMessageSV={geckoMessageSV}
                  width={bubblesWidth}
                  height={CHAT_HEIGHT}
                  textColor={textColor}
                  bubbleColor={backgroundColor}
                  fontSmall={fontSmall}
                />
              )}
            </View>
          </View>

          <Pressable
            onPress={requestPresenceStatus}
            hitSlop={10}
            style={styles.refreshIconWrapper}
          >
            <SvgIcon name="refresh" size={16} color={textColor} />
          </Pressable>

          <View style={styles.chatIconWrapper} pointerEvents="none">
            <SvgIcon name="chat" size={16} color={textColor} />
          </View>

          {/* STATUS LIGHTS — bottom of the pill, divided by a thin line */}
          <View style={[styles.statusLights, { borderTopColor: textColor }]}>
            <SocketStatusLight
              socketStatusSV={socketStatusSV}
              size={6}
              label={user?.username}
              labelColor={textColor}
            />
            {peerConnected && (
              <BoolSocketStatusLight
                peerJoinedStatusSV={peerJoinedStatusSV}
                size={6}
                label={peerLabel}
                labelColor={textColor}
              />
            )}
            {/* <PlayModeLabel
              label={`Play mode: ${playModeLabel}`}
              labelColor={textColor}
            /> */}
          </View>
        </View>
      </Animated.View>
    );
  };

  const styles = StyleSheet.create({
    // Transparent wrapper: holds the position + the slide-down animation.
    outerWrapper: {
      width: "90%",
      alignSelf: "center",
      top: 60,
      position: "absolute",
      flexDirection: "column",
    },
    // The visible rounded pill.
    pill: {
      paddingTop: 12,
      paddingBottom: 14,
      paddingHorizontal: 40,
      alignItems: "stretch",
      flexDirection: "column",
      borderRadius: 70,
    },
    row: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 10,
    },
    // Bottom of the pill, separated from the chat by a thin divider line.
    statusLights: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 12,
      marginTop: 6,
      paddingTop: 6,
      borderTopWidth: StyleSheet.hairlineWidth,
      // borderTopColor set inline (textColor)
    },
    bubblesWrapper: {
      flex: 1,
      overflow: "hidden",
    },
    refreshIconWrapper: {
      position: "absolute",
      top: 16,
      right: 50,
    },
    chatIconWrapper: {
      position: "absolute",
      top: 16,
      right: 20,
    },
  });

  export default GlassTopBarLight;