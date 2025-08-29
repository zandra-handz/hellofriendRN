import { View, Text, DimensionValue, ScrollView } from "react-native";
import React, { useState } from "react"; 
import { useNavigation } from "@react-navigation/native";
import SlideToDeleteHeader from "../foranimations/SlideToDeleteHeader";
import useDeleteMoment from "@/src/hooks/CapsuleCalls/useDeleteMoment";
import usePreAddMoment from "@/src/hooks/CapsuleCalls/usePreAddMoment";
 
 
import { MaterialCommunityIcons} from "@expo/vector-icons";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  runOnJS,
  useAnimatedReaction,
} from "react-native-reanimated";

interface Props {
  item: object;
  index: number;
  width: DimensionValue;
  height: DimensionValue;
  marginBottom: number;
  categoryColorsMap: object;
  currentIndexValue: SharedValue;
  cardScaleValue: SharedValue;
 
  marginKeepAboveFooter: number;
}

const MomentViewPage: React.FC<Props> = ({
  userId,
  friendId,
  textColor,
  darkerOverlayColor,
  lighterOverlayColor,
  welcomeTextStyle,
  item,
  index,
  width,
  height,
  marginBottom,
  categoryColorsMap,
  currentIndexValue,
  cardScaleValue,
}) => { 
 

  const { handlePreAddMoment } = usePreAddMoment({
    userId: userId,
    friendId: friendId,
  });
  const { handleDeleteMoment, deleteMomentMutation } = useDeleteMoment({
    userId: userId,
    friendId: friendId,
  });
  const navigation = useNavigation();

  const [currentIndex, setCurrentIndex] = useState();

  if (!item || !categoryColorsMap || !item.user_category) {
    return null; // or a fallback component
  }

  const categoryColor = item?.user_category
    ? (categoryColorsMap[String(item.user_category)] ?? "#ccc")
    : "#ccc";

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

  const renderTrashIcon = () => {
    return <MaterialCommunityIcons
    name={'delete'}
    size={20}
    color={textColor}/>
  }

  const handleEditMoment = () => {
    navigation.navigate("MomentFocus", {
      momentText: item?.capsule || null,
      updateExistingMoment: true,
      existingMomentObject: item || null,
    });
  };

  const saveToHello = async () => {
    if (!friendId || !item?.id) {
      return;
    }
    try {
      handlePreAddMoment({
        friendId: friendId,
        capsuleId: item.id,
        isPreAdded: true,
      });
    } catch (error) {
      console.error("Error during pre-save:", error);
    }
  };

  const handleDelete = (item) => {
    // console.log("handle delete moment in navigator triggered: ", item);
    try {
      const momentData = {
        friend: friendId,
        id: item.id,
      };

      handleDeleteMoment(momentData);
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
        style={[
          {
            width: "100%",
            height: "100%",
          },
        ]}
      >
        <View
          style={[
            {
              padding: 20,
              borderRadius: 40,
              flexDirection: "column",
              justifyContent: "flex-start",
              flex: 1,
              marginBottom: marginBottom,
              zIndex: 1,
              overflow: "hidden",
              backgroundColor:
                darkerOverlayColor,
            },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              //  height: 30,
              height: "auto",
              flexGrow: 1,
              flexWrap: "wrap",
              alignItems: "top",
              paddingTop: 6, // WEIRD EYEBALLIN
              justifyContent: "space-between",
              //  flex: 1,
              width: "100%",
            }}
          >
            <MaterialCommunityIcons
              name={"leaf"}
              onPress={saveToHello}
              size={60}
              style={{ position: "absolute", top: 0, right: 0 }}
              color={categoryColor}
            />
            <MaterialCommunityIcons
              onPress={saveToHello}
              name={"progress-upload"}
              size={28}
              style={{ position: "absolute", top: 16, right: 20 }}
              color={textColor}
            />

            <Text
              style={[
               
                welcomeTextStyle,
                {
                  color: textColor,
                  fontSize: 24,
                  paddingRight: 80,
                },
              ]}
            >
              {" "}
              {item.user_category_name}
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <MaterialCommunityIcons
              name={"pencil-outline"}
              onPress={handleEditMoment}
              size={20}
              color={lighterOverlayColor}
              color={categoryColor}
            />
          </View>
          <View style={{ height: "90%", width: "100%" }}>
            <ScrollView nestedScrollEnabled style={{ flex: 1 }}>
              <Text
                style={[ 
                welcomeTextStyle,
                  {color: textColor, fontSize: 15, lineHeight: 24 },
                ]}
              >
                {" "}
                {item.capsule}
              </Text>
              <View style={{ flexDirection: "row", height: 40 }}>
                <SlideToDeleteHeader
                  itemToDelete={item}
                  onPress={handleDelete}
                  sliderWidth={"100%"}
                  targetIcon={renderTrashIcon}
                  sliderTextColor={textColor}
                />
              </View>
            </ScrollView>
          </View>
        </View>
        {/* <SlideToDeleteHeader
          itemToDelete={item}
          onPress={handleDelete}
          sliderWidth={"100%"}
          targetIcon={TrashOutlineSvg}
          sliderTextColor={textColor}
        /> */}
      </View>
    </Animated.View>
  );
};

export default MomentViewPage;
