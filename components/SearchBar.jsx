import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Import the icon
import { useGlobalStyle } from '../context/GlobalStyleContext';

const SearchBar = ({ data, onPress, searchKeys }) => {  // Updated to accept `searchKeys`
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const { themeStyles } = useGlobalStyle();

  const handleSearch = (text) => {
    setSearchQuery(text);
  
    const filtered = data.filter((item) => {
      const searchText = text.toLowerCase();
  
      return searchKeys.some((key) => {
        const itemValue = item[key];
        
        if (typeof itemValue === 'string') {
          return itemValue.toLowerCase().includes(searchText);
        }
  
        return false;   
      });
    });
  
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
      <View style={styles.container}> 
        <View style={[styles.inputContainer, themeStyles.genericTextBackground]}>
          <TextInput
            style={[styles.searchInput, themeStyles.genericText]}
            placeholder="Search..."
            value={searchQuery}
            onChangeText={handleSearch}
            onBlur={handleBlur}  // Clear when the user moves away from the input
          />
          <Icon name="search" size={20} color={themeStyles.genericText.color} style={styles.icon} />  
        </View>
    
        {searchQuery.length > 0 && (
          <View style={styles.dropdownContainer}>
            <FlatList
              data={filteredData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => onPress(item)} style={styles.itemContainer}>
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
};

const styles = StyleSheet.create({
  container: { 
    position: 'relative',
    width: '100%',
    zIndex: 0,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 30,
    backgroundColor: '#444',
  },
  searchInput: {
    height: 40,
    flex: 1, 
    fontFamily: 'Poppins-Regular',
    paddingHorizontal: 8, 
  },
  icon: {
    paddingHorizontal: 10,
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
    zIndex: 3,
  },
  dropdownList: {
    paddingHorizontal: 10,
    borderRadius: 20,
    zIndex: 3,
  },
  itemContainer: {
    paddingVertical: 10,
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

export default SearchBar;
