import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

export const AppFontStyles = StyleSheet.create({
 
  signInButtonLabel: {
    fontFamily: "Poppins-Bold",
    fontSize: 14,
  },
  homeHeaderText: {
    fontSize: 20,
    fontFamily: "Poppins-Regular",
  },
  globalAppHeaderText: {
    fontSize: 18,
    fontFamily: "Poppins-Regular",
    textTransform: "uppercase",
  },
  welcomeText: {
    fontSize: 32,
    lineHeight: 34,
    //fontWeight: 'bold',
    fontFamily: "Poppins-Regular",
  },
  subWelcomeText: {
    fontSize: 14,
    lineHeight: 20,
    //fontWeight: 'bold',
    fontFamily: "Poppins-Regular",
  },
  homeScreenNewMomentContainer: {
    borderRadius: 30,
    alignSelf: "center",
    padding: 4,
  },
  homeScreenButtonText: {
    fontSize: 16,
    // fontFamily: "Poppins-Bold",
    fontWeight: "bold",
    // textTransform: "uppercase",
  },
  smallAddButtonText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  settingsHeaderText: {
    fontSize: 24,
    fontFamily: "Poppins-Regular",
    textTransform: "uppercase",
    textAlign: "center",
  },
  friendProfileButtonText: {
    fontSize: 17,
    paddingVertical: 0,
    alignSelf: "center",
    fontFamily: "Poppins-Bold",
    paddingLeft: 0,
  }, 
  searchBarInputText: {
    flex: 1,
    alignItems: "center",
    alignContent: "center",
    fontSize: 13,
    textAlign: "right",
    overflow: "hidden",
    paddingHorizontal: 4,
    marginRight: 4,
    height: 50,
    fontFamily: "Poppins-Regular",
  },
  searchBarResultListItemText: {
    fontSize: 15,
  }, 
});


// export default AppFontStyles;