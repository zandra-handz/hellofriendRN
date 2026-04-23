import { View, StyleSheet, LayoutChangeEvent } from "react-native";
import React, { useRef, useState } from "react";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  SharedValue,
} from "react-native-reanimated";
import { useFocusEffect } from "@react-navigation/native";
import type { SkFont } from "@shopify/react-native-skia";
import SocketStatusLight from "@/app/components/liveSesh/SocketStatusLight";
import BoolSocketStatusLight from "@/app/components/liveSesh/BoolSocketStatusLight";
import ChatBubblesSkia from "@/app/components/liveSesh/ChatBubblesSkia";
import SvgIcon from "@/app/styles/SvgIcons";
import useUser from "@/src/hooks/useUser";

type GeckoMessage = {
  from_user: number;
  message: string | null;
  received_at: number;
} | null;

type Props = {
  socketStatusSV: SharedValue;
  peerJoinedStatusSV: SharedValue;
  geckoMessageSV: SharedValue<GeckoMessage>;
  textColor: string;
  backgroundColor: string;
  friendId: number;
  friendName: string;
  TIME_SCORE: number;
  DAYS_SINCE: number;
  highlight: boolean;
  fontSmall?: SkFont;
};

const CHAT_HEIGHT = 70;
const STATUS_COL_WIDTH = 90;
const CHAT_ICON_SPACE = 28;

const GlassTopBarLight = ({
  socketStatusSV,
  peerJoinedStatusSV,
  geckoMessageSV,
  textColor,
  backgroundColor,
  friendId,
  friendName,
  TIME_SCORE,
  DAYS_SINCE,
  highlight,
  fontSmall,
}: Props) => {
  const translateY = useSharedValue(-300);
  const hasAnimated = useRef(false);

  const { user } = useUser();

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

  const [bubblesWidth, setBubblesWidth] = useState(0);
  const onBubblesLayout = (e: LayoutChangeEvent) => {
    const w = Math.floor(e.nativeEvent.layout.width);
    if (w !== bubblesWidth) setBubblesWidth(w);
  };

  return (
    <Animated.View
      style={[
        containerAnimationStyle,
        styles.statsWrapper,
        {
          backgroundColor: backgroundColor,
          borderWidth: highlight ? 2 : 0,
          borderColor: textColor,
        },
      ]}
    >
      <View style={styles.row}>
        <View style={[styles.statusLights, { width: STATUS_COL_WIDTH }]}>
          <SocketStatusLight
            socketStatusSV={socketStatusSV}
            size={6}
            label={user?.username}
            labelColor={textColor}
          />
          <BoolSocketStatusLight
            peerJoinedStatusSV={peerJoinedStatusSV}
            size={6}
            label={friendName}
            labelColor={textColor}
          />
        </View>
        <View
          style={[styles.bubblesWrapper, { height: CHAT_HEIGHT }]}
          onLayout={onBubblesLayout}
        >
          {bubblesWidth > 0 && (
            <ChatBubblesSkia
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
      <View style={styles.chatIconWrapper} pointerEvents="none">
        <SvgIcon name="chat" size={16} color={textColor} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  statsWrapper: {
    padding: 20,
    paddingHorizontal: 40,
    paddingTop: 20,
    width: "90%",
    alignSelf: "center",
    alignItems: "stretch",
    top: 60,
    position: "absolute",
    flexDirection: "column",
    borderRadius: 70,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  statusLights: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 4,
  },
  bubblesWrapper: {
    flex: 1,
    marginRight: CHAT_ICON_SPACE,
    overflow: "hidden",
  },
  chatIconWrapper: {
    position: "absolute",
    top: 16,
    right: 20,
  },
});

export default GlassTopBarLight;
