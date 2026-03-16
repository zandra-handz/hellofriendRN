// MEMOIZED VERSION
// performs better than non-memoized, per DevTools profiling
import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, StyleSheet, Pressable, Text, ScrollView } from "react-native";
import manualGradientColors from "@/app/styles/StaticColors"; 
import AddNewCategory from "../headers/AddNewCategory";
import AppModalFromTop from "../alerts/AppModalFromTop"; 
import useCategories from "@/src/hooks/useCategories";
import OptionContainer from "../headers/OptionContainer";
import BouncyEntrance from "../headers/BouncyEntrance";
import useMomentSortingFunctions from "@/src/hooks/useMomentSortingFunctions";
import CategoryButtonForCreator from "./CategoryButtonForCreator"; 
import ValueSlider from "../friends/ValueSlider";
import { AppFontStyles } from "@/app/styles/AppFonts";

type Props = {
  userId: number;
  freezeCategory: boolean;
  isVisible: boolean;
  categoryNames: string[];
  categoryColorsMap: Record<string, string>;
  onPress: () => void;
  addToOnPress: () => void;
  onSave: () => void;
  onClose: () => void;
  updatingExisting: boolean;
  existingId: number;
  selectedId: number;
};

// index 0 = AddNewCategory, 1 = buttons, 2-9 = sliders
const allDelays = [0, 60, 120, 180, 240, 300, 360, 420, 480, 540];

