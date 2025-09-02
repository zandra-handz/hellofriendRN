import React, { useCallback, useEffect, useState } from "react";
import HelloDayWrapper from "../helloes/HelloDayWrapper";
import { Text, View, StyleSheet, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  SlideInDown,
  SlideOutDown,
} from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ModalScaleLikeTree from "../alerts/ModalScaleLikeTree";
import HelloQuickView from "../alerts/HelloQuickView";
import { daysSincedDateField } from "@/src/utils/DaysSince";

interface Props {
  isVisible: boolean;
  closeModal: () => void;
  onSearchPress: () => void;
  monthData?: object;
  listData: object[];
  radius: number;
  labelsSize: number;
  onLongPress: (categoryId: number | null) => void;
}

const MonthModal: React.FC<Props> = ({
  primaryColor,
  helloesList,
  manualGradientColors,
  themeAheadOfLoading,
  friendId,

  isVisible,
  closeModal,
  monthData,
}) => {
  const pieScale = useSharedValue(1);
  const pieY = useSharedValue(1);
  const pieX = useSharedValue(1);

  const radius = 100;
  const daySquareWidth = 50;
  const daySquareHeight = daySquareWidth * 0.8;

  const [viewHelloId, setViewHelloId] = useState(undefined);

  useEffect(() => {
    if (viewHelloId) {
      pieScale.value = withTiming(0.5, { duration: 200 });
      pieX.value = withSpring(
        -radius * 1.2,
        withTiming(-radius * 1.2, { duration: 200 })
      );
      pieY.value = withTiming(-radius * 0.6, { duration: 200 });
    } else {
      pieScale.value = withTiming(1, { duration: 200 });
      pieX.value = withTiming(1, { duration: 200 });
      pieY.value = withTiming(1, { duration: 200 });
    }
  }, [viewHelloId]);

  const pieScaleStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: pieScale.value },
        { translateX: pieX.value },
        { translateY: pieY.value },
      ],
    };
  });

  const opacityMinusAnimation = 1;
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  const animationColor = "orange";

  const indexDays = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  const BOTTOM_SPACER = 60;

  const daySquareBorderColor = "white";
  const daySquareBorderRadius = 20;

  const [quickView, setQuickView] = useState<null | ItemViewProps>(null);

  const handleNullQuickView = () => {
    setQuickView(null);
  };

  const month = monthData.monthData.month?.slice(0, 3) ?? "";
  const year = monthData.monthData.year?.slice(0, 4) ?? "";

  const handleViewHello = (id) => {
    if (id === viewHelloId) {
      setViewHelloId(null);
      return;
    }
    const helloIndex = helloesList.findIndex((hello) => hello.id === id);
    const helloObject = helloIndex !== -1 ? helloesList[helloIndex] : null;

    if (helloObject != undefined) {
      const daysSince = daysSincedDateField(helloObject.date);

      const word = Number(daysSince) != 1 ? `days` : `day`;
      setViewHelloId(id);
    }
  };

  const renderDay = ({ item, lightUp, voidedDay, id, isManualReset, key }) => {
    if (!item) {
      return (
        <View
          key={key}
          style={[
            styles.daySquare,
            {
              width: viewHelloId ? daySquareWidth / 1.5 : daySquareWidth,
              height: viewHelloId ? daySquareHeight / 1.5 : daySquareHeight,

              opacity: opacityMinusAnimation,
              borderRadius: daySquareBorderRadius,
              borderColor: daySquareBorderColor,
              backgroundColor: "transparent",
              opacity: 0,
            },
          ]}
        ></View>
      );
    }

    if (!lightUp) {
      return (
        <View
          key={key}
          style={[
            styles.daySquare,
            {
              width: viewHelloId ? daySquareWidth / 1.5 : daySquareWidth,
              height: viewHelloId ? daySquareHeight / 1.5 : daySquareHeight,
              opacity: opacityMinusAnimation,
              borderRadius: daySquareBorderRadius,
              borderColor: daySquareBorderColor,
              backgroundColor: "transparent",
            },
          ]}
        ></View>
      );
    }
    if (lightUp) {
      return (
        <AnimatedPressable
          hitSlop={20}
          onPress={() => handleViewHello(id)}
          key={key}
          style={{ overflow: "hidden" }}
        >
          <HelloDayWrapper isVisible={lightUp}>
            <Animated.View
              style={[
                styles.daySquare,
                {
                  width: viewHelloId ? daySquareWidth / 1.5 : daySquareWidth,
                  height: viewHelloId ? daySquareHeight / 1.5 : daySquareHeight,
                  borderRadius: daySquareBorderRadius,
                  backgroundColor:
                    voidedDay && !isManualReset
                      ? "red"
                      : voidedDay && isManualReset
                        ? "gray"
                        : animationColor,
                },
              ]}
            ></Animated.View>
          </HelloDayWrapper>
        </AnimatedPressable>
      );
    }
  };

  const renderWeeks = (totalDays, startingIndex, highlightDays = []) => {
    const allDays = [];

    for (let i = 0; i < startingIndex; i++) {
      allDays.push(null);
    }

    for (let day = 1; day <= totalDays; day++) {
      allDays.push(day);
    }

    // Next month's filler days to fill last week
    while (allDays.length % 7 !== 0) {
      allDays.push(null);
    }

    const numberOfRows = allDays.length / 7;

    return (
      <View>
        {Array.from({ length: numberOfRows }, (_, rowIndex) => {
          const rowStart = rowIndex * 7;
          const rowEnd = rowStart + 7;

          const weekData = allDays.slice(rowStart, rowEnd);

          return (
            <View
              style={[
                styles.weekRow,
                {
                  height: viewHelloId
                    ? daySquareHeight / 1.5 + 8
                    : daySquareHeight + 10,
                },
              ]}
              key={`week-${rowIndex}`}
            >
              {weekData.map((day, index) => {
                if (day === null) {
                  // filler day - no highlight or void
                  return renderDay({
                    item: day,
                    lightUp: false,
                    voidedDay: false,
                    isManualReset: false,
                    id: null,
                    key: `day-${rowStart + index}`,
                  });
                }

                const dayObj = highlightDays.find((d) => d.hasOwnProperty(day));

                const lightUp = !!dayObj;

                const voidedDay = dayObj ? dayObj[day].voided : false;
                const isManualReset = dayObj ? dayObj[day].manual : false;
                const id = dayObj ? dayObj[day].id : false;

                return renderDay({
                  item: day,
                  lightUp,
                  voidedDay,
                  isManualReset,
                  id,
                  key: `day-${rowStart + index}`,
                });
              })}
            </View>
          );
        })}
      </View>
    );
  };

  const renderCalendarMonth = useCallback(
    ({ item }) => {
      const indexRangeStart = indexDays[item.monthData.startsOn];

      const highlightDays = item.helloData?.days || [];

      const month = item.monthData.month.slice(0, 3);
      const year = item.monthData.year.slice(0, 4);

      return (
        <Animated.View
          style={[
            pieScaleStyle,

            styles.innerCalendarContainer,
            { height: !viewHelloId ? radius * 2 : radius },
          ]}
        >
          {renderWeeks(
            item.monthData.daysInMonth,
            indexRangeStart,
            highlightDays
          )}
        </Animated.View>
      );
    },
    [
      indexDays,
      opacityMinusAnimation,
      daySquareBorderColor,
      monthData,
      renderWeeks,
      styles.calendarContainer,
      styles.innerCalendarContainer,
    ]
  );

  return (
    <>
      {monthData && (
        <ModalScaleLikeTree
          isVisible={isVisible}
          bottomSpacer={BOTTOM_SPACER}
          helpModeTitle="Help mode: Charts"
          borderRadius={60}
          isFullscreen={false}
          useModalBar={true}
          quickView={quickView}
          nullQuickView={handleNullQuickView}
          rightSideButtonItem={
            <MaterialCommunityIcons
              name={`calendar`}
              size={50}
              color={manualGradientColors.darkHomeColor}
            />
          }
          buttonTitle={`${month} ${year}`}
          children={
            <View style={styles.bodyContainer}>
              {monthData && renderCalendarMonth({ item: monthData })}
              {viewHelloId && (
                <Animated.View
                  entering={SlideInDown.duration(200)} // have to match the timing in pie scaling
                  exiting={SlideOutDown.duration(200)} // have to match the timing in pie scaling
                  style={{
                    backgroundColor: "red",
                    height: viewHelloId ? "75%" : "0%",
                    flexGrow: 1,
                    width: "100%",
                  
                  }}
                >
                  <View>
                    <HelloQuickView
                      data={helloesList.find(
                        (hello) => hello.id === viewHelloId
                      )}
                      friendId={friendId}
                      momentOriginalId={null}
                      index={null}
                      primaryColor={primaryColor}
                      themeAheadOfLoading={themeAheadOfLoading}
                    />
                  </View>
                </Animated.View>
              )}
            </View>
          }
          onClose={closeModal}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  bodyContainer: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-start",
    textAlign: "left",
  },
  headerContainer: {
    margin: "2%",
  },
  sectionContainer: {
    // height: 100,
    width: "100%",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 18,
    lineHeight: 30,
  },
  text: {
    fontSize: 14,
    lineHeight: 21,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    textAlignVertical: "top",
    textAlign: "left",
    paddingRight: 2,
    height: 200,
  },

  container: {
    justifyContent: "flex-start",
    flexDirection: "row",
    width: "100%",
    height: 100,
    borderRadius: 20,
    padding: 10,
  },
  calendarContainer: {
    backgroundColor: "pink",

    borderRadius: 10,
  },
  innerCalendarContainer: {
    flex: 1,
  },
  weekRow: {
    flexDirection: "row",
    width: "100%",
    height: 50,
  },
  daySquare: {
    // height: "80%",
    // width: 50,
    justifyContent: "center", // Center content inside the square
    alignItems: "center", // Center content inside the square
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
  },
});

export default MonthModal;
