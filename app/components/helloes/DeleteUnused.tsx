import { View, Text, StyleSheet, Pressable } from "react-native";
import React, {  useCallback } from "react";
 import { MaterialCommunityIcons } from "@expo/vector-icons"; 
type Props = {
  primaryColor: string;
  selected: any;
  onChange: (index: number) => void;
};
 

const DeleteUnused = ({
  primaryColor,
  checkboxState,
  toggleCheckbox,
}: Props) => {
 
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
                      name={checkboxState ? "checkbox-outline" : "checkbox-blank-outlne"}
                      size={20}
                      style={[  { color: primaryColor, marginRight: 10 }]}
                
                    />
          <Text
            style={{
              color: primaryColor,
            }}
          >
            Delete unused?
          </Text>
        </Pressable>
      );
    },
    [checkboxState, toggleCheckbox, primaryColor] // dependencies go here
  );
  return (
    <>
      <Pressable
        onPress={() => toggleCheckbox()}
        style={[styles.container ]}
      >
        {renderButtonStyle()}
      </Pressable>

  
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
export default DeleteUnused;
