import { View, Text, DimensionValue } from "react-native";
import React from "react";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import { useFriendList } from "@/src/context/FriendListContext";
import { useNavigation } from "@react-navigation/native";

import BelowHeaderContainer from "../scaffolding/BelowHeaderContainer";
import SlideToAdd from "../foranimations/SlideToAdd";

interface MomentViewPageProps {
  item: object;
  index: number;
  width: DimensionValue;
  height: DimensionValue;
}

const MomentViewPage: React.FC<MomentViewPageProps> = ({
  item,
  index,
  width,
  height,
}) => {
  const { themeStyles } = useGlobalStyle();
  const { updateCapsule } = useCapsuleList();
  const { themeAheadOfLoading } = useFriendList();
  const navigation = useNavigation();

  const handleEditMoment = () => {
    navigation.navigate("MomentFocus", {
      momentText: item?.capsule || null,
      updateExistingMoment: true,
      existingMomentObject: item || null,
    });
  };

    const saveToHello = async () => {
    try {
      updateCapsule(item.id, true);
    } catch (error) {
      console.error("Error during pre-save:", error);
    }
  };


  return (
    <View
      style={{
        gap: 20,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
        padding: 4,
        borderWidth: 0,
        //   height: ITEM_HEIGHT,
        width: width,
      }}
    >
      <View
        style={{
          backgroundColor: themeStyles.primaryBackground.backgroundColor,
          padding: 10,
          borderRadius: 10,
          width: "100%",
          height: "100%",
          zIndex: 1,
          overflow: 'hidden',
        }}
      >
              <BelowHeaderContainer
                height={30}
                alignItems="center"
                marginBottom={0} //default is currently set to 2
                justifyContent="center"
                children={
                  <SlideToAdd
                    onPress={saveToHello}
                    sliderText={"Add to hello"}
                    sliderTextSize={15}
                    sliderTextColor={themeStyles.primaryText.color}
                    // sliderTextColor={themeAheadOfLoading.fontColor}
                  />
                }
              />
        <Text style={themeStyles.primaryText}> {item.typedCategory}</Text>
        <Text style={themeStyles.primaryText}> {item.capsule}</Text>
      </View>
    </View>
  );
};

export default MomentViewPage;
