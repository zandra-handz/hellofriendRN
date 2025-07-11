import React, { useState, forwardRef, useRef, useEffect, useImperativeHandle } from 'react';
import { View, TouchableOpacity, StyleSheet, TextInput, FlatList, Text, TouchableWithoutFeedback, Keyboard } from 'react-native';
import ListCheckSvg from '@/app/assets/svgs/list-check.svg';
import { useGlobalStyle } from '@/src/context/GlobalStyleContext'; 

const SearchBarSavedLocations = forwardRef(({ locationListDrilledTwice, onPress, mountingText = 'default', triggerAnimation, onTextChange, searchStringRef }, ref) => {
  
  const { themeStyles, manualGradientColors } = useGlobalStyle();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]); 
  const textInputRef = useRef();
  const [ showFullList, setShowFullList ] = useState(true);


const INPUT_CONTAINER_BORDER_RADIUS = 10;
 
  useEffect(() => { 
    if (textInputRef.current) {
      textInputRef.current.setNativeProps({ text: mountingText });
      setSearchQuery(mountingText); 
    }
  }, []);


  useEffect(() => {
    if (locationListDrilledTwice && !mountingText) {
      
      populateFullList();
    }
  }, [locationListDrilledTwice]);

  useImperativeHandle(ref, () => ({
    setText: (text) => {
      if (textInputRef.current) {
        textInputRef.current.setNativeProps({ text });
        setSearchQuery(text);  
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
  

    if (text) {
      setShowFullList(false);
    

    //console.log('setting filtered list', filtered);
    setFilteredData(filtered);
  } else {
    console.log('setting full list of locations'); 
    populateFullList(); 
  }

  };
 

  const populateFullList = () => {
    const fullList = Array.isArray(locationListDrilledTwice)
    ? locationListDrilledTwice.map((item) => ({
        address: item.address,
        title: item.title,
      }))
    : [];

    setShowFullList(true);

    setFilteredData(fullList);



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
      <TouchableWithoutFeedback  onPress={handleOutsidePress}>
        <View style={[styles.inputContainer, themeStyles.genericTextBackground, { borderRadius: INPUT_CONTAINER_BORDER_RADIUS, borderColor: themeStyles.primaryText.color}]}>
         
         
          <TextInput
            ref={textInputRef}
            autoFocus={mountingText.length > 0 ? true : false}
            style={[styles.searchInput, themeStyles.genericText]}
            placeholder={'Search'}
            placeholderTextColor={themeStyles.genericText.color}
            value={searchQuery} 
            onChangeText={handleSearch}
          />
          <ListCheckSvg width={28} height={28} color={manualGradientColors.lightColor} style={styles.icon} />
        </View>
      </TouchableWithoutFeedback>

      {(searchQuery.length > 0 && filteredData.length > 0 || (filteredData.length > 0 && showFullList)) && (  
 
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
              nestedScrollEnabled={true}
            />
          </View> 
      )}
    </>
  );
});

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center', 
    justifyContent: 'center',
    width: '100%', 
    height: 48,
    backgroundColor: "transparent",
    paddingLeft: "4%", 
    paddingVertical: '3%',
    borderWidth: StyleSheet.hairlineWidth
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    textAlign: 'left',
    paddingRight: 2,
    height: 48,
  },
  icon: {
    marginRight: '3%',
  },
  dropdownContainer: {
    position: 'absolute',
    top: 54,
    left: 0, 
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
