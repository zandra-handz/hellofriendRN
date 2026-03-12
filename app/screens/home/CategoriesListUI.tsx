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
const EXPANDED_ITEM_HEIGHT = 400;

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
  isAddingNew?: boolean; 
  onExpandedChange?: (id: number | null) => void;
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

const AnimatedCategoryItem = ({
  item,
  index,
  expandedId,
  userCategoriesLength,
  staggerSpeed,
  itemColor,
  backgroundOverlayColor,
  selectedBorderColor,
  isExiting,
  handlePress,
  handleLongPress,
  handlePressIn,
  handlePressOut,
  userId,
  isAddingNew,  
}: any) => {
  const isSelected = item.id === expandedId;
  const isExpanded = item.id === expandedId;
  const isOtherExpanded = (expandedId !== null && item.id !== expandedId) || !!isAddingNew;
  const reverseIndex = (userCategoriesLength ?? 0) - 1 - index;
  const scale = useSharedValue(1);

  // add after the expandedIdRef effect
 

  const animatedScaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => {
    if (!isOtherExpanded && !isSelected) {
      scale.value = withTiming(0.97, { duration: 80 });
      handlePressIn();
    }
  };

  const onPressOut = () => {
    if (!isOtherExpanded && !isSelected) {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      handlePressOut();
    }
  };

  return (
    <View style={styles.sectionContainer}>
      <BouncyEntrance delay={reverseIndex * staggerSpeed} style={{ width: "100%" }}>
        <ExpandableItem isExpanded={isExpanded}>
          <Animated.View style={animatedScaleStyle}>
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
              onPress={isOtherExpanded ? undefined : () => handlePress(item.id)}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              onLongPress={
                isOtherExpanded ? undefined : () => handleLongPress(item.id)
              }
            />
          </Animated.View>
          {isExpanded && (
            <View style={{ flex: 1, paddingHorizontal: 0, paddingVertical: 10 }}>
              <CatDescriptEditable
                userId={userId}
                primaryColor={itemColor}
                subWelcomeTextStyle={[]}
                nullTextInputView={() => console.log("handling null text input")}
                onToggle={() => console.log("toggling text input!")}
                categoryObject={item}
              />
            </View>
          )}
        </ExpandableItem>
      </BouncyEntrance>
    </View>
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
  isAddingNew,
  onExpandedChange
}: Props) => {
  const translateY = useSharedValue(1000);
  const isExiting = useSharedValue(0);
  const flatListRef = useRef<FlatList<Category>>(null);
  const [isScrollLocked, setIsScrollLocked] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const footerHeight = useSharedValue(720);

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

  const expandedIdRef = useRef(expandedId);
  useEffect(() => {
    expandedIdRef.current = expandedId;
  });

    useEffect(() => {
    onExpandedChange?.(expandedId);  // ← add this
  }, [expandedId]);

  const collapse = useCallback((id: number) => {
    setExpandedId(null);
    footerHeight.value = withTiming(720, { duration: 250 });
    setIsScrollLocked(false);
    onPressRef.current(id);
  }, []);

  const handlePress = useCallback(
    (id: number) => {
      const currentExpanded = expandedIdRef.current;

      if (currentExpanded !== null && currentExpanded !== id) {
        return;
      }

      if (currentExpanded === id) {
        collapse(id);
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

      setExpandedId(id);
      footerHeight.value = withTiming(720 * 3, { duration: 300 });
      setIsScrollLocked(true);

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
    ({ item, index }: ListRenderItemInfo<Category>) => (
      <AnimatedCategoryItem
        item={item}
        index={index}
        expandedId={expandedId}
        userCategoriesLength={userCategories?.length}
        staggerSpeed={staggerSpeed}
        itemColor={itemColor}
        backgroundOverlayColor={backgroundOverlayColor}
        selectedBorderColor={selectedBorderColor}
        isExiting={isExiting}
        handlePress={handlePress}
        handleLongPress={handleLongPress}
        handlePressIn={handlePressIn}
        handlePressOut={handlePressOut}
        userId={userId}
        isAddingNew={isAddingNew}
      />
    ),
    [
      itemColor,
      backgroundOverlayColor,
      selectedBorderColor,
      userCategories?.length,
      staggerSpeed,
      handlePress,
      expandedId,
      isAddingNew,
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