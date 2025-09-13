import React, { useCallback } from "react";
import { View, StyleSheet, FlatList} from "react-native";
import LocationReviewUI from "./LocationReviewUI"; 
import { FlashList } from "@shopify/flash-list";

interface Props {
  reviews: object[];
  formatDate?: (timestamp: number) => string;
}

const LocationCustomerReviews: React.FC<Props> = ({
  primaryColor,
  primaryBackground,
  reviews,
  formatDate,
}) => { 

  if (!reviews || reviews.length === 0) {
    return null;
  }

  const extractItemKey = (item, index) =>
    item?.id ? item.id.toString() : `review-${index}`;

  // const getItemLayout = (item, index) => {
  //   return {
  //     length: 400,
  //     offset: 400 * index,
  //     index,
  //   };
  // };

  const renderListItem = useCallback(
    ({ item, index }) => (
      <View style={{ width: "100%", height: "auto", marginBottom: 20 }}>
        <LocationReviewUI
          // locationReviewId={`${locationId}-${index}`}
          formatDate={formatDate}
          review={item}
          reviewIndex={index}
          backgroundColor={primaryBackground}
          textColor={primaryColor}
        />
      </View>
    ),
    [primaryColor, primaryBackground]
  );

  return (
    <View style={[styles.container]}>
      <FlashList   
      data={reviews}
        renderItem={renderListItem}
        fadingEdgeLength={20}
        estimatedItemSize={150}
        nestedScrollEnabled
        // pagingEnabled
        snapToAlignment="start"
        //contentContainerStyle={}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
        keyExtractor={extractItemKey}
        //getItemLayout={getItemLayout}
        ListFooterComponent={() => <View style={{ height: 80 }} />}
      />

      {/* <ScrollView horizontal nestedScrollEnabled snapToAlignment='start' pagingEnabled contentContainerStyle={[styles.reviewsContainer]} >
          {reviews.map((review, index) => (
            <View key={index} style={styles.reviewCard}>
              <LocationCustomerReviewCard review={review} backgroundColor={themeStyles.genericTextBackground.backgroundColor} textColor={themeStyles.genericText.color} />
            </View>
          ))}
          <View style={{width: 400}}></View>
        </ScrollView>  */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 160,
    paddingHorizontal: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 15,
    lineHeight: 21,
    textTransform: "uppercase",
  },
  listContent: {
    alignItems: "flex-start",
  },
  toggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#007BFF",
    borderRadius: 8,
  },
  toggleButtonText: {
    color: "#fff",
    fontFamily: "Poppins-Regular",
  },
});

export default LocationCustomerReviews;
