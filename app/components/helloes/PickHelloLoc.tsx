import { View, Text, StyleSheet, Pressable } from "react-native";
import React, { useEffect, useCallback } from "react";
 
import HalfScreenModal from "../alerts/HalfScreenModal";
import { MaterialCommunityIcons } from "@expo/vector-icons";
type Props = {
  primaryColor: string;
  selected: any;
  onChange: (index: number) => void;
};
 

const PickHelloLoc = ({
  primaryColor,
  selected,
  onChange,
  faveLocations,
  savedLocations,
  modalVisible,
  setModalVisible,
}: Props) => {
  useEffect(() => {
    console.log(`modalvisivle:`, modalVisible);
  }, [modalVisible]);
  const renderButtonStyle = useCallback(
    () => {
      return (
        <Pressable
          onPress={() => setModalVisible(true)}
          style={{
            backgroundColor: "transparent",
            alignItems: "center",

            justifyContent: "start",
            height: "100%",
            flexDirection: "row",

            width: "100%",
          }}
        >
          <MaterialCommunityIcons
            name={"map-marker"}
            size={20}
            color={primaryColor}
            style={{ marginRight: 10 }}
          />
          <Text
            style={{
              color: primaryColor,
            }}
          >
            {selected}
          </Text>
        </Pressable>
      );
    },
    [selected, setModalVisible, primaryColor] // dependencies go here
  );
  return (
    <>
      <Pressable
        onPress={() => setModalVisible(true)}
        style={[styles.container ]}
      >
        {renderButtonStyle()}
      </Pressable>

      {modalVisible && (
        <HalfScreenModal
          primaryColor={primaryColor}
          backgroundColor={"orange"}
          isFullscreen={false}
          isVisible={modalVisible}
          children={
            <View style={{ backgroundColor: "orange", height: 300 }}></View>
          }
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 50, 
    zIndex: 60000,
    paddingHorizontal: 20,
    flexDirection: "row",
  },
  section: {
    flex: 1,
    width: "100%",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {},
});
export default PickHelloLoc;