const CategoryCreator = ({
  userId,
  primaryColor,
  primaryBackground,
  freezeCategory,
  friendDefaultCategory,
  friendLightColor,
  friendDarkColor,
  capsuleList,
  isVisible,

  onPress,
  addToOnPress,
  updatingExisting,
  existingId,

  onClose,
  yTranslateValue,
  scoresObject,
  handleScoreChange,
}: Props) => {
 

  const categoryColorsMap = useMemo(() => {
    // if (!categoryColors || !Array.isArray(categoryColors)) {
      return {};
    // }

    // return Object.fromEntries(
    //   categoryColors.map(({ user_category, color }) => [user_category, color]),
    // );
  }, [ ]);

  const { userCategories } = useCategories({ userId: userId });

  const { categorySizes } = useMomentSortingFunctions({
    listData: capsuleList,
  });

  const [selectedId, setSelectedId] = useState(null);
  const [categoriesSortedList, setCategoriesSortedList] = useState<object[]>([]);
  const [pressedOnce, setPressedOnce] = useState(false);

  const HORIZONTAL_PADDING = 10;

  useFocusEffect(
    useCallback(() => {
      if (!capsuleList || capsuleList?.length < 1) {
        return;
      }

      let categories = categorySizes();

      if (
        !categories ||
        !categories?.sortedList ||
        categories?.sortedList?.length === 0
      ) {
        return;
      }
      setCategoriesSortedList(categories.sortedList);
    }, [capsuleList]),
  );

  const handleOnPress = ({ name: name, id: id }) => {
    if (!name || !id) {
      return;
    }

    onPress({ name: name, id: id });
    if (!freezeCategory) {
      addToOnPress();
    }
    setSelectedId(id);
    onClose();

    if (!pressedOnce) {
      setPressedOnce(true);
    } else {
      setPressedOnce(false);
      onClose();
    }
  };

  const handleSelectCreated = ({
    categoryId,
    categoryName,
  }: {
    categoryId: number;
    categoryName: string;
  }) => {
    console.error("setting category:", categoryId, categoryName);
    setSelectedId(categoryId);
    setPressedOnce(true);
    onClose();
  };

  useEffect(() => {
    if (freezeCategory) {
      return;
    }

    if (
      updatingExisting &&
      existingId &&
      userCategories &&
      userCategories.length > 0
    ) {
      const find = userCategories.findIndex(
        (category) => category.id === existingId,
      );

      setSelectedId(existingId);

      return;
    }

    if (friendDefaultCategory && userCategories && userCategories.length > 0) {
      const friendDefault = friendDefaultCategory;
      const name = userCategories.find(
        (category) => category.id === friendDefault,
      );

      if (name) {
        onPress({ name: name.name, id: name.id });
        setSelectedId(name.id);
        return;
      }
    }

    if (!categoriesSortedList || !(categoriesSortedList.length > 0)) {
      return;
    }

    let largest = categoriesSortedList[0]?.user_category;
    let largestName = categoriesSortedList[0]?.name;

    if (largest && largestName) {
      onPress({ name: largestName, id: largest });
      setSelectedId(largest);
    }
  }, [
    categoriesSortedList,
    friendDefaultCategory,
    userCategories,
    updatingExisting,
    existingId,
  ]);

  const renderedButtons = useMemo(
    () => (
      <View style={styles.buttonRow}>
        {Array.isArray(userCategories) &&
          userCategories.map(({ name, id }) => {
            const categoryColor = categoryColorsMap[id];

            return (
              <View
                key={id ?? name ?? "Uncategorized"}
                style={[styles.buttonWrapper, { marginRight: 10 }]}
              >
                <CategoryButtonForCreator
                  primaryColor={primaryColor}
                  height={"auto"}
                  selectedId={selectedId}
                  label={name}
                  itemId={id}
                  highlightColor={categoryColor}
                  onPress={() => handleOnPress({ name: name, id: id })}
                />
              </View>
            );
          })}
      </View>
    ),
    [
      userCategories,
      friendDefaultCategory,
      categoryColorsMap,
      onPress,
      selectedId,
      freezeCategory,
    ],
  );

  return (
    <AppModalFromTop
      isVisible={isVisible}
      isFullscreen={true}
      questionText="Moment Settings"
      primaryColor={primaryColor}
      backgroundColor={primaryBackground}
      modalIsTransparent={true}
      useCloseButton={true}
      onClose={onClose}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.innerContainer}>
          <View style={styles.categoryNavigatorContainer}>

            <BouncyEntrance delay={allDelays[0]} style={{ width: "100%" }}>
              <View style={styles.sectionContainer}>
                <OptionContainer
                  backgroundColor={primaryBackground}
                  buttonColor={manualGradientColors.lightColor}
                  label="Category"
                  primaryColor={primaryBackground}
                  textStyle={AppFontStyles.subWelcomeText}
                >
                  <AddNewCategory
                    primaryColor={primaryColor}
                    primaryBackground={primaryBackground}
                    userCategories={userCategories}
                    manualGradientColors={manualGradientColors}
                    addToOnPress={handleSelectCreated}
                  />
                </OptionContainer>
              </View>
            </BouncyEntrance>

            {userCategories && categoryColorsMap && (
              <BouncyEntrance delay={allDelays[1]} style={{ width: "100%" }}>
                <View style={styles.sectionContainer}>
                  <OptionContainer
                    backgroundColor={primaryBackground}
                    buttonColor={manualGradientColors.lightColor}
                    label="Select"
                    primaryColor={primaryBackground}
                    textStyle={AppFontStyles.subWelcomeText}
                  >
                    <View
                      showsVerticalScrollIndicator={false}
                      style={styles.scrollContainer}
                    >
                      {renderedButtons}
                    </View>
                  </OptionContainer>
                </View>
              </BouncyEntrance>
            )}

            <View style={styles.capsuleScoresPanel}>

              <BouncyEntrance delay={allDelays[2]} style={{ width: "100%" }}>
                <View style={styles.sectionContainer}>
                  <OptionContainer
                    backgroundColor={primaryBackground}
                    buttonColor={manualGradientColors.lightColor}
                    label="Easy"
                    primaryColor={primaryBackground}
                    textStyle={AppFontStyles.subWelcomeText}
                  >
                    <ValueSlider
                      label="Easy"
                      value={scoresObject.easy_score}
                      onValueChange={(value) => handleScoreChange("easy_score", value)}
                      labelColor={primaryColor}
                      barColor={friendLightColor}
                      pointColor={friendDarkColor}
                      trackColor={"transparent"}
                    />
                  </OptionContainer>
                </View>
              </BouncyEntrance>

              <BouncyEntrance delay={allDelays[3]} style={{ width: "100%" }}>
                <View style={styles.sectionContainer}>
                  <OptionContainer
                    backgroundColor={primaryBackground}
                    buttonColor={manualGradientColors.lightColor}
                    label="Hard"
                    primaryColor={primaryBackground}
                    textStyle={AppFontStyles.subWelcomeText}
                  >
                    <ValueSlider
                      label="Hard"
                      value={scoresObject.hard_score}
                      onValueChange={(value) => handleScoreChange("hard_score", value)}
                      labelColor={primaryColor}
                      barColor={friendLightColor}
                      pointColor={friendDarkColor}
                      trackColor={"transparent"}
                    />
                  </OptionContainer>
                </View>
              </BouncyEntrance>

              <BouncyEntrance delay={allDelays[4]} style={{ width: "100%" }}>
                <View style={styles.sectionContainer}>
                  <OptionContainer
                    backgroundColor={primaryBackground}
                    buttonColor={manualGradientColors.lightColor}
                    label="Quick"
                    primaryColor={primaryBackground}
                    textStyle={AppFontStyles.subWelcomeText}
                  >
                    <ValueSlider
                      label="Quick"
                      value={scoresObject.quick_score}
                      onValueChange={(value) => handleScoreChange("quick_score", value)}
                      labelColor={primaryColor}
                      barColor={friendLightColor}
                      pointColor={friendDarkColor}
                      trackColor={"transparent"}
                    />
                  </OptionContainer>
                </View>
              </BouncyEntrance>

              <BouncyEntrance delay={allDelays[5]} style={{ width: "100%" }}>
                <View style={styles.sectionContainer}>
                  <OptionContainer
                    backgroundColor={primaryBackground}
                    buttonColor={manualGradientColors.lightColor}
                    label="Long"
                    primaryColor={primaryBackground}
                    textStyle={AppFontStyles.subWelcomeText}
                  >
                    <ValueSlider
                      label="Long"
                      value={scoresObject.long_score}
                      onValueChange={(value) => handleScoreChange("long_score", value)}
                      labelColor={primaryColor}
                      barColor={friendLightColor}
                      pointColor={friendDarkColor}
                      trackColor={"transparent"}
                    />
                  </OptionContainer>
                </View>
              </BouncyEntrance>

              <BouncyEntrance delay={allDelays[6]} style={{ width: "100%" }}>
                <View style={styles.sectionContainer}>
                  <OptionContainer
                    backgroundColor={primaryBackground}
                    buttonColor={manualGradientColors.lightColor}
                    label="Relevant"
                    primaryColor={primaryBackground}
                    textStyle={AppFontStyles.subWelcomeText}
                  >
                    <ValueSlider
                      label="Relevant"
                      value={scoresObject.relevant_score}
                      onValueChange={(value) => handleScoreChange("relevant_score", value)}
                      labelColor={primaryColor}
                      barColor={friendLightColor}
                      pointColor={friendDarkColor}
                      trackColor={"transparent"}
                    />
                  </OptionContainer>
                </View>
              </BouncyEntrance>

              <BouncyEntrance delay={allDelays[7]} style={{ width: "100%" }}>
                <View style={styles.sectionContainer}>
                  <OptionContainer
                    backgroundColor={primaryBackground}
                    buttonColor={manualGradientColors.lightColor}
                    label="Random"
                    primaryColor={primaryBackground}
                    textStyle={AppFontStyles.subWelcomeText}
                  >
                    <ValueSlider
                      label="Random"
                      value={scoresObject.random_score}
                      onValueChange={(value) => handleScoreChange("random_score", value)}
                      labelColor={primaryColor}
                      barColor={friendLightColor}
                      pointColor={friendDarkColor}
                      trackColor={"transparent"}
                    />
                  </OptionContainer>
                </View>
              </BouncyEntrance>

              <BouncyEntrance delay={allDelays[8]} style={{ width: "100%" }}>
                <View style={styles.sectionContainer}>
                  <OptionContainer
                    backgroundColor={primaryBackground}
                    buttonColor={manualGradientColors.lightColor}
                    label="Unique"
                    primaryColor={primaryBackground}
                    textStyle={AppFontStyles.subWelcomeText}
                  >
                    <ValueSlider
                      label="Unique"
                      value={scoresObject.unique_score}
                      onValueChange={(value) => handleScoreChange("unique_score", value)}
                      labelColor={primaryColor}
                      barColor={friendLightColor}
                      pointColor={friendDarkColor}
                      trackColor={"transparent"}
                    />
                  </OptionContainer>
                </View>
              </BouncyEntrance>

              <BouncyEntrance delay={allDelays[9]} style={{ width: "100%" }}>
                <View style={styles.sectionContainer}>
                  <OptionContainer
                    backgroundColor={primaryBackground}
                    buttonColor={manualGradientColors.lightColor}
                    label="Generic"
                    primaryColor={primaryBackground}
                    textStyle={AppFontStyles.subWelcomeText}
                  >
                    <ValueSlider
                      label="Generic"
                      value={scoresObject.generic_score}
                      onValueChange={(value) => handleScoreChange("generic_score", value)}
                      labelColor={primaryColor}
                      barColor={friendLightColor}
                      pointColor={friendDarkColor}
                      trackColor={"transparent"}
                    />
                  </OptionContainer>
                </View>
              </BouncyEntrance>

            </View>
          </View>
        </View>
      </ScrollView>
    </AppModalFromTop>
  );
};

const styles = StyleSheet.create({
  categoryLabel: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    paddingVertical: 0,
    paddingHorizontal: 4,
  },
  scrollViewContainer: {
    marginVertical: 6,
    flexDirection: "row",
    width: "100%",
    flexWrap: "wrap",
  },
  innerContainer: {
    width: "100%",
  },
  sectionContainer: {
    marginVertical: 6,
    width: "100%",
  },
  categoryNavigatorContainer: {
    zIndex: 5000,
    height: "auto",
    width: "100%",
    selfAlign: "center",
  },
  capsuleScoresPanel: {
    marginTop: 10,
  },
  scrollContainer: {
    height: "auto",
    flexGrow: 1,
  },
  buttonRow: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  buttonWrapper: {
    flexDirection: "row",
    marginBottom: 10,
  },
});

export default React.memo(CategoryCreator);