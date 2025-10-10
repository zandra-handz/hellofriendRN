import { View, Text, StyleSheet, DimensionValue } from "react-native";
import React from "react";
import { Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  item: object;
  height: DimensionValue;
  padding?: number;
  marginTop: number; // might become a divider in future
  onPress: (item: object) => void;
  textColor: string;
  backgroundColor: string;
  friendColor: string; //dark
};

const LocationListItem = ({
  item,
  height,
  padding,
  marginTop,
  onPress,
  textColor,
  backgroundColor,
  friendColor,
}: Props) => {
  const ICON_SIZE = 15;
  const containerFlattenedStyle = [
    styles.container,
    {
      height: height,
      padding: padding,
      marginTop: marginTop,
      backgroundColor: backgroundColor,
    },
  ];

  const titleStyle = React.useMemo(
    () => [styles.title, { color: textColor }],
    [textColor]
  );
  const addressStyle = React.useMemo(
    () => [styles.address, { color: textColor }],
    [textColor]
  );

  return (
    <Pressable style={containerFlattenedStyle} onPress={() => onPress(item)}>
      <View style={styles.labelContainer}>
        <Text numberOfLines={1} style={titleStyle}>
          {item.title}
        </Text>
        <Text numberOfLines={1} style={addressStyle}>
          {item.address}
        </Text>
      </View>

      <View style={styles.iconsContainer}>
        {item.isPastHello && (
          <View style={{}}>
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                {item.helloCount}
              </Text>
            </View>
            <MaterialCommunityIcons
              name="hand-wave-outline"
              //  name="heart"
              size={ICON_SIZE}
              color={friendColor}
              opacity={0.6}
            />
          </View>
        )}

        {item.isFave && (
          <MaterialCommunityIcons
            // name="map-marker-star"
            name="heart"
            size={ICON_SIZE}
            color={friendColor}
            style={{ marginLeft: 10 }}
          />
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  labelContainer: {
    flexDirection: "column",
    alignText: "left",
    // backgroundColor: 'orange',
    width: "100%",
    flexShrink: 1,
  },
  iconsContainer: {
    flexDirection: "row",
    // backgroundColor: 'teal',
    paddingLeft: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 12,
  },
  address: {
    fontSize: 12,
    opacity: .7,
  }
});

export default LocationListItem;
