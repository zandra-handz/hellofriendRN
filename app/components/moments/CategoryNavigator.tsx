import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useGlobalStyle } from '@/src/context/GlobalStyleContext';
import React from 'react';

const CategoryNavigator = ({categoryNames, onPress}) => {

    const { themeStyles, gradientColors, gradientColorsHome } = useGlobalStyle();
 return (
      <View
        style={[
          styles.categoryContainer,
          { backgroundColor: gradientColorsHome.darkColor },
        ]}
      >
        <Text
          style={[
            themeStyles.genericText,
            { paddingVertical: 4, paddingHorizontal: 4 },
          ]}
        >
          CATEGORIES
        </Text>
        <FlatList
          data={categoryNames}
          horizontal={false}
          snapToInterval={44}
          ListFooterComponent={() => <View style={{ height: 0 }} />}
          keyExtractor={(categoryName) =>
            categoryName ? categoryName.toString() : "Uncategorized"
          }
          renderItem={({ item: categoryName }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                { backgroundColor: gradientColors.darkColor },
              ]}
              onPress={() => {
                onPress(categoryName);
              }}
            >
              <Text
                numberOfLines={1}
                style={[
                  styles.categoryText,
                  { color: gradientColorsHome.darkColor },
                ]}
              >
                {categoryName}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
};
const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    zIndex: 1,
  },
  categoryContainer: {
    position: "absolute",
    bottom: 20, //20
    left: 4,
    zIndex: 5,
    borderRadius: 20,
    height: "auto",
    maxHeight: "20%",
    width: "40%",
    padding: 20,
  },
  categoryButton: {
    borderBottomWidth: 0.8,
    borderBottomColor: "transparent",
    backgroundColor: "#000002",
    alignText: "left",
    alignContent: "center",
    justifyContent: "center",
    paddingHorizontal: "8%",
    paddingVertical: "6%",
    borderRadius: 16,
    marginBottom: "3%",
    height: "auto",
  },
  categoryText: {
    fontWeight: "bold",
    fontSize: 13,
    textTransform: "uppercase",
  },
  lizardTransform: {
    position: "absolute",
    zIndex: 0,
    bottom: -100,
    left: -90,
    transform: [
      { rotate: "60deg" },
      // Flip horizontally (mirror image)
    ],
    opacity: 0.8,
  },
  cardContainer: {
    height: "auto",
    alignItems: "center",
   // marginTop: 10,
 
  },
  selectFriendContainer: {
    width: "100%",
    justifyContent: "flex-end",
    flexDirection: "row",
    minHeight: 30,
    maxHeight: 30,
    height: 30,
    paddingHorizontal: "4%",
  },
});


export default CategoryNavigator