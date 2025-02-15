import { GoogleAutoComplete } from 'react-native-google-autocomplete';

function MyComponent() {
  return (
    <GoogleAutoComplete apiKey="YOUR API KEY" debounce={300}>
      {({ inputValue, handleTextChange, locationResults, fetchDetails }) => (
        <React.Fragment>
          <TextInput
            style={{
              height: 40,
              width: 300,
              borderWidth: 1,
              paddingHorizontal: 16,
            }}
            value={inputValue}
            onChangeText={handleTextChange}
            placeholder="Location..."
          />
          <ScrollView style={{ maxHeight: 300 }}>
            {locationResults.map((el, i) => (
              <LocationItem
                {...el}
                fetchDetails={fetchDetails}
                key={String(i)}
              />
            ))}
          </ScrollView>
        </React.Fragment>
      )}
    </GoogleAutoComplete>
  );
}

export default GoogleAutoComplete;