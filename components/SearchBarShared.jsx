import React, { useState, forwardRef } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Import the icon
import { useGlobalStyle } from '../context/GlobalStyleContext';

const SearchBarShared = forwardRef(({
  data, 
  searchQueryRef, 
  useCustomIcon = false, 
  customIcon: CustomIcon, 
  placeholderText = 'Search moments', 
  borderColor = '#ccc', 
  onPress, 
  searchKeys = [] // Default to empty array if not provided
}, ref) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]); 
  const { themeStyles } = useGlobalStyle();

  const handleItemPress = (item) => {
    console.log(item);
    onPress(item);  
    handleOutsidePress();
    setSearchQuery('');
  };

  const handleSearch = (text) => {
    setSearchQuery(text);

    // Ensure data is an array before filtering
    const filtered = Array.isArray(data) ? data.filter((item) => {
      const searchText = text.toLowerCase();

      return searchKeys.some((key) => {
        const itemValue = item[key];

        if (typeof itemValue === 'string') {
          return itemValue.toLowerCase().includes(searchText);
        }

        return false;   
      });
    }) : [];  // Return an empty array if data is not valid

    setFilteredData(filtered);
  };

  const handleBlur = () => {
    // Clear search query when input loses focus
    setSearchQuery('');
    setFilteredData([]); // Optionally clear the filtered results
  };

  const handleOutsidePress = () => { 
    // Close the keyboard if the user taps outside
    Keyboard.dismiss();
    handleBlur(); // Also clear the search bar
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View style={[styles.container, { height: '100%' }]}> 
        <View style={[styles.inputContainer, themeStyles.genericTextBackground, { borderColor: borderColor }]}>
          <TextInput
            ref={ref || searchQueryRef}  // Forwarded ref here
            style={[styles.searchInput, themeStyles.genericText]}
            placeholder={placeholderText}
            placeholderTextColor={themeStyles.genericText.color}
            value={searchQueryRef}
            onChangeText={handleSearch}
            onBlur={handleBlur}  // Clear when the user moves away from the input
          />
          <View>
            {!useCustomIcon ? (
              <Icon name="search" size={30} color={themeStyles.genericText.color} style={styles.icon} />  
            ) : (
              CustomIcon || <Text>No icon provided</Text>  // Fallback if CustomIcon is undefined
            )}
          </View>
        </View>
    
        {searchQuery.length > 0 && (
          <View style={styles.dropdownContainer}>
            <FlatList
              data={filteredData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleItemPress(item)} style={styles.itemContainer}>
                  <Text style={styles.itemText}>
                    {searchKeys.map((key) => item[key]).join(' - ')} {/* Display all matching fields */}
                  </Text>
                </TouchableOpacity>
              )}
              style={styles.dropdownList}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled // Enable nested scroll for the FlatList
            />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
});

const styles = StyleSheet.create({
  container: {  
    width: '100%',  
    flex: 1, 
    zIndex: 2, 
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center', 
    alignContent: 'center',
    height: '100%',  
    borderRadius: 30,
    height: 48,  
  },
  searchInput: { 
    flex: 1, 
    alignItems: 'center',
    alignContent: 'center', 
    fontSize: 15,
    textAlign: 'left',
    overflow: 'hidden',
    paddingHorizontal: '2%', 
    height: 48, 
  },
  icon: {
    paddingHorizontal: 10, 
    overflow: 'hidden',
  },
  dropdownContainer: {
    position: 'absolute',
    top: 50,
    right: 0, 
    backgroundColor: '#fff',
    maxHeight: 300,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    width: '100%',
    zIndex: 1000,
    elevation: 1000,
  },
  dropdownList: {
    paddingHorizontal: 10,
    borderRadius: 20,
    zIndex: 1000,
  },
  itemContainer: {
    paddingVertical: 0,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f9f9f9',
    borderRadius: 26,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
});

export default SearchBarShared;
