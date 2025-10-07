import { View, Text, FlatList } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
// import useFullHelloes from "@/src/hooks/useFullHelloes";
import { MaterialCommunityIcons } from "@expo/vector-icons";
// import { FullHello } from "@/src/types/HelloTypes";
// import ModalInfoText from "../headers/ModalInfoText";
import LoadingPage from "../appwide/spinner/LoadingPage";
import { AppFontStyles } from "@/src/hooks/StaticFonts";

import useLocationDetailFunctions from "@/src/hooks/useLocationDetailFunctions";

import useFetchAdditionalDetails from "@/src/hooks/LocationCalls/useFetchAdditionalDetails";

import LocationAddress from "../locations/LocationAddress";
import LocationNumber from "../locations/LocationNumber";

type Props = {
  //   data: FullHello;
  //   momentOriginalId?: string;
  //   index: number;
};

const LocationQuickView = ({
  userId,
  focusedLocation,
  //   friendId,
  //   momentOriginalId,
  //   index,
  primaryColor,
  themeAheadOfLoading,
}: Props) => {
  if (!focusedLocation || !focusedLocation?.id) {
    return;
  }

  const welcomeTextStyle = AppFontStyles.welcomeText;
  const subWelcomeTextStyle = AppFontStyles.subWelcomeText;

  //   const [highlightedMoment, setHighlightedMoment] = useState(undefined);
  const { additionalDetails } = useFetchAdditionalDetails({
    userId: userId,
    locationObject: focusedLocation,
    enabled: true,
  });

  const { checkIfOpen } = useLocationDetailFunctions();

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
              {
                borderWidth: 1.4,
                borderColor: color,
                alignItems: "center",
                backgroundColor: "transparent",
                //  themeStyles.primaryText.color,

                width: "auto",
                width: 80,
                flexDirection: "row",
                justifyContent: "center",
                flexShrink: 1,
                padding: 10,
                paddingVertical: 6,
                borderRadius: 10,
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

  const [locationToView, setLocationToView] = useState(undefined);
  const [helloCapsuleData, setHelloCapsuleData] = useState(undefined);

  const ICON_MARGIN_RIGHT = 10;
  const ICON_SIZE = 20;

  return (
    <>
      {!locationToView && (
        <View
          style={{
            flex: 1,

            width: "100%",

            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LoadingPage
            loading={true}
            spinnerType="circle"
            spinnerSize={SPINNER_SIZE}
            color={themeAheadOfLoading.lightColor}
          />
        </View>
      )}
      {locationToView && locationToView != undefined && (
        <View style={{ width: "100%" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 4,
            }}
          >
            <MaterialCommunityIcons
              name={"calendar"}
              color={primaryColor}
              size={ICON_SIZE}
              style={{ marginRight: ICON_MARGIN_RIGHT }}
            />
            {/* <ModalInfoText
              infoText={helloToView.past_date_in_words}
              primaryColor={primaryColor}
            /> */}
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 4,
              flexWrap: "flex",
              paddingRight: 10,
            }}
          >
            <MaterialCommunityIcons
              name={"calendar"}
              color={primaryColor}
              size={ICON_SIZE}
              style={{ marginRight: ICON_MARGIN_RIGHT }}
            />
            {/* <ModalInfoText
              infoText={helloToView.type}
              primaryColor={primaryColor}
            /> */}
          </View>
          {/* {helloToView?.location_name && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 4,
                flexWrap: "flex",
                paddingRight: 10,
              }}
            >
              <MaterialCommunityIcons
                name={"calendar"}
                color={primaryColor}
                size={ICON_SIZE}
                style={{ marginRight: ICON_MARGIN_RIGHT }}
              />
              <ModalInfoText
                fontSize={14}
                lineHeight={18}
                infoText={helloToView.location_name}
                primaryColor={primaryColor}
              />
            </View>
          )} */}
          {/* {helloToView?.additional_notes && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 4,
                flexWrap: "flex",
                paddingRight: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  height: "100%",
                  justifyContent: "flex-start",
                }}
              >
                <MaterialCommunityIcons
                  name={"pencil"}
                  color={primaryColor}
                  size={ICON_SIZE}
                  style={{ marginRight: ICON_MARGIN_RIGHT }}
                />
              </View>
              <ModalInfoText
                infoText={helloToView.additional_notes}
                primaryColor={primaryColor}
              />
            </View>
          )} */}
        </View>
      )}
    </>
  );
};

export default LocationQuickView;
