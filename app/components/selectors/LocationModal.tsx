import React, { useMemo } from "react";
import manualGradientColors from "@/src/hooks/StaticColors";
import { MaterialIcons } from "@expo/vector-icons";
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
  const locationPin = useMemo(() => {
    return <MaterialIcons name={"bookmark"} size={20}  color={manualGradientColors.lightColor} />;
  }, [primaryColor]);

  const bookmarkedPin = useMemo(() => {
    return (
      <MaterialIcons
        name={"location-pin"}
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
