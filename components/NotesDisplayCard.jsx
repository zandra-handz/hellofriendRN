import React, { useState } from "react";
import { View, StyleSheet, Text, Dimensions, ScrollView } from "react-native";

import { useGlobalStyle } from "../context/GlobalStyleContext"; 



import NotesOutlineSvg from "../assets/svgs/notes-outline.svg"; 


const NotesDisplayCard = ({
  notesData,
  title = "NOTES",
  height = "auto",
  onPress,
}) => {
  const { themeStyles } = useGlobalStyle();
  return (
    <View
      style={[
        styles.container,
        themeStyles.genericTextBackgroundShadeTwo,
        { height: height },
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          height: "auto",
        }}
      >
        <Text style={[styles.title, themeStyles.subHeaderText]}>{title}</Text>
          <NotesOutlineSvg
            height={30}
            width={30} 
            onPress={onPress? onPress : null}
            color={themeStyles.genericText.color}
          />
      </View>
      {notesData && (
        <ScrollView
          style={{ flex: 1, width: "100%", padding: "6%" }}
          contentContainerStyle={{ paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.notesText, themeStyles.genericText]}>
            {notesData}
          </Text>
        </ScrollView>

      )} 

    </View>
  );
};

const styles = StyleSheet.create({
  container: {

    width: "100%",
    height: "60%",
    borderRadius: 30,
    padding: 20,
    textAlign: "top",
    justifyContent: "flex-start",
  }, 
  title: {
    fontSize: 15,
    lineHeight: 21,
    textTransform: "uppercase",
  },

  notesText: {
    fontSize: 15,
    lineHeight: 21,
  },
});

export default NotesDisplayCard;
