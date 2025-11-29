import { View, Text,  StyleSheet  } from "react-native";
import React, { useCallback,   useState } from "react";
 
import LoadingPage from "../appwide/spinner/LoadingPage";
import { AppFontStyles } from "@/app/styles/AppFonts";
import Hours from "../locations/Hours";
import useLocationDetailFunctions from "@/src/hooks/useLocationDetailFunctions";
import manualGradientColors from "@/app/styles/StaticColors";
import useFetchAdditionalDetails from "@/src/hooks/LocationCalls/useFetchAdditionalDetails";
import LocationCustomerReviews from "../locations/LocationCustomerReviews";
import LocationAddress from "../locations/LocationAddress";
import LocationNumber from "../locations/LocationNumber";
import { ThemeAheadOfLoading } from "@/src/types/FriendTypes";
import { FocusedLocation } from "@/src/types/LocationTypes";
 
type Props = {
  userId: number;
  focusedLocation: FocusedLocation;
  primaryColor: string;
  primaryBackground: string;
  themeAheadOfLoading: ThemeAheadOfLoading;
};

const LocationQuickView = ({
  userId,
  focusedLocation,

  primaryColor,
  primaryBackground,
  themeAheadOfLoading,
  currentDay,
  selectedDay,
  handleSelectedDay,
}: Props) => {
  if (!focusedLocation || !focusedLocation?.id) {
    return;
  }
  const [rerenderCards, setRerenderCards] = useState(null);

  const handleViewDayHrs = (sD) => {
    handleSelectedDay(sD);
    setRerenderCards(sD);
  };

  const welcomeTextStyle = AppFontStyles.welcomeText;
  const subWelcomeTextStyle = AppFontStyles.subWelcomeText;

  //   const [highlightedMoment, setHighlightedMoment] = useState(undefined);
  const { additionalDetails, detailsLoading } = useFetchAdditionalDetails({
    userId: userId,
    locationObject: focusedLocation,
    enabled: true,
  });

  const { checkIfOpen } = useLocationDetailFunctions();

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString();
  };

  const SPINNER_SIZE = 30;

  const RenderOpenStatus = () => {
    let isOpenNow;
    isOpenNow = checkIfOpen(additionalDetails?.hours);

    let color =
      isOpenNow === true
        ? manualGradientColors.lightColor
        : isOpenNow === false
          ? "red"
          : primaryColor;

    return (
      <>
        {additionalDetails && additionalDetails?.hours && (
          <View
            style={[
              styles.openStatusContainer,
              {
                borderColor: color,
              },
            ]}
          >
            <Text style={[subWelcomeTextStyle, { color: primaryColor }]}>
              {isOpenNow ? `Open` : isOpenNow === false ? `Closed` : ""}
            </Text>
          </View>
        )}
      </>
    );
  };

  const renderHoursComponent = useCallback(() => {
    if (!additionalDetails?.hours?.weekday_text) return null;
    // console.log('rerendering cards!', rerenderCards);
    return (
      <Hours
        buttonHightlightColor={manualGradientColors.lightColor}
        currentDay={currentDay}
        onDaySelect={handleViewDayHrs}
        daysHrsData={additionalDetails.hours.weekday_text}
        initiallySelectedDay={selectedDay?.current || null}
        welcomeTextStyle={welcomeTextStyle}
        primaryColor={primaryColor}
        primaryBackground={primaryBackground}
      />
    );
  }, [
    additionalDetails?.hours?.weekday_text,
    manualGradientColors.lightColor,
    currentDay,
    handleViewDayHrs,
    selectedDay?.current,
  ]);

  // const ICON_MARGIN_RIGHT = 10;
  // const ICON_SIZE = 20;

  return (
    <>
      {!additionalDetails ||
        (additionalDetails === undefined || detailsLoading && (
          <View style={styles.loadingWrapper}>
                  {/* <LoadingBlock
            loading={true}
            includeLabel={false}
            delay={0}
            onBlack={true}
            
            

            /> */}
            <LoadingPage
              loading={true}
              spinnerType="circle"
              spinnerSize={SPINNER_SIZE}
              color={themeAheadOfLoading.lightColor}
            />
          </View>
        ))}
      {additionalDetails && additionalDetails != undefined && (
        <View style={styles.outerContainer}>
          <View style={styles.innerContainer}>
            <View style={{}}>
              <RenderOpenStatus />
            </View>
          </View>
{/*    
          <Text
            numberOfLines={2}
            style={[
              welcomeTextStyle,
              {
                color: primaryColor,
                flexDirection: "row",
                width: "90%",
                flexWrap: "wrap",
              },
            ]}
          >
            Reviews
          </Text> */}
          <View style={{ marginVertical: 10 }}>
            <LocationCustomerReviews
              formatDate={formatDate}
              reviews={additionalDetails.reviews}
              primaryColor={primaryColor}
              primaryBackground={primaryBackground}
            />
          </View>
{/* 
          <Text
            numberOfLines={2}
            style={[
              welcomeTextStyle,
              {
                color: primaryColor,
                flexDirection: "row",
                width: "90%",
                flexWrap: "wrap",
              },
            ]}
          >
            Hours
          </Text> */}
          <View style={{ marginVertical: 10 }}>
            {renderHoursComponent()}

            {!additionalDetails?.hours?.weekday_text && (
              <Text style={[subWelcomeTextStyle, { color: primaryColor }]}>
                No hours available
              </Text>
            )}
          </View>
        </View> 
      )}
    </>
  );
};

const styles = StyleSheet.create({
  loadingWrapper: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  outerContainer: {
    width: "100%",
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    flexWrap: "wrap",
    paddingRight: 10,
  },
  openStatusContainer: {
    borderWidth: 1.4,
    alignItems: "center",
    backgroundColor: "transparent",
    width: 80,
    flexDirection: "row",
    justifyContent: "center",
    flexShrink: 1,
    padding: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
});

export default LocationQuickView;
