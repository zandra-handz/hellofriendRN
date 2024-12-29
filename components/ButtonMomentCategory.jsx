import React, { useState } from "react";
import { View, StyleSheet } from "react-native";

import { useFriendList } from "../context/FriendListContext";

import ButtonBottomActionBase from "../components/ButtonBottomActionBase";

import ThoughtBubbleOutlineSvg from "../assets/svgs/thought-bubble-outline.svg";  

const ButtonMomentCategory = ({ onPress, categoryText, momentCount }) => {
  const { themeAheadOfLoading } = useFriendList();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const closeModal = () => setIsModalVisible(false);

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <ButtonBottomActionBase
          onPress={onPress}
          preLabel={momentCount}
          preLabelFontSize={18}
          preLabelColor="white"
          label={categoryText}
          height={40}
          radius={20}
          fontMargin={3}
          labelFontSize={15}
          labelContainerMarginHorizontal={6}
          showGradient={true}
          lightColor={themeAheadOfLoading.lightColor}
          darkColor={themeAheadOfLoading.darkColor}
          showShape={true}
          shapePosition="right"
          shapeSource={ThoughtBubbleOutlineSvg}
          shapeWidth={60}
          shapeHeight={60}
          shapePositionValue={-4}
          shapePositionValueVertical={-11}
          shapeLabel={momentCount}
          shapeLabelColor="white"
          shapeLabelFontSize={20}
          shapeLabelPositionRight="96%"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  buttonContainer: {
    height: 40,
    alignItems: "center",
    width: 100,
  },
});

export default ButtonMomentCategory;
