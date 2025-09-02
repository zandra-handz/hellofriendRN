import { Text, StyleSheet, Pressable } from "react-native";
import React, { useCallback } from "react";
 
import { MaterialCommunityIcons } from "@expo/vector-icons"; 
type Props = {
  primaryColor: string;
  selected: any;
  onChange: (index: number) => void;
};
 

const IdeasAdded = ({
  primaryColor,
  selected, 
  onPress,
}: Props) => {
 
  const renderButtonStyle = useCallback(
    () => {
      return (
        <Pressable
          onPress={onPress}
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
            name={"leaf"}
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
    [selected, onPress, primaryColor] // dependencies go here
  );
  return (
    <>
      <Pressable
        onPress={onPress}
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

    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {},
});
export default IdeasAdded;
