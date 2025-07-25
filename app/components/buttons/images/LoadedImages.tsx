import React from "react";
import { TouchableOpacity, StyleSheet, View, Text } from "react-native";
 
import BobbingAnim from "../../../animations/BobbingAnim";
import FlashAnim from "../../../animations/FlashAnim";
import {
  MaterialCommunityIcons,
  FontAwesome6,
  Ionicons,
} from "@expo/vector-icons";


import useImageFunctions from "@/src/hooks/useImageFunctions";


interface Props {
  height: number;
  iconSize: number;
  itemLabelFontSize: number;
  iconColor: string;
  countColor: string;
  circleColor: string;
  countTextSize: number;
  onPress: () => void;
}

const LoadedImages: React.FC<Props> = ({
  height = 50,
  iconSize = 36,
  itemLabelFontSize = 11,
  iconColor = "black",
  countColor = "white",
  circleColor = "red",
  countTextSize = 12,
  onPress = () => {},
}) => { 
  const { imageList } = useImageFunctions();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, { height: height }]}
    >
      <BobbingAnim bobbingDistance={1} duration={800}>
        <View style={styles.animatedContainer}>
          <View
            style={{
              flex: 1,
              width: "100%",
              height: "100%",

              justifyContent: "center",
            }}
          >
            <FontAwesome6
              name="file-image"
              size={iconSize - 4}
              color={iconColor}
            />

            <View style={{ top: 7, right: 18, position: "absolute" }}>
              <FlashAnim
                circleColor={circleColor}
                circleTextSize={countTextSize}
                countColor={countColor}
              >
                {imageList?.length}
              </FlashAnim>
            </View>
            <View style={{ position: "absolute", bottom: 0, left: -40 }}>
              <Text style={{ color: iconColor, opacity: .9, fontSize: itemLabelFontSize, fontWeight: "bold" }}>
                Pics
              </Text>
            </View>
          </View>
        </View>
      </BobbingAnim>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
  },
  animatedContainer: {
    flexDirection: "column",
    alignItems: "center",
    height: "100%",
    justifyContent: "center",
    width: "100%",
    flex: 1,
  },
  countText: {
    fontFamily: "Poppins-Bold",
  },
});

//export default LoadedImages;
export default React.memo(LoadedImages);
