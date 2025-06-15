import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import LoadingPage from "../appwide/spinner/LoadingPage";
 

import StylingRating from "./StylingRating";

import { useLocations } from "@/src/context/LocationsContext";
 
const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);  
  return date.toLocaleDateString();  
};

const LocationCustomerReviewCard = ({
  review,
  backgroundColor = "white",
  textColor = "black",
}) => {
  const { loadingAdditionalDetails } = useLocations();

  return (
    <View style={[styles.review, { backgroundColor: backgroundColor }]}>
      {loadingAdditionalDetails && (
        <LoadingPage loading={loadingAdditionalDetails} spinnerType="wander" />
      )}
      {!loadingAdditionalDetails && (
        <ScrollView nestedScrollEnabled>
          <View
            style={[
              styles.reviewAuthorRatingContainer,
              { backgroundColor: backgroundColor },
            ]}
          >
            <Text style={[styles.reviewAuthor, { color: textColor }]}>
              {review.author_name}
            </Text>
                      <Text style={[styles.reviewDate, { color: textColor }]}>
            {formatDate(review.time)}
          </Text>

          </View>

                      <StylingRating
              rating={review.rating}
              starSize={11}
              fontSize={13}
              starColor="orange"
            />
          <Text style={[styles.reviewText, { color: textColor }]}>
            {review.text}
          </Text>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  review: {
    padding: 10,
    borderRadius: 10,
    width: 240,
    height: "100%",
    borderWidth: StyleSheet.hairlineWidth, 
  },
  reviewAuthorRatingContainer: {
    flexDirection: "row",
    marginBottom: 0,
    justifyContent: "space-between",
  },
  reviewAuthor: {
    //fontFamily: 'Poppins-Bold',
    fontSize: 14,
    fontWeight: "bold",
  },
  reviewDate: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10,
    //fontFamily: 'Poppins-Regular',
  },
  reviewText: {
    fontSize: 12,
    lineHeight: 19,
    //fontFamily: 'Poppins-Regular',
  },
});

export default LocationCustomerReviewCard;
