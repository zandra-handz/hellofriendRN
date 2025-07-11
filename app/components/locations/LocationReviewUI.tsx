import React, { useCallback } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import LoadingPage from "../appwide/spinner/LoadingPage";

import StarsRatingUI from "./StarsRatingUI";

// import { useLocations } from "@/src/context/LocationsContext";

interface Review {
  author_name: string;
  time: number; // Unix timestamp seconds
  rating: number;
  text: string;
}

interface Props {
  review: Review;
  backgroundColor: string;
  textColor: string;
  formatDate?: (timestamp: number) => string;
}

const LocationReviewUI: React.RC<Props> = ({
  review,
  backgroundColor = "white",
  textColor = "black",
  formatDate,
}) => {
  // const { loadingAdditionalDetails } = useLocations();

  //   const formatDate = (timestamp) => {
  //   const date = new Date(timestamp * 1000);
  //   return date.toLocaleDateString();

  // };

 
const formattedDate = formatDate(review.time);

  // if (loadingAdditionalDetails) {
  //   return (
  //     <LoadingPage loading={loadingAdditionalDetails} spinnerType="wander" />
  //   );
  // }

  return (
    <View style={[styles.review, { backgroundColor: backgroundColor }]}>
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
          {formattedDate}
        </Text>
      </View>

      <StarsRatingUI rating={review.rating} />
      <Text style={[styles.reviewText, { color: textColor }]}>
        {review.text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  review: {
    padding: 0,
    borderRadius: 10,
    // width: 240,
    width: "100%",
    height: "auto",
    borderWidth: StyleSheet.hairlineWidth,
  },
  reviewAuthorRatingContainer: {
    flexDirection: "row",
    marginBottom: 0,
    width: "100%",
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

//export default LocationReviewUI;
export default React.memo(LocationReviewUI);
