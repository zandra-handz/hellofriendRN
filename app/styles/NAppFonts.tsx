import { StyleSheet } from 'react-native';

// Use the exact font names from useFonts
// Poppins_400Regular, Poppins_700Bold

export const AppFontStyles = StyleSheet.create({
  signInButtonLabel: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 14,
  },
  homeHeaderText: {
    fontSize: 20,
    fontFamily: 'Poppins_400Regular',
  },
  globalAppHeaderText: {
    fontSize: 18,
    fontFamily: 'Poppins_400Regular',
    textTransform: 'uppercase',
  },
  welcomeText: {
    fontSize: 32,
    lineHeight: 34,
    fontFamily: 'Poppins_400Regular',
  },
  subWelcomeText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Poppins_400Regular',
  },
  homeScreenNewMomentContainer: {
    borderRadius: 30,
    alignSelf: 'center',
    padding: 4,
  },
  homeScreenButtonText: {
    fontSize: 16,
    fontWeight: 'bold', // keeps bold even without specifying Poppins_700Bold
  },
  smallAddButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  settingsHeaderText: {
    fontSize: 24,
    fontFamily: 'Poppins_400Regular',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  friendProfileButtonText: {
    fontSize: 17,
    paddingVertical: 0,
    alignSelf: 'center',
    fontFamily: 'Poppins_700Bold',
    paddingLeft: 0,
  },
  searchBarInputText: {
    flex: 1,
    alignItems: 'center',
    alignContent: 'center',
    fontSize: 13,
    textAlign: 'right',
    overflow: 'hidden',
    paddingHorizontal: 4,
    marginRight: 4,
    height: 50,
    fontFamily: 'Poppins_400Regular',
  },
  searchBarResultListItemText: {
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
  },
});
