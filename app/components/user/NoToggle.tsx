import {
  View,
  Text,
  StyleSheet,
  Pressable,
  DimensionValue,
} from "react-native";
import React from "react"; 

interface Props {
  label: string;
  icon: React.ReactElement;

  onPress: () => void;
}

const NoToggle: React.FC<Props> = ({ primaryColor, label, icon, onPress }) => {
 
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          flexDirection: "row",
          justifyContent: "space-between",
          marginVertical: 6,
          alignItems: "center",
        },
      ]}
    >
      <View style={{ flexDirection: "row" }}>
        {icon && (
          <View
            style={{
              width: 40,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "start",
            }}
          >
            {icon}
          </View>
        )}
        <Text style={[styles.label, {color: primaryColor}]}>{label}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  labelSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    paddingTop: 2,
    marginRight: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
  },
  customButton: {
    marginLeft: 6,
    borderRadius: 15,
    backgroundColor: "#ccc",
    paddingVertical: 4,
    paddingHorizontal: 8,
  },

  altButton: {
    borderRadius: 15,
    paddingVertical: 4,
    alignContent: "center",
    paddingHorizontal: 10,
  },
});

export default NoToggle;
