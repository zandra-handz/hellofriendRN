import { View, Pressable } from "react-native";
import React, { useCallback, useMemo, useRef, useEffect } from "react";
import { AppFontStyles } from "@/app/styles/AppFonts";
import GeckoFriendSessionItem from "./GeckoFriendSessionItem";
import Animated, { LinearTransition } from "react-native-reanimated";

type Props = {
  listData: object[];
  primaryColor?: string;
  onPress?: () => void;
  triggerScroll?: number;
  height?: number;
};

const ScrollList = ({
  listData,
  primaryColor = "orange",
  onPress,
  triggerScroll,
  height = 300,
}: Props) => {
  const ITEM_HEIGHT = 90;
  const ITEM_BOTTOM_MARGIN = 4;
  const COMBINED_HEIGHT = ITEM_HEIGHT + ITEM_BOTTOM_MARGIN;

  const flatListRef = useRef(null);

  const fontStyles = useMemo(() => ({
    welcomeText: AppFontStyles?.welcomeText ?? { fontSize: 18, fontWeight: "600" },
    subWelcomeText: AppFontStyles?.subWelcomeText ?? { fontSize: 14, color: "orange" },
  }), []);

  useEffect(() => {
    if (triggerScroll) {
      flatListRef.current?.scrollToOffset({
        offset: COMBINED_HEIGHT * (triggerScroll - 1),
        animated: true,
      });
    }
  }, [triggerScroll]);

  const extractItemKey = useCallback(
    (item, index) => (item?.id ? item.id.toString() : `gecko-session-${index}`),
    [],
  );

  const renderItem = useCallback(
    ({ item }) => (
      <Pressable
        style={{ width: "100%", height: COMBINED_HEIGHT }}
      >
        <GeckoFriendSessionItem
          sessionData={item}
          primaryColor={primaryColor}
        />
      </Pressable>
    ),
    [primaryColor, fontStyles],
  );

  return (
    <View style={{ paddingTop: 0, height, paddingHorizontal: 4 }}>
      <Animated.FlatList
        fadingEdgeLength={20}
        ref={flatListRef}
        data={listData}
        itemLayoutAnimation={LinearTransition}
        renderItem={renderItem}
        keyExtractor={extractItemKey}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      />
    </View>
  );
};

export default ScrollList;