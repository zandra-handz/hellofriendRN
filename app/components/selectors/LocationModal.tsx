import React, { useMemo } from "react";
import manualGradientColors from "@/app/styles/StaticColors";
 
import PickerComplexList from "./PickerComplexList";
import SvgIcon from "@/app/styles/SvgIcons";

const LocationModal = ({
  primaryColor,
  selectedLocation,
  faveLocations = [],
  savedLocations = [],
  modalVisible,
  setModalVisible,
  onLocationChange,
  buttonHeight = "auto",
}) => {
  const locationPin = useMemo(() => {
    return <SvgIcon name={"bookmark"} size={20}  color={manualGradientColors.lightColor} />;
  }, [primaryColor]);

  const bookmarkedPin = useMemo(() => {
    return (
      <SvgIcon
        name={"map_marker"}
        size={20}
       
        color={primaryColor}
      />
    );
  }, [primaryColor]);

  return (
    <>
      {modalVisible && (
        <PickerComplexList
          primaryColor={primaryColor}
          title={"PICK LOCATION"}
          containerText={locationPin}
          inline={true}
          modalHeader="Select Location"
          allowCustomEntry={true}
          primaryOptions={faveLocations}
          primaryOptionsHeader="Pinned"
          primaryIcon={locationPin}
          secondaryOptions={savedLocations}
          secondaryOptionsHeader="All Saved"
          secondaryIcon={bookmarkedPin}
          objects={true}
          onLabelChange={onLocationChange}
          label={selectedLocation}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          buttonHeight={buttonHeight}
        />
      )}
    </>
  );
};

export default LocationModal;
