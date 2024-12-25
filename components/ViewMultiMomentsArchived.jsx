import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import ButtonMomentHelloes from '../components/ButtonMomentHelloes';
import ButtonColorBGSmall from '../components/ButtonColorBGSmall';

const ViewMultiMomentsArchived = ({ 
    archivedMoments, 
    containerText = 'Moments shared', 
    showAllCategories = true, 
    reuseButtonOnPress  
}) => {

  const [selectedCategory, setSelectedCategory] = useState('All Moments');
  const [categories, setCategories] = useState([]);
  const [categoryItems, setCategoryItems] = useState({});
  const { themeStyles } = useGlobalStyle();
  const { selectedFriend, calculatedThemeColors } = useSelectedFriend(); 

  useEffect(() => {
    if (selectedFriend) { 
      setCategories([...new Set(archivedMoments.map(moment => moment.typed_category))]);
    }
  }, [selectedFriend, archivedMoments]);

  useEffect(() => {
    if (selectedCategory === 'All Moments') {
      const groupedMoments = archivedMoments.reduce((groups, moment) => {
        const category = moment.typed_category;
        if (!groups[category]) {
          groups[category] = [];
        }
        groups[category].push(moment);
        return groups;
      }, {});
      setCategoryItems(groupedMoments);
    } else if (selectedCategory) {
      const items = archivedMoments.filter(moment => moment.typed_category === selectedCategory);
      setCategoryItems({ [selectedCategory]: items });
    } else {
      setCategoryItems({});
    }
  }, [selectedCategory, archivedMoments]);

  useEffect(() => {
    handleViewAllMoments(); // Automatically select "All Moments" on mount
  }, []);

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
  };

  const handleViewAllMoments = () => {
    setSelectedCategory('All Moments');
    
  };

  const visibleCategories = showAllCategories ? categories : categories.slice(0, 5);

  const renderMomentItem = ({ item }) => (
    <View style={styles.itemContainer}> 
      <ButtonMomentHelloes  
        includeDate={false}
        moment={item}
        iconSize={26}
        size={14} 
        disabled={true}
        sameStyleForDisabled={true}
      />
    </View>
  );

  const renderCategoryGroup = ({ item }) => (
    <View>
      <Text style={[styles.categoryGroupTitle, themeStyles.subHeaderText]}>{item}</Text>
      <FlatList
        data={categoryItems[item]}
        renderItem={renderMomentItem}
        keyExtractor={(momentItem, idx) => `${item}-${idx}`}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={[styles.selectedItemsTitle, themeStyles.subHeaderText]}>
          {containerText} ({archivedMoments.length})
        </Text>
      </View>

      <View style={[styles.selectionContainer, {backgroundColor: calculatedThemeColors.lightColor}]}>
        <Text style={[styles.title, themeStyles.genericText]}>View: </Text>
       
        <FlatList
          data={visibleCategories}
          horizontal={true}
          renderItem={({ item }) => ( 
            <View style={{paddingRight: 6}}>
              <ButtonColorBGSmall 
                onPress={() => handleCategoryPress(item)}
                useLightColor={selectedCategory === item}
                title={item}
                textStyle={[
                  styles.categoryButtonText,
                  selectedCategory === item && styles.selectedCategoryButtonText,
                ]}
              />  
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
        />
        <TouchableOpacity 
          style={styles.viewAllButton} 
          onPress={handleViewAllMoments}
        >
          <Text style={styles.viewAllButtonText}>All</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.contentContainer, themeStyles.genericTextBackground, {borderColor: calculatedThemeColors.lightColor}]}> 
        <FlatList
          data={Object.keys(categoryItems)}
          renderItem={renderCategoryGroup}
          keyExtractor={(item, index) => item.toString()}
          ListEmptyComponent={<Text style={styles.noItemsText}>No moments</Text>}
        />
      </View>
      <View style={{width: '100%', height: 'auto', flexDirection: 'row', justifyContent: 'flex-end'}}>
        {reuseButtonOnPress && (
            <TouchableOpacity 
              style={[styles.reuseButton, {backgroundColor: calculatedThemeColors.lightColor}]} 
              onPress={reuseButtonOnPress}
            >
              <Text style={styles.reuseButtonText}>Reuse?</Text>
            </TouchableOpacity>
          )}
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',  
    justifyContent: 'space-between',  
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center', 
    height: 'auto',
  },
  contentContainer: {  
    paddingVertical: 10,
    paddingHorizontal: 8, 
    height: 290,
    borderWidth: .4, 
    borderRadius: 20,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold', 
    paddingLeft: 8,
    paddingRight: 6,
  },
  selectedItemsContainer: { 
    paddingVertical: 10,
    height: 300,
    borderWidth: 1, 
    borderRadius: 20,
  },
  selectedItemsTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold', 
  },
  noItemsText: {
    fontSize: 16,
    color: 'gray',
  },
  selectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6, 
    borderRadius: 20,
  },  
  categoryButtonText: {
    fontSize: 13,
    color: 'white',
    fontFamily: 'Poppins-Regular',
  },
  selectedCategoryButtonText: {
    color: 'white',
    fontFamily: 'Poppins-Bold',
  },
  viewAllButton: {
    backgroundColor: 'darkgray',
    paddingVertical: 2,
    paddingHorizontal: 15,
    borderRadius: 25, 
  },
  viewAllButtonText: {
    fontSize: 14, 
    color: 'white',
    fontFamily: 'Poppins-Bold',
  },
  categoryGroupTitle: {
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  itemContainer: {
    marginBottom: 10,
  },
  reuseButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 2,
    paddingHorizontal: 12,
    borderRadius: 20, 
    textAlign: 'center',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',   

  },
  reuseButtonText: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Poppins-Regular',
  },
});

export default ViewMultiMomentsArchived;
 