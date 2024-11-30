import React, { useState, forwardRef, useRef, useEffect, useImperativeHandle } from 'react';
import { View, TouchableOpacity, StyleSheet, TextInput, ScrollView, FlatList, Text, TouchableWithoutFeedback, Keyboard } from 'react-native';
import ListCheckSvg from '../assets/svgs/list-check.svg';
import { useGlobalStyle } from '../context/GlobalStyleContext';

const SearchBarSavedLocations = forwardRef(({ locationListDrilledTwice, onPress, mountingText = 'default', triggerAnimation, onTextChange, searchStringRef }, ref) => {
  
  const { themeStyles, manualGradientColors } = useGlobalStyle();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]); 
  const textInputRef = useRef();

  // Trigger animation when component mounts
  useEffect(() => { 

    if (textInputRef.current) {
      textInputRef.current.setNativeProps({ text: mountingText });
      setSearchQuery(mountingText);
    }
  }, []);

  useImperativeHandle(ref, () => ({
    setText: (text) => {
      if (textInputRef.current) {
        textInputRef.current.setNativeProps({ text });
        setSearchQuery(text); // Update the state as well
      }
    },
    clearText: () => {
      if (textInputRef.current) {
        textInputRef.current.clear();
        setSearchQuery(''); // Reset the state
      }
    },
  }));
 

  const handleSearch = (text) => {
    setSearchQuery(text);
    onTextChange(text);

    const filtered = Array.isArray(locationListDrilledTwice) ? locationListDrilledTwice.filter((item) => {
      const searchText = text.toLowerCase();
      return ['address', 'title'].some((key) => {
        const itemValue = item[key];
        return typeof itemValue === 'string' && itemValue.toLowerCase().includes(searchText);
      });
    }) : [];

    setFilteredData(filtered);
  };

  const handleItemPress = (item) => {
    onPress(item);
    handleOutsidePress();
    setSearchQuery(''); // Reset search query after item is selected
  };

  const handleOutsidePress = () => {
    Keyboard.dismiss();
    setFilteredData([]);
  };

  return ( 
    <>
        <TouchableWithoutFeedback onPress={handleOutsidePress}>
          <View style={[styles.inputContainer, themeStyles.genericTextBackground]}>
            <TextInput
              ref={textInputRef}
              autoFocus={mountingText.length > 0 ? true : false}
              style={[styles.searchInput, themeStyles.genericText]}
              placeholder={'Search saved locations'}
              placeholderTextColor={themeStyles.genericText.color}
              value={searchQuery} // Controlled input
              onChangeText={handleSearch}
            />
            <ListCheckSvg width={26} height={26} color={manualGradientColors.lightColor} style={styles.icon} />
          </View>
        </TouchableWithoutFeedback>

        {searchQuery.length > 0 && ( 
          <View style={[styles.dropdownContainer, themeStyles.genericTextBackground]}>
            <FlatList
              data={filteredData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleItemPress(item)} style={[styles.itemContainer, themeStyles.genericTextBackground]}>
                  <Text style={[styles.itemText, themeStyles.genericText]}>
                    {['address', 'title'].map((key) => item[key]).join(' - ')}
                  </Text>
                </TouchableOpacity>
              )}
              style={styles.dropdownList}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled
            />
          </View>
           
        )}
        </>
  );
});

const styles = StyleSheet.create({
  //moved to parent because the animation wrapper goes under this
  //container: {   
    //flexDirection: 'row',
    //justifyContent: 'flex-start',
    //width: '86%',  
    //zIndex: 2200,
    //elevation: 2200,
  //},
  smallCircleButton: {
    position: 'absolute',
    width: '100%',  
    height: 48,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: '2%',
    justifyContent: 'center',
    width: '100%',
    borderRadius: 30,
    height: 48,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    textAlign: 'left',
    paddingHorizontal: '2%',
    height: 48,
  },
  icon: {
    marginRight: '3%',
  },
  dropdownContainer: {
    position: 'absolute',
    top: 54,
    left: 0,
    backgroundColor: '#fff',
    maxHeight: 300,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    width: '114%',  
    zIndex: 2100,
    elevation: 2100,
  },
  dropdownList: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    zIndex: 1000,
  },
  itemContainer: {
    paddingVertical: 10,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f9f9f9',
    borderRadius: 0,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
});

export default SearchBarSavedLocations;
