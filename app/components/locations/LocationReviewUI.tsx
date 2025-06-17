import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import LoadingPage from "../appwide/spinner/LoadingPage";

import StarsRatingUI from "./StarsRatingUI";

import { useLocations } from "@/src/context/LocationsContext";

const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString();

};


interface Props {
  review: object[];
  backgroundColor: string;
  textColor: string;
}

const LocationReviewUI: React.RC<Props> = ({
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
        <>
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

          <StarsRatingUI rating={review.rating} />
          <Text style={[styles.reviewText, { color: textColor }]}>
            {review.text}
          </Text>
        </>
      )}
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
    width: '100%',
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

export default LocationReviewUI;
