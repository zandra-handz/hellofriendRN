import { View, StyleSheet, useWindowDimensions } from "react-native";
import React, { useRef, useMemo } from "react";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  useDerivedValue,
  SharedValue,
} from "react-native-reanimated";
import { useFocusEffect } from "@react-navigation/native";
import {
  Canvas,
  Paragraph,
  Skia,
  TextAlign,
} from "@shopify/react-native-skia";
import type { SkFont } from "@shopify/react-native-skia";
import useGeckoScoreState from "@/src/hooks/useGeckoScoreState";
import useCurrentLiveSesh from "@/src/hooks/LiveSeshCalls/useCurrentLiveSesh";
import SocketStatusLight from "@/app/components/liveSesh/SocketStatusLight";
import SvgIcon from "@/app/styles/SvgIcons";
import useUser from "@/src/hooks/useUser";

type Props = {
  socketStatusSV: SharedValue;
  textColor: string;
  backgroundColor: string;
  friendId: number;
  friendName: string;
  TIME_SCORE: number;
  DAYS_SINCE: number;
  highlight: boolean;
  fontSmall?: SkFont;
};

const PARAGRAPH_HEIGHT = 20;
const HORIZONTAL_INSET = 120; // account for outer paddingHorizontal + dot + icon + gaps

const GlassTopBarLight = ({
  socketStatusSV,
  textColor,
  backgroundColor,
  friendId,
  friendName,
  TIME_SCORE,
  DAYS_SINCE,
  highlight,
  fontSmall,
}: Props) => {
  const translateY = useSharedValue(-300); // Start off-screen above
  const hasAnimated = useRef(false);

  const { geckoScoreState } = useGeckoScoreState();
  const { user } = useUser();
  const { currentLiveSesh, sessionFriendId, isHost } = useCurrentLiveSesh({
    userId: user?.id ?? 0,
    enabled: !!user?.id,
  });

  const isHostingLiveSesh =
    !!currentLiveSesh?.is_host &&
    !!currentLiveSesh?.expires_at &&
    friendId === sessionFriendId &&
    new Date(currentLiveSesh.expires_at).getTime() > Date.now();

  useFocusEffect(
    React.useCallback(() => {
      if (!hasAnimated.current) {
        translateY.value = withSpring(0, {
          damping: 40,
          stiffness: 500,
        });
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

  const fontSize = useMemo(() => fontSmall?.getSize() ?? 13, [fontSmall]);
  const fontMgr = useMemo(() => Skia.FontMgr.System(), []);

  const { width: screenWidth } = useWindowDimensions();
  const canvasWidth = Math.max(
    0,
    Math.floor(screenWidth * 0.9) - HORIZONTAL_INSET,
  );

  const friendNameSV = useSharedValue(friendName ?? "");
  React.useEffect(() => {
    friendNameSV.value = friendName ?? "";
  }, [friendName]);

  const paragraph = useDerivedValue(() => {
    const textStyle = {
      color: Skia.Color(textColor),
      fontSize,
      fontFamilies: ["Poppins", "System"],
      fontStyle: { weight: 700 },
    };

    const paraStyle = {
      textAlign: TextAlign.Left,
      maxLines: 1,
    };

    const builder = Skia.ParagraphBuilder.Make(paraStyle, fontMgr);
    builder.pushStyle(textStyle);
    builder.addText(friendNameSV.value);
    builder.pop();
    const p = builder.build();
    p.layout(canvasWidth);
    return p;
  });

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
      <View style={styles.header}>
        <Canvas style={{ width: canvasWidth, height: PARAGRAPH_HEIGHT }}>
          <Paragraph
            paragraph={paragraph}
            x={0}
            y={0}
            width={canvasWidth}
          />
        </Canvas>
        <SvgIcon name="chat" size={16} color={textColor} />
        <SocketStatusLight socketStatusSV={socketStatusSV} />
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
    alignItems: "flex-start",
    top: 60,
    flex: 1,
    position: "absolute",
    flexDirection: "column",
    borderRadius: 70,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
});

export default GlassTopBarLight;
