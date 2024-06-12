import React from 'react';
import { StyleSheet } from 'react-native';

const OptionsGoogleSearch = ({ GooglePlacesAutocompleteComponent, inputStyle, ...props }) => {
  return (
    <GooglePlacesAutocompleteComponent
      {...props}
      fetchDetails={true}
      query={{
        key: 'YOUR_API_KEY',
        language: 'en',
      }}
      styles={{
        container: styles.container,
        textInputContainer: [styles.textInputContainer, inputStyle],
        textInput: styles.textInput,
        predefinedPlacesDescription: styles.predefinedPlacesDescription,
        poweredContainer: styles.poweredContainer,
        listView: styles.listView,
        row: styles.row,
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInputContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0)',
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  textInput: {
    marginLeft: 0,
    marginRight: 0,
    height: 38,
    color: '#5d5d5d',
    fontSize: 16,
  },
  predefinedPlacesDescription: {
    color: '#1faadb',
  },
  poweredContainer: {
    display: 'none',
  },
  listView: {
    backgroundColor: 'white',
    marginLeft: 15,
    marginRight: 15,
    marginTop: -15,
    borderRadius: 5,
    elevation: 3,
  },
  row: {
    padding: 10,
    height: 44,
  },
});

export default OptionsGoogleSearch;
