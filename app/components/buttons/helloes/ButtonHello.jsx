import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import IconDynamicHelloType from "../../helloes/IconDynamicHelloType";

const ButtonHello = ({
  hello,
  height = "auto",
  onPress,
  color = "white", 
  icon: Icon,
  iconSize = 34,
}) => {
  const { themeStyles } = useGlobalStyle();

  const handlePress = async () => {
    await onPress();
  };

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.container,
          themeStyles.genericTextBackgroundShadeTwo,
          { height: height },
        ]}
        onPress={handlePress}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            textAlign: "center",
            width: "100%",
            height: "auto",
            flex: 1,
            marginBottom: "3%",
          }}
        >
          <View style={styles.svgContainer}>
            <IconDynamicHelloType
              selectedChoice={hello.type}
              svgWidth={24}
              svgHeight={24}
              svgColor={color}
            />
          </View>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, themeStyles.subHeaderText]}>
              {hello.type}
            </Text>
          </View>
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.optionTitleText, { color: color }]}>
            {hello.date}
          </Text>
          <Text style={[styles.optionText, { color: color }]}>
            {hello.locationName}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "auto",
    borderRadius: 10,
    alignSelf: "center",
    padding: 20,
    overflow: "hidden",
  },
  optionTitleText: {
    fontSize: 12,
    color: "white",
    fontFamily: "Poppins-Bold",
  },
  optionText: {
    fontSize: 12,
    color: "white",
    fontFamily: "Poppins-Regular",
  },
  iconContainer: {
    marginRight: 10,
    width: "12%",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  title: {
    fontSize: 15,
    lineHeight: 21,
    textTransform: "lowercase",
  },
  svgContainer: {
    flexDirection: "row",

    width: "9%",
  },
  titleContainer: {
    width: "70%",

    flex: 1,
    flexGrow: 1,
  },
  text: {
    marginLeft: "4%",
    fontSize: 15,
    lineHeight: 21,
  },
});

export default ButtonHello;
