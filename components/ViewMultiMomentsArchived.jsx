import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ScrollView } from 'react-native';
import { useCapsuleList } from '../context/CapsuleListContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import ButtonMomentHelloes from '../components/ButtonMomentHelloes';

const ViewMultiMomentsArchived = ({ 
    archivedMoments, 
    containerText = 'Moments shared', 
    showAllCategories = true,
    singleLineScroll = false,
    reuseButtonOnPress // Prop for the Reuse? button
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All Moments');
  const [categories, setCategories] = useState([]);
  const [categoryItems, setCategoryItems] = useState({});

  const { selectedFriend } = useSelectedFriend();
  const { capsuleList } = useCapsuleList();

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

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.selectedItemsTitle}>
          {containerText} ({archivedMoments.length})
        </Text>
        {reuseButtonOnPress && (
          <TouchableOpacity 
            style={styles.reuseButton} 
            onPress={reuseButtonOnPress}
          >
            <Text style={styles.reuseButtonText}>Reuse?</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.selectionContainer}>
        <Text style={styles.title}>View by category:</Text>
        <FlatList
          data={visibleCategories}
          horizontal={true}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[
                styles.categoryButton,
                selectedCategory === item && styles.selectedCategoryButton,
              ]}
              onPress={() => handleCategoryPress(item)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === item && styles.selectedCategoryButtonText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
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

      <View style={styles.contentContainer}> 
        <View style={styles.selectedItemsContainer}> 
          <ScrollView> 
            {Object.keys(categoryItems).length > 0 ? (
              Object.keys(categoryItems).map((category, index) => (
                <View key={index}>
                  <Text style={styles.categoryGroupTitle}>{category}</Text>
                  {categoryItems[category].map((item, idx) => (
                    <View key={idx} style={styles.itemContainer}> 
                      <ButtonMomentHelloes  
                        moment={item}
                        iconSize={26}
                        size={14}
                        color={'black'}
                        disabled={true}
                        sameStyleForDisabled={true}
                      />
                    </View>
                  ))}
                </View>
              ))
            ) : (
              <Text style={styles.noItemsText}>No items available</Text>
            )}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },
  contentContainer: {
    padding: 0,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 2,
  },
  selectedItemsContainer: {
    marginBottom: 10,
    backgroundColor: 'transparent',
    padding: 10,
    height: 300,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
  },
  selectedItemsTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    marginBottom: 10,
  },
  noItemsText: {
    fontSize: 16,
    color: 'gray',
  },
  selectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    margin: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  selectedCategoryButton: {
    backgroundColor: '#FF7F50', // Match card component's selected styling
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Poppins-Regular',
  },
  selectedCategoryButtonText: {
    color: 'white', // Match card component's selected text color
  },
  viewAllButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 25,
    margin: 10,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  viewAllButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'Poppins-Regular',
  },
  categoryGroupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    marginBottom: 10,
  },
  reuseButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    margin: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  reuseButtonText: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Poppins-Regular',
  },
});

export default ViewMultiMomentsArchived;
