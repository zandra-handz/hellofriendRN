//
// <Text style={[styles.ratingText, { fontSize: fontSize, color: 'white' }]}>
// {rating}
// </Text>
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import StarFullSvg from "../assets/svgs/star-full.svg";
import StarOutlineSvg from "../assets/svgs/star-outline.svg";
import StarHalfSvg from "../assets/svgs/star-half.svg";

const StylingRating = ({
  rating,
  icon = "star",
  iconHalf = "star-half",
  starSize = 16,
  starColor = "white",
  noStarColor = "red",
  fontSize = 14,
}) => {
  return (
    <View style={styles.ratingContainer}>
      {Array.from({ length: Math.floor(rating) }, (_, index) => (
        <StarFullSvg
          width={starSize}
          height={starSize}
          color={starColor}
          style={{ marginLeft: "2%" }}
        />
      ))}
      {rating % 1 !== 0 && (
        <StarHalfSvg width={starSize} height={starSize} color={starColor} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    marginLeft: 4,
  },
});

export default StylingRating;
