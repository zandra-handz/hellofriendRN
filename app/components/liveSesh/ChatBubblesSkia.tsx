import React, { useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import {
  useAnimatedReaction,
  runOnJS,
  type SharedValue,
} from "react-native-reanimated";
import {
  Canvas,
  Paragraph,
  RoundedRect,
  Skia,
  TextAlign,
} from "@shopify/react-native-skia";
import type { SkFont } from "@shopify/react-native-skia";

type GeckoMessage = {
  from_user: number;
  message: string | null;
  received_at: number;
} | null;

type Bubble = {
  from_user: number;
  text: string;
  timestamp: number;
};

type Props = {
  geckoMessageSV: SharedValue<GeckoMessage>;
  width: number;
  height: number;
  textColor: string;
  bubbleColor: string;
  fontSmall?: SkFont;
  fontSize?: number;
};

const BUBBLE_PADDING_X = 10;
const BUBBLE_PADDING_Y = 6;
const BUBBLE_RADIUS = 10;
const BUBBLE_GAP = 6;

const ChatBubblesSkia = ({
  geckoMessageSV,
  width,
  height,
  textColor,
  bubbleColor,
  fontSmall,
  fontSize,
}: Props) => {
  const scrollRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<Bubble[]>([]);

  const appendBubble = (b: Bubble) => {
    setMessages((prev) => {
      if (prev.length && prev[prev.length - 1].timestamp === b.timestamp) {
        return prev;
      }
      return [...prev, b];
    });
  };
  const clearBubbles = () => setMessages([]);

  useAnimatedReaction(
    () => geckoMessageSV?.value,
    (curr, prev) => {
      if (!curr) {
        if (prev) runOnJS(clearBubbles)();
        return;
      }
      if (prev && curr.received_at === prev.received_at) return;
      const text = curr.message;
      if (typeof text !== "string" || text.length === 0) return;
      runOnJS(appendBubble)({
        from_user: curr.from_user,
        text,
        timestamp: curr.received_at,
      });
    },
    [],
  );

  const resolvedFontSize = useMemo(
    () => fontSize ?? Math.max(9, (fontSmall?.getSize() ?? 12) - 3),
    [fontSize, fontSmall],
  );
  const fontMgr = useMemo(() => Skia.FontMgr.System(), []);

  const laidOut = useMemo(() => {
    if (width <= 0) return { items: [], totalHeight: 0 };
    const bubbleWidth = width;
    const textWidth = bubbleWidth - BUBBLE_PADDING_X * 2;
    let y = 0;
    const items = messages.map((m) => {
      const textStyle = {
        color: Skia.Color(textColor),
        fontSize: resolvedFontSize,
        fontFamilies: ["Poppins", "System"],
        fontStyle: { weight: 500 },
      };
      const paraStyle = { textAlign: TextAlign.Left, maxLines: 20 };
      const builder = Skia.ParagraphBuilder.Make(paraStyle, fontMgr);
      builder.pushStyle(textStyle);
      builder.addText(m.text);
      builder.pop();
      const p = builder.build();
      p.layout(textWidth);

      const textHeight = p.getHeight();
      const bubbleHeight = Math.ceil(textHeight + BUBBLE_PADDING_Y * 2);
      const top = y;

      y += bubbleHeight + BUBBLE_GAP;

      return {
        key: `${m.timestamp}-${m.from_user}`,
        paragraph: p,
        y: top,
        bubbleWidth,
        bubbleHeight,
      };
    });
    return { items, totalHeight: Math.max(y, 0) };
  }, [messages, width, textColor, resolvedFontSize, fontMgr]);

  useEffect(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });
  }, [laidOut.totalHeight]);

  const canvasHeight = Math.max(height, laidOut.totalHeight);

  return (
    <ScrollView
      ref={scrollRef}
      style={{ width, height }}
      contentContainerStyle={{ minHeight: height }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ width, height: canvasHeight }}>
        <Canvas style={{ width, height: canvasHeight }}>
          {laidOut.items.map((item) => (
            <React.Fragment key={item.key}>
              <RoundedRect
                x={0}
                y={item.y}
                width={item.bubbleWidth}
                height={item.bubbleHeight}
                r={BUBBLE_RADIUS}
                color={bubbleColor}
              />
              <Paragraph
                paragraph={item.paragraph}
                x={BUBBLE_PADDING_X}
                y={item.y + BUBBLE_PADDING_Y}
                width={item.bubbleWidth - BUBBLE_PADDING_X * 2}
              />
            </React.Fragment>
          ))}
        </Canvas>
      </View>
    </ScrollView>
  );
};

export default ChatBubblesSkia;
