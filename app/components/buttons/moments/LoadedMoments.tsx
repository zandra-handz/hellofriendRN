import React from "react";
import { TouchableOpacity, StyleSheet, View, Text } from "react-native";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import BobbingAnim from "../../../animations/BobbingAnim";
import FlashAnim from "../../../animations/FlashAnim";
import { MaterialIcons } from "@expo/vector-icons";


interface LoadedMomentsProps {
  height: number;
  iconSize: number;
  itemLabelFontSize: number;
  iconColor: string;
  countColor: string;
  circleColor: string;
  countTextSize: number;
  onPress: () => void;


}

const LoadedMoments: React.FC<LoadedMomentsProps> = ({
  height = 50,
  iconSize = 36,
  itemLabelFontSize = 11,
  iconColor = "black",
  countColor = "white",
  circleColor = "red",
  countTextSize = 12,
  onPress = () => {},
}) => {
  const { capsuleCount } = useCapsuleList(); 

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, { height: height }]}
    >
      <BobbingAnim bobbingDistance={2} duration={800}>
        <View style={styles.animatedContainer}>
          <View
            style={{ 
              flex: 1,
              width: "100%",
              justifyContent: "center",
            }}
          > 

            <MaterialIcons
              name="tips-and-updates"
              size={iconSize}
              color={iconColor}
            />

            <View style={{ top: 7, right: 18, position: "absolute" }}>
              <FlashAnim
                circleColor={circleColor}
                circleTextSize={countTextSize}
                countColor={countColor}
              >
                {capsuleCount}
              </FlashAnim>
            </View>
            <View style={{ position: "absolute", bottom: 0, left: -40 }}>
              <Text style={{ color: iconColor, opacity: .9, fontSize: itemLabelFontSize, fontWeight: "bold" }}>
                Talking points
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
    justifyContent: "center", 
    width: "100%",
    flex: 1,
  },
  countText: {
    fontFamily: "Poppins-Bold",
  },
});

//export default LoadedMoments;
export default React.memo(LoadedMoments);
