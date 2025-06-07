import { View, Text, DimensionValue } from "react-native";
import React from "react";
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
  const { updateCapsule,     deleteMomentRQuery,
    deleteMomentMutation } = useCapsuleList();
    const { selectedFriend } = useSelectedFriend();
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
                              <EditPencilOutlineSvg
                                height={20}
                                width={20}
                                onPress={handleEditMoment}
                                color={themeStyles.genericText.color}
                              />
                <SlideToDeleteHeader
                  itemToDelete={item}
                  onPress={handleDelete}
                  sliderWidth={"100%"}
                  targetIcon={TrashOutlineSvg}
                  sliderTextColor={themeStyles.primaryText.color}
                />
      </View>
    </View>
  );
};

export default MomentViewPage;
