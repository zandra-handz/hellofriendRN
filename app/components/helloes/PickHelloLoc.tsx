import { View, Text, StyleSheet, Pressable } from "react-native";
import React, {  useCallback } from "react";

import HalfScreenModal from "../alerts/HalfScreenModal";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
type Props = {
  primaryColor: string;
  selected: any;
  onChange: (index: number) => void;
};

const PickHelloLoc = ({
  primaryColor,
  selected,
  onChange,
  modalVisible,
  setModalVisible,
  clearLocation,
}: Props) => {
  const PADDING_HORIZONTAL = 20;
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
            backgroundColor: "orange",
            width: "80%",
          }}
        >
          <MaterialCommunityIcons
            name={"store-marker"}
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
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "teal",
          width: "100%",
          justifyContent: "space-between",
          paddingRight: PADDING_HORIZONTAL,
          alignItems: "center",
        }}
      >
        <Pressable
          onPress={() => setModalVisible(true)}
          style={[styles.container, { paddingHorizontal: PADDING_HORIZONTAL }]}
        >
          {renderButtonStyle()}
        </Pressable>
        <Pressable
          onPress={clearLocation}
          style={{
            width: "auto",
            height: "100%",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <MaterialIcons name={"location-off"} color={primaryColor} size={20} />
        </Pressable>
      </View>

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
    height: 50,
    zIndex: 60000,
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
