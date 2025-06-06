import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";  
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";

const ImageCard = ({
  image,
  index,
  height = "auto",
  imageWidth,
  imageHeight,
  borderRadius = 20,
  onPress, 
  icon: Icon, 
}) => {
  const { themeStyles } = useGlobalStyle();

  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  const handlePress = async () => {
    await onPress(image, index);
  };

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.container,
          themeStyles.genericTextBackgroundShadeTwo,
          { height: height },
        ]}
        onPress={handlePress}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            textAlign: "center",
            width: "100%",
            height: "auto",
            flex: 1,
            marginBottom: "3%",
          }}
        >
          <View style={styles.imageContainer}>
            <Image
              placeholder={{ blurhash }}
              style={[
                styles.image,
                {
                  borderRadius: borderRadius,
                  width: imageWidth,
                  height: imageHeight,
                },
              ]}
              source={{ uri: image.image }}
              contentFit="cover"
              cachePolicy="none" //memory-disk, none is for testing
            />
          </View> 
          <View style={styles.textContainer}>
          <Text style={[styles.titleText, themeStyles.genericText]}>
            {image.title}
          </Text>
          <Text style={[styles.categoryText, themeStyles.genericText]}>{image.image_category}</Text>
        </View>
        </View>

      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    //flex: 1,
    height: "auto",
    borderRadius: 30,
    alignSelf: "center",
    padding: 20,
    overflow: "hidden",

    //backgroundColor: 'red',
  },
  titleText: {
    fontSize: 14, 
    fontFamily: "Poppins-Regular",
  },
  categoryText: {
    fontSize: 14, 
    fontFamily: "Poppins-Regular",
    textTransform: 'uppercase',
  },
  iconContainer: {
    marginRight: 10,
    width: "12%",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1, 
    width: '100%',
    height: '100%',
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  title: {
    fontSize: 15,
    lineHeight: 21,
    textTransform: "lowercase",
  },
  imageContainer: {
    flexDirection: "row",
 
  },
  titleContainer: {
    width: "70%",

    flex: 1,
    flexGrow: 1,
  },
  text: {
    marginLeft: "4%",
    fontSize: 15,
    lineHeight: 21,
  },
  image: {
    borderRadius: 10,
    marginRight: 10,
  },
});

export default ImageCard;
