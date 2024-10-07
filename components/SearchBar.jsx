import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';

const SearchBar = ({ data, searchKey }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const handleSearch = (text) => {
    setSearchQuery(text);

    
    const filtered = data.filter((item) => {
      const itemText = item[searchKey].toLowerCase();
      const searchText = text.toLowerCase();
      return itemText.includes(searchText);
    });

    setFilteredData(filtered);
  };

  return (
    <View style={styles.container}> 
      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
 
      {searchQuery.length > 0 && (
        <View style={styles.dropdownContainer}>
          <FlatList
            data={filteredData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.itemContainer}>
                <Text style={styles.itemText}>{item[searchKey]}</Text>
              </TouchableOpacity>
            )}
            // Limit the height of dropdown
            style={styles.dropdownList}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 2, // Ensure the search bar and dropdown are over other components
    position: 'relative',
    width: '40%', // Adjust this as needed
  
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 2,
    paddingHorizontal: 8,
    borderRadius: 30,
    color: 'white',
    backgroundColor: '#444',
  },
  dropdownContainer: {
    position: 'absolute',
    top: 50, // Positioning the dropdown just below the input field
    right: 0,
    left: 0,
    backgroundColor: '#fff',
    zIndex: 3,
    maxHeight: 200, // Limit the height of the dropdown
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  dropdownList: {
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  itemContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1, 
    borderBottomColor: '#eee',
    backgroundColor: '#f9f9f9',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
});

export default SearchBar;
