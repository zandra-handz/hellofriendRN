import { View } from "react-native";
import React, { useCallback } from "react";
import { useWindowDimensions } from "react-native";
import { AppFontStyles } from "@/app/styles/AppFonts";
import MomentFooter from "./headers/MomentFooter";
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type Props = {
  initialIndex: number;
  data: object[];
  useButtons: boolean;
  friendNumber: string;
};

const CarouselSliderMoments = ({
  userId,
  friendId,
  initialIndex,
  lightDarkTheme,
  handlePreAddMoment,
  data,
  useButtons = true,
  children: Children,
  onRightPress,
  onRightPressSecondAction,
  friendNumber,
}: Props) => {
  const { height, width } = useWindowDimensions();

  const ITEM_WIDTH = width - 40;
  const ITEM_MARGIN = 20;
  const COMBINED = ITEM_WIDTH + ITEM_MARGIN * 2;
  const flatListRef = useAnimatedRef(null);

  const scrollX = useSharedValue(0);
  const scrollY = useSharedValue(0);
  const currentIndex = useSharedValue(0);
  const floaterItemsVisibility = useSharedValue(1);
  const cardScale = useSharedValue(1);

  const extractItemKey = (item, index) =>
    item?.id ? item.id.toString() : `item-${index}`;

  const getItemLayout = (item, index) => ({
    length: COMBINED,
    offset: COMBINED * index,
    index,
  });

  const scrollTo = (index: number) => {
    floaterItemsVisibility.value = withTiming(0, { duration: 10 });
    cardScale.value = withTiming(0.94, { duration: 10 });
    flatListRef.current?.scrollToIndex({ index, animated: true });
    setTimeout(() => {
      floaterItemsVisibility.value = withTiming(1, { duration: 400 });
      cardScale.value = withTiming(1, { duration: 400 });
    }, 300);
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      scrollX.value = event.contentOffset.x;
      currentIndex.value = Math.round(event.contentOffset.x / COMBINED);
    },
    onBeginDrag: () => {
      floaterItemsVisibility.value = withTiming(0, { duration: 10 });
      cardScale.value = withTiming(0.94, { duration: 10 });
    },
    onEndDrag: () => {
      floaterItemsVisibility.value = withTiming(1, { duration: 400 });
      cardScale.value = withTiming(1, { duration: 400 });
    },
  });

  const renderPage = useCallback(
    ({ item, index }) => (
      <Children
        handlePreAddMoment={handlePreAddMoment}
        textColor={lightDarkTheme.primaryText}
        darkerOverlayColor={lightDarkTheme.darkerOverlayBackground}
        lighterOverlayColor={lightDarkTheme.lighterOverlayBackground}
        darkGlassBackground={lightDarkTheme.darkGlassBackground}
        userId={userId}
        friendId={friendId}
        item={item}
        listLength={data?.length || 0}
        index={index}
        width={width}
        height={height}
        marginBottom={20}
        currentIndexValue={currentIndex}
        cardScaleValue={cardScale}
        marginKeepAboveFooter={54}
      />
    ),
    [width, height, currentIndex],
  );

  return (
    <>
      <Animated.FlatList
        data={data}
        ref={flatListRef}
        horizontal={true}
        renderItem={renderPage}
        initialScrollIndex={initialIndex}
        nestedScrollEnabled
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        keyExtractor={extractItemKey}
        getItemLayout={getItemLayout}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
        removeClippedSubviews={true}
        showsVerticalScrollIndicator={false}
        snapToAlignment={"start"}
        pagingEnabled
        ListFooterComponent={() => <View style={{ width: 100 }} />}
      />

      <MomentFooter
        userId={userId}
        friendId={friendId}
        data={data}
        scrollTo={scrollTo}
        primaryColor={lightDarkTheme.primaryText}
        primaryBackground={'transparent'}
        darkerOverlayColor={'transparent'}
        fontStyle={AppFontStyles.welcomeText}
        height={90}
        marginBottom={0}
        visibilityValue={floaterItemsVisibility}
        currentIndexValue={currentIndex}
        friendNumber={friendNumber}
        useButtons={useButtons}
        onRightPress={() => onRightPress(currentIndex.value)}
        onRightPressSecondAction={() =>
          onRightPressSecondAction(data[currentIndex.value])
        }
      />
    </>
  );
};

export default CarouselSliderMoments;