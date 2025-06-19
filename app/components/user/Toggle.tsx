import { View, Text, StyleSheet, DimensionValue } from "react-native";
import React from "react";
import ToggleButton from "../appwide/button/ToggleButton";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

interface Props {
  label: string;
  icon: React.ReactElement; 
  value: boolean;
  onPress: () => void;
}

const Toggle: React.FC<Props> = ({ label, icon, value, onPress }) => {
  const { themeStyles } = useGlobalStyle();
  return (
    <View style={{ flexDirection: "row", justifyContent: 'space-between', marginVertical: 6, alignItems: 'center' }}>
     <View style={{flexDirection: 'row'}}>
        
      {icon && <View style={{width: 40, alignItems: 'center', flexDirection: 'row', justifyContent: 'start'}}>
        {icon}
         </View>}
      <Text style={[styles.label, themeStyles.modalText]}>{label}</Text>
      
     </View>
      <ToggleButton value={value} onToggle={onPress} />
    </View>
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
    fontWeight: 'bold',
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

export default Toggle;
