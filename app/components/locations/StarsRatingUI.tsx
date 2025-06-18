//
// <Text style={[styles.ratingText, { fontSize: fontSize, color: 'white' }]}>
// {rating}
// </Text>
import React, { useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface Props {
  rating: number; 
}

const StarsRatingUI: React.FC<Props> = ({ rating  }) => {
  const starSize = 11;
  const starColor = "yellow";

  const renderStars = useCallback(() => {
    const floored = Array.from({ length: Math.floor(rating) });
    return (
      <>
        {floored.map((_, index) => (
          <MaterialCommunityIcons
            key={`${index}`}
            name="star"
            size={starSize}
            color={"cyan"}
            style={{ marginLeft: 2 }}
          />
        ))}
      </>
    );
  }, [rating]);

  // const ratingArray = Array.from( length: Math.floor(rating));
  return (
    <View style={styles.ratingContainer}>
      {renderStars()}
      {/* {Array.from({ length: Math.floor(rating) }, (_, index) => (
        <MaterialCommunityIcons
      //  key={new Date.now()}
          name="star"
          size={starSize}
          color={starColor}
          style={{ marginLeft: 2 }}
        />
      ))} */}
      {rating % 1 !== 0 && (
        <MaterialCommunityIcons
          name="star-half"
          size={starSize}
          color={starColor}
          style={{ marginLeft: 2 }}
        />
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

// export default StarsRatingUI;
export default React.memo(StarsRatingUI);
