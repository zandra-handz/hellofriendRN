import React from "react";

import LocationHeartSolidSvg from "@/app/assets/svgs/location-heart-solid.svg";
import LocationSolidSvg from "@/app/assets/svgs/location-solid.svg";

import PickerComplexList from "./PickerComplexList";

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
  return (
    <>
    {modalVisible && (


      <PickerComplexList
        primaryColor={primaryColor}
        title={"PICK LOCATION"}
        containerText={
          <LocationSolidSvg width={20} height={20} color={primaryColor} />
        }
        inline={true}
        modalHeader="Select Location"
        allowCustomEntry={true}
        primaryOptions={faveLocations}
        primaryOptionsHeader="Pinned"
        primaryIcon={LocationHeartSolidSvg}
        secondaryOptions={savedLocations}
        secondaryOptionsHeader="All Saved"
        secondaryIcon={LocationSolidSvg}
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
