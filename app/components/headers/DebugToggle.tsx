import { View, Text, StyleSheet } from "react-native";
import React, { useCallback} from "react";
import ToggleButton from "../appwide/button/ToggleButton";
import SvgIcon from "@/app/styles/SvgIcons";
type Props = {
  value: boolean;
  textColor: string;
  backgroundColor: string;
  onToggle: () => void;
  top?: number;
  left?: number;
};

const DebugToggle = ({
  value,
  textColor = "oragne",
  backgroundColor = "hotpink",
  onToggle,
  top = 20,
  left = 20
}: Props) => {



  // const label = useCallback(() => {
  //   if (value) {
  //     return `Staging`
  //   } else {
  //     return `Prod`
  //   }

  // }, [value]);

  return (
    <View style={[styles.devModeTogContainer, {top: top, left: left}]}>
      <ToggleButton
        value={value}
        onToggle={onToggle}
        textColor={textColor}
        backgroundColor={backgroundColor}
      />

      <Text style={{color: textColor, paddingLeft: 10}}>

        {value ? `Staging` : `Prod`}

      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {

  },
  devModeTogContainer: {
    paddingHorizontal: 10,
    width: 'auto',
    height: 50,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100000,
    elevation: 10000,
    flexDirection: 'row',
    // backgroundColor: 'red',
    // borderWidth: 1,
    // borderColor: 'orange',
    borderRadius: 999,
  },
});

export default DebugToggle;
