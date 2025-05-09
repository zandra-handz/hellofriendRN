//
// <Text style={[styles.ratingText, { fontSize: fontSize, color: 'white' }]}>
// {rating}
// </Text>
import React from "react";
import { View, StyleSheet } from "react-native"; 
import StarFullSvg from "@/app/assets/svgs/star-full.svg"; 
import StarHalfSvg from "@/app/assets/svgs/star-half.svg";

const StylingRating = ({
  rating, 
  starSize = 16,
  starColor = "white", 
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
