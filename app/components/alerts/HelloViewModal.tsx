import React, { useCallback, useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import useFullHelloes from "@/src/hooks/HelloesCalls/useFullHelloes";
import { FullHello } from "@/src/types/HelloTypes";
import AppModal from "../alerts/AppModal";
import OptionListItem from "../headers/OptionListItem";
import SvgIcon from "@/app/styles/SvgIcons";
import LoadingPage from "../appwide/spinner/LoadingPage";

type Props = {
  isVisible: boolean;
  onClose: () => void;
  data: FullHello;
  friendId: number;
  momentOriginalId?: string;
  index: number;
  primaryColor: string;
  lightColor: string;
  backgroundColor: string;
};

const HelloViewModal = ({
  isVisible,
  onClose,
  data,
  friendId,
  momentOriginalId,
  index,
  primaryColor,
  lightColor,
  backgroundColor,
}: Props) => {
  if (!data || !data?.id) {
    return null;
  }

  const [highlightedMoment, setHighlightedMoment] = useState<string | undefined>(undefined);
  const [helloToView, setHelloToView] = useState(undefined);
  const [helloCapsuleData, setHelloCapsuleData] = useState(undefined);

  const { helloesListFull, fetchUntilIndex } = useFullHelloes({
    friendId: friendId,
    indexNeeded: index,
  });

  fetchUntilIndex(index);

  const helloCapsules = helloToView?.thought_capsules_shared ?? null;

  useEffect(() => {
    if (helloesListFull) {
      setHelloToView(helloesListFull.find((hello) => hello.id === data.id));
    }
  }, [helloesListFull]);

  useEffect(() => {
    if (helloCapsules) {
      const entriesArray = Object.entries(helloCapsules);
      setHelloCapsuleData(entriesArray);

      if (momentOriginalId) {
        const highlight = entriesArray.find(
          (item) => item[0] === momentOriginalId
        );
        if (highlight) {
          setHighlightedMoment(highlight[0]);
        }
      }
    }
  }, [helloCapsules]);

  const ICON_SIZE = 20;
  const SPINNER_SIZE = 30;

  const renderCapsuleItem = useCallback(
    ({ item }: { item: [string, any] }) => (
      <OptionListItem
        sublabel={item[1]?.capsule}
        primaryColor={item[0] === highlightedMoment ? primaryColor : primaryColor}
        backgroundColor={item[0] === highlightedMoment ? `${primaryColor}15` : "transparent"}
        buttonColor="transparent"
        showBorder={false}
        icon={<SvgIcon name="leaf" size={16} color={primaryColor} />}
      />
    ),
    [highlightedMoment, primaryColor]
  );

  return (
    <AppModal
      isVisible={isVisible}
      isFullscreen={false}
      questionText="Hello0-oooooooooooooo"
      primaryColor={primaryColor}
      backgroundColor={backgroundColor}
    modalIsTransparent={false}
      useCloseButton={true}
      onClose={onClose}
    >
      <View  >
        {!helloToView && (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <LoadingPage
              loading={true}
              spinnerType="circle"
              spinnerSize={SPINNER_SIZE}
              color={lightColor}
            />
          </View>
        )}

        {helloToView && (
          <View style={styles.sectionContainer}>
            <OptionListItem
              label="Date"
              sublabel={helloToView.past_date_in_words}
              primaryColor={primaryColor}
              backgroundColor="transparent"
              buttonColor="transparent"
              icon={<SvgIcon name="calendar" size={ICON_SIZE} color={primaryColor} />}
            />

            <OptionListItem
              label="Type"
              sublabel={helloToView.type}
              primaryColor={primaryColor}
              backgroundColor="transparent"
              buttonColor="transparent"
              icon={<SvgIcon name="calendar" size={ICON_SIZE} color={primaryColor} />}
            />

            {!!helloToView?.location_name && (
              <OptionListItem
                label="Location"
                sublabel={helloToView.location_name}
                primaryColor={primaryColor}
                backgroundColor="transparent"
                buttonColor="transparent"
                icon={<SvgIcon name="calendar" size={ICON_SIZE} color={primaryColor} />}
              />
            )}

            {!!helloToView?.additional_notes && (
              <OptionListItem
                label="Notes"
                sublabel={helloToView.additional_notes}
                primaryColor={primaryColor}
                backgroundColor="transparent"
                buttonColor="transparent"
                icon={<SvgIcon name="pencil" size={ICON_SIZE} color={primaryColor} />}
              />
            )}

            {helloCapsuleData && (
              <View style={{ flex: 1, marginTop: 6 }}>
                <Text
                  style={{
                    fontFamily: "SpaceGrotesk-Regular",
                    fontSize: 11,
                    letterSpacing: 0.3,
                    color: primaryColor,
                    opacity: 0.45,
                    paddingHorizontal: 14,
                    marginBottom: 4,
                  }}
                >
                  Moments
                </Text>
                <FlatList
                  data={helloCapsuleData}
                  renderItem={renderCapsuleItem}
                  keyExtractor={(item) => item[0]}
                  style={{ flex: 1 }}
                />
              </View>
            )}
          </View>
        )}
      </View>
    </AppModal>
  );
};


const styles = StyleSheet.create({
   sectionContainer: {
    marginVertical: 6,
    flexDirection: "row",
    width: "100%",
    flexWrap: "wrap",
  },
});

export default HelloViewModal;