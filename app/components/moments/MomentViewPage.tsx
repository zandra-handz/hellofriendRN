import { View, Text, DimensionValue, ScrollView } from "react-native";
import React, { useState } from "react";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import { useFriendList } from "@/src/context/FriendListContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useNavigation } from "@react-navigation/native";
import SlideToDeleteHeader from "../foranimations/SlideToDeleteHeader";
import BelowHeaderContainer from "../scaffolding/BelowHeaderContainer";
import SlideToAdd from "../foranimations/SlideToAdd";
import TrashOutlineSvg from "@/app/assets/svgs/trash-outline.svg";
import EditPencilOutlineSvg from "@/app/assets/svgs/edit-pencil-outline.svg";

import Animated, {
  SharedValue,
  useAnimatedStyle,
  runOnJS,
  useAnimatedReaction,
} from "react-native-reanimated";

interface MomentViewPageProps {
  item: object;
  index: number;
  width: DimensionValue;
  height: DimensionValue;
  currentIndexValue: SharedValue;
  cardScaleValue: SharedValue;
  openModal: () => void;
  closeModal: () => void;
}

const MomentViewPage: React.FC<MomentViewPageProps> = ({
  item,
  index,
  width,
  height,
  currentIndexValue,
  cardScaleValue,
}) => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyle();
  const { updateCapsule, deleteMomentRQuery, deleteMomentMutation } =
    useCapsuleList();
  const { selectedFriend } = useSelectedFriend();
  const { themeAheadOfLoading } = useFriendList();
  const navigation = useNavigation();

  const [currentIndex, setCurrentIndex] = useState();

  useAnimatedReaction(
    () => currentIndexValue.value,
    (newIndex, prevIndex) => {
      if (newIndex !== prevIndex) {
        runOnJS(setCurrentIndex)(newIndex);
      }
    },
    []
  );

  const cardScaleAnimation = useAnimatedStyle(() => ({
    transform: [{ scale: cardScaleValue.value }],
  }));

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

  const handleDelete = (item) => {
    // console.log("handle delete moment in navigator triggered: ", item);
    try {
      const momentData = {
        friend: selectedFriend.id,
        id: item.id,
      };

      deleteMomentRQuery(momentData);
    } catch (error) {
      console.error("Error deleting moment:", error);
    }
  };

  return (
    <Animated.View
      style={[
        cardScaleAnimation,
        {
          gap: 20,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "transparent",
          padding: 4,
          borderWidth: 0, 
          width: width,
        },
      ]}
    >
      <View
        style={[appContainerStyles.talkingPointCard, {
          backgroundColor: themeStyles.primaryBackground.backgroundColor,
      
        }]}
      >
        <BelowHeaderContainer
          height={30}
          alignItems="center"
          marginBottom={0} //default is currently set to 2
          justifyContent="center"
          children={
            <>
              <SlideToAdd
                onPress={saveToHello}
                sliderText={"Add to hello"}
                sliderTextSize={15}
                sliderTextColor={themeStyles.primaryText.color}
                // sliderTextColor={themeAheadOfLoading.fontColor}
              />
              <EditPencilOutlineSvg
                height={20}
                width={20}
                onPress={handleEditMoment}
                color={themeStyles.genericText.color}
                style={{ position: "absolute", right: 0 }}
              />
            </>
          }
        />
        <View style={{ height: "90%", width: "100%" }}>
          <ScrollView nestedScrollEnabled style={{ flex: 1 }}>
            <Text
              style={[themeStyles.primaryText, appFontStyles.welcomeText, {}]}
            >
              {" "}
              # {item.typedCategory}
            </Text>
            <Text
              style={[
                themeStyles.primaryText,
                appFontStyles.welcomeText,
                { fontSize: 22 },
              ]}
            >
              {" "}
              {item.capsule}
            </Text>
            <SlideToDeleteHeader
              itemToDelete={item}
              onPress={handleDelete}
              sliderWidth={"100%"}
              targetIcon={TrashOutlineSvg}
              sliderTextColor={themeStyles.primaryText.color}
            />
          </ScrollView>
        </View>

        {/* <SlideToDeleteHeader
          itemToDelete={item}
          onPress={handleDelete}
          sliderWidth={"100%"}
          targetIcon={TrashOutlineSvg}
          sliderTextColor={themeStyles.primaryText.color}
        /> */}
      </View>
    </Animated.View>
  );
};

export default MomentViewPage;
