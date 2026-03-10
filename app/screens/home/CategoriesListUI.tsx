import { View, StyleSheet, FlatList, ListRenderItemInfo } from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import OptionCategoryButton from "./OptionCategoryCard";
import { Vibration } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import BouncyEntrance from "@/app/components/headers/BouncyEntrance";
import CatDescriptEditable from "@/app/components/headers/CatDescriptEditable";
const EXIT_DURATION = 180;
const SCROLL_SETTLE_DELAY = 350;
const EXPANDED_ITEM_HEIGHT = 400;
const DOUBLE_PRESS_DELAY = 300;

type Category = { id: number; name: string };

type Props = {
    userId: number;
  userCategories: Category[];
  selectedCategoryId?: number | null;
  onPress: (id: number) => void;
  onLongPress: (id: number) => void;
  itemColor: string;
  backgroundOverlayColor: string;
  selectedBorderColor: string;
};

const ExpandableItem = ({
  children,
  isExpanded,
}: {
  children: React.ReactNode;
  isExpanded: boolean;
}) => {
  const naturalHeight = useRef<number | null>(null);
  const height = useSharedValue<number>(-1);

  const animatedStyle = useAnimatedStyle(() => {
    if (height.value === -1) return {};
    return { height: height.value, overflow: "hidden" };
  });

  useEffect(() => {
    if (naturalHeight.current === null) return;
    if (isExpanded) {
      height.value = withTiming(EXPANDED_ITEM_HEIGHT, { duration: 300 });
    } else {
      height.value = withTiming(naturalHeight.current, { duration: 250 });
    }
  }, [isExpanded]);

  return (
    <Animated.View
      style={animatedStyle}
      onLayout={(e) => {
        const measured = e.nativeEvent.layout.height;
        if (naturalHeight.current === null && measured > 0) {
          naturalHeight.current = measured;
          height.value = measured;
        }
      }}
    >
      {children}
    </Animated.View>
  );
};

