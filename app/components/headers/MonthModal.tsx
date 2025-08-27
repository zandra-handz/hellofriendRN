import React, { useCallback, useState } from "react";
import HelloDayWrapper from "../helloes/HelloDayWrapper";

import { View, Text, StyleSheet, Animated, Pressable } from "react-native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ModalWithGoBack from "../alerts/ModalWithGoBack";
import ModalScaleLikeTree from "../alerts/ModalScaleLikeTree";
import { useHelloes } from "@/src/context/HelloesContext";
import HelloQuickView from "../alerts/HelloQuickView";
import { daysSincedDateField } from "@/src/utils/DaysSince";
import { ShowQuickView } from "@/src/utils/ShowQuickView";
import QuickView from "../alerts/QuickView";

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

const MonthModal: React.FC<Props> = ({ isVisible, closeModal, monthData }) => {
  const { helloesList } = useHelloes();
  const {  manualGradientColors } =
    useGlobalStyle();
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
    const helloIndex = helloesList.findIndex((hello) => hello.id === id);
    const helloObject = helloIndex !== -1 ? helloesList[helloIndex] : null;

    if (helloObject != undefined) {
      const daysSince = daysSincedDateField(helloObject.date);

      const word = Number(daysSince) != 1 ? `days` : `day`;
      console.log("helloobject@@");
      setQuickView({
        topBarText: `Hello on ${helloObject.past_date_in_words}   |   ${daysSince} ${word} ago`,
        view: <HelloQuickView data={helloObject} index={helloIndex} />,
        message: `hi hi hi`,
        update: false,
      });
    }
  };

  const renderDay = ({ item, lightUp, voidedDay, id, isManualReset, key }) => {
    //console.log(item);

    if (!item) {
      return (
        <View
          key={key}
          style={[
            styles.daySquare,
            {
              opacity: opacityMinusAnimation,
              borderRadius: daySquareBorderRadius,
              borderColor: daySquareBorderColor,
              backgroundColor: "transparent",
              opacity: 0,
            },
          ]}
          // key={`day-${rowStart }`}
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
              opacity: opacityMinusAnimation,
              borderRadius: daySquareBorderRadius,
              borderColor: daySquareBorderColor,
              backgroundColor: "transparent",
            },
          ]}
          // key={`day-${rowStart + index}`}
        ></View>
      );
    }
    if (lightUp) {
      //console.log("yes", item);
      return (
        <AnimatedPressable
          hitSlop={20}
          onPress={() => handleViewHello(id)}
          key={key}
          style={{ height: 50, width: 50, overflow: "hidden" }}
        >
          <HelloDayWrapper isVisible={lightUp}>
            <Animated.View
              style={[
                styles.daySquare,
                {
                  borderRadius: daySquareBorderRadius,
                  backgroundColor:
                    voidedDay && !isManualReset
                      ? "red"
                      : voidedDay && isManualReset
                        ? "gray"
                        : animationColor,
                },
              ]}
              // key={`day-${rowStart + index}`}
            ></Animated.View>
          </HelloDayWrapper>
        </AnimatedPressable>
      );
    }
  };

  const renderWeeks = (totalDays, startingIndex, highlightDays = []) => {
    // Generate all days of the month including filler days
    const allDays = [];

    // console.error(highlightDays);

    // Previous month's filler days
    for (let i = 0; i < startingIndex; i++) {
      allDays.push(null);
    }

    // Current month's days
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
            <View style={styles.weekRow} key={`week-${rowIndex}`}>
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

                // Find day object in highlightDays
                const dayObj = highlightDays.find((d) => d.hasOwnProperty(day));

                // If dayObj exists, lightUp = true, else false
                const lightUp = !!dayObj;

                // Extract voided and manual flags if dayObj exists
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
      // console.log(item.helloData);
      const indexRangeStart = indexDays[item.monthData.startsOn];
      // const indexRangeTotal = item.monthData.daysInMonth - 1 + indexRangeStart;

      const highlightDays = item.helloData?.days || [];

      const month = item.monthData.month.slice(0, 3);
      const year = item.monthData.year.slice(0, 4);

      return (
        <View style={styles.calendarContainer}>
          {/* <AnimatedPressable>
            <Text
              style={{
                fontFamily: "Poppins-Regular",
                fontSize: 12,
                opacity: opacityMinusAnimation,
                color: daySquareBorderColor,
              }}
            >
              {month} {year}
            </Text>
          </AnimatedPressable> */}
          <View style={styles.innerCalendarContainer}>
            {renderWeeks(
              item.monthData.daysInMonth,
              indexRangeStart,
              highlightDays
            )}
          </View>
        </View>
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
              <View>
                {monthData && renderCalendarMonth({ item: monthData })}
              </View>
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
    height: 80,
    width: 80,

    borderRadius: 10,
  },
  innerCalendarContainer: {
    paddingHorizontal: "4%",
    flex: 1,
  },
  weekRow: {
    flexDirection: "row",
    width: "100%",
    height: 50,
  },
  daySquare: {
    height: "80%",
    width: 50,
    justifyContent: "center", // Center content inside the square
    alignItems: "center", // Center content inside the square
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
  },
});

export default MonthModal;
