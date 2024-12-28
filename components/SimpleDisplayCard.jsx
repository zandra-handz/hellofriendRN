import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
 
import { useGlobalStyle } from "../context/GlobalStyleContext"; 

const SimpleDisplayCard = ({ title = "CATEGORY:  ", value, backgroundColor='transparent' }) => {
  const { themeStyles } = useGlobalStyle();

  return (
    <View style={[styles.container, {backgroundColor: backgroundColor}]}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          height: "auto",
        }}
      >
        <Text style={[styles.title, themeStyles.genericText]}>{title}</Text>
        
      </View>
      <View
        style={{
          width: "100%",
          flex: 1, 
        }}
      >
        <Text
          style={[
            styles.text,
            themeStyles.genericText,
            {backgroundColor: backgroundColor}
          ]}
        >
          {value}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    borderRadius: 30,
    //margin: "4%",
    alignSelf: "center",
    padding: 20,
  },
  title: {
    fontSize: 15,
    lineHeight: 21,
    textTransform: "uppercase",
  },
  button: {
    borderRadius: 30,
    alignSelf: "center",
    padding: 0,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  flexButton: {
    flex: 1,
  },
  text: {
    textAlignVertical: "top",
    borderRadius: 20,
    paddingVertical: 10,
    flex: 1,
  },
  dateText: {
    fontSize: 15,
    width: "100%",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",

    //fontFamily: 'Poppins-Regular',
  },
});

export default SimpleDisplayCard;