const CategoriesListUI = ({
  userId,
  userCategories,
  selectedCategoryId: selectedCategoryIdProp,
  onPress,
  onLongPress,
  itemColor,
  backgroundOverlayColor,
  selectedBorderColor,
}: Props) => {
  const translateY = useSharedValue(1000);
  const isExiting = useSharedValue(0);
  const flatListRef = useRef<FlatList<Category>>(null);
  const [isScrollLocked, setIsScrollLocked] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const footerHeight = useSharedValue(720);

  const lastPressTime = useRef<{ [id: number]: number }>({});

  const handlePressIn = useCallback(() => {
    isExiting.value = withTiming(1, { duration: 80 });
  }, []);

  const handlePressOut = useCallback(() => {
    isExiting.value = withTiming(0, { duration: 150 });
  }, []);

  const onPressRef = useRef(onPress);
  const onLongPressRef = useRef(onLongPress);
  useEffect(() => {
    onPressRef.current = onPress;
    onLongPressRef.current = onLongPress;
  });

  useEffect(() => {
    translateY.value = withSpring(0, { damping: 90, stiffness: 1000 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const footerAnimatedStyle = useAnimatedStyle(() => ({
    height: footerHeight.value,
    width: "100%",
  }));

  const handleLongPress = useCallback((id: number) => {
    Vibration.vibrate(100);
    onLongPressRef.current(id);
  }, []);

  const selectedIdRef = useRef(selectedCategoryIdProp);
  useEffect(() => {
    selectedIdRef.current = selectedCategoryIdProp;
  });

  const expandedIdRef = useRef(expandedId);
  useEffect(() => {
    expandedIdRef.current = expandedId;
  });

  const collapse = useCallback((id: number) => {
    setExpandedId(null);
    footerHeight.value = withTiming(720, { duration: 250 });
    setIsScrollLocked(false);
    setTimeout(() => {
      onPressRef.current(id);
    }, EXIT_DURATION * 0.6);
  }, []);

  const handlePress = useCallback(
    (id: number) => {
      const currentExpanded = expandedIdRef.current;

      if (currentExpanded !== null && currentExpanded !== id) {
        return;
      }

      if (currentExpanded === id) {
        const now = Date.now();
        const last = lastPressTime.current[id] ?? 0;
        lastPressTime.current[id] = now;

        if (now - last < DOUBLE_PRESS_DELAY) {
          collapse(id);
        }
        return;
      }

      isExiting.value = withTiming(1, { duration: EXIT_DURATION * 0.4 });

      const index = userCategories?.findIndex((c) => c.id === id) ?? -1;
      if (index >= 0) {
        flatListRef.current?.scrollToIndex({
          index,
          animated: true,
          viewPosition: 0,
        });
      }

      setTimeout(() => {
        setExpandedId(id);
        footerHeight.value = withTiming(720 * 3, { duration: 300 });
        setIsScrollLocked(true);
      }, SCROLL_SETTLE_DELAY);

      setTimeout(() => {
        onPressRef.current(id);
      }, EXIT_DURATION * 0.6);
    },
    [userCategories, collapse],
  );

  const staggerSpeed = useMemo(() => {
    const count = userCategories?.length ?? 1;
    return Math.floor(300 / count);
  }, [userCategories?.length]);

  const renderCategoryItem = useCallback(
    ({ item, index }: ListRenderItemInfo<Category>) => {
      // isSelected only true for the expanded item — never appears on others
      const isSelected = item.id === expandedId;
      const isExpanded = item.id === expandedId;
      const isOtherExpanded = expandedId !== null && item.id !== expandedId;
      const reverseIndex = (userCategories?.length ?? 0) - 1 - index;

      return (
        <View style={styles.sectionContainer}>
          <BouncyEntrance
            delay={reverseIndex * staggerSpeed}
            style={{ width: "100%" }}
          >
            <ExpandableItem isExpanded={isExpanded}>
              <OptionCategoryButton
                category={item}
                primaryColor={isOtherExpanded ? `${itemColor}40` : itemColor}
                backgroundColor={backgroundOverlayColor}
                buttonColor={backgroundOverlayColor}
                selectedBorderColor={
                  isSelected ? selectedBorderColor : `${itemColor}30`
                }
                isSelected={isSelected}
                isExiting={isOtherExpanded ? undefined : isExiting}
                onPress={
                  isOtherExpanded ? undefined : () => handlePress(item.id)
                }
                onPressIn={
                  isOtherExpanded || isSelected ? undefined : handlePressIn
                }
                onPressOut={
                  isOtherExpanded || isSelected ? undefined : handlePressOut
                }
                onLongPress={
                  isOtherExpanded ? undefined : () => handleLongPress(item.id)
                }
              />
              {isExpanded && (
                <View style={{flex: 1, paddingHorizontal: 10, paddingVertical: 30}}>
                    
                <CatDescriptEditable
                  userId={userId}
                  primaryColor={itemColor}
                  subWelcomeTextStyle={[]}
                  nullTextInputView={() => console.log('handling null text input')}
                  onToggle={() => console.log('toggling text input!')}
                  categoryObject={item}
                />
                
                </View>
              )}
            </ExpandableItem>
          </BouncyEntrance>
        </View>
      );
    },
    [
      itemColor,
      backgroundOverlayColor,
      selectedBorderColor,
      userCategories?.length,
      staggerSpeed,
      handlePress,
      expandedId,
    ],
  );

  const extractItemKey = (item: Category) => item.id.toString();

  const ListFooter = useCallback(
    () => <Animated.View style={footerAnimatedStyle} />,
    [],
  );

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {userCategories && (
        <FlatList
          ref={flatListRef}
          data={userCategories}
          keyExtractor={extractItemKey}
          renderItem={renderCategoryItem}
          numColumns={1}
          showsVerticalScrollIndicator={false}
          scrollEnabled={!isScrollLocked}
          style={{ width: "100%" }}
          onScrollToIndexFailed={(info) => {
            flatListRef.current?.scrollToOffset({
              offset: info.averageItemLength * info.index,
              animated: true,
            });
          }}
          ListFooterComponent={ListFooter}
        />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 2,
    minWidth: 2,
    height: "100%",
    width: "100%",
    alignItems: "center",
  },
  sectionContainer: {
    marginVertical: 6,
    flexDirection: "row",
    width: "100%",
    flexWrap: "wrap",
  },
});

export default CategoriesListUI;
